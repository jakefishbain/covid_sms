const request = require('request');
require('custom-env').env();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const options = {
	'method': 'GET',
	'url': process.env.IL_API,
	'headers': {}
};

const buildBody = (data) => {
	return `
${data.date} | COVID19 STATS FOR ILLINOIS:

TODAY:
	TESTS: ${data.totalTestResultsIncrease}
	POSITIVE: ${data.positiveIncrease}
	NEGATIVE: ${data.negativeIncrease}
	DEATHS: ${data.deathIncrease}

TOTALS:
	TESTS: ${data.totalTestResults}
	POSITIVE: ${data.positive}
	NEGATIVE: ${data.negative}
	DEATHS: ${data.death}


(data provided by ${process.env.SOURCE})
	`
}

const getAndSend = async () => {
	await request(options, function (error, response) {
		if (error) throw new Error(error);
		console.log('---gettin and sendin---')
		let body = JSON.parse(response.body)[0]

		let messageBody = buildBody(body)

		let nums = process.env.TO_NUMS.split(',')

		nums.forEach(num => {
		client.messages.create(
			{
				body: messageBody,
				from: process.env.TWILIO_PHONE_NUMBER,
				to: num
			}
		).then(message => console.log(message.sid));
		});
	});
	return {message: 'success'}
}

const logit = function(){console.log('123')};

exports.logit = logit;
exports.getAndSend = getAndSend;
