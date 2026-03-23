import { BiShoppingBag } from "react-icons/bi";
import { Link } from "react-router-dom";
import UserData from "./userData";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuPanelLeftClose } from "react-icons/lu";

export default function Header() {

	const [isOpen , setIsOpen] = useState(false)

	return (
		<header className="w-full sticky top-0 bg-accent h-[100px] z-1 flex justify-center items-center ">
			
			<div className="h-full w-full lg:w-auto flex justify-center items-center absolute lg:left-10 ">
				<GiHamburgerMenu onClick={()=>{setIsOpen(true)}} size={30} color="white" className="mr-8 lg:hidden cursor-pointer"/>
				<img src="/logo.png" alt="Logo" className="h-[30px] lg:h-[50px]" />
				<h1 className="text-white text-md lg:text-2xl font-bold ml-2">I Computers</h1>
			</div>
            <div className=" h-full  lg:flex justify-center items-center hidden">
                <Link to="/" className="text-white mx-4 hover:border-b-2">Home</Link>
                <Link to="/products" className="text-white mx-4 hover:border-b-2">Products</Link>
                <Link to="/about" className="text-white mx-4 hover:border-b-2">About</Link>
                <Link to="/contact" className="text-white mx-4 hover:border-b-2">Contact</Link>                
            </div>
			<div className=" absolute right-10 hidden lg:flex h-full justify-center items-center gap-5">
				<Link to="/cart" className=" cursor-pointer"><BiShoppingBag size={30} color="white" /></Link>
				<UserData/>
			</div>

			{isOpen&&<div className="fixed bg-black/50 w-full h-screen top-0 left-0">
				<div className="w-[300px]  h-full bg-white">
					<div className="h-[100px] bg-accent w-full flex justify-start items-center px-5">
						<img src="/logo.png" alt="Logo" className="h-[30px] lg:h-[50px]" />
						<h1 className="text-white text-md lg:text-2xl font-bold ml-2">I Computers</h1>
						<LuPanelLeftClose onClick={()=>{setIsOpen(false)}} size={30} color="white" className="ml-auto cursor-pointer"/>
					</div>
					<div className="flex flex-col mt-5">
						<a href="/" className="text-secondary text-lg font-semibold py-3 px-5 hover:bg-secondary/10">Home</a>
						<a href="/products" className="text-secondary text-lg font-semibold py-3 px-5 hover:bg-secondary/10">Products</a>
						<a href="/about" className="text-secondary text-lg font-semibold py-3 px-5 hover:bg-secondary/10">About</a>
						<a href="/contact" className="text-secondary text-lg font-semibold py-3 px-5 hover:bg-secondary/10">Contact</a>
						<a href="/cart" className="text-secondary text-lg font-semibold py-3 px-5 hover:bg-secondary/10">Cart</a>
						<div className="border-t border-secondary/20 my-5 bg-accent absolute bottom-0 w-[300px]">
							<UserData/>
						</div>

						
					</div>
				</div>
			</div>}

		</header>
	);
}
