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

const register = (restifyReq: Request, restifyRes: Response) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.collection}`, {useNewUrlParser: true})
    .then(() => {
      let encyptedPassword: string;

      // Encryption du password
      hash(restifyReq.body.password, config.bcript.saltRound)
      .then(hash => {
        encyptedPassword = hash;

        let userInfo: UserInfo = {
          username: restifyReq.body.username,
          password: encyptedPassword,
          email: restifyReq.body.email,
          admin: false,
        }
        
        let newUser = new User(userInfo);
  
        newUser.save().then(res => {
          mongoose.disconnect();
          resolve(res);
        }).catch(err => {
          mongoose.disconnect();
          reject(err);
        });
      })
      .catch(err => {
        console.log(err)!
        console.log('Error during password encryption')
        encyptedPassword = '';
        reject('Error during password encryption')
      });
    });
  });
}

export default register;
