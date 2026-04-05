import axios from "axios";
import { useEffect, useState } from "react";
import { BiDownArrow } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function UserData(){
    const [user , setUser] = useState(null)
    const [state , setState] = useState("me")
    useEffect(
        ()=>{
            const token = localStorage.getItem("token")
            if(token != null){
                axios.get(import.meta.env.VITE_API_URL+"/users/profile" ,{
                    headers : {
                        "Authorization" : `Bearer ${token}`
                    }
                }).then(
                    (response)=>{
                        console.log(response.data)
                        setUser(response.data)
                    }
                ).catch(
                    ()=>{
                        localStorage.removeItem("token")
                        window.location.href="/login"
                    }
                )
            }
            
        },[]
    )
    return(
        <>
            {user==null?<div className="w-[150px] h-[50px] flex justify-center items-center">
                <Link to="/login" className="text-white hover:border-b-2 mr-1">Login</Link>
                |
                <Link to="/register" className="text-white hover:border-b-2 ml-1">Register</Link>
            </div>
            :<div className="w-[150px] h-[50px] border border-white flex justify-between items-center rounded-full overflow-hidden ">
               
                <img referrerPolicy="no-referrer" src={user.image} className="w-[50px] h-[50px] object-cover"/>
                                        
                <select value={state} onChange={
                    (e)=>{
                        setState(e.target.value)
                        if(e.target.value=="orders"){
                            window.location.href="/my-orders"
                        }
                        if(e.target.value=="settings"){
                            window.location.href="/settings"
                        }
                        if(e.target.value=="logout"){
                            localStorage.removeItem("token")
                            window.location.href="/login"
                        }
                        setState("me")                        
                    }
                } className="bg-transparent text-white">
                          <option value="me" className="bg-accent p-2">{user.firstName}</option>
                          <option value="orders" className="bg-accent p-2">My orders</option>
                          <option value="settings" className="bg-accent p-2">Settings</option>
                          <option value="logout" className="bg-accent p-2">Logout</option>
                </select>
            </div>
            }
        </>
    )
}