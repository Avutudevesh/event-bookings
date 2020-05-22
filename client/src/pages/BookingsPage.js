import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import BookingList from "../components/bookings/BookingsList";
import Spinner from "../components/spinner/Spinner";
import BookingsChart from "../components/bookings/BookingsChart";
import BookingsControl from "../components/bookings/BookingsControl";

export default () => {
	const authContext = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const [outputType, setOutputType] = useState("list");
	var isUnmounted = false;
	useEffect(() => {
		fetchBookings();
		return () => {
			isUnmounted = true;
		};
	}, []);
	const fetchBookings = async () => {
		try {
			setIsLoading(true);
			const requestBody = {
				query: `
				{
					bookings {
					  _id,
					  event {
						_id,
						title,
						date,
						price
					  },
					  createdAt,
					  updatedAt,
					}
				  }
				`,
			};
			const response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authContext.token}`,
				},
			});
			const resData = await response.json();
			console.log(resData.data.bookings);
			if (!isUnmounted) {
				setBookings(resData.data.bookings);
				setIsLoading(false);
			}
		} catch (err) {
			console.log(err);
			if (!isUnmounted) {
				setIsLoading(false);
			}
		}
	};

	const cancelBooking = async (bookingId) => {
		try {
			const requestBody = {
				query: `
				mutation {
					cancelBooking(bookingId:"${bookingId}"){
					  _id,
					  title,
					  date,
					}
				  }
				`,
			};
			const response = await fetch("http://localhost:3000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authContext.token}`,
				},
			});
			const resData = await response.json();
			console.log(resData.data.cancelBooking);
			fetchBookings();
		} catch (err) {
			console.log(err);
		}
	};

	const changeOutputType = (outputType) => {
		if (outputType === "list") {
			setOutputType("list");
		} else {
			setOutputType("chart");
		}
	};
	let content = <Spinner />;
	if (!isLoading) {
		content = (
			<>
				<BookingsControl
					changeOutputType={changeOutputType}
					selectedType={outputType}
				/>
				<div>
					{outputType === "list" ? (
						<BookingList bookings={bookings} onCancelBooking={cancelBooking} />
					) : (
						<BookingsChart bookings={bookings} />
					)}
				</div>
			</>
		);
	}
	return <div>{content}</div>;
};
