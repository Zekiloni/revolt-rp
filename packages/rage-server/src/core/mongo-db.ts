import mongoose from 'mongoose';
import { logger } from './logger.config';

const dbLogger = logger('database');

const handleDatabaseConnection = () => {
  dbLogger.log('info', 'Database connected successfully');
};

const handleDatabaseConnectionError = (error: any) => {
  dbLogger.log('error', error);
};

mongoose.connect('mongodb://host.docker.internal:27017/bcrp_rage')
  .then(handleDatabaseConnection)
  .catch(handleDatabaseConnectionError);


