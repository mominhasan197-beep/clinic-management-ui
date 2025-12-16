export interface Treatment {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  benefits: string[];
  image: string;
  optimized?: {
    webpSrcset?: string;
    avifSrcset?: string;
    fallback?: string;
    placeholder?: string;
  };
}
