import { Header } from "../components/Header";
import { Nav } from "../components/Nav";

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <Header title="Next.js + Tailwind CSS" />
    </div>
  );
}
