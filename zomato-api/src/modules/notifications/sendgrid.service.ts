import { Injectable } from '@nestjs/common';
// import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
    constructor() {
        // if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        // if (process.env.NODE_ENV !== 'production') 
        return console.log(`[SendGrid] Sending Email to ${to}: ${subject}`);

        /*
        try {
            await sgMail.send({
                to,
                from: 'noreply@zomato-clone.com',
                subject,
                text,
                html: html || text,
            });
        } catch (error) {
            console.error('SendGrid Error:', error);
        }
        */
    }
}
