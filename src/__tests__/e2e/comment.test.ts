import bcrypt from "bcrypt";
import request from "supertest";
import { createApp } from "../../app";
import { clearDB } from "../utils/db";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "../utils/mocks";


const app = createApp();
const prisma = new PrismaClient();


beforeAll(async () => {
  await clearDB();

  const user = await prisma.user.findUnique({where: {email: TEST_USER.email}});
  if (!user) {
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

    await prisma.user.create({
      data: {
        email: TEST_USER.email,
        password: hashedPassword,
        name: TEST_USER.name
      }
    });
  }
});

afterAll(async () => {
  await clearDB();

  await prisma.$disconnect();
});


describe("Comment E2E", () => {
  it("should create a comment", async () => {
    const author = await prisma.user.findUnique({where: {email: TEST_USER.email}});
    const feedBackInput = {
      title: TEST_FEEDBACK.title,
      description: TEST_FEEDBACK.description,
      category: TEST_FEEDBACK.category,
      authorId: author!.id
    };

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: TEST_USER.email, password: TEST_USER.password});

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
    const author = await prisma.user.findUnique({where: {email: TEST_USER.email}, include: {feedbacks: true}});
    const feedbackId = author!.feedbacks[0].id;

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({email: TEST_USER.email, password: TEST_USER.password});

    const token = loginRes.body?.data?.result?.token;

    const res = await request(app)
      .get(`/api/comment/:${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});