import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Dumbbell,
  Facebook,
  Github,
  GraduationCap,
  Heart,
  Instagram,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Plus,
  Printer,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import initialPortfolio from "../../content/portfolio.json";

const sections = ["About", "Experience", "Projects"];
const socialIcons = { GitHub: Github, LinkedIn: Linkedin, Instagram, Facebook };
const interestIcons = {
  "Sports & fitness": Dumbbell,
  "Faith & community": Users,
  "3D printing": Printer,
  Electronics: Zap,
};

function Spotlight() {
  const light = useRef(null);
  useEffect(() => {
    const media = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame;
    const move = (event) => {
      if (!media.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        light.current?.style.setProperty("--mouse-x", `${event.clientX}px`);
        light.current?.style.setProperty("--mouse-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="spotlight" ref={light} aria-hidden="true" />;
}

function SocialLinks({ socials, email }) {
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return (
    <div className="social-area">
      <div className="social-links" aria-label="Social profiles">
        {socials.map(({ name, url }) => {
          const Icon = socialIcons[name] || ArrowUpRight;
          const label = url ? name : `${name} — coming soon`;
          return url ? (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} (opens in a new tab)`}
              title={label}
            >
              <Icon size={21} strokeWidth={1.7} />
            </a>
          ) : (
            <button
              key={name}
              type="button"
              aria-label={label}
              title={label}
              onClick={() =>
                setNotice(`My ${name} profile will be linked here soon.`)
              }
            >
              <Icon size={21} strokeWidth={1.7} />
            </button>
          );
        })}
      </div>
      {email && (
        <a className="email-link" href={`mailto:${email}`}>
          <Mail size={17} strokeWidth={1.7} />
          {email}
        </a>
      )}
      <p className="social-notice" role="status">
        {notice}
      </p>
    </div>
  );
}

function PortfolioPhoto({ photo, portrait = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo?.src]);
  if (!photo?.src || failed) return null;

  return (
    <figure className={portrait ? "portrait" : "community-photo"}>
      <a
        href={photo.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View full photo: ${photo.alt} (opens in a new tab)`}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={portrait ? 1448 : 2800}
          height={portrait ? 2172 : 4032}
          loading={portrait ? "eager" : "lazy"}
          fetchPriority={portrait ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: photo.position || "center" }}
          onError={() => setFailed(true)}
        />
      </a>
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
}

function ProjectArt({ kind, title }) {
  if (kind === "wellness")
    return (
      <div className="project-art wellness-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="wellness-top">
          <span>
            <Leaf size={13} /> everyday progress
          </span>
          <span className="art-menu">
            JOURNEY&nbsp;&nbsp; RECIPES&nbsp;&nbsp; MOVE
          </span>
        </div>
        <div className="wellness-body">
          <span className="art-kicker">SMALL STEPS. REAL CHANGE.</span>
          <strong>
            A little better.
            <br />
            <em>Every day.</em>
          </strong>
          <div className="art-pill">
            Find your momentum <ArrowUpRight size={10} />
          </div>
        </div>
        <div className="progress-orbit">
          <div className="orbit-inner">
            <span>100</span>
            <small>POUNDS. ONE JOURNEY.</small>
          </div>
          <div className="orbit-leaf">
            <Leaf size={20} />
          </div>
        </div>
        <div className="art-caption">
          <span className="mini-dot" /> Built on habits, not shortcuts.
        </div>
      </div>
    );
  return (
    <div className="project-art community-art" aria-hidden="true">
      <div className="community-brand">
        <span className="brand-mark">
          <Plus size={19} />
        </span>{" "}
        {title}
        <span className="art-menu">A LITTLE MORE CONNECTED.</span>
      </div>
      <div className="community-body">
        <div className="community-copy">
          <span className="art-kicker">LESS ADMIN. MORE MINISTRY.</span>
          <strong>
            Room for
            <br />
            <em>everyone.</em>
          </strong>
          <div className="people-stack">
            <span>J</span>
            <span>M</span>
            <span>A</span>
            <span>
              <Heart size={10} />
            </span>
            <small>Better, together.</small>
          </div>
        </div>
        <div className="schedule-card">
          <span className="schedule-label">
            YOUR WEEK, SIMPLIFIED <Sparkles size={11} />
          </span>
          <strong>Sunday gathering</strong>
          <p>
            OCT 18 <span>9:00 AM</span>
          </p>
          <div className="schedule-line">
            <i>
              <Check size={9} />
            </i>{" "}
            Welcome team <span>Ready</span>
          </div>
          <div className="schedule-line">
            <i>
              <Check size={9} />
            </i>{" "}
            Worship team <span>Ready</span>
          </div>
          <div className="schedule-footer">
            A place to belong <ArrowUpRight size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ number, children }) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <h2>{children}</h2>
      <div />
    </div>
  );
}

export default function App() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/portfolio", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Portfolio unavailable");
        return response.json();
      })
      .then((data) => {
        if (
          data.profile &&
          Array.isArray(data.projects) &&
          Array.isArray(data.experience) &&
          Array.isArray(data.socials) &&
          data.education
        )
          setPortfolio(data);
      })
      .catch(() => {
        /* The bundled public content keeps the portfolio readable while the API reconnects. */
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = `${portfolio.profile.name} — ${portfolio.profile.role}`;
  }, [portfolio.profile.name, portfolio.profile.role]);

  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = window.innerHeight * 0.35;
        let current = "about";
        for (const label of sections) {
          const id = label.toLowerCase();
          if (
            document.getElementById(id)?.getBoundingClientRect().top <=
            threshold
          )
            current = id;
        }
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 8
        )
          current = "projects";
        setActiveSection(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const { profile, socials, experience, education, projects } = portfolio;

  return (
    <>
      <Spotlight />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="portfolio-shell">
        <header className="profile-panel">
          <div className="profile-top">
            <a className="wordmark" href="#about" aria-label="Back to about">
              <Code2 size={23} />
              <span>DESIGNED TO KEEP GROWING</span>
            </a>
            <div className="intro">
              <p className="hello">
                <span /> HELLO, I'M
              </p>
              <h1>
                {profile.name}
                <span className="name-period">.</span>
              </h1>
              <p className="role">{profile.role}</p>
              <p className="tagline">{profile.tagline}</p>
              <p className="location">
                <MapPin size={14} />
                {profile.location}
              </p>
            </div>
            <nav className="section-nav" aria-label="Main navigation">
              {sections.map((label, index) => {
                const id = label.toLowerCase();
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={activeSection === id ? "active" : ""}
                    aria-current={activeSection === id ? "location" : undefined}
                  >
                    <span className="nav-line" />
                    <span className="nav-number">0{index + 1}</span>
                    {label}
                    <ChevronRight size={13} />
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="profile-bottom">
            <SocialLinks socials={socials} email={profile.email} />
            <div className="building-note">
              <span className="status-dot" />
              {profile.availability}
            </div>
          </div>
        </header>

        <main id="main-content">
          <section id="about" aria-labelledby="about-title">
            <div className="section-heading">
              <span>01</span>
              <h2 id="about-title">A little about me</h2>
              <div />
              <Sparkles size={16} className="heading-sparkle" />
            </div>
            <div className="about-copy">
              <div className="about-lead">
                <p className="lead-paragraph">{profile.bio[0]}</p>
                <PortfolioPhoto photo={profile.portrait} portrait />
              </div>
              {profile.bio.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="interests" aria-label="Outside of work">
              {portfolio.interests.map((interest) => {
                const Icon = interestIcons[interest] || Heart;
                return (
                  <span key={interest}>
                    <Icon size={13} />
                    {interest}
                  </span>
                );
              })}
            </div>
            {portfolio.aboutPhotos?.length > 0 && (
              <div className="about-gallery">
                {portfolio.aboutPhotos.map((photo) => (
                  <PortfolioPhoto key={photo.src} photo={photo} />
                ))}
              </div>
            )}
            <a className="text-link explore-link" href="#projects">
              See what I'm working on <ArrowDown size={15} />
            </a>
          </section>

          <section id="experience" aria-label="Experience">
            <SectionHeading number="02">Where I'm growing</SectionHeading>
            <div className="experience-list">
              {experience.map((job) => (
                <article className="experience-card" key={job.id}>
                  <div className="experience-meta">
                    <span className="experience-dot" />
                    <p>{job.period}</p>
                    {/present/i.test(job.period) && (
                      <span className="current-label">CURRENT</span>
                    )}
                  </div>
                  <div className="experience-content">
                    <h3>{job.role}</h3>
                    <a
                      className="company-link"
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.company}
                      <ArrowUpRight size={15} />
                    </a>
                    <p>{job.description}</p>
                    <div className="tags">
                      {job.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="education">
              <div className="education-icon">
                <GraduationCap size={21} strokeWidth={1.5} />
              </div>
              <div>
                <h3>{education.school}</h3>
                <p>{education.degree}</p>
              </div>
              <span>{education.date}</span>
            </div>
          </section>

          <section id="projects" aria-label="Projects">
            <SectionHeading number="03">Bringing ideas to life</SectionHeading>
            <p className="section-intro">
              A few things I'm excited to bring to life.
              <br />
              Personal stories. Real communities. Purposeful software.
            </p>
            <div className="project-list">
              {projects.map((project, index) => (
                <article
                  className={`project-card ${project.kind}`}
                  key={project.id}
                >
                  <ProjectArt kind={project.kind} title={project.title} />
                  <div className="project-details">
                    <div className="project-eyebrow">
                      <span>
                        0{index + 1} / {project.eyebrow}
                      </span>
                      <span className="coming-soon">
                        <span />
                        {project.status}
                      </span>
                    </div>
                    <h3>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                          <ArrowUpRight size={20} />
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <a
              className="github-link"
              href={
                socials.find((social) => social.name === "GitHub")?.url ||
                "https://github.com/jksatermo"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={17} />
              Follow the work on GitHub
              <ArrowUpRight size={15} />
            </a>
          </section>

          <footer>
            <div className="footer-rule" />
            <p>Always a work in progress. Just like me.</p>
            <div>
              <span>
                Built with intention <span className="footer-star">✧</span> Made
                to grow.
              </span>
              <a href="#about" aria-label="Back to top">
                Back to top <ArrowUpRight size={12} />
              </a>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
