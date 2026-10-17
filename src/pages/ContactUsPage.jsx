import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (loading) return;

        const cleanData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
        };

        // 1. Validate required fields.
        if (
            !cleanData.name ||
            !cleanData.email ||
            !cleanData.subject ||
            !cleanData.message
        ) {
            toast.error("All fields are required");
            return;
        }

        // 2. Validate name.
        if (
            cleanData.name.length < 2 ||
            cleanData.name.length > 100
        ) {
            toast.error(
                "Name must be between 2 and 100 characters"
            );
            return;
        }

        // 3. Validate email format.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(cleanData.email) ||
            cleanData.email.length > 254
        ) {
            toast.error("Please enter a valid email address");
            return;
        }

        // 4. Detect common email domain typos.
        const emailDomain = cleanData.email
            .split("@")[1]
            .toLowerCase();

        const commonDomainCorrections = {
            "gmail.co": "gmail.com",
            "gmail.con": "gmail.com",
            "gmai.com": "gmail.com",
            "gmial.com": "gmail.com",
            "hotmai.com": "hotmail.com",
            "hotmail.co": "hotmail.com",
            "yahoo.co": "yahoo.com",
            "yaho.com": "yahoo.com",
            "outlook.co": "outlook.com",
        };

        if (commonDomainCorrections[emailDomain]) {
            toast.error(
                `Did you mean ${commonDomainCorrections[emailDomain]}? Please check your email address.`
            );
            return;
        }

        // 5. Validate subject.
        if (
            cleanData.subject.length < 3 ||
            cleanData.subject.length > 150
        ) {
            toast.error(
                "Subject must be between 3 and 150 characters"
            );
            return;
        }

        // 6. Validate message.
        if (
            cleanData.message.length < 10 ||
            cleanData.message.length > 5000
        ) {
            toast.error(
                "Message must be between 10 and 5000 characters"
            );
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/contact-us`,
                cleanData
            );

            toast.success(
                response.data?.message ||
                "Your message has been submitted successfully"
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "We could not complete your request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    // Design only
    const inputClass =
        "peer w-full h-14 rounded-2xl bg-white/70 border border-secondary/10 px-5 pt-5 pb-1 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15 disabled:opacity-60";
    const labelClass =
        "pointer-events-none absolute left-5 top-1.5 text-xs text-secondary/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-accent";
    const messagePercent = Math.min(100, (formData.message.length / 5000) * 100);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-primary px-4 py-12 lg:py-16 flex items-center justify-center">
            {/* Aurora background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-accent/30 blur-3xl animate-blob" />
                <div className="absolute top-1/4 -right-48 w-[520px] h-[520px] rounded-full bg-accent-2/30 blur-3xl animate-blob [animation-delay:-7s]" />
                <div className="absolute -bottom-48 left-1/3 w-[500px] h-[500px] rounded-full bg-[#ff8fd8]/25 blur-3xl animate-blob [animation-delay:-14s]" />
                <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage: "radial-gradient(rgba(31,27,58,0.12) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                {/* Left: intro (desktop) */}
                <div className="hidden lg:block">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white border border-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary shadow-lg shadow-accent/10 animate-rise">
                        <span className="relative flex w-2.5 h-2.5">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-accent-2 opacity-75 animate-ping" />
                            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent-2" />
                        </span>
                        We are here to help
                    </span>

                    <h1 className="mt-6 text-6xl font-bold leading-[1.1] tracking-tight text-secondary animate-rise" style={{ animationDelay: "0.1s" }}>
                        Let's{" "}
                        <span className="bg-linear-to-r from-accent via-[#b06cff] to-accent-2 bg-clip-text text-transparent animate-gradient [background-size:200%_100%]">
                            talk
                        </span>
                        .
                    </h1>

                    <p className="mt-5 text-lg text-secondary/60 max-w-md leading-8 animate-rise" style={{ animationDelay: "0.2s" }}>
                        Have a question or need assistance? Send us a message and we'll get back to you.
                    </p>

                    {/* Floating glass cards */}
                    <div className="relative mt-12 h-[230px]">
                        <div className="absolute left-0 top-0 animate-float">
                            <div className="rounded-2xl bg-white border border-secondary/10 px-5 py-4 shadow-xl shadow-accent/10">
                                <p className="text-xs text-secondary/50">Support</p>
                                <p className="mt-1 font-semibold text-secondary flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse-soft" />
                                    Friendly and helpful
                                </p>
                            </div>
                        </div>
                        <div className="absolute left-[190px] top-[70px] animate-float-slow" style={{ animationDelay: "1s" }}>
                            <div className="rounded-2xl bg-white border border-secondary/10 px-5 py-4 shadow-xl shadow-accent/10">
                                <p className="text-xs text-secondary/50">Replies</p>
                                <p className="mt-1 font-semibold text-secondary">Sent to your email</p>
                            </div>
                        </div>
                        <div className="absolute left-[30px] top-[150px] animate-float" style={{ animationDelay: "2s" }}>
                            <div className="rounded-2xl bg-accent text-white px-5 py-3 shadow-xl shadow-accent/30 font-medium">
                                Your details stay private
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: form card */}
                <div className="relative w-full max-w-[560px] mx-auto rounded-[2rem] p-[2px] overflow-hidden shadow-2xl shadow-accent/20 animate-rise" style={{ animationDelay: "0.15s" }}>
                    <div className="absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-accent)_90deg,var(--color-accent-2)_180deg,transparent_270deg)] animate-spin-slow" />

                    <div className="relative z-10 rounded-[calc(2rem-2px)] bg-white/95 p-6 sm:p-10">

                        {/* Page Header (mobile) */}
                        <div className="lg:hidden mb-6 text-center">
                            <h1 className="text-3xl font-bold text-secondary tracking-tight">Contact Us</h1>
                            <p className="mt-2 text-secondary/60">
                                Have a question or need assistance? Send us a message and we'll get back to you.
                            </p>
                        </div>
                        <div className="hidden lg:block mb-6">
                            <h2 className="text-3xl font-bold text-secondary tracking-tight">Contact Us</h2>
                            <p className="mt-1 text-secondary/60">Fill in the form and send it our way.</p>
                        </div>

                        {/* noValidate disables browser validation popups */}
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-4"
                        >
                            {/* Full Name */}
                            <div className="relative animate-rise" style={{ animationDelay: "0.25s" }}>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleChange}
                                    minLength={2}
                                    maxLength={100}
                                    autoComplete="name"
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />
                                <label htmlFor="name" className={labelClass}>Full Name</label>
                            </div>

                            {/* Email Address */}
                            <div className="relative animate-rise" style={{ animationDelay: "0.32s" }}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                    maxLength={254}
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />
                                <label htmlFor="email" className={labelClass}>Email Address</label>
                            </div>

                            {/* Subject */}
                            <div className="relative animate-rise" style={{ animationDelay: "0.39s" }}>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder=" "
                                    value={formData.subject}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={150}
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />
                                <label htmlFor="subject" className={labelClass}>Subject</label>
                            </div>

                            {/* Message */}
                            <div className="animate-rise" style={{ animationDelay: "0.46s" }}>
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder=" "
                                        value={formData.message}
                                        onChange={handleChange}
                                        minLength={10}
                                        maxLength={5000}
                                        rows={6}
                                        required
                                        disabled={loading}
                                        className="peer w-full resize-y rounded-2xl bg-white/70 border border-secondary/10 px-5 pt-7 pb-3 text-secondary outline-none placeholder-transparent transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15 disabled:opacity-60"
                                    />
                                    <label htmlFor="message" className={labelClass}>Message</label>
                                </div>

                                {/* Character counter with progress bar */}
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="flex-1 h-1.5 rounded-full bg-secondary/10 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-linear-to-r from-accent to-accent-2 transition-all duration-300"
                                            style={{ width: `${messagePercent}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-secondary/50 tabular-nums">
                                        {formData.message.length}/5000 characters
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full h-14 rounded-full bg-linear-to-r from-accent via-[#8b7cf6] to-accent [background-size:200%_100%] animate-gradient text-white font-semibold overflow-hidden shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 animate-rise"
                                style={{ animationDelay: "0.53s" }}
                            >
                                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading && (
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                                            <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    {loading ? "Submitting..." : "Send Message"}
                                </span>
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}