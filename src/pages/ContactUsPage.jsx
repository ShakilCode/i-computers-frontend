
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

    return (
        <div className="min-h-screen bg-primary px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-2xl border border-secondary/30 bg-white p-6 shadow-2xl sm:p-10">

                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-3 text-3xl font-bold text-gray-900">
                        Contact Us
                    </h1>

                    <p className="text-gray-600">
                        Have a question or need assistance?
                        Send us a message and we'll get back to you.
                    </p>
                </div>

                {/* noValidate disables browser validation popups */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                >
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            required
                            disabled={loading}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={254}
                            autoComplete="email"
                            required
                            disabled={loading}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label
                            htmlFor="subject"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Subject
                        </label>

                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What is your message about?"
                            value={formData.subject}
                            onChange={handleChange}
                            minLength={3}
                            maxLength={150}
                            required
                            disabled={loading}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label
                            htmlFor="message"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Message
                        </label>

                        <textarea
                            id="message"
                            name="message"
                            placeholder="Write your message here..."
                            value={formData.message}
                            onChange={handleChange}
                            minLength={10}
                            maxLength={5000}
                            rows={6}
                            required
                            disabled={loading}
                            className="w-full resize-y rounded-lg border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                        />

                        <p className="mt-1 text-right text-sm text-gray-500">
                            {formData.message.length}/5000 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-accent p-3 font-bold text-white transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Send Message"}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Need to sign in?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-accent hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
