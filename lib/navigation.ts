export const navigationItems = [
  { label: "Project", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "About Me", id: "about" },
  { label: "Achievement", id: "achievements" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
] as const;

export type SectionId = (typeof navigationItems)[number]["id"];

export function scrollToSection(target: SectionId | "top") {
  if (typeof window === "undefined") {
    return;
  }

  const element =
    target === "top" ? document.documentElement : document.getElementById(target);

  if (!element) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = window.innerWidth < 768 ? 88 : 104;
  const top =
    target === "top"
      ? 0
      : element.getBoundingClientRect().top + window.scrollY - offset;

  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}`,
  );

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: reducedMotion ? "auto" : "smooth",
  });
}
