import { useState } from "react";

export default function ImageSlideShow(props) {
	const images = props.images;
	const [activeImage, setActiveImage] = useState(0);

    function getClass(index){
        if(index == activeImage){
            return "h-[90px] w-[90px] rounded-[20px] shadow-md cursor-pointer border-4 border-blue-500"
        }else{
            return "h-[90px] w-[90px] rounded-[20px] shadow-md cursor-pointer"
        }
    }

	return (
		<div className="w-[500px] h-[600px] flex flex-col">
			<img
				src={images[activeImage]}
				className="h-[500px] w-full object-cover"
			/>
			<div className="w-full h-[100px] flex flex-row px-4 gap-4 justify-center items-center">
				{images.map((img, index) => {
					return (
						<img
							onClick={() => {
								setActiveImage(index);
							}}
							key={index}
							src={img}
                            className={getClass(index)}
						/>
					);
				})}
			</div>
		</div>
	);
}
