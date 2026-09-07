import type { StaticImageData } from "next/image";
import nightmareStartScreen from "@/assets/images/projects/Nightmare House/start_screen.png";
import nightmareScene1 from "@/assets/images/projects/Nightmare House/scene1.png";
import nightmareScene2 from "@/assets/images/projects/Nightmare House/scene2.png";
import flexiConvertLanding from "@/assets/images/projects/FlexiConvert/landing_page.png";
import flexiConvertLogin from "@/assets/images/projects/FlexiConvert/login_page.png";
import flexiConvertConvert from "@/assets/images/projects/FlexiConvert/convert_to_pdf_page.png";
import hospitalLoginLanding from "@/assets/images/projects/Hospital Management System/login & landing_page.png";
import hospitalHome from "@/assets/images/projects/Hospital Management System/home_page.png";
import hospitalPatient from "@/assets/images/projects/Hospital Management System/patient_page.png";
import libraryLanding from "@/assets/images/projects/Sistem Perpustakaan/landing_pages.png";
import libraryRegistration from "@/assets/images/projects/Sistem Perpustakaan/registration_pages.png";
import libraryMain from "@/assets/images/projects/Sistem Perpustakaan/main_pages.png";

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
};

export type IdentityCardField = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

export type IdentityCardData = {
  label: string;
  serial: string;
  issuedBy: string;
  cityLabel: string;
  cityCoordinates: [number, number];
  bounds: {
    southWest: [number, number];
    northEast: [number, number];
  };
  fields: IdentityCardField[];
};

export type ProjectImageEntry = {
  src: StaticImageData;
  alt: string;
  label: string;
};

export type ProjectEntry = {
  id: string;
  category: string;
  platform: string;
  title: string;
  summary: string;
  stack: string[];
  status: string;
  accent: string;
  href: string;
  hrefLabel: string;
  images: ProjectImageEntry[];
};

export type SkillGroup = {
  title: string;
  summary: string;
  skills: string[];
  accent: string;
};

