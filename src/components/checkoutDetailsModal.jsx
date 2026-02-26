import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckOutDetailsModal(props) {
	const [isVisible, setIsVisible] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [addressLine1, setAddress] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [city, setCity] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [phone, setPhone] = useState("");

	const cart = props.cart;

	async function placeOrder() {
		const token = localStorage.getItem("token");

		if (token == null) {
			toast.error("You must be logged in to place an order");
			window.location.href = "/login";
			return;
		}

		const order = {
			firstName: firstName,
			lastName: lastName,
			addressLine1: addressLine1,
			addressLine2: addressLine2,
			city: city,
			postalCode: postalCode,
			phone: phone,
			country: "Sri Lanka",
			items: [],
		};
		cart.forEach((item) => {
			order.items.push({
				productId: item.product.productId,
				qty: item.qty,
			});
		});

		

		try {
			await axios.post(import.meta.env.VITE_API_URL + "/orders", order, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Order placed successfully");
			window.location.href = "/";
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to place the order. Please try again.");
			return;
		}
	}

	return (
		<>
			<button
				className="bg-accent text-white px-4 py-2 rounded ml-5 hover:bg-accent/80"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				Buy now
			</button>
			{isVisible && (
				<div className="w-full h-full bg-black/50 fixed z-50 top-0 left-0 flex justify-center items-center">
					<div className="w-[400px] h-auto bg-white rounded-lg p-5 relative">
						<button
							onClick={() => {
								setIsVisible(false);
							}}
							className="w-[40px] h-[40px]  text-red-600 absolute right-0 text-sm font-bold hover:bg-red-600 hover:text-white cursor-pointer"
						>
							X
						</button>
						<h1 className="text-lg font-semibold text-secondary mb-5">
							Enter your details
						</h1>
						<div className="flex flex-col gap-3">
							<input
								value={firstName}
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="First Name"
							/>
							<input
								value={lastName}
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="Last Name"
							/>
							<input
								value={addressLine1}
								onChange={(e) => {
									setAddress(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="Address Line 1"
							/>
							<input
								value={addressLine2}
								onChange={(e) => {
									setAddressLine2(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="Address Line 2"
							/>
							<input
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="City"
							/>
							<input
								value={postalCode}
								onChange={(e) => {
									setPostalCode(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="Postal Code"
							/>
							<input
								value={phone}
								onChange={(e) => {
									setPhone(e.target.value);
								}}
								className="w-full border border-secondary/20 rounded px-3 py-2"
								type="text"
								placeholder="Phone Number"
							/>
							<button
								onClick={placeOrder}
								className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80 mt-3"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
