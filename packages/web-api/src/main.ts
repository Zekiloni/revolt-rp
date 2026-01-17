import express from 'express';
import cors from 'cors';
import * as path from 'path';

import dotenv from 'dotenv';
dotenv.config();


import compression from 'compression';
import { connect } from '@revolt-rp/core';
import controller from './controller';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

connect();

app.use(express.json());
app.use(cors());
app.use(compression());

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: 0,
  etag: false,
  lastModified: false,
  cacheControl: false
}));

app.use('/assets', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/uploads', express.static(path.resolve(path.join(__dirname, 'uploads'))));

app.use('/api', controller);

app.listen(port, host, () => {
  console.log(`ssss http://${host}:${port}`);
});
