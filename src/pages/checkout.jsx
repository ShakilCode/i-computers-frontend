import { useState } from "react"
import {  getCartTotal } from "../utils/cart"
import { BiMinus, BiPlus, BiCheck, BiShieldQuarter, BiShoppingBag } from "react-icons/bi"
import getFormattedPrice from "../utils/price-format"
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckOutDetailsModal from "../components/checkoutDetailsModal";

const FALLBACK_IMG = "/images/default-product-01.png"

export default function Checkout(){
    const location = useLocation();
    const [cart , setCart] = useState(location.state || [])
    
    const navigate = useNavigate();

    if(location.state == null){
        navigate("/products")
    }

    // ---- design helpers (display only) ----
    const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0)
    const totalSavings = cart.reduce((sum, item) => {
        const l = Number(item.product.labelledPrice), p = Number(item.product.price)
        return l > p ? sum + (l - p) * Number(item.qty || 0) : sum
    }, 0)

    const steps = [
        { label: "Cart", state: "done" },
        { label: "Checkout", state: "active" },
        { label: "Done", state: "todo" },
    ]

    return(
        <div className="relative w-full min-h-[calc(100vh-100px)] bg-primary overflow-x-hidden">

            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
                <div className="absolute top-1/2 -left-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

                {/* Progress stepper */}
                <div className="flex items-center justify-center animate-rise">
                    {steps.map((s, i) => (
                        <div key={s.label} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <span className={`relative w-11 h-11 rounded-full flex items-center justify-center font-bold transition ${
                                    s.state === "done" ? "bg-accent-2 text-white shadow-lg shadow-accent-2/40"
                                    : s.state === "active" ? "bg-accent text-white shadow-lg shadow-accent/40"
                                    : "bg-white text-secondary/40 border border-secondary/10"
                                }`}>
                                    {s.state === "active" && <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />}
                                    <span className="relative">{s.state === "done" ? <BiCheck size={24} /> : i + 1}</span>
                                </span>
                                <span className={`text-xs sm:text-sm font-semibold ${s.state === "todo" ? "text-secondary/40" : "text-secondary"}`}>{s.label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-14 sm:w-28 h-1 mx-3 mb-6 rounded-full bg-secondary/10 overflow-hidden">
                                    <div className={`h-full rounded-full bg-linear-to-r from-accent-2 to-accent ${i === 0 ? "w-full" : "w-1/2 animate-pulse-soft"}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Title */}
                <div className="mt-10 animate-rise" style={{ animationDelay: "0.1s" }}>
                    <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-secondary">Review your order</h1>
                    <p className="mt-2 text-secondary/60">Check your items, then complete your details.</p>
                </div>

                {/* Empty state */}
                {cart.length === 0 && (
                    <div className="mt-10 mx-auto max-w-md rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-10 text-center animate-rise">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
                            <BiShoppingBag size={38} />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-secondary">Nothing to check out</h2>
                        <p className="mt-2 text-secondary/60">Your order is empty. Find something you like first.</p>
                        <Link
                            to="/products"
                            className="mt-6 h-12 px-8 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold inline-flex items-center justify-center shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95"
                        >
                            Browse products
                        </Link>
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start">

                        {/* Items */}
                        <div className="flex flex-col gap-4">
                            {
                                cart.map(
                                    (cartItem , index)=>{
                                        const l = Number(cartItem.product.labelledPrice)
                                        const p = Number(cartItem.product.price)
                                        const discount = l > p && p > 0 ? Math.round(((l - p) / l) * 100) : 0
                                        return(
                                            <div
                                                key={index}
                                                className="group relative flex flex-col sm:flex-row gap-5 rounded-3xl bg-white border border-secondary/10 p-4 shadow-md shadow-accent/5 transition duration-300 hover:shadow-xl hover:shadow-accent/15 animate-rise"
                                                style={{ animationDelay: `${0.15 + Math.min(index, 8) * 70 / 1000}s` }}
                                            >
                                                {/* Image */}
                                                <div className="relative shrink-0 w-full sm:w-[120px] h-[170px] sm:h-[120px] rounded-2xl bg-linear-to-br from-primary to-white overflow-hidden">
                                                    {discount > 0 && (
                                                        <span className="absolute left-2 top-2 z-10 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white text-xs font-extrabold px-2.5 py-0.5 shadow">
                                                            -{discount}%
                                                        </span>
                                                    )}
                                                    <img
                                                        className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                                                        src={cartItem.product.image}
                                                        alt={cartItem.product.name}
                                                        referrerPolicy="no-referrer"
                                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                                                    />
                                                </div>

                                                {/* Info + quantity */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                                                    <div>
                                                        <p className="text-xs text-secondary/40 truncate">{cartItem.product.productId}</p>
                                                        <h2 className="mt-1 text-lg font-bold text-secondary leading-6 line-clamp-2">{cartItem.product.name}</h2>
                                                        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                                                            <span className="text-sm font-semibold text-secondary/70">{getFormattedPrice(cartItem.product.price)}</span>
                                                            {
                                                                cartItem.product.labelledPrice>cartItem.product.price && (
                                                                    <span className="text-xs text-secondary/40 line-through">{getFormattedPrice(cartItem.product.labelledPrice)}</span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="inline-flex self-start items-center rounded-full bg-primary border border-secondary/10 p-1">
                                                        <button onClick={
                                                            ()=>{
                                                                
                                                                const newCart = [...cart]

                                                                newCart[index].qty = newCart[index].qty - 1
                                                                if(newCart[index].qty<=0){
                                                                    newCart.splice(index,1)
                                                                }
                                                                setCart(newCart)

                                                            }
                                                        } aria-label="Decrease quantity" className="w-10 h-10 rounded-full flex justify-center items-center text-xl text-secondary transition hover:bg-accent hover:text-white active:scale-90">
                                                            <BiMinus/>
                                                        </button>
                                                        <span key={cartItem.qty} className="w-12 text-center text-lg font-bold text-secondary tabular-nums animate-rise">
                                                            {cartItem.qty}
                                                        </span>
                                                        <button onClick={
                                                            ()=>{
                                                                
                                                                const newCart = [...cart]

                                                                newCart[index].qty = newCart[index].qty + 1

                                                                setCart(newCart)

                                                            }
                                                        } aria-label="Increase quantity" className="w-10 h-10 rounded-full flex justify-center items-center text-xl text-secondary transition hover:bg-accent hover:text-white active:scale-90">
                                                            <BiPlus/>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Line total */}
                                                <div className="sm:w-[140px] flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:text-right">
                                                    <span className="text-sm text-secondary/50 sm:hidden">Total</span>
                                                    <span key={cartItem.qty} className="text-xl font-extrabold text-secondary animate-rise">{getFormattedPrice(cartItem.product.price * cartItem.qty)}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>

                        {/* Ticket-style summary */}
                        <div className="lg:sticky lg:top-[100px] relative rounded-[2rem] bg-white border border-secondary/10 shadow-2xl shadow-accent/20 p-7 animate-rise" style={{ animationDelay: "0.2s" }}>
                            <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[2rem] bg-linear-to-r from-accent via-[#b06cff] to-accent-2 [background-size:200%_100%] animate-gradient" />

                            <h2 className="mt-1 text-xl font-bold text-secondary">Order summary</h2>

                            <div className="mt-5 space-y-3 text-secondary/70">
                                <div className="flex justify-between">
                                    <span>Items</span>
                                    <span className="font-semibold text-secondary tabular-nums">{itemCount}</span>
                                </div>
                                {totalSavings > 0 && (
                                    <div className="flex justify-between">
                                        <span>You save</span>
                                        <span className="font-semibold text-[#0b8f66]">{getFormattedPrice(totalSavings)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Ticket tear line */}
                            <div className="relative my-6 border-t-2 border-dashed border-secondary/15">
                                <span className="absolute -top-3 -left-10 w-6 h-6 rounded-full bg-primary border border-secondary/10" />
                                <span className="absolute -top-3 -right-10 w-6 h-6 rounded-full bg-primary border border-secondary/10" />
                            </div>

                            <div className="flex items-end justify-between">
                                <span className="text-secondary/60">Total</span>
                                <span key={getCartTotal(cart)} className="text-3xl font-extrabold text-secondary animate-rise">{getFormattedPrice(getCartTotal(cart))}</span>
                            </div>

                            {/* Your details button/modal (styled from here) */}
                            <div className="mt-6 flex flex-col [&>button]:w-full! [&>button]:h-14! [&>button]:ml-0! [&>button]:rounded-full! [&>button]:bg-accent! [&>button]:text-white! [&>button]:font-semibold! [&>button]:shadow-lg! [&>button]:shadow-accent/30! [&>button]:transition [&>button]:hover:-translate-y-0.5 [&>button]:active:scale-[0.98]">
                                <CheckOutDetailsModal cart={cart} />
                            </div>

                            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-secondary/50">
                                <BiShieldQuarter size={16} className="text-accent" />
                                Secure checkout
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}