import React, { useState, useContext } from "react";
import "./AuthPage.css";
import AuthContext from "../context/AuthContext";

export default () => {
	const authContext = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const submitHandler = async (event) => {
		event.preventDefault();
		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}
		let requestBody = {
			query: `
			    query {
				   login(email:"${email}", password:"${password}"){
				     token,
				     tokenExpiration,
				     userId
				   }
				 }
			`,
		};
		if (!isLogin) {
			requestBody = {
				query: `
						mutation {
							createUser(userInput:{email:"${email}", password:"${password}"}){
							_id,
							email
							}
						}
						`,
			};
		}

		try {
			const response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const resData = await response.json();
			console.log(resData);
			if (resData.data.login.token) {
				authContext.login(
					resData.data.login.token,
					resData.data.login.userId,
					resData.data.login.tokenExpiration
				);
			}
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<form className="auth-form" onSubmit={submitHandler}>
				<div className="form-control">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>
				<div className="form-control">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>
				<div className="form-actions">
					<button type="submit">Submit</button>
					<button type="button" onClick={() => setIsLogin(!isLogin)}>
						{isLogin ? "Switch to SignUp" : "Switch to Login"}
					</button>
				</div>
			</form>
		</div>
	);
};
