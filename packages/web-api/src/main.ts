import express from 'express';
import cors from 'cors';
import * as path from 'path';
import controller from './controller';
import compression from 'compression';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());

const assetsPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(assetsPath, {
  maxAge: '15d',
  etag: false,
}));

app.use('/api', controller);

app.listen(port, host, () => {
  console.log(`visit http://${host}:${port}`);
});
