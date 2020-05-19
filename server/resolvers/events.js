const Event = require("../models/events");
const User = require("../models/user");
const { eventMapper } = require("./mappers");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				const mappedEvents = eventMapper(event._doc);
				return mappedEvents;
			});
		} catch (err) {
			console.log(err);
		}
	},
	createEvent: async ({ eventInput: { title, description, price, date } }) => {
		try {
			const event = new Event({
				title,
				description,
				price,
				date: new Date(date),
				creator: "5ec29624f1c63b5983140233",
			});
			const savedEvent = await event.save();
			const user = await User.findById("5ec29624f1c63b5983140233");
			if (!user) {
				throw new Error("No user found");
			}
			user.createdEvents.push(event);
			await user.save();
			return eventMapper(savedEvent._doc);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
