
const supabase = require("../lib/supabase");
const { createClient } = require("@supabase/supabase-js");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please log in."
            });
        }

        
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token."
            });
        }

      
        req.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );

        req.user = data.user;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed."
        });
    }
};

module.exports = authenticateUser;
