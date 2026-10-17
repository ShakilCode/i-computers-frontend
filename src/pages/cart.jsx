import { useState } from "react"
import { addToCart, getCart, getCartTotal } from "../utils/cart"
import { BiMinus, BiPlus, BiShoppingBag, BiChevronRight, BiShieldQuarter } from "react-icons/bi"
import getFormattedPrice from "../utils/price-format"
import { Link } from "react-router-dom"

const FALLBACK_IMG = "/images/default-product-01.png"

export default function Cart(){
    const [cart , setCart] = useState(getCart())

    // ---- design helpers (display only) ----
    const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0)
    const totalSavings = cart.reduce((sum, item) => {
        const l = Number(item.product.labelledPrice), p = Number(item.product.price)
        return l > p ? sum + (l - p) * Number(item.qty || 0) : sum
    }, 0)

    return(
        <div className="relative w-full min-h-[calc(100vh-100px)] bg-primary overflow-x-hidden">

            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
                <div className="absolute top-1/3 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

                {/* Title */}
                <div className="flex flex-wrap items-end justify-between gap-3 animate-rise">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-secondary">Your cart</h1>
                        <p className="mt-2 text-secondary/60">
                            {cart.length === 0 ? "Nothing here yet." : `${itemCount} ${itemCount === 1 ? "item" : "items"} ready for checkout`}
                        </p>
                    </div>
                    {cart.length > 0 && (
                        <Link to="/products" className="group inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                            Continue shopping
                            <BiChevronRight size={20} className="transition group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>

                {/* Empty state */}
                {cart.length === 0 && (
                    <div className="mt-10 mx-auto max-w-md rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-10 text-center animate-rise">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
                            <BiShoppingBag size={38} />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-secondary">Your cart is empty</h2>
                        <p className="mt-2 text-secondary/60">Add a few products and they will show up here.</p>
                        <Link
                            to="/products"
                            className="mt-6 h-12 px-8 rounded-full bg-linear-to-r from-accent to-[#8b7cf6] text-white font-semibold inline-flex items-center justify-center shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 active:scale-95"
                        >
                            Browse products
                        </Link>
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">

                        {/* Items */}
                        <div className="flex flex-col gap-4">
                            {
                                cart.map(
                                    (cartItem , index)=>{
                                        const l = Number(cartItem.product.labelledPrice)
                                        const p = Number(cartItem.product.price)
                                        const hasDiscount = l > p && p > 0
                                        const discount = hasDiscount ? Math.round(((l - p) / l) * 100) : 0
                                        return(
                                            <div
                                                key={index}
                                                className="group relative flex flex-col sm:flex-row gap-5 rounded-3xl bg-white border border-secondary/10 p-4 shadow-md shadow-accent/5 transition duration-300 hover:shadow-xl hover:shadow-accent/15 animate-rise"
                                                style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                                            >
                                                {/* Image */}
                                                <div className="relative shrink-0 w-full sm:w-[130px] h-[180px] sm:h-[130px] rounded-2xl bg-linear-to-br from-primary to-white overflow-hidden">
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
                                                                addToCart(cartItem.product , -1)
                                                                setCart(getCart())
                                                            }
                                                        } aria-label="Decrease quantity" className="w-10 h-10 rounded-full flex justify-center items-center text-xl text-secondary transition hover:bg-accent hover:text-white active:scale-90">
                                                            <BiMinus/>
                                                        </button>
                                                        <span key={cartItem.qty} className="w-12 text-center text-lg font-bold text-secondary tabular-nums animate-rise">
                                                            {cartItem.qty}
                                                        </span>
                                                        <button onClick={
                                                            ()=>{
                                                                addToCart(cartItem.product , 1)
                                                                setCart(getCart())
                                                            }
                                                        } aria-label="Increase quantity" className="w-10 h-10 rounded-full flex justify-center items-center text-xl text-secondary transition hover:bg-accent hover:text-white active:scale-90">
                                                            <BiPlus/>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Line total */}
                                                <div className="sm:w-[150px] flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:text-right">
                                                    <span className="text-sm text-secondary/50 sm:hidden">Total</span>
                                                    <span key={cartItem.qty} className="text-xl font-extrabold text-secondary animate-rise">{getFormattedPrice(cartItem.product.price * cartItem.qty)}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>

                        {/* Summary */}
                        <div className="lg:sticky lg:top-[100px] relative rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20 animate-rise" style={{ animationDelay: "0.15s" }}>
                            <div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />
                            <div className="relative z-10 rounded-[calc(2rem-2px)] bg-white p-7">
                                <h2 className="text-xl font-bold text-secondary">Order summary</h2>

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

                                <div className="my-5 h-px bg-secondary/10" />

                                <div className="flex items-end justify-between">
                                    <span className="text-secondary/60">Total</span>
                                    <span key={getCartTotal(cart)} className="text-3xl font-extrabold text-secondary animate-rise">{getFormattedPrice(getCartTotal(cart))}</span>
                                </div>

                                <Link
                                    state={cart}
                                    to="/checkout"
                                    className="group relative mt-6 w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold text-lg overflow-hidden flex items-center justify-center shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                    <span className="relative flex items-center gap-1">
                                        Checkout
                                        <BiChevronRight size={24} className="transition group-hover:translate-x-1" />
                                    </span>
                                </Link>

                                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-secondary/50">
                                    <BiShieldQuarter size={16} className="text-accent" />
                                    Secure checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}