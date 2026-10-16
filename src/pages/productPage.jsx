import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { BiSearch, BiX, BiChevronDown, BiPackage, BiHeart, BiSolidHeart } from "react-icons/bi"
import LoadingAnimation from "../components/loadingAnimation"

// >>> Change this to your single-product page route if it is different <<<
const productLink = (p) => "/overview/" + p?.productId

/* ---------- helpers ---------- */
const money = (n) => "Rs. " + Number(n || 0).toLocaleString()
const FALLBACK_IMG = "/images/default-product-01.png"

function discountOf(p){
    const l = Number(p?.labelledPrice), pr = Number(p?.price)
    return l > pr && pr > 0 ? Math.round(((l - pr) / l) * 100) : 0
}
function savingOf(p){
    return Math.max(0, Number(p?.labelledPrice || 0) - Number(p?.price || 0))
}
function imageOf(p){
    return p?.images?.[0] || p?.image || FALLBACK_IMG
}

/* ---------- product card (built into this page, no other component needed) ---------- */
function ShopCard({ product }){
    const [liked , setLiked] = useState(false) // UI only
    const discount = discountOf(product)
    const saving = savingOf(product)

    return(
        <div className="group w-full flex flex-col rounded-3xl bg-white border border-secondary/10 overflow-hidden shadow-md shadow-accent/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/15">

            {/* Image area: fixed height so text can never overlap it */}
            <div className="relative w-full h-[220px] shrink-0 bg-linear-to-br from-primary to-white">
                {discount > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white text-xs font-extrabold px-3 py-1 shadow-lg shadow-[#ff4d6d]/30">
                        -{discount}%
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    aria-label="Save to wishlist"
                    className={`absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow transition active:scale-90 ${liked ? "text-[#ff4d6d]" : "text-secondary/50 hover:text-[#ff4d6d]"}`}
                >
                    {liked ? <BiSolidHeart size={20} /> : <BiHeart size={20} />}
                </button>

                <img
                    src={imageOf(product)}
                    alt={product?.name || "Product"}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                    className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col flex-1 p-5">
                <p className="text-xs font-semibold text-accent truncate">
                    {product?.category || product?.brand || "Computer product"}
                </p>

                <h3 className="mt-2 text-base font-bold leading-6 text-secondary line-clamp-2 min-h-[48px]">
                    {product?.name || "Product name"}
                </h3>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-xl font-extrabold text-secondary">{money(product?.price)}</span>
                    {discount > 0 && (
                        <span className="text-sm text-secondary/40 line-through">{money(product?.labelledPrice)}</span>
                    )}
                </div>

                <div className="mt-2 min-h-[28px]">
                    {saving > 0 && (
                        <span className="inline-block rounded-full bg-accent-2/20 text-[#0b8f66] text-xs font-semibold px-3 py-1">
                            You save {money(saving)}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-4">
                    <Link
                        to={productLink(product)}
                        className="h-11 w-full rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold flex items-center justify-center shadow-md shadow-accent/25 transition hover:shadow-lg active:scale-95"
                    >
                        View product
                    </Link>
                </div>
            </div>
        </div>
    )
}

/* ---------- page ---------- */
export default function ProductPage(){

    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(true)
    const [searchQuery , setSearchQuery] = useState("")
    const [category , setCategory] = useState("All") // UI only
    const [sortBy , setSortBy] = useState("default") // UI only

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

    // UI only: category chips + sorting on the products already loaded
    const categories = useMemo(
        ()=> ["All", ...new Set((Array.isArray(products) ? products : []).map((p)=>p?.category).filter(Boolean))].slice(0, 10),
        [products]
    )
    const activeCategory = categories.includes(category) ? category : "All"

    const shown = useMemo(()=>{
        let list = Array.isArray(products) ? [...products] : []
        if(activeCategory !== "All"){
            list = list.filter((p)=>p?.category === activeCategory)
        }
        if(sortBy === "low"){
            list.sort((a,b)=>Number(a?.price||0) - Number(b?.price||0))
        }else if(sortBy === "high"){
            list.sort((a,b)=>Number(b?.price||0) - Number(a?.price||0))
        }else if(sortBy === "discount"){
            list.sort((a,b)=>discountOf(b) - discountOf(a))
        }
        return list
    },[products, activeCategory, sortBy])

    function showAll(){
        setSearchQuery("")
        setLoading(true)
    }

    return(
        <div className="relative min-h-screen w-full bg-primary">
            {
                loading && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none [&>*]:static!">
                        <LoadingAnimation/>
                    </div>
                )
            }

            {/* Soft background (behind everything) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
                <div className="absolute top-1/3 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Title */}
                <div className="pt-10 pb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-secondary">
                        Find your next upgrade
                    </h1>
                    <p className="mt-3 text-base lg:text-lg text-secondary/60">
                        Laptops, components and accessories, all in one place.
                    </p>
                </div>

                {/* Sticky search + sort bar */}
                <div className="sticky top-[92px] z-30">
                    <div className="mx-auto max-w-3xl rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-accent/15 p-2 flex items-center gap-2">
                        <div className="relative flex-1 min-w-0">
                            <BiSearch size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Search for products..."
                                className="w-full h-12 rounded-full bg-transparent pl-12 pr-12 text-secondary outline-none placeholder:text-secondary/40 transition focus:bg-white focus:ring-4 focus:ring-accent/15"
                                onChange={
                                    (e)=>{
                                        setSearchQuery(e.target.value)
                                        setLoading(true)
                                    }
                                }
                            />
                            {searchQuery !== "" && (
                                <button
                                    type="button"
                                    onClick={showAll}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center transition hover:bg-accent hover:text-white active:scale-90"
                                >
                                    <BiX size={20} />
                                </button>
                            )}
                        </div>

                        <div className="relative hidden sm:block shrink-0">
                            <select
                                value={sortBy}
                                onChange={(e)=>{setSortBy(e.target.value)}}
                                className="appearance-none h-12 pl-5 pr-10 rounded-full bg-primary text-secondary font-semibold outline-none cursor-pointer transition hover:bg-accent/10 focus:ring-4 focus:ring-accent/15"
                            >
                                <option value="default">Sort: Featured</option>
                                <option value="low">Price: Low to high</option>
                                <option value="high">Price: High to low</option>
                                <option value="discount">Biggest discount</option>
                            </select>
                            <BiChevronDown size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
                        </div>
                    </div>
                </div>

                {/* Category chips + result count */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                        {categories.map((c)=>(
                            <button
                                key={c}
                                type="button"
                                onClick={()=>{setCategory(c)}}
                                className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 ${activeCategory === c ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-secondary/60 shrink-0">
                        {loading ? "Loading..." : `${shown.length} ${shown.length === 1 ? "product" : "products"}`}
                        {searchQuery !== "" && !loading && <> for "<span className="font-semibold text-secondary">{searchQuery}</span>"</>}
                    </p>
                </div>

                {/* Product grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        shown.map(
                            (item)=>{
                                return(
                                    <ShopCard product={item} key={item.productId}/>
                                )
                            }
                        )
                    }
                </div>

                {/* Empty state */}
                {!loading && shown.length === 0 && (
                    <div className="mt-10 mx-auto max-w-md rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-10 text-center">
                        <div className="mx-auto w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30">
                            <BiPackage size={32} />
                        </div>
                        <h2 className="mt-5 text-2xl font-bold text-secondary">No products found</h2>
                        <p className="mt-2 text-secondary/60">Try a different word or look at everything we have.</p>
                        <button
                            type="button"
                            onClick={showAll}
                            className="mt-6 h-12 px-8 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95"
                        >
                            Show all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}