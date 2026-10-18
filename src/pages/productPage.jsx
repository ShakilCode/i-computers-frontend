
import axios from "axios";
import { useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
    BiSearch,
    BiX,
    BiChevronDown,
    BiPackage,
    BiHeart,
    BiSolidHeart,
    BiCheck,
    BiStar,
    BiSortUp,
    BiSortDown,
    BiPurchaseTag,
} from "react-icons/bi";
import LoadingAnimation from "../components/loadingAnimation";

// Product overview page route
const productLink = (p) => "/overview/" + p?.productId;

/* ---------- Helpers ---------- */

const money = (n) => "Rs. " + Number(n || 0).toLocaleString();
const FALLBACK_IMG = "/images/default-product-01.png";

function discountOf(p) {
    const l = Number(p?.labelledPrice);
    const pr = Number(p?.price);

    return l > pr && pr > 0
        ? Math.round(((l - pr) / l) * 100)
        : 0;
}

function savingOf(p) {
    return Math.max(
        0,
        Number(p?.labelledPrice || 0) - Number(p?.price || 0)
    );
}

function imageOf(p) {
    return p?.images?.[0] || p?.image || FALLBACK_IMG;
}

/* ---------- Product Card ---------- */

function ShopCard({ product }) {
    const [liked, setLiked] = useState(false);
    const discount = discountOf(product);
    const saving = savingOf(product);

    return (
        <div className="group w-full flex flex-col rounded-3xl bg-white border border-secondary/10 overflow-hidden shadow-md shadow-accent/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/15">

            {/* Product image */}
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
                    aria-pressed={liked}
                    className={`absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow transition active:scale-90 ${
                        liked
                            ? "text-[#ff4d6d]"
                            : "text-secondary/50 hover:text-[#ff4d6d]"
                    }`}
                >
                    {liked
                        ? <BiSolidHeart size={20} />
                        : <BiHeart size={20} />}
                </button>

                <img
                    src={imageOf(product)}
                    alt={product?.name || "Product"}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                    }}
                    className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Product details */}
            <div className="flex flex-col flex-1 p-5">
                <p className="text-xs font-semibold text-accent truncate">
                    {product?.category || product?.brand || "Computer product"}
                </p>

                <h3 className="mt-2 text-base font-bold leading-6 text-secondary line-clamp-2 min-h-[48px]">
                    {product?.name || "Product name"}
                </h3>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-xl font-extrabold text-secondary">
                        {money(product?.price)}
                    </span>

                    {discount > 0 && (
                        <span className="text-sm text-secondary/40 line-through">
                            {money(product?.labelledPrice)}
                        </span>
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
    );
}

