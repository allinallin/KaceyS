module.exports = function(robot) {
  robot.sessionMapping = robot.sessionMapping || {};
  /**
   * qa-1 Make a release ticket.
   * qa-2 DB Migration.
   * qa-3 stack update
   * qa-4 release to qa
   * qa-5 integration tests
   * qa-6 Sanity tests
   */

  robot.hear(/qa/i, function(res) {
    var user = res.message.user.name;

    if (robot.sessionMapping[user].step !== '2') {
      return;
    }
    var service = robot.sessionMapping[user].service;

    if (service === 'backend') {
      robot.sessionMapping[user].step = 'qa-1';
    } else {
      robot.sessionMapping[user].step = 'qa-2';
    }
    res.send('Ok, first thing - open a retail release request ticket in JIRA. Here are some tips that will you fill out some of those mandatory fields.' +
    '\nLet me know when you\'re _done_.' +
    '\n>You can generate a _Changelog_ by running this convenient git command and copying over the relevant commits:' +
    '\n>```git log --pretty=format:\'%h%Creset -%C(yellow)%d%Creset %s - %an (%cr)\'```' +
    '\n>The _Release Steps_ should look like:' +
    '\n>```kcs s u <stack> <cloudformation template> <environment> [list of variables you wish to override in the cloudformation]```' +
    '\n>For example:' +
    '\n>```kcs s u Frackend ~/repos/tools/CloudFormation/templates/frackend/Frackend.template RetailQA FrackendVersion=0.2.1449```' +
    '\n>The _Rollback_ should look the same as the Release Step command but with the desired previous version:' +
    '\n>```kcs s u Frackend ~/repos/tools/CloudFormation/templates/frackend/Frackend.template RetailQA FrackendVersion=0.2.1439```');
  });

  robot.hear(/(Done|done)/i, function(res) {
    var user = res.message.user.name;
    var step = robot.sessionMapping[user].step;

    switch (step) {
      case 'qa-1':
        robot.sessionMapping[user].step = 'qa-2';
        res.send('Awesome. Let\'s run a database migration. The command should look like:' +
        '\n>``` bin/remote_liquibase.sh RetailQA update```' +
        '\nLet me know when you\'re _done_.');
        break;
      case 'qa-2':
        robot.sessionMapping[user].step = 'qa-3';
        res.send('Nice. Let\'s run the stack update. The command should look like:' +
        '\n>```kcs s u <stack> <cloudformation template> <environment> [list of variables you wish to override in the cloudformation]```' +
        '\n>For example:' +
        '\n>```kcs s u Frackend ~/repos/tools/CloudFormation/templates/frackend/Frackend.template RetailQA FrackendVersion=0.2.1449```' +
        '\nLet me know when you\'re _done_.');
        break;
      case 'qa-3':
        var service = robot.sessionMapping[user].service;

        if (service === 'backend') {
          robot.sessionMapping[user].step = 'qa-4';
        } else {
          robot.sessionMapping[user].step = 'qa-5';
        }

        res.send('Now update the status of JIRA ticket. Click _Release to QA_ on the ticket.' +
        '\nLet me know when you\'re _done_.');
        break;
      case 'qa-4':
        robot.sessionMapping[user].step = 'qa-5';
        res.send('Run integration tests.' +
        '\nLet me know when you\'re _done_.');
        break;
      case 'qa-5':
        delete robot.sessionMapping[user];

        res.send('Ok now run a sanity check through the site to make sure nothing\'s broken. You\'re all set after that!');
        break;
    }
  });
};
