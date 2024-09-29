// types.ts

// Definición de un tipo para la información de la planta
export interface PlantInfoType {
    commonName: string;      // Nombre común de la planta
    scientificName: string;  // Nombre científico de la planta
    family: string;          // Familia a la que pertenece la planta
    description?: string;    // Descripción opcional
    imageUrl?: string;       // URL de una imagen de la planta
    habitat?: string;        // Hábitat donde se encuentra la planta
  }
  
  // Definición de un tipo para el estado de error
  export interface ErrorType {
    message: string;         // Mensaje de error
    code?: number;          // Código de error opcional
  }
  
  // Si tienes otros tipos o interfaces que quieras definir, añádelos aquí
  