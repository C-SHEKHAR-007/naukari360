# Syllabus Admin Module - Feature Plan

This document tracks the remaining features required to complete the Syllabus Admin UI, enabling administrators to create, edit, and manage syllabuses directly from the dashboard.

## Phase 1: Core Form Structure
- [x] Create `/admin/syllabuses/new/page.tsx` for the "Create Syllabus" view.
- [x] Create `/admin/syllabuses/[id]/page.tsx` for the "Edit Syllabus" view.
- [x] Build a unified `SyllabusForm` client component to handle both creation and editing.
- [x] Implement standard text inputs:
  - [x] `titleEn` (English Title - Required)
  - [x] `titleHi` (Hindi Title - Optional)
  - [x] `slug` (URL Slug - Required, Auto-generated from title but editable)
- [x] Implement a dropdown selector to link the Syllabus to an existing Job Post (Optional).

## Phase 2: Rich Content Editors
- [x] **Markdown Editor:** Add a large text area for `markdownContent`. This field will power the beautiful reading view on the left side of the public syllabus page.
- [x] **Dynamic JSON Tracker Builder:** Build an interactive field-array builder for the `content` field.
  - [x] Add "Add Subject" button to create a new syllabus section (e.g., "General Awareness").
  - [x] Add "Add Topic" button inside each Subject to add individual checklist items (e.g., "History", "Geography").
  - [x] Include drag-and-drop or simple up/down arrows to reorder subjects and topics.

## Phase 3: Server Actions & Database Operations
- [x] Write server action `createSyllabus(data)` to validate and insert the new syllabus into the database.
- [x] Write server action `updateSyllabus(id, data)` to validate and update an existing syllabus.
- [x] Write server action `deleteSyllabus(id)` and connect it to the trash icon on the data table.
- [x] Implement `revalidatePath` logic to instantly clear the Next.js cache for `/admin/syllabuses` and the public `/syllabus` routes upon data mutation.

## Phase 4: Polish & Error Handling
- [x] Implement Zod validation on the client and server to ensure required fields (title, slug) are present.
- [x] Add success/error toast notifications using the existing toast system.
- [x] Ensure the form handles the unique constraint on `slug` and gracefully returns an error if the admin tries to use a duplicate slug.
