import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import jwt from 'jsonwebtoken';
import config from './config';
import request from './requests';

const server = createServer({ name: 'refuge-API' });

server.use(plugins.queryParser()); // Met les params dans req.query
server.use(plugins.bodyParser()); // Met le body dans req.body
server.use(plugins.authorizationParser()); // Met le token dans req.authorization.credentials
server.use(rjwt({ secret: config.secretJwt }).unless({
  path: ['/auth', '/register', '/heartbeat'],
}));

server.listen('3001', () => {
  console.log(`${server.name} listen at ${server.url}`);
});

// Auth
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

// Création d'utilisateur
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
    restifyRes.send(500, err);
  })
});

// Suppression d'utilisateur 
server.del('/user/:username', (restifyReq, restifyRes) => {
  console.log(`DELETE /user/${restifyReq.params.username}`);
  request.deleteUser(restifyReq)

  .then(() => {
    restifyRes.send(200, { message: `Succefully deleted ${restifyReq.params.username}` });
  })

  .catch((err) => {
    if (err === 401) {
      restifyRes.send(401, { message: 'You must be admin to perform this action'});
    } else {
      restifyRes.send(404, { message: `User ${restifyReq.params.username} not found`});
    }
  });
});

server.get('/heartbeat', (req, res) => {
  res.send(200);
});
