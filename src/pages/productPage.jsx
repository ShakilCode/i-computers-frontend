import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCard from "../components/productCard"
import LoadingAnimation from "../components/loadingAnimation"

export default function ProductPage(){

    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(true)
    const [searchQuery , setSearchQuery] = useState("")

    useEffect(
        ()=>{

            if(loading){
                let url = import.meta.env.VITE_API_URL + "/products/"
                if(searchQuery!=""){
                    url = import.meta.env.VITE_API_URL + "/products/search/" + searchQuery
                }
                axios.get(url)
                .then(
                    (response)=>{
                        setProducts(response.data)
                        setLoading(false)
                    }
                ).catch(
                    ()=>{
                        toast.error("Failed to fetch products. Please try again.")
                        setLoading(false)
                    }
                )
            }

        },[loading]
    )



    return(
        <div className="flex justify-center flex-wrap bg-primary relative pt-[80px]">
            {
                loading && <LoadingAnimation/>
            }
            <div className="w-full h-[60px] backdrop-blur-sm fixed top-[100px] z-99 flex justify-center items-center">
                <input type="text" placeholder="Search for products..." className="w-[400px] h-[40px] rounded-full px-4"
                onChange={
                    (e)=>{
                        setSearchQuery(e.target.value)
                        setLoading(true)
                    }
                }/>
                {/* get all products button */}
                <button className="ml-4 px-4 py-2 rounded-full bg-secondary text-white"
                onClick={
                    ()=>{
                        setSearchQuery("")
                        setLoading(true)
                    }
                }
                >
                    Get all products
                </button>
            </div>
            {
                
                products.map(
                    (item)=>{
                        return(
                            <ProductCard product={item} key={item.productId}/>
                        )
                    }
                )
            }
        </div>
    )
}