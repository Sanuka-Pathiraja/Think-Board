import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import RateLimitedUI from "../components/RateLimitedUI";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

function CreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    setIsRateLimited(false);

    try {
      const response = await fetch(`${apiBase}/api/notes`, {
        method: "POST",
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
        const message = errorPayload?.message ?? "Failed to create note";
        throw new Error(message);
      }

      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-200/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {isRateLimited ? <RateLimitedUI /> : null}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-base-300/30 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">Create New Note</h1>
          <p className="mt-2 text-sm text-base-content/70">Capture what matters now and organize it later.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">Title</span>
                <span className="label-text-alt text-base-content/60">{title.length}/120</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value.slice(0, 120))}
                placeholder="Add a clear title"
                className="input input-bordered w-full"
                disabled={loading}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold">Content</span>
                <span className="label-text-alt text-base-content/60">{content.length}/3000</span>
              </div>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value.slice(0, 3000))}
                placeholder="Write your note here..."
                className="textarea textarea-bordered min-h-48 w-full"
                disabled={loading}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-base-content/60">Required fields: title and content</p>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {loading ? "Saving..." : "Save note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
