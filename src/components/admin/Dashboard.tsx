import Link from "next/link";
import type { ServerProps } from "payload";
import { siteSections, sitePath, editPath } from "@/admin/sections";

type Summary = { text: string; todo?: string };

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;
const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
const dateFmt = new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Admin home: the public page as an ordered list of sections, each with its status and shortcuts. */
export async function Dashboard({ payload, user }: ServerProps) {
  const today = new Date(new Date().toISOString().slice(0, 10)).toISOString();

  const [pilot, stats, pitch, zones, settings, seasons, seasonsNoPhoto, races, partners] = await Promise.all([
    payload.findGlobal({ slug: "pilot", depth: 0 }),
    payload.findGlobal({ slug: "stats" }),
    payload.findGlobal({ slug: "pitch" }),
    payload.findGlobal({ slug: "zones" }),
    payload.findGlobal({ slug: "settings" }),
    payload.count({ collection: "seasons" }),
    payload.count({ collection: "seasons", where: { image: { exists: false } } }),
    payload.find({ collection: "races", where: { date: { greater_than_equal: today } }, sort: "date", limit: 1 }),
    payload.count({ collection: "partners" }),
  ]);

  const next = races.docs[0];
  const daysToNext = next ? daysUntil(next.date) : null;

  const summaries: Summary[] = [
    { text: `${pilot.firstName ?? "—"} « ${pilot.nickname ?? "—"} » #${pilot.number ?? "—"}`, todo: pilot.heroImage ? undefined : "Photo d'ouverture à ajouter" },
    { text: `${pilot.age ?? "—"} ans · ${pilot.category ?? "—"} · ${pilot.team ?? "—"}` },
    { text: plural(seasons.totalDocs, "saison", "saisons"), todo: seasonsNoPhoto.totalDocs ? `${plural(seasonsNoPhoto.totalDocs, "photo", "photos")} à ajouter` : undefined },
    { text: plural(stats.items?.length ?? 0, "chiffre", "chiffres") },
    { text: next ? `Prochaine : ${next.name}` : "Aucune course à venir", todo: next ? undefined : "Ajouter une course" },
    { text: plural(pitch.items?.length ?? 0, "argument", "arguments") },
    { text: `${plural(zones.items?.length ?? 0, "zone", "zones")} · ${plural(partners.totalDocs, "partenaire", "partenaires")}` },
    { text: settings.contactEmail ?? "—", todo: settings.contactEmail ? undefined : "E-mail à renseigner" },
  ];

  const todos = summaries.filter((s) => s.todo).length;

  return (
    <div className="doudou-dash">
      <header className="doudou-dash__head">
        <div>
          <p className="doudou-dash__eyebrow">Bonjour{user?.email ? `, ${user.email.split("@")[0]}` : ""}</p>
          <h1 className="doudou-dash__title">Le site, section par section</h1>
          <p className="doudou-dash__lead">
            Chaque bloc correspond à une partie de la page, dans l&apos;ordre où les visiteurs la découvrent.
            {todos > 0 && <strong> {plural(todos, "point", "points")} à compléter.</strong>}
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener" className="doudou-view-site doudou-view-site--big">
          Voir le site <span aria-hidden>↗</span>
        </a>
      </header>

      {next && daysToNext !== null && (
        <Link href={`/admin/collections/races/${next.id}`} className="doudou-next">
          <span className="doudou-next__days">J-{Math.max(0, daysToNext)}</span>
          <span className="doudou-next__info">
            <span className="doudou-next__label">Prochaine course</span>
            <span className="doudou-next__name">{next.name}</span>
            <span>
              {next.circuit} · {dateFmt.format(new Date(next.date))}
            </span>
          </span>
        </Link>
      )}

      <ol className="doudou-sections">
        {siteSections.map((section, i) => {
          const summary = summaries[i];
          return (
            <li key={section.anchor} className="doudou-section">
              <span className="doudou-section__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="doudou-section__body">
                <h2 className="doudou-section__title">{section.title}</h2>
                <p className="doudou-section__hint">{section.hint}</p>
                <p className="doudou-section__summary">
                  {summary.text}
                  {summary.todo && <span className="doudou-badge">{summary.todo}</span>}
                </p>
              </div>
              <div className="doudou-section__actions">
                <Link href={editPath(section.edit)} className="doudou-btn doudou-btn--primary">
                  Modifier
                </Link>
                <a href={sitePath(section.anchor)} target="_blank" rel="noopener" className="doudou-btn">
                  Voir <span aria-hidden>↗</span>
                </a>
              </div>
            </li>
          );
        })}
      </ol>

      <nav className="doudou-more" aria-label="Autres réglages">
        <Link href="/admin/collections/media">Médias (photos et vidéos)</Link>
        <Link href="/admin/collections/partners">Partenaires</Link>
        <Link href="/admin/collections/users">Administrateurs</Link>
      </nav>
    </div>
  );
}
