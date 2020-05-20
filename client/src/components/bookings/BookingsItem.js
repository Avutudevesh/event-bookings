import React from "react";

export default ({ booking, onCancelClicked }) => {
	return (
		<li className="events_list_item">
			<div>
				<h1>{booking.event.title}</h1>
				<h2>
					{booking.event.price}-
					{new Date(booking.event.date).toLocaleDateString()}
				</h2>
			</div>
			<div>
				<button
					className="btn"
					onClick={() => {
						onCancelClicked(booking._id);
					}}
				>
					Cancel
				</button>
			</div>
		</li>
	);
};
