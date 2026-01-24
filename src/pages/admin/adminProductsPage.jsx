import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import getFormattedPrice from "../../utils/price-format";
import axios from "axios";
import { CiEdit, CiTrash } from "react-icons/ci";
import LoadingAnimation from "../../components/loadingAnimation";
import DeleteModal from "../../components/deleteModal";


export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(()=>{
		if(loading){
			const token = localStorage.getItem("token")

			axios.get(import.meta.env.VITE_API_URL + "/products", {
				headers: {
					Authorization: "Bearer "+token
				}
			}).then(
				(response)=>{
					setProducts(response.data)
					setLoading(false)
				}
			)
		}
	}, [loading])

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

			{ loading ? (
				<div className="w-full h-full flex justify-center items-center">
					<LoadingAnimation />
				</div>
			) : <table className="min-w-[1100px] w-full text-sm relative">
				<thead className="sticky top-0 z-10 bg-white">
					<tr className="border-b border-secondary/10">
						<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary/70">
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
						<th>
							Actions
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

							<td className="px-5 py-4">
								<div className="flex justify-center items-center text-2xl gap-2">
									<Link 
										to={"/admin/update-product"}
										state={item}
										className="hover:text-accent"
									>
										<CiEdit/>
									</Link>

									<DeleteModal product={item} setLoading={setLoading} />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>}
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
