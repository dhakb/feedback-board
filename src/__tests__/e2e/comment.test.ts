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


describe("Comment E2E", () => {
  it("should create a comment", async () => {
    const author = await prisma.user.findUnique({where: {email: testUser.email}});
    const feedBackInput = {
      title: testFeedback.title,
      description: testFeedback.description,
      category: testFeedback.category,
      authorId: author!.id
    };

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes.body?.data?.result?.token;

    const feedbackRes = await request(app)
      .post("/api/feedback/")
      .set("Authorization", `Bearer ${token}`)
      .send(feedBackInput);

    const feedbackId = feedbackRes.body.data.feedback.id;

    const commentInput = {
      authorId: author!.id,
      feedbackId: feedbackId,
      content: "test comment"
    };

    const res = await request(app)
      .post("/api/comment/")
      .set("Authorization", `Bearer ${token}`)
      .send(commentInput);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          comment: expect.objectContaining({
            id: expect.any(String),
            content: commentInput.content
          })
        }
      })
    );
  });

  it("should return all comments by feedbackId", async () => {
    const author = await prisma.user.findUnique({where: {email: testUser.email}, include: {feedbacks: true}});
    const feedbackId = author!.feedbacks[0].id

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: testUser.email, password: testUser.password});

    const token = loginRes.body?.data?.result?.token;

    const res = await request(app)
      .get(`/api/comment/:${feedbackId}`)
      .set("Authorization", `Bearer ${token}`)

    console.log(res.body)
    expect(res.status).toBe(200)
  });
});