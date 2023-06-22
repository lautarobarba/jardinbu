import { createSlice } from "@reduxjs/toolkit";
import { SessionDto } from "../../interfaces/SessionDto";
import { User } from "../../interfaces/User";
import { RootState } from "../../redux/store";

export interface AuthState {
	user: User | null;
	session: SessionDto | null;
}

console.log('Recuperar credenciales en localstorage.')
const initialState: AuthState = {
	user: JSON.parse(String(localStorage.getItem('user'))),
	session: JSON.parse(String(localStorage.getItem('session'))),
};

export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		setCredentials: (state, action) => {
			console.log('Guardar credenciales en localstorage.')
			const { user, session } = action.payload;
			state.user = user;
			state.session = session;
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('session', JSON.stringify(session));
		},
		removeCredentials: (state) => {
			console.log('Eliminar credenciales en localstorage.')
			state.user = null;
			state.session = null;
			localStorage.removeItem('user');
			localStorage.removeItem('session');
		}
	}
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentSession = (state: RootState) => state.auth.session;
