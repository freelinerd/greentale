"use client";

import { useState } from "react";
import CameraCapture from "./CameraCapture";
import PlantInfo from "./PlantInfo";

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [plantInfo, setPlantInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPlantInfo(null);
      setError(null);
      setIsCameraOpen(false); // Cierra la cámara al subir imagen
    }
  };

  const handleIdentifyPlant = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al identificar la planta");
      }

      const data = await response.json();
      setPlantInfo(data.plantInfo);
    } catch (err) {
      setError("Error al identificar la planta. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = (file: File) => {
    setImage(file);
    setIsCameraOpen(false); // Cierra la cámara después de capturar la foto
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setImage(null); // Borra la imagen anterior al abrir la cámara
    setPlantInfo(null); // Resetea la información de la planta
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <label className="flex flex-col items-center px-4 py-2 bg-white text-green-600 rounded-lg shadow-lg tracking-wide uppercase border border-green-600 cursor-pointer hover:bg-green-600 hover:text-white">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-xs leading-normal items-center justify-center">
            Subir imagen
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </label>

        <button
          className="flex flex-col items-center px-4 py-2 bg-white text-green-600 rounded-lg shadow-lg tracking-wide uppercase border border-green-600 cursor-pointer hover:bg-green-600 hover:text-white"
          onClick={handleOpenCamera}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="mt-2 text-xs leading-normal">Abrir cámara</span>
        </button>
      </div>

      {isCameraOpen && <CameraCapture onCapture={handleCapture} />}

      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Imagen subida"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      )}

      {image && !plantInfo && (
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          onClick={handleIdentifyPlant}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Identificando planta...
            </div>
          ) : (
            "Identificar planta"
          )}
        </button>
      )}

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      {plantInfo && <PlantInfo info={plantInfo} />}
    </div>
  );
}
