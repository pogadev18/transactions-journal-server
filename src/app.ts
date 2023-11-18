import express from 'express';
import dotenv from 'dotenv';

import transactionRouter from './routes/transactions';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/transactions', transactionRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
