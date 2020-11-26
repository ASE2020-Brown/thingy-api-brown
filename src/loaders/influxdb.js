const config = require('../config');
const {InfluxDB} = require('@influxdata/influxdb-client')

const token = config.influxToken;
const org = config.influxOrg;
const bucket = config.influxBucket;

const clientInflux = new InfluxDB({url: config.influxURL, token: token});

module.exports = clientInflux;