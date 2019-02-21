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
      User.deleteOne({ email: restifyReq.params.email })
      .then(res => {
        if (res.n === 1) {
          resolve(res);
        } else {
          reject(404);
        }
      });
    }
  });
}

export default deleteUser;
