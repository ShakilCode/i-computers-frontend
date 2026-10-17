import axios from "axios";
import { useEffect, useState } from "react";
import uploadFile from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { BiCloudUpload, BiX, BiCheck, BiLockAlt, BiUser } from "react-icons/bi";

export default function SettingsPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [existingImageUrl, setExistingImageUrl] = useState("");
	const [file, setFile] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [preview, setPreview] = useState(""); // UI only
	const [dragging, setDragging] = useState(false); // UI only
	const [showPassword, setShowPassword] = useState(false); // UI only

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

	// UI only: show a preview of the newly selected picture
	useEffect(() => {
		if (!file) {
			setPreview("");
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

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

	// ---------- design helpers (display only) ----------
	function strengthOf(pw) {
		if (!pw) return 0;
		let score = 0;
		if (pw.length >= 8) score++;
		if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
		if (/\d/.test(pw)) score++;
		if (/[^A-Za-z0-9]/.test(pw)) score++;
		return Math.max(1, score);
	}
	const strength = strengthOf(password);
	const strengthInfo = [
		null,
		{ label: "Weak", color: "bg-[#ff4d6d]", text: "text-[#e0345a]" },
		{ label: "Fair", color: "bg-[#f5b301]", text: "text-[#b07d00]" },
		{ label: "Good", color: "bg-accent", text: "text-accent" },
		{ label: "Strong", color: "bg-accent-2", text: "text-[#0b8f66]" },
	][strength];
	const showMatch = confirmPassword !== "";
	const matches = password === confirmPassword;

	const avatarSrc = preview || existingImageUrl;
	const initial = String(firstName || "?").charAt(0).toUpperCase();

	const inputClass =
		"peer w-full h-14 rounded-2xl bg-white border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:ring-4 focus:ring-accent/15";
	const labelClass =
		"pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent";
	const buttonClass =
		"group relative w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 cursor-pointer";

	const eyeIcon = showPassword ? (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7a11 11 0 01-3.2 4.5M6.1 6.1C4 7.6 2.6 9.8 2 12c1 3 5 7 10 7 1.5 0 2.9-.3 4.1-.9" />
		</svg>
	) : (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
			<path strokeLinecap="round" strokeLinejoin="round" d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7S3 15 2 12z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);

	return (
		<div className="relative w-full min-h-[calc(100vh-100px)] bg-primary overflow-x-hidden">

			{/* Background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob" />
				<div className="absolute top-1/2 -right-48 w-[480px] h-[480px] rounded-full bg-accent-2/20 blur-3xl animate-blob [animation-delay:-8s]" />
				<div className="absolute -bottom-40 left-1/3 w-[440px] h-[440px] rounded-full bg-[#ff8fd8]/20 blur-3xl animate-blob [animation-delay:-14s]" />
			</div>

			<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

				{/* Profile hero */}
				<div className="flex flex-col sm:flex-row items-center gap-6 animate-rise">
					<div className="relative w-28 h-28 shrink-0">
						<div className="absolute -inset-1.5 rounded-full overflow-hidden">
							<div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_120deg,var(--color-accent-2)_220deg,transparent_320deg)] animate-spin-slow" />
						</div>
						<div className="relative w-full h-full rounded-full bg-white overflow-hidden ring-4 ring-white shadow-xl shadow-accent/25 flex items-center justify-center">
							{avatarSrc ? (
								<img src={avatarSrc} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
							) : (
								<span className="text-4xl font-bold text-accent">{initial}</span>
							)}
						</div>
					</div>
					<div className="text-center sm:text-left">
						<p className="text-sm font-semibold text-accent">Account settings</p>
						<h1 className="mt-1 text-3xl lg:text-5xl font-bold tracking-tight text-secondary">
							{firstName || lastName ? `${firstName} ${lastName}` : "Your profile"}
						</h1>
						<p className="mt-2 text-secondary/60">Update your details and keep your account secure.</p>
					</div>
				</div>

				<div className="mt-10 grid lg:grid-cols-2 gap-6 items-start">

					{/* Profile card */}
					<div className="rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-6 sm:p-8 flex flex-col gap-4 animate-rise" style={{ animationDelay: "0.1s" }}>
						<div className="flex items-center gap-3">
							<span className="w-11 h-11 rounded-2xl bg-linear-to-br from-accent to-[#b06cff] text-white flex items-center justify-center shadow-lg shadow-accent/30"><BiUser size={22} /></span>
							<h2 className="text-2xl font-bold tracking-tight text-secondary">Profile</h2>
						</div>

						<div className="flex gap-3 mt-2">
							<div className="relative w-1/2">
								<input
									id="firstName"
									value={firstName}
									onChange={(e) => {
										setFirstName(e.target.value);
									}}
									className={inputClass}
									placeholder=" "
								/>
								<label htmlFor="firstName" className={labelClass}>First Name</label>
							</div>
							<div className="relative w-1/2">
								<input
									id="lastName"
									value={lastName}
									onChange={(e) => {
										setLastName(e.target.value);
									}}
									className={inputClass}
									placeholder=" "
								/>
								<label htmlFor="lastName" className={labelClass}>Last Name</label>
							</div>
						</div>

						{/* Upload zone */}
						<label
							htmlFor="profilePicture"
							onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
							onDragLeave={() => setDragging(false)}
							onDrop={(e) => {
								e.preventDefault();
								setDragging(false);
								if (e.dataTransfer.files && e.dataTransfer.files[0]) {
									setFile(e.dataTransfer.files[0]);
								}
							}}
							className={`relative flex flex-col items-center justify-center text-center gap-2 rounded-2xl border-2 border-dashed px-5 py-7 cursor-pointer transition-all duration-300 ${dragging ? "border-accent bg-accent/10 scale-[1.02]" : "border-secondary/20 bg-primary hover:border-accent hover:bg-accent/5"}`}
						>
							<span className={`w-12 h-12 rounded-full bg-white text-accent flex items-center justify-center shadow-md ${dragging ? "animate-float" : ""}`}>
								<BiCloudUpload size={26} />
							</span>
							<span className="font-semibold text-secondary">
								{file ? file.name : "Click to upload or drag and drop"}
							</span>
							<span className="text-xs text-secondary/50">{file ? "This picture will be saved when you update" : "Choose a new profile picture"}</span>
							<input
								id="profilePicture"
								type="file"
								onChange={(e) => {
									setFile(e.target.files[0]);
								}}
								className="sr-only"
							/>
						</label>
						{file && (
							<button
								type="button"
								onClick={() => setFile(null)}
								className="self-start inline-flex items-center gap-1 text-sm font-semibold text-[#e0345a] transition hover:underline cursor-pointer"
							>
								<BiX size={18} /> Remove selected picture
							</button>
						)}

						<button className={buttonClass + " mt-2"} onClick={updateProfile}>
							<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
							<span className="relative">Update Profile</span>
						</button>
					</div>

					{/* Password card */}
					<div className="rounded-[2rem] bg-white border border-secondary/10 shadow-xl shadow-accent/10 p-6 sm:p-8 flex flex-col gap-4 animate-rise" style={{ animationDelay: "0.2s" }}>
						<div className="flex items-center gap-3">
							<span className="w-11 h-11 rounded-2xl bg-linear-to-br from-accent-2 to-accent text-white flex items-center justify-center shadow-lg shadow-accent/30"><BiLockAlt size={22} /></span>
							<h2 className="text-2xl font-bold tracking-tight text-secondary">Change Password</h2>
						</div>

						<div className="relative mt-2">
							<input
								id="newPassword"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								className={inputClass + " pr-14"}
								placeholder=" "
							/>
							<label htmlFor="newPassword" className={labelClass}>New Password</label>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide passwords" : "Show passwords"}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-accent transition"
							>
								{eyeIcon}
							</button>
						</div>

						{/* Strength meter */}
						<div className={`overflow-hidden transition-all duration-300 ${password ? "max-h-8 opacity-100" : "max-h-0 opacity-0 -mt-4"}`}>
							<div className="flex items-center gap-3">
								<div className="flex flex-1 gap-1.5">
									{[1, 2, 3, 4].map((n) => (
										<span
											key={n}
											className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${strength >= n && strengthInfo ? strengthInfo.color : "bg-secondary/10"}`}
										/>
									))}
								</div>
								<span className={`text-xs font-bold w-12 text-right ${strengthInfo ? strengthInfo.text : ""}`}>{strengthInfo?.label}</span>
							</div>
						</div>

						<div className="relative">
							<input
								id="confirmNewPassword"
								type={showPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
								}}
								className={inputClass}
								placeholder=" "
							/>
							<label htmlFor="confirmNewPassword" className={labelClass}>Confirm New Password</label>
						</div>

						{/* Match indicator */}
						<div className={`overflow-hidden transition-all duration-300 ${showMatch ? "max-h-8 opacity-100" : "max-h-0 opacity-0 -mt-4"}`}>
							<p className={`flex items-center gap-1.5 text-sm font-medium ${matches ? "text-[#0b8f66]" : "text-[#e0345a]"}`}>
								<span className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${matches ? "bg-accent-2" : "bg-[#ff4d6d]"}`}>
									{matches ? <BiCheck size={14} /> : <span className="text-[10px] font-bold leading-none">!</span>}
								</span>
								{matches ? "Passwords match" : "Passwords do not match"}
							</p>
						</div>

						<button className={buttonClass + " mt-2"} onClick={changePassword}>
							<span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
							<span className="relative">Change Password</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}