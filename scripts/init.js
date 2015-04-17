module.exports = function(robot) {
	robot.sessionMapping = robot.sessionMapping || {};

	// step 1
	robot.hear(/deploy/i, function(res) {
		var user = res.message.user.name;

		robot.sessionMapping[user] = {
			step: '1',
			environment: null
			service: null
		};

		res.send('Ok! Are you deploying a frontend or backend service?');
	});

	robot.hear(/frontend/i, function(res) {
		var user = res.message.user.name;

		if (robot.sessionMapping[user] !== '1') {
			return;
		}

		robot.sessionMapping[user] = {
			step: '2',
			environment: null,
			service: 'frontend'
		};

		res.send('Are you deploying to production or QA?');
	});

	robot.hear(/backend/i, function(res) {
		var user = res.message.user.name;

		if (robot.sessionMapping[user] !== '1') {
			return;
		}

		robot.sessionMapping[user] = {
			step: '2',
			environment: null,
			service: 'backend'
		};

		res.send('Are you deploying to production or QA?');
	});

	// prod.js

	// robot.hear(/production/i, function(res) {
	// 	var user = res.message.user.name;

	// 	if (robot.sessionMapping[user] !== '2') {
	// 		return;
	// 	}

	// 	robot.sessionMapping[user].step = 'prod-1';
	// 	robot.sessionMapping[user].environment = 'prod';

	// 	res.send('Prod question number 1');
	// });
};