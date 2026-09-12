export const portfolioKnowledge = {
  profile: {
    name: "Dikriana",
    role: "Informatics Engineering Student",
    summary:
      "Mahasiswa Teknik Informatika dengan latar belakang Teknik Komputer dan Jaringan, pengalaman magang sebagai IT Support, serta aktif membangun dan mempelajari software, web, infrastructure, dan game development.",
    institution: "Muhammadiyah Kota Sukabumi",
    availability: "Terbuka untuk kesempatan internship",
    email: "dikriana3@gmail.com",
    github: "https://github.com/Dikri-Shadow",
  },
  experience: [
    {
      role: "IT Support Intern",
      organization: "Diskominfo Kota Sukabumi",
      period: "Maret 2022 – Mei 2022",
      activities: [
        "troubleshooting komputer",
        "troubleshooting jaringan",
        "instalasi dan konfigurasi software",
        "pengecekan perangkat",
        "membantu kebutuhan teknis pengguna",
      ],
    },
  ],
  education: [
    "Mahasiswa Teknik Informatika — Muhammadiyah Kota Sukabumi",
    "SMK — Teknik Komputer dan Jaringan",
  ],
  certifications: [
    "KKNI Level II Teknik Komputer dan Jaringan — BNSP — credential earned; validity ended in 2026",
  ],
  capabilities: {
    development: ["React", "TypeScript", "Vite"],
    backend: ["Node.js", "Express", "SQLite", "Zod"],
    infrastructure: [
      "Server fundamentals",
      "loopback-only origin",
      "health monitoring",
    ],
    itSupport: [
      "Computer troubleshooting",
      "Network troubleshooting",
      "Software installation and configuration",
      "User technical support",
      "Hardware checking",
    ],
    game: ["Game development — learning; public case study not yet available"],
  },
  projects: [
    "Personal Portfolio — public source evidence for React, TypeScript, Vite, Node.js, Express, SQLite, and Zod. Other project case studies are being prepared.",
  ],
  currentlyLearning: [
    "React & TypeScript patterns",
    "Backend API fundamentals",
    "Automated software testing",
    "Infrastructure and deployment basics",
  ],
};
export const allowedSections = [
  "home",
  "about",
  "projects",
  "experience",
  "capabilities",
  "education",
  "contact",
] as const;
export type RelatedSection = (typeof allowedSections)[number];
