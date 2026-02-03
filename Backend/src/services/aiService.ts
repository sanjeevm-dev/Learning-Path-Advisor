import { resourceRepository } from "../data/resourceRepository";
import { AIRecommendRequest } from "../schemas/aiRecommendationSchema";
import { LearningResource } from "../models/learningResource";

export class AIService {
  static recommendLearningPath({ goal, maxItems = 5 }: AIRecommendRequest) {
    const keywords = this.extractKeywords(goal);

    const scored = resourceRepository
      .findAll()
      .map((resource) => ({
        resource,
        score: this.scoreResource(resource, keywords),
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

    return {
      summary: `Here is a suggested learning path for ${goal}.`,
      resources,
      totalEstimatedMinutes: resources.reduce(
        (sum, r) => sum + r.estimatedMinutes,
        0,
      ),
      explanation: `Resources were ranked using keyword relevance (${keywords.join(
        ", ",
      )}), with higher weight for tags, titles, and beginner-friendly content.`,
    };
  }

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
    ]);

    return goal
      .toLowerCase()
      .split(/\W+/)
      .filter((k) => k.length > 2 && !stopWords.has(k));
  }

  private static scoreResource(
    resource: LearningResource,
    keywords: string[],
  ): number {
    let score = 0;

    for (const keyword of keywords) {
      if (resource.tags.some((t) => t.toLowerCase() === keyword)) {
        score += 5; // 🔥 strongest signal
      }

      if (resource.title.toLowerCase().includes(keyword)) {
        score += 3;
      }

      if (resource.description.toLowerCase().includes(keyword)) {
        score += 1;
      }
    }

    if (
      score > 0 &&
      ["beginner", "basics", "start", "intro"].some((k) =>
        keywords.includes(k),
      ) &&
      resource.difficulty.toLowerCase() === "beginner"
    ) {
      score += 2;
    }

    return score;
  }
}
