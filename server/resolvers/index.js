const eventResolvers = require("./events");
const bookingResolvers = require("./bookings");
const userResolvers = require("./user");

module.exports = {
	...eventResolvers,
	...bookingResolvers,
	...userResolvers,
};
