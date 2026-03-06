export interface WifiPoint {
  id: string;
  programa: string;
  latitud: number;
  longitud: number;
  alcaldia: string;
  distanciaKm?: number; // Distancia
  score?: number; // Calculado por heurística
}

export interface WifiDataResponse {
  data: WifiPoint[];
}