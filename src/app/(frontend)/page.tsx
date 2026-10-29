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

// Content edits revalidate instantly (Payload hooks); the daily pass drops races that are over.
export const revalidate = 86400;

export default async function Home() {
  const site = await getSite();
  const { pilot, texts, quotes } = site;
  return (
    <>
      <Intro number={pilot.number} />
      <Nav number={pilot.number} texts={texts.menu} />
      <main id="top">
        <Hero pilot={pilot} alts={site.alts} />
        <Pilot pilot={pilot} texts={texts.pilot} sheet={texts.sheet} />
        <Banner items={[`#${pilot.number}`, `${pilot.firstName} « ${pilot.nickname} »`, pilot.category, pilot.team, pilot.nationality]} />
        <Career seasons={site.seasons} texts={texts.career} alts={site.alts} />
        <Future goals={site.future} number={pilot.number} texts={texts.future} />
        {quotes[0] && <Quote quote={quotes[0]} />}
        <Stats stats={site.stats} texts={texts.stats} />
        {quotes[1] && <Quote quote={quotes[1]} />}
        <Races races={site.races} texts={texts.races} />
        <Adventure
          events={site.events}
          photos={site.seasons.map((x) => x.image).filter((src) => !src.endsWith(".svg"))}
          portrait={pilot.heroPoster}
          number={pilot.number}
          texts={texts.adventure}
          alts={site.alts}
        />
        <Partners partners={site.partners} zones={site.zones} number={pilot.number} texts={texts.partners} />
        <Contact email={site.contactEmail} texts={texts.contact} />
      </main>
      <Footer number={pilot.number} name={`${pilot.firstName} « ${pilot.nickname} »`} email={site.contactEmail} member={texts.menu.member} />
    </>
  );
}
