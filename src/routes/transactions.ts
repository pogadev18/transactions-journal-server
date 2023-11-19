import express from 'express';
import type { QueryResult } from 'pg';

import { Transaction } from '../models/transactions';

import pool from '../db';

const router = express.Router();

// todo: run DB on local machine

router.post('/', async (req, res) => {
  try {
    const transaction: Transaction = req.body;
    const { date, title, details } = transaction;

    const query = `
      INSERT INTO transactions (date, title, details) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;

    console.log('query', query);
    const newTransaction: QueryResult<Transaction> = await pool.query(query, [
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

router.get('/', async (req, res) => {
  const transactions = await pool.query('SELECT * FROM transactions');
  res.status(200).send(transactions.rows);
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id', id);

    const deleteQuery = 'DELETE FROM transactions WHERE id = $1 RETURNING *;';
    const deletedTransaction: QueryResult<Transaction> = await pool.query(
      deleteQuery,
      [id]
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

router.patch('/:id', async (req, res) => {
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
      const updateQuery = `
        UPDATE transactions
        SET ${setQuery}
        WHERE id = $${fieldsToUpdate.length + 1}
        RETURNING *;
      `;

      values.push(id); // Add the id to the values array

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
