const Notice = require('./schemas/notice');
require('./schemas');

class NoticeService {
    constructor() {
        this.createNotice('system', 'system님의 공지입니다.', '테스트 메세지입니다.', '1-10');
    }

    async getNoticebyClassroom(grade, classroom) {
        const notices = await Notice.find({ receiver: `${grade}-${classroom}` }).sort({ createdAt: -1 });

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