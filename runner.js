#! /app/bin/node
const utils = require('./utils')

async function runner() {
	await utils.getAndSend()
}

runner()

// setTimeout(() => process.exit(), 5000)
