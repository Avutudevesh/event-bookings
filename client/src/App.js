import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BookingsPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";
import MainNavigation from "./components/navigation/MainNavigation";
import AuthContext from "./context/AuthContext";
import { set } from "mongoose";

const App = () => {
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	const [tokenExpiration, setTokenExpiration] = useState(null);

	const login = (token, userId, tokenExpiration) => {
		setToken(token);
		setTokenExpiration(tokenExpiration);
		setUserId(userId);
	};
	const logout = () => {
		setToken(null);
		setTokenExpiration(null);
		setUserId(null);
	};
	return (
		<BrowserRouter>
			<React.Fragment>
				<AuthContext.Provider value={{ token, userId, login, logout }}>
					<MainNavigation />
					<main className="main_content">
						<Switch>
							{!token && <Redirect from="/" to="/auth" exact />}
							{token && <Redirect from="/" to="/events" exact />}
							{token && <Redirect from="/auth" to="/events" exact />}
							<Route path="/auth" component={AuthPage} />
							<Route path="/events" component={EventsPage} />
							{!token && <Redirect from="/bookings" to="/auth" />}
							<Route path="/bookings" component={BookingsPage} />
						</Switch>
					</main>
				</AuthContext.Provider>
			</React.Fragment>
		</BrowserRouter>
	);
};

export default App;
