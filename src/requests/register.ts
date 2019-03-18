import User from '../models/UserModel';
import { Request, Response } from 'restify'

interface UserInfo {
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  phone?: String,
  admin?: Boolean,
}

const register = (restifyReq: Request, restifyRes: Response) => {
  console.log(`POST /register`);

  // Création de l'objet user
  let userInfo: UserInfo = {
    email: restifyReq.body.email,
    password: restifyReq.body.password,
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
}

export default register;
