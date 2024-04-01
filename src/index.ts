import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { loggingHandler } from './middleware/loginHandler';
import { routeNotFound } from './middleware/routeNotFound';
import router from './routes';
import './utils/env';
import './utils/logger';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Log all routes
app.use(loggingHandler);

app.use('/api', router);

//Log not found routes
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}.`);
});
