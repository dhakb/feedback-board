import request from "supertest";
import { createApp } from "../../app";
import { PrismaClient } from "../../../generated/prisma";
import {
  clearDB,
  createCommentForTestUser,
  createFeedbackForTestUser,
  createTestUser,
  getTestUser,
  getTestUserWithFeedbacks,
  loginTestUser
} from "../utils/db";


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
  it("POST /should create a comment", async () => {
    const author = await getTestUser();

    const feedback = await createFeedbackForTestUser(author!.id);

    const input = {
      authorId: author!.id,
      feedbackId: feedback.id,
      content: "Test Comment"
    };

    const {token} = await loginTestUser();

    const res = await request(app)
      .post("/api/comment/")
      .set("Authorization", `Bearer ${token}`)
      .send(input);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          comment: expect.objectContaining({
            id: expect.any(String),
            content: input.content,
            feedbackId: feedback.id
          })
        }
      })
    );
  });

  it("GET /should return all comments by feedbackId", async () => {
    const author = await getTestUserWithFeedbacks();
    const feedbackId = author!.feedbacks[0].id;

    await createCommentForTestUser(author!.id, feedbackId);

    const {token} = await loginTestUser();

    const res = await request(app)
      .get(`/api/comment/${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          comments: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              content: expect.any(String),
              feedbackId
            })
          ])
        }
      })
    );
  });
});