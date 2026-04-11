import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	BiSolidStar,
	BiChevronLeft,
	BiChevronRight,
	BiLaptop,
	BiDesktop,
	BiHeadphone,
	BiChip,
	BiShieldQuarter,
	BiSupport,
	BiPackage,
} from "react-icons/bi";

function ProductSkeleton() {
	return (
		<div className="min-w-[260px] max-w-[260px] rounded-3xl bg-white border border-secondary/10 shadow-sm overflow-hidden animate-pulse">
			<div className="h-[220px] bg-primary/70" />
			<div className="p-4">
				<div className="h-4 w-20 bg-primary rounded mb-3" />
				<div className="h-5 w-full bg-primary rounded mb-2" />
				<div className="h-5 w-3/4 bg-primary rounded mb-4" />
				<div className="h-6 w-24 bg-primary rounded mb-4" />
				<div className="h-10 w-full bg-primary rounded-xl" />
			</div>
		</div>
	);
}

function PriceBlock({ price, labelledPrice }) {
	const hasDiscount =
		Number(labelledPrice) > 0 &&
		Number(price) > 0 &&
		Number(labelledPrice) > Number(price);

	return (
		<div className="flex items-end gap-2 flex-wrap">
			<span className="text-2xl font-extrabold text-secondary">
				Rs. {Number(price || 0).toLocaleString()}
			</span>
			{hasDiscount && (
				<span className="text-sm text-secondary/50 line-through">
					Rs. {Number(labelledPrice).toLocaleString()}
				</span>
			)}
		</div>
	);
}

function ProductSlideCard({ product }) {
	const image = product?.images?.[0] || "/images/default-product-01.png";

	const discount =
		Number(product?.labelledPrice) > Number(product?.price)
			? Math.round(
					((Number(product.labelledPrice) - Number(product.price)) /
						Number(product.labelledPrice)) *
						100,
				)
			: 0;

	return (
		<div className="min-w-[260px] max-w-[260px] snap-start rounded-3xl bg-white border border-secondary/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
			<div className="relative h-[220px] bg-gradient-to-br from-primary to-white flex items-center justify-center overflow-hidden">
				{discount > 0 && (
					<div className="absolute left-3 top-3 z-10 rounded-full bg-accent text-white text-xs font-bold px-3 py-1 shadow">
						Save {discount}%
					</div>
				)}

				<img
					src={image}
					alt={product?.name}
					className="h-[180px] w-[180px] object-contain group-hover:scale-105 transition-transform duration-300"
				/>
			</div>

			<div className="p-4">
				<p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
					{product?.category || product?.brand || "Computer Product"}
				</p>

				<h3 className="text-secondary font-bold text-base leading-6 line-clamp-2 min-h-[48px]">
					{product?.name || "Product Name"}
				</h3>

				<div className="mt-4">
					<PriceBlock
						price={product?.price}
						labelledPrice={product?.labelledPrice}
					/>
				</div>

				<div className="mt-4 flex gap-2">
					<Link
						to={`/products`}
						className="flex-1 h-[44px] rounded-xl bg-secondary text-white flex items-center justify-center font-semibold hover:bg-secondary/90 transition"
					>
						View
					</Link>
					<Link
						to={`/products`}
						className="flex-1 h-[44px] rounded-xl border border-accent text-accent flex items-center justify-center font-semibold hover:bg-accent hover:text-white transition"
					>
						Buy Now
					</Link>
				</div>
			</div>
		</div>
	);
}

function ProductRail({ title, subtitle, products }) {
	const railRef = useRef(null);

	const scrollRail = (direction) => {
		if (!railRef.current) return;
		const amount = 320;
		railRef.current.scrollBy({
			left: direction === "left" ? -amount : amount,
			behavior: "smooth",
		});
	};

	return (
		<section className="w-full">
			<div className="flex items-end justify-between gap-4 mb-6">
				<div>
					<h2 className="text-2xl lg:text-3xl font-extrabold text-secondary">
						{title}
					</h2>
					<p className="text-secondary/70 mt-2">{subtitle}</p>
				</div>

				<div className="hidden md:flex items-center gap-3">
					<button
						onClick={() => scrollRail("left")}
						className="w-11 h-11 rounded-full border border-secondary/15 bg-white text-secondary flex items-center justify-center hover:bg-secondary hover:text-white transition"
					>
						<BiChevronLeft size={24} />
					</button>
					<button
						onClick={() => scrollRail("right")}
						className="w-11 h-11 rounded-full border border-secondary/15 bg-white text-secondary flex items-center justify-center hover:bg-secondary hover:text-white transition"
					>
						<BiChevronRight size={24} />
					</button>
				</div>
			</div>

			<div
				ref={railRef}
				className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 hide-scroll-track scroll-smooth"
			>
				{products?.length > 0
					? products.map((product) => (
							<ProductSlideCard
								key={product?.productId || product?._id}
								product={product}
							/>
						))
					: [1, 2, 3, 4].map((item) => <ProductSkeleton key={item} />)}
			</div>
		</section>
	);
}

