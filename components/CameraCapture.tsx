import { useState, useRef, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Función para iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }, // Usa la cámara trasera en móviles
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStream(stream);
      }
    } catch (err) {
      console.error("No se pudo acceder a la cámara:", err);
    }
  };

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
        onCapture(file); // Envía la foto tomada al componente padre
        stopCamera(); // Detiene la cámara después de tomar la foto
      }
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera(); // Detener la cámara cuando el componente se desmonte
    };
  }, []);

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
