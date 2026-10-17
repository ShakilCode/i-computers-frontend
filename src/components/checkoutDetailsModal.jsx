import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BiX, BiMap, BiShieldQuarter } from "react-icons/bi";

export default function CheckOutDetailsModal(props) {
	const [isVisible, setIsVisible] = useState(false);
	const [orderPlaced, setOrderPlaced] = useState(false); // shows the success message
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [addressLine1, setAddress] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [city, setCity] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [phone, setPhone] = useState("");
	const navigate = useNavigate();
	useEffect(
        ()=>{
            const token = localStorage.getItem("token")
            
            if(token==null){
                toast.error("Please login to continue checkout")
                navigate("/login")
            }
            axios.get(import.meta.env.VITE_API_URL+"/users/profile" ,{
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            }).then(
                (response)=>{
                    console.log(response.data)
					setFirstName(response.data.firstName)
					setLastName(response.data.lastName)
                }
            ).catch(
                    ()=>{
                        localStorage.removeItem("token")
                        window.location.href="/login"
                    }
                )
        },[]
    )

	// Closing before ordering just hides the popup.
	// Closing after the order is placed goes home, so the same cart can't be ordered twice.
	function closeModal() {
		if (orderPlaced) {
			window.location.href = "/";
			return;
		}
		setIsVisible(false);
	}

	// UI only: lock page scroll and allow Escape to close while the modal is open
	useEffect(() => {
		if (!isVisible) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e) => {
			if (e.key === "Escape") closeModal();
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			document.removeEventListener("keydown", onKey);
		};
	}, [isVisible, orderPlaced]);

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
			setOrderPlaced(true); // show the success message instead of redirecting
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to place the order. Please try again.");
			return;
		}
	}

	// Design only
	const inputClass =
		"peer w-full h-14 rounded-2xl bg-white/70 border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15";
	const labelClass =
		"pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent";

	return (
		<>
			<button
				className="group relative w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold text-lg overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
				<span className="relative">Buy now</span>
			</button>

			{/* Rendered in document.body so it always covers the whole screen */}
			{isVisible && createPortal(
				<div
					onClick={closeModal}
					className="fixed inset-0 z-200 flex items-center justify-center bg-secondary/30 backdrop-blur-md p-4"
				>
					{/* Keyframes for the success check mark (kept here so no CSS file change is needed) */}
					<style>{`
						@keyframes order-draw { to { stroke-dashoffset: 0; } }
						@keyframes order-pop { 0% { transform: scale(0.4); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
					`}</style>

					{/* Soft glow behind the panel */}
					<div className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-accent/30 blur-3xl animate-blob" />

					<div
						onClick={(e) => { e.stopPropagation(); }}
						className="relative w-full max-w-[520px] max-h-[92vh] overflow-y-auto rounded-[2rem] bg-white border border-white shadow-2xl shadow-accent/30 animate-rise"
					>
						{/* Gradient strip */}
						<div className="h-1.5 w-full bg-linear-to-r from-accent via-[#b06cff] to-accent-2 [background-size:200%_100%] animate-gradient" />

						{orderPlaced ? (
							/* ---------- Success message ---------- */
							<div className="relative p-8 sm:p-10 text-center">
								<button
									onClick={closeModal}
									aria-label="Close"
									className="absolute right-5 top-6 w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center transition hover:bg-accent hover:text-white hover:rotate-90 active:scale-90 cursor-pointer"
								>
									<BiX size={24} />
								</button>

								{/* Animated check */}
								<div className="relative mx-auto w-28 h-28 flex items-center justify-center">
									<span className="absolute inset-0 rounded-full bg-accent-2/40 animate-ping" />
									<span className="absolute -top-2 -left-3 w-3 h-3 rounded-full bg-accent animate-float" />
									<span className="absolute top-2 -right-4 w-2.5 h-2.5 rounded-full bg-[#ff8fd8] animate-float-slow" />
									<span className="absolute -bottom-1 left-0 w-2.5 h-2.5 rounded-full bg-accent-2 animate-float-slow" style={{ animationDelay: "0.6s" }} />
									<span className="absolute bottom-2 -right-3 w-3 h-3 rounded-full bg-[#b06cff] animate-float" style={{ animationDelay: "1s" }} />
									<span
										className="relative w-24 h-24 rounded-full bg-linear-to-br from-accent-2 to-accent flex items-center justify-center shadow-xl shadow-accent/30"
										style={{ animation: "order-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) both" }}
									>
										<svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
											<path
												d="M5 12.5l4.5 4.5L19 7.5"
												style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "order-draw 0.6s 0.35s ease-out forwards" }}
											/>
										</svg>
									</span>
								</div>

								<h1 className="mt-8 text-3xl font-bold tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.2s" }}>
									Your order has been placed!
								</h1>
								<p className="mt-3 text-secondary/60 animate-rise" style={{ animationDelay: "0.3s" }}>
									Thank you for shopping with us.
								</p>

								<div className="mt-6 rounded-2xl bg-primary px-5 py-4 text-secondary/70 leading-7 animate-rise" style={{ animationDelay: "0.4s" }}>
									If you want to check your order details and status,{" "}
									<a href="/my-orders" className="font-bold text-accent underline underline-offset-4 decoration-2 transition hover:text-secondary">
										click here
									</a>
									.
								</div>

								<a
									href="/"
									className="mt-6 inline-flex h-12 px-8 rounded-full bg-white border border-secondary/10 text-secondary font-semibold items-center justify-center transition hover:border-accent hover:text-accent hover:-translate-y-0.5 active:scale-95 animate-rise"
									style={{ animationDelay: "0.5s" }}
								>
									Continue shopping
								</a>
							</div>
						) : (
							/* ---------- Details form ---------- */
							<div className="p-6 sm:p-8">
								{/* Close */}
								<button
									onClick={closeModal}
									aria-label="Close"
									className="absolute right-5 top-6 w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center transition hover:bg-accent hover:text-white hover:rotate-90 active:scale-90 cursor-pointer"
								>
									<BiX size={24} />
								</button>

								{/* Header */}
								<div className="flex items-center gap-4 pr-12">
									<span className="w-14 h-14 shrink-0 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
										<BiMap size={28} />
									</span>
									<div>
										<h1 className="text-2xl font-bold tracking-tight text-secondary">
											Enter your details
										</h1>
										<p className="text-sm text-secondary/60">Where should we deliver your order?</p>
									</div>
								</div>

								<p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-2/20 text-[#0b8f66] text-xs font-semibold px-4 py-1.5">
									<span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse-soft" />
									Delivering within Sri Lanka
								</p>

								<div className="mt-6 flex flex-col gap-4">
									<div className="grid sm:grid-cols-2 gap-4 animate-rise" style={{ animationDelay: "0.1s" }}>
										<div className="relative">
											<input
												id="firstName"
												value={firstName}
												onChange={(e) => {
													setFirstName(e.target.value);
												}}
												className={inputClass}
												type="text"
												placeholder=" "
											/>
											<label htmlFor="firstName" className={labelClass}>First Name</label>
										</div>
										<div className="relative">
											<input
												id="lastName"
												value={lastName}
												onChange={(e) => {
													setLastName(e.target.value);
												}}
												className={inputClass}
												type="text"
												placeholder=" "
											/>
											<label htmlFor="lastName" className={labelClass}>Last Name</label>
										</div>
									</div>

									<div className="relative animate-rise" style={{ animationDelay: "0.17s" }}>
										<input
											id="addressLine1"
											value={addressLine1}
											onChange={(e) => {
												setAddress(e.target.value);
											}}
											className={inputClass}
											type="text"
											placeholder=" "
										/>
										<label htmlFor="addressLine1" className={labelClass}>Address Line 1</label>
									</div>

									<div className="relative animate-rise" style={{ animationDelay: "0.24s" }}>
										<input
											id="addressLine2"
											value={addressLine2}
											onChange={(e) => {
												setAddressLine2(e.target.value);
											}}
											className={inputClass}
											type="text"
											placeholder=" "
										/>
										<label htmlFor="addressLine2" className={labelClass}>Address Line 2</label>
									</div>

									<div className="grid sm:grid-cols-2 gap-4 animate-rise" style={{ animationDelay: "0.31s" }}>
										<div className="relative">
											<input
												id="city"
												value={city}
												onChange={(e) => {
													setCity(e.target.value);
												}}
												className={inputClass}
												type="text"
												placeholder=" "
											/>
											<label htmlFor="city" className={labelClass}>City</label>
										</div>
										<div className="relative">
											<input
												id="postalCode"
												value={postalCode}
												onChange={(e) => {
													setPostalCode(e.target.value);
												}}
												className={inputClass}
												type="text"
												placeholder=" "
											/>
											<label htmlFor="postalCode" className={labelClass}>Postal Code</label>
										</div>
									</div>

									<div className="relative animate-rise" style={{ animationDelay: "0.38s" }}>
										<input
											id="phone"
											value={phone}
											onChange={(e) => {
												setPhone(e.target.value);
											}}
											className={inputClass}
											type="text"
											placeholder=" "
										/>
										<label htmlFor="phone" className={labelClass}>Phone Number</label>
									</div>

									<button
										onClick={placeOrder}
										className="group relative mt-2 w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold text-lg overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
									>
										<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
										<span className="relative">Confirm</span>
									</button>

									<button
										type="button"
										onClick={closeModal}
										className="text-sm font-semibold text-secondary/60 transition hover:text-accent cursor-pointer"
									>
										Cancel
									</button>

									<p className="flex items-center justify-center gap-2 text-xs text-secondary/50">
										<BiShieldQuarter size={16} className="text-accent" />
										Your details are only used for this order
									</p>
								</div>
							</div>
						)}
					</div>
				</div>,
				document.body
			)}
		</>
	);
}