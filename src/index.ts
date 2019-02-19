import { createServer, plugins } from 'restify';
import rjwt from 'restify-jwt-community';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './UserModel';

const secretJwt = '';

const server = createServer();

server.use(plugins.queryParser()); // Met tous les params dans l'object res.query
server.use(plugins.bodyParser());
server.use(rjwt({ secret: secretJwt }).unless({
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

server.post('/auth', (req, rres, next) => {
  console.log('POST /auth');
  let { username, password } = req.body;
  console.log(username, password)
  mongoose.connect('', {useNewUrlParser: true}).then(() => {
    User.findOne({username, password}, (err, res) => {
      if (res ===  null) {
        rres.send(401)
        console.log(res);
      } else {

        let payload = {
          username: res.toJSON().username,
          email: res.toJSON().email,
          admin: res.toJSON().admin,
        }
        
        let token = jwt.sign(payload, secretJwt, { expiresIn: '15m' });
      
        // retrieve issue and expiration times
        //@ts-ignore
        let {iat, exp} = jwt.decode(token);
        rres.send(200, {iat, exp, token});
      }
    });
  });
});
