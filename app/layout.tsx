import '@/app/globals.css';
import Navbar from '@/app/components/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">{children}</main>
      </body>
    </html>
  );
}