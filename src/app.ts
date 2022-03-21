import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import { router } from './routes';

const app = express();

app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(express.json());
app.use(router);

// Logar na aplicação com o GITHUB
app.route('/github').get((request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

// Rota de retorno pegando o código do usuário
app.route('/signin/callback').get((request, response) => {
  const { code } = request.query;

  return response.json(code);
});

export { serverHttp, io };
