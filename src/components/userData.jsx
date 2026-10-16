import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiChevronDown, BiPackage, BiCog, BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function UserData(){
    const [user , setUser] = useState(null)
    const [open , setOpen] = useState(false) // UI only
    const [dropUp , setDropUp] = useState(false) // UI only
    const boxRef = useRef(null) // UI only

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

    // UI only: close the menu on outside click or Escape
    useEffect(()=>{
        const onClick = (e)=>{
            if(boxRef.current && !boxRef.current.contains(e.target)){
                setOpen(false)
            }
        }
        const onKey = (e)=>{
            if(e.key === "Escape"){
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        document.addEventListener("keydown", onKey)
        return ()=>{
            document.removeEventListener("mousedown", onClick)
            document.removeEventListener("keydown", onKey)
        }
    },[])

    // UI only: open upward when the button sits in the lower half of the screen (mobile drawer)
    function toggleMenu(){
        if(!open && boxRef.current){
            const rect = boxRef.current.getBoundingClientRect()
            setDropUp(rect.bottom > window.innerHeight / 2)
        }
        setOpen(!open)
    }

    // same actions as before, just triggered from buttons instead of a <select>
    function handleAction(action){
        setOpen(false)
        if(action=="orders"){
            window.location.href="/my-orders"
        }
        if(action=="settings"){
            window.location.href="/settings"
        }
        if(action=="logout"){
            localStorage.removeItem("token")
            window.location.href="/login"
        }
    }

    const items = [
        { key: "orders", label: "My orders", icon: <BiPackage size={20} />, danger: false },
        { key: "settings", label: "Settings", icon: <BiCog size={20} />, danger: false },
        { key: "logout", label: "Logout", icon: <BiLogOut size={20} />, danger: true },
    ]

    return(
        <>
            {user==null?<div className="h-[44px] flex justify-center items-center gap-2">
                <Link to="/login" className="px-4 h-9 flex items-center rounded-full text-white font-semibold transition hover:bg-white/20 active:scale-95">Login</Link>
                <Link to="/register" className="px-5 h-9 flex items-center rounded-full bg-white text-accent font-semibold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">Register</Link>
            </div>
            :<div ref={boxRef} className="relative">
                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    className="flex items-center gap-2 h-[44px] pl-1 pr-3 rounded-full text-white transition hover:bg-white/15 active:scale-95"
                >
                    {user.image ? (
                        <img referrerPolicy="no-referrer" src={user.image} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/70" />
                    ) : (
                        <span className="w-9 h-9 rounded-full bg-white/25 ring-2 ring-white/70 flex items-center justify-center font-bold">
                            {String(user.firstName || "?").charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="font-semibold max-w-[90px] truncate">{user.firstName}</span>
                    <BiChevronDown size={20} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown (always mounted so it can animate) */}
                <div
                    role="menu"
                    className={`absolute z-50 w-60 rounded-3xl bg-white border border-secondary/10 shadow-2xl shadow-accent/25 p-2 transition-all duration-200 ${dropUp ? "bottom-full mb-3 left-0 origin-bottom-left" : "top-full mt-3 right-0 origin-top-right"} ${open ? "opacity-100 scale-100 translate-y-0" : `opacity-0 scale-95 pointer-events-none ${dropUp ? "translate-y-2" : "-translate-y-2"}`}`}
                >
                    <div className="px-4 py-3 mb-1 rounded-2xl bg-primary">
                        <p className="font-bold text-secondary truncate">{user.firstName} {user.lastName}</p>
                        {user.email && <p className="text-xs text-secondary/60 truncate">{user.email}</p>}
                    </div>

                    {items.map((item, i)=>(
                        <button
                            key={item.key}
                            type="button"
                            role="menuitem"
                            onClick={()=>{handleAction(item.key)}}
                            style={{ transitionDelay: open ? `${i * 50 + 60}ms` : "0ms" }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left font-semibold transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"} ${item.danger ? "text-[#ff4d6d] hover:bg-[#ff4d6d]/10" : "text-secondary hover:bg-accent/10 hover:text-accent"}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            }
        </>
    )
}