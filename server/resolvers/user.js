const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
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
	login: async ({ email, password }) => {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User doesn't exist");
		}
		const isEqual = await bcrypt.compare(password, user._doc.password);
		if (!isEqual) {
			throw new Error("Invalid Credentials");
		}
		const token = jwt.sign(
			{ userId: user._doc._id, email: user._doc.email },
			process.env.TOKEN_SECRET,
			{
				expiresIn: "1h",
			}
		);
		return { userId: user._doc._id, token, tokenExpiration: 1 };
	},
};
