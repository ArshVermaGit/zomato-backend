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
    sendOrderConfirmation(orderId: string): Promise<Bull.Job<{
        orderId: string;
    }>>;
    assignDeliveryPartner(orderId: string): Promise<Bull.Job<{
        orderId: string;
    }>>;
    sendPushNotification(userId: string, title: string, body: string): Promise<Bull.Job<{
        userId: string;
        title: string;
        body: string;
    }>>;
    sendEmail(to: string, subject: string, template: string, data: any): Promise<Bull.Job<{
        to: string;
        subject: string;
        template: string;
        data: any;
    }>>;
}
export declare function ProcessJob(queueName: string, jobName: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
