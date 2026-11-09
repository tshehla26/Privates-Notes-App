
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
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
                    Welcome back. Sign in to your account.
                </p>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
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
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300">
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
