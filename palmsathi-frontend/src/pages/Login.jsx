import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendOTP, verifyOTP } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import GreenPanel from "../components/GreenPanel";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [step, setStep] = useState("phone");
    const [phone, setPhone] = useState(location.state?.phone || "");
    const [otp, setOtp] = useState("");
    const [devOtp, setDevOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSendOTP(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await sendOTP(phone);
            setDevOtp(res.data.otp);
            setStep("otp");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOTP(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await verifyOTP(phone, otp);
            login(res.data.farmer, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <GreenPanel />

            <div className="flex flex-col justify-center items-center flex-1 px-8 py-12 bg-offwhite">
                <div className="max-w-md w-full">

                    {location.state?.registered && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
                            Account created! Enter your phone number to log in.
                        </div>
                    )}

                    <h1 className="font-heading font-bold text-3xl text-forest mb-1">
                        {step === "phone" ? "Welcome back" : "Enter OTP"}
                    </h1>
                    <p className="text-earth text-sm mb-8 font-body">
                        {step === "phone"
                            ? "Log in to access your farm dashboard"
                            : `We sent a 4-digit OTP to ${phone}`}
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    {step === "phone" ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    Phone number
                                </label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-leaf hover:bg-forest text-white font-heading font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            {devOtp && (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-4 py-3">
                                    Dev mode — your OTP is:{" "}
                                    <span className="font-bold text-lg">{devOtp}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-forest mb-1 font-body">
                                    4-digit OTP
                                </label>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    placeholder="- - - -"
                                    maxLength={4}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-leaf bg-white tracking-widest text-center text-xl"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-leaf hover:bg-forest text-white font-heading font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify & Log in"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep("phone")}
                                className="w-full text-earth text-sm hover:text-forest transition-colors font-body"
                            >
                                ← Change phone number
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-earth mt-6 font-body">
                        New farmer?{" "}
                        <Link to="/register" className="text-leaf font-medium hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}