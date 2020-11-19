const getEnvironment = require('./routes/environment.route');
const security = require('./routes/security.route');

module.exports.getEnvironment = getEnvironment;
module.exports.security = security.public;
module.exports.protected = security.protected;