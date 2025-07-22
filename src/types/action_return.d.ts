import { TypedError } from "@/lib/error";
import { ErrorTypes } from "./error";

export interface BadActionReturn {
	success: false;
	error: ErrorTypes;
}

export interface GoodActionReturn<RT> {
	success: true;
	result: RT;
}

export type ActionReturn<RT> = BadActionReturn | GoodActionReturn<RT>;
