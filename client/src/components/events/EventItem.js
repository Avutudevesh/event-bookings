import React from "react";

export default ({
	eventId,
	eventTitle,
	eventPrice,
	eventDate,
	creatorId,
	userId,
	onDetailsClick,
}) => {
	return (
		<li className="events_list_item">
			<div>
				<h1>{eventTitle}</h1>
				<h2>
					{eventPrice}-{new Date(eventDate).toLocaleDateString()}
				</h2>
			</div>
			<div>
				{creatorId !== userId ? (
					<button className="btn" onClick={() => onDetailsClick(eventId)}>
						View Details
					</button>
				) : (
					<p>Your Event</p>
				)}
			</div>
		</li>
	);
};
