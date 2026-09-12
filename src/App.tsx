import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FolderGit2,
  GraduationCap,
  Menu,
  Search,
  Send,
  Server,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { profile, socials } from "./data/portfolio";
import { projects } from "./data/projects";
import { experience } from "./data/experience";
import { education } from "./data/education";
import { certifications } from "./data/certifications";
import { currentlyLearning, skillGroups } from "./data/skills";
import { useActiveSection } from "./hooks/useActiveSection";
import type { Project } from "./types/content";
const nav = [
  ["home", "Home"],
  ["about", "About"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;
function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  history.replaceState(null, "", `#${id}`);
}
function LinkButton({
  href,
  label,
  icon,
}: {
  href: string | null;
  label: string;
  icon?: React.ReactNode;
}) {
  return href ? (
    <a
      className="button secondary"
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {icon}
      {label}
    </a>
  ) : (
    <span
      className="button secondary disabled"
      aria-disabled="true"
      title="TODO: USER_DATA_REQUIRED"
    >
      {icon}
      {label}
    </span>
  );
}
function ProjectVisual({ project }: { project: Project }) {
  return (
    <div
      className={`project-visual tone-${project.category.split(" ")[0].toLowerCase()}`}
      aria-hidden="true"
    >
      <span>
        {project.placeholder ? "DEMO / PLACEHOLDER" : project.category}
      </span>
      <div className="window">
        <i />
        <i />
        <i />
        <div className="lines">
          <b />
          <b />
          <b />
          <b />
        </div>
      </div>
    </div>
  );
}
function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  return (
    <article className="project-card">
      <button
        className="project-open"
        onClick={() => onOpen(project)}
        aria-label={`Buka detail ${project.name}`}
      >
        <ProjectVisual project={project} />
        <div className="project-body">
          <div className="meta">
            <span className="status">{project.status}</span>
            <span>{project.year}</span>
          </div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <div className="chips">
            {project.stack.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <span className="text-link">
            View case study <ArrowRight size={16} />
          </span>
        </div>
      </button>
    </article>
  );
}
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    dialog.current?.focus();
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", fn);
    document.body.classList.add("locked");
    return () => {
      removeEventListener("keydown", fn);
      document.body.classList.remove("locked");
      old?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        tabIndex={-1}
        ref={dialog}
      >
        <button
          className="icon-button close"
          onClick={onClose}
          aria-label="Tutup detail"
        >
          <X />
        </button>
        <ProjectVisual project={project} />
        <div className="modal-content">
          <p className="eyebrow">
            {project.category} · {project.status}
          </p>
          <h2 id="project-title">{project.name}</h2>
          <p className="lead">{project.description}</p>
          {project.placeholder && (
            <div className="notice">
              Demo placeholder — ganti dengan bukti proyek nyata sebelum
              dipublikasikan.
            </div>
          )}
          <div className="case-grid">
            <div>
              <h3>Challenge</h3>
              {project.challenges.map((x) => (
                <p key={x}>{x}</p>
              ))}
            </div>
            <div>
              <h3>Approach</h3>
              {project.solutions.map((x) => (
                <p key={x}>{x}</p>
              ))}
            </div>
          </div>
          <h3>Highlights</h3>
          <ul>
            {project.highlights.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="chips">
            {project.stack.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className="actions">
            <LinkButton
              href={project.liveUrl}
              label="Live project"
              icon={<ExternalLink size={16} />}
            />
            <LinkButton
              href={project.repositoryUrl}
              label="Repository"
              icon={<FolderGit2 size={16} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function CommandPalette({
  close,
  actions,
}: {
  close: () => void;
  actions: { label: string; run: () => void; enabled?: boolean }[];
}) {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const items = actions.filter((x) =>
    x.label.toLowerCase().includes(q.toLowerCase()),
  );
  useEffect(() => setIndex(0), [q]);
  return (
    <div
      className="modal-backdrop command-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="command"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="command-search">
          <Search size={18} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search commands…"
            aria-label="Search commands"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => (i + 1) % Math.max(items.length, 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex(
                  (i) => (i - 1 + items.length) % Math.max(items.length, 1),
                );
              }
              if (e.key === "Enter" && items[index]?.enabled !== false) {
                items[index].run();
                close();
              }
              if (e.key === "Escape") close();
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-list">
          {items.length ? (
            items.map((x, i) => (
              <button
                key={x.label}
                className={i === index ? "active" : ""}
                disabled={x.enabled === false}
                onMouseEnter={() => setIndex(i)}
                onClick={() => {
                  x.run();
                  close();
                }}
              >
                {x.label}
                <span>{x.enabled === false ? "Needs profile data" : "↵"}</span>
              </button>
            ))
          ) : (
            <div className="empty">No command found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
function DevTerminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(["Portfolio terminal v1.0 — type “help”"]);
  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const responses: Record<string, string> = {
      help: "Commands: about, projects, skills, experience, education, contact, whoami, status, stack, clear",
      about: profile.summary,
      projects: `${projects.length} demo entries loaded. See the Projects section.`,
      skills: skillGroups.flatMap((x) => x.items).join(" · "),
      experience: "IT Support Intern — Diskominfo Kota Sukabumi (Mar–May 2022)",
      education:
        "Active Informatics Engineering student; vocational background in Computer & Network Engineering.",
      contact:
        profile.email ??
        "Email has not been configured. TODO: USER_DATA_REQUIRED",
      whoami:
        profile.name === "Nama Anda"
          ? "Name pending — TODO: USER_DATA_REQUIRED"
          : profile.name,
      status: "Available for internship opportunities.",
      stack: "React · TypeScript · Vite · Node.js · Express · SQLite",
    };
    if (cmd === "clear") {
      setLines([]);
    } else
      setLines((v) => [
        ...v,
        `$ ${raw}`,
        responses[cmd] ?? `Command not found: ${cmd || "(empty)"}`,
      ]);
    setInput("");
  };
  return (
    <div className="terminal">
      <div className="terminal-top">
        <span />
        <span />
        <span />
        <b>
          <TerminalIcon size={14} /> developer terminal
        </b>
      </div>
      <div className="terminal-body" aria-live="polite">
        {lines.map((x, i) => (
          <div key={i}>{x}</div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <label htmlFor="terminal-input">$</label>
          <input
            id="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
export default function App() {
  const active = useActiveSection(nav.map((x) => x[0]));
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [progress, setProgress] = useState(0);
  const [health, setHealth] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [captcha, setCaptcha] = useState("");
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const visible = useMemo(
    () =>
      projects.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          `${p.name} ${p.summary} ${p.stack.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );
  useEffect(() => {
    const update = () =>
      setProgress(
        (scrollY / (document.documentElement.scrollHeight - innerHeight)) *
          100 || 0,
      );
    addEventListener("scroll", update, { passive: true });
    update();
    fetch("/api/health")
      .then((r) => (r.ok ? setHealth("online") : setHealth("offline")))
      .catch(() => setHealth("offline"));
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    addEventListener("keydown", key);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("keydown", key);
    };
  }, []);
  const copyEmail = async () => {
    if (!profile.email) return;
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const commands = [
    ...nav.map((x) => ({ label: x[1], run: () => scrollToId(x[0]) })),
    {
      label: "Download CV",
      run: () => profile.cvUrl && location.assign(profile.cvUrl),
      enabled: !!profile.cvUrl,
    },
    { label: "Copy Email", run: copyEmail, enabled: !!profile.email },
    {
      label: "Open GitHub",
      run: () => socials.github && open(socials.github, "_blank", "noopener"),
      enabled: !!socials.github,
    },
    {
      label: "Open LinkedIn",
      run: () =>
        socials.linkedin && open(socials.linkedin, "_blank", "noopener"),
      enabled: !!socials.linkedin,
    },
  ];
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setFormState("success");
      e.currentTarget.reset();
    } catch {
      setFormState("error");
    }
  }
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="progress" style={{ width: `${progress}%` }} />
      <header className="nav-shell">
        <a className="brand" href="#home" onClick={() => setMenu(false)}>
          <span>NI</span>
          <b>{profile.name}</b>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Primary navigation">
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
          <button className="command-trigger" onClick={() => setPalette(true)}>
            <Search size={15} /> Quick find <kbd>Ctrl K</kbd>
          </button>
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-label="Toggle menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section id="home" className="hero section">
          <div className="hero-copy">
            <div className="availability">
              <i />
              {profile.availability}
            </div>
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1>
              Engineering ideas into <span>useful digital products.</span>
            </h1>
            <p className="hero-lead">{profile.summary}</p>
            <div className="focus-row">
              {profile.focus.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <div className="actions">
              <button
                className="button primary"
                onClick={() => scrollToId("projects")}
              >
                View projects <ArrowRight size={17} />
              </button>
              <button
                className="button secondary"
                onClick={() => scrollToId("contact")}
              >
                Contact
              </button>
              <LinkButton
                href={profile.cvUrl}
                label="Download CV"
                icon={<Download size={16} />}
              />
            </div>
            <div className="social-row">
              <LinkButton href={socials.github} label="GitHub" />
              <LinkButton href={socials.linkedin} label="LinkedIn" />
            </div>
          </div>
          <aside className="hero-panel">
            <div className="panel-grid">
              <div>
                <small>Current focus</small>
                <strong>Building reliable foundations</strong>
              </div>
              <Code2 />
              <div className="panel-line">
                <span>01</span>
                <p>Software that solves a clear problem.</p>
              </div>
              <div className="panel-line">
                <span>02</span>
                <p>Infrastructure that stays understandable.</p>
              </div>
              <div className="panel-line">
                <span>03</span>
                <p>Interactive systems with thoughtful feedback.</p>
              </div>
              <div className={`server-status ${health}`}>
                <Server size={16} />
                <span>Portfolio server</span>
                <b>{health.toUpperCase()}</b>
              </div>
            </div>
          </aside>
        </section>
        <section id="about" className="section split">
          <div>
            <p className="eyebrow">01 / About</p>
            <h2>Technical curiosity, grounded in practical support.</h2>
          </div>
          <div>
            <p className="lead">
              Saya mempelajari Teknik Informatika dengan fondasi praktis dari
              Teknik Komputer dan Jaringan. Pengalaman IT Support membentuk cara
              kerja yang sistematis: pahami masalah, isolasi penyebabnya, lalu
              komunikasikan solusi dengan jelas.
            </p>
            <div className="principles">
              <span>Credible over exaggerated</span>
              <span>Useful over decorative</span>
              <span>Evidence over buzzwords</span>
            </div>
          </div>
        </section>
        <section id="projects" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / Work</p>
              <h2>Featured & project archive</h2>
            </div>
            <p>
              Project system siap diisi dengan pekerjaan nyata. Entri saat ini
              sengaja ditandai sebagai demo.
            </p>
          </div>
          <div className="filters">
            <label className="search">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects"
              />
            </label>
            <div className="filter-tabs" aria-label="Filter category">
              {categories.map((x) => (
                <button
                  key={x}
                  className={category === x ? "active" : ""}
                  onClick={() => setCategory(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          {visible.length ? (
            <div className="project-grid">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={setSelected} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search />
              <h3>No projects found</h3>
              <p>Try another search or category.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
        <section id="experience" className="section">
          <p className="eyebrow">03 / Experience</p>
          <h2>Where practical foundations were built.</h2>
          <div className="timeline">
            {experience.map((x) => (
              <article key={x.role}>
                <div className="timeline-marker">
                  <BriefcaseBusiness />
                </div>
                <div>
                  <span>{x.period}</span>
                  <h3>{x.role}</h3>
                  <h4>{x.organization}</h4>
                  <ul>
                    {x.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="skills" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / Capabilities</p>
              <h2>A foundation designed to keep growing.</h2>
            </div>
            <p>
              Skill labels are intentionally conservative until supported by
              project evidence.
            </p>
          </div>
          <div className="skill-grid">
            {skillGroups.map((g) => (
              <article key={g.title}>
                <h3>{g.title}</h3>
                {g.items.map((x, i) => (
                  <div className="skill-row" key={x}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <b>{x}</b>
                  </div>
                ))}
              </article>
            ))}
          </div>
          <div className="learning">
            <p className="eyebrow">Currently learning</p>
            <div>
              {currentlyLearning.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </section>
        <section id="education" className="section">
          <p className="eyebrow">05 / Education & Certification</p>
          <h2>Formal learning, technical roots.</h2>
          <div className="education-grid">
            {education.map((x) => (
              <article key={x.program}>
                <GraduationCap />
                <small>{x.period}</small>
                <h3>{x.program}</h3>
                <p>{x.institution}</p>
              </article>
            ))}
            {certifications.map((x) => (
              <article className="cert" key={x.name}>
                <Check />
                <small>{x.period}</small>
                <h3>{x.name}</h3>
                <p>{x.issuer}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section terminal-section">
          <div>
            <p className="eyebrow">06 / Easter egg</p>
            <h2>
              A small terminal, because interfaces should reward curiosity.
            </h2>
            <p>
              Try <code>help</code>, then explore. It is secondary by design;
              every important path remains available above.
            </p>
          </div>
          <DevTerminal />
        </section>
        <section id="contact" className="section contact">
          <div>
            <p className="eyebrow">07 / Contact</p>
            <h2>Let’s discuss an internship opportunity.</h2>
            <p className="lead">
              Have a role where curiosity, careful execution, and a strong
              technical foundation matter? Send a message.
            </p>
            <button
              className="copy-email"
              disabled={!profile.email}
              onClick={copyEmail}
            >
              <Copy size={17} />
              {copied ? "Copied" : (profile.email ?? "Email belum diisi")}
            </button>
          </div>
          <form onSubmit={submit}>
            <div className="field-row">
              <label>
                Name
                <input
                  name="name"
                  required
                  maxLength={80}
                  autoComplete="name"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                />
              </label>
            </div>
            <label>
              Subject <span>(optional)</span>
              <input name="subject" maxLength={120} />
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={6}
              />
            </label>
            <label className="bot-field" aria-hidden="true">
              Company website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="human-check">
              Human check: berapa 3 + 4?
              <input
                name="answer"
                inputMode="numeric"
                required
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                pattern="7"
              />
            </label>
            <button
              className="button primary"
              disabled={formState === "sending"}
            >
              {formState === "sending" ? "Sending…" : "Send message"}{" "}
              <Send size={16} />
            </button>
            {formState === "success" && (
              <p className="form-message success" role="status">
                Message saved. Thank you.
              </p>
            )}
            {formState === "error" && (
              <p className="form-message error" role="alert">
                Message could not be sent. Please check the fields and try
                again.
              </p>
            )}
          </form>
        </section>
      </main>
      <footer>
        <a className="brand" href="#home">
          <span>NI</span>
          <b>{profile.name}</b>
        </a>
        <p>Built with restraint, clarity, and room to grow.</p>
        <span>© {new Date().getFullYear()}</span>
      </footer>
      {palette && (
        <CommandPalette close={() => setPalette(false)} actions={commands} />
      )}{" "}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
