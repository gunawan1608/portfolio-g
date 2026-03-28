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
  role: "Software Engineering Student",
  location: "Indonesia",
  intro:
    "I build clean websites with thoughtful motion, responsive layouts, and a strong focus on detail.",
  shortBio:
    "This portfolio is still growing and will be filled step by step with real projects, experience, and certificates.",
  about:
    "I'm currently in my final year of vocational high school, focusing on software engineering. Right now, I'm actively learning, building projects, and preparing myself for the next step in my journey as a developer.",
  focus: [
    "Learning Laravel Framework",
    "Developing Personal Portfolio",
    "Building Real-World Projects",
  ],
  email: "tamagunawan08@gmail.com",
  identityCard: {
    label: "Identity Card",
    serial: "ID / GM-160108 / JKT",
    issuedBy: "About Me Showcase",
    cityLabel: "Jakarta, Indonesia",
    cityCoordinates: [-6.2088, 106.8456] as [number, number],
    bounds: {
      southWest: [-11.2, 94.2] as [number, number],
      northEast: [6.3, 141.2] as [number, number],
    },
    fields: [
      { label: "Name", value: "Gunawan Madia Pratama", fullWidth: true },
      { label: "Gender", value: "Male" },
      { label: "Date of Birth", value: "16 January 2008" },
      { label: "Location", value: "Jakarta, Indonesia" },
      { label: "Role", value: "Software Engineering Student" },
      {
        label: "Status",
        value: "Final-year student, State Vocational High School 1 Jakarta",
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
      "A short horror game project built in Godot with scene-based tension, atmosphere-first presentation, and a focused gameplay loop.",
    stack: ["Godot", "Game Design", "Level Flow"],
    status: "Finished",
    accent: "#2f8a57",
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
      "A web-based conversion project focused on a cleaner user flow for authentication, landing experience, and document conversion actions.",
    stack: ["Laravel", "React", "PHP", "JavaScript"],
    status: "Finished",
    accent: "#4f9f73",
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
      "A desktop application designed to manage patient-related workflows, hospital records, and key operational screens in one interface.",
    stack: ["C#", ".NET", "Desktop UI"],
    status: "Finished",
    accent: "#6eb58c",
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
      "A PHP-based library system covering landing flow, user registration, and core management pages for everyday book and member handling.",
    stack: ["PHP", "MySQL", "Web UI"],
    status: "Finished",
    accent: "#7ac497",
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
    type: "Training",
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
    type: "Training ",
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
