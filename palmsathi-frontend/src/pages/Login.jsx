import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendOTP, verifyOTP } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palmtree, ArrowRight, Smartphone } from "lucide-react";

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
            setError(err.response?.data?.error || "Failed to send OTP.");
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
            setError(err.response?.data?.error || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col bg-forest p-12 text-white">
                <Link to="/" className="flex items-center gap-2 mb-auto w-fit">
                    <Palmtree className="h-7 w-7 text-leaf" />
                    <span className="font-heading font-bold text-2xl">PalmSathi</span>
                </Link>

                <div className="my-auto">
                    <div className="w-48 h-48 mx-auto mb-8 relative">
                        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="100" cy="100" r="96" fill="#40916C" fillOpacity="0.15" />
                            <rect x="93" y="120" width="14" height="70" rx="7" fill="#7C5C3E" opacity="0.8" />
                            <ellipse cx="100" cy="100" rx="8" ry="70" fill="#40916C" transform="rotate(-40 100 120)" />
                            <ellipse cx="100" cy="100" rx="8" ry="70" fill="#52B788" transform="rotate(-20 100 120)" />
                            <ellipse cx="100" cy="100" rx="8" ry="70" fill="#40916C" transform="rotate(0 100 120)" />
                            <ellipse cx="100" cy="100" rx="8" ry="70" fill="#52B788" transform="rotate(20 100 120)" />
                            <ellipse cx="100" cy="100" rx="8" ry="70" fill="#40916C" transform="rotate(40 100 120)" />
                            <ellipse cx="100" cy="100" rx="7" ry="60" fill="#52B788" transform="rotate(60 100 120)" />
                            <ellipse cx="100" cy="100" rx="7" ry="60" fill="#40916C" transform="rotate(-60 100 120)" />
                            <circle cx="82" cy="112" r="9" fill="#D4A017" />
                            <circle cx="118" cy="112" r="9" fill="#D4A017" />
                            <circle cx="100" cy="118" r="7" fill="#C8960C" />
                        </svg>
                    </div>

                    <h2 className="font-heading font-bold text-3xl mb-3 leading-tight">
                        Harvest smarter.<br />Deliver fresher.<br />Earn better.
                    </h2>
                    <p className="font-body text-leaf/80 text-sm leading-relaxed">
                        Real-time mill slot booking and AI-powered decision support for oil palm farmers across India.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-auto">
                    {[["24-48h", "FFB spoilage window"], ["₹17.8/kg", "Govt min price"], ["NMEO-OP", "Scheme support"]].map(([val, label]) => (
                        <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                            <p className="font-heading font-bold text-leaf text-lg">{val}</p>
                            <p className="font-body text-white/60 text-xs mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm">
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden w-fit">
                        <Palmtree className="h-6 w-6 text-leaf" />
                        <span className="font-heading font-bold text-xl text-forest">PalmSathi</span>
                    </Link>

                    {location.state?.registered && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6 font-body">
                            ✓ Account created! Log in to continue.
                        </div>
                    )}

                    <Card className="border-0 shadow-none">
                        <CardHeader className="px-0 pb-6">
                            <CardTitle className="text-2xl text-forest">
                                {step === "phone" ? "Welcome back" : "Verify OTP"}
                            </CardTitle>
                            <CardDescription>
                                {step === "phone"
                                    ? "Enter your registered phone number"
                                    : `Enter the 4-digit code sent to ${phone}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 font-body">
                                    {error}
                                </div>
                            )}

                            {step === "phone" ? (
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone number</Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="9876543210"
                                                maxLength={10}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    {devOtp && (
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 font-body">
                                            Dev mode — OTP: <span className="font-bold text-lg tracking-widest">{devOtp}</span>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">4-digit OTP</Label>
                                        <Input
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="• • • •"
                                            maxLength={4}
                                            className="text-center text-2xl tracking-widest"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify & Log in"}
                                    </Button>
                                    <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                                        ← Change phone number
                                    </Button>
                                </form>
                            )}

                            <p className="text-center text-sm text-muted-foreground mt-6 font-body">
                                New farmer?{" "}
                                <Link to="/register" className="text-leaf font-medium hover:underline">
                                    Create account
                                </Link>
                            </p>

                            <p className="text-center mt-4">
                                <Link
                                    to="/admin"
                                    className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-body"
                                >
                                    Government Officer Access
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}