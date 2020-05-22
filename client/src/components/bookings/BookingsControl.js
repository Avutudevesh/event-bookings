import React from "react";
import "./BookingsControl.css";
export default ({ changeOutputType, selectedType }) => {
	return (
		<div className="bookings-control">
			<button
				className={selectedType === "list" ? "active" : null}
				onClick={() => changeOutputType("list")}
			>
				List
			</button>
			<button
				className={selectedType !== "list" ? "active" : null}
				onClick={() => changeOutputType("chart")}
			>
				Chart
			</button>
		</div>
	);
};
