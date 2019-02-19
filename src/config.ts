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

// Check les info de connexion à la base
let user: string, pass: string, ip: string, port: number, collection: string;
if (typeof process.env.MONGO_USER === 'string' && typeof process.env.MONGO_PASS === 'string' && typeof process.env.MONGO_IP === 'string' && typeof process.env.MONGO_PORT === 'string' && typeof process.env.MONGO_COLLECTION === 'string') {
  user = process.env.MONGO_USER;
  pass = process.env.MONGO_PASS;
  ip = process.env.MONGO_IP;
  port = parseInt(process.env.MONGO_PORT);
  collection = process.env.MONGO_COLLECTION;
} else {
  console.log('ERROR: Missing mongodb info !');
  user = '';
  pass = '';
  ip = '';
  port = 0;
  collection = '';
  process.exit(0);
}

// Interface de l'export
interface ConfigRefugeAPI {
  secretJwt: string;
  mongo: MongoConfig;
}

// Interface des info de connexion à la base
interface MongoConfig {
  user: string;
  pass: string;
  ip: string;
  port: number;
  collection: string;
}

// Object de l'export
let configRefugeAPI: ConfigRefugeAPI = {
  secretJwt,
  mongo: {
    user,
    pass,
    ip,
    port,
    collection,
  },
}

export default configRefugeAPI;