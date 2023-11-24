import express from 'express';
import type { QueryResult } from 'pg';

import { Transaction } from '../models/transactions';
import { authenticateToken } from '../middleware/authMiddleware';

import pool from '../db';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId: number = req.user.userId;
    const transaction: Transaction = req.body;
    const { date, title, details } = transaction;

    const query = `
      INSERT INTO transactions (user_id, date, title, details) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;  
    `;

    const newTransaction: QueryResult<Transaction> = await pool.query(query, [
      userId,
      date,
      title,
      details,
    ]);

    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    let errorMessage = 'Something went wrong';

    // Check if error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(error);
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userId: number = req.user.userId;

  const transactions = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1',
    [userId]
  );

  res.status(200).json(transactions.rows);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId: number = req.user.userId;

    const deleteQuery =
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *;';

    const deletedTransaction: QueryResult<Transaction> = await pool.query(
      deleteQuery,
      [id, userId]
    );

    if (deletedTransaction.rowCount === 0) {
      // No rows were deleted, meaning there's no transaction with the given id
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(deletedTransaction.rows[0]);
  } catch (error) {
    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(error);
    res.status(500).json({ error: errorMessage });
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  const userId: number = req.user.userId;
  const { id } = req.params;
  const transaction: Transaction = req.body;
  const { date, title, details } = transaction;

  try {
    // Construct an array to hold the fields to be updated
    const fieldsToUpdate: string[] = [];
    const values: string[] = [];

    if (date) {
      fieldsToUpdate.push('date');
      values.push(date);
    }

    if (title) {
      fieldsToUpdate.push('title');
      values.push(title);
    }

    if (details) {
      fieldsToUpdate.push('details');
      values.push(details);
    }

    // Create the SET part of the SQL query based on the fields that are present
    const setQuery = fieldsToUpdate
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    // Only proceed if there are fields to update
    if (fieldsToUpdate.length > 0) {
      values.push(id);
      values.push(String(userId));

      const updateQuery = `
        UPDATE transactions
        SET ${setQuery}
        WHERE id = $${fieldsToUpdate.length + 1} AND user_id = $${
        fieldsToUpdate.length + 2
      }
        RETURNING *;
      `;

      const updatedTransaction: QueryResult<Transaction> = await pool.query(
        updateQuery,
        values
      );

      if (updatedTransaction.rowCount === 0) {
        // No rows were updated, meaning there's no transaction with the given id
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.status(200).json(updatedTransaction.rows[0]);
    } else {
      res.status(400).json({ message: 'No fields to update' });
    }
  } catch (error) {
    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
