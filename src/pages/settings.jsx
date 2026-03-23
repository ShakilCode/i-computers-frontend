import axios from "axios";
import { useEffect, useState } from "react";
import uploadFile from "../utils/mediaUpload";
import toast from "react-hot-toast";

export default function SettingsPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [existingImageUrl, setExistingImageUrl] = useState("");
	const [file, setFile] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token != null) {
			axios
				.get(import.meta.env.VITE_API_URL + "/users/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					console.log(response.data);
					setFirstName(response.data.firstName);
					setLastName(response.data.lastName);
					setExistingImageUrl(response.data.image);
				})
				.catch(() => {
					localStorage.removeItem("token");
					window.location.href = "/login";
				});
		} else {
			window.location.href = "/login";
		}
	}, []);

	async function updateProfile() {
		const token = localStorage.getItem("token");

		const updatedInfo = {
			firstName: firstName,
			lastName: lastName,
			image: existingImageUrl,
		};

		if (file != null) {
			updatedInfo.image = await uploadFile(file);
		}
		const response = await axios.put(
			import.meta.env.VITE_API_URL + "/users/",
			updatedInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		localStorage.setItem("token", response.data.token);

		toast.success("Profile updated successfully");
		window.location.reload();
	}

	async function changePassword() {
		if (password != confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		const token = localStorage.getItem("token");
		await axios.post(
			import.meta.env.VITE_API_URL + "/users/update-password",
			{
				password: password,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		toast.success("Password changed successfully");

		window.location.reload();
	}

	return (
		<div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center px-4 py-8">
			<div className="w-full  flex flex-col lg:flex-row gap-6 justify-center ">
				<div className="min-w-[300px] rounded-lg bg-white shadow-md p-6 flex flex-col gap-4">
					<h1 className="text-2xl font-bold text-accent text-center">
						Account Settings
					</h1>
					<input
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
						}}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="First Name"
					/>
					<input
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
						}}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="Last Name"
					/>
					<input
						type="file"
						onChange={(e) => {
							setFile(e.target.files[0]);
						}}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="Profile Picture"
					/>
					<button
						className="w-full h-[50px] bg-accent text-white rounded-lg mt-2"
						onClick={updateProfile}
					>
						Update Profile
					</button>
				</div>
				<div className="min-w-[300px] rounded-lg bg-white shadow-md p-6 flex flex-col gap-4">
					<h1 className="text-2xl font-bold text-accent text-center">
						Change Password
					</h1>
					<input
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="New Password"
					/>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="Confirm New Password"
					/>
					<button
						className="w-full h-[50px] bg-accent text-white rounded-lg mt-2"
						onClick={changePassword}
					>
						Change Password
					</button>
				</div>
			</div>
		</div>
	);
}