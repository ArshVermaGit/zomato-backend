import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor() {
    // Initialize Firebase Admin SDK if not already initialized
    if (admin.apps.length === 0) {
      // Check for credentials in env or use default (mock/dev)
      // admin.initializeApp({ credential: admin.credential.applicationDefault() });
      // For now, avoiding actual init to prevent errors if no creds
    }
  }

  sendPushNotification(
    token: string,
    title: string,
    _body: string,
    _data?: any,
  ) {
    // if (process.env.NODE_ENV !== 'production') return console.log('Mock Push:', { token, title });

    try {
      // await admin.messaging().send({ token, notification: { title, body }, data });
      console.log(`[Firebase] Sending Push to ${token}: ${title}`);
    } catch (error) {
      console.error('Firebase Error:', error);
    }
  }
}
