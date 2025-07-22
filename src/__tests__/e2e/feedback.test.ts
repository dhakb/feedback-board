import request from "supertest";
import { createApp } from "../../app";
import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcrypt";


const app = createApp();
const prisma = new PrismaClient();


afterAll(async () => {
  await prisma.$disconnect();
});

const testUser = {
  name: "E2E User",
  email: "e2e@test.com",
  password: "password123"
};

const testFeedback = {
  id: "feedback-1",
  title: "Dark mode",
  description: "Add dark mode support",
  category: "UI",
  status: "OPEN",
  upvotes: 0,
  authorId: "user-1",
  createdAt: new Date()
};

beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.feedbackVote.deleteMany();
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.comment.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.feedbackVote.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("Feedback E2E", () => {
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

  it("should create a feedback", async () => {
    const author = await prisma.user.findUnique({where: {email: testUser.email}});

    const input = {
      title: testFeedback.title,
      description: testFeedback.description,
      category: testFeedback.category,
      authorId: author!.id
    };

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes.body.data.result.token;

    const res = await request(app)
      .post("/api/feedback/")
      .set("Authorization", `Bearer ${token}`)
      .send(input);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          feedback: expect.objectContaining({
            id: expect.any(String),
            title: testFeedback.title,
            description: testFeedback.description,
            category: testFeedback.category,
            status: testFeedback.status,
            authorId: author!.id
          })
        }
      })
    );
  });
});