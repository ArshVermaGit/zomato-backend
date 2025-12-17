"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
exports.ProcessJob = ProcessJob;
const common_1 = require("@nestjs/common");
const bull_1 = __importDefault(require("bull"));
let QueueService = class QueueService {
    queues = new Map();
    constructor() {
        this.createQueue('orders');
        this.createQueue('notifications');
        this.createQueue('emails');
    }
    createQueue(name, options) {
        const queue = new bull_1.default(name, process.env.REDIS_URL || 'redis://localhost:6379', {
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
        });
        this.queues.set(name, queue);
        return queue;
    }
    getQueue(name) {
        return this.queues.get(name);
    }
    async addJob(queueName, jobName, data, options) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        return queue.add(jobName, data, options);
    }
    async sendOrderConfirmation(orderId) {
        return this.addJob('notifications', 'order-confirmation', { orderId });
    }
    async assignDeliveryPartner(orderId) {
        return this.addJob('orders', 'assign-delivery-partner', { orderId });
    }
    async sendPushNotification(userId, title, body) {
        return this.addJob('notifications', 'push', { userId, title, body });
    }
    async sendEmail(to, subject, template, data) {
        return this.addJob('emails', 'send', { to, subject, template, data });
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueService);
function ProcessJob(queueName, jobName) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('bull:job', { queueName, jobName }, target, propertyKey);
        return descriptor;
    };
}
//# sourceMappingURL=queue.service.js.map