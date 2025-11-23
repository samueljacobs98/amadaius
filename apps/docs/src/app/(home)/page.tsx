import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Amadaius Docs</h1>
      <p className="text-fd-muted-foreground">
        View the{" "}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          documentation
        </Link>
      </p>
    </main>
  );
}
