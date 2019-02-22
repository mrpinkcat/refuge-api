import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import config from './config';
import request from './requests';
import { set, connect } from 'mongoose';

// Pour éviter le deprecation warning
set('useCreateIndex', true); 

const server = createServer({ name: 'refuge-API' });

server.use(plugins.queryParser()); // Met les params dans req.query
server.use(plugins.bodyParser()); // Met le body dans req.body
server.use(plugins.authorizationParser()); // Met le token dans req.authorization.credentials
server.use(rjwt({ secret: config.secretJwt }).unless({
  path: ['/auth', '/register', '/heartbeat'],
}));

// Connection à la base
connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.database}`, {useNewUrlParser: true})
.then(() => {
  server.listen('3001', () => {
    console.log(`${server.name} listen at ${server.url}`);
  });
})
.catch((err) => {
  console.log(err);
  process.exit(0);
})

// Auth
server.post('/auth', request.auth);

// Création d'utilisateur
server.post('/register', request.register);

server.get('/users', (req, res) => {
  console.log('GET /users');
  // Récupérer tout les users
})

server.get('/user/:email', (req, res) => {
  console.log(`GET /user/${req.params.email}`);
  // Récupérer l'info d'un user
});

// Suppression d'utilisateur 
server.del('/user/:email', (restifyReq, restifyRes) => {
  console.log(`DELETE /user/${restifyReq.params.email}`);
  request.deleteUser(restifyReq)

  .then(() => {
    restifyRes.send(200, { message: `Succefully deleted ${restifyReq.params.email}` });
  })

  .catch((err) => {
    if (err === 401) {
      restifyRes.send(401, { message: 'You must be admin to perform this action'});
    } else {
      restifyRes.send(404, { message: `User ${restifyReq.params.email} not found`});
    }
  });
});

// Endpoint pour voir si le serveur est up (ouvert sans token)
server.get('/heartbeat', (req, res) => {
  res.send(200);
});

// Endpoint pour check le token
server.get('/tokencheck', (req, res) => {
  res.send(200);
});
