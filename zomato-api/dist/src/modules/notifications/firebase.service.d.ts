export declare class FirebaseService {
    constructor();
    sendPushNotification(token: string, title: string, body: string, data?: any): Promise<void>;
}