/* ---------- Product Page ---------- */

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [sortOpen, setSortOpen] = useState(false);

    const sortDropdownRef = useRef(null);

    // Sorting options
    const sortOptions = [
        {
            value: "default",
            label: "Featured",
            description: "Our default product selection",
            icon: BiStar,
            accent: "from-violet-500 to-purple-500",
        },
        {
            value: "low",
            label: "Price: Low to high",
            description: "Find products within your budget",
            icon: BiSortUp,
            accent: "from-emerald-400 to-teal-500",
        },
        {
            value: "high",
            label: "Price: High to low",
            description: "Explore premium products first",
            icon: BiSortDown,
            accent: "from-orange-400 to-rose-500",
        },
        {
            value: "discount",
            label: "Biggest discount",
            description: "Discover the best price drops",
            icon: BiPurchaseTag,
            accent: "from-pink-500 to-purple-500",
        },
    ];

    const selectedSort =
        sortOptions.find((option) => option.value === sortBy) ||
        sortOptions[0];

    const SelectedSortIcon = selectedSort.icon;

    // Fetch products
    useEffect(() => {
        if (!loading) return;

        let cancelled = false;
        let url = import.meta.env.VITE_API_URL + "/products/";

        if (searchQuery !== "") {
            url =
                import.meta.env.VITE_API_URL +
                "/products/search/" +
                encodeURIComponent(searchQuery);
        }

        axios
            .get(url)
            .then((response) => {
                if (cancelled) return;

                setProducts(response.data);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;

                toast.error("Failed to fetch products. Please try again.");
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [loading]);

    // Close dropdown on outside click or Escape
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target)
            ) {
                setSortOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setSortOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Category filters
    const categories = useMemo(
        () => [
            "All",
            ...new Set(
                (Array.isArray(products) ? products : [])
                    .map((p) => p?.category)
                    .filter(Boolean)
            ),
        ].slice(0, 10),
        [products]
    );

    const activeCategory = categories.includes(category)
        ? category
        : "All";

    // Filter and sort products
    const shown = useMemo(() => {
        let list = Array.isArray(products) ? [...products] : [];

        if (activeCategory !== "All") {
            list = list.filter(
                (p) => p?.category === activeCategory
            );
        }

        if (sortBy === "low") {
            list.sort(
                (a, b) =>
                    Number(a?.price || 0) - Number(b?.price || 0)
            );
        } else if (sortBy === "high") {
            list.sort(
                (a, b) =>
                    Number(b?.price || 0) - Number(a?.price || 0)
            );
        } else if (sortBy === "discount") {
            list.sort(
                (a, b) => discountOf(b) - discountOf(a)
            );
        }

        return list;
    }, [products, activeCategory, sortBy]);

    function showAll() {
        setSearchQuery("");
        setLoading(true);
    }

    return (
        <div className="relative min-h-screen w-full bg-primary">
            {/* Loading animation */}
            {loading && (
                <div className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none [&>*]:static!">
                    <LoadingAnimation />
                </div>
            )}

            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />

                <div className="absolute top-1/3 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Page title */}
                <div className="pt-10 pb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-secondary">
                        Find your next upgrade
                    </h1>

                    <p className="mt-3 text-base lg:text-lg text-secondary/60">
                        Laptops, components and accessories, all in one place.
                    </p>
                </div>

                {/* Search and custom sorting dropdown */}
                <div className="sticky top-[92px] z-30">
                    <div className="mx-auto max-w-3xl rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-accent/15 p-2 flex items-center gap-2">

                        {/* Search input */}
                        <div className="relative flex-1 min-w-0">
                            <BiSearch
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Search for products..."
                                className="w-full h-12 rounded-full bg-transparent pl-12 pr-12 text-secondary outline-none placeholder:text-secondary/40 transition focus:bg-white focus:ring-4 focus:ring-accent/15"
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setLoading(true);
                                }}
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

                        {/* Custom sorting dropdown */}
                        <div
                            ref={sortDropdownRef}
                            className="relative hidden sm:block shrink-0"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setSortOpen((previous) => !previous)
                                }
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                                className={`group relative flex h-12 items-center gap-3 rounded-full border px-4 transition-all duration-300 ${
                                    sortOpen
                                        ? "border-accent/40 bg-white shadow-lg shadow-accent/10"
                                        : "border-secondary/5 bg-primary/80 hover:border-accent/30 hover:bg-white"
                                }`}
                            >
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br ${selectedSort.accent} text-white shadow-sm`}
                                >
                                    <SelectedSortIcon size={18} />
                                </span>

                                <span className="min-w-0 text-left">
                                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/40">
                                        Sort products
                                    </span>

                                    <span className="block max-w-[145px] truncate text-sm font-bold text-secondary">
                                        {selectedSort.label}
                                    </span>
                                </span>

                                <BiChevronDown
                                    size={20}
                                    className={`text-secondary/50 transition-transform duration-300 ${
                                        sortOpen
                                            ? "rotate-180 text-accent"
                                            : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown panel */}
                            {sortOpen && (
                                <div
                                    role="listbox"
                                    aria-label="Sort products"
                                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-[290px] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/95 p-2.5 shadow-2xl shadow-secondary/15 backdrop-blur-2xl animate-rise"
                                >
                                    <div className="px-3 pb-3 pt-2">
                                        <p className="text-sm font-extrabold tracking-tight text-secondary">
                                            Refine your view
                                        </p>

                                        <p className="mt-1 text-xs text-secondary/50">
                                            Choose how you want to explore.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        {sortOptions.map((option) => {
                                            const OptionIcon = option.icon;
                                            const isSelected =
                                                sortBy === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setSortOpen(false);
                                                    }}
                                                    className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                                                        isSelected
                                                            ? "bg-accent/[0.07] ring-1 ring-accent/15"
                                                            : "hover:bg-primary hover:translate-x-0.5"
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${option.accent} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
                                                    >
                                                        <OptionIcon size={20} />
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span
                                                            className={`block text-sm font-bold ${
                                                                isSelected
                                                                    ? "text-accent"
                                                                    : "text-secondary"
                                                            }`}
                                                        >
                                                            {option.label}
                                                        </span>

                                                        <span className="mt-0.5 block text-[11px] leading-4 text-secondary/50">
                                                            {option.description}
                                                        </span>
                                                    </span>

                                                    <span
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                                                            isSelected
                                                                ? "bg-accent text-white"
                                                                : "border border-secondary/10 text-transparent group-hover:border-accent/30"
                                                        }`}
                                                    >
                                                        <BiCheck size={16} />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mx-2 mt-2 border-t border-secondary/[0.07] px-2 py-3">
                                        <p className="text-center text-[10px] font-medium tracking-wide text-secondary/40">
                                            I COMPUTERS · PRODUCT DISCOVERY
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Categories and result count */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition active:scale-95 ${
                                    activeCategory === c
                                        ? "bg-accent text-white shadow-lg shadow-accent/30"
                                        : "bg-white text-secondary/70 border border-secondary/10 hover:border-accent hover:text-accent"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-secondary/60 shrink-0">
                        {loading
                            ? "Loading..."
                            : `${shown.length} ${
                                  shown.length === 1
                                      ? "product"
                                      : "products"
                              }`}

                        {searchQuery !== "" && !loading && (
                            <>
                                {" "}for "
                                <span className="font-semibold text-secondary">
                                    {searchQuery}
                                </span>
                                "
                            </>
                        )}
                    </p>
                </div>

                {/* Product grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shown.map((item) => (
                        <ShopCard
                            product={item}
                            key={item.productId}
                        />
                    ))}
                </div>

                {/* Empty state */}
                {!loading && shown.length === 0 && (
                    <div className="mt-10 mx-auto max-w-md rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-10 text-center">
                        <div className="mx-auto w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30">
                            <BiPackage size={32} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-secondary">
                            No products found
                        </h2>

                        <p className="mt-2 text-secondary/60">
                            Try a different word or look at everything we have.
                        </p>

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
    );
}
