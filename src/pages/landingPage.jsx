import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	BiShieldQuarter, BiSupport, BiPackage, BiCreditCard, BiSearch, BiHeart,
	BiSolidHeart, BiChevronLeft, BiChevronRight, BiChevronDown, BiUpArrowAlt,
} from "react-icons/bi";

/* ---------- helpers ---------- */
const money = (n) => "Rs. " + Number(n || 0).toLocaleString();
const getDiscount = (p) => {
	const l = Number(p?.labelledPrice), pr = Number(p?.price);
	return l > pr && pr > 0 ? Math.round(((l - pr) / l) * 100) : 0;
};
const getSaving = (p) => Math.max(0, Number(p?.labelledPrice || 0) - Number(p?.price || 0));
const imgOf = (p) => p?.images?.[0] || "/images/default-product-01.png";
const wrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

function useCountUp(target) {
	const [v, setV] = useState(0);
	useEffect(() => {
		let raf, start;
		const step = (t) => {
			if (!start) start = t;
			const p = Math.min((t - start) / 1200, 1);
			setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [target]);
	return v;
}

function useCountdown() {
	const get = () => {
		const n = new Date(), end = new Date(n);
		end.setHours(23, 59, 59, 999);
		const s = Math.max(0, Math.floor((end - n) / 1000));
		return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
	};
	const [t, setT] = useState(get);
	useEffect(() => {
		const id = setInterval(() => setT(get()), 1000);
		return () => clearInterval(id);
	}, []);
	return t.map((x) => String(x).padStart(2, "0"));
}

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

/* ---------- small components ---------- */
function DiscountBadge({ value, big }) {
	if (!value) return null;
	return (
		<span className={`inline-flex items-center rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white font-extrabold shadow-lg shadow-[#ff4d6d]/30 ${big ? "text-xl px-5 py-2" : "text-xs px-3 py-1"}`}>
			-{value}%
		</span>
	);
}

function Countdown({ light }) {
	const [h, m, s] = useCountdown();
	const box = `min-w-[44px] text-center rounded-xl px-2 py-1.5 font-extrabold tabular-nums ${light ? "bg-white/70 text-secondary" : "bg-secondary/5 text-secondary"}`;
	return (
		<div className="flex items-center gap-1.5 text-sm">
			<span className={box}>{h}</span><span className="text-secondary/40">:</span>
			<span className={box}>{m}</span><span className="text-secondary/40">:</span>
			<span className={box}>{s}</span>
		</div>
	);
}

function ProductSkeleton() {
	return (
		<div className="min-w-[270px] max-w-[270px] rounded-3xl bg-white border border-secondary/10 overflow-hidden animate-pulse">
			<div className="h-[210px] bg-primary" />
			<div className="p-4 space-y-3">
				<div className="h-3 w-20 bg-primary rounded" />
				<div className="h-5 w-full bg-primary rounded" />
				<div className="h-6 w-28 bg-primary rounded" />
				<div className="h-11 w-full bg-primary rounded-full" />
			</div>
		</div>
	);
}

function ProductCard({ product, className = "" }) {
	const [liked, setLiked] = useState(false); // UI only
	const discount = getDiscount(product);
	const saving = getSaving(product);
	return (
		<div className={`group rounded-3xl bg-white border border-secondary/10 overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/15 ${className}`}>
			<div className="relative h-[210px] bg-linear-to-br from-primary to-white flex items-center justify-center overflow-hidden">
				<div className="absolute left-3 top-3 z-10"><DiscountBadge value={discount} /></div>
				<button
					onClick={() => setLiked(!liked)}
					aria-label="Save to wishlist"
					className={`absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center transition active:scale-90 ${liked ? "text-[#ff4d6d]" : "text-secondary/50 hover:text-[#ff4d6d]"}`}
				>
					{liked ? <BiSolidHeart size={20} /> : <BiHeart size={20} />}
				</button>
				<img src={imgOf(product)} alt={product?.name} className="relative h-[170px] w-[170px] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" />
			</div>
			<div className="p-4">
				<p className="text-xs font-semibold text-accent">{product?.category || product?.brand || "Computer product"}</p>
				<h3 className="mt-1 text-secondary font-bold leading-6 line-clamp-2 min-h-[48px]">{product?.name || "Product name"}</h3>
				<div className="mt-3 flex items-end gap-2 flex-wrap">
					<span className="text-xl font-extrabold text-secondary">{money(product?.price)}</span>
					{discount > 0 && <span className="text-sm text-secondary/40 line-through">{money(product?.labelledPrice)}</span>}
				</div>
				{saving > 0 && (
					<p className="mt-2 inline-block rounded-full bg-accent-2/20 text-[#0b8f66] text-xs font-semibold px-3 py-1">You save {money(saving)}</p>
				)}
				<div className="mt-4 flex gap-2">
					<Link to="/products" className="flex-1 h-11 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center justify-center shadow-md shadow-accent/25 transition hover:shadow-lg active:scale-95">Buy now</Link>
					<Link to="/products" className="h-11 px-5 rounded-full border border-secondary/15 text-secondary font-semibold flex items-center justify-center transition hover:border-accent hover:text-accent">View</Link>
				</div>
			</div>
		</div>
	);
}

/* ---------- page ---------- */
export default function LandingPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState("All");
	const [openFaq, setOpenFaq] = useState(0);
	const [showTop, setShowTop] = useState(false);
	const railRef = useRef(null);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_API_URL + "/products/")
			.then((response) => {
				setProducts(Array.isArray(response.data) ? response.data : []);
				setLoading(false);
			})
			.catch(() => {
				setProducts([]);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		const onScroll = () => setShowTop(window.scrollY > 600);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const featuredProducts = useMemo(
		() => [...products].filter((item) => Number(item?.price) > 0),
		[products],
	);

	const dealProducts = useMemo(
		() => featuredProducts.filter((p) => getDiscount(p) > 0).sort((a, b) => getDiscount(b) - getDiscount(a)).slice(0, 12),
		[featuredProducts],
	);

	const tabs = useMemo(
		() => ["All", ...new Set(featuredProducts.map((p) => p?.category).filter(Boolean))].slice(0, 7),
		[featuredProducts],
	);

	const gridProducts = useMemo(
		() => (tab === "All" ? featuredProducts : featuredProducts.filter((p) => p?.category === tab)).slice(0, 8),
		[featuredProducts, tab],
	);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];
		return featuredProducts
			.filter((p) => [p?.name, p?.category, p?.brand].some((v) => String(v || "").toLowerCase().includes(q)))
			.slice(0, 5);
	}, [query, featuredProducts]);

	const heroDeal = dealProducts[0] || featuredProducts[0];
	const maxDiscount = dealProducts[0] ? getDiscount(dealProducts[0]) : 0;
	const totalProducts = useCountUp(products.length);
	const totalDeals = useCountUp(dealProducts.length);
	const topDiscount = useCountUp(maxDiscount);

	const scrollRail = (dir) =>
		railRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });

	const perks = [
		{ title: "Genuine products", desc: "Every item comes from trusted sources.", icon: <BiShieldQuarter size={26} />, span: "lg:col-span-2" },
		{ title: "Fast delivery", desc: "Quick processing and tracked shipping.", icon: <BiPackage size={26} />, span: "" },
		{ title: "Tech support", desc: "Real people to help you choose.", icon: <BiSupport size={26} />, span: "" },
		{ title: "Easy payments", desc: "Simple, secure checkout every time.", icon: <BiCreditCard size={26} />, span: "lg:col-span-2" },
	];

	const faqs = [
		{ q: "Are the products genuine?", a: "Yes. We source our laptops, components and accessories from trusted suppliers." },
		{ q: "How do the discounts work?", a: "Each deal shows the original price, the sale price and the percentage you save." },
		{ q: "Can I get help choosing a product?", a: "Yes. Our support team can help you compare options for your budget and needs." },
		{ q: "How long does delivery take?", a: "Orders are processed quickly and you can track them after they ship." },
	];

	const marquee = ["Genuine products", "Fast delivery", "Daily deals", "Friendly tech support", "Secure checkout"];

	return (
		<div className="w-full min-h-screen bg-primary overflow-x-hidden">
			{/* Announcement marquee */}
			<div className="bg-accent text-white text-sm overflow-hidden">
				<div className="flex w-max animate-marquee py-2">
					{[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => (
						<span key={i} className="mx-8 flex items-center gap-8 whitespace-nowrap">
							{m}<span className="w-1.5 h-1.5 rounded-full bg-accent-2" />
						</span>
					))}
				</div>
			</div>

			{/* Hero (z-20 so the search dropdown always sits above the sections below) */}
			<section className="relative z-20">
				{/* Decorations are clipped in their own layer so the dropdown is never cut off */}
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

				<div className={`relative ${wrap} pt-14 lg:pt-20 pb-20 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center`}>
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white px-4 py-1.5 text-sm font-medium text-secondary shadow-lg shadow-accent/10 animate-rise">
							<span className="relative flex w-2.5 h-2.5">
								<span className="absolute inline-flex w-full h-full rounded-full bg-accent-2 opacity-75 animate-ping" />
								<span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent-2" />
							</span>
							New deals added every day
						</span>

						<h1 className="mt-6 text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.1s" }}>
							Upgrade your
							<span className="block h-[1.2em] overflow-hidden">
								<span className="flex flex-col animate-words">
									{["laptop", "setup", "gaming rig", "workspace", "laptop"].map((w, i) => (
										<span key={i} className="h-[1.2em] bg-linear-to-r from-accent via-[#b06cff] to-accent-2 bg-clip-text text-transparent animate-gradient [background-size:200%_100%]">{w}</span>
									))}
								</span>
							</span>
							for less.
						</h1>

						<p className="mt-5 text-lg text-secondary/60 max-w-xl animate-rise" style={{ animationDelay: "0.2s" }}>
							Computers, components and accessories with the real discount shown on every product.
						</p>

						{/* Live search: z-40 puts the whole box (and its dropdown) above the counters */}
						<div className="relative z-40 mt-8 max-w-xl animate-rise" style={{ animationDelay: "0.3s" }}>
							<BiSearch size={22} className="absolute left-5 top-7 -translate-y-1/2 text-secondary/40" />
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search laptops, SSDs, keyboards..."
								className="w-full h-14 rounded-full bg-white border border-secondary/10 pl-14 pr-5 text-secondary outline-none shadow-lg shadow-accent/10 transition focus:border-accent focus:ring-4 focus:ring-accent/15"
							/>
							{query.trim() && (
								<div className="absolute left-0 top-full z-50 mt-3 w-full rounded-3xl bg-white border border-secondary/10 shadow-2xl shadow-accent/20 overflow-hidden">
									{results.length > 0 ? results.map((p) => (
										<Link key={p?.productId || p?._id} to="/products" className="flex items-center gap-4 p-3 hover:bg-primary transition">
											<img src={imgOf(p)} alt="" className="w-12 h-12 object-contain rounded-xl bg-primary" />
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-secondary truncate">{p?.name}</p>
												<p className="text-sm text-secondary/60">{money(p?.price)}</p>
											</div>
											<DiscountBadge value={getDiscount(p)} />
										</Link>
									)) : <p className="p-5 text-secondary/60">No products found for "{query}".</p>}
								</div>
							)}
						</div>

						{/* Counters */}
						<div className="relative z-0 mt-10 grid grid-cols-3 gap-4 max-w-xl animate-rise" style={{ animationDelay: "0.4s" }}>
							{[
								{ n: loading ? "..." : totalProducts, l: "Products" },
								{ n: loading ? "..." : totalDeals, l: "Active deals" },
								{ n: loading ? "..." : `${topDiscount}%`, l: "Biggest discount" },
							].map((s) => (
								<div key={s.l} className="rounded-2xl bg-white/70 backdrop-blur border border-white p-4 shadow-lg shadow-accent/10">
									<p className="text-2xl lg:text-3xl font-bold text-secondary tabular-nums">{s.n}</p>
									<p className="text-xs lg:text-sm text-secondary/60 mt-1">{s.l}</p>
								</div>
							))}
						</div>
					</div>

					{/* Deal of the day */}
					<div className="relative z-0 flex justify-center animate-rise" style={{ animationDelay: "0.25s" }}>
						<span className="hidden sm:block absolute -left-2 top-[38%] z-20 animate-float rounded-full bg-white border border-secondary/10 px-4 py-2 text-sm font-medium text-secondary shadow-lg shadow-accent/15">
							<span className="inline-block w-2 h-2 rounded-full bg-accent-2 mr-2 animate-pulse-soft" />In stock
						</span>
						<span className="hidden sm:block absolute -right-2 top-[22%] z-20 animate-float-slow rounded-full bg-accent text-white px-4 py-2 text-sm font-medium shadow-lg shadow-accent/30">
							Genuine warranty
						</span>

						{/* float is on the outer wrapper; the clipped border layer stays still */}
						<div className="relative w-full max-w-[440px] animate-float-slow">
							<div className="relative rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20">
								<div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />
								<div className="relative z-10 rounded-[calc(2rem-2px)] bg-white p-6 text-secondary">
									<div className="flex items-center justify-between gap-3">
										<p className="font-bold text-secondary">Deal of the day</p>
										<Countdown />
									</div>
									<div className="relative mt-5 h-[230px] rounded-3xl bg-linear-to-br from-primary to-white flex items-center justify-center">
										<div className="absolute left-4 top-4"><DiscountBadge value={getDiscount(heroDeal)} big /></div>
										<img src={imgOf(heroDeal)} alt={heroDeal?.name || "Featured"} className="h-[190px] w-[190px] object-contain drop-shadow-xl" />
									</div>
									<h3 className="mt-5 text-xl font-bold text-secondary line-clamp-2">{heroDeal?.name || "Top quality computer products"}</h3>
									<div className="mt-2 flex items-end gap-3 flex-wrap">
										<span className="text-2xl font-extrabold text-secondary">{money(heroDeal?.price)}</span>
										{getDiscount(heroDeal) > 0 && <span className="text-secondary/40 line-through">{money(heroDeal?.labelledPrice)}</span>}
									</div>
									{getSaving(heroDeal) > 0 && <p className="mt-2 text-sm font-semibold text-[#0b8f66]">You save {money(getSaving(heroDeal))} today</p>}
									<Link to="/products" className="mt-5 h-12 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center justify-center shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95">Grab this deal</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Flash deals */}
			<section className={`${wrap} py-10`}>
				<Reveal>
					<div className="rounded-[2rem] bg-white/60 backdrop-blur border border-white p-6 lg:p-8 shadow-xl shadow-accent/10">
						<div className="flex flex-wrap items-end justify-between gap-4 mb-6">
							<div>
								<h2 className="text-2xl lg:text-3xl font-bold text-secondary tracking-tight">Flash deals</h2>
								<p className="mt-1 text-secondary/60">Sorted by the biggest discount first.</p>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<span className="text-sm text-secondary/60">Ends in</span>
									<Countdown light />
								</div>
								<div className="hidden md:flex gap-2">
									<button onClick={() => scrollRail("left")} aria-label="Scroll left" className="w-11 h-11 rounded-full bg-white border border-secondary/10 text-secondary flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"><BiChevronLeft size={24} /></button>
									<button onClick={() => scrollRail("right")} aria-label="Scroll right" className="w-11 h-11 rounded-full bg-white border border-secondary/10 text-secondary flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"><BiChevronRight size={24} /></button>
								</div>
							</div>
						</div>
						<div ref={railRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 hide-scroll-track scroll-smooth">
							{dealProducts.length > 0
								? dealProducts.map((p) => <ProductCard key={p?.productId || p?._id} product={p} className="min-w-[270px] max-w-[270px] snap-start" />)
								: loading
									? [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)
									: <p className="py-10 text-secondary/60">No deals right now. Check back soon.</p>}
						</div>
					</div>
				</Reveal>
			</section>

			{/* Browse with tabs */}
			<section className={`${wrap} py-16`}>
				<Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8">
					<div>
						<h2 className="text-2xl lg:text-3xl font-bold text-secondary tracking-tight">Popular right now</h2>
						<p className="mt-1 text-secondary/60">Pick a category to filter the list.</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{tabs.map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={`h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 ${tab === t ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"}`}
							>
								{t}
							</button>
						))}
					</div>
				</Reveal>
				<div key={tab} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{gridProducts.length > 0
						? gridProducts.map((p, i) => (
							<div key={p?.productId || p?._id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
								<ProductCard product={p} />
							</div>
						))
						: <p className="col-span-full py-10 text-center text-secondary/60">{loading ? "Loading products..." : "No products in this category yet."}</p>}
				</div>
				<div className="mt-10 text-center">
					<Link to="/products" className="inline-flex h-12 px-8 rounded-full bg-white border border-secondary/10 text-secondary font-semibold items-center transition hover:border-accent hover:text-accent hover:-translate-y-0.5">See all products</Link>
				</div>
			</section>

			{/* Why us bento */}
			<section className={`${wrap} py-10`}>
				<Reveal className="text-center max-w-2xl mx-auto mb-10">
					<h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">Why shop with us</h2>
				</Reveal>
				<div className="grid lg:grid-cols-4 gap-5">
					{perks.map((p, i) => (
						<Reveal key={p.title} delay={i * 80} className={p.span}>
							<div className="h-full rounded-3xl bg-white/80 backdrop-blur border border-white p-7 shadow-lg shadow-accent/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/15">
								<div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{p.icon}</div>
								<h3 className="mt-5 text-lg font-bold text-secondary">{p.title}</h3>
								<p className="mt-1 text-secondary/60 leading-6">{p.desc}</p>
							</div>
						</Reveal>
					))}
				</div>
			</section>

			{/* FAQ */}
			<section className={`${wrap} py-16`}>
				<div className="max-w-3xl mx-auto">
					<Reveal className="text-center mb-8">
						<h2 className="text-3xl lg:text-4xl font-bold text-secondary tracking-tight">Questions, answered</h2>
					</Reveal>
					<div className="space-y-3">
						{faqs.map((f, i) => (
							<Reveal key={f.q} delay={i * 60}>
								<div className="rounded-2xl bg-white/80 backdrop-blur border border-white shadow-md shadow-accent/5 overflow-hidden">
									<button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 text-left p-5 font-semibold text-secondary">
										{f.q}
										<BiChevronDown size={24} className={`shrink-0 text-accent transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
									</button>
									<div className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
										<p className="overflow-hidden px-5 text-secondary/60 leading-7"><span className="block pb-5">{f.a}</span></p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className={`${wrap} pb-20`}>
				<Reveal>
					<div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-accent via-[#8b7cf6] to-[#b06cff] [background-size:200%_100%] animate-gradient p-8 lg:p-14 shadow-2xl shadow-accent/30">
						<div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl animate-blob" />
						<div className="relative grid lg:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Ready to upgrade your setup?</h2>
								<p className="mt-4 text-white/85 leading-7 max-w-xl">Browse the latest products, compare prices and see exactly how much you save.</p>
							</div>
							<div className="flex lg:justify-end">
								<Link to="/products" className="h-14 px-10 rounded-full bg-white text-accent font-bold flex items-center justify-center shadow-xl transition hover:-translate-y-0.5 active:scale-95">Browse all products</Link>
							</div>
						</div>
					</div>
				</Reveal>
			</section>

			{/* Back to top */}
			<button
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="Back to top"
				className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/30 transition-all duration-300 hover:-translate-y-1 active:scale-90 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
			>
				<BiUpArrowAlt size={28} />
			</button>
		</div>
	);
}