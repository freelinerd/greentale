"use client";

import { useState } from "react";
import CameraCapture from "./CameraCapture";
import Image from "next/image";
//import { ChevronDown, ChevronUp } from 'lucide-react'

interface PlantInfoType {
  commonName: string;
  scientificName: string;
  description: string;
  care: {
    watering: string;
    sunlight: string;
    soil: string;
  };
  fruitBearingTime: string;
  seedGerminationTime: string;
  suitableClimate: string;
}

interface PlantInfoProps {
  info: PlantInfoType;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ info }) => {
  const [showCare, setShowCare] = useState(true);
  const [showAdditional, setShowAdditional] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-green-100 p-4">
        <h2 className="text-2xl font-bold text-green-800">{info.commonName}</h2>
        <p className="text-sm italic text-green-600">{info.scientificName}</p>
      </div>
      <div className="p-4">
        <p className="text-gray-700 mb-4">{info.description}</p>
        
        <div className="mb-2">
          <button
            className="w-full text-left p-2 bg-green-50 text-green-700 font-semibold rounded-lg focus:outline-none"
            onClick={() => setShowCare(!showCare)}
          >
            Cuidados {showCare ? '▲' : '▼'}
          </button>
          {showCare && (
            <div className="mt-2 pl-2">
              <div className="flex items-center mb-1">
                <span className="mr-2">💧</span>
                <span className="font-medium w-20">Regado:</span>
                <span className="text-gray-700">{info.care.watering}</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="mr-2">☀️</span>
                <span className="font-medium w-20">Luz:</span>
                <span className="text-gray-700">{info.care.sunlight}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🌱</span>
                <span className="font-medium w-20">Tierra:</span>
                <span className="text-gray-700">{info.care.soil}</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <button
            className="w-full text-left p-2 bg-green-50 text-green-700 font-semibold rounded-lg focus:outline-none"
            onClick={() => setShowAdditional(!showAdditional)}
          >
            Información Adicional {showAdditional ? '▲' : '▼'}
          </button>
          {showAdditional && (
            <div className="mt-2 pl-2">
              <div className="flex items-start mb-1">
                <span className="mr-2 mt-1">🍎</span>
                <span className="font-medium w-40">Tiempo para dar frutos:</span>
                <span className="text-gray-700">{info.fruitBearingTime}</span>
              </div>
              <div className="flex items-start mb-1">
                <span className="mr-2 mt-1">🌱</span>
                <span className="font-medium w-40">Germinación de semillas:</span>
                <span className="text-gray-700">{info.seedGerminationTime}</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-1">🌡️</span>
                <span className="font-medium w-40">Clima adecuado:</span>
                <span className="text-gray-700">{info.suitableClimate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [plantInfo, setPlantInfo] = useState<PlantInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPlantInfo(null);
      setError(null);
      setIsCameraOpen(false);
    }
  };

  const parsePlantInfo = (infoString: string): PlantInfoType => {
    const lines = infoString.split('\n');
    const info: Partial<PlantInfoType> = {
      care: {} as PlantInfoType['care'],
    };

    let currentSection = '';

    lines.forEach(line => {
      if (line.startsWith("Nombre Comun:")) {
        info.commonName = line.split(":")[1].trim();
      } else if (line.startsWith("Nombre Cientifico:")) {
        info.scientificName = line.split(":")[1].trim();
      } else if (line.startsWith("Descripción:")) {
        info.description = line.split(":")[1].trim();
      } else if (line.startsWith("Cuidados:")) {
        currentSection = 'care';
      } else if (line.startsWith("Tiempo que tarda en dar frutos:")) {
        info.fruitBearingTime = line.split(":")[1].trim();
      } else if (line.startsWith("Tiempo que tarda en germinar semillas:")) {
        info.seedGerminationTime = line.split(":")[1].trim();
      } else if (line.startsWith("Clima adecuado para la planta:")) {
        info.suitableClimate = line.split(":")[1].trim();
      } else if (currentSection === 'care') {
        if (line.startsWith("Regado:")) {
          info.care!.watering = line.split(":")[1].trim();
        } else if (line.startsWith("Luz:")) {
          info.care!.sunlight = line.split(":")[1].trim();
        } else if (line.startsWith("Tierra:")) {
          info.care!.soil = line.split(":")[1].trim();
        }
      }
    });

    return {
      commonName: info.commonName || "No disponible",
      scientificName: info.scientificName || "No disponible",
      description: info.description || "No disponible",
      care: {
        watering: info.care?.watering || "No disponible",
        sunlight: info.care?.sunlight || "No disponible",
        soil: info.care?.soil || "No disponible",
      },
      fruitBearingTime: info.fruitBearingTime || "No disponible",
      seedGerminationTime: info.seedGerminationTime || "No disponible",
      suitableClimate: info.suitableClimate || "No disponible",
    };
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
        throw new Error("Error en la respuesta del servidor: " + response.status);
      }

      const data = await response.json();

      if (data && data.plantInfo) {
        const parsedPlantInfo = parsePlantInfo(data.plantInfo);
        setPlantInfo(parsedPlantInfo);
      } else {
        throw new Error("Datos de planta no encontrados en la respuesta");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError("Error al identificar la planta: " + errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = (file: File) => {
    setImage(file);
    setIsCameraOpen(false);
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setImage(null);
    setPlantInfo(null);
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
          <span className="mt-2 text-xs leading-normal">Subir imagen</span>
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
          <Image
            src={URL.createObjectURL(image)}
            alt="Imagen subida"
            className="w-full h-auto rounded-md shadow-md"
            width={500}
            height={300}
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