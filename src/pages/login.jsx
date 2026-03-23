import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()


	async function login(){
		try{
			const response = await axios.post(import.meta.env.VITE_API_URL + "/users/login",
				{
					email : email,
					password : password
				}
			)
			console.log(response)
			toast.success("Login Successful")

			localStorage.setItem("token" , response.data.token)
			
			if(response.data.role == "admin"){				
				navigate("/admin/")
			}else{
				navigate("/")
			}
		}catch(err){
			toast.error(err?.response?.data?.message || "Failed to login");
		}
	}

	return (
		<div className="w-full h-full bg-[url('/background.jpg')] bg-cover no-repeat bg-center flex">
			<div className="w-[50%]  h-full hidden lg:flex justify-center items-center flex-col">
				<img src="/logo.png" className="w-[300px]" />
				<h1 className="text-4xl font-bold mt-5 text-white">I Computers</h1>
			</div>
			<div className="w-full lg:w-[50%] h-full  flex justify-center items-center">
				<div className="backdrop-blur-3xl w-[450px] h-[600px] shadow-2xl rounded-lg flex flex-col justify-center">
					<img src="/logo.png" className="w-[100px] mx-auto lg:hidden" />
					<h1 className="lg:hidden text-3xl font-semibold mt-5 text-white text-center">I Computers</h1>
					<input
						type="email"
						placeholder="Email"
						onChange={
							(e)=>{
								setEmail(e.target.value)
							}
						}
						className="m-5 p-3 w-[90%] h-[50px] rounded-lg border border-secondary outline-none "
					/>
					<input
						type="password"
						placeholder="Password"
						className="m-5 p-3 w-[90%] h-[50px] rounded-lg border border-secondary outline-none"
						onChange={
							(e)=>{
								setPassword(e.target.value)
							}
						}
					/>
					<p className="w-full text-right pr-5 ">
						Forgot Password?{" "}
						<Link to="/forgot-password" className="text-accent">
							Reset
						</Link>
					</p>
					<button onClick={login} className="m-5 p-3 w-[90%] h-[50px] bg-accent rounded-lg text-white font-bold">
						Login
					</button>
					<button  className="m-5 p-3 w-[90%] h-[50px] border border-accent rounded-lg text-white font-bold">
						Login with Google
					</button>
					<p className="w-full  text-right pr-5">
						Don't have an account?{" "}
						<Link to="/register" className="text-accent">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
