import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // load env vars

import transactionRouter from './routes/transactions';
import signupRouter from './routes/signup';
import loginRouter from './routes/login';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/transactions', transactionRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
