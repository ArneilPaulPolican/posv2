export interface TABLE {
    id: number;
    table_code: string;
    table_name: string;
    category: string;
    pax: number;
    image_path?: string;
    is_locked: boolean;
}