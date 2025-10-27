// Servicio simple de usuario para autenticación mock
// En un proyecto real reemplazar por llamadas HTTP a la API

const TOKEN_KEY = "auth_token";

const fakeDelay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

const userService = {
	async login(username: string, password: string) {
		// validación mínima
		await fakeDelay(400);
		if (!username || !password) {
			return Promise.reject(new Error("Debe ingresar usuario y contraseña"));
		}

		// Aquí podrías llamar a tu API y obtener token/usuario
		// De momento guardamos un token mock en localStorage
		const token = btoa(`${username}:${Date.now()}`);
		localStorage.setItem(TOKEN_KEY, token);
		return Promise.resolve({ token });
	},

	logout() {
		localStorage.removeItem(TOKEN_KEY);
	},

	isAuthenticated() {
		return Boolean(localStorage.getItem(TOKEN_KEY));
	},

	/**
	 * Valida la sesión de forma asíncrona (mock).
	 * En un escenario real, haría una petición al backend para validar el token.
	 */
	async validateSession() {
		await fakeDelay(300);
		const token = localStorage.getItem(TOKEN_KEY);
		// Aquí podrías enviar el token al servidor y verificar su validez
		return Boolean(token);
	},
};

export default userService;
