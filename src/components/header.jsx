import { BiShoppingBag } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import UserData from "./userData";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuPanelLeftClose } from "react-icons/lu";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/products", label: "Products" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
];

export default function Header() {

	const [isOpen , setIsOpen] = useState(false)
	const [scrolled , setScrolled] = useState(false) // UI only

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20)
		onScroll()
		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const brand = (
		<Link to="/" className="flex items-center gap-2 group">
			<img src="/logo.png" alt="Logo" className="h-[30px] lg:h-[40px] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
			<h1 className="text-secondary text-lg lg:text-xl font-bold tracking-tight">I Computers</h1>
		</Link>
	)

	return (
		<header className="w-full sticky top-0 z-100 px-3 sm:px-6 pt-3">

			{/* Floating glass bar (blur lives here so the mobile drawer can stay fixed to the screen) */}
			<div
				className={`mx-auto max-w-7xl rounded-full bg-white/70 backdrop-blur-xl border border-white flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ${scrolled ? "h-16 shadow-xl shadow-accent/15" : "h-[72px] shadow-lg shadow-accent/10"}`}
			>
				{/* Left: hamburger (mobile) + brand */}
				<div className="flex items-center gap-3 lg:flex-1">
					<button
						onClick={()=>{setIsOpen(true)}}
						aria-label="Open menu"
						className="lg:hidden w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"
					>
						<GiHamburgerMenu size={22} />
					</button>
					{brand}
				</div>

				{/* Center: nav links (desktop) */}
				<nav className="hidden lg:flex items-center gap-1 rounded-full bg-secondary/5 p-1">
					{links.map((l) => (
						<NavLink
							key={l.to}
							to={l.to}
							end={l.to === "/"}
							className={({ isActive }) =>
								`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? "bg-accent text-white shadow-lg shadow-accent/30" : "text-secondary/70 hover:text-accent hover:bg-white"}`
							}
						>
							{l.label}
						</NavLink>
					))}
				</nav>

				{/* Right: cart + user */}
				<div className="flex items-center justify-end gap-3 lg:flex-1">
					<Link
						to="/cart"
						aria-label="Cart"
						className="w-11 h-11 rounded-full bg-white border border-secondary/10 text-secondary flex items-center justify-center shadow-sm transition hover:-translate-y-0.5 hover:text-accent hover:border-accent hover:shadow-lg hover:shadow-accent/15 active:scale-90"
					>
						<BiShoppingBag size={24} />
					</Link>
					<div className="hidden lg:flex items-center rounded-full bg-accent px-3 py-1 shadow-lg shadow-accent/25">
						<UserData/>
					</div>
				</div>
			</div>

			{/* Mobile drawer (always mounted so it can slide) */}
			<div
				className={`lg:hidden fixed inset-0 z-100 transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0 delay-300"}`}
			>
				{/* Backdrop */}
				<div
					onClick={()=>{setIsOpen(false)}}
					className={`absolute inset-0 bg-secondary/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
				/>

				{/* Panel */}
				<div
					className={`absolute left-0 top-0 h-full w-[300px] max-w-[85%] bg-primary shadow-2xl shadow-accent/30 flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
				>
					<div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-accent/25 blur-3xl animate-blob" />

					<div className="relative h-[88px] px-5 flex items-center">
						<div onClick={()=>{setIsOpen(false)}}>{brand}</div>
						<button
							onClick={()=>{setIsOpen(false)}}
							aria-label="Close menu"
							className="ml-auto w-10 h-10 rounded-full bg-white text-accent flex items-center justify-center shadow transition hover:bg-accent hover:text-white active:scale-90"
						>
							<LuPanelLeftClose size={22} />
						</button>
					</div>

					<div className="relative flex flex-col gap-1 px-3 mt-2">
						{[...links, { to: "/cart", label: "Cart" }].map((l, i) => (
							<NavLink
								key={l.to}
								to={l.to}
								end={l.to === "/"}
								onClick={()=>{setIsOpen(false)}}
								style={{ transitionDelay: isOpen ? `${120 + i * 60}ms` : "0ms" }}
								className={({ isActive }) =>
									`rounded-2xl px-5 py-3.5 text-lg font-semibold transition-all duration-500 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"} ${isActive ? "bg-accent text-white shadow-lg shadow-accent/30" : "text-secondary hover:bg-white hover:text-accent"}`
								}
							>
								{l.label}
							</NavLink>
						))}
					</div>

					<div className="relative mt-auto p-3">
						<div className="rounded-2xl bg-accent p-3 shadow-lg shadow-accent/30">
							<UserData/>
						</div>
					</div>
				</div>
			</div>

		</header>
	);
}