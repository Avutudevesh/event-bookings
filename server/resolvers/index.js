const Event = require("../models/events");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getEvents = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return {
				...event._doc,
				date: new Date(event.date).toISOString(),
				creator: getUser.bind(this, event._doc.creator),
			};
		});
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
module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return {
					...event._doc,
					date: new Date(event.date).toISOString(),
					creator: getUser.bind(this, event._doc.creator),
				};
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
			return {
				...savedEvent._doc,
				date: new Date(savedEvent._doc.date).toISOString(),
				creator: getUser.bind(this, savedEvent._doc.creator),
			};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	createUser: async ({ userInput: { email, password } }) => {
		try {
			const user = await User.findOne({ email });
			if (user) {
				throw new Error("User already exists");
			}
			const hashedPassword = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				password: hashedPassword,
			});
			const result = await newUser.save();

			return { ...result._doc, password: null };
		} catch (err) {
			throw err;
		}
	},
};
