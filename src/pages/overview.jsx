import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../components/loadingAnimation";
import ImageSlideShow from "../components/imageSlideShow";
import getFormattedPrice from "../utils/price-format";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function Overview() {
	const params = useParams();

	//fetch product details using params.productId and display them her
	const [product, setProduct] = useState(null);


	useEffect(() => {
		axios
			.get(import.meta.env.VITE_API_URL + "/products/" + params.productId)
			.then((response) => {
				setProduct(response.data);
			});
	}, []);

	return (
		<div className="w-full h-[calc(100vh-100px)] flex justify-center items-center ">
			{
				product == null ? <LoadingAnimation /> :
					<div className="w-full h-full flex">
						<div className="w-[50%] h-full flex justify-center items-center">
							<ImageSlideShow images={product.images} />
						</div>
						<div className="w-[50%] h-full p-5 flex justify-center flex-col">

							<h1 className="text-3xl font-bold mb-4">{product.name}
							
								{
									product.altNames.map((altName , index)=>{
										return(
											<span key={index} className=" text-gray-500 font-medium"> | {altName} </span>
										)
									})
								}
							</h1>

							{/* brand and model if available */}
							{
								<p className="text-lg font-medium mb-2">
									<span>{product.brand || ""}</span>
									<span> - </span>
									<span>{product.model || ""}</span>
								</p>
							}

							{/* productId */}
							<p className="text-sm text-gray-500 mb-4">{product.productId}</p>
							
							{/* price */}
							<p className="text-2xl font-bold mb-4">{getFormattedPrice(product.price)}</p>

							{/* labelled price if available */}
							{
								product.labelledPrice && 
								<p className="text-lg text-gray-500 line-through mb-4">{getFormattedPrice(product.labelledPrice)}</p>
							}

							{/* description */}
							<p className="text-md mb-4">{product.description}</p>

							<div className="w-full h-[100px]  flex justify-start items-center text-white font-bold text-xl">
								<button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 cursor-pointer" onClick={
									()=>{
										addToCart(product ,1)
										toast.success(product.name +" added to cart")
									}
								}>Add to Cart</button>

							</div>


						</div>
					</div>
			}
		</div>
	);
}