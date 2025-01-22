import mongoose from 'mongoose';
import { logger } from './logger.config';

const dbLogger = logger('database');

const DATABASE_URI = process.env['DATABASE_URL'] || 'mongodb://host.docker.internal:27017/revolt_rp';

const handleDatabaseConnection = () => {
  dbLogger.log('info', 'Database connected successfully');
};

const handleDatabaseConnectionError = (error: never) => {
  dbLogger.log('error', error);
};

mongoose.connect(DATABASE_URI)
  .then(handleDatabaseConnection)
  .catch(handleDatabaseConnectionError);


