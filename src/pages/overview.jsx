import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../components/loadingAnimation";
import ImageSlideShow from "../components/imageSlideShow";

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
					<div className="w-full h-full  flex">
						<div className="w-[50%] h-full border">
							<ImageSlideShow images={product.images} />
						</div>
						<div className="w-[50%] h-full border">
						</div>
					</div>
			}
		</div>
	);
}