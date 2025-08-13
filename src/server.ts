import { createApp } from "./app";
import { config } from "./config";
import { prisma } from "./infrastructure/prisma";

const app = createApp();
const server = app.listen(config.port, () => {
  console.log(`Server is running in ${config.env} mode on port ${config.port}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error("Error disconnecting Prisma:", err);
  } finally {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  }
};

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig as NodeJS.Signals, () => shutdown(sig));
});
