import { useState } from "react";
import getFormattedDate from "../utils/date-format";
import getFormattedPrice from "../utils/price-format";
import { CgClose } from "react-icons/cg";

export default function ViewOrderInfoModal(props) {
	const [isVisible, setIsVisible] = useState(false);
	const order = props.order;

	return (
		<>
			<button
				className="bg-accent text-white px-3 py-1 rounded hover:bg-accent/80"
				onClick={() => setIsVisible(true)}
			>
				View Details
			</button>
			{isVisible && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="w-[600px] h-[600px] bg-white rounded-md relative">
                        <button className="absolute w-10 h-10 text-red-600 text-2xl rounded-full hover:bg-red-600 hover:text-white cursor-pointer flex justify-center items-center right-[-30px] top-[-30px]" 
                            onClick={() => setIsVisible(false)}>
                            <CgClose/>
                        </button>
						{/* orderID, firstName, lastName, email, , total, status header with */}
						<div className="w-full h-[200px] bg-accent rounded-md">
							<div className="w-full flex items-center justify-between">
								<h1 className="text-2xl font-semibold text-white p-5">
									{order.orderId}
								</h1>
								<h2 className="text-lg font-thin text-white p-5">
									{getFormattedDate(order.date)}
								</h2>
							</div>
                            <div className="w-full flex items-center ">
                                <h1 className="text-lg font-semibold text-white p-5">
                                    {order.firstName + " " + order.lastName}
                                </h1>
                                <h2 className="text-sm font-thin text-white p-5">
                                    {order.email}
                                </h2>
                            </div>
                            <div className="w-full flex items-center ">
                                <h1 className="text-lg font-semibold text-white p-5">
                                    Total: {getFormattedPrice(order.total)}
                                </h1>
                                <h2 className="text-sm font-thin text-white p-5">
                                    Status: {order.status}
                                </h2>
                            </div>
						</div>
                        <div className="w-full h-[400px] p-5 overflow-y-scroll">
                            {
                                order.items.map(
                                    (item) => {
                                        return(
                                            <div className="w-full h-auto flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.image} alt={item.name} className="h-[60px] w-[60px] object-cover rounded"/>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-secondary">{item.name}</span>
                                                        <span className="text-xs text-secondary/70">Qty: {item.qty}</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-secondary">{getFormattedPrice(item.price)}</span>
                                            </div>
                                        )
                                        
                                    }
                                )
                            }
                        </div>
					</div>
				</div>
			)}
		</>
	);
}
