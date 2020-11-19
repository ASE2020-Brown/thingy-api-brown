const sensors = require('./routes/sensors.route');
const security = require('./routes/security.route');

module.exports.sensors = sensors;
module.exports.security = security.public;
module.exports.protected = security.protected;