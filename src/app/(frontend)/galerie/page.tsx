import type { Metadata } from "next";
import { getGallery, getSeo, getSite } from "@/content/getSite";
import { Gallery } from "@/components/Gallery";

export async function generateMetadata(): Promise<Metadata> {
  const [{ number }, site] = await Promise.all([getSeo(), getSite()]);
  return { title: `${site.texts.gallery.kicker} — #${number}`, description: site.texts.gallery.lead };
}

// Same rhythm as the home page: content edits revalidate it instantly (Payload hooks).
export const revalidate = 86400;

export default async function GalleryPage() {
  const [events, site] = await Promise.all([getGallery(), getSite()]);
  return <Gallery events={events} number={site.pilot.number} texts={site.texts.gallery} />;
}
