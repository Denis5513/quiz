const urls = {
	home: "/",
	profile: "/profile",
	login: "/login",
	register: "/register",
	premium: "/premium",
	quiz: (id: number) => `/quizzes/${id}`,
};

export default urls;
