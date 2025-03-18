export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation is now rendered via NavigationWrapper in the root layout */}
      {/* Main content area with centered auth forms */}
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
} 