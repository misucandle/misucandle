import { createClient } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Thiếu NEXT_PUBLIC_SANITY_PROJECT_ID hoặc NEXT_PUBLIC_SANITY_DATASET trong .env.local",
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

// Cache 60 giây: khách sửa trong Studio, tối đa 60s web cập nhật
export const REVALIDATE = { next: { revalidate: 60 } } as const;

export type Status = "in_stock" | "pre_order" | "out_of_stock";

export type Product = {
  _id: string;
  sku: string;
  name: string;
  slug: string | null;
  price: number;
  status: Status | null;
  quantity: number | null;
  notes?: string | null;
  description?: string | null;
  category?: { title: string; slug: string; orderRank?: string | null } | null;
  gallery?: { url: string; alt?: string | null }[] | null;
  imageUrl?: string | null; // ảnh cũ (field image / imageUrl)
};

const FIELDS = `
  _id, sku, name, "slug": slug.current, price, status,quantity,
  notes, description,
  "category": category->{title, "slug": slug.current, orderRank},
  "gallery": gallery[defined(asset)]{ "url": asset->url, alt },
  "imageUrl": coalesce(image.asset->url, imageUrl)
`;

export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(orderRank, _createdAt desc){${FIELDS}}`;
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{${FIELDS}}`;

export type Availability = Status;

export function getAvailability(p: Product): Availability {
  if (p.status === "out_of_stock") return "out_of_stock";
  if (p.status === "pre_order") return "pre_order";
  if (p.quantity != null && p.quantity <= 0) return "out_of_stock";
  return "in_stock";
}

export const isOutOfStock = (p: Product) =>
  getAvailability(p) === "out_of_stock";

export function stockLabel(p: Product): string {
  switch (getAvailability(p)) {
    case "pre_order":
      return "Pre-order";
    case "out_of_stock":
      return "Hết hàng";
    default:
      return p.quantity != null ? `Còn ${p.quantity}` : "Còn hàng";
  }
}

export const optimizeImage = (url: string, w = 900) =>
  url.includes("cdn.sanity.io") ? `${url}?w=${w}&auto=format&fit=max` : url;

export async function getProducts() {
  "use cache";
  cacheTag("sanity");
  if (process.env.NODE_ENV === "development") cacheLife("seconds");
  else cacheLife("hours"); // production: chờ webhook làm mới
  return client.fetch<Product[]>(ALL_PRODUCTS_QUERY);
}

export async function getProduct(slug: string) {
  "use cache";
  cacheTag("sanity");
  if (process.env.NODE_ENV === "development") cacheLife("seconds");
  else cacheLife("hours");
  return client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug });
}

export type ProductImage = { url: string; alt: string };
export function getImages(p: Product): ProductImage[] {
  const result = (p.gallery ?? [])
    .filter((g) => g.url)
    .map((g) => ({ url: g.url, alt: g.alt || p.name }));

  if (result.length === 0 && p.imageUrl) {
    result.push({ url: p.imageUrl, alt: p.name });
  }
  return result;
}

export const getPrimaryImage = (p: Product) => getImages(p)[0] ?? null;
