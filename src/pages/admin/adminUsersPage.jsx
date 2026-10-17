import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LoadingAnimation from "../../components/loadingAnimation";
import toast from "react-hot-toast";
import { BiSearch, BiX, BiChevronLeft, BiChevronRight, BiChevronDown, BiGroup, BiBlock, BiCheckCircle, BiShield, BiUser } from "react-icons/bi";

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState(""); // UI only
	const [filter, setFilter] = useState("All"); // UI only

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");

			axios
				.get(
					import.meta.env.VITE_API_URL +
						"/users/all/" +
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
					setUsers(response.data.users);
					setTotalPages(response.data.totalPages);
					setLoading(false);
				});
		}
	}, [loading]);

	// ---------- design helpers (filter and summarise the users already on this page) ----------
	const list = Array.isArray(users) ? users : [];

	const filters = [
		{ key: "All", test: () => true },
		{ key: "Admins", test: (u) => u.role === "admin" },
		{ key: "Customers", test: (u) => u.role !== "admin" },
		{ key: "Blocked", test: (u) => u.isBlocked },
		{ key: "Not verified", test: (u) => !u.isEmailVerified },
	];

	const shown = useMemo(() => {
		const q = search.trim().toLowerCase();
		const active = filters.find((f) => f.key === filter) || filters[0];
		return list.filter((u) => {
			if (!active.test(u)) return false;
			if (!q) return true;
			return [u.email, u.firstName, u.lastName].some((v) =>
				String(v || "").toLowerCase().includes(q),
			);
		});
	}, [list, search, filter]);

	const adminCount = shown.filter((u) => u.role === "admin").length;
	const blockedCount = shown.filter((u) => u.isBlocked).length;

	return (
		<div className="relative w-full h-full flex flex-col bg-primary overflow-hidden">

			{/* Scrolling content (the pagination bar is outside this area, so it never covers the users) */}
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
								<BiGroup size={28} />
							</span>
							<div>
								<h2 className="text-3xl font-bold tracking-tight text-secondary">Users</h2>
								<p className="text-secondary/60">
									Manage your users at a glance
								</p>
							</div>
						</div>
					</div>

					{/* Summary cards (follow the search and filters) */}
					<div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-rise" style={{ animationDelay: "0.1s" }}>
						{[
							{ label: "Users", value: loading ? "..." : shown.length },
							{ label: "Admins", value: loading ? "..." : adminCount },
							{ label: "Blocked", value: loading ? "..." : blockedCount },
							{ label: "Page", value: `${pageNumber} of ${totalPages}` },
						].map((s) => (
							<div key={s.label} className="rounded-3xl bg-white border border-secondary/10 p-5 shadow-md shadow-accent/5">
								<p className="text-sm text-secondary/50">{s.label}</p>
								<p key={String(s.value)} className="mt-1 text-3xl font-extrabold text-secondary tabular-nums animate-rise">{s.value}</p>
							</div>
						))}
					</div>

					{/* Search + filters (work on the users shown on this page) */}
					<div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4 animate-rise" style={{ animationDelay: "0.15s" }}>
						<div className="relative w-full lg:max-w-sm">
							<BiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search name or email..."
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
							{filters.map((f) => (
								<button
									key={f.key}
									onClick={() => setFilter(f.key)}
									className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 cursor-pointer ${filter === f.key ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"}`}
								>
									{f.key}
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

					{/* Users table */}
					{!loading && (
						<div className="mt-6 rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 overflow-x-auto animate-rise" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
							<table className="min-w-[980px] w-full text-sm">
								<thead>
									<tr className="bg-primary/70 text-left">
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">User</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Role</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Email Verification</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Account Status</th>
										<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{shown.map((user, index) => (
										<tr
											key={user.email}
											style={{ animationDelay: `${Math.min(index, 10) * 50}ms`, animationFillMode: "backwards" }}
											className="border-t border-secondary/10 transition-colors hover:bg-accent/5 animate-rise"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4">
													<div className="relative w-12 h-12 shrink-0 rounded-full bg-linear-to-br from-accent to-[#b06cff] text-white font-bold flex items-center justify-center shadow-md shadow-accent/25 overflow-hidden ring-2 ring-white">
														<span>{String(user.firstName || user.email || "?").charAt(0).toUpperCase()}</span>
														{user.image && (
															<img
																referrerPolicy="no-referrer"
																src={user.image}
																alt=""
																onError={(e) => { e.currentTarget.style.display = "none" }}
																className="absolute inset-0 w-full h-full object-cover"
															/>
														)}
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-secondary truncate">{user.firstName} {user.lastName}</p>
														<p className="text-xs text-secondary/50 truncate">{user.email}</p>
													</div>
												</div>
											</td>

											<td className="px-6 py-4">
												{user.role === "admin" ? (
													<span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-bold">
														<BiShield size={14} /> {user.role}
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/5 text-secondary/70 px-3 py-1 text-xs font-bold">
														<BiUser size={14} /> {user.role}
													</span>
												)}
											</td>

											<td className="px-6 py-4">
												{user.isEmailVerified ? (
													<span className="inline-flex items-center gap-1.5 rounded-full bg-accent-2/20 text-[#0b8f66] px-3 py-1 text-xs font-bold">
														<BiCheckCircle size={14} /> Verified
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5b301]/15 text-[#b07d00] px-3 py-1 text-xs font-bold">
														<span className="w-2 h-2 rounded-full bg-[#f5b301]" /> Not Verified
													</span>
												)}
											</td>

											<td className="px-6 py-4">
												{user.isBlocked ? (
													<span className="inline-flex items-center gap-2 rounded-full bg-[#ff4d6d]/10 text-[#e0345a] px-3 py-1 text-xs font-bold">
														<span className="w-2 h-2 rounded-full bg-[#ff4d6d]" /> Blocked
													</span>
												) : (
													<span className="inline-flex items-center gap-2 rounded-full bg-accent-2/20 text-[#0b8f66] px-3 py-1 text-xs font-bold">
														<span className="relative flex w-2 h-2">
															<span className="absolute inline-flex w-full h-full rounded-full bg-accent-2 opacity-75 animate-ping" />
															<span className="relative inline-flex w-2 h-2 rounded-full bg-accent-2" />
														</span>
														Active
													</span>
												)}
											</td>

											<td className="px-6 py-4">
												<div className="flex items-center justify-end gap-2">
													{/* block user button */}
													<button className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition active:scale-95 cursor-pointer ${user.isBlocked ? "text-[#0b8f66] border-accent-2/60 bg-accent-2/10 hover:bg-accent-2 hover:text-[#06553c]" : "text-[#e0345a] border-[#ff4d6d]/40 bg-[#ff4d6d]/5 hover:bg-[#ff4d6d] hover:text-white hover:shadow-lg hover:shadow-[#ff4d6d]/30"}`}
													onClick={
														()=>{
															axios.post(import.meta.env.VITE_API_URL+"/users/toggle-block",{
																email : user.email
															},{
																headers : {
																	"Authorization" : "Bearer "+localStorage.getItem("token")
																}
															}).then(
																(response)=>{
																	toast.success(response.data.message);
																	setLoading(true);
																}
															).catch(
																(err)=>{
																	toast.error(err?.response?.data?.message || "Failed to toggle block status");
																}
															)

														}
													}>
														{user.isBlocked ? <BiCheckCircle size={16} /> : <BiBlock size={16} />}
														{user.isBlocked ? "Unblock" : "Block"}
													</button>

													{/* make admin or customer button */}
													<button className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition active:scale-95 cursor-pointer ${user.role === "admin" ? "text-secondary/70 border-secondary/20 bg-secondary/5 hover:bg-secondary hover:text-white" : "text-accent border-accent/40 bg-accent/5 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/30"}`}
													onClick={
														()=>{
															axios.post(import.meta.env.VITE_API_URL+"/users/toggle-role",{
																email : user.email
															},{
																headers : {
																	"Authorization" : "Bearer "+localStorage.getItem("token")
																}
															}).then(
																(response)=>{
																	toast.success(response.data.message);
																	setLoading(true);
																}
															).catch(
																(err)=>{
																	toast.error(err?.response?.data?.message || "Failed to toggle block status");
																}
															)
															
														}
													}
													>
														{user.role === "admin" ? <BiUser size={16} /> : <BiShield size={16} />}
														{user.role === "admin" ? "Make Customer" : "Make Admin"}
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{shown.length === 0 && (
								<div className="py-16 text-center">
									<div className="mx-auto w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
										<BiGroup size={30} />
									</div>
									<p className="mt-4 text-lg font-bold text-secondary">No users found</p>
									<p className="mt-1 text-secondary/60">{list.length === 0 ? "There are no users yet." : "Try a different search or filter."}</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Pagination: pinned at the bottom of the page, below the scrolling users */}
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