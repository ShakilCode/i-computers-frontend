export function getCart() {
	const cartString = localStorage.getItem("cart");

	if (cartString == null) {
		localStorage.setItem("cart", "[]");
		return [];
	} else {
		const cart = JSON.parse(cartString);
		return cart;
	}
}

const sampleCart = [
	{
		product: {
			productId: "12345",
			name: "Product 1",
			labelledPrice: 1000,
			price: 800,
			image: "https://via.placeholder.com/150",
		},
		qty: 1,
	},
	{
		product: {
			productId: "67890",
			name: "Product 2",
			labelledPrice: 2000,
			price: 1500,
			image: "https://via.placeholder.com/150",
		},
		qty: 1,
	},
];

export function addToCart(product , qty){
    
    const cart = getCart();

    const existingProductIndex = cart.findIndex(
        (item)=>{
            return item.product.productId == product.productId
        }
    );

    if(existingProductIndex ==  -1){

        if(qty <= 0){
            console.error("Quantity must be greater than 0");
            return;
        }

        cart.push(
            {
                product : {
                    productId : product.productId,
                    name : product.name,
                    labelledPrice : product.labelledPrice,
                    price : product.price,
                    image : product.images[0]
                },
                qty : qty
            }
        )

    }else{


        const newQty = cart[existingProductIndex].qty + qty

        if(newQty <= 0){            
            //remove product from cart
            cart.splice(existingProductIndex , 1)

        }else{

            cart[existingProductIndex].qty = newQty

        }
        
    }

    const cartString = JSON.stringify(cart);

    localStorage.setItem("cart", cartString);

}

export function getCartTotal(cart){
    
    let total = 0 

    cart.forEach(
        (cartItem)=>{
                //total = total + cartItem.product.price * cartItem.qty
                total += cartItem.product.price * cartItem.qty
        }
    )    
    return total
}


