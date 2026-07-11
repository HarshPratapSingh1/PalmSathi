/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            colors: {
                border: "#e5e7eb",
                input: "#e5e7eb",
                ring: "#40916C",
                background: "#FAFAF7",
                foreground: "#1B4332",
                primary: {
                    DEFAULT: "#1B4332",
                    foreground: "#FAFAF7",
                },
                secondary: {
                    DEFAULT: "#40916C",
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#f0f0ec",
                    foreground: "#6b7280",
                },
                accent: {
                    DEFAULT: "#e8f0eb",
                    foreground: "#1B4332",
                },
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#1B4332",
                },
                forest: "#1B4332",
                leaf: "#40916C",
                earth: "#7C5C3E",
                offwhite: "#FAFAF7",
            },
            borderRadius: {
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.375rem",
            },
            fontFamily: {
                heading: ["Poppins", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};