import axios from "axios";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BiChevronLeft, BiChevronRight, BiChevronDown, BiCalendar, BiEnvelope, BiPackage } from "react-icons/bi";
import CustomerViewOrderInfoModal from "../components/customersViewOrderInfoModal";
import getFormattedDate from "../utils/date-format";
import getFormattedPrice from "../utils/price-format";
import LoadingAnimation from "../components/loadingAnimation";

// Design only: colors for the status chip
function statusStyle(status) {
	const s = String(status || "").toLowerCase();
	if (s.includes("deliver") || s.includes("complete")) {
		return { chip: "bg-accent-2/20 text-[#0b8f66]", dot: "bg-accent-2" };
	}
	if (s.includes("cancel") || s.includes("reject") || s.includes("fail")) {
		return { chip: "bg-[#ff4d6d]/10 text-[#e0345a]", dot: "bg-[#ff4d6d]" };
	}
	if (s.includes("ship") || s.includes("process") || s.includes("dispatch")) {
		return { chip: "bg-accent/10 text-accent", dot: "bg-accent" };
	}
	return { chip: "bg-[#f5b301]/15 text-[#b07d00]", dot: "bg-[#f5b301]" };
}

export default function MyOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");

			axios
				.get(
					import.meta.env.VITE_API_URL +
						"/orders/" +
						pageSize +
						"/" +
						pageNumber,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					},
				)
				.then((response) => {
					setOrders(response.data.orders);
					setTotalPages(response.data.totalPages);
					setLoading(false);
				});
		}
	}, [loading]);

	return (
		<div className="relative w-full min-h-[calc(100vh-100px)] bg-primary overflow-x-hidden">

			{/* Loading animation, centered on the screen */}
			{loading && (
				<div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none [&>*]:static!">
					<LoadingAnimation />
				</div>
			)}

			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
				<div className="absolute top-1/2 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 pb-32">

				{/* Title */}
				<div className="flex flex-wrap items-end justify-between gap-3 animate-rise">
					<div>
						<h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-secondary">My orders</h1>
						<p className="mt-2 text-secondary/60">Track your purchases and see their status.</p>
					</div>
					{!loading && orders.length > 0 && (
						<span className="rounded-full bg-white border border-secondary/10 px-4 py-2 text-sm font-semibold text-secondary shadow-sm">
							{orders.length} {orders.length === 1 ? "order" : "orders"} on this page
						</span>
					)}
				</div>

				{/* Empty state */}
				{!loading && orders.length === 0 && (
					<div className="mt-10 mx-auto max-w-md rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-10 text-center animate-rise">
						<div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
							<BiPackage size={38} />
						</div>
						<h2 className="mt-6 text-2xl font-bold text-secondary">No orders yet</h2>
						<p className="mt-2 text-secondary/60">When you place an order, it will show up here.</p>
						<Link
							to="/products"
							className="mt-6 h-12 px-8 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold inline-flex items-center justify-center shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95"
						>
							Browse products
						</Link>
					</div>
				)}

				{/* Order cards */}
				{!loading && orders.length > 0 && (
					<div className="mt-8 flex flex-col gap-4">
						{orders.map((order, index) => {
							const st = statusStyle(order.status);
							return (
								<div
									key={order.id ?? order.orderId}
									/* fill-mode "backwards" so the card keeps no transform after it appears
									   (a transform would trap the order-details popup inside the card) */
									style={{ animationDelay: `${Math.min(index, 8) * 70}ms`, animationFillMode: "backwards" }}
									className="relative rounded-3xl bg-white border border-secondary/10 p-5 sm:p-6 shadow-md shadow-accent/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/15 hover:border-accent/30 animate-rise"
								>
									{/* Accent edge that follows the status color */}
									<span className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${st.dot}`} />

									<div className="grid gap-5 lg:grid-cols-[1.1fr_1.2fr_auto_auto] lg:items-center">

										{/* Order id + date */}
										<div className="min-w-0">
											<p className="text-xs font-semibold text-secondary/40">Order ID</p>
											<p className="mt-1 text-lg font-bold text-secondary truncate">{order.orderId}</p>
											<p className="mt-2 flex items-center gap-2 text-sm text-secondary/60">
												<BiCalendar size={16} className="text-accent" />
												{getFormattedDate(order.date)}
											</p>
										</div>

										{/* Customer */}
										<div className="min-w-0">
											<p className="font-semibold text-secondary truncate">{order.firstName + " "+order.lastName}</p>
											<p className="mt-1 flex items-center gap-2 text-sm text-secondary/60 min-w-0">
												<BiEnvelope size={16} className="text-accent shrink-0" />
												<span className="truncate">{order.email}</span>
											</p>
										</div>

										{/* Total + status */}
										<div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
											<p className="text-2xl font-extrabold text-secondary">{getFormattedPrice(order.total)}</p>
											<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${st.chip}`}>
												<span className={`w-2 h-2 rounded-full ${st.dot}`} />
												{order.status}
											</span>
										</div>

										{/* Actions */}
										<div className="lg:justify-self-end">
											<CustomerViewOrderInfoModal order={order}/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Floating pagination */}
			<div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[560px]">
				<div className="flex items-center justify-between gap-2 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-2xl shadow-accent/25 p-2">
					<button
						className="h-11 pl-3 pr-5 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center gap-1 shadow-md shadow-accent/25 transition hover:shadow-lg active:scale-95 cursor-pointer"
						onClick={() => {
							if(pageNumber > 1){
								setPageNumber(pageNumber - 1);
								setLoading(true);
							}else{
								toast.success("You are on the first page");
							}
						}}
					>
						<BiChevronLeft size={22} />
						<span className="hidden sm:inline">Previous</span>
					</button>

					<span className="text-sm font-semibold text-secondary text-center tabular-nums px-1">
						Page {pageNumber} of {totalPages}
					</span>

					<button
						className="h-11 pl-5 pr-3 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center gap-1 shadow-md shadow-accent/25 transition hover:shadow-lg active:scale-95 cursor-pointer"
						onClick={
							()=>{
								if(pageNumber < totalPages){
									setPageNumber(pageNumber + 1);
									setLoading(true);
								}else{
									toast.success("You are on the last page");
								}
							}
						}
					>
						<span className="hidden sm:inline">Next</span>
						<BiChevronRight size={22} />
					</button>

					<div className="relative">
						<select
							value={pageSize}
							onChange={(e) => {
								setPageSize(parseInt(e.target.value));
								setLoading(true);
							}}
							className="appearance-none h-11 pl-4 pr-9 rounded-full bg-primary text-secondary text-sm font-semibold outline-none cursor-pointer transition hover:bg-accent/10 focus:ring-4 focus:ring-accent/15"
						>
							{/* <option value={2}>2 per page</option>
							<option value={5}>5 per page</option> */}
							<option value={10}>10 per page</option>
							<option value={20}>20 per page</option>
							<option value={50}>50 per page</option>
						</select>
						<BiChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
					</div>
				</div>
			</div>
		</div>
	);
}