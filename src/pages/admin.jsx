import { Link, Route, Routes } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import AdminProductsPage from "./admin/adminProductsPage";
import AdminAddProductPage from "./admin/adminAddProductPage";

export default function AdminPage(){
    return(
        <div className="w-full h-full border-4 flex bg-accent ">
            <div className="w-[300px] h-full flex flex-col bg-accent text-white text-xl">
                <h1 className="text-3xl font-bold p-5 border-b-4 border-white">Admin Panel</h1>
                <Link className="flex w-full p-[10px] gap-3 items-center hover:bg-white hover:text-accent transition-colors duration-300" to="/admin"> <FaRegListAlt /> Orders</Link>
                <Link className="flex w-full p-[10px] gap-3 items-center hover:bg-white hover:text-accent transition-colors duration-300" to="/admin/products"> <MdOutlineInventory2 /> Products</Link>
                <Link className="flex w-full p-[10px] gap-3 items-center hover:bg-white hover:text-accent transition-colors duration-300" to="/admin/users"> <LuUsersRound /> Users</Link>
            </div>
            <div className="w-[calc(100%-300px)]  h-full border-4 border-accent rounded-[20px] bg-primary p-4">
                <Routes>
                    <Route path="/" element={<h1>Orders Page</h1>} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<h1>Customers Page</h1>} />
                    <Route path="/add-product" element={<AdminAddProductPage />}></Route>
                </Routes>
            </div>
        </div>
    )
}