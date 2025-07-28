import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma";
import { TEST_USER, TEST_FEEDBACK } from "./mocks";


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