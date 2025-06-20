
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;

}

export interface UserLogin {
    email: string;
    password: string;
}

export interface JwtPayload {
    id: number;
    email: string;
    name: string;
}