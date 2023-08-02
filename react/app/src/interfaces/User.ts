import { Picture } from "./Picture";

export enum Role {
	USER = 'USER',
	EDITOR = 'EDITOR',
	ADMIN = 'ADMIN',
}

export enum Status {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface User {
	id: number,
	email: string,
	isEmailConfirmed: boolean,
	firstname: string,
	lastname: string,
	profilePicture?: Picture,
	status: Status,
	role: Role,
	createdAt: Date,
	updatedAt: Date,
	deleted: boolean
}