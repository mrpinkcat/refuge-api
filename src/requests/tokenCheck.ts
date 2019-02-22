import { Request, Response } from 'restify';

const tokenCheck = (req: Request, res: Response) => {
  console.log('GET /tokencheck');
  res.send(200);
}

export default tokenCheck;
