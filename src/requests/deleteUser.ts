import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'restify';

const deleteUser = (restifyReq: Request, restifyRes: Response) => {
  console.log(`DELETE /user/${restifyReq.params.email}`);
  // Check si le user est un admin
  // @ts-ignore
  if (!jwt.decode(restifyReq.authorization.credentials).admin) {
    restifyRes.send(401, { message: 'You must be admin to perform this action'});
  } else {
    User.deleteOne({ email: restifyReq.params.email })
    .then(res => {
      if (res.n === 1) {
        restifyRes.send(200, res);
      } else {
        restifyRes.send(404, { message: 'User not found'});
      }
    });
  }
}

export default deleteUser;
