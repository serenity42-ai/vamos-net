"use client";

export default function ScoresError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-[#0F1F2E] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          The scores page encountered an error. This is usually temporary.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#4ABED9] text-white font-semibold rounded-lg hover:bg-[#3ba8c3] transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
