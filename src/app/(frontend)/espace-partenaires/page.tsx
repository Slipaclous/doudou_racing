import type { Metadata } from "next";
import Link from "next/link";
import type { Media, Partner } from "@/payload-types";
import { ContactPartnerForm } from "@/components/members/Forms";
import { getPayloadClient, memberPartnerId, requireMember } from "@/members/session";
import s from "@/components/members/members.module.css";

export const metadata: Metadata = { title: "Annuaire" };

const tiers: Record<Partner["tier"], string> = {
  principal: "Partenaire principal",
  officiel: "Partenaire officiel",
  fournisseur: "Fournisseur",
};

const logoUrl = (logo: Partner["logo"]) => (typeof logo === "object" ? (logo as Media | null)?.url : undefined);

export default async function DirectoryPage({ searchParams }: PageProps<"/espace-partenaires">) {
  const member = await requireMember();
  const mine = memberPartnerId(member);
  const { niveau } = await searchParams;
  const tier = typeof niveau === "string" && niveau in tiers ? (niveau as Partner["tier"]) : undefined;

  const payload = await getPayloadClient();
  const [partners, members] = await Promise.all([
    payload.find({
      collection: "partners",
      where: tier ? { tier: { equals: tier } } : undefined,
      sort: "order",
      depth: 1,
      limit: 100,
      pagination: false,
    }),
    // Names and job titles only: e-mails are never shown, contact goes through the form.
    payload.find({ collection: "members", depth: 0, limit: 500, pagination: false, select: { name: true, jobTitle: true, partner: true } }),
  ]);

  const peopleOf = (id: number) => members.docs.filter((m) => m.partner === id);
  const filters = [{ value: undefined, label: "Tous" }, ...Object.entries(tiers).map(([value, label]) => ({ value, label }))];

  return (
    <main className={s.main}>
      <div>
        <h1 className={s.title}>
          Bonjour <span>{member.name.split(" ")[0]}</span>
        </h1>
        <p className={s.lead}>
          Les entreprises qui soutiennent l&apos;écurie #105. Écrivez-leur directement : votre message part par e-mail et la réponse
          arrive dans votre boîte. Pensez à compléter <Link href="/espace-partenaires/profil" className={s.small}>votre profil</Link>.
        </p>
      </div>

      <nav className={`${s.filters} mono`} aria-label="Filtrer par niveau">
        {filters.map((f) => (
          <Link key={f.label} href={f.value ? `?niveau=${f.value}` : "?"} aria-current={f.value === tier}>
            {f.label}
          </Link>
        ))}
      </nav>

      <ul className={s.grid}>
        {partners.docs.map((p) => {
          const people = peopleOf(p.id);
          const logo = logoUrl(p.logo);
          const isMine = p.id === mine;
          return (
            <li key={p.id} className={`${s.card} ${isMine ? s.cardMine : ""}`}>
              <div className={s.cardHead}>
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small logos from Payload, no layout to optimise
                  <img src={logo} alt="" className={s.logo} loading="lazy" />
                ) : (
                  <span className={s.logoText} aria-hidden>{p.name.charAt(0)}</span>
                )}
                <div>
                  <h2 className={s.name}>{p.name}</h2>
                  <p className={`${s.meta} mono`}>
                    <span className={s.tier}>{tiers[p.tier]}</span>
                    {p.sector && <> · {p.sector}</>}
                  </p>
                </div>
              </div>

              {p.description && <p className={s.small}>{p.description}</p>}

              <div className={s.block}>
                <h3>Propose</h3>
                {p.offer ? <p>{p.offer}</p> : <p className={s.empty}>Pas encore renseigné.</p>}
              </div>
              <div className={s.block}>
                <h3>Recherche</h3>
                {p.lookingFor ? <p>{p.lookingFor}</p> : <p className={s.empty}>Pas encore renseigné.</p>}
              </div>

              {people.length > 0 && (
                <p className={s.people}>
                  {people.map((m, i) => (
                    <span key={m.id}>
                      {i > 0 && " · "}
                      <strong>{m.name}</strong>
                      {m.jobTitle && `, ${m.jobTitle}`}
                    </span>
                  ))}
                </p>
              )}

              {p.url && /^https?:\/\//i.test(p.url) && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className={s.small}>
                  Site web ↗
                </a>
              )}

              {isMine ? (
                <p className={s.small}>
                  Votre entreprise · <Link href="/espace-partenaires/profil">modifier</Link>
                </p>
              ) : people.length > 0 ? (
                <details className={s.contact}>
                  <summary>Prendre contact</summary>
                  <ContactPartnerForm partnerId={p.id} partnerName={p.name} />
                </details>
              ) : (
                <p className={s.empty}>Pas encore inscrit sur l&apos;espace.</p>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
