import { portfolioKnowledge, type RelatedSection } from "./knowledge.js";
export interface AssistantAnswer {
  answer: string;
  source: "ollama" | "fallback";
  relatedSection?: RelatedSection;
  relatedCapability?: string;
}
const unsafe =
  /(ignore (all |the )?(previous|prior) instructions|system prompt|developer message|read (a |the )?(file|filesystem)|run (a )?(command|shell)|show (the )?(env|environment|secret|token|credential))/i;
export function isUnsafeAssistantQuery(question: string) {
  return unsafe.test(question);
}
export function isDeterministicFaq(question: string) {
  const q = question.trim().toLowerCase().replace(/[?.!]$/, "");
  return /^(what can dikriana do|apa kemampuan dikriana|what technologies are used in this portfolio|teknologi apa yang digunakan|what is dikriana (currently )?learning|apa yang sedang dipelajari dikriana|is dikriana available for internship|apakah dikriana tersedia untuk magang)$/.test(
    q,
  );
}
export function deterministicAnswer(question: string): AssistantAnswer | null {
  const q = question.toLowerCase();
  const id =
    /\b(apa|siapa|kemampuan|bisa|pengalaman|belajar|tersedia|magang|dukungan|teknologi)\b/.test(
      q,
    );
  if (isUnsafeAssistantQuery(question))
    return {
      answer: id
        ? "Saya hanya dapat membantu dengan informasi profesional publik dalam portfolio Dikriana. Saya tidak dapat membuka prompt, file, environment, atau menjalankan perintah."
        : "I can only help with public professional information in Dikriana’s portfolio. I cannot reveal prompts, read files or environment data, or run commands.",
      source: "fallback",
    };
  if (/it support|diskominfo|magang|experience|pengalaman/.test(q))
    return {
      answer: id
        ? "Dikriana menjalani magang IT Support di Diskominfo Kota Sukabumi pada Maret–Mei 2022. Aktivitasnya mencakup troubleshooting komputer dan jaringan, instalasi serta konfigurasi software, pengecekan perangkat, dan membantu kebutuhan teknis pengguna."
        : "Dikriana completed an IT Support internship at Diskominfo Kota Sukabumi from March–May 2022, covering computer and network troubleshooting, software installation and configuration, device checks, and user assistance.",
      source: "fallback",
      relatedSection: "experience",
      relatedCapability: "computer-troubleshooting",
    };
  if (/backend|express|sqlite|zod|node/.test(q))
    return {
      answer: id
        ? "Capability backend yang dapat diverifikasi dari portfolio ini adalah Node.js, Express, SQLite, dan Zod, masing-masing dengan evidence pada API, validasi, keamanan, dan penyimpanan contact."
        : "Verified backend capabilities in this portfolio include Node.js, Express, SQLite, and Zod, evidenced by its APIs, validation, security middleware, and contact storage.",
      source: "fallback",
      relatedSection: "capabilities",
      relatedCapability: "express",
    };
  if (/skill|capabilit|kemampuan|strongest|bisa|what can/.test(q))
    return {
      answer: id
        ? "Evidence terkuat Dikriana saat ini adalah pengalaman praktis IT Support dan project experience membangun portfolio full-stack ini dengan React, TypeScript, Node.js, Express, SQLite, dan Zod."
        : "Dikriana’s strongest current evidence is practical IT Support experience and project experience building this full-stack portfolio with React, TypeScript, Node.js, Express, SQLite, and Zod.",
      source: "fallback",
      relatedSection: "capabilities",
    };
  if (/learn|belajar/.test(q))
    return {
      answer: id
        ? `Saat ini Dikriana mempelajari ${portfolioKnowledge.currentlyLearning.join(", ")}.`
        : `Dikriana is currently learning ${portfolioKnowledge.currentlyLearning.join(", ")}.`,
      source: "fallback",
      relatedSection: "capabilities",
    };
  if (/available|availability|tersedia|internship/.test(q))
    return {
      answer: id
        ? "Ya. Dikriana terbuka untuk kesempatan internship."
        : "Yes. Dikriana is available for internship opportunities.",
      source: "fallback",
      relatedSection: "contact",
    };
  if (/technolog|stack|react|typescript|vite/.test(q))
    return {
      answer: id
        ? "Portfolio ini menggunakan React, TypeScript, Vite, Node.js, Express, SQLite, dan Zod. Penggunaan teknologi ini merupakan project evidence, bukan klaim pengalaman production eksternal."
        : "This portfolio uses React, TypeScript, Vite, Node.js, Express, SQLite, and Zod. This is project evidence, not a claim of external production experience.",
      source: "fallback",
      relatedSection: "capabilities",
    };
  if (/education|pendidikan|campus|kampus/.test(q))
    return {
      answer: id
        ? "Dikriana adalah mahasiswa Teknik Informatika di Muhammadiyah Kota Sukabumi, dengan latar belakang SMK Teknik Komputer dan Jaringan."
        : "Dikriana is an Informatics Engineering student at Muhammadiyah Kota Sukabumi, with a vocational background in Computer and Network Engineering.",
      source: "fallback",
      relatedSection: "education",
    };
  if (/certif|sertif|bnsp|kkni/.test(q))
    return {
      answer: id
        ? "Dikriana memiliki KKNI Level II Teknik Komputer dan Jaringan dari BNSP, terbit pada 2023 dan berlaku sampai 2026. Statusnya di portfolio adalah Previously certified."
        : "Dikriana earned the BNSP KKNI Level II Computer and Network Engineering certification in 2023. It was valid through 2026 and is listed as Previously certified.",
      source: "fallback",
      relatedSection: "education",
    };
  if (/project|proyek|repository|repo/.test(q))
    return {
      answer: id
        ? "Source portfolio ini menjadi evidence untuk React, TypeScript, Vite, Node.js, Express, SQLite, dan Zod. Case study project lain masih disiapkan dan tidak diklaim sebagai project nyata."
        : "This portfolio source is evidence for React, TypeScript, Vite, Node.js, Express, SQLite, and Zod. Other project case studies are still being prepared and are not presented as completed work.",
      source: "fallback",
      relatedSection: "projects",
    };
  return null;
}
export function fallbackAnswer(question: string): AssistantAnswer {
  const deterministic = deterministicAnswer(question);
  if (deterministic) return deterministic;
  const q = question.toLowerCase();
  const id = /\b(apa|siapa|kemampuan|bisa|pengalaman|belajar|tersedia|magang|dukungan|teknologi)\b/.test(q);
  return {
    answer: id
      ? "Informasi tersebut belum tersedia di portfolio Dikriana. Anda dapat bertanya tentang experience, capabilities, education, teknologi portfolio, atau availability internship."
      : "That information is not currently available in Dikriana’s portfolio. You can ask about experience, capabilities, education, portfolio technologies, or internship availability.",
    source: "fallback",
  };
}
