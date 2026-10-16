import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const [firstName , setFirstName] = useState("")
    const [lastName , setLastName] = useState("")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false); // UI only
	const glowRef = useRef(null); // UI only (cursor glow)
	const navigate = useNavigate()
	const googleLogin = useGoogleLogin(
		{
			onSuccess: (response)=>{
				axios.post(import.meta.env.VITE_API_URL + "/users/google-login" , {token : response.access_token}).then(
					(response)=>{
						toast.success("Login Successful")
						localStorage.setItem("token" , response.data.token)
						if(response.data.role == "admin"){
							navigate("/admin/")
						}else{
							navigate("/")
						}
					}
				).catch(
					(err)=>{
						toast.error(err?.response?.data?.message || "Google login failed. Please try again.")
					}
				)
			},
			onError: ()=>{
				toast.error("Google login failed. Please try again.")
			}
		}
	)

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

	// UI only: soft glow that follows the cursor
	function moveGlow(e){
		if(glowRef.current){
			glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`
		}
	}

	const words = ["orders", "wishlist", "warranty", "deals"];

	const inputClass =
		"peer w-full h-14 rounded-2xl bg-white/70 border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15";
	const labelClass =
		"pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent";

	const eyeIcon = showPassword ? (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7a11 11 0 01-3.2 4.5M6.1 6.1C4 7.6 2.6 9.8 2 12c1 3 5 7 10 7 1.5 0 2.9-.3 4.1-.9" />
		</svg>
	) : (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7S3 15 2 12z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);

	return (
		<div
			onMouseMove={moveGlow}
			className="relative w-full min-h-screen overflow-hidden bg-primary flex"
		>
			{/* Aurora background */}
			<div className="pointer-events-none absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-accent/35 blur-3xl animate-blob" />
			<div className="pointer-events-none absolute top-1/4 -left-48 w-[520px] h-[520px] rounded-full bg-accent-2/30 blur-3xl animate-blob [animation-delay:-7s]" />
			<div className="pointer-events-none absolute -bottom-48 right-1/3 w-[500px] h-[500px] rounded-full bg-[#ff8fd8]/25 blur-3xl animate-blob [animation-delay:-14s]" />

			{/* Subtle dot grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.35]"
				style={{
					backgroundImage: "radial-gradient(rgba(31,27,58,0.12) 1px, transparent 1px)",
					backgroundSize: "28px 28px",
					maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
					WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
				}}
			/>

			{/* Cursor glow */}
			<div
				ref={glowRef}
				className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/20 blur-3xl transition-transform duration-300 ease-out hidden lg:block"
			/>

			{/* Left: form side (mirrored from login) */}
			<div className="relative w-full lg:w-1/2 min-h-screen flex justify-center items-center p-5 order-2 lg:order-1">
				<div className="relative w-full max-w-[480px] rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20 animate-rise">
					<div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />

					<div className="relative rounded-[calc(2rem-2px)] bg-white/85 backdrop-blur-2xl p-8 sm:p-10 flex flex-col">
						<div className="animate-rise" style={{ animationDelay: "0.1s" }}>
							<h2 className="text-3xl font-bold text-secondary tracking-tight">Create account</h2>
							<p className="mt-1 text-secondary/60">It only takes a minute.</p>
						</div>

						<div className="mt-7 flex gap-3 animate-rise" style={{ animationDelay: "0.2s" }}>
							<div className="relative w-1/2">
								<input
									id="firstName"
									value={firstName}
									onChange={(e) => {
										setFirstName(e.target.value);
									}}
									className={inputClass}
									type="text"
									placeholder=" "
								/>
								<label htmlFor="firstName" className={labelClass}>First name</label>
							</div>
							<div className="relative w-1/2">
								<input
									id="lastName"
									value={lastName}
									onChange={(e) => {
										setLastName(e.target.value);
									}}
									className={inputClass}
									type="text"
									placeholder=" "
								/>
								<label htmlFor="lastName" className={labelClass}>Last name</label>
							</div>
						</div>

						<div className="relative mt-4 animate-rise" style={{ animationDelay: "0.27s" }}>
							<input
								id="email"
								type="email"
								placeholder=" "
								onChange={
									(e)=>{
										setEmail(e.target.value)
									}
								}
								className={inputClass}
							/>
							<label htmlFor="email" className={labelClass}>Email</label>
						</div>

						<div className="relative mt-4 animate-rise" style={{ animationDelay: "0.34s" }}>
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder=" "
								className={inputClass + " pr-14"}
								onChange={
									(e)=>{
										setPassword(e.target.value)
									}
								}
							/>
							<label htmlFor="password" className={labelClass}>Password</label>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide passwords" : "Show passwords"}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-accent transition"
							>
								{eyeIcon}
							</button>
						</div>

						<div className="relative mt-4 animate-rise" style={{ animationDelay: "0.41s" }}>
							<input
								id="confirmPassword"
								type={showPassword ? "text" : "password"}
								placeholder=" "
								className={inputClass}
								onChange={
									(e)=>{
										setConfirmPassword(e.target.value)
									}
								}
							/>
							<label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
						</div>

						<button
							onClick={signup}
							className="group relative mt-6 w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 animate-rise"
							style={{ animationDelay: "0.48s" }}
						>
							<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
							<span className="relative">Sign up</span>
						</button>

						<div className="flex items-center gap-3 my-5 text-xs text-secondary/40 animate-rise" style={{ animationDelay: "0.53s" }}>
							<span className="flex-1 h-px bg-secondary/10" />
							or
							<span className="flex-1 h-px bg-secondary/10" />
						</div>

						<button
							onClick={googleLogin}
							className="w-full h-14 rounded-full bg-white border border-secondary/10 text-secondary font-semibold flex items-center justify-center gap-3 transition hover:border-accent hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 animate-rise"
							style={{ animationDelay: "0.58s" }}
						>
							<svg className="w-5 h-5" viewBox="0 0 48 48">
								<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
								<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
								<path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z" />
								<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
							</svg>
							Sign up with Google
						</button>

						<p className="w-full text-center mt-6 text-sm text-secondary/60 animate-rise" style={{ animationDelay: "0.63s" }}>
							Already have an account?{" "}
							<Link to="/login" className="text-accent font-semibold hover:underline">
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right: headline side */}
			<div className="relative w-1/2 hidden lg:flex justify-center items-center order-1 lg:order-2">
				<div className="relative max-w-[520px] px-10">
					<span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white px-4 py-1.5 text-sm font-medium text-secondary shadow-lg shadow-accent/10 animate-rise">
						<span className="relative flex w-2.5 h-2.5">
							<span className="absolute inline-flex w-full h-full rounded-full bg-accent-2 opacity-75 animate-ping" />
							<span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent-2" />
						</span>
						I Computers
					</span>

					<h1 className="mt-6 text-6xl font-bold leading-[1.1] tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.1s" }}>
						One account for your
						<span className="block h-[1.2em] overflow-hidden">
							<span className="flex flex-col animate-words">
								{[...words, words[0]].map((w, i) => (
									<span
										key={i}
										className="h-[1.2em] bg-linear-to-r from-accent via-[#b06cff] to-accent-2 bg-clip-text text-transparent animate-gradient [background-size:200%_100%]"
									>
										{w}
									</span>
								))}
							</span>
						</span>
					</h1>

					<p className="mt-5 text-lg text-secondary/60 animate-rise" style={{ animationDelay: "0.2s" }}>
						Sign up to track purchases, save products and check out faster.
					</p>

					{/* Floating glass cards */}
					<div className="relative mt-12 h-[170px]">
						<div className="absolute left-0 top-0 animate-float">
							<div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white px-5 py-4 shadow-xl shadow-accent/10">
								<p className="text-xs text-secondary/50">Your account</p>
								<p className="mt-1 font-semibold text-secondary flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse-soft" />
									Ready in a minute
								</p>
							</div>
						</div>
						<div className="absolute left-[190px] top-12 animate-float-slow" style={{ animationDelay: "1s" }}>
							<div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white px-5 py-4 shadow-xl shadow-accent/10">
								<p className="text-xs text-secondary/50">Checkout</p>
								<p className="mt-1 font-semibold text-secondary">Saved details, faster</p>
							</div>
						</div>
						<div className="absolute left-[40px] top-[96px] animate-float" style={{ animationDelay: "2s" }}>
							<div className="rounded-2xl bg-accent text-white px-5 py-3 shadow-xl shadow-accent/30 font-medium">
								Free to join
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}