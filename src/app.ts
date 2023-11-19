import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // load env vars

import transactionRouter from './routes/transactions';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/transactions', transactionRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
