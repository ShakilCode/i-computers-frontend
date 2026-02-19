import { Link } from "react-router-dom"
import { useState } from "react"
import getFormattedPrice from "../utils/price-format"

export default function ProductCard(props) {
    const product = props.product
    const [isHovered, setIsHovered] = useState(false)
    
    // Check if second image exists
    const hasSecondImage = product.images && product.images[1]
    const circleImage = hasSecondImage ? product.images[1] : product.images[0]
    
    return (
        <Link 
            to={"/overview/" + product.productId} 
            className="group block w-[320px] h-[440px] m-4 rounded-3xl bg-white overflow-hidden relative shadow-xl hover:shadow-2xl transition-shadow duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Container */}
            <div className="relative w-full h-full">
                
                {/* Animated Circle Background */}
                <div 
                    className={`absolute -right-24 -top-24 rounded-full bg-gradient-to-br from-secondary via-accent to-secondary transition-all duration-700 ease-in-out z-10 ${
                        isHovered 
                            ? 'w-[280px] h-[280px] scale-100 opacity-100' 
                            : 'w-[120px] h-[120px] scale-90 opacity-80'
                    }`}
                />

                {/* Quarter Circle Border */}
                <div 
                    className={`absolute -right-16 -top-16 w-32 h-32 border-4 border-white/40 rounded-full transition-all duration-500 z-20 ${
                        isHovered ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-100'
                    }`}
                />

                {/* Images Container */}
                <div className="relative w-full h-[260px] overflow-visible">
                    
                    {/* First Image */}
                    <div 
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out ${
                            isHovered 
                                ? 'opacity-0 scale-95 blur-sm' 
                                : 'opacity-100 scale-100 blur-0'
                        }`}
                    >
                        <div className="w-full h-full p-4">
                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Circle Image */}
                    <div 
                        className={`absolute transition-all duration-700 ease-in-out overflow-hidden ${
                            isHovered 
                                ? 'top-4 right-4 w-[240px] h-[240px] rounded-full opacity-100 scale-100 rotate-0 z-30 shadow-2xl' 
                                : 'top-0 left-0 w-full h-full rounded-2xl opacity-0 scale-95 -rotate-3 z-0'
                        }`}
                    >
                        <div className="w-full h-full p-3">
                            <img 
                                src={circleImage} 
                                alt={product.name} 
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                    isHovered ? 'rounded-full scale-110' : 'rounded-2xl scale-100'
                                }`}
                            />
                        </div>

                        {/* Glow */}
                        <div 
                            className={`absolute inset-0 rounded-full border-4 border-white transition-opacity duration-500 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </div>
                </div>

                {/* Content Section */}
                {/* FIX: removed overflow-hidden from text parents */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-6 min-h-[170px] flex flex-col justify-end">
                    
                    {/* Product ID FIXED */}
                    <span 
                        className={`text-xs font-medium text-gray-400 uppercase tracking-wider transition-all duration-500 leading-relaxed whitespace-nowrap ${
                            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-80'
                        }`}
                        style={{ transitionDelay: '100ms' }}
                    >
                        {product.productId}
                    </span>
                    
                    {/* Product Name FIXED */}
                    <h1 
                        className={`font-bold text-xl text-gray-800 transition-all duration-500 leading-snug whitespace-nowrap overflow-hidden text-ellipsis ${
                            isHovered ? 'translate-y-0 opacity-100 text-secondary' : 'translate-y-1 opacity-95'
                        }`}
                        style={{ transitionDelay: '150ms' }}
                    >
                        {product.name}
                    </h1>
                    
                    {/* Price Section FIXED */}
                    <div className="flex items-center gap-3 mt-2 min-h-[36px] flex-wrap">
                        
                        {product.labelledPrice > product.price && (
                            <p 
                                className={`text-sm text-red-500 line-through font-medium transition-all duration-500 leading-relaxed whitespace-nowrap ${
                                    isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-80'
                                }`}
                                style={{ transitionDelay: '200ms' }}
                            >
                                {getFormattedPrice(product.labelledPrice)}
                            </p>
                        )}

                        <p 
                            className={`text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent transition-all duration-500 leading-relaxed whitespace-nowrap ${
                                isHovered 
                                    ? 'translate-y-0 opacity-100 scale-105' 
                                    : 'translate-y-1 opacity-95 scale-100'
                            }`}
                            style={{ 
                                transitionDelay: '250ms',
                                transformOrigin: 'left center'
                            }}
                        >
                            {getFormattedPrice(product.price)}
                        </p>
                    </div>

                    {/* View Details */}
                    <div 
                        className={`mt-4 transition-all duration-500 ${
                            isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 w-0 h-0'
                        }`}
                        style={{ transitionDelay: '300ms' }}
                    >
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-300">
                            <span>View Details</span>
                            <svg 
                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2.5} 
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Particles */}
                <div className={`absolute top-20 right-20 w-2 h-2 rounded-full bg-white transition-all duration-700 ${
                    isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`} style={{ transitionDelay: '200ms' }} />

                <div className={`absolute top-32 right-28 w-1.5 h-1.5 rounded-full bg-white transition-all duration-700 ${
                    isHovered ? 'scale-100 opacity-80' : 'scale-0 opacity-0'
                }`} style={{ transitionDelay: '300ms' }} />

                <div className={`absolute top-28 right-16 w-1 h-1 rounded-full bg-white transition-all duration-700 ${
                    isHovered ? 'scale-100 opacity-60' : 'scale-0 opacity-0'
                }`} style={{ transitionDelay: '400ms' }} />

            </div>
        </Link>
    )
}
