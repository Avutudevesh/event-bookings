const Booking = require("../models/booking");
const Event = require("../models/events");
const { bookingMapper, eventMapper } = require("./mappers");

module.exports = {
	bookings: async (args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthorized");
		}
		try {
			const bookings = await Booking.find({ user: req.userId });
			return bookings.map((item) => {
				return bookingMapper(item._doc);
			});
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async ({ eventId }, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthorized");
		}
		try {
			const event = await Event.findById(eventId);
			if (!event) {
				throw new Error("No event found");
			}
			const booking = new Booking({
				user: req.userId,
				event: eventId,
			});
			const result = await booking.save();
			return bookingMapper(result._doc);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async ({ bookingId }, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthorized");
		}
		try {
			const booking = await Booking.findByIdAndDelete(bookingId);
			const event = await Event.findById(booking.event);
			return eventMapper(event._doc);
		} catch (err) {
			throw err;
		}
	},
};
