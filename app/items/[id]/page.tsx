import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // data for testing
  const items = [
    {
      id: "1",
      name: "Handmade Bowl",
      price: 40,
      description: "Beautiful ceramic bowl.",
    },
    {
      id: "2",
      name: "Wool Scarf",
      price: 25,
      description: "Warm handmade scarf.",
    },
  ];

  const item = items.find((i) => i.id === id);

  if (!item) {
    notFound(); 
  }

  return (
    <main>
      <h1>{item.name}</h1>
      <p>${item.price}</p>
      <p>{item.description}</p>
    </main>
  );
}