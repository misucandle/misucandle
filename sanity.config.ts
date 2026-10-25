// sanity.config.ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Misu Candle Admin Studio",
  basePath: "/studio", // This must match your Next.js route path
  plugins: [structureTool()],
  schema: {
    types: [], // Your schema definitions go here
  },
});
