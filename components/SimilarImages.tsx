import Image from 'next/image';

interface SimilarImagesProps {
  images: string[];
}

export default function SimilarImages({ images }: SimilarImagesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Imágenes similares</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={image}
              alt={`Imagen similar ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}