import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { farmer, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-forest text-white px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-xl">🌴</span>
                <span className="font-heading font-bold text-lg tracking-tight">PalmSathi</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-body text-leaf">
                    {farmer?.name} · {farmer?.district}
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-leaf hover:bg-offwhite hover:text-forest font-body px-4 py-1.5 rounded-lg transition-colors duration-200"
                >
                    Log out
                </button>
            </div>
        </nav>
    );
}