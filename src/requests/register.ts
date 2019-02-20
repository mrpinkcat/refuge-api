import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import Promise from 'bluebird';
import { Request, Response } from 'restify'

interface UserInfo {
  username: String,
  password: String,
  admin: Boolean,
  email: String,
}

const register = (restifyReq: Request, restifyRes: Response) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.collection}`, {useNewUrlParser: true}).then(() => {
      let userInfo: UserInfo = {
        username: restifyReq.body.username,
        password: restifyReq.body.password,
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
    });
  });
}

export default register;
