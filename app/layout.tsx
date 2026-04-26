import '@/app/globals.css';
import Navbar from '@/app/components/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col" style={{ minHeight: '100dvh' }}>
        <Navbar />
        <main
          className="flex-1 flex flex-col"
          style={{ paddingTop: 'var(--navbar-h)' }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}