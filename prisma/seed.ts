import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("unsafe-password", 10);

  const alice = await prisma.user.upsert({
    where: {email: "alice@mail.com"},
    update: {},
    create: {
      email: "alice@email.com",
      name: "Alice",
      password: passwordHash,
      feedbacks: {
        create: {
          title: "Add theme toggle",
          description: "Add ability to let user switch between different themes",
          category: "UI",
          upvotes: 1
        }
      }
    }
  });

  const tom = await prisma.user.upsert({
    where: {email: "tom@mail.com"},
    update: {},
    create: {
      email: "tom@email.com",
      name: "Tom",
      password: passwordHash,
      feedbacks: {
        create: {
          title: "Google SignIn/SignUp Button",
          description: "Add google authentication button, allowing users to creat account with their Google account",
          category: "AUTH",
          comments: {
            create: {
              content: "This is great idea!",
              authorId: alice.id
            }
          }
        }
      }
    }
  });

  await prisma.user.upsert({
    where: {email: "matthew@mail.com"},
    update: {},
    create: {
      email: "matthew@email.com",
      name: "Matthew",
      password: passwordHash,
      feedbacks: {
        create: {
          title: "Google SignIn/SignUp Button",
          description: "Add google authentication button, allowing users to creat account with their Google account",
          category: "AUTH",
          comments: {
            create: [
              {
                content: "Wonderful idea",
                authorId: tom.id
              },
              {
                content: "This will be very useful",
                authorId: alice.id
              }
            ]
          }
        }
      }
    }
  });

  await prisma.user.upsert({
    where: {email: "admin@mail.com"},
    update: {},
    create: {
      email: "admin@mail.com",
      name: "Admin",
      password: passwordHash,
      role: "ADMIN"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });