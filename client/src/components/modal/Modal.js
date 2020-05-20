import React from "react";
import "./Modal.css";
export default (props) => {
	return (
		<div className="modal">
			<header className="modal_header">
				<h1>{props.title}</h1>
			</header>
			<section className="modal_content">{props.children}</section>
			<section className="modal_actions">
				<button className="btn" onClick={props.cancelAction}>
					Cancel
				</button>
				<button className="btn" onClick={props.confirmAction}>
					Confirm
				</button>
			</section>
		</div>
	);
};
