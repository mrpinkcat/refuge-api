import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import Promise from 'bluebird';
import { Request, Response } from 'restify'
import { hash } from 'bcrypt'

interface UserInfo {
  username: String,
  password: String,
  admin: Boolean,
  email: String,
}

const register = (restifyReq: Request) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.database}`, {useNewUrlParser: true})
    .then(() => {
      // Check si le username est déjà pris
      User.findOne({ username: restifyReq.body.username })
      .then((res) => {
        // Si il est libre 
        if (!res) {
          let encyptedPassword: string;

          // Encryption du password
          hash(restifyReq.body.password, config.bcript.saltRound)
          .then(hash => {
            encyptedPassword = hash;
            
            // Création de l'objet user
            let userInfo: UserInfo = {
              username: restifyReq.body.username,
              password: encyptedPassword,
              email: restifyReq.body.email,
              admin: false,
            }
            
            // Création du document User
            let newUser = new User(userInfo);
      
            // Push du User dans la base
            newUser.save()
            .then(res => {
              mongoose.disconnect();
              // Then
              resolve(res.toJSON());
            }).catch(err => {
              mongoose.disconnect();
              // Catch
              reject(err);
            });
          });
        // Si il est déjà pris
        } else {
          mongoose.disconnect();
          reject('Username already taken');
        }
      });
    });
  });
}

export default register;
