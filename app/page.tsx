import Link from "next/link";

export default function Home() {
  return (
    <main >
      <div className="games-card-container">
      <Link href="/professional_thula" className="game-card">Professional Thula</Link>
      </div>
    </main>
  );
}
