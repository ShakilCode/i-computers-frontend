import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { BiChevronLeft, BiChevronRight, BiShoppingBag, BiCheck, BiShieldQuarter, BiPackage, BiSupport } from "react-icons/bi";
import LoadingAnimation from "../components/loadingAnimation";
import getFormattedPrice from "../utils/price-format";
import { addToCart } from "../utils/cart";

const FALLBACK_IMG = "/images/default-product-01.png";

export default function Overview() {
	const params = useParams();

	//fetch product details using params.productId and display them her
	const [product, setProduct] = useState(null);
	const [activeImage, setActiveImage] = useState(0); // UI only
	const [added, setAdded] = useState(false); // UI only

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_API_URL + "/products/" + params.productId)
			.then((response) => {
				setProduct(response.data);
			});
	}, []);

	// ---- design helpers (no effect on data) ----
	const images = product?.images?.length ? product.images : [FALLBACK_IMG];
	const price = Number(product?.price || 0);
	const labelled = Number(product?.labelledPrice || 0);
	const discount = labelled > price && price > 0 ? Math.round(((labelled - price) / labelled) * 100) : 0;
	const saving = labelled > price ? labelled - price : 0;

	function prevImage() {
		setActiveImage((activeImage - 1 + images.length) % images.length);
	}
	function nextImage() {
		setActiveImage((activeImage + 1) % images.length);
	}

	return (
		<div className="relative w-full min-h-[calc(100vh-100px)] bg-primary overflow-x-hidden">
			{/* Loading animation, centered on the screen */}
			{product == null && (
				<div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none [&>*]:static!">
					<LoadingAnimation />
				</div>
			)}

			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
				<div className="absolute top-1/3 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
			</div>

			{product != null && (
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

					{/* Back link */}
					<Link
						to="/products"
						className="group inline-flex items-center gap-1 rounded-full bg-white border border-secondary/10 pl-3 pr-5 h-10 text-sm font-semibold text-secondary shadow-sm transition hover:border-accent hover:text-accent animate-rise"
					>
						<BiChevronLeft size={20} className="transition group-hover:-translate-x-1" />
						Back to products
					</Link>

					<div className="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

						{/* Left: gallery */}
						<div className="animate-rise" style={{ animationDelay: "0.1s" }}>
							<div className="relative rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 overflow-hidden">
								{discount > 0 && (
									<span className="absolute left-5 top-5 z-10 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white text-lg font-extrabold px-5 py-1.5 shadow-lg shadow-[#ff4d6d]/30">
										-{discount}%
									</span>
								)}

								<div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] bg-linear-to-br from-primary to-white group">
									{images.map((src, i) => (
										<img
											key={i}
											src={src}
											alt={product.name}
											referrerPolicy="no-referrer"
											onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
											className={`absolute inset-0 w-full h-full object-contain p-8 sm:p-12 transition-all duration-500 group-hover:scale-105 ${i === activeImage ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
										/>
									))}

									{images.length > 1 && (
										<>
											<button
												type="button"
												onClick={prevImage}
												aria-label="Previous image"
												className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-secondary shadow-lg flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"
											>
												<BiChevronLeft size={26} />
											</button>
											<button
												type="button"
												onClick={nextImage}
												aria-label="Next image"
												className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-secondary shadow-lg flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"
											>
												<BiChevronRight size={26} />
											</button>
										</>
									)}
								</div>
							</div>

							{/* Thumbnails */}
							{images.length > 1 && (
								<div className="mt-4 flex gap-3 overflow-x-auto pb-2">
									{images.map((src, i) => (
										<button
											key={i}
											type="button"
											onClick={() => setActiveImage(i)}
											aria-label={`Show image ${i + 1}`}
											className={`shrink-0 w-20 h-20 rounded-2xl bg-white overflow-hidden transition active:scale-95 ${i === activeImage ? "ring-2 ring-accent shadow-lg shadow-accent/25" : "border border-secondary/10 opacity-70 hover:opacity-100"}`}
										>
											<img
												src={src}
												alt=""
												referrerPolicy="no-referrer"
												onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
												className="w-full h-full object-contain p-2"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Right: details */}
						<div className="rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-6 sm:p-8 lg:p-10 animate-rise" style={{ animationDelay: "0.2s" }}>

							{/* brand and model if available */}
							{(product.brand || product.model) && (
								<p className="text-sm font-semibold text-accent">
									<span>{product.brand || ""}</span>
									{product.brand && product.model && <span> - </span>}
									<span>{product.model || ""}</span>
								</p>
							)}

							<h1 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-secondary">
								{product.name}
							</h1>

							{/* alternative names */}
							{product.altNames?.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2">
									{product.altNames.map((altName, index) => (
										<span key={index} className="rounded-full bg-primary px-3 py-1 text-sm text-secondary/60">
											{altName}
										</span>
									))}
								</div>
							)}

							{/* productId */}
							<p className="mt-4 text-xs text-secondary/40">Product ID: {product.productId}</p>

							{/* price */}
							<div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
								<p className="text-4xl font-extrabold text-secondary">{getFormattedPrice(product.price)}</p>
								{/* labelled price if available */}
								{product.labelledPrice && (
									<p className="text-xl text-secondary/40 line-through pb-1">{getFormattedPrice(product.labelledPrice)}</p>
								)}
							</div>
							{saving > 0 && (
								<p className="mt-3 inline-block rounded-full bg-accent-2/20 text-[#0b8f66] text-sm font-semibold px-4 py-1.5">
									You save {getFormattedPrice(saving)}
								</p>
							)}

							<div className="my-6 h-px bg-secondary/10" />

							{/* description */}
							<p className="text-secondary/70 leading-8 whitespace-pre-line">{product.description}</p>

							{/* actions */}
							<div className="mt-8 flex flex-col sm:flex-row gap-3">
								<button
									type="button"
									className="group relative flex-1 h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold text-lg overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
									onClick={
										()=>{
											addToCart(product ,1)
											toast.success(product.name +" added to cart")
											setAdded(true)
											setTimeout(() => setAdded(false), 1500)
										}
									}
								>
									<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
									<span className="relative flex items-center justify-center gap-2">
										{added ? <BiCheck size={24} /> : <BiShoppingBag size={22} />}
										{added ? "Added" : "Add to Cart"}
									</span>
								</button>

								<Link to="/checkout" state={
									[
										{
											product: {
												name: product.name,
												price: product.price,
												labelledPrice: product.labelledPrice,
												image: product.images[0],
												productId: product.productId
											},
											qty: 1
										}
									]
								} className="flex-1 h-14 rounded-full bg-white border-2 border-accent text-accent font-semibold text-lg flex items-center justify-center transition hover:bg-accent hover:text-white hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"

								>Buy Now</Link>
							</div>

							{/* trust row (placeholder wording) */}
							<div className="mt-8 grid grid-cols-3 gap-3">
								{[
									{ icon: <BiShieldQuarter size={22} />, label: "Genuine product" },
									{ icon: <BiPackage size={22} />, label: "Fast delivery" },
									{ icon: <BiSupport size={22} />, label: "Tech support" },
								].map((t, i) => (
									<div key={t.label} className="rounded-2xl bg-primary p-3 text-center">
										<span className="mx-auto w-10 h-10 rounded-xl bg-white text-accent flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{t.icon}</span>
										<p className="mt-2 text-xs sm:text-sm font-medium text-secondary/70">{t.label}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}