import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { CiTrash } from "react-icons/ci";
import { BiX, BiErrorCircle } from "react-icons/bi";

const FALLBACK_IMG = "/images/default-product-01.png";

export default function DeleteModal(props){
    const [isVisible, setIsVisible] = useState(false)
    const [deleting, setDeleting] = useState(false) // UI only

    const product = props.product;
    const setLoading = props.setLoading;

    // UI only: lock page scroll and allow Escape to close while the popup is open
    useEffect(() => {
        if (!isVisible) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") setIsVisible(false);
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener("keydown", onKey);
        };
    }, [isVisible]);

    return(
        <>
           <button
                type="button"
                onClick={()=>{setIsVisible(true)}}
                aria-label="Delete product"
                className="w-10 h-10 shrink-0 rounded-full bg-primary text-secondary flex items-center justify-center transition hover:bg-[#ff4d6d] hover:text-white hover:shadow-lg hover:shadow-[#ff4d6d]/30 active:scale-90 cursor-pointer"
           >
                <CiTrash />
           </button>

           {/* Rendered in document.body so it always covers the whole screen */}
           {
            isVisible && createPortal(
                <div
                    onClick={()=>{setIsVisible(false)}}
                    className="fixed z-200 inset-0 flex justify-center items-center bg-secondary/30 backdrop-blur-md p-4"
                >
                    <div className="pointer-events-none absolute w-[360px] h-[360px] rounded-full bg-[#ff4d6d]/25 blur-3xl animate-blob" />

                    <div
                        onClick={(e)=>{e.stopPropagation()}}
                        className="relative w-full max-w-[420px] rounded-[2rem] bg-white shadow-2xl shadow-[#ff4d6d]/25 overflow-hidden animate-rise"
                    >
                        {/* Danger strip */}
                        <div className="h-1.5 w-full bg-linear-to-r from-[#ff4d6d] via-[#ff8a5c] to-[#ff4d6d] [background-size:200%_100%] animate-gradient" />

                        <div className="relative p-7 text-center">
                            <button
                                onClick={()=>{setIsVisible(false)}}
                                aria-label="Close"
                                className="absolute right-4 top-4 w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center transition hover:bg-secondary hover:text-white hover:rotate-90 active:scale-90 cursor-pointer"
                            >
                                <BiX size={24} />
                            </button>

                            {/* Warning icon */}
                            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                                <span className="absolute inset-0 rounded-full bg-[#ff4d6d]/30 animate-ping" />
                                <span className="relative w-20 h-20 rounded-full bg-linear-to-br from-[#ff4d6d] to-[#ff8a5c] text-white flex items-center justify-center shadow-xl shadow-[#ff4d6d]/30 animate-float">
                                    <BiErrorCircle size={42} />
                                </span>
                            </div>

                            <h1 className="mt-6 text-2xl font-bold tracking-tight text-secondary">Delete this product?</h1>
                            <p className="mt-2 text-secondary/60 leading-7">
                                Are you sure you want to delete the product with product id{" "}
                                <span className="font-bold text-secondary">{product.productId}</span>?
                                This cannot be undone.
                            </p>

                            {/* Product being deleted */}
                            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary p-3 text-left">
                                <div className="w-14 h-14 shrink-0 rounded-xl bg-white overflow-hidden">
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        referrerPolicy="no-referrer"
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                                        className="w-full h-full object-contain p-1.5"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-secondary line-clamp-2">{product.name}</p>
                                    <p className="text-xs text-secondary/50">{product.productId}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                                <button
                                    className="flex-1 h-12 rounded-full bg-primary text-secondary font-semibold transition hover:bg-secondary/10 active:scale-95 cursor-pointer"
                                    onClick={()=>{setIsVisible(false)}}
                                >Cancel</button>

                                <button
                                    disabled={deleting}
                                    className="group relative flex-1 h-12 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff7a59] text-white font-semibold overflow-hidden shadow-lg shadow-[#ff4d6d]/30 transition hover:shadow-xl hover:shadow-[#ff4d6d]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    onClick={
                                        ()=>{
                                            setDeleting(true)
                                            const token = localStorage.getItem("token");

                                            axios.delete(import.meta.env.VITE_API_URL + "/products/" + product.productId, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            }).then(()=>{                                            
                                                setIsVisible(false);
                                                setDeleting(false)
                                                toast.success("Product deleted successfully");
                                                setLoading(true);
                                            }).catch((error)=>{
                                                toast.error(error?.response?.data?.message || "Failed to delete the product. Please try again.");
                                                setIsVisible(false);
                                                setDeleting(false)
                                            })
                                        }
                                    }
                                >
                                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {deleting && (
                                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                                                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                        )}
                                        {deleting ? "Deleting..." : "Delete"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )
           }
        </>
    )
}