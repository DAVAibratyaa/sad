export const SECTIONS = [
  "Procedure",
  "History",
  "Technique",
  "Comparison",
  "Lungs",
  "Pleura",
  "Cardiomediastinal",
  "Bones",
  "Impression"
] as const;

export type Section = typeof SECTIONS[number];

export interface SectionContent {
  content: string;
  lastModified: Date;
  isEnhancing?: boolean;
}

export type ReportSections = {
  [key in Section]: SectionContent;
};

export interface Template {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export interface SimpleTemplate {
  content: string;
}
