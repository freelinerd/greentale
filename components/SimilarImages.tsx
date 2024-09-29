interface SimilarImagesProps {
  images: string[];
}

export default function SimilarImages({ images }: SimilarImagesProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-green-600 mb-4">
        Similar Plants
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Similar plant ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
