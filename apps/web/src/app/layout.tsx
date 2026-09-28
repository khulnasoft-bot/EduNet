import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@edunet/auth';

export const metadata: Metadata = {
  title: 'EduNet - Education Platform',
  description: 'Production-grade, modular, secure, scalable education platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
