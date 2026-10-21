import { getSite } from "@/content/getSite";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Pilot } from "@/components/sections/Pilot";
import { Career } from "@/components/sections/Career";
import { Stats } from "@/components/sections/Stats";
import { Races } from "@/components/sections/Races";
import { Partners } from "@/components/sections/Partners";
import { Contact } from "@/components/sections/Contact";
import { Quote } from "@/components/sections/Quote";
import { Banner } from "@/components/motion/Banner";
import { Adventure } from "@/components/sections/Adventure";
import { Future } from "@/components/sections/Future";
import { quotes } from "@/content/story";

// Content edits revalidate instantly (Payload hooks); the daily pass drops races that are over.
export const revalidate = 86400;

export default async function Home() {
  const site = await getSite();
  const { pilot } = site;
  return (
    <>
      <Intro number={pilot.number} />
      <Nav number={pilot.number} />
      <main id="top">
        <Hero pilot={pilot} />
        <Pilot pilot={pilot} />
        <Banner items={[`#${pilot.number}`, `${pilot.firstName} « ${pilot.nickname} »`, pilot.category, pilot.team, pilot.nationality]} />
        <Career seasons={site.seasons} />
        <Future goals={site.future} number={pilot.number} />
        <Quote quote={quotes[0]} />
        <Stats stats={site.stats} />
        <Quote quote={quotes[1]} />
        <Races races={site.races} />
        <Adventure
          events={site.events}
          photos={site.seasons.map((x) => x.image).filter((src) => !src.endsWith(".svg"))}
          portrait={pilot.heroPoster}
          number={pilot.number}
        />
        <Partners partners={site.partners} zones={site.zones} number={pilot.number} />
        <Contact email={site.contactEmail} />
      </main>
      <Footer number={pilot.number} name={`${pilot.firstName} « ${pilot.nickname} »`} email={site.contactEmail} />
    </>
  );
}
