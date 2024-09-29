import { useState, useRef, useEffect, useCallback } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Función para iniciar la cámara
  const startCamera = useCallback(async () => {
    if (!cameraStream) { // Solo inicia la cámara si no hay una ya activa
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraStream(stream);
        }
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
      }
    }
  }, [cameraStream]);

  // Función para tomar la foto
  const handleTakePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg");
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        onCapture(file);
        stopCamera();
      }
    }
  };

  // Función para detener la cámara
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraStream]);

  useEffect(() => {
    startCamera(); // Inicia la cámara al montar el componente
    return () => {
      stopCamera(); // Detener la cámara cuando el componente se desmonte
    };
  }, [startCamera, stopCamera]); // Agregar las dependencias correctamente

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <video ref={videoRef} className="w-full h-auto rounded-md shadow-md" />
        <button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          onClick={handleTakePhoto}
        >
          Tomar Foto
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
