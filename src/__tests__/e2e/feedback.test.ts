import request from "supertest";
import { createApp } from "../../app";
import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcrypt";


const app = createApp();
const prisma = new PrismaClient();


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


beforeAll(async () => {
  const user = await prisma.user.findUnique({where: {email: testUser.email}});
  if (!user) {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        name: testUser.name
      }
    });
  }
});

afterAll(async () => {
  await prisma.comment.deleteMany({});
  await prisma.feedbackVote.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.$disconnect();
});


describe("Feedback E2E", () => {
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

    const token = loginRes.body?.data?.result?.token;

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

  it("should list all feedbacks", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes?.body?.data?.result?.token;

    const res = await request(app)
      .get("/api/feedback/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.feedbacks).toBeDefined();
  });


  it("should get a feedback by ID", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes?.body?.data?.result?.token;

    const user = await prisma.user.findUnique({where: {email: testUser.email}, include: {feedbacks: true}});
    const feedbackId = user!.feedbacks[0].id;

    const res = await request(app)
      .get(`/api/feedback/${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
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
            authorId: user!.id
          })
        }
      })
    );
  });

  it("should upvote a feedback", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes?.body?.data?.result?.token;

    const user = await prisma.user.findUnique({where: {email: testUser.email}, include: {feedbacks: true}});
    const feedbackId = user!.feedbacks[0].id;

    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});