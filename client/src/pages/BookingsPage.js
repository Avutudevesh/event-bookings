import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import BookingList from "../components/bookings/BookingsList";
import Spinner from "../components/spinner/Spinner";

export default () => {
	const authContext = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
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
	return (
		<div>
			{isLoading ? (
				<Spinner />
			) : (
				<BookingList bookings={bookings} onCancelBooking={cancelBooking} />
			)}
		</div>
	);
};
