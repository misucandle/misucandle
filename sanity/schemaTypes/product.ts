import { defineType, defineField } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const product = defineType({
  name: "product",
  title: "Sản phẩm",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "product" }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Tên sản phẩm",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Bấm Generate để tạo tự động từ SKU.",
      options: { source: "sku", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "price",
      title: "Giá tiền",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [
          { title: "Còn hàng", value: "in_stock" },
          { title: "Hết hàng", value: "out_of_stock" },
          { title: "Pre-order", value: "pre_order" },
        ],
        layout: "radio",
      },
      initialValue: "in_stock",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "quantity",
      title: "Số lượng tồn kho",
      description:
        "Chỉ cần nhập khi sản phẩm đang Còn hàng. Để trống nếu không muốn hiện số.",
      type: "number",
      hidden: ({ document }) => document?.status !== "in_stock",
      validation: (r) => r.integer().min(0),
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 5 }),
    defineField({ name: "notes", title: "Mùi hương chính", type: "string" }),
    defineField({
      name: "gallery",
      title: "Ảnh sản phẩm",
      description:
        "Kéo thả nhiều ảnh cùng lúc. Ảnh ĐẦU TIÊN là ảnh chính (hiện ở trang chủ); kéo ảnh lên đầu để đổi ảnh chính.",
      type: "array",
      options: { layout: "grid" },
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Mô tả ảnh (alt)",
              type: "string",
              description: "Tuỳ chọn. Để trống sẽ dùng tên sản phẩm.",
            }),
          ],
        },
      ],
    }),

    // Field cũ: giữ để dữ liệu hiện có không bị mất, tự ẩn khi trống
    defineField({
      name: "image",
      title: "Ảnh (cũ)",
      type: "image",
      deprecated: { reason: "Hãy dùng mục 'Ảnh sản phẩm' phía trên" },
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: "imageUrl",
      title: "Link ảnh (cũ)",
      type: "url",
      hidden: ({ value }) => !value,
    }),
  ],
  preview: {
    select: { title: "name", sku: "sku", status: "status", media: "gallery.0" },
    prepare({ title, sku, status, media }) {
      const label =
        status === "out_of_stock"
          ? "Hết hàng"
          : status === "pre_order"
            ? "Pre-order"
            : "Còn hàng";
      return { title, subtitle: `${sku ?? ""} · ${label}`, media };
    },
  },
});
