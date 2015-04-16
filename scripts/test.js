module.exports = function(robot) {
	var sessionMapping = {
		// userName: currentStep
	};

	// step 1
	robot.hear(/deploy/i, function(res) {
		var user = res.message.user.name;

		sessionMapping[user] = 1;
		res.send('Ok! What environment would you like to deploy to? QA or Production?');
	});

	// step 2
	robot.hear(/qa/i, function(res) {
		var user = res.message.user.name;

		if (sessionMapping[user] !== 1) {
			return;
		}

		res.send('Great. Have you created a retail release request ticket?');
	});

	robot.hear(/reset/i, function(res) {
		var user = res.message.user.name;

		if (user) {
			delete sessionMapping[user];
		}

		res.send(200);
	});
};