import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { CiTrash } from "react-icons/ci";

export default function DeleteModal(props){
    const [isVisible, setIsVisible] = useState(false)

    const product = props.product;
    const setLoading = props.setLoading;

    return(
        <div>
           <CiTrash onClick={()=>{setIsVisible(true)}} className="hover:text-red-600 cursor-pointer" />
           {
            isVisible && (
                <div className="fixed z-100 bg-black/50 w-screen h-screen top-0 left-0 flex justify-center items-center">
                    <div className="w-[400px] bg-white h-[200px] relative">
                        <button onClick={()=>{setIsVisible(false)}} className="w-[40px] h-[40px]  text-red-600 absolute right-0 text-sm font-bold hover:bg-red-600 hover:text-white cursor-pointer" >
                            X
                        </button>
                        <h1 className="text-lg font-semibold text-center mt-10">Are you sure you want to delete the product with product id {product.productId}?</h1>
                        <div className="flex text-sm justify-center items-center gap-5 mt-10">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={
                                    ()=>{
                                        const token = localStorage.getItem("token");

                                        axios.delete(import.meta.env.VITE_API_URL + "/products/" + product.productId, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        }).then(()=>{                                            
                                            setIsVisible(false);
                                            toast.success("Product deleted successfully");
                                            setLoading(true);
                                        }).catch((error)=>{
                                            toast.error(error?.response?.data?.message || "Failed to delete the product. Please try again.");
                                            setIsVisible(false);
                                        })
                                    }
                                }
                            >Delete </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={()=>{setIsVisible(false)}}
                            >Cancel</button>
                        </div>
                        
                    </div>
                </div>
            )
           }
        </div>
    )
}