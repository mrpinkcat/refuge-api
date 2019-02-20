import mongoose from 'mongoose';
import config from './../config';
import User from './../UserModel';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import restify from 'restify'

let auth = (restifyReq: restify.Request, restifyRes: restify.Response) => {
  // Création d'une promise
  return new Promise((resolve, reject) => {
    let { username, password } = restifyReq.body;
    mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.ip}:${config.mongo.port}/${config.mongo.collection}`, {useNewUrlParser: true}).then(() => {
      User.findOne({username, password}, (err, res) => {
        if (res ===  null || err) {
          reject();
          // restifyRes.send(401);
        } else {
    
          let payload = {
            username: res.toJSON().username,
            email: res.toJSON().email,
            admin: res.toJSON().admin,
          }
          
          let token = jwt.sign(payload, config.secretJwt, { expiresIn: '15m' });
        
          // retrieve issue and expiration times
          //@ts-ignore
          let {iat, exp} = jwt.decode(token);
          resolve({token, iat, exp});
          // restifyRes.send(200, {iat, exp, token});
        }
      });
    });
  });
}

export default auth;
