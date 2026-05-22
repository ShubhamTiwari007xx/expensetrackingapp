import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { connectDB } from "./db.js";
import authRouter from "./src/routes/authRuth.js";
import cookieParser from "cookie-parser";
import path from "path";
import expensesRouter from "./src/routes/expense.js";
const app = express();
const PORT = 5000;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use("/expenses", expensesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();