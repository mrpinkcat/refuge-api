import config from './../config';
import User from '../models/UserModel';
import { Request, Response } from 'restify'
import { hash } from 'bcrypt'

interface UserInfo {
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  phone?: String,
  admin?: Boolean,
}

const register = (restifyReq: Request, restifyRes: Response) => {
  // Check la force du mot de passe
  if (!restifyReq.body.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g)) {
    let err = {
      errors: {
        password: {
          message: 'Password must contain a minimum of eight characters, at least one letter and one number',
          path: 'password',
        }
      }
    }
    restifyRes.send(500, err)
  }
  let encyptedPassword: string;

  // Encryption du password
  hash(restifyReq.body.password, config.bcrypt.saltRound)
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
      // Then
      restifyRes.send(200, res.toJSON());
    }).catch(err => {
      // Catch
      restifyRes.send(500, err);
    });
  });
}

export default register;
