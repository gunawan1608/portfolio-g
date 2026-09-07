import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";
import { projects } from "@/lib/site-data";

type PageProps = {
    params: Promise<{ id: string }>;
};

export function generateStaticParams() {
    return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const project = projects.find((item) => item.id === id);

    if (!project) {
        return { title: "Project not found | Gunawan Madia Pratama" };
    }

    return {
        title: `${project.title} | Gunawan Madia Pratama`,
        description: project.summary,
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { id } = await params;
    const currentIndex = projects.findIndex((item) => item.id === id);

    if (currentIndex === -1) {
        notFound();
    }

    const project = projects[currentIndex];
    const nextProject = projects[(currentIndex + 1) % projects.length];

    return (
        <section className="section project-detail-section">
            <div className="container">
                <Link href="/#projects" className="text-link project-detail-back" data-hover>
                    ← Back to all projects
                </Link>

                <article
                    className="project-showcase-card project-detail-card"
                    style={{ "--project-accent": project.accent } as CSSProperties}
                >
                    <ProjectGallery images={project.images} projectId={project.id} />

                    <div className="project-showcase-body">
                        <div className="project-heading-row">
                            <div className="project-heading-copy">
                                <p className="project-kicker">
                                    <span className="project-kicker-number">{String(currentIndex + 1).padStart(2, "0")}</span>
                                    <span>{project.category}</span>
                                </p>
                                <h1 className="project-title">{project.title}</h1>
                            </div>
                            <span className="project-status-pill">{project.status}</span>
                        </div>

                        <p className="project-platform">{project.platform}</p>
                        <p className="project-summary">{project.summary}</p>

                        <div className="project-meta-grid">
                            <div className="project-meta-card">
                                <span className="project-meta-label">Type</span>
                                <strong>{project.category}</strong>
                            </div>
                            <div className="project-meta-card">
                                <span className="project-meta-label">Platform</span>
                                <strong>{project.platform}</strong>
                            </div>
                            <div className="project-meta-card">
                                <span className="project-meta-label">Preview</span>
                                <strong>{project.images.length} Screens</strong>
                            </div>
                        </div>

                        <div className="tag-group project-stack">
                            {project.stack.map((item) => (
                                <span key={item} className="tag">
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="project-actions">
                            <a
                                className="button button-primary project-link"
                                href={project.href}
                                target="_blank"
                                rel="noreferrer"
                                data-hover
                            >
                                {project.hrefLabel}
                            </a>
                            <p className="project-link-note">Screens from the actual project.</p>
                        </div>
                    </div>
                </article>

                <Link href={`/projects/${nextProject.id}`} className="project-detail-next" data-hover>
                    <span className="eyebrow">Next project</span>
                    <span className="project-detail-next-title">
                        {nextProject.title}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </Link>
            </div>
        </section>
    );
}
