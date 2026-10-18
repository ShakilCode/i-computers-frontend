import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { BiChevronLeft, BiShieldQuarter } from "react-icons/bi";
import AdminProductsPage from "./admin/adminProductsPage";
import AdminAddProductPage from "./admin/adminAddProductPage";
import AdminUpdateProductPage from "./admin/adminUpdateProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";

export default function AdminPage() {
    const { pathname } = useLocation();

    // Design only: which menu item is highlighted
    const items = [
        {
            to: "/admin",
            label: "Orders",
            icon: <FaRegListAlt />,
            active: pathname === "/admin" || pathname === "/admin/",
        },
        {
            to: "/admin/products",
            label: "Products",
            icon: <MdOutlineInventory2 />,
            active:
                pathname.startsWith("/admin/products") ||
                pathname.startsWith("/admin/add-product") ||
                pathname.startsWith("/admin/update-product"),
        },
        {
            to: "/admin/users",
            label: "Users",
            icon: <LuUsersRound />,
            active: pathname.startsWith("/admin/users"),
        },
    ];

    return (
        <div className="relative w-full h-dvh flex flex-col lg:flex-row gap-3 p-3 overflow-hidden bg-linear-to-br from-accent/15 via-primary to-accent-2/10">

            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-accent/30 blur-3xl animate-blob" />
                <div className="absolute -bottom-32 left-1/3 w-[420px] h-[420px] rounded-full bg-[#ff8fd8]/20 blur-3xl animate-blob [animation-delay:-10s]" />
            </div>

            {/* Sidebar (desktop) */}
            <aside className="relative z-10 hidden lg:flex w-[270px] h-full min-h-0 shrink-0 flex-col rounded-[2rem] bg-white/75 backdrop-blur-xl border border-white shadow-2xl shadow-accent/15 p-4 overflow-hidden animate-rise">

                {/* Brand */}
                <div className="flex items-center gap-3 px-2 py-3 shrink-0">
                    <span className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30">
                        <span className="absolute inset-0 rounded-2xl bg-accent/40 blur-md animate-pulse-soft" />
                        <BiShieldQuarter size={26} className="relative" />
                    </span>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-secondary leading-tight">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-secondary/50">
                            I Computers
                        </p>
                    </div>
                </div>

                <div className="my-3 h-px bg-secondary/10 shrink-0" />

                {/* Menu */}
                <nav className="flex flex-col gap-2 shrink-0">
                    {items.map((item, i) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-lg font-semibold transition-all duration-300 animate-rise ${
                                item.active
                                    ? "bg-linear-to-r from-accent to-[#8b7cf6] text-white shadow-lg shadow-accent/30"
                                    : "text-secondary/70 hover:bg-accent/10 hover:text-accent hover:translate-x-1"
                            }`}
                        >
                            <span
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                                    item.active
                                        ? "bg-white/20"
                                        : "bg-primary group-hover:bg-white"
                                }`}
                            >
                                {item.icon}
                            </span>

                            {item.label}

                            {item.active && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-accent-2 animate-pulse-soft" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Back to store - always visible at the bottom */}
                <div className="mt-auto pt-4 shrink-0">
                    <Link
                        to="/"
                        className="group flex items-center justify-center gap-1 h-12 rounded-full bg-primary text-secondary/70 font-semibold transition hover:bg-accent/10 hover:text-accent"
                    >
                        <BiChevronLeft
                            size={22}
                            className="transition group-hover:-translate-x-1"
                        />
                        Back to store
                    </Link>
                </div>
            </aside>

            {/* Top menu (phones and tablets) */}
            <nav className="relative z-10 lg:hidden flex shrink-0 items-center gap-2 overflow-x-auto rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-lg shadow-accent/10 p-2 animate-rise">
                {items.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`shrink-0 flex items-center gap-2 h-11 px-5 rounded-full font-semibold transition ${
                            item.active
                                ? "bg-linear-to-r from-accent to-[#8b7cf6] text-white shadow-md shadow-accent/30"
                                : "text-secondary/70 hover:bg-accent/10 hover:text-accent"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                <Link
                    to="/"
                    className="shrink-0 ml-auto flex items-center h-11 px-4 rounded-full text-sm font-semibold text-secondary/60 hover:text-accent"
                >
                    Store
                </Link>
            </nav>

            {/* Page content - fixed within the admin viewport */}
            <div
                className="relative z-10 flex-1 min-w-0 min-h-0 h-full rounded-[2rem] bg-primary border border-white shadow-2xl shadow-accent/15 overflow-hidden animate-rise"
                style={{
                    animationDelay: "0.1s",
                    animationFillMode: "backwards",
                }}
            >
                <div className="w-full h-full min-h-0 overflow-hidden p-2">
                    <Routes>
                        <Route path="/" element={<AdminOrdersPage />} />
                        <Route path="/products" element={<AdminProductsPage />} />
                        <Route path="/users" element={<AdminUsersPage />} />
                        <Route path="/add-product" element={<AdminAddProductPage />} />
                        <Route path="/update-product" element={<AdminUpdateProductPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}