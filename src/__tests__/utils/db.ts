import { PrismaClient } from "../../../generated/prisma";


const prisma = new PrismaClient();


export async function clearDB() {
  await prisma.comment.deleteMany({});
  await prisma.feedbackVote.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.user.deleteMany({});
}