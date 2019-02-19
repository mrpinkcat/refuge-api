import { Schema, model } from 'mongoose';

let UserShema = new Schema({
  username: String,
  password: String,
  admin: Boolean,
  email: String,
})

let User = model('User', UserShema);

export default User;