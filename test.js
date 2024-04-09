const push = require('./push');

push.sendNotificationByTopic(`1-10`, `테스트 title`, `테스트 body`, { click_action: "test" });