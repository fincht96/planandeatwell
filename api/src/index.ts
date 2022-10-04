import Bootstrap from './app/bootstrap';
import * as dotenv from 'dotenv';
dotenv.config();

const bootstrap = new Bootstrap();
bootstrap.run((port: string) =>
  console.log(`Server started and running on port ${port}.`)
);

// console.log('hello');
