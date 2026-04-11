import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, PencilLine, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError("");
      setIsRateLimited(false);

      try {
        const response = await fetch(`${apiBase}/api/notes/${id}`);

        if (response.status === 429) {
          setIsRateLimited(true);
          setError("Too many requests. Please retry shortly.");
          return;
        }

        if (response.status === 404) {
          setError("Note not found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load note");
        }

        const data = await response.json();
        setNote(data);
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
      } catch (requestError) {
        setError(requestError.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    setIsRateLimited(false);

    try {
      const response = await fetch(`${apiBase}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
        }),
      });

      if (response.status === 429) {
        setIsRateLimited(true);
        toast.error("Too many requests. Please retry in a moment.");
        return;
      }

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message ?? "Failed to update note");
      }

      const updatedNote = await response.json();
      setNote(updatedNote);
      setTitle(updatedNote.title ?? "");
      setContent(updatedNote.content ?? "");
      setIsEditing(false);
      toast.success("Note updated");
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setIsRateLimited(false);

    try {
      const response = await fetch(`${apiBase}/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.status === 429) {
        setIsRateLimited(true);
        toast.error("Too many requests. Please retry in a moment.");
        return;
      }

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message ?? "Failed to delete note");
      }

      toast.success("Note deleted");
      navigate("/");
    } catch (requestError) {
      toast.error(requestError.message || "Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {isRateLimited ? <RateLimitedUI /> : null}

        <Link to="/" className="btn btn-ghost btn-sm w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to notes
        </Link>

        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-base-300/30 sm:p-8">
          {loading ? (
            <div className="flex items-center gap-2 text-base-content/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading note...
            </div>
          ) : null}

          {!loading && error ? <p className="text-error">{error}</p> : null}

          {!loading && !error && note ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl font-black tracking-tight">Note Details</h1>
                <button
                  type="button"
                  onClick={() => setIsEditing((current) => !current)}
                  className="btn btn-outline btn-sm"
                  disabled={saving || deleting}
                >
                  <PencilLine className="h-4 w-4" />
                  {isEditing ? "Cancel edit" : "Edit"}
                </button>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Title</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value.slice(0, 120))}
                  className="input input-bordered w-full"
                  disabled={!isEditing || saving || deleting}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Content</span>
                </div>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value.slice(0, 3000))}
                  className="textarea textarea-bordered min-h-56 w-full"
                  disabled={!isEditing || saving || deleting}
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error btn-outline"
                  disabled={saving || deleting}
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {deleting ? "Deleting..." : "Delete note"}
                </button>

                <button type="submit" className="btn btn-primary" disabled={!isEditing || saving || deleting}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default NoteDetailPage;
