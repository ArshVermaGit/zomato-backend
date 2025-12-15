import { Injectable } from '@nestjs/common';
// import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
    // private client: Twilio;

    constructor() {
        // if (process.env.TWILIO_SID) this.client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }

    async sendSms(to: string, body: string) {
        // if (process.env.NODE_ENV !== 'production') 
        return console.log(`[Twilio] Sending SMS to ${to}: ${body}`);

        /*
        try {
            await this.client.messages.create({
                body,
                to,
                from: process.env.TWILIO_PHONE_NUMBER
            });
        } catch (error) {
             console.error('Twilio Error:', error);
        }
        */
    }
}
