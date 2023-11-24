import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import { QueryResult } from 'pg';

import pool from '../db';

const router = express.Router();

export type User = {
  id?: string;
  username: string;
  password: string;
};

export type JWTUser = {
  userId: string;
  username: string;
};

router.post('/', async (req, res) => {
  try {
    const user: User = req.body;
    const { username, password: clientPassword } = user;

    const userQuery: QueryResult<User> = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      const isPasswordValid = await bcrypt.compare(
        clientPassword,
        user.password
      );

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET!,
          {
            expiresIn: process.env.JWT_EXPIRES_IN!,
          }
        );

        res.json({ token, username: user.username });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

export default router;
