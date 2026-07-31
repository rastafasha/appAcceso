// Importamos las interfaces necesarias para cuando uses .populate() desde Node.js

import { Property } from "./property";
import { User } from "./user";

export interface DatosVehiculoAcceso {
  placa?: string; // Opcional por si el visitante entra caminando
  modelo?: string;
  color?: string;
}

export interface AccessCode {
  _id?: string;             // ID único generado por MongoDB Atlas
  token: string;            // El hash hexadecimal que lee el lector QR
  tipo: 'PROPIETARIO' | 'VISITA'; // Restringido exactamente a tus dos ENUM del backend
  
  // Relaciones tipificadas de forma flexible:
  // Si no haces populate, será el string ID. Si haces populate, será el objeto completo.
  propietarioId: string | User; 
  propiedadId: string | Property; 
  
  datosVehiculo: DatosVehiculoAcceso;
  
  // Campos específicos de Visitas
  nombreVisita?: string;
  esTemporal: boolean;
  validoDesde?: string | Date; // Llega como string ISO desde el backend
  validoHasta?: string | Date;
  
  // Control de uso
  usado: boolean;
  fechaUso?: string | Date;
  
  createdAt?: string | Date;
}
