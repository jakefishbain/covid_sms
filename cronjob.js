'use strict';

const CronJob = require('cron').CronJob;
const utils = require('./utils');
require('custom-env').env();


const scheduler = function() {
  return {
    start: function() {
      new CronJob(process.env.FREQUENCY, function() {
				utils.getAndSend()
      }, null, true, "America/Chicago");
    },
  };
};

module.exports = scheduler();
