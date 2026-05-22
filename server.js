import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { connectDB } from "./db.js";
import authRouter from "./src/routes/authRuth.js";
import cookieParser from "cookie-parser";
import path from "path";
import expensesRouter from "./src/routes/expense.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use("/expenses", expensesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

await connectDB();

export default app;