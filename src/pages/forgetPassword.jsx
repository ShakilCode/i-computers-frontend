import axios from "axios"
import { useState, useRef } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

export default function ForgetPassword(){

    const [email , setEmail] = useState("")
    const [otpSent , setOtpSent] = useState(false)
    const [otp , setOtp] = useState("")
    const [newPassword , setNewPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    const [showPassword , setShowPassword] = useState(false) // UI only
    const glowRef = useRef(null) // UI only (cursor glow)
    const navigate = useNavigate()

    async function sendOtp(){
        setOtpSent(true)
        try{

            await axios.post(import.meta.env.VITE_API_URL + "/users/send-otp" , {email : email})
            toast.success("OTP sent to your email. Please check your inbox.")

        }catch(err){
            toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.")
            setOtpSent(false)
        }
        
    }

    async function resetPassword(){
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match. Please try again.")
            return
        }

        try{

            await axios.post(import.meta.env.VITE_API_URL + "/users/verify-otp" , {email : email , otp : otp , newPassword : newPassword})

            toast.success("Password reset successful. You can now log in with your new password.")
            navigate("/login")
        }catch(err){
            toast.error(err?.response?.data?.message || "Failed to reset password. Please try again.")
        }
    }

    // UI only: soft glow that follows the cursor
    function moveGlow(e){
        if(glowRef.current){
            glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`
        }
    }

    const inputClass =
        "peer w-full h-14 rounded-2xl bg-white/70 border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15"
    const labelClass =
        "pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent"
    const buttonClass =
        "group relative mt-6 w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 animate-rise"

    return(
        <div
            onMouseMove={moveGlow}
            className="relative flex justify-center items-center w-full min-h-screen overflow-hidden bg-primary p-5"
        >
            {/* Aurora background */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-accent/35 blur-3xl animate-blob" />
            <div className="pointer-events-none absolute top-1/4 -right-48 w-[520px] h-[520px] rounded-full bg-accent-2/30 blur-3xl animate-blob [animation-delay:-7s]" />
            <div className="pointer-events-none absolute -bottom-48 left-1/3 w-[500px] h-[500px] rounded-full bg-[#ff8fd8]/25 blur-3xl animate-blob [animation-delay:-14s]" />

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

            {!otpSent&&<div key="step-email" className="relative w-full max-w-[440px] rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20 animate-rise">
                <div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />

                <div className="relative rounded-[calc(2rem-2px)] bg-white/85 backdrop-blur-2xl p-8 sm:p-10 flex flex-col">
                    {/* Floating mail icon */}
                    <div className="relative self-center animate-float">
                        <div className="absolute inset-0 rounded-3xl bg-accent/30 blur-xl animate-pulse-soft" />
                        <div className="relative w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-[#b06cff] flex items-center justify-center shadow-lg shadow-accent/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="flex justify-center gap-2 mt-6 animate-rise" style={{ animationDelay: "0.1s" }}>
                        <span className="h-1.5 w-8 rounded-full bg-accent" />
                        <span className="h-1.5 w-8 rounded-full bg-secondary/10" />
                    </div>

                    <div className="text-center mt-5 animate-rise" style={{ animationDelay: "0.15s" }}>
                        <h1 className="text-3xl font-bold text-secondary tracking-tight">Forgot password?</h1>
                        <p className="mt-1 text-secondary/60">Enter your email and we'll send you a code.</p>
                    </div>

                    <div className="relative mt-8 animate-rise" style={{ animationDelay: "0.25s" }}>
                        <input
                            id="email"
                            type="email"
                            placeholder=" "
                            className={inputClass}
                            onChange={
                                (e)=>{
                                    setEmail(e.target.value)
                                }
                            }
                        />
                        <label htmlFor="email" className={labelClass}>Email</label>
                    </div>

                    <button onClick={sendOtp} className={buttonClass} style={{ animationDelay: "0.35s" }}>
                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">Send OTP</span>
                    </button>

                    <p className="w-full text-center mt-6 text-sm text-secondary/60 animate-rise" style={{ animationDelay: "0.45s" }}>
                        Remembered it?{" "}
                        <Link to="/login" className="text-accent font-semibold hover:underline">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>}

            {
                otpSent&&
                <div key="step-reset" className="relative w-full max-w-[440px] rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20 animate-rise">
                    <div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />

                    <div className="relative rounded-[calc(2rem-2px)] bg-white/85 backdrop-blur-2xl p-8 sm:p-10 flex flex-col">
                        {/* Floating lock icon */}
                        <div className="relative self-center animate-float">
                            <div className="absolute inset-0 rounded-3xl bg-accent-2/40 blur-xl animate-pulse-soft" />
                            <div className="relative w-16 h-16 rounded-3xl bg-linear-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg shadow-accent/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z" />
                                </svg>
                            </div>
                        </div>

                        {/* Step indicator */}
                        <div className="flex justify-center gap-2 mt-6 animate-rise" style={{ animationDelay: "0.1s" }}>
                            <span className="h-1.5 w-8 rounded-full bg-accent-2" />
                            <span className="h-1.5 w-8 rounded-full bg-accent" />
                        </div>

                        <div className="text-center mt-5 animate-rise" style={{ animationDelay: "0.15s" }}>
                            <h1 className="text-3xl font-bold text-secondary tracking-tight">Reset password</h1>
                            <p className="mt-1 text-secondary/60">Enter the code from your email and choose a new password.</p>
                        </div>

                        <div className="relative mt-8 animate-rise" style={{ animationDelay: "0.22s" }}>
                            <input
                                id="otp"
                                type="text"
                                placeholder=" "
                                inputMode="numeric"
                                className={inputClass + " tracking-[0.3em]"}
                                onChange={
                                    (e)=>{
                                        setOtp(e.target.value)
                                    }
                                }
                            />
                            <label htmlFor="otp" className={labelClass}>OTP code</label>
                        </div>

                        <div className="relative mt-4 animate-rise" style={{ animationDelay: "0.29s" }}>
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                className={inputClass + " pr-14"}
                                onChange={
                                    (e)=>{
                                        setNewPassword(e.target.value)
                                    }
                                }
                            />
                            <label htmlFor="newPassword" className={labelClass}>New password</label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-accent transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7a11 11 0 01-3.2 4.5M6.1 6.1C4 7.6 2.6 9.8 2 12c1 3 5 7 10 7 1.5 0 2.9-.3 4.1-.9" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7S3 15 2 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="relative mt-4 animate-rise" style={{ animationDelay: "0.36s" }}>
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
                            <label htmlFor="confirmPassword" className={labelClass}>Confirm new password</label>
                        </div>

                        <button onClick={resetPassword} className={buttonClass} style={{ animationDelay: "0.45s" }}>
                            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative">Reset password</span>
                        </button>

                        <p className="w-full text-center mt-6 text-sm text-secondary/60 animate-rise" style={{ animationDelay: "0.5s" }}>
                            <Link to="/login" className="text-accent font-semibold hover:underline">
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            }

        </div>
    )
}