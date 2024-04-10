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
            this.isSetted = true;
        });
    }

    async getTimetable() {
        if (!this.isSetted) {
            return "Timetable is not setted yet.";
        }
        return await this.timetable.getTimetable();
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

                const classTime = todayTimetableByClass[period]["classTime"];

                push.sendNotificationByTopic(`${grade}-${classroom}`, `다음 시간 알림`, `${classTime}교시 [${subject}] 입니다.`);
            }
        }
    }

    async checkSportsDay(grade, classroom) {
        const now = new Date();
        const timetable = await this.timetable.getTimetable();
        const todayTimetableByClass = timetable[grade][classroom][now.getDay() - 1];
        for (let period = 0; period < todayTimetableByClass.length; period++) {
            if (['체육A', '체육B', '스포츠'].includes(todayTimetableByClass[period]["subject"])) {
                return todayTimetableByClass[period]["classTime"];
            }
        }

        return null;
    }

    async sendSportsAlert() {
        const now = new Date();
        if (now.getDay() === 0 || now.getDay() === 6) return;

        const morningTime = await this.getMonringTime();

        if (now.getHours() === morningTime.getHours() && now.getMinutes() === morningTime.getMinutes()) {
            const timetable = await this.timetable.getTimetable();
            for (let grade = 1; grade <= Object.keys(timetable).length; grade++) {
                for (let classroom = 1; classroom <= Object.keys(timetable[grade]).length; classroom++) {
                    const period = await this.checkSportsDay(grade, classroom);
                    if (period !== null) {
                        push.sendNotificationByTopic(`${grade}-${classroom}`, `체육복 알림`, `오늘 ${period}교시에 체육이 있습니다. 체육복을 챙겨주세요.`);
                    }
                }
            }
        }
    }

    async getMonringTime() {
        const now = new Date();
        now.setHours(7);
        now.setMinutes(0);

        return now;
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
        console.log("Setting schedule...")
        cron.schedule("* 6-17 * * 1-5", async () => {
            this.sendSportsAlert();
            const period = await this.checkClassTime();
            if (period === undefined) return;

            this.sendTimetable(period);
        });
    }
}

module.exports = TimetableService;