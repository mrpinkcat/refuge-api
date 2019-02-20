import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import restify from 'restify';
import { compare } from 'bcrypt';

let auth = (restifyReq: restify.Request, restifyRes: restify.Response) => {
  // Création d'une promise
  return new Promise((resolve, reject) => {
    let { username, password } = restifyReq.body;
    
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.collection}`, {useNewUrlParser: true})
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
          compare(password, res.toJSON().password).then((isValidPassword: boolean) => {
            console.log(isValidPassword);
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
            } else {
              reject('Password is incorrect')
            }
          });
        }
      });
    });
  });
}

export default auth;
