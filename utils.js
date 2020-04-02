const fetch = require('node-fetch');
require('custom-env').env();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const buildBody = (state, us) => {
	return `
${state.date}
COVID19 STATS FOR ILLINOIS:

TODAY:
	TESTS: ${state.totalTestResultsIncrease}
	POSITIVE: ${state.positiveIncrease}
	NEGATIVE: ${state.negativeIncrease}
	DEATHS: ${state.deathIncrease}

TOTALS:
	TESTS: ${state.totalTestResults}
	POSITIVE: ${state.positive}
	NEGATIVE: ${state.negative}
	DEATHS: ${state.death}

---------------------------

COVID19 STATS FOR US:

TODAY:
	TESTS: ${us.totalTestResultsIncrease}
	POSITIVE: ${us.positiveIncrease}
	NEGATIVE: ${us.negativeIncrease}
	DEATHS: ${us.deathIncrease}

TOTALS:
	TESTS: ${us.totalTestResults}
	POSITIVE: ${us.positive}
	NEGATIVE: ${us.negative}
	DEATHS: ${us.death}


(src: ${process.env.SOURCE})
`
}

async function getStateData() {
	return fetch(process.env.IL_API)
		.then(res => res.json())
		.then(body => body[0])
}

async function getUSData() {
	return fetch(process.env.US_API)
		.then(res => res.json())
		.then(body => body[0])
}

const getAndSend = async () => {
	console.log('---gettin and sendin---')


	let [state_data, us_data] = await Promise.all([
		getStateData(),
		getUSData()
	])

	let messageBody = buildBody(state_data, us_data)
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

	return { state: state_data, us: us_data }
}

const logit = function(){console.log('123')};

exports.logit = logit;
exports.getAndSend = getAndSend;
