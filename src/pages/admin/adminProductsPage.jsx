import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductsPage(){
    return(
        <div className="w-full h-full overflow-y-scroll">
            <Link to="/admin/add-product" className="text-white bg-accent w-[50px] h-[50px] flex justify-center items-center text-2xl rounded-[20px] hover:rounded-full fixed bottom-10 right-16">
                <FaPlus />
            </Link>
        </div>
    )
}