import { on } from '@libertymp/rage-rpc';
import { createCriminalRecord } from './criminal-record.service';


on('aa', () => createCriminalRecord());
