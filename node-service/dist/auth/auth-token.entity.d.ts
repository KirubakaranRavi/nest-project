export declare class AuthToken {
    id: number;
    email: string;
    token: string;
    created_at: Date;
    expires_at: Date;
    get is_expired(): boolean;
}
