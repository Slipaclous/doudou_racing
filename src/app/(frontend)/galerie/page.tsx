import type { Metadata } from "next";
import { getGallery, getSeo, getSite } from "@/content/getSite";
import { Gallery } from "@/components/Gallery";

export async function generateMetadata(): Promise<Metadata> {
  const [{ number, image }, site] = await Promise.all([getSeo(), getSite()]);
  const title = `${site.texts.gallery.kicker} — #${number}`;
  const description = site.texts.gallery.lead;
  // The share preview shows the newest event photo when there is one.
  const photo = site.events.find((e) => e.photos.length)?.photos[0] ?? image;
  return { title, description, openGraph: { title, description, images: [photo] }, twitter: { title, description, images: [photo] } };
}

// Same rhythm as the home page: content edits revalidate it instantly (Payload hooks).
export const revalidate = 86400;

export default async function GalleryPage() {
  const [{ events, alts }, site] = await Promise.all([getGallery(), getSite()]);
  return <Gallery events={events} number={site.pilot.number} texts={site.texts.gallery} alts={alts} />;
}
