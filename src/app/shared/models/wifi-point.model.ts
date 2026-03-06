export interface WifiPoint {
  id: string;
  programa: string;
  latitud: number;
  longitud: number;
  alcaldia: string;
  score?: number; // Calculado por heurística
}

export interface WifiDataResponse {
  data: WifiPoint[];
}