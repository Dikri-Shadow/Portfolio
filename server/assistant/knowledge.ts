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
    "KKNI Level II Teknik Komputer dan Jaringan — BNSP — issued in 2023; validity ended in 2026; status: Previously certified",
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

export function selectPortfolioKnowledge(question: string) {
  const q = question.toLowerCase();
  if (/skill|stack|technolog|teknologi|capabilit|kemampuan|bisa/.test(q))
    return { profile: portfolioKnowledge.profile, capabilities: portfolioKnowledge.capabilities };
  if (/experience|pengalaman|intern|magang|diskominfo/.test(q))
    return { profile: portfolioKnowledge.profile, experience: portfolioKnowledge.experience };
  if (/education|pendidikan|kampus|university|school|sekolah/.test(q))
    return { profile: portfolioKnowledge.profile, education: portfolioKnowledge.education };
  if (/certif|sertif|bnsp|kkni/.test(q))
    return { profile: portfolioKnowledge.profile, certifications: portfolioKnowledge.certifications };
  if (/project|proyek|repository|repo/.test(q))
    return { profile: portfolioKnowledge.profile, projects: portfolioKnowledge.projects };
  if (/contact|kontak|email|github|available|tersedia/.test(q))
    return { profile: portfolioKnowledge.profile };
  if (/learn|belajar/.test(q))
    return { profile: portfolioKnowledge.profile, currentlyLearning: portfolioKnowledge.currentlyLearning };
  return { profile: portfolioKnowledge.profile };
}
