const express = require("express");
const bodyParser = require("body-parser");
const graphQLHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/events");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());

const events = (eventIds) => {
	return Event.find({ _id: { $in: eventIds } })
		.then((events) => {
			return events.map((event) => {
				return { ...event._doc, creator: user.bind(this, event._doc.creator) };
			});
		})
		.catch((err) => {
			throw err;
		});
};
const user = (userId) => {
	return User.findById(userId)
		.then((user) => {
			return {
				...user._doc,
				createdEvents: events.bind(this, user._doc.createdEvents),
			};
		})
		.catch((err) => {
			throw err;
		});
};

app.use(
	"/graphql",
	graphQLHttp({
		schema: buildSchema(`
			type Event {
				_id: ID!
				title: String!
				description: String!
				price: Float!
				date: String!
				creator:User!
			}

			type User {
				_id:ID!
				email:String!
				password:String
				createdEvents:[Event!]
			}
			
			input EventInput {
				title: String!
				description: String!
				price: Float!
				date: String!
			}

			input UserInput {
				email: String!
				password: String!
			}

			type RootQuery {
				events : [Event!]!
			}
			type RootMutation {
				createEvent(eventInput: EventInput): Event
				createUser(userInput: UserInput): User
			}

			schema{
				query: RootQuery,
				mutation: RootMutation
			}
		`),
		rootValue: {
			events: () => {
				return Event.find()
					.then((events) => {
						return events.map((event) => {
							return {
								...event._doc,
								creator: user.bind(this, event._doc.creator),
							};
						});
					})
					.catch((err) => console.log(err));
			},
			createEvent: ({ eventInput: { title, description, price, date } }) => {
				const event = new Event({
					title,
					description,
					price,
					date: new Date(date),
					creator: "5ec29624f1c63b5983140233",
				});
				let createdEvent;
				return event
					.save()
					.then((result) => {
						createdEvent = {
							...result._doc,
							creator: user.bind(this, result._doc.creator),
						};
						return User.findById("5ec29624f1c63b5983140233");
					})
					.then((user) => {
						if (!user) {
							throw new Error("No user found");
						}
						user.createdEvents.push(event);
						return user.save();
					})
					.then(() => {
						return createdEvent;
					})
					.catch((err) => {
						console.log(err);
						throw err;
					});
			},
			createUser: ({ userInput: { email, password } }) => {
				return User.findOne({ email })
					.then((user) => {
						if (user) {
							throw new Error("User already exists");
						}
						return bcrypt.hash(password, 12);
					})
					.then((hashedPassword) => {
						const user = new User({
							email,
							password: hashedPassword,
						});
						return user.save();
					})
					.then((result) => {
						return { ...result._doc, password: null };
					})
					.catch((err) => {
						throw err;
					});
			},
		},
		graphiql: true,
	})
);
const MONGOOSE_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@testcluster-gx9fn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose
	.connect(MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3000, () => {
			console.log("Server running");
		});
	})
	.catch((err) => console.log(err));
