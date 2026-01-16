import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

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

export default function AdminProductsPage(){

    const [products, setProducts] = useState(sampleProducts)

    return(
        <div className="w-full h-full overflow-y-scroll">

            {
                products.map(
                    (item, index)=>{
                        return <h1 key={item.productId}>{item.name}</h1>
                    }
                )
            }

            <Link to="/admin/add-product" className="text-white bg-accent w-[50px] h-[50px] flex justify-center items-center text-2xl rounded-[20px] hover:rounded-full fixed bottom-10 right-16">
                <FaPlus />
            </Link>
        </div>
    )
}