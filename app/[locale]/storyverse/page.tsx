import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { stories } from "@/lib/storyverse/catalog";
import { StudioShell, Panel, Notice } from "@/components/storyverse/studio-shell";

const imageRoot = "/storyverse/images/";
const levels = [
  { name: "Little Explorers", description: "Picture-led discoveries and first reading steps", image: "little-explorers.webp.png" },
  { name: "Story Adventurers", description: "Choices, mysteries, and comprehension", image: "story-adventurers.webp.png" },
  { name: "Master Storytellers", description: "Advanced narratives, ethics, and investigations", image: "master-storytellers.webp.png" },
];
const storyImages: Record<string, string> = {
  "little-seed": "little-seed-story.webp.png",
  "missing-watering-can": "missing-watering-can.webp.png",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <StudioShell locale={locale} title="Every Story Opens a World">
      <section className="sv-photo-hero">
        <Image src={imageRoot + "storyverse-hero.webp.png"} alt="Young explorers looking across a scenic river valley" fill priority sizes="(max-width: 768px) 100vw, 1160px" className="sv-photo-hero-image" />
        <div className="sv-photo-hero-content">
          <p className="sv-photo-kicker">READ · LISTEN · READ &amp; PLAY</p>
          <h2>Stories for every curious mind.</h2>
          <p>Explore independently, as a family, or with a group. Choose your reading level, not your age. Challenges are always optional.</p>
          <div className="sv-actions">
            <Link className="sv-button alt" href={`/${locale}/storyverse/library`}>Explore stories</Link>
            <Link className="sv-button sv-light-button" href={`/${locale}/storyverse/dashboard`}>My story journey</Link>
          </div>
        </div>
      </section>
      <Notice>Editorial pilot: the available story text is English. Narration and reviewed translations are planned, not yet available.</Notice>
      <h2>Choose your reading adventure</h2>
      <div className="sv-grid sv-photo-grid">
        {levels.map((level, i) => (
          <article className="sv-card sv-photo-card" key={level.name}>
            <div className="sv-card-media"><Image src={imageRoot + level.image} alt={`${level.name} reading adventure`} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /></div>
            <div className="sv-card-body">
              <span className="sv-tag">Level {i + 1}</span>
              <h2>{level.name}</h2>
              <p>{level.description}</p>
              <Link href={`/${locale}/storyverse/library?level=${i + 1}`}>Browse this level →</Link>
            </div>
          </article>
        ))}
      </div>
      <Panel title="Featured pilot stories">
        <div className="sv-grid sv-photo-grid">
          {stories.map(s => (
            <article className="sv-card sv-photo-card" key={s.slug}>
              {storyImages[s.slug] ? (
                <div className="sv-card-media"><Image src={imageRoot + storyImages[s.slug]} alt={s.title} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /></div>
              ) : (
                <div className="sv-card-media sv-card-media-fallback" aria-hidden="true">ScienceVerse · Water &amp; Sustainability</div>
              )}
              <div className="sv-card-body">
                <span className="sv-tag">{s.world}</span>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                <Link href={`/${locale}/storyverse/read/${s.slug}`}>Start reading →</Link>
              </div>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Explore StoryVerse">
        <div className="sv-grid">
          {([["Rewards", "rewards"], ["Family Reading", "family"], ["Creator Studio", "creator"], ["Publishing Dashboard", "admin"]] as const).map(([label, path]) => (
            <Link className="sv-card" href={`/${locale}/storyverse/${path}`} key={path}>{label} →</Link>
          ))}
        </div>
      </Panel>
    </StudioShell>
  );
}
