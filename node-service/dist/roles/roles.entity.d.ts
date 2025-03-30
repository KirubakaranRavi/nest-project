export declare class Role {
    id: number;
    name: string;
    permissions: Record<string, any>;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}
