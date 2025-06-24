import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get('/health', (_, res) => {
  res.status(200).json({ message: 'API is healthy!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