export type ExperienceEntry = {
  id: string;
  stage: string;
  title: string;
  location: string;
  period: string;
  duration: string;
  years: number;
  summary: string;
  type: string;
  status: string;
  theme: string;
  highlights: string[];
  accent: string;
  special?: boolean;
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

/* ── Manchester United palette, used consistently for every accent below ──
   Primary red   #DA020E   |  Deep red/maroon  #6E0410
   Black         #0B0B0C   |  Gold             #F6C500            */
const MU_RED = "#DA020E";
const MU_RED_DEEP = "#6E0410";
const MU_BLACK = "#0B0B0C";
const MU_GOLD = "#F6C500";

export const profile = {
  name: "Gunawan Madia Pratama",
  initials: "GM",
  role: "Fresh Graduate Student",
  location: "Indonesia",
  intro:
    "I recently graduated from SMK Negeri 1 Jakarta, and I like building web projects that feel clean, responsive, and easy to use.",
  shortBio:
    "This portfolio collects the projects, certificates, and school journey that shaped how I learn by building.",
  about:
    "I recently finished the Software Engineering program at SMK Negeri 1 Jakarta. These days I am revisiting older projects, practicing full-stack basics, and learning how to make interfaces feel calmer and more reliable.",
  focus: [
    "Reworking real projects",
    "Practicing Laravel, React, and clean UI",
    "Preparing for the next study or work step",
  ],
  email: "tamagunawan08@gmail.com",
  identityCard: {
    label: "Student Identity",
    serial: "ID / GM-160108 / INA",
    issuedBy: "Personal Portfolio",
    cityLabel: "Indonesia",
    cityCoordinates: [-2.5489, 118.0149] as [number, number],
    bounds: {
      southWest: [-11.2, 94.2] as [number, number],
      northEast: [6.3, 141.2] as [number, number],
    },
    fields: [
      { label: "Name", value: "Gunawan Madia Pratama", fullWidth: true },
      { label: "Gender", value: "Male" },
      { label: "Date of Birth", value: "16 January 2008" },
      { label: "Home Base", value: "Indonesia" },
      { label: "Current Status", value: "Fresh Graduate Student" },
      {
        label: "School",
        value: "Software Engineering - SMK Negeri 1 Jakarta",
        fullWidth: true,
      },
    ] satisfies IdentityCardField[],
  } satisfies IdentityCardData,
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
    id: "nightmare-house",
    category: "Game Development",
    platform: "Godot Engine",
    title: "Nightmare House",
    summary:
      "A short horror game I made in Godot, built around small scenes, slow tension, and a simple loop that gets to the point.",
    stack: ["Godot", "Game Design", "Level Flow"],
    status: "Finished",
    accent: MU_RED,
    href: "https://skibidi-team.itch.io/nightmare-house",
    hrefLabel: "Play on itch.io",
    images: [
      {
        src: nightmareStartScreen,
        alt: "Nightmare House start screen",
        label: "Start Screen",
      },
      {
        src: nightmareScene1,
        alt: "Nightmare House gameplay scene one",
        label: "Gameplay Scene 01",
      },
      {
        src: nightmareScene2,
        alt: "Nightmare House gameplay scene two",
        label: "Gameplay Scene 02",
      },
    ],
  },
  {
    id: "flexi-convert",
    category: "Web Development",
    platform: "Laravel & React",
    title: "FlexiConvert",
    summary:
      "A web conversion project where I worked on the landing page, login flow, and the basic document conversion experience.",
    stack: ["Laravel", "React", "PHP", "JavaScript"],
    status: "Finished",
    accent: MU_BLACK,
    href: "https://github.com/gunawan1608/flexi_convert",
    hrefLabel: "View repository",
    images: [
      {
        src: flexiConvertLanding,
        alt: "FlexiConvert landing page",
        label: "Landing Page",
      },
      {
        src: flexiConvertLogin,
        alt: "FlexiConvert login page",
        label: "Login Page",
      },
      {
        src: flexiConvertConvert,
        alt: "FlexiConvert convert to PDF page",
        label: "Convert to PDF",
      },
    ],
  },
  {
    id: "hospital-management-system",
    category: "Desktop App Development",
    platform: "C#",
    title: "Hospital Management System",
    summary:
      "A desktop app for hospital data practice, with screens for patients, records, and day-to-day management tasks.",
    stack: ["C#", ".NET", "Desktop UI"],
    status: "Finished",
    accent: MU_GOLD,
    href: "https://github.com/gunawan1608/hospital-management-system",
    hrefLabel: "View repository",
    images: [
      {
        src: hospitalLoginLanding,
        alt: "Hospital Management System login and landing page",
        label: "Login & Landing",
      },
      {
        src: hospitalHome,
        alt: "Hospital Management System home page",
        label: "Home Dashboard",
      },
      {
        src: hospitalPatient,
        alt: "Hospital Management System patient page",
        label: "Patient Page",
      },
    ],
  },
  {
    id: "library-management-system",
    category: "Web Development",
    platform: "PHP",
    title: "Library Management System",
    summary:
      "A PHP library system with landing, registration, and management pages for books and members.",
    stack: ["PHP", "MySQL", "Web UI"],
    status: "Finished",
    accent: MU_RED_DEEP,
    href: "https://github.com/gunawan1608/Sistem-Perpustakaan",
    hrefLabel: "View repository",
    images: [
      {
        src: libraryLanding,
        alt: "Library Management System landing page",
        label: "Landing Page",
      },
      {
        src: libraryRegistration,
        alt: "Library Management System registration page",
        label: "Registration",
      },
      {
        src: libraryMain,
        alt: "Library Management System main page",
        label: "Main Dashboard",
      },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    summary: "Interfaces that stay clean on different screen sizes.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    accent: MU_RED,
  },
  {
    title: "Motion",
    summary: "Small transitions that make a page feel clearer, not noisier.",
    skills: ["GSAP", "ScrollTrigger", "Framer Motion", "CSS Animation"],
    accent: MU_GOLD,
  },
  {
    title: "Workflow",
    summary: "A tidy way of working so projects are easier to continue.",
    skills: ["Git", "Component Structure", "Responsive UI", "Performance"],
    accent: MU_BLACK,
  },
];

export const experiences: ExperienceEntry[] = [
  {
    id: "karet-04-public-elementary-school",
    stage: "LVL 01",
    title: "Karet 04 Public Elementary School, Jakarta",
    location: "Jakarta, Indonesia",
    period: "2014 - 2020",
    duration: "6 Years",
    years: 6,
    summary:
      "Where my school journey started, and where I first built the habit of learning step by step.",
    type: "Education",
    status: "Completed",
    theme: "First School Years",
    highlights: ["Early journey", "Basics", "Jakarta"],
    accent: MU_RED,
  },
  {
    id: "public-junior-high-school-58-jakarta",
    stage: "LVL 02",
    title: "Public Junior High School 58, Jakarta",
    location: "Jakarta, Indonesia",
    period: "2020 - 2023",
    duration: "3 Years",
    years: 3,
    summary:
      "The stage where discipline, consistency, and a steadier learning rhythm started to matter more.",
    type: "Education",
    status: "Completed",
    theme: "Finding Rhythm",
    highlights: ["Growth phase", "Consistency", "Next step"],
    accent: MU_RED_DEEP,
  },
  {
    id: "state-vocational-high-school-1-jakarta",
    stage: "LVL 03",
    title: "State Vocational High School 1 Jakarta",
    location: "Software Engineering Track",
    period: "2023 - 2026",
    duration: "3 Years",
    years: 3,
    summary:
      "The place where I spent the most time building software projects and learning how code, design, and patience meet.",
    type: "Education",
    status: "Fresh Graduate Student",
    theme: "Software Engineering Student",
    highlights: ["RPL graduate", "Projects", "Portfolio"],
    accent: MU_RED,
  },
];

export const featuredExperience: ExperienceEntry = {
  id: "bsn-internship",
  stage: "BONUS",
  title: "National Standardization Agency of Indonesia (BSN)",
  location: "Special Internship Chapter",
  period: "2026",
  duration: "Special Milestone",
  years: 0,
  summary:
    "A special internship moment that gave me a closer look at how work feels outside the classroom.",
  type: "Internship",
  status: "Professional Experience",
  theme: "Internship Chapter",
  highlights: ["BSN", "Internship", "2026"],
  accent: MU_GOLD,
  special: true,
};

export const achievements: AchievementEntry[] = [
  {
    id: "achievement-rpl-training",
    title: "Pelatihan Kompetensi RPL",
    issuer: "P4 Jakarta Pusat - Dinas Pendidikan DKI Jakarta",
    receivedAt: "September 2025",
    type: "Training",
    note: "Training that helped me practice databases and Laravel development in a more structured way.",
    accent: MU_RED,
    skills: ["Database", "Laravel"],
    documentSlug: "pelatihan-kompetensi-rpl",
    documentFileName: "Gunawan Madia Pratama.pdf",
  },
  {
    id: "achievement-aws-cloud",
    title: "Job Roles in the Cloud",
    issuer: "AWS Training Online",
    receivedAt: "Jan 2024",
    type: "Training",
    note: "A short AWS learning path about cloud roles and the basics behind them.",
    accent: MU_GOLD,
    skills: ["Cloud"],
    documentSlug: "job-roles-in-the-cloud",
    documentFileName: "156_3_4826221_1705927366_AWS Course Completion Certificate.pdf",
  },
  {
    id: "achievement-data-analytics",
    title: "Data Analytics untuk Siswa SMA/Sederajat",
    issuer: "Digital Talent Scholarship",
    receivedAt: "July 2024",
    /* fixed: trailing space removed ("Training " -> "Training") which used
       to make this pill render with slightly different measured width /
       inconsistent trimming than the other two achievement cards */
    type: "Training",
    note: "A Digital Talent Scholarship certificate for data analytics learning.",
    accent: MU_RED_DEEP,
    skills: ["Data Analyst"],
    credentialId: "1948180850-12/TA/BLSDM.Kominfo/2024",
    documentSlug: "data-analytics-siswa-sma",
    documentFileName: "Sertifikat_GUNAWAN MADIA PRATAMA_Data Analytics untuk Siswa SMA_Sederajat.pdf",
  },
];

export const contact = {
  title: "Contact",
  description: "Email is the easiest way to reach me, but the links below work too.",
} as const;
