import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import jwt from 'jsonwebtoken';
import config from './config';
import request from './requests'

const server = createServer();

server.use(plugins.queryParser()); // Met les params dans req.query
server.use(plugins.bodyParser()); // Met le body dans req.body
server.use(plugins.authorizationParser()); // Met le token dans req.authorization.credentials
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
  request.auth(restifyReq)

  // Si il existe
  .then((res) => {
    restifyRes.send(200, res);
  })

  // Si il n'exsite pas
  .catch((err) => {
    restifyRes.send(401, { message: err });
  });
});

server.post('/register', (restifyReq, restifyRes) => {
  console.log('POST /register');

  // Crée le user dans la base
  request.register(restifyReq)

  // Si on a bien crée le user dans la base
  .then(res => {
    // On n'envoie pas le password du user dans la réponse
    // @ts-ignore
    delete res.password;

    restifyRes.send(200, res);
  })

  // Si fail
  .catch(err => {
    restifyRes.send(401, err);
  })
});
