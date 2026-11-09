import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const data = await register(email, password);

            setMessage(
                data.message ||
                "Account created! Please check your email to confirm your account."
            );

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800">

                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    Private Notes
                </h1>

                <p className="text-slate-400 text-center mb-8">
                    Create your account to get started.
                </p>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;