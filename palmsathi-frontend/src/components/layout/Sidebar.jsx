import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard, Sprout, Truck, Building2,
    FileText, Coins, LogOut, Palmtree, MessageCircle, X
} from "lucide-react";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", tab: "overview" },
    { icon: Sprout, label: "My Plots", tab: "plots" },
    { icon: Truck, label: "Harvest & Booking", tab: "harvest" },
    { icon: Building2, label: "Mills & Prices", tab: "mills" },
    { icon: FileText, label: "Subsidies", tab: "subsidies" },
    { icon: Coins, label: "Wallet", tab: "wallet" },
    { icon: MessageCircle, label: "PalmSathi Bot", tab: "chatbot" },
];

export default function Sidebar({ activeTab, onTabChange, walletPoints, isOpen, onClose }) {
    const { farmer, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function handleTabClick(tab) {
        onTabChange(tab);
        onClose?.();
    }

    return (
        <>
            {/* Mobile backdrop — closes the drawer when tapped */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`w-64 min-h-screen bg-forest flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Palmtree className="h-6 w-6 text-leaf" />
                            <span className="font-heading font-bold text-white text-xl">PalmSathi</span>
                        </div>
                        <p className="text-xs text-leaf/70 font-body">Digital Farm Platform</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="lg:hidden text-white/70 hover:text-white -mt-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <Separator className="bg-white/10" />

                {/* Farmer info */}
                <div className="p-4">
                    <div className="bg-white/10 rounded-lg p-3">
                        <p className="font-heading font-semibold text-white text-sm truncate">{farmer?.name}</p>
                        <p className="font-body text-xs text-leaf/80 truncate">{farmer?.village}, {farmer?.district}</p>
                        <div className="mt-2 flex items-center gap-1">
                            <Coins className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs font-body text-yellow-400 font-semibold">{walletPoints} points</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 overflow-y-auto">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.tab;
                            return (
                                <button
                                    key={item.tab}
                                    onClick={() => handleTabClick(item.tab)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${isActive
                                        ? "bg-leaf text-white font-medium"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <Separator className="bg-white/10" />

                {/* Logout */}
                <div className="p-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start gap-3 font-body"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </>
    );
}
