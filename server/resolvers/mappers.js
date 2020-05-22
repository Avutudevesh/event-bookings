const DataLoader = require("dataloader");
const User = require("../models/user");
const Event = require("../models/events");
const { dateToString } = require("../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
	return getEvents(eventIds);
});

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const bookingMapper = (booking) => {
	return {
		...booking,
		createdAt: dateToString(booking.createdAt),
		updatedAt: dateToString(booking.updatedAt),
		event: getSingleEvent.bind(this, booking.event),
		user: () => getUser(booking.user),
	};
};

const eventMapper = (event) => {
	return {
		...event,
		date: dateToString(event.date),
		creator: () => getUser(event.creator),
	};
};

const getEvents = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return eventMapper(event);
		});
	} catch (err) {
		throw err;
	}
};

const getSingleEvent = async (eventId) => {
	try {
		const event = await eventLoader.load(eventId.toString());
		return eventMapper(event._doc);
	} catch (err) {
		throw err;
	}
};

const getUser = async (userId) => {
	try {
		const user = await userLoader.load(userId.toString());
		return {
			...user._doc,
			createdEvents: async () => {
				const events = await eventLoader.loadMany(
					user._doc.createdEvents.map((eventId) => eventId.toString())
				);
				return events.map((event) => event._doc);
			},
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
