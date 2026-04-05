import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function ForgetPassword(){

    const [email , setEmail] = useState("")
    const [otpSent , setOtpSent] = useState(false)
    const [otp , setOtp] = useState("")
    const [newPassword , setNewPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
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

    return(
        <div className="flex justify-center items-center h-screen bg-primary">
            {!otpSent&&<div className="w-[400px] h-[300px] backdrop-blur-3xl rounded-lg shadow-2xl flex flex-col justify-center items-center">
                <h1 className="text-2xl font-semibold mb-5">Forgot Password</h1>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-[80%] p-3 rounded-lg border border-secondary outline-none mb-5"
                    onChange={
                        (e)=>{
                            setEmail(e.target.value)
                        }
                    }
                />
                <button onClick={sendOtp} className="w-[80%] p-3 bg-accent hover:bg-accent/70 rounded-lg text-white font-bold">
                    Send OTP
                </button>
            </div>}

            {
                otpSent&&
                <div className="w-[400px] h-[500px] backdrop-blur-3xl rounded-lg shadow-2xl flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-semibold mb-5">Reset Password</h1>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-[80%] p-3 rounded-lg border border-secondary outline-none mb-5"
                        onChange={
                            (e)=>{
                                setOtp(e.target.value)
                            }
                        }
                    />
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-[80%] p-3 rounded-lg border border-secondary outline-none mb-5"
                        onChange={
                            (e)=>{
                                setNewPassword(e.target.value)
                            }
                        }
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-[80%] p-3 rounded-lg border border-secondary outline-none mb-5"
                        onChange={
                            (e)=>{
                                setConfirmPassword(e.target.value)
                            }
                        }
                    />
                    <button onClick={resetPassword} className="w-[80%] p-3 bg-accent hover:bg-accent/70 rounded-lg text-white font-bold">Reset Password</button>
                </div>
            }

        </div>
    )
}