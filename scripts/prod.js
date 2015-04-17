module.exports = function(robot) {
    robot.sessionMapping = robot.sessionMapping || {};

	robot.hear(/(^|\b)(prod|production)(\b|$)/i, function(res) {
    	var user = res.message.user.name;

        if (robot.sessionMapping[user].step !== '2') {
			return;
		}

        robot.sessionMapping[user].step = 'prod-1';
		robot.sessionMapping[user].environment = 'prod';

        res.send('Cool.Before we continue, please make sure TE have signed off and to check with the doge.');
        res.send('Please click "Start Deploy" on the release ticket created.');

        if (robot.sessionMapping[user].service === 'backend') {
            // Turn on maintenance mode (Optional)
            res.send('If your release requires a downtime, turn on maintenance mode. To turn it on, do the following:');
            res.send('* Checkout the proxy sources: `cd ~/repos && kerrit p c services/RetailProxy`');
            res.send('* cd ~/repos/services/RetailProxy');
            res.send('* Run `./bin/maintenance.py on <environment>`');
            res.send('\t\tFor example: `./bin/maintenance.py on dev`');
            res.send('* Run `./bin/maintenance.py --help for a list of options`');

            // DB Migration
            res.send('If you need to do DB migration, run the following command:');
            res.send('`bin/remote_liquibase.sh RetailProductionUsEast update`');
        }

        // Stack update
        res.send('You can now stack update by running the following command:');
        res.send('`kcs s u <stack> <cloudformation template> <environment> [list of variables you wish to override  in the cloudformation]`');
        res.send('For example:');
        res.send('`kcs s u Frackend ~/repos/tools/CloudFormation/templates/frackend/Frackend.template RetailProductionUsEast FrackendVersion=0.2.1449`');

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
            res.send('If you turned on the maintenance mode in the previous step, turn it off by')
            res.send('`./bin/maintenance.py off <environment>`');
            res.send('For example: `./bin/maintenance.py off dev`');
        }

        // Update the ticket
        res.send('Udpate the retail release ticket with a snapshot.');
        res.send('Run `kcs e s <environment> <description>`');
        res.send('For example: `kcs e s RetailProductionUsEast "Captured snapshot of KERMIT-4044"`');
        res.send('Click "Release to Production" on the ticket.');
        res.send('Do not forget to test the changes manually.');
        res.send('Hurray!! You are done! Congratulations!!!!!!!!!!!!');

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
