import { registerJob } from './base-job.service';
import { SanitationJob } from './sanitation-job.model';


(() => {
  registerJob(new SanitationJob());
})();
