import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './UserModel';
import config from './config';
import request from './requests'

const server = createServer();

server.use(plugins.queryParser()); // Met tous les params dans l'object res.query
server.use(plugins.bodyParser());
server.use(rjwt({ secret: config.secretJwt }).unless({
  path: ['/auth'],
}));

server.get('/', (req, res, next) => {
  console.log('GET /');
  res.send(200, { body: 'this is the body' })
  next();
})

server.listen('3001', () => {
  console.log(`${server.name} listen at ${server.url}`);
});

server.post('/auth', (restifyReq, restifyRes) => {
  console.log('POST /auth');
  request.auth(restifyReq, restifyRes)
  .then((res) => {
    restifyRes.send(200, res);
  })
  .catch(() => {
    restifyRes.send(401, { message: 'Username or password is invalid'});
  });
});
