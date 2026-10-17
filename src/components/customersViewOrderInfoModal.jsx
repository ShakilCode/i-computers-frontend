import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import getFormattedDate from "../utils/date-format";
import getFormattedPrice from "../utils/price-format";
import { BiX, BiCalendar, BiEnvelope, BiUser, BiNote } from "react-icons/bi";

const FALLBACK_IMG = "/images/default-product-01.png";

// Design only: colors for the status chip
function statusStyle(status) {
	const s = String(status || "").toLowerCase();
	if (s.includes("deliver") || s.includes("complete")) {
		return { chip: "bg-accent-2 text-[#06553c]", dot: "bg-[#06553c]" };
	}
	if (s.includes("cancel") || s.includes("reject") || s.includes("fail")) {
		return { chip: "bg-white text-[#e0345a]", dot: "bg-[#ff4d6d]" };
	}
	if (s.includes("ship") || s.includes("process") || s.includes("dispatch")) {
		return { chip: "bg-white text-accent", dot: "bg-accent" };
	}
	return { chip: "bg-[#ffe08a] text-[#7a5600]", dot: "bg-[#f5b301]" };
}

export default function CustomerViewOrderInfoModal(props) {
	const [isVisible, setIsVisible] = useState(false);
	const order = props.order;
	const st = statusStyle(order.status);

	// UI only: lock page scroll and allow Escape to close while the modal is open
	useEffect(() => {
		if (!isVisible) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e) => {
			if (e.key === "Escape") setIsVisible(false);
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			document.removeEventListener("keydown", onKey);
		};
	}, [isVisible]);

	return (
		<>
			<button
				className="group relative h-10 px-6 rounded-full bg-primary border border-accent/30 text-accent text-sm font-semibold overflow-hidden transition hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/25 active:scale-95 cursor-pointer"
				onClick={() => setIsVisible(true)}
			>
				View Details
			</button>

			{/* Rendered in document.body so it always covers the whole screen */}
			{isVisible && createPortal(
				<div
					onClick={() => setIsVisible(false)}
					className="fixed inset-0 z-200 flex items-center justify-center bg-secondary/30 backdrop-blur-md p-4"
				>
					<div className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-accent/30 blur-3xl animate-blob" />

					<div
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-[620px] max-h-[92vh] flex flex-col rounded-[2rem] bg-white shadow-2xl shadow-accent/30 overflow-hidden animate-rise"
					>
						{/* Header */}
						<div className="relative shrink-0 bg-linear-to-br from-accent via-[#8b7cf6] to-[#b06cff] [background-size:200%_200%] animate-gradient p-6 sm:p-8 text-white overflow-hidden">
							<div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/20 blur-2xl animate-blob" />

							<button
								onClick={() => setIsVisible(false)}
								aria-label="Close"
								className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition hover:bg-white hover:text-accent hover:rotate-90 active:scale-90 cursor-pointer"
							>
								<BiX size={24} />
							</button>

							<p className="relative text-xs font-semibold text-white/70">Order</p>
							<h1 className="relative mt-1 text-2xl sm:text-3xl font-bold tracking-tight pr-12 break-all">
								{order.orderId}
							</h1>

							<div className="relative mt-4 flex flex-wrap items-center gap-3">
								<span className="inline-flex items-center gap-2 text-sm text-white/90">
									<BiCalendar size={18} />
									{getFormattedDate(order.date)}
								</span>
								<span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${st.chip}`}>
									<span className={`w-2 h-2 rounded-full ${st.dot}`} />
									{order.status}
								</span>
							</div>
						</div>

						{/* Body (scrolls if there are many items) */}
						<div className="flex-1 overflow-y-auto p-6 sm:p-8">

							{/* Customer */}
							<div className="grid sm:grid-cols-2 gap-3 animate-rise" style={{ animationDelay: "0.1s" }}>
								<div className="rounded-2xl bg-primary p-4 min-w-0">
									<p className="flex items-center gap-2 text-xs font-semibold text-secondary/50"><BiUser size={16} className="text-accent" />Customer</p>
									<p className="mt-1 font-semibold text-secondary truncate">{order.firstName + " " + order.lastName}</p>
								</div>
								<div className="rounded-2xl bg-primary p-4 min-w-0">
									<p className="flex items-center gap-2 text-xs font-semibold text-secondary/50"><BiEnvelope size={16} className="text-accent" />Email</p>
									<p className="mt-1 font-semibold text-secondary truncate">{order.email}</p>
								</div>
							</div>

							{/* Notes */}
							<div className="mt-3 rounded-2xl bg-primary p-4 animate-rise" style={{ animationDelay: "0.15s" }}>
								<p className="flex items-center gap-2 text-xs font-semibold text-secondary/50"><BiNote size={16} className="text-accent" />Notes</p>
								<p className="mt-1 text-secondary/80 leading-7">{order.notes ? order.notes : <span className="text-secondary/40">No notes</span>}</p>
							</div>

							{/* Items */}
							<h2 className="mt-7 text-lg font-bold text-secondary animate-rise" style={{ animationDelay: "0.2s" }}>
								Items <span className="text-secondary/40 font-semibold">({order.items.length})</span>
							</h2>
							<div className="mt-3 flex flex-col gap-3">
								{
									order.items.map(
										(item, index) => {
											return(
												<div
													key={index}
													className="flex items-center justify-between gap-4 rounded-2xl border border-secondary/10 p-3 transition hover:border-accent/40 hover:shadow-md hover:shadow-accent/10 animate-rise"
													style={{ animationDelay: `${0.25 + Math.min(index, 8) * 0.06}s` }}
												>
													<div className="flex items-center gap-4 min-w-0">
														<div className="w-16 h-16 shrink-0 rounded-xl bg-linear-to-br from-primary to-white overflow-hidden">
															<img
																src={item.image}
																alt={item.name}
																referrerPolicy="no-referrer"
																onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
																className="w-full h-full object-contain p-1.5"
															/>
														</div>
														<div className="flex flex-col min-w-0">
															<span className="text-sm font-semibold text-secondary line-clamp-2">{item.name}</span>
															<span className="mt-1 inline-block self-start rounded-full bg-accent/10 text-accent text-xs font-semibold px-2.5 py-0.5">Qty: {item.qty}</span>
														</div>
													</div>
													<span className="shrink-0 text-base font-bold text-secondary">{getFormattedPrice(item.price)}</span>
												</div>
											)
										}
									)
								}
							</div>
						</div>

						{/* Total footer (ticket style) */}
						<div className="shrink-0 relative border-t-2 border-dashed border-secondary/15 bg-white px-6 sm:px-8 py-5 flex items-center justify-between">
							<span className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-secondary/10" />
							<span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-secondary/10" />
							<span className="text-secondary/60 font-medium">Total</span>
							<span className="text-3xl font-extrabold text-secondary">{getFormattedPrice(order.total)}</span>
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
	);
}