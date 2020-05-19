const User = require("../models/user");
const Event = require("../models/events");
const { dateToString } = require("../helpers/date");

const bookingMapper = (booking) => {
	return {
		...booking,
		createdAt: dateToString(booking.createdAt),
		updatedAt: dateToString(booking.updatedAt),
		event: getSingleEvent.bind(this, booking.event),
		user: getUser.bind(this, booking.user),
	};
};
const eventMapper = (event) => {
	return {
		...event,
		date: dateToString(event.date),
		creator: getUser.bind(this, event.creator),
	};
};

const getEvents = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return {
				...event._doc,
				date: dateToString(event._doc.date),
				creator: getUser.bind(this, event._doc.creator),
			};
		});
	} catch (err) {
		throw err;
	}
};

const getSingleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);
		return eventMapper(event._doc);
	} catch (err) {
		throw err;
	}
};
const getUser = async (userId) => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			createdEvents: getEvents.bind(this, user._doc.createdEvents),
		};
	} catch (err) {
		throw err;
	}
};

exports.bookingMapper = bookingMapper;
exports.eventMapper = eventMapper;
exports.getEvents = getEvents;
exports.getSingleEvent = getSingleEvent;
exports.getUser = getUser;
