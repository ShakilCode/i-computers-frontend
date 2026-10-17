import { useEffect, useState } from "react"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";
import { BiInfoCircle, BiPurchaseTag, BiCategory, BiImages, BiCloudUpload, BiX, BiCheck, BiChevronDown, BiPackage } from "react-icons/bi";

// Design only: a titled card that holds a group of fields
function Section({ icon, title, hint, delay = 0, children }) {
    return (
        <div className="rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-6 sm:p-8 animate-rise" style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30">{icon}</span>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-secondary">{title}</h2>
                    {hint && <p className="text-sm text-secondary/50">{hint}</p>}
                </div>
            </div>
            {children}
        </div>
    )
}

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
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([]) // UI only
    const [dragging, setDragging] = useState(false) // UI only
    const navigate = useNavigate()

    async function handleAddProduct(){
        try{

            const token = localStorage.getItem("token");

            if(token == null){
                toast.error("You must be logged in to add a product");
                window.location.href = "/login";
                return;
            }

            const fileUploadPromises = []

            for(let i = 0; i<files.length; i++){
                fileUploadPromises[i] = uploadFile(files[i])
            }

            const imageURLs = await Promise.all(fileUploadPromises)



            //"sound,base,audio,bluetooth"
            //altNames.split(",") => ["sound","base","audio","bluetooth"]
            await axios.post(import.meta.env.VITE_API_URL + "/products", {
                productId: productId,
                name: name,
                description: description,
                price : price,
                labelledPrice: labelledPrice,
                altNames : altNames.split(","),
                images : imageURLs,
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

    // ---------- design helpers (display only) ----------
    // Previews of the selected pictures
    useEffect(() => {
        const urls = Array.from(files || []).map((f) => URL.createObjectURL(f))
        setPreviews(urls)
        return () => urls.forEach((u) => URL.revokeObjectURL(u))
    }, [files])

    const priceNum = Number(price), labelledNum = Number(labelledPrice)
    const discount = labelledNum > priceNum && priceNum > 0 ? Math.round(((labelledNum - priceNum) / labelledNum) * 100) : 0
    const altList = altNames.split(",").map((s) => s.trim()).filter(Boolean)
    const visible = String(isVisible) === "true"
    const fileCount = files ? files.length : 0

    const inputClass =
        "peer w-full h-14 rounded-2xl bg-white border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:ring-4 focus:ring-accent/15"
    const labelClass =
        "pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent"
    const selectClass =
        "appearance-none w-full h-14 rounded-2xl bg-white border border-secondary/10 pl-5 pr-11 text-secondary outline-none cursor-pointer transition focus:border-accent focus:ring-4 focus:ring-accent/15"

    return(
        <div className="relative w-full h-full flex flex-col bg-primary overflow-hidden">

            {/* Scrolling form area (the action bar below stays put) */}
            <div className="relative flex-1 min-h-0 overflow-y-auto hide-scroll-track">

                <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/25 blur-3xl animate-blob" />
                    <div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
                </div>

                <div className="relative z-10 p-5 lg:p-8">

                    {/* Title */}
                    <div className="animate-rise">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-secondary">Add New Product</h1>
                        <p className="mt-1 text-secondary/60">Fill in the details and watch the preview update.</p>
                    </div>

                    <div className="mt-6 grid xl:grid-cols-[1fr_340px] gap-6 items-start">

                        {/* Form sections */}
                        <div className="flex flex-col gap-6">

                            <Section icon={<BiInfoCircle size={22} />} title="Basic information" hint="Name it and describe it" delay={0.05}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input id="productId" value={productId} onChange={(e)=>{setProductId(e.target.value)}} placeholder=" " className={inputClass} />
                                        <label htmlFor="productId" className={labelClass}>Product ID (Ex: ID001)</label>
                                    </div>
                                    <div className="relative">
                                        <input id="productName" value={name} onChange={(e)=>{setName(e.target.value)}} placeholder=" " className={inputClass} />
                                        <label htmlFor="productName" className={labelClass}>Product Name (Ex: Laptop)</label>
                                    </div>
                                </div>

                                <div className="relative mt-4">
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e)=>{setDescription(e.target.value)}}
                                        placeholder=" "
                                        rows={4}
                                        className="peer w-full resize-y rounded-2xl bg-white border border-secondary/10 px-5 pt-7 pb-3 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                                    />
                                    <label htmlFor="description" className={labelClass}>Description</label>
                                </div>

                                <div className="relative mt-4">
                                    <input id="altNames" value={altNames} onChange={(e)=>{setAltNames(e.target.value)}} placeholder=" " className={inputClass} />
                                    <label htmlFor="altNames" className={labelClass}>Alternative Names (Comma Separated)</label>
                                </div>
                                {altList.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {altList.map((a, i) => (
                                            <span key={i} className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1 animate-rise">{a}</span>
                                        ))}
                                    </div>
                                )}
                            </Section>

                            <Section icon={<BiPurchaseTag size={22} />} title="Pricing" hint="The discount is worked out for you" delay={0.1}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input id="price" value={price} onChange={(e)=>{setPrice(e.target.value)}} type="number" placeholder=" " className={inputClass} />
                                        <label htmlFor="price" className={labelClass}>Price (Ex: 50000)</label>
                                    </div>
                                    <div className="relative">
                                        <input id="labelledPrice" value={labelledPrice} onChange={(e)=>{setLabelledPrice(e.target.value)}} type="number" placeholder=" " className={inputClass} />
                                        <label htmlFor="labelledPrice" className={labelClass}>Labelled Price (Ex: 60000)</label>
                                    </div>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ${discount > 0 ? "max-h-14 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-accent-2/20 text-[#0b8f66] text-sm font-semibold px-4 py-2">
                                        <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse-soft" />
                                        Customers will see -{discount}% off
                                    </span>
                                </div>
                            </Section>

                            <Section icon={<BiCategory size={22} />} title="Details" hint="Where it belongs and who sees it" delay={0.15}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-secondary/70">Categories</label>
                                        <div className="relative">
                                            <select value={category} onChange={(e)=>{setCategory(e.target.value)}} className={selectClass}>
                                                <option value="Others">Others</option>
                                                <option value="Laptops">Laptops</option>
                                                <option value="Desktops">Desktops</option>
                                                <option value="Components">Components</option>
                                                <option value="Accessories">Accessories</option>
                                                <option value="Peripherals">Peripherals</option>
                                            </select>
                                            <BiChevronDown size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-secondary/70">Brand</label>
                                        <div className="relative">
                                            <select value={brand} onChange={(e)=>{setBrand(e.target.value)}} className={selectClass}>
                                                <option value="Generic">Generic</option>
                                                <option value="Dell">Dell</option>
                                                <option value="HP">HP</option>
                                                <option value="Lenovo">Lenovo</option>
                                                <option value="Asus">Asus</option>
                                                <option value="Acer">Acer</option>
                                                <option value="Apple">Apple</option>
                                            </select>
                                            <BiChevronDown size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                    <div className="relative">
                                        <input id="model" value={model} onChange={(e)=>{setModel(e.target.value)}} placeholder=" " className={inputClass} />
                                        <label htmlFor="model" className={labelClass}>Model (Ex: Inspiron 15)</label>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-secondary/70 sm:hidden">Is Visible</label>
                                        <div className="h-14 flex rounded-2xl bg-primary p-1">
                                            {[{ label: "Visible", value: "true", on: visible }, { label: "Hidden", value: "false", on: !visible }].map((o) => (
                                                <button
                                                    key={o.value}
                                                    type="button"
                                                    onClick={() => setIsVisible(o.value)}
                                                    className={`flex-1 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${o.on ? "bg-white text-accent shadow-md shadow-accent/20" : "text-secondary/50 hover:text-secondary"}`}
                                                >
                                                    {o.on && <BiCheck size={18} />}
                                                    {o.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section icon={<BiImages size={22} />} title="Images" hint="You can choose several pictures" delay={0.2}>
                                <label
                                    htmlFor="productImages"
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragging(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                            setFiles(e.dataTransfer.files);
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center text-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 cursor-pointer transition-all duration-300 ${dragging ? "border-accent bg-accent/10 scale-[1.01]" : "border-secondary/20 bg-primary hover:border-accent hover:bg-accent/5"}`}
                                >
                                    <span className={`w-14 h-14 rounded-full bg-white text-accent flex items-center justify-center shadow-md ${dragging ? "animate-float" : ""}`}>
                                        <BiCloudUpload size={30} />
                                    </span>
                                    <span className="font-semibold text-secondary">
                                        {fileCount > 0 ? `${fileCount} ${fileCount === 1 ? "picture" : "pictures"} selected` : "Click to upload or drag and drop"}
                                    </span>
                                    <span className="text-xs text-secondary/50">They are uploaded when you add the product</span>
                                    <input id="productImages" multiple type="file" onChange={(e)=>{setFiles(e.target.files)}} className="sr-only" />
                                </label>

                                {previews.length > 0 && (
                                    <>
                                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {previews.map((src, i) => (
                                                <div key={src} className="relative aspect-square rounded-2xl bg-linear-to-br from-primary to-white border border-secondary/10 overflow-hidden animate-rise" style={{ animationDelay: `${i * 0.05}s` }}>
                                                    <img src={src} alt="" className="w-full h-full object-contain p-2" />
                                                    {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-accent text-white text-[10px] font-bold px-2 py-0.5">Cover</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFiles([])}
                                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#e0345a] transition hover:underline cursor-pointer"
                                        >
                                            <BiX size={18} /> Clear selected pictures
                                        </button>
                                    </>
                                )}
                            </Section>
                        </div>

                        {/* Live preview */}
                        <div className="xl:sticky xl:top-6 animate-rise" style={{ animationDelay: "0.25s" }}>
                            <p className="mb-3 text-sm font-semibold text-secondary/60">Live preview</p>
                            <div className="rounded-3xl bg-white border border-secondary/10 overflow-hidden shadow-2xl shadow-accent/15">
                                <div className="relative h-[220px] bg-linear-to-br from-primary to-white flex items-center justify-center">
                                    {discount > 0 && (
                                        <span className="absolute left-3 top-3 z-10 rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8a5c] text-white text-xs font-extrabold px-3 py-1 shadow-lg shadow-[#ff4d6d]/30">-{discount}%</span>
                                    )}
                                    <span className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold ${visible ? "bg-accent-2/25 text-[#0b8f66]" : "bg-secondary/10 text-secondary/60"}`}>
                                        {visible ? "Visible" : "Hidden"}
                                    </span>
                                    {previews[0] ? (
                                        <img src={previews[0]} alt="" className="absolute inset-0 w-full h-full object-contain p-8" />
                                    ) : (
                                        <span className="w-20 h-20 rounded-3xl bg-white text-accent/40 flex items-center justify-center shadow-md animate-float"><BiPackage size={40} /></span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-semibold text-accent truncate">{category}{brand ? ` · ${brand}` : ""}</p>
                                    <h3 className="mt-1 text-lg font-bold leading-6 text-secondary line-clamp-2 min-h-[48px]">{name || "Product name"}</h3>
                                    {model && <p className="text-xs text-secondary/50 truncate">{model}</p>}
                                    <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                                        <span className="text-2xl font-extrabold text-secondary">Rs. {priceNum ? priceNum.toLocaleString() : "0"}</span>
                                        {discount > 0 && <span className="text-sm text-secondary/40 line-through">Rs. {labelledNum.toLocaleString()}</span>}
                                    </div>
                                    <p className="mt-3 text-sm text-secondary/60 line-clamp-3">{description || "Your description will appear here."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action bar (stays at the bottom, below the scrolling form) */}
            <div className="relative z-20 shrink-0 px-4 sm:px-8 py-4 bg-white border-t border-secondary/10 flex justify-end items-center gap-3">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="h-12 px-8 rounded-full bg-primary text-secondary/70 font-semibold transition hover:bg-secondary/10 hover:text-secondary active:scale-95 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddProduct}
                    className="group relative h-12 px-8 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                >
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Add Product</span>
                </button>
            </div>
        </div>
    )
}