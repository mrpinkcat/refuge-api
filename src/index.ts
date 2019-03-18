import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import config from './config';
import request from './requests';
import { set, connect } from 'mongoose';

// Pour éviter le UnhandledPromiseRejectionWarning
process.on('unhandledRejection', (err, p) => {
  console.log('An unhandledRejection occurred');
});


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

// Suppression d'utilisateur 
server.del('/user/:email', request.deleteUser);

// Endpoint pour voir si le serveur est up (ouvert sans token)
server.get('/heartbeat', request.heartbeat);

// Endpoint pour check le token
server.get('/tokencheck', request.tokenCheck);

// server.get('/users', (req, res) => {
//   console.log('GET /users');
//   // Récupérer tout les users
// })

// server.get('/user/:email', (req, res) => {
//   console.log(`GET /user/${req.params.email}`);
//   // Récupérer l'info d'un user
// });
