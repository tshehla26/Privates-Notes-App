
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const { data, error } = await req.supabase
            .from("notes")
            .insert([
                {
                    user_id: req.user.id,
                    title,
                    content
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Note created successfully.",
            note: data
        });

    } catch (error) {
        console.error("Create note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create note."
        });
    }
};


const getNotes = async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("notes")
            .select("*")
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully.",
            notes: data
        });

    } catch (error) {
        console.error("Get notes error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notes."
        });
    }
};


const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const { data, error } = await req.supabase
            .from("notes")
            .update({
                title,
                content,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully.",
            note: data
        });

    } catch (error) {
        console.error("Update note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update note."
        });
    }
};


const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await req.supabase
            .from("notes")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        });

    } catch (error) {
        console.error("Delete note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete note."
        });
    }
};


module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote
};
