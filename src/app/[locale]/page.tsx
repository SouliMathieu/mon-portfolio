import Hero from "@/components/sections/Hero";
import NebulaBackground from "@/components/sections/NebulaBackground";
import Globe from "@/components/sections/Globe";
import ExpertiseCards from "@/components/sections/ExpertiseCards";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center">
      <NebulaBackground />
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        <Hero />
        <div className="hidden lg:block relative flex-shrink-0 pr-12">
          <Globe />
          <ExpertiseCards />
        </div>
      </div>
    </main>
  );
}