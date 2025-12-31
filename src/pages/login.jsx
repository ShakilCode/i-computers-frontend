import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from "react-hot-toast";

export default function LoginPage(){
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
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
			if(response.data.role == "admin"){
				navigate("/admin/")
			}else{
				// redirect to the home page
			}
			toast.success("Login Successful")
		}catch(error){
			console.log(error)
			toast.error("Login Failed")
		}
	}

    return(
        <div className="w-full h-full bg-[url('login-bg.png')] bg-cover bg-center bg-no-repeat flex">

            <div className="pb-60 w-[50%] h-full flex justify-center items-center flex-col">

                <div className="border-4 border-secondary ml-125 mt-25 ml-8 bg-ac pb-1 backdrop-blur-md  w-[250px] h-[250px] shadow-accent rounded-full shadow-2xl flex flex-col justify-center items-center">
                    <img src="/logo.png" className="w-[200px]"/>
                </div>

            </div>

            <div className="w-[50%] h-full flex justify-center items-center">

                <div className="backdrop-blur-xl w-[450px] h-[600px] shadow-2xl rounded-lg flex flex-col justify-center">
                    <input
						type="email"
						placeholder="Email"
						onChange={
							(e)=>{
								setEmail(e.target.value)
							}
						}
						className="m-5 p-3 w-[90%] h-[50px] rounded-lg border border-secondary outline-none"
					/>
                    <input
						type="password"
						placeholder="Password"
						onChange={
							(e)=>{
								setPassword(e.target.value)
							}
						}
						className="m-5 p-3 w-[90%] h-[50px] rounded-lg border border-secondary outline-none"
					/>
					<p className="w-full text-right pr-6 ">
						Forgot Password?{" "}
						<Link to="/forgot-password" className="text-accent">
							Reset
						</Link>
					</p>
					<button onClick={login} className="m-5 p-3 w-[90%] h-[50px] bg-accent rounded-lg text-white font-bold">
						Login
					</button>
					<button className="m-5 p-3 w-[90%] h-[50px] border border-accent rounded-lg text-white font-bold">
						Login with Google
					</button>
					<p className="w-full text-right pr-6">
						Don't have an account?{" "}
						<Link to="/register" className="text-accent">
							Register
						</Link>
					</p>
                </div>

            </div>
        </div>
    )
}