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

    async messageGenerator(title, body, topic, data) {
        return {
            notification: {
                title,
                body
            },
            topic,
            data: data || {},
            android: {
                priority: "high",
                ttl: 10 * 60 * 1000, // 10 minutes
                notification: {
                    sound: "default"
                }
            },
            apns: {
                headers: {
                    "apns-priority": "10",
                    "apns-expiration": "600", // 10 minutes
                },
                payload: {
                    aps: {
                        badge: 0,
                        sound: "default"
                    }
                }
            }
        }
    }

    async sendNotificationByTopic(topic, title, body, data) {
        const message = await this.messageGenerator(title, body, topic, data);

        try {
            await admin.messaging().send(message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

module.exports = new PushService();