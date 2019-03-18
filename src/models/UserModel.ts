import { Schema, model } from 'mongoose';
import config from './../config';
import { hash } from 'bcrypt';

// pour metre le un text en full minuscule (pour éviter les doublons d'email par exemple)
const toLower = (text: string): string => {
  return text.toLocaleLowerCase();
}

const hashPassword = (pass: string): Promise<string> => (
  hash(pass, config.bcrypt.saltRound)
  .then(hash => {
    return hash
  })
  .catch(err => {
    process.exit(1);
    return '';
  })
)

let UserShema = new Schema({
  email: { 
    required: true,
    type: String,
    validate: {
      validator: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Email is invalid',
    },
    unique: true,
    set: toLower,
  },
  password: { 
    required: true,
    type: String,
    validate: {
      validator: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g,
      message: 'Password must contain a minimum of eight characters, at least one letter and one number',
    },
    write: hashPassword,
  },
  firstname: { 
    required: true,
    type: String,
  },
  lastname: { 
    required: true,
    type: String,
  },
  phone: { 
    required: false,
    type: String,
    validate: {
      validator: /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
      message: 'Phone number is invalid',
    },
  },
  admin: { 
    required: false,
    type: Boolean,
    default: false,
  },
});

UserShema.plugin(require('mongoose-async'))

let User = model('User', UserShema);

export default User;