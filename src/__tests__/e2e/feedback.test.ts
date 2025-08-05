import request from "supertest";
import { createApp } from "../../app";
import {
  clearDB, createAltTestUser, createFeedbackForTestAltUser, createFeedbackForTestUser,
  createTestAdmin,
  createTestUser, getAltTestUser,
  getTestUser,
  getTestUserWithFeedbacks,
  loginTestAdmin
} from "../utils/db";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "../utils/mocks";
import { loginTestUser } from "../utils/db";
import { generateUUID } from "../../utils/uuid";


const app = createApp();
const prisma = new PrismaClient();


beforeAll(async () => {
  await clearDB();

  await createTestUser();
  await createTestAdmin();

  await createAltTestUser();
});

afterAll(async () => {
  await clearDB();

  await prisma.$disconnect();
});


describe("Feedback E2E", () => {
  describe("POST /api/feedback", () => {
    it("should create a feedback when authenticated and input is valid", async () => {
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

    it("should return 401 when not authenticated", async () => {
      const author = await getTestUser();
      const input = {
        title: TEST_FEEDBACK.title,
        description: TEST_FEEDBACK.description,
        category: TEST_FEEDBACK.category,
        authorId: author!.id
      };

      const res = await request(app)
        .post("/api/feedback/")
        .set("Authorization", `Bearer invalid-token`)
        .send(input);

      expect(res.status).toBe(401);
    });

    it("should return 400 if input is invalid", async () => {
      const input = {
        title: TEST_FEEDBACK.title,
        description: TEST_FEEDBACK.description,
        category: TEST_FEEDBACK.category
        // authorId: author.id    // missing field
      };

      const {token} = await loginTestUser();

      const res = await request(app)
        .post("/api/feedback/")
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(400);
    });

    it("should return 400 if authorId is invalid", async () => {
      const input = {
        title: TEST_FEEDBACK.title,
        description: TEST_FEEDBACK.description,
        category: TEST_FEEDBACK.category,
        authorId: "9b244495-a670-4ght-ac82-acfcb4804121"   // invalid authorId
      };

      const {token} = await loginTestUser();

      const res = await request(app)
        .post("/api/feedback/")
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/feedback", () => {
    it("should return all feedbacks", async () => {
      const {token} = await loginTestUser();

      const res = await request(app)
        .get("/api/feedback/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.feedbacks).toBeDefined();
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app)
        .get("/api/feedback/")
        .set("Authorization", `Bearer invalid-token`);

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/feedback/:feedbackId", () => {
    it("should get a feedback by ID", async () => {
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

    it("should return 401 when not authenticated", async () => {
      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const res = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer invalid-toke`);

      expect(res.status).toBe(401);
    });

    it("should return 404 if feedback not found", async () => {
      const {token} = await loginTestUser();

      const res = await request(app)
        .get(`/api/feedback/invalid-feedback-id`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });


  describe("POST /api/feedback/:id/upvote", () => {
    it("should upvote a feedback", async () => {
      const {token} = await loginTestUser();

      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const res = await request(app)
        .post(`/api/feedback/${feedbackId}/upvote`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 400 if feedback is non-existent", async () => {
      const {token} = await loginTestUser();

      const feedbackId = generateUUID(); // random, non-existent feedback ID

      const res = await request(app)
        .post(`/api/feedback/${feedbackId}/upvote`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("should return 403 if user already upvoted the feedback", async () => {
      const {token} = await loginTestUser();

      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      await request(app)
        .post(`/api/feedback/${feedbackId}/upvote`)
        .set("Authorization", `Bearer ${token}`);

      const res = await request(app)
        .post(`/api/feedback/${feedbackId}/upvote`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/feedback/:id", () => {
    it("should let user update feedback on allowed fields", async () => {
      const {token} = await loginTestUser();

      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const input = {
        title: "new title",
        description: "new desc",
        category: "new category"
      };

      const res = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(input);

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

    it("should return 400 if user tries to update not allowed fields", async () => {
      const {token} = await loginTestUser();

      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const input = {
        title: "new title",
        status: "DONE"       // not allowed field
      };

      const res = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(400);
    });

    it("should return 403 is user is not the author", async () => {
      const {token} = await loginTestUser();

      const altUser = await getAltTestUser();
      const altFeedback = await createFeedbackForTestAltUser(altUser!.id);
      const feedbackId = altFeedback.id;

      const input = {
        title: "new title",
        description: "new desc",
        category: "new category"
      };

      const res = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/feedback/id", () => {
    it("should delete a feedback", async () => {
      const {token} = await loginTestUser();

      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 if feedback is not found", async () => {
      const {token} = await loginTestUser();

      const feedbackId = generateUUID()

      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 403 user is not author of the feedback", async () => {
      const altUser = await getAltTestUser();
      const altFeedback = await createFeedbackForTestAltUser(altUser!.id);

      const {token} = await loginTestUser();

      const feedbackId = altFeedback.id;

      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/feedback/:id/status", () => {
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
          error: expect.any(String)
        })
      );
    });
  });
});