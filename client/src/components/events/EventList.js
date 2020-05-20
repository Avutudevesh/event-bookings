import React from "react";
import EventItem from "./EventItem";

export default ({ events, userId, onItemSelected }) => {
	const renderEventItems = () => {
		return events.map((event) => {
			return (
				<EventItem
					key={event._id}
					eventId={event._id}
					eventTitle={event.title}
					eventPrice={event.price}
					eventDate={event.date}
					creatorId={event.creator._id}
					userId={userId}
					onDetailsClick={onItemSelected}
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
