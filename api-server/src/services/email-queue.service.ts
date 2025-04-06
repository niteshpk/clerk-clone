import { sendVerificationEmail, sendPasswordResetEmail } from "./email.service";

type EmailJob = {
  email: string;
  token: string;
  type: "verification" | "reset";
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
            if (job.type === "verification") {
              await sendVerificationEmail(job.email, job.token);
            } else {
              await sendPasswordResetEmail(job.email, job.token);
            }
          } catch (error) {
            console.error(`Failed to send email to ${job.email}:`, error);
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
