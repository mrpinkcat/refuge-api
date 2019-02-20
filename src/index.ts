import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import jwt from 'jsonwebtoken';
import config from './config';
import request from './requests'

const server = createServer();

server.use(plugins.queryParser()); // Met tous les params dans l'object res.query
server.use(plugins.bodyParser());
server.use(plugins.authorizationParser());
server.use(rjwt({ secret: config.secretJwt }).unless({
  path: ['/auth', '/register'],
}));

server.get('/', (req, res, next) => {
  console.log('GET /');
  // @ts-ignore
  res.send(200, { body: `Hello ${jwt.decode(req.authorization.credentials).username} !` })
  next();
})

server.listen('3001', () => {
  console.log(`${server.name} listen at ${server.url}`);
});

server.post('/auth', (restifyReq, restifyRes) => {
  console.log('POST /auth');

  // Check is le pass et le username existe dans la base
  request.auth(restifyReq, restifyRes)

  // Si ils existent
  .then((res) => {
    restifyRes.send(200, res);
  })

  // Si ils n'exsitent pas
  .catch(() => {
    restifyRes.send(401, { message: 'Username or password is invalid'});
  });
});

server.post('/register', (restifyReq, restifyRes) => {
  console.log('POST /register');

  // Crée le user dans la base
  request.register(restifyReq, restifyRes)

  // Si on a bien crée le user dans la base
  .then(res => {
    restifyRes.send(200, res);
  })

  // Si fail
  .catch(err => {
    restifyRes.send(401, err);
  })
});
