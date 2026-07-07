import { useState } from "react";
import API from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddPlotModal({ open, onClose, onPlotAdded }) {
    const { farmer } = useAuth();
    const [form, setForm] = useState({
        label: "", areaInHectares: "", palmCount: "",
        plantingYear: "", soilType: "loamy", lat: "", lng: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                    <DialogDescription>Enter your oil palm plot details to get ripeness predictions and advisory.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Plot name *</Label>
                        <Input name="label" value={form.label} onChange={handleChange} placeholder="e.g. North Plot" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Area (hectares) *</Label>
                            <Input name="areaInHectares" value={form.areaInHectares} onChange={handleChange} type="number" placeholder="2.5" />
                        </div>
                        <div className="space-y-2">
                            <Label>Palm count *</Label>
                            <Input name="palmCount" value={form.palmCount} onChange={handleChange} type="number" placeholder="300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Planting year *</Label>
                            <Input name="plantingYear" value={form.plantingYear} onChange={handleChange} type="number" placeholder="2012" />
                        </div>
                        <div className="space-y-2">
                            <Label>Soil type</Label>
                            <Select value={form.soilType} onValueChange={(val) => setForm({ ...form, soilType: val })}>
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

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Latitude *</Label>
                            <Input name="lat" value={form.lat} onChange={handleChange} type="number" placeholder="16.85" />
                        </div>
                        <div className="space-y-2">
                            <Label>Longitude *</Label>
                            <Input name="lng" value={form.lng} onChange={handleChange} type="number" placeholder="81.65" />
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive font-body">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                            {loading ? "Creating..." : "Create Plot"}
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}