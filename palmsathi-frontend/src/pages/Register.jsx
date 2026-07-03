import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerFarmer } from "../api/auth";
import GreenPanel from "../components/GreenPanel";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", phone: "", village: "", district: "", state: "", aadhaarLast4: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerFarmer(form);
            navigate("/login", { state: { phone: form.phone, registered: true } });
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <GreenPanel />

            <div className="flex flex-col justify-center items-center flex-1 px-8 py-12 bg-offwhite">
                <div className="max-w-md w-full">
                    <h1 className="font-heading font-bold text-3xl text-forest mb-1">
                        Create account
                    </h1>
                    <p className="text-earth text-sm mb-8 font-body">
                        Register to start booking mill slots
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-forest mb-1 font-body">
                                Full name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Ramesh Naidu"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest mb-1 font-body">
                                Phone number
                            </label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="9876543210"
                                maxLength={10}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    Village
                                </label>
                                <input
                                    name="village"
                                    value={form.village}
                                    onChange={handleChange}
                                    placeholder="Devarapalli"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    District
                                </label>
                                <input
                                    name="district"
                                    value={form.district}
                                    onChange={handleChange}
                                    placeholder="East Godavari"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    State
                                </label>
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="Andhra Pradesh"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    Aadhaar last 4
                                </label>
                                <input
                                    name="aadhaarLast4"
                                    value={form.aadhaarLast4}
                                    onChange={handleChange}
                                    placeholder="1234"
                                    maxLength={4}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-leaf hover:bg-forest text-white font-heading font-semibold py-3 rounded-lg transition-colors duration-200 mt-2 disabled:opacity-60"
                        >
                            {loading ? "Registering..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-earth mt-6 font-body">
                        Already registered?{" "}
                        <Link to="/login" className="text-leaf font-medium hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}