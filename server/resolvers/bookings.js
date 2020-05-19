const Booking = require("../models/booking");
const Event = require("../models/events");
const { bookingMapper, eventMapper } = require("./mappers");

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((item) => {
				return bookingMapper(item._doc);
			});
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async ({ eventId }) => {
		try {
			const event = await Event.findById(eventId);
			if (!event) {
				throw new Error("No event found");
			}
			const booking = new Booking({
				user: "5ec29624f1c63b5983140233",
				event: eventId,
			});
			const result = await booking.save();
			return bookingMapper(result._doc);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async ({ bookingId }) => {
		try {
			const booking = await Booking.findByIdAndDelete(bookingId);
			const event = await Event.findById(booking.event);
			return eventMapper(event._doc);
		} catch (err) {
			throw err;
		}
	},
};
