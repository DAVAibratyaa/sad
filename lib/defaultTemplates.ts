export interface Template {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export const defaultTemplates: Template[] = [
  // Chest X-Ray Templates
  {
    id: "normal-chest-xray",
    category: "chest",
    title: "Normal Chest X-Ray",
    content: "Normal chest radiograph with no acute cardiopulmonary process. The lungs are clear bilaterally without focal consolidation, pneumothorax, or pleural effusion. The cardiomediastinal silhouette is within normal limits. The visualized osseous structures are intact.",
    tags: ["normal", "chest", "xray", "routine"]
  },
  {
    id: "clear-lungs",
    category: "chest",
    title: "Clear Lungs",
    content: "The lungs are clear bilaterally. No pleural effusion or pneumothorax. No focal consolidation or suspicious pulmonary masses.",
    tags: ["lungs", "clear", "normal"]
  },
  {
    id: "normal-cardiac",
    category: "chest",
    title: "Normal Cardiac Silhouette",
    content: "The cardiomediastinal silhouette is within normal limits. The heart size is normal with no evidence of cardiomegaly.",
    tags: ["cardiac", "normal", "heart"]
  },

  // Technique Templates
  {
    id: "chest-xray-technique",
    category: "technique",
    title: "Standard Chest X-Ray",
    content: "PA and lateral views of the chest were obtained using standard technique.",
    tags: ["technique", "chest", "standard"]
  },
  {
    id: "portable-chest-technique",
    category: "technique",
    title: "Portable Chest X-Ray",
    content: "Single AP view of the chest was obtained at bedside using portable technique.",
    tags: ["technique", "portable", "bedside"]
  },

  // Comparison Templates
  {
    id: "no-priors",
    category: "comparison",
    title: "No Prior Studies",
    content: "No prior studies are available for comparison.",
    tags: ["comparison", "no priors"]
  },
  {
    id: "stable-comparison",
    category: "comparison",
    title: "Stable Comparison",
    content: "No significant interval change compared to prior study from [DATE].",
    tags: ["comparison", "stable"]
  },

  // Findings Templates
  {
    id: "pneumonia-findings",
    category: "findings",
    title: "Pneumonia",
    content: "There is a focal area of consolidation in the [RIGHT/LEFT] [LOBE] consistent with pneumonia. No pleural effusion or pneumothorax.",
    tags: ["findings", "pneumonia", "consolidation"]
  },
  {
    id: "pleural-effusion",
    category: "findings",
    title: "Pleural Effusion",
    content: "There is a [SMALL/MODERATE/LARGE] [RIGHT/LEFT] pleural effusion. No pneumothorax or focal consolidation.",
    tags: ["findings", "pleural", "effusion"]
  },

  // Impression Templates
  {
    id: "normal-impression",
    category: "impression",
    title: "Normal Study",
    content: "1. No acute cardiopulmonary process.",
    tags: ["impression", "normal"]
  },
  {
    id: "pneumonia-impression",
    category: "impression",
    title: "Pneumonia",
    content: "1. [RIGHT/LEFT] [LOBE] pneumonia.\n2. Otherwise clear lungs without pleural effusion or pneumothorax.",
    tags: ["impression", "pneumonia"]
  }
];

export const getTemplatesByCategory = (category: string): Template[] => {
  return defaultTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return defaultTemplates.find(template => template.id === id);
};

export const searchTemplates = (query: string): Template[] => {
  const searchTerms = query.toLowerCase().split(" ");
  return defaultTemplates.filter(template => {
    const searchableText = `${template.title} ${template.content} ${template.tags.join(" ")}`.toLowerCase();
    return searchTerms.every(term => searchableText.includes(term));
  });
};
