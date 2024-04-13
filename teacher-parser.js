require('dotenv').config();
const fs = require('fs');

class ComciganTeacherParser {
    constructor() {
        this._init = false;
        this._data = null;
        this._weekdayString = ['일', '월', '화', '수', '목', '금', '토'];
        this.renewTime = null;

        this.init().then(() => {
            this._init = true;
            // fs.writeFileSync('timetable.json', JSON.stringify(this._data));
        });
    }

    async init() {
        this._data = await this.getComciganData();

        return;
    }

    async renewData(force = false) {
        if (this.renewTime != null && this._data != null && new Date() - this.renewTime < 1000 * 60 * 10 && !force)
            return;

        this._data = await this.getComciganData();
        this.renewTime = new Date();
        console.log('Teacher data renewed');

        return;
    }

    async getComciganData() {
        const query = '36179_T?' + btoa(`73629_${process.env.SCHOOL_CODE}_0_`);
        const data = await fetch(`http://comci.net:4082/${query}`)
            .then(res => res.text())
            .then(data => data.substr(0, data.lastIndexOf('}') + 1))
            .then(data => JSON.parse(data))

        return data;
    }

    async getTeachers() {
        if (!this._init) return;

        return this._data['자료446'];
    }

    async getAllTimetable() {
        if (!this._init) return;

        const result = [];

        for (let teacherNo = 1; teacherNo <= this._data['교사수']; teacherNo++) {
            result.push(await this.getTimetableByTeacherNo(teacherNo));
        }

        return result;
    }

    async getTimetableByTeacherNo(teacherNo) {
        if (!this._init) return;

        const teacherName = this._data['자료446'][teacherNo]
        const teacherTable = this._data['자료542'][teacherNo];
        const separator = this._data['분리'];

        const results = [];

        for (let weekday = 1; weekday <= 5; weekday++) {
            results.push([]);
            for (let period = 1; period <= 7; period++) {
                results[weekday - 1].push(null);

                const data = teacherTable[weekday][period]
                if (data > 100) {
                    const classroom = data % separator;
                    const grade = Math.floor(classroom / 100);
                    const classroomNo = classroom % 100;
                    const subject = Math.floor(data / separator) % separator;
                    const result = {
                        teacher: teacherName,
                        weekday,
                        weekdayString: this._weekdayString[weekday],
                        period,
                        grade,
                        classroom: classroomNo,
                        subject: this._data['자료492'][subject]
                    }

                    results[weekday - 1][period - 1] = result;
                }
            }
        }

        return results;
    }
}

module.exports = ComciganTeacherParser;