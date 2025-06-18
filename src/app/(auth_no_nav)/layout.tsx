export default function AuthNoNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {}
      <main>
        {children}
      </main>
    </>
  );
}