const Notice = require('./schemas/notice');
require('./schemas');

class NoticeService {
    constructor() { }
    async getEveryoneNotice() {
        const notices = await Notice.find({ receiver: 'all' }).sort({ createdAt: -1 });

        const result = [];

        for (const notice of notices) {
            const elapsedTime = await this.elapsedTime(notice.createdAt);
            result.push([notice._id, notice.title, notice.content, elapsedTime]);
        }

        return result;
    }

    async getNoticebySender(sender) {
        const notices = await Notice.find({ sender }).sort({ createdAt: -1 });

        const result = [];

        for (const notice of notices) {
            const elapsedTime = await this.elapsedTime(notice.createdAt);
            result.push([notice._id, notice.title, notice.content, elapsedTime]);
        }

        return result;
    }

    async getNoticebyReceiver(receiver) {
        const notices = await Notice.find({ receiver }).sort({ createdAt: -1 });

        const result = [];

        for (const notice of notices) {
            const elapsedTime = await this.elapsedTime(notice.createdAt);
            result.push([notice._id, notice.title, notice.content, elapsedTime]);
        }

        return result;
    }

    async getNoticebyClassroom(grade, classroom) {
        const notices = await Notice.find({ $or: [{ receiver: `${grade}-${classroom}` }, { receiver: 'all' }] }).sort({ createdAt: -1 });

        const result = [];

        for (const notice of notices) {
            const elapsedTime = await this.elapsedTime(notice.createdAt);
            result.push([notice._id, notice.title, notice.content, elapsedTime]);
        }

        return result;
    }

    async createNotice(sender, title, content, receiver) {
        const notice = new Notice({ sender, title, content, receiver });
        return notice.save();
    }

    async elapsedTime(start) {
        const end = new Date();

        const diff = (end - start) / 1000;

        const times = [
            { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
            { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
            { name: '일', milliSeconds: 60 * 60 * 24 },
            { name: '시간', milliSeconds: 60 * 60 },
            { name: '분', milliSeconds: 60 },
        ];

        for (const value of times) {
            const betweenTime = Math.floor(diff / value.milliSeconds);

            if (betweenTime > 0) {
                return `${betweenTime}${value.name} 전`;
            }
        }
        return '방금 전';
    }
}

module.exports = NoticeService;