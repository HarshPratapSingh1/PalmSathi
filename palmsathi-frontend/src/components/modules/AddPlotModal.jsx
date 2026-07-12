import { useState } from "react";
import API from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

export default function AddPlotModal({ open, onClose, onPlotAdded }) {
    const { farmer } = useAuth();
    const [form, setForm] = useState({
        label: "", areaInHectares: "", palmCount: "",
        plantingYear: "", soilType: "loamy", lat: "", lng: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleGetLocation() {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }
        setLocating(true);
        setLocationError("");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((prev) => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                }));
                setLocating(false);
            },
            () => {
                setLocationError("Could not get location. Please enter manually.");
                setLocating(false);
            }
        );
    }

    async function handleSubmit() {
        if (!form.label || !form.areaInHectares || !form.palmCount || !form.plantingYear || !form.lat || !form.lng) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await API.post("/plots", {
                farmerId: farmer.id,
                label: form.label,
                areaInHectares: Number(form.areaInHectares),
                palmCount: Number(form.palmCount),
                plantingYear: Number(form.plantingYear),
                soilType: form.soilType,
                location: { lat: Number(form.lat), lng: Number(form.lng) },
            });
            onPlotAdded();
            onClose();
            setForm({ label: "", areaInHectares: "", palmCount: "", plantingYear: "", soilType: "loamy", lat: "", lng: "" });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create plot.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>🌱 Add New Plot</DialogTitle>
                    <DialogDescription>
                        Enter your oil palm plot details to get ripeness predictions and advisory.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Plot name */}
                    <div className="space-y-2">
                        <Label>Plot name *</Label>
                        <Input
                            name="label"
                            value={form.label}
                            onChange={handleChange}
                            placeholder="e.g. North Plot"
                        />
                    </div>

                    {/* Area + Palm count */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Area (hectares) *</Label>
                            <Input
                                name="areaInHectares"
                                value={form.areaInHectares}
                                onChange={handleChange}
                                type="number"
                                placeholder="2.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Palm count *</Label>
                            <Input
                                name="palmCount"
                                value={form.palmCount}
                                onChange={handleChange}
                                type="number"
                                placeholder="300"
                            />
                        </div>
                    </div>

                    {/* Planting year + Soil type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Planting year *</Label>
                            <Input
                                name="plantingYear"
                                value={form.plantingYear}
                                onChange={handleChange}
                                type="number"
                                placeholder="2012"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Soil type</Label>
                            <Select
                                value={form.soilType}
                                onValueChange={(val) => setForm({ ...form, soilType: val })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="loamy">Loamy</SelectItem>
                                    <SelectItem value="alluvial">Alluvial</SelectItem>
                                    <SelectItem value="clay">Clay</SelectItem>
                                    <SelectItem value="sandy">Sandy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Location *</Label>
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={locating}
                                className="flex items-center gap-1.5 text-xs font-body text-leaf hover:text-forest transition-colors disabled:opacity-50"
                            >
                                <MapPin className="h-3.5 w-3.5" />
                                {locating ? "Getting location..." : "Use my location"}
                            </button>
                        </div>

                        {locationError && (
                            <p className="text-xs text-destructive font-body">{locationError}</p>
                        )}

                        {form.lat && form.lng && (
                            <div className="flex items-center gap-1.5 text-xs font-body text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                <MapPin className="h-3 w-3 shrink-0" />
                                Location captured: {Number(form.lat).toFixed(4)}°N, {Number(form.lng).toFixed(4)}°E
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                name="lat"
                                value={form.lat}
                                onChange={handleChange}
                                type="number"
                                placeholder="Latitude e.g. 16.85"
                            />
                            <Input
                                name="lng"
                                value={form.lng}
                                onChange={handleChange}
                                type="number"
                                placeholder="Longitude e.g. 81.65"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive font-body">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                            {loading ? "Creating..." : "Create Plot"}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}