function CategoryCard({ icon, title, desc }) {
	return (
		<div className="rounded-3xl bg-white border border-secondary/10 p-6 shadow-sm hover:shadow-lg transition">
			<div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-accent mb-4">
				{icon}
			</div>
			<h3 className="text-secondary text-lg font-bold">{title}</h3>
			<p className="text-secondary/70 mt-2 text-sm leading-6">{desc}</p>
		</div>
	);
}

function FeatureCard({ icon, title, desc }) {
	return (
		<div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg p-6 text-white">
			<div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="font-bold text-lg">{title}</h3>
			<p className="text-white/80 text-sm mt-2 leading-6">{desc}</p>
		</div>
	);
}

export default function LandingPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

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

	const featuredProducts = useMemo(() => {
		return [...products].filter((item) => Number(item?.price) > 0).slice(0, 10);
	}, [products]);

	const dealProducts = useMemo(() => {
		return [...products]
			.filter(
				(item) =>
					Number(item?.labelledPrice) > 0 &&
					Number(item?.labelledPrice) > Number(item?.price),
			)
			.sort(
				(a, b) =>
					Number(b?.labelledPrice || 0) -
					Number(b?.price || 0) -
					(Number(a?.labelledPrice || 0) - Number(a?.price || 0)),
			)
			.slice(0, 10);
	}, [products]);

	const categories = [
		{
			title: "Laptops",
			desc: "Premium laptops for work, study, gaming, and creative performance.",
			icon: <BiLaptop size={28} />,
		},
		{
			title: "Desktop PCs",
			desc: "Reliable desktop machines with strong performance and upgrade flexibility.",
			icon: <BiDesktop size={28} />,
		},
		{
			title: "Accessories",
			desc: "Headsets, keyboards, mice, storage devices, and essential add-ons.",
			icon: <BiHeadphone size={28} />,
		},
		{
			title: "Components",
			desc: "Processors, RAM, SSDs, graphic cards, and everything for custom builds.",
			icon: <BiChip size={28} />,
		},
	];

	return (
		<div className="w-full min-h-screen bg-primary">
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-accent" />
				<div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full bg-white/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[260px] h-[260px] rounded-full bg-accent/20 blur-3xl" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-16 lg:pb-24">
					<div className="grid lg:grid-cols-2 gap-10 items-center">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-white/90 text-sm mb-6">
								<BiSolidStar className="text-yellow-300" />
								Trusted technology store for laptops, PCs, and accessories
							</div>

							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
								Power Up Your
								<span className="block text-primary">Digital Lifestyle</span>
							</h1>

							<p className="mt-6 text-white/80 text-base lg:text-lg leading-8 max-w-2xl">
								Discover high-quality computers, components, and accessories
								with a clean shopping experience, competitive pricing, and
								reliable support.
							</p>

							<div className="mt-8 flex flex-wrap gap-4">
								<Link
									to="/products"
									className="h-[52px] px-7 rounded-2xl bg-accent text-white font-bold flex items-center justify-center hover:bg-white hover:text-secondary transition"
								>
									Shop Now
								</Link>
								<Link
									to="/about"
									className="h-[52px] px-7 rounded-2xl border border-white/25 text-white font-bold flex items-center justify-center hover:bg-white hover:text-secondary transition"
								>
									Learn More
								</Link>
							</div>

							<div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
								<FeatureCard
									icon={<BiShieldQuarter size={24} />}
									title="Genuine Products"
									desc="Quality-focused devices and accessories from trusted sources."
								/>
								<FeatureCard
									icon={<BiPackage size={24} />}
									title="Fast Delivery"
									desc="Quick order processing for a better customer journey."
								/>
								<FeatureCard
									icon={<BiSupport size={24} />}
									title="Tech Support"
									desc="Friendly customer support for the right buying decision."
								/>
							</div>
						</div>

						<div className="relative">
							<div className="relative rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-xl p-5 shadow-2xl">
								<div className="grid grid-cols-2 gap-4">
									<div className="rounded-3xl bg-white p-5 shadow-sm">
										<p className="text-secondary/60 text-sm">
											Available Products
										</p>
										<h3 className="text-3xl font-black text-secondary mt-2">
											{loading ? "..." : products.length}
										</h3>
										<p className="text-accent font-semibold mt-2">
											Live inventory feel
										</p>
									</div>

									<div className="rounded-3xl bg-white p-5 shadow-sm">
										<p className="text-secondary/60 text-sm">
											Best Value Deals
										</p>
										<h3 className="text-3xl font-black text-secondary mt-2">
											{loading ? "..." : dealProducts.length}
										</h3>
										<p className="text-accent font-semibold mt-2">
											Offers worth checking
										</p>
									</div>

									<div className="col-span-2 rounded-3xl bg-white p-5 shadow-sm">
										<div className="flex flex-col sm:flex-row items-center gap-5">
											<div className="w-full sm:w-[220px] h-[180px] rounded-3xl bg-primary flex items-center justify-center overflow-hidden">
												<img
													src={
														featuredProducts?.[0]?.images?.[0] ||
														"/images/default-product-01.png"
													}
													alt="Featured"
													className="w-[150px] h-[150px] object-contain"
												/>
											</div>

											<div className="flex-1 w-full">
												<p className="text-accent font-semibold text-sm uppercase tracking-wide">
													Featured Pick
												</p>
												<h3 className="text-secondary text-2xl font-black mt-2">
													{featuredProducts?.[0]?.name ||
														"Top quality computer products"}
												</h3>
												<p className="text-secondary/65 mt-3 leading-7">
													Designed for performance, productivity, and a better
													everyday tech experience.
												</p>
												<div className="mt-4">
													<Link
														to="/products"
														className="inline-flex h-[46px] px-6 rounded-xl bg-secondary text-white font-bold items-center justify-center hover:bg-accent transition"
													>
														Explore Products
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Category grid */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
				<div className="text-center max-w-2xl mx-auto mb-10">
					<h2 className="text-3xl lg:text-4xl font-black text-secondary">
						Shop by Category
					</h2>
					<p className="text-secondary/70 mt-4 leading-7">
						Built around the product structure already visible in your app:
						computers, parts, and accessories presented in a cleaner commercial
						layout.
					</p>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((item) => (
						<CategoryCard
							key={item.title}
							icon={item.icon}
							title={item.title}
							desc={item.desc}
						/>
					))}
				</div>
			</section>

			{/* Featured rail */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<ProductRail
					title="Featured Products"
					subtitle="A cleaner homepage product experience using your live product API."
					products={featuredProducts}
				/>
			</section>

			{/* Deals rail */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<ProductRail
					title="Best Deals"
					subtitle="Products with better price gaps are highlighted here for stronger conversion."
					products={dealProducts}
				/>
			</section>

			{/* CTA banner */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
				<div className="rounded-[36px] bg-gradient-to-r from-secondary to-accent p-8 lg:p-12 shadow-xl">
					<div className="grid lg:grid-cols-2 gap-8 items-center">
						<div>
							<p className="text-white/80 font-semibold uppercase tracking-wider text-sm">
								Isuri Computers
							</p>
							<h2 className="text-3xl lg:text-4xl font-black text-white mt-3">
								Ready to upgrade your setup?
							</h2>
							<p className="text-white/80 mt-4 leading-7 max-w-2xl">
								Browse the latest products, compare pricing, and choose the
								right device or component for your next upgrade.
							</p>
						</div>

						<div className="flex lg:justify-end">
							<Link
								to="/products"
								className="h-[54px] px-8 rounded-2xl bg-white text-secondary font-black flex items-center justify-center hover:bg-primary transition"
							>
								Browse All Products
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
//comit 3