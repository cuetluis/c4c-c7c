export interface Horse {
    id: string;
    name: string;
    breed: string;
    age: number;
    treatments: Treatment[];
}

export interface Treatment {
    id: string;
    name: string;
    description: string;
    duration: number; // in days
}

export interface ActionTaken {
    id: string;
    treatmentId: string;
    horseId: string;
    notes: string;
    timestamp: Date;
}

export interface DailyObservation {
    id: string;
    date: Date;
    observations: string[];
}

export interface AuditTrailEntry {
    id: string;
    action: string;
    timestamp: Date;
    user: string;
}