export type SocialLink = {
  label: string;
  handle: string;
  href: string;
};

export type ProjectEntry = {
  category: string;
  title: string;
  summary: string;
  stack: string[];
  status: string;
  accent: string;
};

export type SkillGroup = {
  title: string;
  summary: string;
  skills: string[];
  accent: string;
};

export type ExperienceEntry = {
  title: string;
  organization: string;
  period: string;
  summary: string;
  type: string;
};

export type AchievementEntry = {
  id: string;
  title: string;
  issuer: string;
  receivedAt: string;
  type: string;
  note: string;
  accent: string;
  skills: string[];
  credentialId?: string;
  documentSlug: string;
  documentFileName: string;
};

export const profile = {
  name: "Gunawan Madia Pratama",
  initials: "GM",
  role: "Software Developer",
  location: "Indonesia",
  intro:
    "I build clean websites with thoughtful motion, responsive layouts, and a strong focus on detail.",
  shortBio:
    "This portfolio is still growing and will be filled step by step with real projects, experience, and certificates.",
  about:
    "I enjoy building interfaces that feel clear, calm, and polished. My focus is frontend development, but I also care about structure, rhythm, and the final presentation of a page.",
  focus: [
    "Learning Laravel Framework",
    "Developing Personal Portfolio",
    "Building Real-World Projects",
  ],
  email: "tamagunawan08@gmail.com",
  socials: [
    {
      label: "GitHub",
      handle: "github.com/gunawan1608",
      href: "https://github.com/gunawan1608",
    },
    {
      label: "LinkedIn",
      handle: "linkedin.com/Gunawan-Madia-Pratama",
      href: "https://www.linkedin.com/in/gunawan-madia-pratama-3172753a5/",
    },
    {
      label: "Instagram",
      handle: "@gm_pratama16",
      href: "https://instagram.com/gm_pratama16",
    },
  ] satisfies SocialLink[],
} as const;

export const projects: ProjectEntry[] = [
  {
    category: "Portfolio",
    title: "Personal Portfolio Website",
    summary:
      "A personal website built to present my profile, selected work, certificates, and experience in a cleaner way.",
    stack: ["Next.js", "TypeScript", "GSAP", "Framer Motion"],
    status: "In progress",
    accent: "#42a66a",
  },
  {
    category: "UI Study",
    title: "Dashboard Interface Exploration",
    summary:
      "A layout study focused on clean hierarchy, card composition, and readable data blocks.",
    stack: ["UI Design", "Responsive Layout", "Interaction"],
    status: "Concept",
    accent: "#74c08d",
  },
  {
    category: "Motion",
    title: "Certificate Preview System",
    summary:
      "A simple modal-based certificate preview prepared for adding real files later.",
    stack: ["Modal", "Canvas", "Animation"],
    status: "Ready",
    accent: "#96d9aa",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    summary: "I focus on building clean and responsive interfaces.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    accent: "#42a66a",
  },
  {
    title: "Motion",
    summary: "I like subtle motion that improves the feel of a page.",
    skills: ["GSAP", "ScrollTrigger", "Framer Motion", "CSS Animation"],
    accent: "#74c08d",
  },
  {
    title: "Workflow",
    summary: "I try to keep code organized and easy to grow.",
    skills: ["Git", "Component Structure", "Responsive UI", "Performance"],
    accent: "#2f8a57",
  },
];

export const experiences: ExperienceEntry[] = [
  {
    title: "Education",
    organization: "School details will be added here later",
    period: "Year - Year",
    summary: "A place to show my education background clearly and briefly.",
    type: "Education",
  },
  {
    title: "Internship",
    organization: "Company details will be added here later",
    period: "Month Year - Month Year",
    summary: "A place to show internship experience, work scope, and learning outcomes.",
    type: "Internship",
  },
  {
    title: "Personal Practice",
    organization: "Independent learning and personal projects",
    period: "Ongoing",
    summary: "A space for projects and continuous self-improvement outside formal work.",
    type: "Practice",
  },
];

export const achievements: AchievementEntry[] = [
  {
    id: "achievement-rpl-training",
    title: "Pelatihan Kompetensi RPL",
    issuer: "P4 Jakarta Pusat - Dinas Pendidikan DKI Jakarta",
    receivedAt: "September 2025",
    type: "Training",
    note: "Software engineering training focused on database practice and Laravel-based development.",
    accent: "#42a66a",
    skills: ["Database", "Laravel"],
    documentSlug: "pelatihan-kompetensi-rpl",
    documentFileName: "Gunawan Madia Pratama.pdf",
  },
  {
    id: "achievement-aws-cloud",
    title: "Job Roles in the Cloud",
    issuer: "AWS Training Online",
    receivedAt: "Jan 2024",
    type: "Cloud",
    note: "Certificate of completion covering cloud-focused job roles and foundational AWS learning.",
    accent: "#74c08d",
    skills: ["Cloud"],
    documentSlug: "job-roles-in-the-cloud",
    documentFileName: "156_3_4826221_1705927366_AWS Course Completion Certificate.pdf",
  },
  {
    id: "achievement-data-analytics",
    title: "Data Analytics untuk Siswa SMA/Sederajat",
    issuer: "Digital Talent Scholarship",
    receivedAt: "July 2024",
    type: "Certificate",
    note: "Issued through Digital Talent Scholarship with a registered credential ID for verification.",
    accent: "#2f8a57",
    skills: ["Data Analyst"],
    credentialId: "1948180850-12/TA/BLSDM.Kominfo/2024",
    documentSlug: "data-analytics-siswa-sma",
    documentFileName: "Sertifikat_GUNAWAN MADIA PRATAMA_Data Analytics untuk Siswa SMA_Sederajat.pdf",
  },
];

export const contact = {
  title: "Contact",
  description: "You can reach me directly by email or through the links below.",
} as const;
