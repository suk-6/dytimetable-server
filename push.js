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

    async messageGenerator(title, body, topic, data, type) {
        if (data === undefined) data = {
            title: title,
            body: body
        };
        else {
            data["title"] = title;
            data["body"] = body;
        }

        let message = {
            notification: {
                title,
                body
            },
            topic,
            data: data,
            android: {
                collapseKey: type,
                priority: "high",
                ttl: 10 * 60 * 1000, // 10 minutes
                notification: {
                    tag: type === "period" ? type : null,
                    sound: "default",
                    priority: "high",
                    visibility: "public",
                    channelId: "high_importance_channel",
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

        // if (type === "period") message.apns.headers["apns-id"] = type;

        return message;
    }

    async sendNotificationByTopic(type, topic, title, body, data) {
        const message = await this.messageGenerator(title, body, topic, data, type);

        try {
            await admin.messaging().send(message).then((response) => {
                console.log(new Date(), topic, body, response);
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

module.exports = new PushService();