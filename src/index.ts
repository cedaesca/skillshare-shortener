import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as helmet from 'helmet';

createConnection()
  .then(async (connection) => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Before middlewares
    app.use(helmet());

    app.listen(port, () =>
      console.log(`Server up and running at port ${port}`)
    );
  })
  .catch((error) => console.error(error));
