import cors from "cors";
import dotenv from "dotenv";
import express from "express";


dotenv.config();

import authRoutes from "./routes/authRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import commentRoutes from "./routes/commentRoutes";


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/health", (_, res) => {
  res.status(200).json({message: "API is healthy!"});
});

app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/comment", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
