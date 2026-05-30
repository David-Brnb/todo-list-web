import { Link } from "react-router";
import { Compass } from "lucide-react";

/**
 * Catch-all 404 page. Rendered at the root level (outside the auth/app guards)
 * so it shows for any unknown URL regardless of login state, without the app
 * sidebar chrome.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        <Compass className="h-7 w-7" />
      </span>
      <p className="text-sm font-medium uppercase tracking-wide text-stone-400">
        Error 404
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-stone-600">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/home"
        className="mt-6 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
      >
        Back to home
      </Link>
    </div>
  );
}
