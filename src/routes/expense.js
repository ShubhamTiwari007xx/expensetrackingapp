import express from "express";
import { createExpense, getExpenses, deleteExpense } from "../controllers/expenses.js";
import { verifyToken } from "../middleware/authTokenChecker.js";

const router = express.Router();

router.get("/", verifyToken, getExpenses);
router.post("/", verifyToken, createExpense);
router.delete("/:id", verifyToken, deleteExpense);

export default router;
