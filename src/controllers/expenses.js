import { prisma } from "../../db.js";

export const createExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;
        if (!amount || !title || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const expense = await prisma.expense.create({
            //    id        Int      @id @default(autoincrement())
            //   title     String
            //   amount    Int
            //   category  String
            //   createdAt DateTime @default(now())
            //   user      User     @relation(fields: [userId], references: [id])
            //   userId    Int
            data: {
                amount: parseInt(amount),
                title,
                category,      
                user: {
                    connect: {
                        id: req.userId
                    }
                },
            },
        });
        res.json({ message: "Expense created successfully", expense });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: {
                userId: req.userId
            }
        });
        res.json(expenses);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expenseToDelete = await prisma.expense.findUnique({
            where: { id: parseInt(id) }
        });

        if (!expenseToDelete) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (expenseToDelete.userId !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own expenses" });
        }

        await prisma.expense.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};