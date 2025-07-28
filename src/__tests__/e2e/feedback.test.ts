import request from "supertest";
import { createApp } from "../../app";
import {
  clearDB, createFeedbackForTestUser,
  createTestAdmin,
  createTestUser,
  getTestUser,
  getTestUserWithFeedbacks,
  loginTestAdmin
} from "../utils/db";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "../utils/mocks";
import { loginTestUser } from "../utils/db";


const app = createApp();
const prisma = new PrismaClient();


beforeAll(async () => {
  await clearDB();

  await createTestUser();
  await createTestAdmin();
});

afterAll(async () => {
  await clearDB();

  await prisma.$disconnect();
});


describe("Feedback E2E", () => {
  it("POST /should create a feedback", async () => {
    const author = await getTestUser();
    const input = {
      title: TEST_FEEDBACK.title,
      description: TEST_FEEDBACK.description,
      category: TEST_FEEDBACK.category,
      authorId: author!.id
    };

    const {token} = await loginTestUser();

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
            title: TEST_FEEDBACK.title,
            description: TEST_FEEDBACK.description,
            category: TEST_FEEDBACK.category,
            status: TEST_FEEDBACK.status,
            authorId: author!.id
          })
        }
      })
    );
  });

  it("GET /should list all feedbacks", async () => {
    const {token} = await loginTestUser();

    const res = await request(app)
      .get("/api/feedback/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.feedbacks).toBeDefined();
  });


  it("GET /should get a feedback by ID", async () => {
    const {token} = await loginTestUser();

    const author = await getTestUserWithFeedbacks();
    const feedbackId = author!.feedbacks[0].id;

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
            title: TEST_FEEDBACK.title,
            description: TEST_FEEDBACK.description,
            category: TEST_FEEDBACK.category,
            status: TEST_FEEDBACK.status,
            authorId: author!.id
          })
        }
      })
    );
  });

  it("POST /should upvote a feedback", async () => {
    const {token} = await loginTestUser();

    const author = await getTestUserWithFeedbacks();
    const feedbackId = author!.feedbacks[0].id;

    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("PATCH /should let user update feedback on allowed fields", async () => {
    const {token} = await loginTestUser();

    const author = await getTestUserWithFeedbacks();
    const feedbackId = author!.feedbacks[0].id;

    const res = await request(app)
      .patch(`/api/feedback/${feedbackId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({title: "new title", description: "new desc", category: "new category"});

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          feedback: expect.objectContaining({
            id: expect.any(String),
            title: "new title",
            description: "new desc",
            category: "new category",
            status: TEST_FEEDBACK.status,
            authorId: author!.id
          })
        }
      })
    );
  });

  it("DELETE /should delete a feedback", async () => {
    const {token} = await loginTestUser();

    const author = await getTestUserWithFeedbacks();
    const feedbackId = author!.feedbacks[0].id;

    const res = await request(app)
      .delete(`/api/feedback/${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("PATCH /should let the admin update the feedback status", async () => {
    const {token} = await loginTestAdmin();

    let author = await getTestUser();
    await createFeedbackForTestUser(author!.id);
    let author_with_feedbacks = await getTestUserWithFeedbacks();
    const feedbackId = author_with_feedbacks!.feedbacks[0].id;

    const res = await request(app)
      .patch(`/api/feedback/${feedbackId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({status: "IN_PROGRESS"});

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: {
          feedback: expect.objectContaining({
            id: expect.any(String),
            title: TEST_FEEDBACK.title,
            description: TEST_FEEDBACK.description,
            category: TEST_FEEDBACK.category,
            status: "IN_PROGRESS",
            authorId: author!.id
          })
        }
      })
    );
  });

  it("should throw ForbiddenError non-admin updating Feedback status", async () => {
    const {token} = await loginTestUser();

    let author = await getTestUser();
    await createFeedbackForTestUser(author!.id);
    let author_with_feedbacks = await getTestUserWithFeedbacks();
    const feedbackId = author_with_feedbacks!.feedbacks[0].id;

    const res = await request(app)
      .patch(`/api/feedback/${feedbackId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({status: "IN_PROGRESS"});

    expect(res.status).toBe(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

});