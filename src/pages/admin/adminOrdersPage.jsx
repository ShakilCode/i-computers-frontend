import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LoadingAnimation from "../../components/loadingAnimation";
import getFormattedPrice from "../../utils/price-format";
import getFormattedDate from "../../utils/date-format";
import toast from "react-hot-toast";
import ViewOrderInfoModal from "../../components/viewOrderInfoModal";
import { BiSearch, BiX, BiChevronLeft, BiChevronRight, BiChevronDown, BiPackage } from "react-icons/bi";

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

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState(""); // UI only
	const [statusFilter, setStatusFilter] = useState("All"); // UI only

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

	// ---------- design helpers (filter and summarise the orders already on this page) ----------
	const statuses = useMemo(
		() => ["All", ...new Set(orders.map((o) => o.status).filter(Boolean))],
		[orders],
	);
	const activeStatus = statuses.includes(statusFilter) ? statusFilter : "All";

	const visibleOrders = useMemo(() => {
		const q = search.trim().toLowerCase();
		return orders.filter((o) => {
			if (activeStatus !== "All" && o.status !== activeStatus) return false;
			if (!q) return true;
			return [o.orderId, o.firstName, o.lastName, o.email].some((v) =>
				String(v || "").toLowerCase().includes(q),
			);
		});
	}, [orders, search, activeStatus]);

	// The summary cards follow the search and status filters
	const shownValue = visibleOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
	const isFiltered = activeStatus !== "All" || search.trim() !== "";

	return (
		<div className="relative w-full h-full flex flex-col bg-primary overflow-hidden">

			{/* Scrolling content (the pagination bar is outside this area, so it never covers the orders) */}
			<div className="relative flex-1 min-h-0 overflow-y-auto">

				{/* Background */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
					<div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/25 blur-3xl animate-blob" />
					<div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
				</div>

				<div className="relative z-10 p-5 lg:p-8 pb-6">

					{/* Header */}
					<div className="flex flex-wrap items-center justify-between gap-4 animate-rise">
						<div className="flex items-center gap-4">
							<span className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
								<BiPackage size={28} />
							</span>
							<div>
								<h2 className="text-3xl font-bold tracking-tight text-secondary">Orders</h2>
								<p className="text-secondary/60">
									Manage your orders at a glance
								</p>
							</div>
						</div>
					</div>

					{/* Summary cards (update with the search and status filters) */}
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-rise" style={{ animationDelay: "0.1s" }}>
						{[
							{ label: isFiltered ? "Orders matching filter" : "Orders on this page", value: loading ? "..." : visibleOrders.length },
							{ label: isFiltered ? "Value matching filter" : "Value on this page", value: loading ? "..." : getFormattedPrice(shownValue) },
							{ label: "Page", value: `${pageNumber} of ${totalPages}` },
						].map((s) => (
							<div key={s.label} className="rounded-3xl bg-white border border-secondary/10 p-5 shadow-md shadow-accent/5">
								<p className="text-sm text-secondary/50">{s.label}</p>
								<p key={String(s.value)} className="mt-1 text-2xl font-extrabold text-secondary tabular-nums animate-rise">{s.value}</p>
							</div>
						))}
					</div>

					{/* Search + status filters (work on the orders shown on this page) */}
					<div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4 animate-rise" style={{ animationDelay: "0.15s" }}>
						<div className="relative w-full lg:max-w-sm">
							<BiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search order ID, name or email..."
								className="w-full h-12 rounded-full bg-white border border-secondary/10 pl-11 pr-11 text-secondary outline-none shadow-sm transition focus:border-accent focus:ring-4 focus:ring-accent/15"
							/>
							{search !== "" && (
								<button
									onClick={() => setSearch("")}
									aria-label="Clear search"
									className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90 cursor-pointer"
								>
									<BiX size={18} />
								</button>
							)}
						</div>

						<div className="flex gap-2 overflow-x-auto pb-1">
							{statuses.map((s) => (
								<button
									key={s}
									onClick={() => setStatusFilter(s)}
									className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 cursor-pointer ${activeStatus === s ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"}`}
								>
									{s}
								</button>
							))}
						</div>
					</div>

					{/* Loading */}
					{loading && (
						<div className="min-h-[50vh] flex items-center justify-center [&>*]:static!">
							<LoadingAnimation />
						</div>
					)}

					{/* Orders table */}
					{!loading && (
						<div className="mt-6 rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 overflow-x-auto animate-rise" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
							<table className="min-w-[900px] w-full text-sm">
								<thead>
									<tr className="bg-primary/70 text-left">
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Order</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Customer</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Total Amount</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Status</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{visibleOrders.map((order, index) => {
										const st = statusStyle(order.status);
										return (
											<tr
												key={order.id ?? order.orderId}
												/* fill-mode "backwards" so the row keeps no transform after it appears
												   (a transform would trap the order popup inside the row) */
												style={{ animationDelay: `${Math.min(index, 10) * 50}ms`, animationFillMode: "backwards" }}
												className="border-t border-secondary/10 transition-colors hover:bg-accent/5 animate-rise"
											>
												<td className="px-6 py-4">
													<p className="font-bold text-secondary">{order.orderId}</p>
													<p className="mt-0.5 text-xs text-secondary/50">{getFormattedDate(order.date)}</p>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<span className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-accent to-[#b06cff] text-white font-bold flex items-center justify-center shadow-md shadow-accent/25">
															{String(order.firstName || "?").charAt(0).toUpperCase()}
														</span>
														<div className="min-w-0">
															<p className="font-semibold text-secondary truncate">{order.firstName + " "+order.lastName}</p>
															<p className="text-xs text-secondary/50 truncate">{order.email}</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 font-extrabold text-secondary whitespace-nowrap">{getFormattedPrice(order.total)}</td>
												<td className="px-6 py-4">
													<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${st.chip}`}>
														<span className={`w-2 h-2 rounded-full ${st.dot}`} />
														{order.status}
													</span>
												</td>
												<td className="px-6 py-4 text-right">
													<ViewOrderInfoModal order={order}/>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>

							{visibleOrders.length === 0 && (
								<div className="py-16 text-center">
									<div className="mx-auto w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
										<BiPackage size={30} />
									</div>
									<p className="mt-4 text-lg font-bold text-secondary">No orders found</p>
									<p className="mt-1 text-secondary/60">{orders.length === 0 ? "There are no orders yet." : "Try a different search or status."}</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Pagination: pinned at the bottom of the page, below the scrolling orders */}
			<div className="relative z-20 shrink-0 px-4 pb-4 pt-3 flex justify-center">
				<div className="flex items-center justify-between gap-2 w-full max-w-[560px] rounded-full bg-white border border-secondary/10 shadow-2xl shadow-accent/25 p-2">
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