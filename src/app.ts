import express from 'express';
import transactionRouter from './routes/transactions';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/transactions', transactionRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
