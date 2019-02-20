import mongoose from 'mongoose';
import config from './../config';
import User from '../models/UserModel';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import { Request } from 'restify';

const deleteUser = (restifyReq: Request) => {
  return new Promise ((resolve, reject) => {
    // Check si le user est un admin
    // @ts-ignore
    if (!jwt.decode(restifyReq.authorization.credentials).admin) {
      reject(401);
    } else {
      mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.collection}`, {useNewUrlParser: true})
      .then(() => {
        User.deleteOne({ username: restifyReq.params.username })
        .then(res => {
          if (res.n === 1) {
            mongoose.disconnect();
            resolve(res);
          } else {
            mongoose.disconnect();
            reject(404);
          }
        });
      });
    }
  });
}

export default deleteUser;
