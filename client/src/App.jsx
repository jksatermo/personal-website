import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
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
  if (kind === "resume-matcher")
    return (
      <div className="project-art matcher-art" aria-hidden="true">
        <div className="matcher-brand">
          <Sparkles size={15} />
          <span>{title}</span>
          <span className="art-menu">CONTEXT. CONNECTION. OPPORTUNITY.</span>
        </div>
        <div className="matcher-workspace">
          <div className="matcher-document">
            <span className="matcher-label">JOB DESCRIPTION</span>
            <strong>What the role needs</strong>
            <div className="matcher-lines">
              <i />
              <i />
              <i />
            </div>
            <span className="matcher-highlight">Skills &amp; requirements</span>
          </div>
          <div className="matcher-connection">
            <Sparkles size={17} />
          </div>
          <div className="matcher-document">
            <span className="matcher-label">APPLICANT RESUME</span>
            <strong>What a person brings</strong>
            <div className="matcher-lines">
              <i />
              <i />
              <i />
            </div>
            <span className="matcher-highlight">
              Experience &amp; strengths
            </span>
          </div>
        </div>
        <div className="matcher-caption">
          <span>Find the relevant connections.</span>
          <span>CONCEPT ILLUSTRATION</span>
        </div>
      </div>
    );
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

function ProjectCard({ project, index }) {
  const links =
    project.links ??
    (project.url ? [{ label: "View project", url: project.url }] : []);
  const statusClass =
    {
      Completed: "status-completed",
      "In development": "status-in-development",
      "Coming soon": "status-coming-soon",
    }[project.status] || "status-coming-soon";
  const StatusIcon =
    project.status === "Completed"
      ? Check
      : project.status === "In development"
        ? Code2
        : Clock3;

  return (
    <article className={`project-card ${project.kind}`}>
      <ProjectArt kind={project.kind} title={project.title} />
      <div className="project-details">
        <div className="project-eyebrow">
          <span>
            0{index + 1} / {project.eyebrow}
          </span>
          <span className={`project-status ${statusClass}`}>
            <StatusIcon size={12} aria-hidden="true" />
            {project.status}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.contribution && (
          <p className="project-contribution">{project.contribution}</p>
        )}
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {links.length > 0 && (
          <div
            className="project-actions"
            aria-label={`${project.title} links`}
          >
            {links.map(({ label, url }) => (
              <a
                className="text-link"
                key={`${label}-${url}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${project.title} (opens in a new tab)`}
              >
                {label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
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
              <h1>{profile.name}</h1>
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
                <article
                  className={`experience-card${job.compact ? " compact" : ""}`}
                  key={job.id}
                >
                  <div className="experience-meta">
                    <span className="experience-dot" />
                    <p>{job.period}</p>
                    {/present/i.test(job.period) && (
                      <span className="current-label">CURRENT</span>
                    )}
                  </div>
                  <div className="experience-content">
                    <h3>{job.role}</h3>
                    <div className="company-details">
                      {job.url ? (
                        <a
                          className="company-link"
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${job.company} (opens in a new tab)`}
                        >
                          {job.company}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="company-name">{job.company}</span>
                      )}
                      {job.location && (
                        <span className="job-location">{job.location}</span>
                      )}
                    </div>
                    <p>{job.description}</p>
                    {job.skills?.length > 0 && (
                      <div className="tags">
                        {job.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="education" aria-labelledby="education-title">
              <div className="education-header">
                <div className="education-icon">
                  <GraduationCap size={21} strokeWidth={1.5} />
                </div>
                <h3 id="education-title">Education</h3>
                <span>{education.date}</span>
              </div>
              <div className="education-body">
                <div className="education-copy">
                  <h4>{education.degree}</h4>
                  <p className="education-school">{education.school}</p>
                  {education.description && <p>{education.description}</p>}
                </div>
                {education.photo && (
                  <div className="education-photo">
                    <PortfolioPhoto photo={education.photo} />
                  </div>
                )}
              </div>
            </div>
            {portfolio.skillGroups?.length > 0 && (
              <div className="technical-skills" aria-labelledby="skills-title">
                <h3 id="skills-title">Tools &amp; technologies</h3>
                <dl className="skill-groups">
                  {portfolio.skillGroups.map((group) => (
                    <div className="skill-group" key={group.title}>
                      <dt>{group.title}</dt>
                      <dd>
                        {group.description && <p>{group.description}</p>}
                        <ul className="tags">
                          {group.skills.map((skill) => (
                            <li key={skill}>
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>

          <section id="projects" aria-label="Projects">
            <SectionHeading number="03">Bringing ideas to life</SectionHeading>
            <p className="section-intro">
              Completed work and ideas taking shape.
              <br />
              Personal stories. Real communities. Purposeful software.
            </p>
            <div className="project-list">
              {projects.map((project, index) => (
                <ProjectCard project={project} index={index} key={project.id} />
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
              aria-label={`Follow ${profile.name} on GitHub (opens in a new tab)`}
            >
              <Github size={17} />
              Follow the work on GitHub
              <ArrowUpRight size={15} />
            </a>
          </section>

          <footer>
            <div className="footer-rule" />
            <p>Always a work in progress. Just like me.</p>
            <p className="stack-note">
              Built with the MERN stack: MongoDB, Express, React, and Node.js.
            </p>
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
