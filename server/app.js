const express = require("express");
const bodyParser = require("body-parser");
const graphQLHttp = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema");
const resolvers = require("./resolvers");
const authentication = require("./middleware/authentication");

const app = express();
app.use(bodyParser.json());

app.use(authentication);

app.use(
	"/graphql",
	graphQLHttp({
		schema,
		rootValue: resolvers,
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
