module.exports = function(robot) {
    robot.sessionMapping = robot.sessionMapping || {};

	robot.hear(/(^|\b)(prod|production)(\b|$)/i, function(res) {
    	var user = res.message.user.name;

        if (robot.sessionMapping[user].step !== '2') {
			return;
		}

        robot.sessionMapping[user].step = 'prod-1';
		robot.sessionMapping[user].environment = 'prod';

        res.send('Cool. Before we continue, please make sure the *Test Engineers* have signed off and *Doge* approves.' +
        '\nAfter that, we should take a pre-release snapshot in case we have to rollback:' +
        '\n>Run ```kcs e s <environment> <description>```' +
        '\n>For example: '+
        '\n>```kcs e s RetailProductionUsEast "Captured snapshot of KERMIT-4044"```' +
        '\nWhen you\'re all set, click Start Deploy on the ticket and add the snapshot info to the ticket.');

        if (robot.sessionMapping[user].service === 'backend') {
            // Turn on maintenance mode (Optional)
            res.send('If your release will result in downtime, turn on maintenance mode by:' +
            '\n>If needed, checkout the proxy sources: `cd ~/repos && kerrit p c services/RetailProxy`' +
            '\n>Go into ~/repos/services/RetailProxy' +
            '\n>Run `./bin/maintenance.py on RetailProductionUsEast`' +
            '\n>Run `./bin/maintenance.py --help` for a list of options');

            // DB Migration
            res.send('If you need migrate DB, run the following command:' +
            '\n>```bin/remote_liquibase.sh RetailProductionUsEast update```');
        }

        // Stack update
        res.send('Let\'s run the stack update. The command should look like:'+
        '\n>```kcs s u <stack> <cloudformation template> <environment> [list of variables you wish to override  in the cloudformation]```' +
        '\n>For example:' +
        '\n>```kcs s u Frackend ~/repos/tools/CloudFormation/templates/frackend/Frackend.template RetailProductionUsEast FrackendVersion=0.2.1449```');

        // Deploy successful or not
        res.send('Did the deploy succeed?');
	});

    robot.hear(/(^|\b)(yes|y|si)(\b|$)/, function(res) {
        var user = res.message.user.name;

        if (robot.sessionMapping[user].step !== 'prod-1') {
			return;
		}

        robot.sessionMapping[user].step = 'prod-2';

        if (robot.sessionMapping[user].service === 'backend') {

            // Turn off maintenance mode (Optional)
            res.send('If you turned on the maintenance mode in the previous step, turn it off by running: '+
            '\n>```./bin/maintenance.py off RetailProductionUsEast```');
        }

        // Update the ticket
        res.send('Click Release to Production on the ticket.' +
        '\nOk now run a sanity check through the site to make sure nothing\'s broken. You\'re all set after that!');

        delete robot.sessionMapping[user];
    });


    robot.hear(/(^|\b)(no|n|nah|nope)(\b|$)/, function(res) {
        var user = res.message.user.name;

        if (robot.sessionMapping[user].step !== 'prod-1') {
			return;
		}

        robot.sessionMapping[user].step = 'prod-2';

        res.send('Look up for the instructions in the release ticket to rollback. Come back again when you are ready to deploy.');
        delete robot.sessionMapping[user];
    });
};
