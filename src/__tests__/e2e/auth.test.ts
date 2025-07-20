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


    it("should throw BadRequestError if missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({email: "test@test.com", name: "tester"});

      expect(res.status).toBe(400);
    });
  });
});