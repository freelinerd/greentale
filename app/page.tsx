import ImageUpload from "../components/ImageUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold text-green-800">GreenTale</h1>
      <h2 className="text-1xl mb-7 text-green-800">By FreeLine</h2>
      <ImageUpload />
    </main>
  );
}
