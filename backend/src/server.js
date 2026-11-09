
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const supabase = require("./lib/supabase");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const authenticateUser = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors({
    origin: "http://localhost:5175",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// GENERAL HEALTH CHECK
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Private Notes App backend is running!"
    });
});

// SUPABASE CONNECTION CHECK
app.get("/api/health/supabase", async (req, res) => {
    const { data, error } = await supabase
        .from("notes")
        .select("id")
        .limit(1);

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Supabase connection failed",
            error: error.message
        });
    }

    res.status(200).json({
        success: true,
        message: "Successfully connected to Supabase!",
        data
    });
});

// AUTHENTICATION ROUTES
app.use("/api/auth", authRoutes);

// NOTES ROUTES
app.use("/api/notes", notesRoutes);

// PROTECTED TEST ROUTE
app.get("/api/protected", authenticateUser, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You have accessed a protected route!",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
