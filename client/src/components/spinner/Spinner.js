import React from "react";
import "./Spinner.css";
export default () => {
	return (
		<div className="spinner">
			<div className="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
