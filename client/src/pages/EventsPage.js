import React, { useState } from "react";
import "./EventsPage.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";

export default () => {
	const [addEvent, setAddEvent] = useState(false);
	const modalCancelAction = () => {
		setAddEvent(false);
	};
	return (
		<div className="events-control">
			<p>Share your own events</p>
			{addEvent && (
				<>
					<Backdrop />
					<Modal title="Add Event" cancelAction={modalCancelAction}>
						<form>
							<div className="form-control">
								<label htmlFor="title">Title</label>
								<input type="text" id="title"></input>
							</div>
							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input type="text" id="price"></input>
							</div>
							<div className="form-control">
								<label htmlFor="date">Date</label>
								<input type="date" id="date"></input>
							</div>
							<div className="form-control">
								<label htmlFor="description">Description</label>
								<textarea id="description" rows="4"></textarea>
							</div>
						</form>
					</Modal>
				</>
			)}
			<button className="btn" onClick={() => setAddEvent(true)}>
				Create Event
			</button>
		</div>
	);
};
