import axios from "axios";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/loadingAnimation";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");

			axios
				.get(
					import.meta.env.VITE_API_URL +
						"/users/all/" +
						pageSize +
						"/" +
						pageNumber,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					},
				)
				.then((response) => {
					setUsers(response.data.users);
					setTotalPages(response.data.totalPages);
					setLoading(false);
				});
		}
	}, [loading]);

	return (
		<div className="w-full h-full overflow-y-scroll relative">
			<div className="flex items-center justify-between gap-3 px-5 py-4 bg-primary/60 border-b border-secondary/10">
				<div>
					<h2 className="text-lg font-semibold text-secondary">Users</h2>
					<p className="text-sm text-secondary/70">
						Manage your users at a glance
					</p>
				</div>
			</div>
			{ loading ? (
				<div className="w-full h-full flex justify-center items-center">
					<LoadingAnimation />
				</div>
			) : (
				<table className="min-w-[1100px] w-full text-sm relative">
                    <thead className="sticky top-0 z-10 bg-white">
						<tr className="border-b border-secondary/10">
							<th className="px-5 py-3  text-center text-xs font-semibold uppercase tracking-wide text-secondary/70">
								
							</th>							
							<th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-secondary/70">
								Email
							</th>
                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-tight text-secondary/70">
								First Name
							</th>
                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-tight text-secondary/70">
								Last Name
							</th>
							<th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-secondary/70">
								Role
							</th>
							<th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-secondary/70">
                                Email Verification
							</th>
                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-secondary/70">
                                Account Status
                            </th>
							<th></th>
                            <th></th>
						</tr>
					</thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.email} className="border-b border-secondary/10">
                                <td className="px-5 py-3 text-center">
                                    <img referrerPolicy="no-referrer" src={user.image} className="w-[50px] h-[50px] object-cover rounded-full mx-auto"/>
                                </td>
                                <td className="px-5 py-3 text-center">{user.email}</td>
                                <td className="px-5 py-3 text-center">{user.firstName}</td>
                                <td className="px-5 py-3 text-center">{user.lastName}</td>
                                <td className="px-5 py-3 text-center">{user.role}</td>
                                <td className="px-5 py-3 text-center">{user.isEmailVerified ? "Verified" : "Not Verified"}</td>
                                <td className="px-5 py-3 text-center">{user.isBlocked ? "Blocked" : "Active"}</td>
                                <td className="px-5 py-3 text-center">
                                    {/* block user button */}
                                    <button className={`px-3 py-1 rounded-full text-white ${user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                                    onClick={
                                        ()=>{
                                            axios.post(import.meta.env.VITE_API_URL+"/users/toggle-block",{
                                                email : user.email
                                            },{
                                                headers : {
                                                    "Authorization" : "Bearer "+localStorage.getItem("token")
                                                }
                                            }).then(
                                                (response)=>{
                                                    toast.success(response.data.message);
                                                    setLoading(true);
                                                }
                                            ).catch(
                                                (err)=>{
                                                    toast.error(err?.response?.data?.message || "Failed to toggle block status");
                                                }
                                            )

                                        }
                                    }>
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </button>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    {/* make admin or customer button */}
                                    <button className={`px-3 py-1 rounded-full text-white ${user.role === "admin" ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
                                    onClick={
                                        ()=>{
                                            axios.post(import.meta.env.VITE_API_URL+"/users/toggle-role",{
                                                email : user.email
                                            },{
                                                headers : {
                                                    "Authorization" : "Bearer "+localStorage.getItem("token")
                                                }
                                            }).then(
                                                (response)=>{
                                                    toast.success(response.data.message);
                                                    setLoading(true);
                                                }
                                            ).catch(
                                                (err)=>{
                                                    toast.error(err?.response?.data?.message || "Failed to toggle block status");
                                                }
                                            )
                                            
                                        }
                                    }
                                    >
                                        {user.role === "admin" ? "Make Customer" : "Make Admin"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
			)}
            <div className="w-full fixed bottom-5 left-0 h-[50px] flex justify-center items-center ">
                <div className="w-[500px] h-full bg-white shadow-2xl rounded-full flex items-center justify-center px-2">
                    <button className="bg-accent w-[100px] text-white p-2 rounded-full cursor-pointer hover:bg-accent/80"
                        onClick={() => {
                            if(pageNumber > 1){
                                setPageNumber(pageNumber - 1);
                                setLoading(true);
                            }else{
                                toast.success("You are on the first page");
                            }
                        }}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-secondary w-[100px] text-center">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button className="bg-accent text-white p-2 rounded-full w-[100px] cursor-pointer hover:bg-accent/80"
                        onClick={
                            ()=>{
                                if(pageNumber < totalPages){
                                    setPageNumber(pageNumber + 1);
                                    setLoading(true);
                                }else{
                                    toast.success("You are on the last page");
                                }
                            }
                        }
                        >
                        Next
                    </button>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(parseInt(e.target.value));
                            setLoading(true);
                        }}
                        className="ml-5 border border-secondary/20 rounded px-3 py-2 text-sm"
                    >
                        {/* <option value={2}>2 per page</option>
                        <option value={5}>5 per page</option> */}
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>
		</div>
	);
}
