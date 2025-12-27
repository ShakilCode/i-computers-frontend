import { useState } from "react"

export default function Test() {
    const [count, setCount] = useState(0)
    const [status, setStatus] = useState("Sleeping")
    const [isVisible, setIsVisible] = useState(true)


    return (
        <div className="w-full h-full bg-yellow-300 flex justify-center items-center">
            <button onClick={
                ()=>{
                    setIsVisible(!isVisible)
                }
            } className="w-[50px] h-[50px] bg-red-600 text-white">{isVisible?"X":"O"}</button>
           {isVisible && <div className="w-[400px] h-[400px] bg-white flex justify-center items-center flex-col">
                <h1 className="text-[55px]">{count}</h1>
                <div className="w-full h-[50px] flex justify-center items-center gap-8">
                    <button onClick={
                        ()=>{
                            setCount(count - 1)
                        }
                    } className="w-[100px] h-[45px] bg-red-600 text-white text-2xl rounded-2xl">-</button>
                    <button onClick={
                        ()=>{
                            setCount(count + 1)
                        }
                    } className="w-[100px] h-[45px] bg-green-600 text-white text-2xl rounded-2xl">+</button>
                </div>

                <h1 className="text-[55px]">{status}</h1>
                <div className="w-full h-[50px] flex justify-center items-center gap-8">
                    <button onClick={
                        ()=>{
                            setStatus("Sleeping")
                        }
                    } className="w-[100px] h-[45px] bg-red-600 text-white text-2xl rounded-2xl">Sleep</button>
                    <button onClick={
                        ()=>{
                            setStatus("Awake")
                        }
                    } className="w-[100px] h-[45px] bg-green-600 text-white text-2xl rounded-2xl">Awake</button>
                </div>
            </div>}
        </div>
    )
}