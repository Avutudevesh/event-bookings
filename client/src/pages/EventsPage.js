import React, { useState, useRef, useContext, useEffect } from "react";
import "./EventsPage.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/AuthContext";

export default () => {
	const authContext = useContext(AuthContext);
	const [addEvent, setAddEvent] = useState(false);
	const [events, setEvents] = useState([]);
	const eventTitle = useRef("");
	const eventDesc = useRef("");
	const eventDate = useRef("");
	const eventPrice = useRef("");

	useEffect(() => {
		fetchEvents();
	}, []);

	const modalCancelAction = () => {
		setAddEvent(false);
	};

	const modalConfirmAction = async () => {
		setAddEvent(false);
		const title = eventTitle.current.value;
		const description = eventDesc.current.value;
		const price = +eventPrice.current.value;
		const date = eventDate.current.value;
		const event = { title, description, price, date };
		console.log(event);
		const requestBody = {
			query: `
			mutation {
				createEvent(eventInput:{title:"${event.title}", description:"${event.description}", price:${event.price}, date:"${event.date}"}){
				_id,
				  title,
				  description, 
				  price,
				  date
				}
			  }
			`,
		};
		console.log(requestBody);
		try {
			const response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authContext.token}`,
				},
			});
			const resData = await response.json();
			console.log(resData);
			fetchEvents();
		} catch (err) {
			console.log(err);
		}
	};

	const fetchEvents = async () => {
		try {
			const requestBody = {
				query: `
				{
					events{
						_id,
						price
					  	title,
					  	date,
					  	creator{
							email
					  	}
					}
				  }
				`,
			};
			const response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const resData = await response.json();
			console.log(resData.data.events);
			setEvents(resData.data.events);
		} catch (err) {
			console.log(err);
		}
	};

	const renderEventsList = () => {
		return events.map((event) => {
			return (
				<li className="events_list_item" key={event._id}>
					{event.title}
				</li>
			);
		});
	};
	return (
		<>
			{authContext.token && (
				<div className="events-control">
					<p>Share your own events</p>
					{addEvent && (
						<>
							<Backdrop />
							<Modal
								title="Add Event"
								cancelAction={modalCancelAction}
								confirmAction={modalConfirmAction}
							>
								<form>
									<div className="form-control">
										<label htmlFor="title">Title</label>
										<input ref={eventTitle} type="text" id="title"></input>
									</div>
									<div className="form-control">
										<label htmlFor="price">Price</label>
										<input ref={eventPrice} type="text" id="price"></input>
									</div>
									<div className="form-control">
										<label htmlFor="date">Date</label>
										<input
											ref={eventDate}
											type="datetime-local"
											id="date"
										></input>
									</div>
									<div className="form-control">
										<label htmlFor="description">Description</label>
										<textarea
											ref={eventDesc}
											id="description"
											rows="4"
										></textarea>
									</div>
								</form>
							</Modal>
						</>
					)}
					<button className="btn" onClick={() => setAddEvent(true)}>
						Create Event
					</button>
				</div>
			)}
			<div>
				<ul className="events_list">{renderEventsList()}</ul>
			</div>
		</>
	);
};
