// Create a function
// function's name is our tag name and the first letter must be captial
export default function ProductCard(props){

    console.log(props)
    // return a product card details (what to display)
    return(
        <div>
            <h2>{props.name}</h2>
            <img src={props.image} alt="Macbook image" className="border-4"/>
            <p>price: {props.price}</p>
            <button>Buy Now</button>
        </div>
    )

}