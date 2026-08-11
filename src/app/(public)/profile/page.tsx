"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [qualification, setQualification] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login?callbackUrl=/profile");
    } else if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQualification(session.user.qualification || "");
      setState(session.user.state || "");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qualification, state }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        await update(); // Force NextAuth to refresh the session and fetch latest DB values
        setTimeout(() => router.push("/"), 2000);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt="Avatar" 
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border border-border object-cover" 
              referrerPolicy="no-referrer"
              unoptimized
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{session.user.name}</h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Personalize Your Job Feed</h2>
            <p className="text-sm text-muted">
              Select your qualification and state below. Your homepage feed will automatically prioritize jobs that match your profile!
            </p>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Highest Qualification</label>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Any Qualification</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="graduate">Graduate (BA, BSc, BCom, BTech, etc.)</option>
                <option value="post_graduate">Post Graduate (MA, MSc, MBA, etc.)</option>
                <option value="diploma">Diploma / ITI</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Preferred State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All India (Central Govt Jobs)</option>
                <option value="uttar_pradesh">Uttar Pradesh</option>
                <option value="bihar">Bihar</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="madhya_pradesh">Madhya Pradesh</option>
                <option value="delhi">Delhi</option>
                <option value="maharashtra">Maharashtra</option>
              </select>
            </div>
          </div>

          {message && (
            <div className={`rounded-lg p-3 text-sm ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
}
