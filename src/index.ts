import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { loggingHandler } from './middleware/loginHandler';
import { routeNotFound } from './middleware/routeNotFound';
import router from './routes';
import socketEvents from './socket';
import './utils/env';
import './utils/logger';
import { ClientToServerEvents, ServerToClientEvents } from './socket/types';

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: 'http://localhost:5173' },
});
//Initialize socket events
socketEvents(io);

app.use(cors({ origin: process.env.CLIENT_URL ?? '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

//Log all routes
app.use(loggingHandler);

app.use('/api', router);

//Log not found routes
app.use(routeNotFound);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}.`);
});
