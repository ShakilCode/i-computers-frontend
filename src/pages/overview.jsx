import { useParams } from "react-router-dom"

export default function Overview(){

    const params = useParams()
    return(
        <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-3xl font-bold">Overview of {params.productId}</h1>
        </div>
    )
}