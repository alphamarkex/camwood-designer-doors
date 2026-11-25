export type TourScene = {
  id: string
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  detail?: { name: string; material: string; finish: string; use: string }
  kind: "exterior" | "entry" | "door" | "reception" | "hardware" | "windows" | "contact"
}

export const doors = [
  {
    name: "Carved Heritage",
    material: "Seasoned solid wood",
    finish: "Hand-carved, satin polish",
    use: "Statement main entrances",
    image: "/doors/carved-door.jpg",
    imageAlt: "Carved wooden designer door on display",
  },
  {
    name: "Quiet Grain",
    material: "Engineered flush core",
    finish: "Natural woodgrain laminate",
    use: "Bedrooms and private spaces",
    image: "/doors/flush-door.jpg",
    imageAlt: "Smooth flush designer door with a natural finish",
  },
  {
    name: "Lightline Glass",
    material: "Toughened glass and timber",
    finish: "Clear glass with crafted frame",
    use: "Interiors, offices and partitions",
    image: "/doors/glass-door.jpg",
    imageAlt: "Framed glass designer door",
  },
  {
    name: "Modern Motif",
    material: "Designer wood composite",
    finish: "Textured decorative finish",
    use: "Contemporary living spaces",
    image: "/doors/designer-door.jpg",
    imageAlt: "Decorative designer door with a contemporary finish",
  },
] as const

export const tourScenes: TourScene[] = [
  {
    id: "showroom-exterior",
    eyebrow: "Khushi Designer Doors and Windows",
    title: "Cam Wood",
    description: "A closer look at the showroom, after dark.",
    image: "/showroom-exterior.png",
    imageAlt: "Cam Wood designer doors showroom glowing at night",
    kind: "exterior",
  },
  {
    id: "step-inside",
    eyebrow: "The entrance",
    title: "Step inside.",
    description: "The glass doors slide open. Warm timber, crafted details and the showroom floor come into view.",
    kind: "entry",
  },
  {
    id: "carved-doors",
    eyebrow: "The left wall · 01",
    title: "Made to be remembered.",
    description: "A carved timber entrance brings natural grain and quiet detail to the first impression of a home.",
    image: doors[0].image,
    imageAlt: doors[0].imageAlt,
    detail: doors[0],
    kind: "door",
  },
  {
    id: "glass-and-design",
    eyebrow: "The left wall · 02",
    title: "Light, framed beautifully.",
    description: "Explore glass, flush and contemporary designer doors, selected for the spaces they open into.",
    image: doors[2].image,
    imageAlt: doors[2].imageAlt,
    detail: doors[2],
    kind: "door",
  },
  {
    id: "flush-doors",
    eyebrow: "The left wall · 03",
    title: "A quieter kind of detail.",
    description: "Clean lines and natural grain bring a calm, considered finish to bedrooms and private spaces.",
    image: doors[1].image,
    imageAlt: doors[1].imageAlt,
    detail: doors[1],
    kind: "door",
  },
  {
    id: "modern-motifs",
    eyebrow: "The left wall · 04",
    title: "Made for modern living.",
    description: "A textured designer surface brings depth and character to contemporary rooms.",
    image: doors[3].image,
    imageAlt: doors[3].imageAlt,
    detail: doors[3],
    kind: "door",
  },
  {
    id: "reception",
    eyebrow: "A warm welcome",
    title: "Let’s make it yours.",
    description: "Pause at reception and talk through dimensions, materials and finishes with the Cam Wood team.",
    image: doors[3].image,
    imageAlt: "Cam Wood designer door finish displayed in the showroom",
    kind: "reception",
  },
  {
    id: "handles-and-hardware",
    eyebrow: "The finishing touch",
    title: "Details you can feel.",
    description: "Pair the right handle and hardware with your door: the small details that make every opening feel considered.",
    kind: "hardware",
  },
  {
    id: "windows-and-finishes",
    eyebrow: "Beyond the doorway",
    title: "Windows, made to belong.",
    description: "Explore solid wood windows and finishes that carry the same warmth through the whole home.",
    image: "/doors/window.jpg",
    imageAlt: "Solid wood window display from Cam Wood",
    kind: "windows",
  },
  {
    id: "visit-camwood",
    eyebrow: "Your visit starts here",
    title: "Come see it in person.",
    description: "Cam Wood, Khushi Designer Doors and Windows. Call ahead and we’ll help you plan your visit.",
    kind: "contact",
  },
]

export const contactDetails = {
  mobile: "9839149086",
  whatsapp: "9580466287",
  shopName: "Cam Wood, Khushi Designer Doors and Windows",
} as const
