import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
const schema = readFileSync(schemaPath, "utf-8");

/**
 * Extract model block from schema
 */
function getModelBlock(modelName: string): string {
  const regex = new RegExp(`model ${modelName} \\{([\\s\\S]*?)\\n\\}`, "m");
  const match = schema.match(regex);
  return match ? match[1] : "";
}

describe("Prisma Schema — Database Indexes", () => {
  describe("Post model indexes", () => {
    const postBlock = getModelBlock("Post");

    it("has index on status for filtering published posts", () => {
      expect(postBlock).toContain("@@index([status])");
    });

    it("has index on categoryId for category-based queries", () => {
      expect(postBlock).toContain("@@index([categoryId])");
    });

    it("has index on stateId for state-based queries", () => {
      expect(postBlock).toContain("@@index([stateId])");
    });

    it("has index on lastDate for closing-soon queries", () => {
      expect(postBlock).toContain("@@index([lastDate])");
    });

    it("has index on examDate for date-range queries", () => {
      expect(postBlock).toContain("@@index([examDate])");
    });

    it("has index on createdAt for ordering", () => {
      expect(postBlock).toContain("@@index([createdAt])");
    });

    it("has composite index on [status, createdAt] for latest posts query", () => {
      expect(postBlock).toContain("@@index([status, createdAt])");
    });

    it("has composite index on [status, categoryId] for category listing", () => {
      expect(postBlock).toContain("@@index([status, categoryId])");
    });

    it("has composite index on [status, stateId] for state listing", () => {
      expect(postBlock).toContain("@@index([status, stateId])");
    });
  });

  describe("EmailSubscriber model indexes", () => {
    const block = getModelBlock("EmailSubscriber");

    it("has unique constraint on email", () => {
      expect(block).toContain("@unique");
    });

    it("has composite index on [isActive, subscribedAt] for active subscriber queries", () => {
      expect(block).toContain("@@index([isActive, subscribedAt])");
    });
  });

  describe("ContactSubmission model indexes", () => {
    const block = getModelBlock("ContactSubmission");

    it("has composite index on [isRead, createdAt] for admin inbox queries", () => {
      expect(block).toContain("@@index([isRead, createdAt])");
    });
  });

  describe("PageView model indexes", () => {
    const block = getModelBlock("PageView");

    it("has unique constraint on [postId, date]", () => {
      expect(block).toContain("@@unique([postId, date])");
    });

    it("has index on date for analytics queries", () => {
      expect(block).toContain("@@index([date])");
    });
  });
});
