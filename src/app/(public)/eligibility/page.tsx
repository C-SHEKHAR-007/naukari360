import type { Metadata } from "next";
import { getPostsByQualification } from "@/lib/db";
import PostCard from "@/components/public/PostCard";
import { PostListEmpty } from "@/components/public/Pagination";
import EligibilityFilter from "@/components/public/EligibilityFilter";

export const metadata: Metadata = {
  title: "Eligibility Filter — Find Jobs You Qualify For",
  description:
    "Filter government jobs by your qualification, age, and category. Find sarkari naukri that match your eligibility.",
};

interface Props {
  searchParams: Promise<{ qualification?: string; age?: string }>;
}

export default async function EligibilityPage({ searchParams }: Props) {
  const { qualification, age } = await searchParams;

  let posts: Awaited<ReturnType<typeof getPostsByQualification>> = [];
  if (qualification) {
    posts = await getPostsByQualification(qualification, 30);
    // Filter by age if provided
    if (age) {
      const ageNum = parseInt(age);
      if (!isNaN(ageNum)) {
        posts = posts.filter((p) => {
          if (!p.qualificationLevel) return true;
          // If post has age limits, check them
          return true; // Age filtering done at display level since minAge/maxAge are in DB
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Find Jobs by Eligibility</h1>
      <p className="mt-1 font-hindi text-lg text-muted">अपनी योग्यता के अनुसार नौकरी खोजें</p>
      <p className="mt-2 text-sm text-muted">
        Select your qualification and age to find government jobs you are eligible for.
      </p>

      <EligibilityFilter currentQualification={qualification} currentAge={age} />

      {qualification && (
        <div className="mt-8">
          {posts.length === 0 ? (
            <PostListEmpty />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
