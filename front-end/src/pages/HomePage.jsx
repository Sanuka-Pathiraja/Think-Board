import { useEffect, useState } from "react";
import { Link } from "react-router";
import RateLimitedUI from "../components/RateLimitedUI";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${apiBase}/api/notes`);

        if (response.status === 429) {
          setIsRateLimited(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load notes");
        }

        const data = await response.json();
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading notes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen p-6">
      {isRateLimited && <RateLimitedUI />}

      <h1 className="mb-4 text-2xl font-bold">Notes</h1>

      {loading ? <p>Loading...</p> : null}

      {!loading && notes.length === 0 ? <p>No notes found.</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <Link
            key={note._id}
            to={`/notes/${note._id}`}
            className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <p className="mt-2 text-sm text-base-content/80">{note.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;