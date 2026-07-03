import jwt from "jsonwebtoken";
import Farmer from "../models/Farmer.js";
import OTPModel from "../models/OTP.js";
import dayjs from "dayjs";

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

function generateToken(farmer) {
    return jwt.sign(
        { id: farmer._id, phone: farmer.phone, name: farmer.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// Step 1: Register a new farmer
export async function register(req, res) {
    try {
        const { name, phone, village, district, state, aadhaarLast4 } = req.body;

        const existing = await Farmer.findOne({ phone });
        if (existing) {
            return res.status(400).json({ error: "A farmer with this phone number already exists." });
        }

        const farmer = await Farmer.create({ name, phone, village, district, state, aadhaarLast4 });
        res.status(201).json({
            message: "Farmer registered successfully. Use /auth/send-otp to log in.",
            farmerId: farmer._id,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Step 2: Send OTP to farmer's phone (mocked - OTP returned in response for demo)
export async function sendOTP(req, res) {
    try {
        const { phone } = req.body;

        const farmer = await Farmer.findOne({ phone });
        if (!farmer) {
            return res.status(404).json({ error: "No farmer found with this phone number. Please register first." });
        }

        // Invalidate any existing unused OTPs for this phone
        await OTPModel.deleteMany({ phone });

        const otp = generateOTP();
        await OTPModel.create({
            phone,
            otp,
            expiresAt: dayjs().add(5, "minute").toDate(),
        });

        // In production: send via SMS/WhatsApp here
        // For demo: return OTP directly in response
        res.json({
            message: "OTP sent successfully.",
            otp, // remove this line in production
            expiresIn: "5 minutes",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Step 3: Verify OTP and return JWT
export async function verifyOTP(req, res) {
    try {
        const { phone, otp } = req.body;

        const otpRecord = await OTPModel.findOne({ phone, used: false });

        if (!otpRecord) {
            return res.status(400).json({ error: "No active OTP found for this number. Please request a new one." });
        }

        if (dayjs().isAfter(dayjs(otpRecord.expiresAt))) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ error: "Incorrect OTP. Please try again." });
        }

        // Mark OTP as used
        otpRecord.used = true;
        await otpRecord.save();

        const farmer = await Farmer.findOne({ phone });
        const token = generateToken(farmer);

        res.json({
            message: "Login successful.",
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                village: farmer.village,
                district: farmer.district,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get logged-in farmer's profile (protected route)
export async function getProfile(req, res) {
    try {
        const farmer = await Farmer.findById(req.farmer.id);
        if (!farmer) return res.status(404).json({ error: "Farmer not found." });
        res.json(farmer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}