import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerFarmer } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palmtree, User, Phone, MapPin, CreditCard } from "lucide-react";

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
            setError(err.response?.data?.error || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col bg-forest p-12 text-white">
                <div className="flex items-center gap-2 mb-auto">
                    <Palmtree className="h-7 w-7 text-leaf" />
                    <span className="font-heading font-bold text-2xl">PalmSathi</span>
                </div>
                <div className="my-auto space-y-6">
                    <h2 className="font-heading font-bold text-3xl leading-tight">
                        Join thousands of oil palm farmers growing smarter.
                    </h2>
                    {[
                        ["🌴", "Ripeness prediction", "Know exactly when to harvest"],
                        ["⚡", "Smart mill booking", "Get the best slot before FFB spoils"],
                        ["📋", "Subsidy tracking", "Never miss a govt disbursement"],
                        ["🪙", "Earn rewards", "Points for every good practice"],
                    ].map(([icon, title, desc]) => (
                        <div key={title} className="flex items-start gap-3">
                            <span className="text-2xl">{icon}</span>
                            <div>
                                <p className="font-heading font-semibold text-white text-sm">{title}</p>
                                <p className="font-body text-white/60 text-xs">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="font-body text-white/40 text-xs mt-auto">
                    Free to use · NMEO-OP integrated · Hinglish support
                </p>
            </div>

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <Palmtree className="h-6 w-6 text-leaf" />
                        <span className="font-heading font-bold text-xl text-forest">PalmSathi</span>
                    </div>

                    <Card className="border-0 shadow-none">
                        <CardHeader className="px-0 pb-6">
                            <CardTitle className="text-2xl text-forest">Create account</CardTitle>
                            <CardDescription>Register to start booking mill slots</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 font-body">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Ramesh Naidu" className="pl-9" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} className="pl-9" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Village</Label>
                                        <Input name="village" value={form.village} onChange={handleChange} placeholder="Devarapalli" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>District</Label>
                                        <Input name="district" value={form.district} onChange={handleChange} placeholder="East Godavari" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input name="state" value={form.state} onChange={handleChange} placeholder="Andhra Pradesh" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Aadhaar last 4</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input name="aadhaarLast4" value={form.aadhaarLast4} onChange={handleChange} placeholder="1234" maxLength={4} className="pl-9" />
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating account..." : "Create account"}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground mt-6 font-body">
                                Already registered?{" "}
                                <Link to="/login" className="text-leaf font-medium hover:underline">Log in</Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}