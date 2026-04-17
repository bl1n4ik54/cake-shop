import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cakes = [
  {
    slug: "red-velvet-classic",
    name: "Red Velvet Classic",
    description:
      "Нежные коржи с какао, крем-чиз и ягодный акцент. Идеальный торт для праздника.",
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1200,
    price: 3190,
    inStock: true,
  },
  {
    slug: "choco-hazelnut-delight",
    name: "Choco Hazelnut Delight",
    description:
      "Шоколадный бисквит, пралине из фундука и плотный ганаш для насыщенного вкуса.",
    imageUrl:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1400,
    price: 3590,
    inStock: true,
  },
  {
    slug: "mango-yogurt-cloud",
    name: "Mango Yogurt Cloud",
    description:
      "Легкий йогуртовый мусс с манго и бисквитом: воздушный торт для теплого вечера.",
    imageUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1000,
    price: 2890,
    inStock: true,
  },
  {
    slug: "salted-caramel-brownie",
    name: "Salted Caramel Brownie",
    description:
      "Плотные шоколадные коржи, соленая карамель и сливочный крем с мягким послевкусием.",
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1500,
    price: 3890,
    inStock: true,
  },
  {
    slug: "berries-mascarpone",
    name: "Berries Mascarpone",
    description:
      "Миндальный бисквит, маскарпоне и сезонные ягоды. Баланс сладости и свежести.",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1300,
    price: 3490,
    inStock: true,
  },
  {
    slug: "lemon-poppy-spring",
    name: "Lemon Poppy Spring",
    description:
      "Лимонный крем, маковые коржи и легкая цитрусовая кислинка для любителей свежих вкусов.",
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
    weightGrams: 1100,
    price: 2990,
    inStock: true,
  },
];

async function main() {
  for (const cake of cakes) {
    await prisma.cake.upsert({
      where: { slug: cake.slug },
      update: {
        name: cake.name,
        description: cake.description,
        imageUrl: cake.imageUrl,
        weightGrams: cake.weightGrams,
        price: cake.price,
        inStock: cake.inStock,
      },
      create: cake,
    });
  }

  console.log(`Seed complete. Cakes upserted: ${cakes.length}`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

