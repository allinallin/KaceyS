module.exports = function(robot) {
	robot.sessionMapping = robot.sessionMapping || {};

	robot.hear(/qa/i, function(res) {
		var user = res.message.user.name;

		if (robot.sessionMapping[user] !== '2') {
			return;
		}

		robot.sessionMapping[user].step = 'qa-1';
		robot.sessionMapping[user].environment = 'qa';

		res.send('QA question number 1');
	});
};