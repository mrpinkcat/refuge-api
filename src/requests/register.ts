import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import Promise from 'bluebird';
import { Request } from 'restify'
import { hash } from 'bcrypt'

interface UserInfo {
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  phone?: String,
  admin?: Boolean,
}

const register = (restifyReq: Request) => {
  return new Promise((resolve, reject) => {

    // Check la force du mot de passe
    if (!restifyReq.body.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g)) {
      reject({errors: {
        password: {
          message: 'Password must contain a minimum of eight characters, at least one letter and one number',
          path: 'password',
        }
      }});
    }

    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.database}`, {useNewUrlParser: true})
    .then(() => {
      let encyptedPassword: string;

      // Encryption du password
      hash(restifyReq.body.password, config.bcript.saltRound)
      .then(hash => {
        encyptedPassword = hash;
        
        // Création de l'objet user
        let userInfo: UserInfo = {
          email: restifyReq.body.email,
          password: encyptedPassword,
          firstname: restifyReq.body.firstname,
          lastname: restifyReq.body.lastname,
          phone: restifyReq.body.phone,
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
    });
  });
}

export default register;
