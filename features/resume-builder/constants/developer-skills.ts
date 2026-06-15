import type { DeveloperSkillCategoryId, DeveloperSkillGroups } from "@/types/resume-builder";

export interface DeveloperSkillCategoryDef {
  id: DeveloperSkillCategoryId;
  skills: string[];
  stackHighlights: string[];
}

export const DEVELOPER_SKILL_CATEGORIES: DeveloperSkillCategoryDef[] = [
  {
    id: "backend",
    skills: [
      "Node.js",
      "Python",
      "Java",
      "Go",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "GraphQL",
      "REST APIs",
      "Microservices",
    ],
    stackHighlights: ["Express", "NestJS", "Django", "FastAPI", "Spring Boot", "Flask"],
  },
  {
    id: "frontend",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Responsive Design",
      "Webpack",
      "Accessibility",
    ],
    stackHighlights: ["React", "Next.js", "Vue.js", "Angular", "Tailwind CSS", "Redux", "Vite"],
  },
  {
    id: "devops",
    skills: ["Linux", "Nginx", "Monitoring", "Shell Scripting", "Git", "Agile"],
    stackHighlights: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
      "CI/CD",
      "GitHub Actions",
      "Terraform",
      "Jenkins",
    ],
  },
];

export const EMPTY_DEVELOPER_SKILLS: DeveloperSkillGroups = {
  backend: [],
  frontend: [],
  devops: [],
};

export function getCategoryDef(id: DeveloperSkillCategoryId): DeveloperSkillCategoryDef {
  return DEVELOPER_SKILL_CATEGORIES.find((category) => category.id === id)!;
}

export function getAllCategorySuggestions(id: DeveloperSkillCategoryId): string[] {
  const category = getCategoryDef(id);
  return [...category.skills, ...category.stackHighlights];
}

export function isStackHighlight(categoryId: DeveloperSkillCategoryId, skill: string): boolean {
  return getCategoryDef(categoryId).stackHighlights.includes(skill);
}

export function flattenDeveloperSkills(groups: DeveloperSkillGroups): string[] {
  return [...new Set([...groups.backend, ...groups.frontend, ...groups.devops])];
}

export function countDeveloperSkills(groups: DeveloperSkillGroups): number {
  return flattenDeveloperSkills(groups).length;
}

export function distributeSkillsToDeveloperGroups(skills: string[]): DeveloperSkillGroups {
  const groups: DeveloperSkillGroups = { backend: [], frontend: [], devops: [] };

  for (const skill of skills) {
    const normalized = skill.trim();
    if (!normalized) continue;

    for (const category of DEVELOPER_SKILL_CATEGORIES) {
      const all = getAllCategorySuggestions(category.id);
      const matched = all.some((candidate) => {
        const skillLower = normalized.toLowerCase();
        const candidateLower = candidate.toLowerCase();
        return (
          skillLower === candidateLower ||
          skillLower.includes(candidateLower) ||
          candidateLower.includes(skillLower)
        );
      });

      if (matched && !groups[category.id].includes(normalized)) {
        groups[category.id].push(normalized);
        break;
      }
    }
  }

  return groups;
}
