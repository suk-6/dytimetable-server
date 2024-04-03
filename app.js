const express = require('express');
const app = express();
const TimetableService = require('./index');
const timetableService = new TimetableService();

app.get('/install', async (req, res) => {
    const UA = req.headers['user-agent'];
    if (UA.includes('Android')) {
        res.send('Android');
    }
    else if (UA.includes('iPhone')) {
        res.send('iPhone');
    }
    else {
        res.send('PC');
    }
});

app.get('/getTable/:grade/:classroom', async (req, res) => {
    const { grade, classroom } = req.params;
    const timetable = await timetableService.getTimetable();
    res.json(timetable[grade][classroom]);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});