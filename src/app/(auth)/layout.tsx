"use client";
import Navigation from "@/components/Navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const { user } = useAuth();
//   useEffect(() => {
//     if (!user) return unauthorized();
//   },[user]);
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
