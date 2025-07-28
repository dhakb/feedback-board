import request from "supertest";
import { createApp } from "../../app";
import { clearDB, createTestUser } from "../utils/db";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "../utils/mocks";
import { loginTestUser } from "../utils/db";


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


describe("Feedback E2E", () => {
  it("should create a feedback", async () => {
    const author = await prisma.user.findUnique({where: {email: TEST_USER.email}});
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

  it("should list all feedbacks", async () => {
    const {token} = await loginTestUser();

    const res = await request(app)
      .get("/api/feedback/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.feedbacks).toBeDefined();
  });


  it("should get a feedback by ID", async () => {
    const {token} = await loginTestUser();

    const user = await prisma.user.findUnique({where: {email: TEST_USER.email}, include: {feedbacks: true}});
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
            title: TEST_FEEDBACK.title,
            description: TEST_FEEDBACK.description,
            category: TEST_FEEDBACK.category,
            status: TEST_FEEDBACK.status,
            authorId: user!.id
          })
        }
      })
    );
  });

  it("should upvote a feedback", async () => {
    const {token} = await loginTestUser();

    const user = await prisma.user.findUnique({where: {email: TEST_USER.email}, include: {feedbacks: true}});
    const feedbackId = user!.feedbacks[0].id;

    const res = await request(app)
      .post(`/api/feedback/${feedbackId}/upvote`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("should let user update feedback on allowed fields", async () => {
    const {token} = await loginTestUser();

    const user = await prisma.user.findUnique({where: {email: TEST_USER.email}, include: {feedbacks: true}});
    const feedbackId = user!.feedbacks[0].id;

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
            authorId: user!.id
          })
        }
      })
    );
  });

  it("should delete a feedback", async () => {
    const {token} = await loginTestUser();

    const user = await prisma.user.findUnique({where: {email: TEST_USER.email}, include: {feedbacks: true}});
    const feedbackId = user!.feedbacks[0].id;

    const res = await request(app)
      .delete(`/api/feedback/${feedbackId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("should let the admin update the feedback status", async () => {

  });
});