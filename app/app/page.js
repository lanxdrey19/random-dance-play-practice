import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Goodbye, Next.js!</h1>
      <Link href="/settings">Settings</Link>
      <Link href="/practice">Practice</Link>
    </>
  );
}
