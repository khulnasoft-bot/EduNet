'use client';

import { useAuth } from '@edunet/auth';
import { Button, Card, CardHeader, CardContent } from '@edunet/ui';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">EduNet Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {user.role}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">My Courses</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage your enrolled courses</p>
              <Button variant="primary" className="w-full">
                View Courses
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Assignments</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Check upcoming assignments and submissions</p>
              <Button variant="primary" className="w-full">
                View Assignments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Profile</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Update your profile information</p>
              <Button variant="primary" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Welcome back, {user.firstName}!</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You are logged in as <strong>{user.email}</strong> with the role of{' '}
              <strong>{user.role}</strong>.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
