import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    function updateField(key, value) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (
            form.password !==
            form.confirmPassword
        ) {
            return alert(
                "Passwords do not match."
            );
        }

        try {
            setLoading(true);

            await resetPassword(
                form.email,
                form.otp,
                form.password
            );

            alert(
                "Password reset successfully!"
            );

            navigate("/login");
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
                    Reset Password
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-3"
                    value={form.email}
                    onChange={(e) =>
                        updateField(
                            "email",
                            e.target.value
                        )
                    }
                />

                <input
                    type="text"
                    placeholder="OTP"
                    className="w-full border p-3 rounded mb-3"
                    value={form.otp}
                    onChange={(e) =>
                        updateField(
                            "otp",
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-3 rounded mb-3"
                    value={form.password}
                    onChange={(e) =>
                        updateField(
                            "password",
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-3 rounded mb-5"
                    value={form.confirmPassword}
                    onChange={(e) =>
                        updateField(
                            "confirmPassword",
                            e.target.value
                        )
                    }
                />

                <button
                    className="w-full bg-violet-600 text-white p-3 rounded"
                    disabled={loading}
                >
                    {loading
                        ? "Resetting..."
                        : "Reset Password"}
                </button>
            </form>
        </div>
    );
}