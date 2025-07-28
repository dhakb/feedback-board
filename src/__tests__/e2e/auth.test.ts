import bcrypt from "bcrypt";
import request from "supertest";
import { createApp } from "../../app";
import { clearDB } from "../utils/db";
import { TEST_USER } from "../utils/mocks";
import { PrismaClient } from "../../../generated/prisma";


const app = createApp();
const prisma = new PrismaClient();


beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await clearDB();

  await prisma.$disconnect();
});

describe("Auth E2E", () => {

  let token: string;

  describe("Register User ", () => {
    it("POST /auth/register", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(TEST_USER);

      expect(res.status).toBe(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: "success",
          data: {
            user: expect.objectContaining({
              id: expect.any(String),
              name: TEST_USER.name,
              email: TEST_USER.email,
              role: "USER"
            })
          }
        })
      );
    });


    it("should throw fail if missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({email: "test@test.com", name: "tester"});

      expect(res.status).toBe(400);
    });

    it("should throw if email is already taken", async () => {
      await prisma.user.create({
        data: {
          email: TEST_USER.email,
          password: TEST_USER.password,
          name: TEST_USER.name
        }
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send(TEST_USER);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty("status", "fail");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

      await prisma.user.create({
        data: {
          email: TEST_USER.email,
          password: hashedPassword,
          name: TEST_USER.name
        }
      });
    });

    it("should login the user and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({email: TEST_USER.email, password: TEST_USER.password});

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "success",
          data: {
            result: {
              user: expect.objectContaining({
                id: expect.any(String),
                name: TEST_USER.name,
                email: TEST_USER.email,
                role: "USER"
              }),
              token: expect.any(String)
            }
          }
        })
      );
    });

    it("should fail with wrong email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({email: "doesnotexist@test.com", password: TEST_USER.password});

      expect(res.status).toBe(401);
    });

    it("should fail with wrong password", async () => {

      const res = await request(app)
        .post("/api/auth/login")
        .send({email: TEST_USER.email, password: "wrongpassword"});

      expect(res.status).toBe(401);
    });
  });
});