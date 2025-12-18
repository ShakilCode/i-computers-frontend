export default function Test(){
    return(
        <div className="w-[600px] h-[600px] border-4 relative">
            <div className="w-[500px] h-[500px] bg-amber-200 flex flex-col justify-center items-center">
                <div className="w-[75px] h-[75px] bg-blue-600"></div>
                <div className="w-[75px] h-[75px] bg-red-600"></div>
                <div className="w-[75px] h-[75px] bg-green-600 absolute top-[10px] right-[50px] z-[0]"></div>
                <div className="w-[75px] h-[75px] bg-purple-600 fixed top-[10px] right-[200px]"></div>
                <div className="w-[75px] h-[75px] bg-black"></div>
                <div className="w-[75px] h-[75px] bg-[#00FFFF]"></div>
            </div>
        </div>
    )
}