import User from './UserModel';

let authenticate = (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    User.findOne({username, password}, (err, data) => {
      if (err) return reject(err);
      resolve({data});
    });
  });
};

export default authenticate;