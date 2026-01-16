import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import getFormattedPrice from "../../utils/price-format";


const sampleProducts = [
	{
		productId: "PRD24001",
		name: "DiamondShine All-Purpose Cleaner (500ml)",
		description:
			"Multi-surface cleaner for kitchens, tiles, glass, and stainless steel. Fast-dry formula with fresh scent.",
		altNames: [
			"All Purpose Cleaner",
			"Multi Surface Cleaner",
			"DS Cleaner 500ml",
		],
		price: 950,
		labelledPrice: 1150,
		category: "Cleaning",
		images: ["/images/default-product-1.png", "/images/default-product-2.png"],
		isVisible: true,
		brand: "DiamondShine",
		model: "Standard",
	},
	{
		productId: "PRD24002",
		name: "Skyrek Wireless Mouse (2.4G)",
		description:
			"Ergonomic wireless mouse with silent clicks and adjustable DPI for daily work and study.",
		altNames: ["Wireless Mouse", "Silent Mouse", "2.4G Mouse"],
		price: 1850,
		labelledPrice: 2200,
		category: "Electronics",
		images: ["/images/default-product-1.png", "/images/default-product-2.png"],
		isVisible: true,
		brand: "Skyrek",
		model: "Pro",
	},
	{
		productId: "PRD24003",
		name: "Cindrell Unisex Cotton T-Shirt",
		description:
			"Soft premium cotton t-shirt with a relaxed fit. Everyday wear for casual and street style.",
		altNames: ["Unisex Tee", "Cotton Tee", "Streetwear T Shirt"],
		price: 2400,
		labelledPrice: 2900,
		category: "Fashion",
		images: ["/images/default-product-1.png", "/images/default-product-2.png"],
		isVisible: true,
		brand: "Cindrell",
		model: "Relaxed Fit",
	},
	{
		productId: "PRD24004",
		name: "Organic Compost Pack (5kg)",
		description:
			"Nutrient-rich compost for home gardens. Improves soil health and plant growth naturally.",
		altNames: ["Garden Compost", "Organic Fertilizer", "Soil Booster"],
		price: 1200,
		labelledPrice: 1500,
		category: "Garden",
		images: ["/images/default-product-1.png", "/images/default-product-2.png"],
		isVisible: true,
		brand: "GreenGrow",
		model: "Eco",
	},
	{
		productId: "PRD24005",
		name: "Stainless Steel Water Bottle (750ml)",
		description:
			"Double-wall insulated bottle to keep drinks cold or hot for hours. Leak-proof cap.",
		altNames: ["Thermal Bottle", "Insulated Bottle", "Steel Bottle 750ml"],
		price: 2600,
		labelledPrice: 3200,
		category: "Lifestyle",
		images: ["/images/default-product-1.png", "/images/default-product-2.png"],
		isVisible: true,
		brand: "HydraMate",
		model: "Insulated",
	},
];

export default function AdminProductsPage() {
	const [products, setProducts] = useState(sampleProducts);

	return (
		<div className="w-full h-full overflow-y-scroll ">
			{/* Container */}

			{/* Header bar */}
			<div className="flex items-center justify-between gap-3 px-5 py-4 bg-primary/60 border-b border-secondary/10">
				<div>
					<h2 className="text-lg font-semibold text-secondary">Products</h2>
					<p className="text-sm text-secondary/70">
						Manage your catalog at a glance
					</p>
				</div>
				<span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-secondary">
					<span className="h-2 w-2 rounded-full bg-accent" />
					{products?.length ?? 0} items
				</span>
			</div>

			{/* Table */}

			<table className="min-w-[1100px] w-full text-sm relative">
				<thead className="sticky top-0 z-10 bg-white">
					<tr className="border-b border-secondary/10">
						<th className="px-5 py-3 border text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Product ID
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-tight text-secondary/70">
							Name
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Price
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Labelled
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Category
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Image
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Visibility
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Brand
						</th>
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
							Model
						</th>
					</tr>
				</thead>

				<tbody className="divide-y divide-secondary/10">
					{products.map((item) => (
						<tr
							key={item.productId}
							className=" even:bg-white hover:bg-primary/50 transition-colors"
						>
							<td className="px-5 py-4 font-medium text-secondary whitespace-nowrap">
								{item.productId}
							</td>

							<td className="px-5 py-4">
								<div className="flex flex-col">
									<span className="font-semibold text-secondary">
										{item.name}
									</span>
									<span className="text-xs text-secondary/60">
										{item.category || "Uncategorized"}
									</span>
								</div>
							</td>

							<td className="px-5 py-4 font-semibold text-secondary whitespace-nowrap">
								{getFormattedPrice(item.price)}
							</td>

							<td className="px-5 py-4 text-secondary/80 whitespace-nowrap">
								{item.labelledPrice ? (
									<span>{getFormattedPrice(item.labelledPrice)}</span>
								) : (
									<span className="text-secondary/40">—</span>
								)}
							</td>

							<td className="px-5 py-4">
								<span className="flex items-center justify-center rounded-full bg-secondary/5 px-3 py-1 text-xs font-medium text-secondary">
									{item.category}
								</span>
							</td>

							<td className="px-5 py-4">
								<div className="flex items-center gap-3">
									<img
										src={item.images?.[0]}
										alt={item.name}
										className="h-12 w-12 rounded-xl object-cover ring-1 ring-secondary/10 shadow-sm bg-primary"
										loading="lazy"
									/>
									<span className="text-xs text-secondary/60 hidden sm:inline">
										Main image
									</span>
								</div>
							</td>

							<td className="px-5 py-4">
								{item.isVisible ? (
									<span className="flex items-center justify-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-secondary">
										<span className="h-2 w-2 rounded-full bg-accent" />
										Visible
									</span>
								) : (
									<span className="flex items-center justify-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary/80">
										<span className="h-2 w-2 rounded-full bg-secondary/40" />
										Hidden
									</span>
								)}
							</td>

							<td className="px-5 py-4 text-secondary whitespace-nowrap">
								{item.brand || <span className="text-secondary/40">N/A</span>}
							</td>

							<td className="px-5 py-4 text-secondary whitespace-nowrap">
								{item.model || <span className="text-secondary/40">N/A</span>}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* Footer */}
			<div className="px-5 py-3 bg-white border-t border-secondary/10 text-xs text-secondary/60">
				Tip: Scroll horizontally on small screens to view all columns.
			</div>    
			<Link
				to="/admin/add-product"
				className="text-white bg-accent w-[50px] h-[50px] flex justify-center items-center text-2xl rounded-[20px] hover:rounded-full fixed bottom-12 right-16"
			>
				<FaPlus />
			</Link>
		</div>
	);
}
