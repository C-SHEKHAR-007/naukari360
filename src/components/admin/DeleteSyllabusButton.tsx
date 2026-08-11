"use client";

import { Trash2 } from "lucide-react";
import { deleteSyllabus } from "@/app/(admin)/admin/(dashboard)/syllabuses/actions";

export default function DeleteSyllabusButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this syllabus? This action cannot be undone.")) {
      return;
    }
    
    const result = await deleteSyllabus(id);
    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      title="Delete Syllabus"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
