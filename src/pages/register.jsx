import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [firstName , setFirstName] = useState("")
    const [lastName , setLastName] = useState("")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
	const navigate = useNavigate()


	async function signup(){
        if(password != confirmPassword){
            toast.error("Passwords do not match")
            return
        }
		try{
			const response = await axios.post(import.meta.env.VITE_API_URL + "/users/",
				{
                    firstName : firstName,
                    lastName : lastName,
					email : email,
					password : password
				}
			)
			console.log(response)
			toast.success("Signed up Successfully")
				
			navigate("/login")
			
		}catch(err){
			toast.error(err?.response?.data?.message || "Failed to sign up");
		}
	}

	return (
		<div className="w-full h-full bg-[url('/background.jpg')] bg-cover no-repeat bg-center flex">
			<div className="w-[50%] h-full flex justify-center items-center flex-col">
				<img src="/logo.png" className="w-[300px]" />
				<h1 className="text-4xl font-bold mt-5 text-white">Isuri Computers</h1>
			</div>
			<div className="w-[50%] h-full  flex justify-center items-center">
				<div className="backdrop-blur-3xl w-[450px] h-[600px] shadow-2xl rounded-lg flex flex-col justify-center">
                    <div className="w-full h-[50px] flex items-center justify-between px-5">
                        <input
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            className="w-[48%] p-3 h-[50px] rounded-lg border border-secondary outline-none"
                            type="text"
                            placeholder="First Name"
                        />
                        <input
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            className="w-[48%] p-3 h-[50px] rounded-lg border border-secondary outline-none"
                            type="text"
                            placeholder="Last Name"
                        />
                    </div>
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
                    <input
						type="password"
						placeholder="Password"
						className="m-5 p-3 w-[90%] h-[50px] rounded-lg border border-secondary outline-none"
						onChange={
							(e)=>{
								setConfirmPassword(e.target.value)
							}
						}
					/>

					<button onClick={signup} className="m-5 p-3 w-[90%] h-[50px] bg-accent rounded-lg text-white font-bold">
						Sign up
					</button>
					<button  className="m-5 p-3 w-[90%] h-[50px] border border-accent rounded-lg text-white font-bold">
						Sign up with Google
					</button>
					<p className="w-full  text-right pr-5">
						Already have an account?{" "}
						<Link to="/login" className="text-accent">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
