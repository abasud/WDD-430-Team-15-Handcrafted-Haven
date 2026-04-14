export type Item = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  description: string;
  category: "pottery" | "woodwork" | "textile" | "jewelry";
  materials: string[];
  dimensions?: string;
  availability: string;
};

export const items: Item[] = [
  {
    id: "temp-id-001",
    title: "Ceramic Vase",
    artist: "Elena Gomez",
    price: 45.0,
    image: "/card-images/ceramic-vase.jpg",
    description:
      "A hand-thrown ceramic vase with a warm natural glaze, crafted to bring texture and character to shelves, tables, and entryways.",
    category: "pottery",
    materials: ["Stoneware clay", "Food-safe glaze"],
    dimensions: '8" H x 4.5" W',
    availability: "In stock",
  },
  {
    id: "temp-id-002",
    title: "Woven Table Runner",
    artist: "Maya Lee",
    price: 32.0,
    image: "/card-images/ceramic-vase.jpg",
    description:
      "A soft, handmade table runner woven with earthy tones to complement rustic and modern dining spaces.",
    category: "textile",
    materials: ["Cotton", "Linen blend"],
    dimensions: '72" L x 14" W',
    availability: "Made to order",
  },
  {
    id: "temp-id-003",
    title: "Carved Walnut Bowl",
    artist: "Karl Porter",
    price: 58.0,
    image: "/card-images/ceramic-vase.jpg",
    description:
      "A carved walnut bowl finished by hand to highlight the wood grain and preserve its rich natural tone.",
    category: "woodwork",
    materials: ["Walnut wood", "Natural oil finish"],
    dimensions: '10" diameter',
    availability: "Only 2 left",
  },
];