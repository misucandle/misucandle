"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export default defineConfig({
  name: "default",
  title: "Misu Candle",
  basePath: "/studio", // phải khớp với thư mục app/studio
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Nội dung")
          .items([
            orderableDocumentListDeskItem({
              type: "product",
              title: "Sản phẩm",
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: "category",
              title: "Category",
              S,
              context,
            }),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
