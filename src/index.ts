// Libraries
import 'reflect-metadata';
import { createConnection, Entity, EntityNotFoundError, IsNull } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import * as helmet from 'helmet';

// Internal dependencies
import { FileSystem } from './utils/file-system';
import { Link } from './models/link';
import { Visit } from './models/visit';

createConnection()
  .then(async (connection) => {
    const app = express();
    const port = process.env.PORT || 3000;

    // Before middlewares
    app.use(helmet());

    app.get('/:slug', async (req: Request, res: Response) => {
      let link: Link;

      try {
        link = await Link.findOneOrFail({
          slug: req.params.slug,
          disabledAt: IsNull(),
        });
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          return res
            .status(404)
            .sendFile(FileSystem.resolveErrorsFolder('404'));
        }

        console.error(error);

        return res.status(500).sendFile(FileSystem.resolveErrorsFolder('500'));
      }

      const visit = new Visit();
      visit.linkId = link.id;
      visit.ipAddress = req.ip;
      visit.referrer = req.get('referrer');
      visit.userAgent = req.get('user-agent');

      try {
        await visit.save();
      } catch (error) {
        console.error('An error ocurred while storing a new visit', error);

        return res.status(500).sendFile(FileSystem.resolveErrorsFolder('500'));
      }

      res.redirect(302, link.target);
    });

    app.get('*', (req: Request, res: Response) => {
      return res.sendFile(FileSystem.resolveErrorsFolder('404'));
    });

    app.listen(port, () =>
      console.log(`Server up and running at port ${port}`)
    );
  })
  .catch((error) => console.error(error));
