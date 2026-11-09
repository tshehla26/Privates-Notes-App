const express = require("express");
const router = express.Router();

const {
    register,
    login,
    logout
} = require("../controllers/authController");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


router.get("/me", authenticateUser, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

module.exports = router;