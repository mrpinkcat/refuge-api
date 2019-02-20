import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import { Request } from 'restify';
import { compare } from 'bcrypt';

let auth = (restifyReq: Request) => {
  // Création d'une promise
  return new Promise((resolve, reject) => {
    let { username, password } = restifyReq.body;
    
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.database}`, {useNewUrlParser: true})
    .then(() => {
      User.findOne({username}, (err, res) => {
        if (err) {
          mongoose.disconnect();
          // Catch
          reject(err);
        } else if (res ===  null) {
          mongoose.disconnect();
          // Catch
          reject('User not found');
        } else {

          // Désencryption du password pour le check avec le user
          compare(password, res.toJSON().password)
          .then((isValidPassword: boolean) => {
            // Si le password décrypté macth avec le password renseigné par l'utilisateur
            if (isValidPassword) {
              // Création du pyaload
              let payload = {
                username: res.toJSON().username,
                email: res.toJSON().email,
                admin: res.toJSON().admin,
              }
              
              // Création du token
              let token = jwt.sign(payload, config.secretJwt, { expiresIn: '15m' });
            
              // @ts-ignore
              // retrieve issue and expiration times
              let {iat, exp} = jwt.decode(token);

              mongoose.disconnect();
              // then
              resolve({token, iat, exp});
            // Si le password décrypté ne macth pas avec le password renseigné par l'utilisateur
            } else {
              // catch
              reject('Password is incorrect')
            }
          });
        }
      });
    });
  });
}

export default auth;
