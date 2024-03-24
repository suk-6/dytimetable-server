const admin = require('firebase-admin');
const serverAccount = require('./firebase.json');

class PushService {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(
                serverAccount,
            ),
        });
    }

    async sendNotificationToAll(title, body) {
        const message = {
            notification: {
                title,
                body,
            },
            topic: 'all',
        };

        try {
            await admin.messaging().send(message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async sendNotificationByTopic(topic, title, body) {
        const message = {
            notification: {
                title,
                body,
            },
            topic,
        };

        try {
            await admin.messaging().send(message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

module.exports = new PushService();