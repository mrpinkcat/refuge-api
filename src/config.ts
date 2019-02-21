import { config } from 'dotenv';

// import les variables d'environnement
config();

// Check le secret jwt
let secretJwt: string;
if (typeof process.env.SECRET_JSON_WEB_TOKEN === 'string' ) {
  secretJwt = process.env.SECRET_JSON_WEB_TOKEN;
} else {
  console.log('ERROR: Missing JWT secret !');
  secretJwt = '';
  process.exit(0);
}

// Check les infos de connexion à la base
let user: string, pass: string, ip: string, port: number, database: string;
if (typeof process.env.MONGO_USER === 'string' && typeof process.env.MONGO_PASS === 'string' && typeof process.env.MONGO_IP === 'string' && typeof process.env.MONGO_PORT === 'string' && typeof process.env.MONGO_DB === 'string') {
  user = process.env.MONGO_USER;
  pass = process.env.MONGO_PASS;
  ip = process.env.MONGO_IP;
  port = parseInt(process.env.MONGO_PORT);
  database = process.env.MONGO_DB;
} else {
  console.log('ERROR: Missing mongodb info !');
  user = '';
  pass = '';
  ip = '';
  port = 0;
  database = '';
  process.exit(0);
}

// Check les infos de cryptage
let saltRound: number;
if (typeof process.env.BCRYPT_SALT_ROUNDS === 'string') {
  saltRound = parseInt(process.env.BCRYPT_SALT_ROUNDS);
} else {
  console.log('ERROR: Missing bcrypt info !');
  saltRound = 0;
  process.exit(0);
}

// Interface de l'export
interface ConfigRefugeAPI {
  secretJwt: string;
  mongo: MongoConfig;
  bcrypt: BcryptConfig;
}

// Interface des infos de connexion à la base
interface MongoConfig {
  user: string;
  pass: string;
  ip: string;
  port: number;
  database: string;
}

// Interface des infos de cryptage
interface BcryptConfig {
  saltRound: number;
}

// Object de l'export
let configRefugeAPI: ConfigRefugeAPI = {
  secretJwt,
  mongo: {
    user,
    pass,
    ip,
    port,
    database,
  },
  bcrypt: {
    saltRound,
  },
}

export default configRefugeAPI;