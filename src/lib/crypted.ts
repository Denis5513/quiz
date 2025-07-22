import bcrypt from "bcryptjs";

export const saltRounds = 10;

export async function hash(str: string): Promise<string> {
	const hashed = await bcrypt.hash(str, saltRounds);
	return hashed;
}

export const compare = bcrypt.compare;
