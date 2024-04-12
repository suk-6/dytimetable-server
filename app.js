const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const TimetableService = require('./table');
const timetableService = new TimetableService();

const NeisService = require('./meal');
const neisService = new NeisService();

const NoticeService = require('./notice');
const noticeService = new NoticeService();

const TeacherService = require('./teacher');
const teacherService = new TeacherService();

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.redirect('https://github.com/suk-6/dytimetable');
});

app.get('/install', async (req, res) => {
    res.sendFile(__dirname + '/static/install.html');
});

app.get('/getTeachers', async (req, res) => {
    const teachers = await teacherService.getTeachers();
    res.json(teachers);
});

app.get('/getTable/:grade/:classroom', async (req, res) => {
    const { grade, classroom } = req.params;
    if (grade == 'teacher') {
        const timatable = await teacherService.getTimetableByTeacherNo(classroom);
        res.json(timatable);
    } else {
        const timetable = await timetableService.getTimetable();
        res.json(timetable[grade][classroom]);
    }
});

app.get('/getmeal', async (req, res) => {
    let data = [];

    const day = new Date();
    for (i = 0; i < 5; i++) {
        if (day.getDay() === 6) day.setDate(day.getDate() + 1);
        if (day.getDay() === 0) day.setDate(day.getDate() + 1);
        await neisService.getDiet(day).then((result) => {
            data[i] = result
        });

        day.setDate(day.getDate() + 1);
    }

    res.json(data);
});

app.post('/sendnotice', async (req, res) => {
    const { sender, title, content, password, receiver } = req.body;

    if (password !== process.env.NOTICE_PASSWORD) {
        res.send('비밀번호 오류입니다.');
        return;
    }

    noticeService.createNotice(sender, title, content, receiver);
    res.send('전송에 성공했습니다.');
});

app.get('/getnotice/:grade/:classroom', async (req, res) => {
    const { grade, classroom } = req.params;
    const notice = await noticeService.getNoticebyClassroom(grade, classroom);
    res.json(notice);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});