const express = require('express');
const app = express();

const TimetableService = require('./index');
const timetableService = new TimetableService();

const NeisService = require('./meal');
const neisService = new NeisService();

app.get('/', async (req, res) => {
    res.redirect('https://github.com/suk-6/dytimetable');
});

app.get('/install', async (req, res) => {
    res.sendFile(__dirname + '/static/install.html');
});

app.get('/getTable/:grade/:classroom', async (req, res) => {
    const { grade, classroom } = req.params;
    const timetable = await timetableService.getTimetable();
    res.json(timetable[grade][classroom]);
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

app.get('/getnotice/:grade/:classroom', async (req, res) => {
    const { grade, classroom } = req.params;
    // const notice = await timetableService.getNotice();
    // res.json(notice[grade][classroom]);
    res.json([[0, "OOO 선생님의 메세지", "테스트 본문 내용", "5분 전"], [1, "OOO 선생님의 메세지 2", "테스트 본문 내용 2", "1시간 전"]]);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});