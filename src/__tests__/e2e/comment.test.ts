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
  describe("POST /api/comment/", () => {
    it("should create a comment when authenticated and input is valid", async () => {
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

    it("should return 401 if not authenticated", async () => {
      const author = await getTestUser();

      const feedback = await createFeedbackForTestUser(author!.id);

      const input = {
        authorId: author!.id,
        feedbackId: feedback.id,
        content: "Test Comment"
      };

      const res = await request(app)
        .post("/api/comment/")
        .set("Authorization", `Bearer invalid-token`)
        .send(input);

      expect(res.status).toBe(401);
      expect(res.body).toEqual(expect.objectContaining({error: "Unauthorized"}));
    });

    it("should return 400 if input is invalid", async () => {
      const {token} = await loginTestUser();

      const input = {}; // missing required fields

      const res = await request(app)
        .post("/api/comment/")
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.objectContaining({status: "fail"})
      );
    });

    it("should return 404 if feedback does not exist", async () => {
      const {token} = await loginTestUser();

      const input = {
        authorId: "9b244495-a670-4daf-ac82-acfcb4804121",
        feedbackId: "2bc79c20-ba35-4958-aae0-b87304139ae1", // invalid feedbackId
        content: "Test Comment"
      };

      const res = await request(app)
        .post("/api/comment/")
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/comment/", () => {
    it("should return all comments by feedbackId", async () => {
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

    it("should return 401 if not authenticated", async () => {
      const author = await getTestUserWithFeedbacks();
      const feedbackId = author!.feedbacks[0].id;

      const res = await request(app)
        .get(`/api/comment/${feedbackId}`)
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });

    it("should return 404 if feedback does not exist", async () => {
      const {token} = await loginTestUser();

      const res = await request(app)
        .get(`/api/comment/9b244495-a670-4daf-ac82-acfcb4804121`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});