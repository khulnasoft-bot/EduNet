import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">EduNet</h1>
        <p className="text-lg mb-8">
          Production-grade, modular, secure, scalable education platform
        </p>
        <div className="flex gap-4 mb-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">For Students</h2>
            <p>Access courses, assignments, and track your progress</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">For Teachers</h2>
            <p>Manage courses, create assignments, and grade submissions</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">For Parents</h2>
            <p>Monitor your child&apos;s progress and attendance</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">For Tutors</h2>
            <p>Schedule sessions and provide personalized learning</p>
          </div>
        </div>
      </div>
    </main>
  );
}
