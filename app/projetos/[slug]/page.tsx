import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "../../project-data";
import { ProjectMotion } from "../../project-motion";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: `${project.title} — Guilherme Miranda`, description: project.description, images: [] },
    twitter: { card: "summary", title: `${project.title} — Guilherme Miranda`, description: project.description, images: [] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main
      className={`project-page ${project.category === "Pôster Esportivo" ? "project-page--sport" : ""}`}
      style={{ "--active-accent": project.accent } as CSSProperties}
    >
      <ProjectMotion />
      <div className="ambient-background" aria-hidden="true">
        <img className="ambient-shape ambient-shape--orchid" src="/media/blob-orchid.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--cobalt" src="/media/blob-cobalt.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--violet" src="/media/blob-violet.svg" alt="" width="500" height="500" />
        <img className="ambient-shape ambient-shape--paper" src="/media/blob-paper.svg" alt="" width="500" height="500" />
      </div>
      <header className="project-nav">
        <Link href="/#trabalhos">Voltar aos trabalhos</Link>
        <Link className="wordmark" href="/" aria-label="Página inicial">GM<span>®</span></Link>
        <span>{project.year}</span>
      </header>

      <section className="project-intro">
        <p className="kicker">{project.category}</p>
        <h1>{project.category === "Pôster Esportivo" ? project.title : <span className="couture-face couture-face--project">{project.title}</span>}</h1>
        <div className="project-facts">
          <p><span>Projeto</span>{project.description}</p>
          <p><span>Minha contribuição</span>{project.role}</p>
        </div>
      </section>

      <section className={`project-media ${project.hasVideo ? "has-video" : ""}`}>
        <figure>
          <img src={project.image} alt={project.alt} />
        </figure>
        {project.hasVideo && (
          <figure className="video-figure">
            <video controls playsInline preload="metadata" poster={project.image}>
              <source src="/media/yamal-process.mp4" type="video/mp4" />
              <track kind="captions" src="/media/yamal-process.pt-BR.vtt" srcLang="pt-BR" label="Português" default />
              Seu navegador não conseguiu reproduzir o vídeo.
            </video>
            <figcaption>Processo de criação · Lamine Yamal</figcaption>
          </figure>
        )}
      </section>

      <Link className="next-project" href={`/projetos/${nextProject.slug}`}>
        <span>Próximo projeto</span>
        <strong><span className="couture-face">{nextProject.title}</span></strong>
      </Link>
    </main>
  );
}
