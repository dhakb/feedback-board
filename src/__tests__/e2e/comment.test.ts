import request from "supertest";
import { createApp } from "../../app";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "../utils/mocks";
import { clearDB, createTestUser, loginTestUser } from "../utils/db";


const app = createApp();
const prisma = new PrismaClient();


beforeAll(async () => {
  await clearDB();

  await createTestUser();
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

    const {token} = await loginTestUser();

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

    const {token} = await loginTestUser();

    const res = await request(app)
      .get(`/api/comment/:${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});