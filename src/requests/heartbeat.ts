import { Request, Response } from 'restify';

const hearbeat = (req: Request, res: Response) => {
  console.log('GET /hearbeat');
  res.send(200);
}

export default hearbeat;
