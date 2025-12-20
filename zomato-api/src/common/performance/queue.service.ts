import { Injectable } from '@nestjs/common';
import Bull, { Queue, Job } from 'bull';

export interface QueueJob<T = any> {
  name: string;
  data: T;
  options?: Bull.JobOptions;
}

@Injectable()
export class QueueService {
  private queues: Map<string, Queue> = new Map();

  constructor() {
    // Initialize default queues
    this.createQueue('orders');
    this.createQueue('notifications');
    this.createQueue('emails');
  }

  createQueue(name: string, options?: Bull.QueueOptions): Queue {
    const queue = new Bull(
      name,
      process.env.REDIS_URL || 'redis://localhost:6379',
      {
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
        ...options,
      },
    );

    this.queues.set(name, queue);
    return queue;
  }

  getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  async addJob<T>(
    queueName: string,
    jobName: string,
    data: T,
    options?: Bull.JobOptions,
  ): Promise<Job<T>> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    return queue.add(jobName, data, options);
  }

  // Convenience methods for common jobs
  async sendOrderConfirmation(orderId: string) {
    return this.addJob('notifications', 'order-confirmation', { orderId });
  }

  async assignDeliveryPartner(orderId: string) {
    return this.addJob('orders', 'assign-delivery-partner', { orderId });
  }

  async sendPushNotification(userId: string, title: string, body: string) {
    return this.addJob('notifications', 'push', { userId, title, body });
  }

  async sendEmail(to: string, subject: string, template: string, data: any) {
    return this.addJob('emails', 'send', { to, subject, template, data });
  }
}

// Job processor decorator helper
export function ProcessJob(queueName: string, jobName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // This would be used with Bull's process decorator in NestJS
    Reflect.defineMetadata(
      'bull:job',
      { queueName, jobName },
      target,
      propertyKey,
    );
    return descriptor;
  };
}
