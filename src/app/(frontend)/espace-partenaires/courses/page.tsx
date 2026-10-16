import type { Metadata } from "next";
import type { Member, Partner } from "@/payload-types";
import { cancelRaceRegistration } from "@/actions/members";
import { RaceRegistrationForm } from "@/components/members/Forms";
import { getPayloadClient, requireMember } from "@/members/session";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Courses" };

const dateFmt = new Intl.DateTimeFormat("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function RacesPage() {
  const member = await requireMember();
  const payload = await getPayloadClient();
  const today = new Date(new Date().toISOString().slice(0, 10)).toISOString();

  const races = await payload.find({
    collection: "races",
    where: { and: [{ partnersWelcome: { equals: true } }, { date: { greater_than_equal: today } }] },
    sort: "date",
    depth: 0,
    limit: 50,
    pagination: false,
  });
  const ids = races.docs.map((r) => r.id);
  const registrations = ids.length
    ? await payload.find({
        collection: "race-registrations",
        where: { race: { in: ids } },
        // member -> partner, to show who is coming by company
        depth: 2,
        limit: 1000,
        pagination: false,
      })
    : { docs: [] };

  return (
    <main className={s.main}>
      <div>
        <h1 className={s.title}>
          Sur le <span>circuit</span>
        </h1>
        <p className={s.lead}>
          Les courses où l&apos;écurie #105 accueille ses partenaires. Inscrivez-vous, venez avec vos invités et retrouvez les autres
          sponsors au paddock.
        </p>
      </div>

      {races.docs.length === 0 ? (
        <p className={s.empty}>Aucune course ouverte aux partenaires pour le moment. Revenez bientôt !</p>
      ) : (
        <ul className={s.races}>
          {races.docs.map((race) => {
            const regs = registrations.docs.filter((r) => (typeof r.race === "object" ? r.race.id : r.race) === race.id);
            const mine = regs.find((r) => (r.member as Member | null)?.id === member.id);
            const seats = regs.reduce((n, r) => n + 1 + r.guests, 0);
            const left = race.capacity ? race.capacity - seats : null;
            const companies = [
              ...new Set(
                regs.map((r) => ((r.member as Member | null)?.partner as Partner | undefined)?.name).filter((n): n is string => Boolean(n)),
              ),
            ];
            return (
              <li key={race.id} className={s.race}>
                <div className={s.raceInfo}>
                  <p className={`${s.date} mono`}>{dateFmt.format(new Date(race.date))}</p>
                  <h2 className={s.raceName}>{race.name}</h2>
                  <p className={`${s.meta} mono`}>
                    {race.circuit} · {race.country} · {race.category}
                  </p>
                  {race.welcomeInfo && <p className={s.welcome}>{race.welcomeInfo}</p>}
                  <div className={s.block}>
                    <h3>Partenaires présents</h3>
                    {companies.length ? <p>{companies.join(" · ")}</p> : <p className={s.empty}>Soyez le premier !</p>}
                  </div>
                  {left !== null && (
                    <p className={s.small}>{left > 0 ? `${left} place${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""}` : "Complet"}</p>
                  )}
                </div>

                <div className={s.side}>
                  {mine && (
                    <p className={`${s.badge} mono`}>
                      Vous êtes inscrit{mine.guests ? ` · ${mine.guests} invité${mine.guests > 1 ? "s" : ""}` : ""}
                    </p>
                  )}
                  {mine || left === null || left > 0 ? (
                    <RaceRegistrationForm raceId={race.id} guests={mine?.guests ?? 0} note={mine?.note ?? ""} registered={Boolean(mine)} />
                  ) : (
                    <p className={s.empty}>Plus de place disponible.</p>
                  )}
                  {mine && (
                    <form action={cancelRaceRegistration}>
                      <input type="hidden" name="raceId" value={race.id} />
                      <button type="submit" className={`${s.linkButton} ${s.small}`}>
                        Annuler mon inscription
                      </button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
