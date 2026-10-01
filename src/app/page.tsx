import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/hero/Hero";
import { Nav } from "@/components/nav/Nav";
import { Events } from "@/components/sections/events/Events";
import { Join } from "@/components/sections/join/Join";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";
import { Programs } from "@/components/sections/programs/Programs";
import { Projects } from "@/components/sections/projects/Projects";
import { Team } from "@/components/sections/team/Team";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Programs />
        <Projects />
        <Events />
        <Team />
        <Join />
      </main>
      <Footer />
    </>
  );
}
