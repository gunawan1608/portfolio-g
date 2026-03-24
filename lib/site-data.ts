export const profile = {
  name: "Nama Anda",
  initials: "NA",
  role: "Front-end developer, designer, atau peran utama kamu",
  availability: "Open for selected freelance & collaborations",
  location: "Based in Indonesia",
  email: "hello@yourdomain.com",
  headline: {
    prefix: "Membangun",
    highlight: "identitas digital",
    suffix: "yang tenang, berkelas, dan relevan."
  },
  introduction:
    "Portfolio ini dirancang untuk menampilkan siapa kamu secara utuh: cara berpikir, kualitas kerja, dan detail personal yang membuat orang lebih mudah percaya dan terhubung.",
  summary:
    "Gunakan area ini untuk menjelaskan fokus utama kamu secara singkat. Idealnya 2-3 kalimat yang memperlihatkan keahlian, konteks, dan taste kamu dalam bekerja.",
  manifesto:
    "Saya percaya pengalaman digital yang kuat tidak harus ramai. Ia harus jelas, terasa matang, dan meninggalkan impresi yang tepat.",
  highlights: [
    {
      label: "Focus",
      value: "UI yang detail, struktur konten yang bersih, dan pengalaman yang terasa premium."
    },
    {
      label: "Strength",
      value: "Menggabungkan rasa desain, logika produk, dan implementasi yang rapi."
    },
    {
      label: "Fit",
      value: "Cocok untuk personal brand, landing page, showcase product, dan portfolio profesional."
    }
  ],
  stats: [
    {
      value: "03+",
      label: "Angka placeholder untuk tahun pengalaman atau lama eksplorasi bidangmu."
    },
    {
      value: "12",
      label: "Jumlah project, kolaborasi, atau studi kasus yang pernah kamu kerjakan."
    },
    {
      value: "UI / UX",
      label: "Fokus spesialisasi utama yang ingin langsung terbaca sejak awal."
    },
    {
      value: "Remote",
      label: "Tambahkan preferensi kerja seperti remote, hybrid, atau location-based."
    }
  ],
  socials: [
    {
      label: "LinkedIn",
      handle: "linkedin.com/in/username",
      href: "https://www.linkedin.com/in/username"
    },
    {
      label: "GitHub",
      handle: "github.com/username",
      href: "https://github.com/username"
    },
    {
      label: "Instagram",
      handle: "@username",
      href: "https://www.instagram.com/username"
    }
  ],
  about: {
    story:
      "Tulis narasi singkat tentang perjalanan kamu: latar belakang, cara kamu masuk ke bidang ini, dan kenapa kamu peduli pada kualitas pekerjaan. Bagian ini akan memberi konteks yang lebih manusiawi daripada sekadar daftar skill.",
    values: [
      "Saya suka pekerjaan yang punya struktur, ritme, dan perhatian pada detail kecil.",
      "Saya menikmati proses menyederhanakan ide rumit menjadi pengalaman yang mudah dipahami.",
      "Saya lebih memilih hasil yang terasa presisi dan jujur daripada desain yang ramai tapi dangkal."
    ]
  },
  contact: {
    title: "Mari bangun sesuatu yang terasa serius, personal, dan memorable.",
    description:
      "Jika kamu ingin menjadikan halaman ini sebagai portfolio pribadi yang benar-benar merepresentasikan kamu, kita bisa lanjut isi kontennya dengan data asli, project nyata, dan detail personal yang lebih spesifik."
  }
} as const;

export const approach = [
  {
    title: "Discover the signal",
    caption: "Context",
    description:
      "Mulai dari memahami siapa audiens kamu, citra seperti apa yang ingin dibangun, dan apa yang seharusnya langsung terasa dalam 10 detik pertama saat orang membuka portfolio."
  },
  {
    title: "Shape the story",
    caption: "Narrative",
    description:
      "Konten disusun agar tidak hanya informatif, tapi juga enak dibaca. Tujuannya membuat portfolio terasa seperti personal brand yang sadar arah, bukan sekadar halaman biodata."
  },
  {
    title: "Polish the experience",
    caption: "Execution",
    description:
      "Visual, spacing, dan tone interaksi dibuat bersih dan profesional, dengan cukup karakter supaya tampil beda tanpa terlihat berlebihan."
  }
] as const;

export const featuredWork = [
  {
    category: "Brand Website",
    title: "Boutique studio launch site",
    summary:
      "Contoh placeholder untuk project yang menonjolkan kemampuan storytelling visual, struktur halaman, dan detail presentasi brand yang lebih refined.",
    role:
      "Lead the visual direction, crafted the layout system, and translated the brand narrative into a responsive landing page.",
    stack: ["Next.js", "Tailwind CSS", "TypeScript", "Content strategy"],
    outcomes: [
      "Landing page terasa lebih premium dan lebih fokus pada trust-building.",
      "Konten dibuat lebih ringkas agar pesan utama cepat tertangkap.",
      "Sistem visual lebih konsisten untuk dipakai di halaman lanjutan."
    ]
  },
  {
    category: "Product Interface",
    title: "Internal operations dashboard",
    summary:
      "Placeholder untuk menampilkan kemampuan kamu di area product thinking, kejelasan informasi, dan pembuatan UI yang memprioritaskan efisiensi penggunaan.",
    role:
      "Mapped user flows, refined the dashboard hierarchy, and improved clarity for the most frequent operational tasks.",
    stack: ["Dashboard UI", "Design systems", "UX writing", "Frontend"],
    outcomes: [
      "Tampilan data dibuat lebih mudah dipindai oleh tim operasional.",
      "Prioritas visual membantu pengguna fokus ke aksi yang paling penting.",
      "Interface terasa lebih tenang walau memuat informasi yang padat."
    ]
  },
  {
    category: "Personal Brand",
    title: "Consultant profile experience",
    summary:
      "Contoh project personal-brand yang menekankan positioning, kredibilitas, dan rasa percaya sejak first impression.",
    role:
      "Built the end-to-end portfolio experience, from content framing and section flow to the visual treatment and responsive frontend implementation.",
    stack: ["Portfolio", "Copy framing", "Responsive UI", "Performance"],
    outcomes: [
      "Personal story, expertise, dan CTA terasa lebih terhubung.",
      "Halaman lebih siap dipakai untuk pitching, outreach, atau job applications.",
      "Kesan akhir lebih dewasa dan tidak terlihat seperti template massal."
    ]
  }
] as const;

export const personalPrompts = [
  {
    kicker: "Outside work",
    title: "Apa yang sering kamu lakukan saat sedang tidak bekerja?",
    description:
      "Isi dengan hobi, kebiasaan, atau ritual kecil yang benar-benar kamu nikmati. Ini membantu portfolio terasa lebih hangat dan lebih mudah diingat."
  },
  {
    kicker: "Now learning",
    title: "Hal apa yang sedang kamu dalami akhir-akhir ini?",
    description:
      "Bisa topik desain, coding, menulis, fotografi, atau bidang lain yang sedang membentuk cara berpikir kamu sekarang."
  },
  {
    kicker: "Beliefs",
    title: "Nilai pribadi apa yang paling memengaruhi cara kamu bekerja?",
    description:
      "Misalnya ketelitian, rasa ingin tahu, kejujuran dalam eksekusi, atau preferensi untuk menyelesaikan hal-hal sampai tuntas."
  }
] as const;
