import React from "react";

export default ({ booking }) => {
	return (
		<li className="events_list_item">
			<div>
				<h1>{booking.event.title}</h1>
				<h2>
					{booking.event.price}-
					{new Date(booking.event.date).toLocaleDateString()}
				</h2>
			</div>
			{/* <div>
				{creatorId !== userId ? (
					<button className="btn" onClick={() => onDetailsClick(eventId)}>
						View Details
					</button>
				) : (
					<p>Your Event</p>
				)}
			</div> */}
		</li>
	);
};
