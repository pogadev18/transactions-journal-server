import express from 'express';
import bcrypt from 'bcrypt';

import pool from '../db';
import { QueryResult } from 'pg';
import type { User } from './login';

const router = express.Router();

router.post('/', async (req, res) => {
  const user: User = req.body;
  const { username, password } = user;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result: QueryResult<User> = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username;',
    [username, hashedPassword]
  );

  res.status(201).json(result.rows[0]);
  try {
  } catch (error) {
    res.status(500).json({ error: 'Error creating user!' });
  }
});

export default router;
