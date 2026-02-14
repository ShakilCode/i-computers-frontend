import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header className="w-full sticky top-0 bg-accent h-[100px] flex justify-center items-center ">
			<div className="h-full  flex justify-center items-center absolute left-10">
				<img src="/logo.png" alt="Logo" className="h-[50px]" />
				<h1 className="text-white text-2xl font-bold ml-2">I Computers</h1>
			</div>
            <div className=" h-full  flex justify-center items-center">
                <Link to="/" className="text-white mx-4 hover:border-b-2">Home</Link>
                <Link to="/products" className="text-white mx-4 hover:border-b-2">Products</Link>
                <Link to="/about" className="text-white mx-4 hover:border-b-2">About</Link>
                <Link to="/contact" className="text-white mx-4 hover:border-b-2">Contact</Link>                
            </div>
		</header>
	);
}
