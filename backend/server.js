import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON bodies


// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});