import bcrypt from "bcrypt";
import request from "supertest";
import { createApp } from "../../app";
import { TEST_USER, TEST_FEEDBACK, TEST_ADMIN } from "./mocks";
import { PrismaClient } from "../../../generated/prisma";


const app = createApp();


const prisma = new PrismaClient();


export async function clearDB() {
  await prisma.comment.deleteMany({});
  await prisma.feedbackVote.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function createTestUser() {
  const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

  await prisma.user.create({
    data: {
      email: TEST_USER.email,
      password: hashedPassword,
      name: TEST_USER.name
    }
  });
}

export async function getTestUser() {
  return prisma.user.findUnique({
    where: {email: TEST_USER.email}
  });
}

export async function getTestUserWithFeedbacks() {
  return prisma.user.findUnique({
    where: {email: TEST_USER.email},
    include: {feedbacks: true}
  });
}

export async function loginTestUser(): Promise<{ token: string }> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({email: TEST_USER.email, password: TEST_USER.password});

  return {token: res.body?.data?.result?.token};
}

export async function createFeedbackForTestUser(userId: string) {
  return prisma.feedback.create({
    data: {
      title: TEST_FEEDBACK.title,
      description: TEST_FEEDBACK.description,
      category: TEST_FEEDBACK.category,
      authorId: userId
    }
  });
}

export async function createCommentForTestUser(userId: string, feedbackId: string) {
  return prisma.comment.create({
    data: {
      content: "Test Comment",
      authorId: userId,
      feedbackId
    }
  });
}

export async function createTestAdmin() {
  const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, 10);

  await prisma.user.create({
    data: {
      email: TEST_ADMIN.email,
      password: hashedPassword,
      name: TEST_ADMIN.name,
      role: "ADMIN"
    }
  });
}

export async function loginTestAdmin(): Promise<{ token: string }> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({email: TEST_ADMIN.email, password: TEST_ADMIN.password});

  return {token: res.body?.data?.result?.token};
}