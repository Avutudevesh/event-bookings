import React, { useState, useRef, useContext, useEffect } from "react";
import "./EventsPage.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/AuthContext";
import EventList from "../components/events/EventList";
import Spinner from "../components/spinner/Spinner";

export default ({ history }) => {
	const authContext = useContext(AuthContext);
	const [addEvent, setAddEvent] = useState(false);
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const eventTitle = useRef("");
	const eventDesc = useRef("");
	const eventDate = useRef("");
	const eventPrice = useRef("");

	let response = null;
	let isUnmounted = false;
	const abortController = new AbortController();
	const signal = abortController.signal;

	useEffect(() => {
		fetchEvents();
		return () => {
			abortController.abort();
			isUnmounted = true;
		};
	}, []);

	const modalCancelAction = () => {
		setAddEvent(false);
		setSelectedEvent(null);
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
				  date,
				  creator {
					  _id
				  }
				}
			  }
			`,
		};
		console.log(requestBody);
		try {
			response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authContext.token}`,
				},
				signal,
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
			setIsLoading(true);
			const requestBody = {
				query: `
				{
					events{
						_id,
						price
						  title,
						  description,
					  	date,
					  	creator{
							_id
					  	}
					}
				  }
				`,
			};
			response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
				signal,
			});
			const resData = await response.json();
			console.log(resData.data.events);
			if (!isUnmounted) {
				setEvents(resData.data.events);
				setIsLoading(false);
			}
		} catch (err) {
			console.log(err);
			if (!isUnmounted) {
				setIsLoading(false);
			}
		}
	};

	const showDetail = (eventId) => {
		const event = events.find((e) => e._id === eventId);
		console.log(event);
		setSelectedEvent(event);
	};

	const bookEvent = async () => {
		try {
			if (authContext.token) {
				const requestBody = {
					query: `
				mutation {
					bookEvent(eventId:"${selectedEvent._id}"){
					  event{
						_id,
						title
					  }
					}
				  }
				`,
				};
				response = await fetch("http://localhost:3000/graphql", {
					method: "POST",
					body: JSON.stringify(requestBody),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authContext.token}`,
					},
					signal,
				});
				const resData = await response.json();
				console.log(resData.data.bookEvent.event);
				setSelectedEvent(null);
			} else {
				history.push("/auth");
			}
		} catch (err) {
			console.log(err);
			setSelectedEvent(null);
		}
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
			{selectedEvent && (
				<>
					<Backdrop />
					<Modal
						title="Book Event"
						cancelAction={modalCancelAction}
						confirmAction={bookEvent}
					>
						<div>
							<h1>{selectedEvent.title}</h1>
							<h2>
								{selectedEvent.price}-
								{new Date(selectedEvent.date).toLocaleDateString()}
							</h2>
							<p>{selectedEvent.description}</p>
						</div>
					</Modal>
				</>
			)}
			{isLoading ? (
				<Spinner />
			) : (
				<EventList
					events={events}
					userId={authContext.userId}
					onItemSelected={showDetail}
				/>
			)}
		</>
	);
};
