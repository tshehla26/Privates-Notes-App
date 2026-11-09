
const supabase = require("../lib/supabase");


const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (data.session) {
      res.cookie("access_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
      });

      res.cookie("refresh_token", data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    return res.status(201).json({
      success: true,
      message: data.session
        ? "Account created successfully."
        : "Account created. Please check your email to confirm your account.",
      user: data.user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed."
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.cookie("access_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    res.cookie("refresh_token", data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: data.user
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
        success: false,
        message: "Login failed."
    });
}
};


const logout = async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
};

module.exports = {
  register,
  login,
  logout
};
