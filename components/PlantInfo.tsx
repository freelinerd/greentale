export default function PlantInfo({ info }: { info: string }) {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center">
        Información
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12a4 4 0 118 0 4 4 0 01-8 0zM2 12a10 10 0 1016.293 6.707l4.095 4.096a1 1 0 01-1.414 1.414l-4.096-4.095A10 10 0 012 12z"
          />
        </svg>
      </h2>
      <p className="text-gray-700 whitespace-pre-wrap">{info}</p>
    </div>
  );
}
