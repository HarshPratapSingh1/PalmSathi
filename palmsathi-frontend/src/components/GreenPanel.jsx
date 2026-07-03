export default function GreenPanel() {
    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest text-offwhite p-12 w-[45%] min-h-screen">
            {/* Logo */}
            <div>
                <span className="font-heading font-bold text-2xl tracking-tight">
                    🌴 PalmSathi
                </span>
            </div>

            {/* SVG Oil Palm Illustration */}
            <div className="flex justify-center">
                <svg viewBox="0 0 200 300" className="w-64 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* trunk */}
                    <rect x="93" y="160" width="14" height="130" rx="7" fill="#7C5C3E" opacity="0.7" />
                    {/* leaves */}
                    <ellipse cx="100" cy="100" rx="8" ry="80" fill="#40916C" transform="rotate(-40 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="80" fill="#52B788" transform="rotate(-20 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="80" fill="#40916C" transform="rotate(0 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="80" fill="#52B788" transform="rotate(20 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="80" fill="#40916C" transform="rotate(40 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="70" fill="#52B788" transform="rotate(60 100 160)" />
                    <ellipse cx="100" cy="100" rx="8" ry="70" fill="#40916C" transform="rotate(-60 100 160)" />
                    {/* fruit bunches */}
                    <circle cx="78" cy="148" r="10" fill="#D4A017" opacity="0.9" />
                    <circle cx="122" cy="148" r="10" fill="#D4A017" opacity="0.9" />
                    <circle cx="100" cy="155" r="8" fill="#C8960C" opacity="0.9" />
                </svg>
            </div>

            {/* Tagline */}
            <div>
                <p className="font-heading font-semibold text-2xl leading-snug mb-3">
                    Harvest smarter.<br />Deliver fresher.<br />Earn better.
                </p>
                <p className="text-leaf text-sm font-body leading-relaxed">
                    Real-time mill slot booking and decision support for oil palm farmers across India.
                </p>
            </div>
        </div>
    );
}