import { getSite } from "@/content/getSite";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Pilot } from "@/components/sections/Pilot";
import { Career } from "@/components/sections/Career";
import { Stats } from "@/components/sections/Stats";
import { Races } from "@/components/sections/Races";
import { Pitch } from "@/components/sections/Pitch";
import { Partners } from "@/components/sections/Partners";
import { Contact } from "@/components/sections/Contact";

// Content edits revalidate instantly (Payload hooks); the daily pass drops races that are over.
export const revalidate = 86400;

export default async function Home() {
  const site = await getSite();
  const { pilot } = site;
  return (
    <>
      <Nav number={pilot.number} />
      <main id="top">
        <Hero pilot={pilot} />
        <Pilot pilot={pilot} />
        <Career seasons={site.seasons} />
        <Stats stats={site.stats} />
        <Races races={site.races} />
        <Pitch pitch={site.pitch} nickname={pilot.nickname} />
        <Partners partners={site.partners} zones={site.zones} number={pilot.number} />
        <Contact email={site.contactEmail} />
      </main>
      <Footer number={pilot.number} name={`${pilot.firstName} « ${pilot.nickname} »`} email={site.contactEmail} />
    </>
  );
}
