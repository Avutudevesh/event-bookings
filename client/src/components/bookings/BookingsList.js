import React from "react";
import BookingItem from "./BookingsItem";

export default ({ bookings, onCancelBooking }) => {
	const renderEventItems = () => {
		return bookings.map((booking) => {
			return (
				<BookingItem
					key={booking._id}
					booking={booking}
					onCancelClicked={onCancelBooking}
				/>
			);
		});
	};
	return (
		<div>
			<ul className="events_list">{renderEventItems()}</ul>
		</div>
	);
};
