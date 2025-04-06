import { sendVerificationEmail } from "./email.service";

type EmailJob = {
  email: string;
  token: string;
};

class EmailQueue {
  private queue: EmailJob[] = [];
  private isProcessing: boolean = false;

  addToQueue(job: EmailJob) {
    this.queue.push(job);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const job = this.queue.shift();
      if (job) {
        // Use setImmediate to make this truly asynchronous
        setImmediate(async () => {
          try {
            await sendVerificationEmail(job.email, job.token);
          } catch (error) {
            console.error(
              `Failed to send verification email to ${job.email}:`,
              error
            );
          }
        });
      }
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }
}

export const emailQueue = new EmailQueue();
