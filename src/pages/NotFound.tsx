import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <div className="glass-card rounded-[2rem] p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
          404
        </p>

        <h2 className="text-3xl font-bold text-[color:var(--qu-text)]">
          Tool not found
        </h2>

        <p className="mt-3 hub-muted">
          This tool does not exist yet, or it is planned for a future phase.
        </p>

        <Link to="/" className="premium-button mt-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
