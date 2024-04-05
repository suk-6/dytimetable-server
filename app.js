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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    console.log("🚀 ~ app.get ~ today:", today)
    console.log("🚀 ~ app.get ~ tomorrow:", tomorrow)

    await neisService.getDiet(date).then((result) => {
        data[0] = result
    });

    await neisService.getDiet(date).then((result) => {
        data[1] = result
    });

    res.json(data);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});