import ProductCard from "./productCard";

export default function OnSaleNow(){

    return(
        <div>
            <h1>On sale now</h1>
            <ProductCard 
                name="Macbook Air"
                image="https://picsum.photos/id/0/200/300"  
                price="$999"
            />

            <ProductCard 
                name="shoes"
                image="https://picsum.photos/id/21/200/300"
                price="$99"
            />
        </div>
    )
}