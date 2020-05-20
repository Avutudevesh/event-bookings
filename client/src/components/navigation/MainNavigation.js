import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/AuthContext";

export default () => {
	const authContext = useContext(AuthContext);
	return (
		<header className="main_navigation">
			<div className="main_navigation_logo">
				<h1>Event Booking</h1>
			</div>
			<nav className="main_navigation_items">
				<ul>
					<li>
						<NavLink to="/events">Events</NavLink>
					</li>
					{authContext.token && (
						<>
							<li>
								<NavLink to="/bookings">Bookings</NavLink>
							</li>
							<li>
								<button onClick={authContext.logout}>Logout</button>
							</li>
						</>
					)}
					{!authContext.token && (
						<li>
							<NavLink to="/auth">Login</NavLink>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};
