import express from 'express';
import dotenv from 'dotenv';
import Connect from './config/database';
import { deserialize, error } from './middlewares';

dotenv.config();

const app = express();

//app.use(express.json());

app.use(deserialize);

///api/pay/verify

// Use JSON parser for all non-webhook routes
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void => {
        if (req.originalUrl === '/api/pay/verify') {
            next();
        } else {
            express.json()(req, res, next);
        }
    }
);

// Auth route
app.use('/auth', require('./routes/auth'));

// Manager route
app.use('/manager', require('./routes/manager'));

// Tenant route
app.use('/api', require('./routes/tenant'));

// Provider route
app.use('/provider', require('./routes/provider'));

app.use(error);

app.listen(process.env.PORT || 3000, () => {

    Connect();

    console.log('Server running on port: 3000')
});