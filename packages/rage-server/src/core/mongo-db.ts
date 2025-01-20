import mongoose from 'mongoose';
import { logger } from './logger.config';

const dbLogger = logger('database');

const DEFAULT_DB_URL = 'mongodb://host.docker.internal:27017/revolt_rp';

const handleDatabaseConnection = () => {
  dbLogger.log('info', 'Database connected successfully');
};

const handleDatabaseConnectionError = (error: never) => {
  dbLogger.log('error', error);
};

mongoose.connect(process.env['DATABASE_URL'] || DEFAULT_DB_URL)
  .then(handleDatabaseConnection)
  .catch(handleDatabaseConnectionError);


