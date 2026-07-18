import { PortalExperience } from "@/components/PortalExperience";

const experiencePoints = [
  [
    "01",
    "Enter the gallery",
    "An original nighttime museum holds an exhibit that remembers more than its label can say.",
  ],
  [
    "02",
    "Become the memory",
    "Cross into a Late Jurassic floodplain as a young Stegosaurus with new senses and choices.",
  ],
  [
    "03",
    "Build the evidence",
    "Return with observations, compare them to museum clues, and reconstruct an explicitly fictional event.",
  ],
];

export default function Home() {
  return (
    <main>
      <nav className="navigation" aria-label="Primary navigation">
        <a
          className="wordmark"
          href="#top"
          aria-label="AI Night at the Museum home"
        >
          <span aria-hidden="true">AM</span>
          <span>Night at the Museum</span>
        </a>
        <a className="quiet-link" href="#experience">
          The experience
        </a>
      </nav>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">OpenAI Build Week 2026</p>
          <h1 id="hero-title">AI Night at the Museum</h1>
          <p className="lede">Step into the exhibit. Become the memory.</p>
          <p className="intro">
            An original museum mystery where lived experience becomes evidence,
            and certainty is earned rather than generated.
          </p>
          <a className="primary-action" href="#play">
            Enter the Floodplain Memory <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div
          className="museum-scene"
          aria-label="A stylized original museum exhibit with a Stegosaurus silhouette"
        >
          <div className="moon" aria-hidden="true" />
          <div className="arch arch-one" aria-hidden="true" />
          <div className="arch arch-two" aria-hidden="true" />
          <div className="stegosaurus" aria-hidden="true">
            <span className="plate plate-one" />
            <span className="plate plate-two" />
            <span className="plate plate-three" />
            <span className="tail" />
            <span className="body" />
            <span className="leg leg-front" />
            <span className="leg leg-back" />
          </div>
          <p className="scene-caption">Floodplain Memory · Exhibit 01</p>
        </div>
      </section>

      <section
        className="experience"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="section-heading">
          <p className="eyebrow">A single complete chapter</p>
          <h2 id="experience-title">What the visitor carries back</h2>
        </div>
        <ol className="experience-list">
          {experiencePoints.map(([number, title, detail]) => (
            <li key={number}>
              <span className="step-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div id="play">
        <PortalExperience />
      </div>

      <footer>
        <p>Fictional museum. Original world. Evidence before certainty.</p>
        <p>Built with Codex and GPT-5.6.</p>
      </footer>
    </main>
  );
}
