import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	BiShieldQuarter, BiSupport, BiPackage, BiBadgeCheck,
	BiLaptop, BiChip, BiDesktop, BiChevronRight,
} from "react-icons/bi";

const wrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

/* Fades a section in when it scrolls into view */
function Reveal({ children, delay = 0, className = "" }) {
	const ref = useRef(null);
	const [show, setShow] = useState(false);
	useEffect(() => {
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) { setShow(true); io.disconnect(); }
		}, { threshold: 0.12 });
		if (ref.current) io.observe(ref.current);
		return () => io.disconnect();
	}, []);
	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
		>
			{children}
		</div>
	);
}

/* Counts up once it is visible */
function Counter({ to, suffix = "" }) {
	const ref = useRef(null);
	const [value, setValue] = useState(0);
	useEffect(() => {
		let raf;
		const io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			let start;
			const step = (t) => {
				if (!start) start = t;
				const p = Math.min((t - start) / 1400, 1);
				setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
				if (p < 1) raf = requestAnimationFrame(step);
			};
			raf = requestAnimationFrame(step);
		}, { threshold: 0.4 });
		if (ref.current) io.observe(ref.current);
		return () => { io.disconnect(); cancelAnimationFrame(raf); };
	}, [to]);
	return <span ref={ref} className="tabular-nums">{value.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
	// NOTE: replace these placeholder numbers and texts with your real shop details
	const stats = [
		{ to: 5, suffix: "+", label: "Years in business" },
		{ to: 1000, suffix: "+", label: "Happy customers" },
		{ to: 500, suffix: "+", label: "Products available" },
		{ to: 24, suffix: "/7", label: "Online ordering" },
	];

	const values = [
		{ title: "Genuine products", desc: "We only sell items from trusted suppliers, so what you order is exactly what you get.", icon: <BiShieldQuarter size={26} />, span: "lg:col-span-2" },
		{ title: "Honest pricing", desc: "Clear prices and real discounts, shown on every product.", icon: <BiBadgeCheck size={26} />, span: "" },
		{ title: "Friendly support", desc: "Real people who help you pick the right device.", icon: <BiSupport size={26} />, span: "" },
		{ title: "Reliable delivery", desc: "Careful packing and tracked shipping from our shop to your door.", icon: <BiPackage size={26} />, span: "lg:col-span-2" },
	];

	const steps = [
		{ n: "01", title: "Browse", desc: "Search or filter our catalogue to find what you need." },
		{ n: "02", title: "Compare", desc: "See prices, discounts and details side by side." },
		{ n: "03", title: "Order", desc: "Check out quickly and securely from any device." },
		{ n: "04", title: "Enjoy", desc: "Get it delivered, with support whenever you need it." },
	];

	const offers = [
		{ title: "Laptops", icon: <BiLaptop size={24} />, pos: "top-0 left-0", anim: "animate-float" },
		{ title: "Components", icon: <BiChip size={24} />, pos: "top-[110px] left-[70px] sm:left-[110px]", anim: "animate-float-slow" },
		{ title: "Desktop PCs", icon: <BiDesktop size={24} />, pos: "top-[220px] left-[10px] sm:left-[30px]", anim: "animate-float" },
	];

	return (
		<div className="relative w-full min-h-screen bg-primary overflow-x-hidden">
			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-accent/30 blur-3xl animate-blob" />
				<div className="absolute top-1/4 -right-48 w-[520px] h-[520px] rounded-full bg-accent-2/25 blur-3xl animate-blob [animation-delay:-7s]" />
				<div className="absolute top-2/3 -left-40 w-[480px] h-[480px] rounded-full bg-[#ff8fd8]/20 blur-3xl animate-blob [animation-delay:-14s]" />
			</div>

			<div className="relative z-10">
				{/* Hero */}
				<section className={`${wrap} pt-14 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center`}>
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-white border border-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary shadow-lg shadow-accent/10 animate-rise">
							<span className="relative flex w-2.5 h-2.5">
								<span className="absolute inline-flex w-full h-full rounded-full bg-accent-2 opacity-75 animate-ping" />
								<span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent-2" />
							</span>
							About I Computers
						</span>

						<h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.1s" }}>
							Technology made{" "}
							<span className="bg-linear-to-r from-accent via-[#b06cff] to-accent-2 bg-clip-text text-transparent animate-gradient [background-size:200%_100%]">
								simple and honest.
							</span>
						</h1>

						<p className="mt-6 text-lg text-secondary/60 max-w-xl leading-8 animate-rise" style={{ animationDelay: "0.2s" }}>
							We are a computer shop that helps students, professionals and gamers find the right laptop, parts and accessories at a fair price.
						</p>

						<div className="mt-8 flex flex-wrap gap-4 animate-rise" style={{ animationDelay: "0.3s" }}>
							<Link to="/products" className="h-12 px-8 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center justify-center shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95">Shop products</Link>
							<Link to="/contact" className="h-12 px-8 rounded-full bg-white border border-secondary/10 text-secondary font-semibold flex items-center justify-center transition hover:border-accent hover:text-accent hover:-translate-y-0.5 active:scale-95">Contact us</Link>
						</div>
					</div>

					{/* Floating cards */}
					<div className="relative h-[320px] sm:h-[340px] animate-rise" style={{ animationDelay: "0.25s" }}>
						{offers.map((o, i) => (
							<div key={o.title} className={`absolute ${o.pos} ${o.anim}`} style={{ animationDelay: `${i * 0.7}s` }}>
								<div className="flex items-center gap-4 rounded-3xl bg-white border border-secondary/10 pl-4 pr-8 py-4 shadow-xl shadow-accent/15">
									<span className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30">{o.icon}</span>
									<span>
										<span className="block text-xs text-secondary/50">We sell</span>
										<span className="block font-bold text-secondary">{o.title}</span>
									</span>
								</div>
							</div>
						))}
						<div className="absolute bottom-0 right-0 animate-float-slow" style={{ animationDelay: "1.2s" }}>
							<div className="rounded-full bg-accent text-white px-5 py-3 font-medium shadow-xl shadow-accent/30">Genuine warranty</div>
						</div>
					</div>
				</section>

				{/* Stats */}
				<section className={`${wrap} pb-16`}>
					<Reveal>
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-[2rem] bg-white border border-secondary/10 p-6 lg:p-8 shadow-xl shadow-accent/10">
							{stats.map((s) => (
								<div key={s.label} className="text-center p-4">
									<p className="text-4xl lg:text-5xl font-bold text-accent"><Counter to={s.to} suffix={s.suffix} /></p>
									<p className="mt-2 text-sm lg:text-base text-secondary/60">{s.label}</p>
								</div>
							))}
						</div>
					</Reveal>
				</section>

				{/* Story */}
				<section className={`${wrap} py-12 grid lg:grid-cols-2 gap-10 items-center`}>
					<Reveal>
						<h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-secondary">Our story</h2>
						<p className="mt-5 text-secondary/70 leading-8">
							I Computers started with a simple idea: buying a computer should not be confusing or stressful. Too many people overpay, or end up with a device that does not fit what they need.
						</p>
						<p className="mt-4 text-secondary/70 leading-8">
							So we built a shop where the prices are clear, the products are genuine and the advice is honest. Today we serve customers who need a laptop for school, a workstation for work or parts for their dream build.
						</p>
					</Reveal>
					<Reveal delay={150}>
						<div className="relative rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20">
							<div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />
							<div className="relative z-10 rounded-[calc(2rem-2px)] bg-white p-8 lg:p-10">
								<p className="text-sm font-semibold text-accent">Our mission</p>
								<p className="mt-3 text-2xl lg:text-3xl font-bold leading-snug text-secondary">
									To make great technology easy to find, fair to buy and simple to trust.
								</p>
							</div>
						</div>
					</Reveal>
				</section>

				{/* Values */}
				<section className={`${wrap} py-16`}>
					<Reveal className="text-center max-w-2xl mx-auto mb-10">
						<h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-secondary">What we stand for</h2>
						<p className="mt-3 text-secondary/60">The promises behind every order.</p>
					</Reveal>
					<div className="grid lg:grid-cols-4 gap-5">
						{values.map((v, i) => (
							<Reveal key={v.title} delay={i * 80} className={v.span}>
								<div className="h-full rounded-3xl bg-white border border-secondary/10 p-7 shadow-lg shadow-accent/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/15">
									<div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{v.icon}</div>
									<h3 className="mt-5 text-lg font-bold text-secondary">{v.title}</h3>
									<p className="mt-2 text-secondary/60 leading-7">{v.desc}</p>
								</div>
							</Reveal>
						))}
					</div>
				</section>

				{/* How it works */}
				<section className={`${wrap} py-12`}>
					<Reveal className="text-center max-w-2xl mx-auto mb-10">
						<h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-secondary">How shopping works</h2>
					</Reveal>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{steps.map((s, i) => (
							<Reveal key={s.n} delay={i * 100}>
								<div className="h-full rounded-3xl bg-white border border-secondary/10 p-7 shadow-lg shadow-accent/5">
									<span className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white font-bold items-center justify-center shadow-lg shadow-accent/30">{s.n}</span>
									<h3 className="mt-5 text-lg font-bold text-secondary">{s.title}</h3>
									<p className="mt-2 text-secondary/60 leading-7">{s.desc}</p>
								</div>
							</Reveal>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className={`${wrap} pt-12 pb-20`}>
					<Reveal>
						<div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-accent via-[#8b7cf6] to-[#b06cff] [background-size:200%_100%] animate-gradient p-8 lg:p-14 shadow-2xl shadow-accent/30">
							<div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl animate-blob" />
							<div className="relative grid lg:grid-cols-2 gap-8 items-center">
								<div>
									<h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Have a question? Talk to us.</h2>
									<p className="mt-4 text-white/85 leading-7 max-w-xl">Tell us what you need and we will help you find the right fit for your budget.</p>
								</div>
								<div className="flex flex-wrap gap-4 lg:justify-end">
									<Link to="/contact" className="h-14 px-8 rounded-full bg-white text-accent font-bold flex items-center justify-center shadow-xl transition hover:-translate-y-0.5 active:scale-95">Contact us</Link>
									<Link to="/products" className="group h-14 px-8 rounded-full border border-white/50 text-white font-bold flex items-center justify-center gap-1 transition hover:bg-white/15 active:scale-95">
										Browse products
										<BiChevronRight size={22} className="transition group-hover:translate-x-1" />
									</Link>
								</div>
							</div>
						</div>
					</Reveal>
				</section>
			</div>
		</div>
	);
}