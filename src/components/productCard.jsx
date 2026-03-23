import { Link } from "react-router-dom"
import getFormattedPrice from "../utils/price-format"

export default function ProductCard(props){
    const product = props.product
    return(
        <Link to={"/overview/"+product.productId} className="w-[300px] h-[400px] m-4 rounded-lg shadow-lg bg-white overflow-hidden hover:[&_.main-image]:opacity-0  z-0 relative">
            <div className="bg-white absolute top-0 left-0 w-full">
                <img src={product.images[1]} alt={product.name} className="h-[250px] w-full object-cover"/>
            </div>
            <div className="bg-white main-image w-full absolute top-0 left-0 transition-opacity duration-500">
                <img src={product.images[0]} alt={product.name} className="h-[250px] w-full object-cover"/>
            </div>
            <div className="h-[150px]  w-full absolute bottom-0 flex  justify-center  flex-col p-2">
                <span className="text-xs opacity-50">{product.productId}</span>
                <h1 className="font-semibold text-lg">{product.name}</h1>
                {
                    product.labelledPrice > product.price &&
                    <p className="text-sm text-red-600 line-through opacity-60">{getFormattedPrice(product.labelledPrice)}</p>
                }
                <p className="text-md font-bold">{getFormattedPrice(product.price)}</p>
            </div>            

        </Link>
    )
}