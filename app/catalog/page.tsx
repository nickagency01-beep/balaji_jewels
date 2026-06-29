import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collections — Fine Jewelry",
  description:
    "Explore LUMORA's complete jewelry collection. Filter by metal, gemstone, price, and more.",
};

interface SearchParams {
  category?: string;
  metal?: string;
  gemstone?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
  search?: string;
  collection?: string;
  page?: string;
}

async function getProducts(params: SearchParams) {
  const where: Record<string, unknown> = { isActive: true };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { gemstone: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.collection) {
    where.collection = { equals: params.collection, mode: "insensitive" };
  }
  if (params.gemstone) {
    where.gemstone = { contains: params.gemstone, mode: "insensitive" };
  }
  if (params.metal) {
    where.metalType = params.metal;
  }
  if (params.priceMin || params.priceMax) {
    where.price = {
      ...(params.priceMin ? { gte: Number(params.priceMin) } : {}),
      ...(params.priceMax ? { lte: Number(params.priceMax) } : {}),
    };
  }

  const sortMap: Record<string, Record<string, unknown>> = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    newest: { createdAt: "desc" },
    featured: { isFeatured: "desc" },
  };
  const orderBy = sortMap[params.sort ?? "featured"] ?? { isFeatured: "desc" };

  const page = Math.max(1, Number(params.page ?? 1));
  const perPage = 24;

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: true, category: true },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);
    return { products, total, page, perPage };
  } catch {
    return { products: [], total: 0, page: 1, perPage };
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, total, page, perPage } = await getProducts(params);

  return (
    <div className="pt-32 pb-20">
      <CatalogClient
        initialProducts={products as never}
        total={total}
        page={page}
        perPage={perPage}
        initialSearch={params.search}
      />
    </div>
  );
}
