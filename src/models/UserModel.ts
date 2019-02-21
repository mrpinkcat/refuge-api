import { Schema, model } from 'mongoose';

let UserShema = new Schema({
  email: { 
    required: true,
    type: String,
    validate: {
      validator: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Email is invalid',
    },
    unique: true,
  },
  password: { 
    required: true,
    type: String,
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
})

let User = model('User', UserShema);

export default User;