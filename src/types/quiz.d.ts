export interface Quiz {
	id: number;
	title: string;
	description: string;
	preview?: string;
}

export interface QuestionBasic {
	id: number;
	question: string;
}

export interface Answer {
	id: number;
	questionId: string;
	answer: string;
	optionIndex: string;
}

export interface Question extends QuestionBasic {
	options: string[];
}

export interface QuestionWithAnswer extends Question {
	correct: number;
}

export interface Result {
	id: number;
	userId: number;
	quizId: number;
	is_finished: boolean;
	result: string | null;
}

export interface UserAnswer {
	id: number;
	resultId: number;
	questionId: number;
	answerOption: number | null;
	isCorrect: boolean | null;
}

export type UserAnswerFromClient = Omit<UserAnswer, "isCorrect"> & {
	answerOption: number;
};
