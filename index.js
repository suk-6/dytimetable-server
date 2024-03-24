const Timetable = require('comcigan-parser');
const cron = require("node-cron");
const push = require('./push');
require("dotenv").config();

class TimetableService {
    constructor(timetable = new Timetable()) {
        this.timetable = timetable;
        timetable.init().then(() => {
            timetable.setSchool(process.env.SCHOOL_CODE);
            this.classTimes = timetable.getClassTime();
            this.setSchedule();
        });
    }

    async sendTimetable(period) {
        const now = new Date();
        const timetable = await this.timetable.getTimetable();
        for (let grade = 1; grade <= Object.keys(timetable).length; grade++) {
            for (let classroom = 1; classroom <= Object.keys(timetable[grade]).length; classroom++) {
                const todayTimetableByClass = timetable[grade][classroom][now.getDay() - 1];
                if (todayTimetableByClass[period] === undefined) continue;

                const subject = todayTimetableByClass[period]["subject"];
                if (subject === '') continue;

                push.sendNotificationByTopic(`${grade}-${classroom}`, `다음 시간 알림`, `${parseInt(period) + 1}교시 [${subject}] 입니다.`);
            }
        }
    }


    async checkClassTime() {
        const now = new Date();
        if (now.getDay() === 0 || now.getDay() === 6) return;

        const currentTime = now.getTime();
        const classTimes = await this.classTimes;
        for (let i = 0; i < classTimes.length; i++) {
            const times = await classTimes[i].match(/\d{2}/g);
            const classTime = new Date();
            classTime.setHours(times[0]);
            classTime.setMinutes(times[1]);
            const breaks = classTime.getTime() - 10 * 60000;

            if (currentTime === breaks) {
                return i.toString();
            }
        }

        return;
    }

    async setSchedule() {
        cron.schedule("* 7-17 * * 1-5", async () => {
            const period = await this.checkClassTime();
            if (period === undefined) return;

            this.sendTimetable(period);
        });
    }
}

new TimetableService();