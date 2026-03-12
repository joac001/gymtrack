import { auth } from "@/auth";
import Header from "./Header";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div
      style={{ minHeight: "100dvh", background: "var(--background)" }}
    >
      <Header userName={session?.user?.name} userImage={session?.user?.image} />
      <main className="mx-auto max-w-2xl lg:max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
