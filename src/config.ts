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

// Check les infos de cryptage
let secretBcript: string, saltRound: number;
if (typeof process.env.BCRIPT_SECRET === 'string' && typeof process.env.BCRIPT_SALT_ROUNDS === 'string') {
  secretBcript = process.env.BCRIPT_SECRET;
  saltRound = parseInt(process.env.BCRIPT_SALT_ROUNDS);
} else {
  secretBcript = '';
  saltRound = 0;
  process.exit(0);
}

// Interface de l'export
interface ConfigRefugeAPI {
  secretJwt: string;
  mongo: MongoConfig;
  bcript: BcriptConfig;
}

// Interface des infos de connexion à la base
interface MongoConfig {
  user: string;
  pass: string;
  ip: string;
  port: number;
  collection: string;
}

// Interface des infos de cryptage
interface BcriptConfig {
  secret: string;
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
    collection,
  },
  bcript: {
    secret: secretBcript,
    saltRound,
  },
}

export default configRefugeAPI;