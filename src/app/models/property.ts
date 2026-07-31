// Interfaz para la estructura del Vehículo
export interface VehiculoPropietario {
  placa: string;
  marca: string;
  modelo?: string; // El signo '?' significa que el campo es opcional (como en tu esquema)
  color?: string;
}

// Interfaz principal para la Propiedad
export interface Property {
  _id?: string;            // Generado automáticamente por MongoDB al guardar
  numeroCasa: string;
  calleOBloque?: string;
  
  // En Angular guardamos el ID del usuario como un string.
  // Si en el backend usas .populate(), este tipo podría cambiar a la interfaz 'User'.
  propietarioId: string;   
  
  vehiculosPropietario: VehiculoPropietario[]; // Un arreglo basado en la interfaz de arriba
  
  createdAt?: string | Date; // MongoDB lo envía como string ISO, pero puedes manejarlo como Date si lo parseas
}
