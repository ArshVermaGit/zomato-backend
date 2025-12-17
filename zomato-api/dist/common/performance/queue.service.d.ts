import Bull, { Queue, Job } from 'bull';
export interface QueueJob<T = any> {
    name: string;
    data: T;
    options?: Bull.JobOptions;
}
export declare class QueueService {
    private queues;
    constructor();
    createQueue(name: string, options?: Bull.QueueOptions): Queue;
    getQueue(name: string): Queue | undefined;
    addJob<T>(queueName: string, jobName: string, data: T, options?: Bull.JobOptions): Promise<Job<T>>;
    sendOrderConfirmation(orderId: string): unknown;
    assignDeliveryPartner(orderId: string): unknown;
    sendPushNotification(userId: string, title: string, body: string): unknown;
    sendEmail(to: string, subject: string, template: string, data: any): unknown;
}
export declare function ProcessJob(queueName: string, jobName: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
