import bcrypt from "bcrypt";
import request from "supertest";
import { createApp } from "../../app";
import { TEST_USER, TEST_FEEDBACK } from "./mocks";
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

export async function loginTestUser(): Promise<{ token: string }> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({email: TEST_USER.email, password: TEST_USER.password});

  return {token: res.body?.data?.result?.token};
}