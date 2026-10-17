import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import getFormattedDate from "../utils/date-format";
import getFormattedPrice from "../utils/price-format";
import axios from "axios";
import toast from "react-hot-toast";
import { BiX, BiCalendar, BiEnvelope, BiUser, BiNote, BiCheck } from "react-icons/bi";

const FALLBACK_IMG = "/images/default-product-01.png";

// Design only: colors for the status chip in the header
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

// Design only: the four choices shown as pills (same values as the old dropdown)
const statusOptions = [
	{ value: "Pending", active: "bg-[#f5b301] text-white shadow-[#f5b301]/40", idle: "text-[#b07d00] border-[#f5b301]/40 hover:bg-[#f5b301]/10" },
	{ value: "Shipped", active: "bg-accent text-white shadow-accent/40", idle: "text-accent border-accent/40 hover:bg-accent/10" },
	{ value: "Delivered", active: "bg-accent-2 text-[#06553c] shadow-accent-2/50", idle: "text-[#0b8f66] border-accent-2/60 hover:bg-accent-2/15" },
	{ value: "Cancelled", active: "bg-[#ff4d6d] text-white shadow-[#ff4d6d]/40", idle: "text-[#e0345a] border-[#ff4d6d]/40 hover:bg-[#ff4d6d]/10" },
];

export default function ViewOrderInfoModal(props) {
	const [isVisible, setIsVisible] = useState(false);
	const order = props.order;
    const [status , setStatus] = useState(order.status)
    const [notes , setNotes] = useState(order.notes)

    async function handleChange(){
        try{

            const token = localStorage.getItem("token")

            await axios.put(import.meta.env.VITE_API_URL+"/orders/"+order.orderId , {
                status : status,
                notes : notes
            } , {
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            })

            toast.success("Order updated successfully")
            window.location.reload()

        }catch{
            toast.error("Failed to update order")
        }
    }

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

	const st = statusStyle(order.status);
	const hasChanges = order.status != status || order.notes != notes;

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
						className="relative w-full max-w-[680px] max-h-[94vh] flex flex-col rounded-[2rem] bg-white shadow-2xl shadow-accent/30 overflow-hidden animate-rise"
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

						{/* Body (scrolls) */}
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

							{/* Update status */}
							<div className="mt-5 animate-rise" style={{ animationDelay: "0.15s" }}>
								<p className="text-sm font-bold text-secondary">Update status</p>
								<div className="mt-3 flex flex-wrap gap-2">
									{statusOptions.map((opt) => {
										const selected = status === opt.value;
										return (
											<button
												key={opt.value}
												type="button"
												onClick={() => setStatus(opt.value)}
												className={`h-10 px-5 rounded-full border text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${selected ? `${opt.active} border-transparent shadow-lg` : `bg-white ${opt.idle}`}`}
											>
												{selected && <BiCheck size={18} />}
												{opt.value}
											</button>
										);
									})}
								</div>
							</div>

							{/* Notes */}
							<div className="mt-5 animate-rise" style={{ animationDelay: "0.2s" }}>
								<label htmlFor="orderNotes" className="flex items-center gap-2 text-sm font-bold text-secondary">
									<BiNote size={18} className="text-accent" />Notes
								</label>
								<textarea
									id="orderNotes"
									value={notes ?? ""}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Add a note for this order..."
									rows={3}
									className="mt-3 w-full resize-y rounded-2xl bg-white border border-secondary/10 px-5 py-4 text-secondary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
								/>
							</div>

							{/* Items */}
							<h2 className="mt-7 text-lg font-bold text-secondary animate-rise" style={{ animationDelay: "0.25s" }}>
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
													style={{ animationDelay: `${0.3 + Math.min(index, 8) * 0.06}s` }}
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

						{/* Footer: total + save bar (ticket style) */}
						<div className="shrink-0 relative border-t-2 border-dashed border-secondary/15 bg-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
							<span className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-secondary/10" />
							<span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-secondary/10" />
							<div>
								<p className="text-sm text-secondary/60 font-medium">Total</p>
								<p className="text-3xl font-extrabold text-secondary">{getFormattedPrice(order.total)}</p>
							</div>

							{
								hasChanges &&
								<div className="flex items-center gap-3 animate-rise">
									<span className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#b07d00]">
										<span className="w-2 h-2 rounded-full bg-[#f5b301] animate-pulse-soft" />
										Unsaved changes
									</span>
									<button
										onClick={handleChange}
										className="group relative h-12 px-8 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
									>
										<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
										<span className="relative">Save changes</span>
									</button>
								</div>
							}
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
	);
}