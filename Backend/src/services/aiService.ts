// services/aiService.ts
import { resourceRepository } from "../data/resourceRepository";
import { AIRecommendRequest } from "../schemas/aiRecommendationSchema";
import { LearningResource } from "../models/learningResource";

export class AIService {
  // AI Recommendation Logic with keywords and prioritization
  static async recommendLearningPath({
    goal,
    maxItems = 5,
  }: AIRecommendRequest) {
    const keywords = this.extractKeywords(goal);

    const isBeginner = ["beginner", "start", "basics", "intro", "first"].some(
      (k) => keywords.includes(k),
    );

    const allResources = await resourceRepository.findAll();

    const scored = allResources
      .map((resource) => ({
        resource,
        score: this.scoreResource(resource, keywords, isBeginner),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems);

    const resources = scored.map(({ resource }) => ({
      id: resource.id,
      title: resource.title,
      difficulty: resource.difficulty,
      resourceType: resource.resourceType,
      estimatedMinutes: resource.estimatedMinutes,
    }));

    const totalEstimatedMinutes = resources.reduce(
      (sum, r) => sum + r.estimatedMinutes,
      0,
    );

    const explanation = `Selected ${resources.length} resources based on keyword relevance (${keywords.join(
      ", ",
    )})${isBeginner ? ". Prioritized beginner content." : ""}`;

    return {
      summary: `Here is a suggested learning path for ${goal}.`,
      resources,
      totalEstimatedMinutes,
      explanation,
    };
  }

  // Helper: extract keywords from goal
  private static extractKeywords(goal: string): string[] {
    const stopWords = new Set([
      "i",
      "want",
      "to",
      "learn",
      "as",
      "a",
      "the",
      "of",
      "for",
      "and",
      "my",
      "in",
    ]);

    return goal
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // remove punctuation
      .split(/\s+/) // split into words
      .filter((k) => k.length > 2 && !stopWords.has(k)); // filter short words
  }

  // Helper: score a resource
  private static scoreResource(
    resource: LearningResource,
    keywords: string[],
    isBeginner: boolean,
  ): number {
    let score = 0;

    const textFields = [
      resource.title.toLowerCase(),
      resource.description.toLowerCase(),
      resource.tags.join(" ").toLowerCase(),
    ];

    for (const keyword of keywords) {
      //  tag matches weighted strongest
      if (resource.tags.some((t) => t.toLowerCase() === keyword)) score += 5;

      // title matches
      if (resource.title.toLowerCase().includes(keyword)) score += 3;

      // description matches
      if (resource.description.toLowerCase().includes(keyword)) score += 1;
    }
    // if isBeginner and resource is beginner
    if (isBeginner && resource.difficulty.toLowerCase() === "beginner") {
      score += 2;
    }

    return score;
  }
}
