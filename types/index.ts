export type ProductCategory = "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Brooch" | "Pendant";

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string | null;
  sku: string;
  price: number;
  comparePrice?: number | null;
  categoryId: string;
  metalType: MetalType;
  caratWeight?: number | null;
  dimensions?: string | null;
  weight?: number | null;
  gemstone?: string | null;
  gemstoneCarats?: number | null;
  certification?: string | null;
  images: ProductImage[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  badge?: string | null;
  collection?: string | null;
  engravable: boolean;
  sizeable: boolean;
  availableSizes: string[];
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; slug: string };
}

export type MetalType =
  | "YELLOW_GOLD_14K"
  | "YELLOW_GOLD_18K"
  | "WHITE_GOLD_14K"
  | "WHITE_GOLD_18K"
  | "ROSE_GOLD_14K"
  | "ROSE_GOLD_18K"
  | "PLATINUM"
  | "SILVER_925";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string | null;
  engraving?: string | null;
  metalFinish?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItemType[];
  address?: Address | null;
  createdAt: Date;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "UNPAID" | "PAID" | "PARTIALLY_REFUNDED" | "REFUNDED" | "FAILED";

export interface OrderItemType {
  id: string;
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  size?: string | null;
  engraving?: string | null;
  imageUrl?: string | null;
}

export interface FilterState {
  category?: string;
  metalType?: MetalType[];
  gemstone?: string[];
  priceMin?: number;
  priceMax?: number;
  collection?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "featured";
  search?: string;
}

// Legacy inquiry types kept for compatibility
export type InquiryStatus = "New" | "In Progress" | "Completed";
export type ProjectType = "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Other";
export type Material = "14k Gold" | "18k Gold" | "Platinum" | "Heirloom Metal";
export type Gemstone = "Diamond" | "Sapphire" | "Emerald" | "Ruby" | "Metal Only";
export type BudgetRange = "$1k–$3k" | "$3k–$5k" | "$5k–$10k" | "$10k+";
export type Timeline = "ASAP" | "4–8 weeks" | "No Rush";

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  materials: Material[];
  gemstones: Gemstone[];
  budget: BudgetRange;
  timeline: Timeline;
  visionNotes: string;
  referenceImages?: File[];
  prefilledProductId?: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  status: InquiryStatus;
  data: InquiryFormData;
  referenceImageNames?: string[];
}
