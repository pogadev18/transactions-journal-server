import express from 'express';
import { Transaction } from '../models/transactions';

const router = express.Router();

const transactions: Transaction[] = [];

router.post('/', (req, res) => {
  const transaction: Transaction = req.body;
  transactions.push(transaction);
  res.status(201).send(transaction);
});

router.get('/', (req, res) => {
  res.status(200).send(transactions);
});

export default router;
