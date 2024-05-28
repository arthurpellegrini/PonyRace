// src/app/races/race.model.ts
export interface Pony {
  id: number;
  name: string;
  color: string;
  position?: number;
  boosted?: boolean;
}

export interface Race {
  id: number;
  name: string;
  ponies: Pony[];
  startInstant: string;
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
  betPonyId?: number;
}
