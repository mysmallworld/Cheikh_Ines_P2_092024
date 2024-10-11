export interface Country {
    name: string;
    value?: number;
    series?: {
        name: string; 
        value: number
    }[]
}