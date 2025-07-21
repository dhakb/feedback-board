import bcrypt from "bcrypt";
import request from "supertest";
import { createApp } from "../../app";
import { PrismaClient } from "../../../generated/prisma";


const app = createApp();
const prisma = new PrismaClient();


beforeAll(async () => {
  //: run migrations, seed test db
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.comment.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.feedbackVote.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("Auth E2E", () => {
  const testUser = {
    name: "E2E User",
    email: "e2e@test.com",
    password: "password123"
  };

  let token: string;

  describe("Register User ", () => {
    it("POST /auth/register", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: "success",
          data: {
            user: expect.objectContaining({
              id: expect.any(String),
              name: testUser.name,
              email: testUser.email,
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
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty("status", "fail");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);

      await prisma.user.create({
        data: {
          email: testUser.email,
          password: hashedPassword,
          name: testUser.name
        }
      });
    });

    it("should login the user and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({email: testUser.email, password: testUser.password});

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "success",
          data: {
            result: {
              user: expect.objectContaining({
                id: expect.any(String),
                name: testUser.name,
                email: testUser.email,
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
        .send({email: "doesnotexist@test.com", password: testUser.password});

      expect(res.status).toBe(401);
    });

    it("should fail with wrong password", async () => {

      const res = await request(app)
        .post("/api/auth/login")
        .send({email: testUser.email, password: "wrongpassword"});

      expect(res.status).toBe(401);
    });
  });
});