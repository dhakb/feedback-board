import type { Role } from "../../domain/entities/User";

declare global {
	namespace Express {
		interface UserPayload {
			userId: string;
			role: Role;
		}

		interface Request {
			user?: UserPayload;
		}
	}
}

export {};


