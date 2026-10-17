import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import getFormattedPrice from "../../utils/price-format";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { BiSearch, BiX, BiGridAlt, BiListUl, BiPackage } from "react-icons/bi";
import LoadingAnimation from "../../components/loadingAnimation";
import DeleteModal from "../../components/deleteModal";

const FALLBACK_IMG = "/images/default-product-01.png";

// Design only: discount percentage from the labelled price
function discountOf(p) {
	const l = Number(p?.labelledPrice), pr = Number(p?.price);
	return l > pr && pr > 0 ? Math.round(((l - pr) / l) * 100) : 0;
}

function VisibilityChip({ visible }) {
	return visible ? (
		<span className="inline-flex items-center gap-2 rounded-full bg-accent-2/20 px-3 py-1 text-xs font-bold text-[#0b8f66]">
			<span className="h-2 w-2 rounded-full bg-accent-2" />
			Visible
		</span>
	) : (
		<span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary/60">
			<span className="h-2 w-2 rounded-full bg-secondary/40" />
			Hidden
		</span>
	);
}

export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState(""); // UI only
	const [visibilityFilter, setVisibilityFilter] = useState("All"); // UI only
	const [view, setView] = useState("table"); // UI only
	useEffect(()=>{
		if(loading){
			const token = localStorage.getItem("token")

			axios.get(import.meta.env.VITE_API_URL + "/products", {
				headers: {
					Authorization: "Bearer "+token
				}
			}).then(
				(response)=>{
					setProducts(response.data)
					setLoading(false)
				}
			)
		}
	}, [loading])

	// ---------- design helpers (filter and summarise the products already loaded) ----------
	const list = Array.isArray(products) ? products : [];

	const shown = useMemo(() => {
		const q = search.trim().toLowerCase();
		return list.filter((p) => {
			if (visibilityFilter === "Visible" && !p.isVisible) return false;
			if (visibilityFilter === "Hidden" && p.isVisible) return false;
			if (!q) return true;
			return [p.productId, p.name, p.category, p.brand, p.model].some((v) =>
				String(v || "").toLowerCase().includes(q),
			);
		});
	}, [list, search, visibilityFilter]);

	const visibleCount = shown.filter((p) => p.isVisible).length;
	const hiddenCount = shown.length - visibleCount;
	const categoryCount = new Set(shown.map((p) => p.category).filter(Boolean)).size;

	const filters = [
		{ key: "All", count: list.length },
		{ key: "Visible", count: list.filter((p) => p.isVisible).length },
		{ key: "Hidden", count: list.filter((p) => !p.isVisible).length },
	];

	return (
		<div className="relative w-full h-full overflow-y-auto bg-primary">

			{/* Background */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
				<div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/25 blur-3xl animate-blob" />
				<div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
			</div>

			<div className="relative z-10 p-5 lg:p-8 pb-10">

				{/* Header */}
				<div className="flex flex-wrap items-center justify-between gap-4 animate-rise">
					<div className="flex items-center gap-4">
						<span className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
							<BiPackage size={28} />
						</span>
						<div>
							<h2 className="text-3xl font-bold tracking-tight text-secondary">Products</h2>
							<p className="text-secondary/60">
								Manage your catalog at a glance
							</p>
						</div>
					</div>

					<Link
						to="/admin/add-product"
						className="group relative h-12 pl-5 pr-6 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold flex items-center gap-2 overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
					>
						<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
						<FaPlus className="relative transition-transform duration-300 group-hover:rotate-90" />
						<span className="relative">Add product</span>
					</Link>
				</div>

				{/* Summary cards (follow the search and filters) */}
				<div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-rise" style={{ animationDelay: "0.1s" }}>
					{[
						{ label: "Items", value: loading ? "..." : shown.length },
						{ label: "Visible", value: loading ? "..." : visibleCount },
						{ label: "Hidden", value: loading ? "..." : hiddenCount },
						{ label: "Categories", value: loading ? "..." : categoryCount },
					].map((s) => (
						<div key={s.label} className="rounded-3xl bg-white border border-secondary/10 p-5 shadow-md shadow-accent/5">
							<p className="text-sm text-secondary/50">{s.label}</p>
							<p key={String(s.value)} className="mt-1 text-3xl font-extrabold text-secondary tabular-nums animate-rise">{s.value}</p>
						</div>
					))}
				</div>

				{/* Search, visibility filter, view toggle */}
				<div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4 animate-rise" style={{ animationDelay: "0.15s" }}>
					<div className="relative w-full lg:max-w-sm">
						<BiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search name, ID, brand, category..."
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

					<div className="flex flex-1 items-center justify-between gap-3">
						<div className="flex gap-2 overflow-x-auto pb-1">
							{filters.map((f) => (
								<button
									key={f.key}
									onClick={() => setVisibilityFilter(f.key)}
									className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 cursor-pointer ${visibilityFilter === f.key ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"}`}
								>
									{f.key} <span className="opacity-70">({f.count})</span>
								</button>
							))}
						</div>

						<div className="shrink-0 flex rounded-full bg-white border border-secondary/10 p-1 shadow-sm">
							<button
								onClick={() => setView("table")}
								aria-label="Table view"
								className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${view === "table" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-secondary/50 hover:text-accent"}`}
							>
								<BiListUl size={22} />
							</button>
							<button
								onClick={() => setView("grid")}
								aria-label="Grid view"
								className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${view === "grid" ? "bg-accent text-white shadow-md shadow-accent/30" : "text-secondary/50 hover:text-accent"}`}
							>
								<BiGridAlt size={22} />
							</button>
						</div>
					</div>
				</div>

				{/* Loading */}
				{ loading && (
					<div className="min-h-[50vh] flex items-center justify-center [&>*]:static!">
						<LoadingAnimation />
					</div>
				)}

				{/* Empty state */}
				{!loading && shown.length === 0 && (
					<div className="mt-6 rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 py-16 text-center animate-rise">
						<div className="mx-auto w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
							<BiPackage size={30} />
						</div>
						<p className="mt-4 text-lg font-bold text-secondary">No products found</p>
						<p className="mt-1 text-secondary/60">{list.length === 0 ? "Add your first product to get started." : "Try a different search or filter."}</p>
					</div>
				)}

				{/* Table view */}
				{!loading && shown.length > 0 && view === "table" && (
					<div className="mt-6 rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 overflow-x-auto animate-rise" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
						<table className="min-w-[960px] w-full text-sm">
							<thead>
								<tr className="bg-primary/70 text-left">
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Product</th>
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Price</th>
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Category</th>
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Brand / Model</th>
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50">Visibility</th>
									<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-secondary/50 text-right">Actions</th>
								</tr>
							</thead>

							<tbody>
								{shown.map((item, index) => {
									const discount = discountOf(item);
									return (
										<tr
											key={item.productId}
											/* fill-mode "backwards" so the row keeps no transform after it appears
											   (a transform would trap the delete popup inside the row) */
											style={{ animationDelay: `${Math.min(index, 10) * 50}ms`, animationFillMode: "backwards" }}
											className="border-t border-secondary/10 transition-colors hover:bg-accent/5 animate-rise"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-4">
													<div className="w-14 h-14 shrink-0 rounded-2xl bg-linear-to-br from-primary to-white ring-1 ring-secondary/10 overflow-hidden">
														<img
															src={item.images?.[0]}
															alt={item.name}
															loading="lazy"
															referrerPolicy="no-referrer"
															onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
															className="w-full h-full object-contain p-1.5"
														/>
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-secondary line-clamp-1">{item.name}</p>
														<p className="text-xs text-secondary/50">{item.productId}</p>
													</div>
												</div>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<p className="font-extrabold text-secondary">{getFormattedPrice(item.price)}</p>
												{item.labelledPrice ? (
													<p className="mt-0.5 flex items-center gap-2 text-xs">
														<span className="text-secondary/40 line-through">{getFormattedPrice(item.labelledPrice)}</span>
														{discount > 0 && (
															<span className="rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white font-bold px-2 py-0.5">-{discount}%</span>
														)}
													</p>
												) : (
													<p className="mt-0.5 text-xs text-secondary/40">No labelled price</p>
												)}
											</td>

											<td className="px-6 py-4">
												<span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
													{item.category || "Uncategorized"}
												</span>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<p className="font-medium text-secondary">{item.brand || <span className="text-secondary/40">N/A</span>}</p>
												<p className="text-xs text-secondary/50">{item.model || "N/A"}</p>
											</td>

											<td className="px-6 py-4">
												<VisibilityChip visible={item.isVisible} />
											</td>

											<td className="px-6 py-4">
												<div className="flex justify-end items-center text-2xl gap-2">
													<Link 
														to={"/admin/update-product"}
														state={item}
														aria-label="Edit product"
														className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"
													>
														<CiEdit/>
													</Link>

													<DeleteModal product={item} setLoading={setLoading} />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{/* Grid view */}
				{!loading && shown.length > 0 && view === "grid" && (
					<div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
						{shown.map((item, index) => {
							const discount = discountOf(item);
							return (
								<div
									key={item.productId}
									/* fill-mode "backwards" and no hover movement, so the delete popup can't get trapped in the card */
									style={{ animationDelay: `${Math.min(index, 10) * 60}ms`, animationFillMode: "backwards" }}
									className="group rounded-3xl bg-white border border-secondary/10 overflow-hidden shadow-md shadow-accent/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-accent/15 animate-rise"
								>
									<div className="relative h-[180px] bg-linear-to-br from-primary to-white overflow-hidden">
										<div className="absolute left-3 top-3 z-10"><VisibilityChip visible={item.isVisible} /></div>
										{discount > 0 && (
											<span className="absolute right-3 top-3 z-10 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white text-xs font-extrabold px-3 py-1 shadow-lg shadow-[#ff4d6d]/30">-{discount}%</span>
										)}
										<img
											src={item.images?.[0]}
											alt={item.name}
											loading="lazy"
											referrerPolicy="no-referrer"
											onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
											className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
										/>
									</div>

									<div className="p-5">
										<p className="text-xs font-semibold text-accent truncate">{item.category || "Uncategorized"}</p>
										<h3 className="mt-1 text-base font-bold leading-6 text-secondary line-clamp-2 min-h-[48px]">{item.name}</h3>
										<p className="mt-1 text-xs text-secondary/50 truncate">
											{[item.brand, item.model].filter(Boolean).join(" · ") || "No brand or model"} · {item.productId}
										</p>

										<div className="mt-3 flex items-baseline gap-2 flex-wrap">
											<span className="text-xl font-extrabold text-secondary">{getFormattedPrice(item.price)}</span>
											{item.labelledPrice ? (
												<span className="text-sm text-secondary/40 line-through">{getFormattedPrice(item.labelledPrice)}</span>
											) : null}
										</div>

										<div className="mt-4 flex items-center gap-2 text-2xl">
											<Link
												to={"/admin/update-product"}
												state={item}
												className="flex-1 h-11 rounded-full bg-primary text-secondary text-base font-semibold flex items-center justify-center gap-1 transition hover:bg-accent hover:text-white active:scale-95"
											>
												<CiEdit /> Edit
											</Link>
											<DeleteModal product={item} setLoading={setLoading} />
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Footer tip */}
				{!loading && shown.length > 0 && view === "table" && (
					<p className="mt-4 text-xs text-secondary/50">
						Tip: Scroll horizontally on small screens to view all columns.
					</p>
				)}
			</div>
		</div>
	);
}