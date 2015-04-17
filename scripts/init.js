module.exports = function(robot) {
  robot.sessionMapping = robot.sessionMapping || {};

  robot.hear(/deploy/i, function(res) {
    var user = res.message.user.name;

    robot.sessionMapping[user] = {
      step: '1',
      environment: null,
      service: null
    };

    res.send('Ok! Are you deploying a frontend or backend service?');
  });

  robot.hear(/(^|\b)(frontend|front-end|fe)(\b|$)/i, function(res) {
    var user = res.message.user.name;

    if (robot.sessionMapping[user].step !== '1') {
      return;
    }

    robot.sessionMapping[user] = {
      step: '2',
      environment: null,
      service: 'frontend'
    };

    res.send('Are you deploying to production or QA?');
  });

  robot.hear(/(^|\b)(backend|back-end|be)(\b|$)/i, function(res) {
    var user = res.message.user.name;

    if (robot.sessionMapping[user].step !== '1') {
      return;
    }

    robot.sessionMapping[user] = {
      step: '2',
      environment: null,
      service: 'backend'
    };

    res.send('Are you deploying to production or QA?');
  });
};
