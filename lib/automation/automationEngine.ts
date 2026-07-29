export type AutomationJob = {

  id: string;

  name: string;

  execute: () => Promise<void>;

};

const jobs: AutomationJob[] = [];

export function registerJob(
  job: AutomationJob
) {

  jobs.push(job);

}

export async function runJobs() {

  for (const job of jobs) {

    await job.execute();

  }

}
