
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    FileText,
    Edit3,
    Trash2,
    LogOut,
    X,
    LockKeyhole,
    Clock3,
    Sparkles
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showEditor, setShowEditor] = useState(false);

    // FETCH NOTES
    const fetchNotes = async () => {
        try {
            setError("");
            const data = await apiRequest("/notes");
            setNotes(data.notes || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // CREATE OR UPDATE NOTE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Please complete both fields.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            if (editingId) {
                await apiRequest(`/notes/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim()
                    })
                });
            } else {
                await apiRequest("/notes", {
                    method: "POST",
                    body: JSON.stringify({
                        title: title.trim(),
                        content: content.trim()
                    })
                });
            }

            setTitle("");
            setContent("");
            setEditingId(null);
            setShowEditor(false);

            await fetchNotes();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // OPEN EDITOR
    const handleEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setShowEditor(true);
        setError("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // CLOSE EDITOR
    const closeEditor = () => {
        setShowEditor(false);
        setEditingId(null);
        setTitle("");
        setContent("");
        setError("");
    };

    // DELETE NOTE
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await apiRequest(`/notes/${id}`, {
                method: "DELETE"
            });

            await fetchNotes();
        } catch (err) {
            setError(err.message);
        }
    };

    // LOGOUT
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    // SEARCH NOTES
    const filteredNotes = notes.filter((note) =>
        `${note.title} ${note.content}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // FORMAT DATE
    const formatDate = (date) => {
        if (!date) return "Recently";

        return new Date(date).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="min-h-screen bg-[#09090f] text-slate-100">

            <div className="flex min-h-screen">

                {/* SIDEBAR */}
                <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0d0d16] p-6 md:flex md:flex-col">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
                            <LockKeyhole size={20} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight">
                                Private Notes
                            </h1>
                            <p className="text-xs text-slate-500">
                                Your personal workspace
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-600">
                            Workspace
                        </p>

                        <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300">
                            <FileText size={18} />
                            All Notes
                            <span className="ml-auto rounded-md bg-violet-500/20 px-2 py-0.5 text-xs">
                                {notes.length}
                            </span>
                        </div>
                    </div>

                    <div className="mt-10 rounded-2xl border border-white/5 bg-white/2 p-4">
                        <div className="mb-3 flex items-center gap-2 text-violet-300">
                            <Sparkles size={16} />
                            <span className="text-sm font-semibold">
                                Your private space
                            </span>
                        </div>

                        <p className="text-xs leading-6 text-slate-500">
                            Keep your thoughts, ideas and important information in one secure place.
                        </p>
                    </div>

                    <div className="mt-auto border-t border-white/5 pt-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 font-semibold text-violet-300">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    Your Account
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                            <LogOut size={17} />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* MAIN AREA */}
                <main className="min-w-0 flex-1">

                    {/* TOP NAVIGATION */}
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-[#0d0d16]/80 px-5 py-5 sm:px-8">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 md:hidden">
                                <LockKeyhole size={18} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Your workspace
                                </p>
                                <p className="text-xs text-slate-600 md:hidden">
                                    Private Notes
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white md:hidden"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 sm:flex">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-xs text-emerald-400">
                                Private workspace
                            </span>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">

                        {/* WELCOME SECTION */}
                        <section className="mb-10">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-400">
                                <Sparkles size={16} />
                                YOUR PERSONAL SPACE
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Welcome back.
                            </h2>

                            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                                Your thoughts deserve a space of their own. Capture ideas, organise your notes and keep everything in one place.
                            </p>
                        </section>

                        {/* STATS */}
                        <section className="mb-8 grid gap-4 sm:grid-cols-2">

                            <div className="rounded-2xl border border-white/5 bg-[#11111c] p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-slate-400">
                                        Total Notes
                                    </span>
                                    <FileText size={19} className="text-violet-400" />
                                </div>

                                <p className="text-3xl font-bold">
                                    {notes.length}
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    Notes in your workspace
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-[#11111c] p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-slate-400">
                                        Workspace Status
                                    </span>
                                    <LockKeyhole size={19} className="text-emerald-400" />
                                </div>

                                <p className="text-3xl font-bold text-emerald-400">
                                    Active
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    Your private workspace is ready
                                </p>
                            </div>

                        </section>

                        {/* NOTES HEADING */}
                        <section>

                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                <div>
                                    <h3 className="text-xl font-bold">
                                        Your Notes
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage your thoughts and ideas.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        closeEditor();
                                        setShowEditor(true);
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
                                >
                                    <Plus size={18} />
                                    Create Note
                                </button>

                            </div>

                            {/* SEARCH */}
                            <div className="relative mb-6">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search your notes..."
                                    className="w-full rounded-xl border border-white/5 bg-[#11111c] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50"
                                />
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* NOTE EDITOR */}
                            {showEditor && (
                                <div className="mb-8 rounded-2xl border border-violet-500/20 bg-[#11111c] p-5 sm:p-7">

                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-lg font-semibold">
                                                {editingId ? "Edit Note" : "Create a Note"}
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Save your thoughts in your private workspace.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={closeEditor}
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                                        >
                                            <X size={19} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Give your note a title..."
                                            required
                                            className="w-full rounded-xl border border-white/5 bg-[#09090f] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/50"
                                        />

                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Start writing..."
                                            rows={7}
                                            required
                                            className="w-full resize-y rounded-xl border border-white/5 bg-[#09090f] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-600 focus:border-violet-500/50"
                                        />

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50"
                                            >
                                                {saving ? "Saving..." : editingId ? "Save Changes" : "Save Note"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={closeEditor}
                                                className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:bg-white/5"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            )}

                            {/* NOTES GRID */}
                            {loading ? (
                                <div className="rounded-2xl border border-white/5 bg-[#11111c] p-12 text-center text-sm text-slate-500">
                                    Loading your notes...
                                </div>
                            ) : filteredNotes.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-[#11111c]/50 px-6 py-16 text-center">

                                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                                        <FileText size={25} />
                                    </div>

                                    <h4 className="text-lg font-semibold">
                                        {search ? "No matching notes" : "Your workspace is empty"}
                                    </h4>

                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                        {search
                                            ? "Try searching with a different keyword."
                                            : "Start building your personal collection. Your first note is just one click away."}
                                    </p>

                                    {!search && (
                                        <button
                                            onClick={() => setShowEditor(true)}
                                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
                                        >
                                            <Plus size={17} />
                                            Create your first note
                                        </button>
                                    )}

                                </div>
                            ) : (
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                                    {filteredNotes.map((note) => (
                                        <article
                                            key={note.id}
                                            className="group flex min-h-56 flex-col rounded-2xl border border-white/5 bg-[#11111c] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#151522]"
                                        >

                                            <div className="mb-5 flex items-start justify-between">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                                    <FileText size={19} />
                                                </div>

                                                <span className="text-xs text-slate-600">
                                                    {formatDate(note.updated_at || note.created_at)}
                                                </span>
                                            </div>

                                            <h4 className="mb-3 wrap-break-word text-base font-semibold">
                                                {note.title}
                                            </h4>

                                            <p className="mb-6 flex-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-500">
                                                {note.content}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-4">

                                                <div className="flex items-center gap-1 text-xs text-slate-600">
                                                    <Clock3 size={13} />
                                                    Private note
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(note)}
                                                        title="Edit note"
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-500/10 hover:text-violet-400"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(note.id)}
                                                        title="Delete note"
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                            </div>
                                        </article>
                                    ))}

                                </div>
                            )}

                        </section>

                        {/* FOOTER */}
                        <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-slate-600">
                            Private Notes · Your thoughts, your space.
                        </footer>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
