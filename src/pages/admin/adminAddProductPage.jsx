import { useState } from "react"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminAddProductPage(){

    const [productId, setProductId] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [altNames, setAltNames] = useState("")
    const [price, setPrice] = useState("")
    const [labelledPrice, setLabelledPrice] = useState("")
    const [category, setCategory] = useState("Others")
    const [brand , setBrand] = useState("Standard");
    const [model , setModel] = useState("");
    const [isVisible , setIsVisible] = useState(true);
    const navigate = useNavigate()

    async function handleAddProduct(){
        try{

            const token = localStorage.getItem("token");

            if(token == null){
                toast.error("You must be logged in to add a product");
                window.location.href = "/login";
                return;
            }

            //"sound,base,audio,bluetooth"
            //altNames.split(",") => ["sound","base","audio","bluetooth"]
            await axios.post(import.meta.env.VITE_API_URL + "/products", {
                productId: productId,
                name: name,
                description: description,
                price : price,
                labelledPrice: labelledPrice,
                altNames : altNames.split(","),
                category: category,
                brand: brand,
                model: model,
                isVisible: isVisible,
            },{
                headers: {
                    Authorization : "Bearer "+token
                }
            })
            toast.success("Product added successfully");
            navigate("/admin/products");
        }catch(err){
            // toast.error("Failed to add product")
            toast.error(err?.response?.data?.message || "Failed to add product")
            return
        }
    }

    return(
        <div className="w-full max-h-full flex flex-wrap items-start overflow-y-scroll hide-scroll-track">
            <h1 className="w-full text-3xl font-bold mb-4 sticky top-0 bg-primary">Add New Product</h1>
            <div className="w-[50%]   h-[120px] flex flex-col">
                <label className="font-bold ml-2">Product ID</label>
                <input value={productId} onChange={(e)=>{setProductId(e.target.value)}}  placeholder="Ex: ID001" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-[50%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Product Name</label>
                <input value={name} onChange={(e)=>{setName(e.target.value)}}  placeholder="Ex: Laptop" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-full h-[170px] flex flex-col">
                <label className="font-bold ml-2">Description</label>
                <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}}  placeholder="Ex: Laptop" className="border-4 border-accent rounded-[10px] h-[100px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-full h-[120px] flex flex-col">
                <label className="font-bold ml-2">Alternative Names (Comma Separated)</label>
                <input value={altNames} onChange={(e)=>{setAltNames(e.target.value)}}  placeholder="Ex: Laptop, Notebook, Portable Computer" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-[50%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Price</label>
                <input value={price} onChange={(e)=>{setPrice(e.target.value)}} type="number" placeholder="Ex: 50000" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-[50%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Labelled Price</label>
                <input value={labelledPrice} onChange={(e)=>{setLabelledPrice(e.target.value)}} type="number" placeholder="Ex: 60000" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-[25%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Categories</label>
                <select value={category} onChange={(e)=>{setCategory(e.target.value)}} className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white">
                    <option value="Others">Others</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Desktops">Desktops</option>
                    <option value="Components">Components</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Peripherals">Peripherals</option>
                </select>
            </div>
            <div className="w-[25%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Brand</label>
                <select value={brand} onChange={(e)=>{setBrand(e.target.value)}} className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white">
                    <option value="Generic">Generic</option>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Asus">Asus</option>
                    <option value="Acer">Acer</option>
                    <option value="Apple">Apple</option>
                </select>
            </div>
            <div className="w-[25%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Model</label>
                <input value={model} onChange={(e)=>{setModel(e.target.value)}} placeholder="Ex: Inspiron 15" className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white"/>
            </div>
            <div className="w-[25%]  h-[120px] flex flex-col">
                <label className="font-bold ml-2">Is Visible</label>
                 <select value={isVisible} onChange={(e)=>{setIsVisible(e.target.value)}} className="border-4 border-accent rounded-[10px] h-[50px] p-2 m-2 focus:outline-white">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>

            <div className="w-full h-[80px] bg-white sticky bottom-0 rounded-b-2xl flex justify-end items-center p-4 gap-4 ">
                <button className="bg-gray-400 text-white font-bold px-6 py-3 rounded-[10px] hover:bg-gray-500">Cancel</button>
                <button onClick={handleAddProduct} className="bg-accent text-white font-bold px-6 py-3 rounded-[10px] hover:bg-secondary">Add Product</button>
            </div>
        </div>
    )
}