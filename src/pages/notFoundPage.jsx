import { Link } from "react-router-dom";
import { BiHomeAlt, BiShoppingBag, BiChevronRight } from "react-icons/bi";

export default function NotFoundPage() {

	const quickLinks = [
		{ to: "/products", label: "Products" },
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
		{ to: "/cart", label: "Cart" },
	];

	const digit =
		"bg-linear-to-r from-accent via-[#b06cff] to-accent-2 bg-clip-text text-transparent animate-gradient [background-size:200%_100%] font-extrabold leading-none text-[8rem] sm:text-[12rem] lg:text-[15rem] select-none";

	return (
		<div className="relative w-full min-h-screen overflow-hidden bg-primary flex items-center justify-center px-4 py-16">

			{/* Keyframes for the searching magnifier (kept here so no CSS file change is needed) */}
			<style>{`
				@keyframes nf-search {
					0%   { transform: translate(-14px, -8px) rotate(-6deg); }
					25%  { transform: translate(12px, -12px) rotate(4deg); }
					50%  { transform: translate(16px, 10px) rotate(8deg); }
					75%  { transform: translate(-10px, 14px) rotate(-4deg); }
					100% { transform: translate(-14px, -8px) rotate(-6deg); }
				}
				@keyframes nf-ring { to { transform: rotate(360deg); } }
			`}</style>

			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-accent/30 blur-3xl animate-blob" />
				<div className="absolute top-1/4 -right-48 w-[520px] h-[520px] rounded-full bg-accent-2/30 blur-3xl animate-blob [animation-delay:-7s]" />
				<div className="absolute -bottom-48 left-1/3 w-[500px] h-[500px] rounded-full bg-[#ff8fd8]/25 blur-3xl animate-blob [animation-delay:-14s]" />
				<div
					className="absolute inset-0 opacity-[0.35]"
					style={{
						backgroundImage: "radial-gradient(rgba(31,27,58,0.12) 1px, transparent 1px)",
						backgroundSize: "28px 28px",
						maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
						WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
					}}
				/>
			</div>

			{/* Floating question marks */}
			<span className="pointer-events-none absolute left-[8%] top-[22%] hidden sm:flex w-12 h-12 rounded-2xl bg-white border border-secondary/10 text-accent text-2xl font-bold items-center justify-center shadow-xl shadow-accent/15 animate-float">?</span>
			<span className="pointer-events-none absolute right-[10%] top-[30%] hidden sm:flex w-10 h-10 rounded-xl bg-white border border-secondary/10 text-[#b06cff] text-xl font-bold items-center justify-center shadow-xl shadow-accent/15 animate-float-slow" style={{ animationDelay: "1s" }}>?</span>
			<span className="pointer-events-none absolute left-[14%] bottom-[18%] hidden sm:flex w-9 h-9 rounded-xl bg-accent text-white text-lg font-bold items-center justify-center shadow-xl shadow-accent/30 animate-float-slow" style={{ animationDelay: "2s" }}>?</span>
			<span className="pointer-events-none absolute right-[14%] bottom-[22%] hidden sm:flex w-11 h-11 rounded-2xl bg-white border border-secondary/10 text-accent-2 text-2xl font-bold items-center justify-center shadow-xl shadow-accent/15 animate-float" style={{ animationDelay: "1.5s" }}>?</span>

			<div className="relative z-10 w-full max-w-3xl text-center">

				{/* 4 0 4 */}
				<div className="flex items-center justify-center gap-1 sm:gap-3 animate-rise">
					<span className={digit}>4</span>

					{/* The zero: a searching magnifier inside a spinning ring */}
					<div className="relative w-[7rem] h-[7rem] sm:w-[10.5rem] sm:h-[10.5rem] lg:w-[12.5rem] lg:h-[12.5rem] shrink-0 animate-float-slow">
						<div
							className="absolute inset-0 rounded-full"
							style={{
								background: "conic-gradient(from 0deg, transparent 0deg, var(--color-accent) 130deg, var(--color-accent-2) 250deg, transparent 330deg)",
								WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px))",
								mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px))",
								animation: "nf-ring 5s linear infinite",
							}}
						/>
						<div className="absolute inset-[14px] rounded-full bg-white shadow-2xl shadow-accent/25 flex items-center justify-center">
							<svg
								viewBox="0 0 64 64"
								className="w-[58%] h-[58%] text-accent"
								fill="none"
								stroke="currentColor"
								strokeWidth="5"
								strokeLinecap="round"
								style={{ animation: "nf-search 4.5s ease-in-out infinite" }}
							>
								<circle cx="27" cy="27" r="16" />
								<path d="M39 39l16 16" />
								<path d="M20 24a9 9 0 0 1 8-6" stroke="#2ee6a6" strokeWidth="4" />
							</svg>
						</div>
					</div>

					<span className={digit} style={{ animationDelay: "-2s" }}>4</span>
				</div>

				{/* Message */}
				<h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.15s" }}>
					Oops! Page not found
				</h1>
				<p className="mt-4 text-lg text-secondary/60 max-w-xl mx-auto leading-8 animate-rise" style={{ animationDelay: "0.25s" }}>
					The page you are looking for does not exist, was moved, or the link may be wrong. Let's get you back on track.
				</p>

				{/* Buttons */}
				<div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-rise" style={{ animationDelay: "0.35s" }}>
					<Link
						to="/"
						className="group relative h-14 px-8 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden flex items-center gap-2 shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
					>
						<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
						<BiHomeAlt size={22} className="relative" />
						<span className="relative">Back to home</span>
					</Link>
					<Link
						to="/products"
						className="h-14 px-8 rounded-full bg-white border border-secondary/10 text-secondary font-semibold flex items-center gap-2 shadow-md shadow-accent/5 transition hover:border-accent hover:text-accent hover:-translate-y-0.5 active:scale-95"
					>
						<BiShoppingBag size={22} />
						Browse products
					</Link>
				</div>

				{/* Quick links */}
				<div className="mt-10 animate-rise" style={{ animationDelay: "0.45s" }}>
					<p className="text-sm font-semibold text-secondary/50">Or try one of these pages</p>
					<div className="mt-3 flex flex-wrap items-center justify-center gap-2">
						{quickLinks.map((l) => (
							<Link
								key={l.to}
								to={l.to}
								className="group inline-flex items-center gap-1 h-10 pl-4 pr-3 rounded-full bg-white/80 border border-secondary/10 text-sm font-semibold text-secondary/70 transition hover:border-accent hover:text-accent hover:bg-white"
							>
								{l.label}
								<BiChevronRight size={18} className="transition group-hover:translate-x-0.5" />
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}