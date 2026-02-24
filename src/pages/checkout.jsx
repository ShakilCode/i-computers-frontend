import { useState } from "react"
import {  getCartTotal } from "../utils/cart"
import { BiMinus, BiPlus } from "react-icons/bi"
import getFormattedPrice from "../utils/price-format"
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout(){
    const location = useLocation();
    const [cart , setCart] = useState(location.state || [])
    const navigate = useNavigate();

    if(location.state == null){
        navigate("/products")
    }
    return(
        <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll ">

            <div className="w-full  flex justify-center items-center flex-col gap-4 p-5">
                {
                    cart.map(
                        (cartItem , index)=>{
                            return(
                                <div key={index} className="w-[600px]  h-[150px] bg-white flex flex-row rounded-lg shadow overflow-hidden">
                                    <img className="h-[150px] aspect-square object-cover" src={cartItem.product.image} alt={cartItem.name} />
                                    <div className="h-full w-[280px] p-4 flex flex-col  overflow-hidden  justify-between">
                                        <p className="text-xs text-gray-500">{cartItem.product.productId}</p>
                                        <h1 className="text-xl font-bold">{cartItem.product.name}</h1>
                                        <div className="w-[210px] h-[50px] border border-accent rounded-full flex overflow-hidden">
                                            <button onClick={
                                                ()=>{
                                                    
                                                    const newCart = [...cart]

                                                    newCart[index].qty = newCart[index].qty - 1
                                                    if(newCart[index].qty<=0){
                                                        newCart.splice(index,1)
                                                    }
                                                    setCart(newCart)

                                                }
                                            } className="w-[70px] h-full flex justify-center items-center  text-2xl font-bold text-gray-700 hover:bg-accent">
                                                <BiMinus/>
                                            </button>
                                            <span className="w-[70px] h-full flex justify-center items-center  text-lg font-bold text-gray-700">
                                                {cartItem.qty}
                                            </span>
                                            <button onClick={
                                                ()=>{
                                                    
                                                    const newCart = [...cart]

                                                    newCart[index].qty = newCart[index].qty + 1

                                                    setCart(newCart)

                                                }
                                            } className="w-[70px] h-full flex justify-center items-center  text-2xl font-bold text-gray-700 hover:bg-accent">
                                                <BiPlus/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-[170px] h-full  flex flex-col justify-center items-end pr-2">
                                        
                                        {
                                            cartItem.product.labelledPrice>cartItem.product.price && (
                                                <span className="text-sm text-gray-500 line-through">{getFormattedPrice(cartItem.product.labelledPrice)}</span>
                                            )
                                        }
                                        <span className="text-sm text-secondary font-semibold">{getFormattedPrice(cartItem.product.price)}</span>
                                        <span className="text-lg text-secondary font-bold">{getFormattedPrice(cartItem.product.price * cartItem.qty)}</span>
                                    </div>
                                </div>
                            )
                        }
                    )
                }
                <div className="bg-white w-[600px] h-[100px] sticky bottom-0 rounded-xl shadow flex items-center">
                    <button className="bg-accent text-white px-4 py-2 rounded ml-5 hover:bg-accent/80">Buy now</button>
                    <span className="text-xl font-bold text-secondary absolute right-5 border-b-4  border-double">{getFormattedPrice(getCartTotal(cart))}</span>
                </div>
            </div>            
        </div>
    )
}