// this function is for rate limting.
// takes in req object as argument
const IPSchema = require("../models/IP");

async function rateLimiterHelper(req){
    // extract ip addr from req headers
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const { createdBy } = req.body;

    const ip_save = await IPSchema.create({
        ipAddress: ip,
        userId: createdBy
    });

    console.log(`Request coming from ip: ${ip}`);

    return ip_save;
}

module.exports = rateLimiterHelper;