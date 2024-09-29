import { PlantInfoType } from "./types"; // Asegúrate de que la ruta sea correcta

interface PlantInfoProps {
  info: PlantInfoType;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ info }) => {
  return (
    <div>
      <h2>Nombre Comun{info.commonName}</h2>
      <p>Nombre Científico: {info.scientificName}</p>
      <p>Tipo de Planta: {info.family}</p>
      {info.description && <p>Descripción: {info.description}</p>}
      {info.imageUrl && <img src={info.imageUrl} alt={info.commonName} />}
      {info.habitat && <p>Ecosistema: {info.habitat}</p>}
    </div>
  );
};

export default PlantInfo;
