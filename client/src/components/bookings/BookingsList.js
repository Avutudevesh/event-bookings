import React from "react";
import BookingItem from "./BookingsItem";

export default ({ bookings }) => {
	const renderEventItems = () => {
		return bookings.map((booking) => {
			return <BookingItem key={booking._id} booking={booking} />;
		});
	};
	return (
		<div>
			<ul className="events_list">{renderEventItems()}</ul>
		</div>
	);
};
