import { AlertCircle } from "lucide-react";

// 404 Page
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            404 - Page Not Found
          </h1>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Oops! Looks like the page you’re looking for doesn’t exist.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
