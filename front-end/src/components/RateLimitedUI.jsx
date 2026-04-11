import { AlertTriangle, RefreshCcw } from "lucide-react";

function RateLimitedUI() {
  return (
    <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5 shadow-lg shadow-amber-100/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-900">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Rate limit active</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Requests are temporarily paused</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
              The API has reached its current limit. You can keep browsing the cached preview while the service resets.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry now
        </button>
      </div>
    </div>
  );
}

export default RateLimitedUI;