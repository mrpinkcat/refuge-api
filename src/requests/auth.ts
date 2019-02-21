import config from './../config';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'restify';
import { compare } from 'bcrypt';

let auth = (restifyReq: Request, restifyRes: Response) => {
  let { email, password } = restifyReq.body;

  User.findOne({email})
  .then((res) => {
    // Pas de user avec cet email dans la base
    if (res ===  null) {
      restifyRes.send(500, { message: 'User not found' });
    // User found
    } else {
      // Désencryption du password pour le check avec le user
      compare(password, res.toJSON().password)
      .then((isValidPassword: boolean) => {
        // Si le password décrypté macth avec le password renseigné par l'utilisateur
        if (isValidPassword) {
          // Création du pyaload
          let payload = {
            email: res.toJSON().email,
            firstname: res.toJSON().firstname,
            lastname: res.toJSON().lastname,
            phone: res.toJSON().phone,
            admin: res.toJSON().admin,
          }
          
          // Création du token
          let token = jwt.sign(payload, config.secretJwt, { expiresIn: '1h' });
        
          // @ts-ignore
          // Récupére les heures d'émission et d'expiration
          let {iat, exp} = jwt.decode(token);
          
          restifyRes.send(200, {token, iat, exp});
        // Si le password décrypté ne macth pas avec le password renseigné par l'utilisateur
        } else {
          restifyRes.send(500, { message: 'Password is incorrect' });
        }
      });
    }
  })
  .catch((err) => {
    restifyRes.send(500, err);
  });
}

export default auth;
