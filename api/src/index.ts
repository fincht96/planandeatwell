import Bootstrap from './app/bootstrap';

const bootstrap = new Bootstrap();
bootstrap.run((port: string) =>
  console.log(`Server started and running on port ${port}.`)
);
