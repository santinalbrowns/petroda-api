import express from 'express';
import dotenv from 'dotenv';
import Connect from './config/database';
import { deserialize, error } from './middlewares';

dotenv.config();

const app = express();

app.use(express.json());

app.use(deserialize);

// Auth route
app.use('/auth', require('./routes/auth'));

// Manager route
app.use('/manager', require('./routes/manager'));

app.use(error);

app.listen(process.env.PORT, () => { 

    Connect();

    console.log('Server running on port: 3000') 
});