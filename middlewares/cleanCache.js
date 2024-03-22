const { clearHash } = require('../services/cache')

module.exports = async (req, res, next) => {
    await next();
    console.log('middleware clean Cache.')
    clearHash(req.user.id)
}