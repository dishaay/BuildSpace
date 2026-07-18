import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            await forgotPassword(email);

            alert("OTP sent successfully!");

            navigate("/reset-password");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-[400px] p-6 border rounded-lg"
            >
                <h1 className="text-2xl font-bold mb-5">
                    Forgot Password
                </h1>

                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border p-3 rounded mb-4"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <button
                    className="w-full bg-violet-600 text-white p-3 rounded"
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send OTP"}
                </button>
            </form>
        </div>
    );
}