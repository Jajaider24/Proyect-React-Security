// Servicio simple de usuario para autenticación mock
// En un proyecto real reemplazar por llamadas HTTP a la API

import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider, googleProvider, microsoftProvider } from "../firebaseConfig.ts";

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

	// Google OAuth usando Firebase (keeps same return shape as your app expects)
	async loginWithGoogle() {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;

			const token = await user.getIdToken();

			const formattedResponse = {
				user: {
					_id: user.uid,
					name: user.displayName || "",
					email: user.email || "",
					password: "",
				},
				token: token,
			};

			// persist token so other parts of the app that read TOKEN_KEY keep working
			try {
				localStorage.setItem(TOKEN_KEY, token);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn("Could not persist auth token:", err);
			}

			return formattedResponse;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error en login con Google:", error);
			throw error;
		}
	},

	// GitHub OAuth using Firebase
	async loginWithGitHub() {
		try {
			const result = await signInWithPopup(auth, githubProvider);
			const user = result.user;

			const token = await user.getIdToken();

			const formattedResponse = {
				user: {
					_id: user.uid,
					name: user.displayName || "",
					email: user.email || "",
					password: "",
				},
				token: token,
			};

			// persist token so other parts of the app that read TOKEN_KEY keep working
			try {
				localStorage.setItem(TOKEN_KEY, token);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn("Could not persist auth token:", err);
			}

			return formattedResponse;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error en login con GitHub:", error);
			throw error;
		}
	},

	// Microsoft OAuth using Firebase
	async loginWithMicrosoft() {
		try {
			const result = await signInWithPopup(auth, microsoftProvider);
			const user = result.user;

			const token = await user.getIdToken();

			const formattedResponse = {
				user: {
					_id: user.uid,
					name: user.displayName || "",
					email: user.email || "",
					password: "",
				},
				token: token,
			};

			// persist token so other parts of the app that read TOKEN_KEY keep working
			try {
				localStorage.setItem(TOKEN_KEY, token);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn("Could not persist auth token:", err);
			}

			return formattedResponse;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error en login con Microsoft:", error);
			throw error;
		}
	},
};

export default userService;
