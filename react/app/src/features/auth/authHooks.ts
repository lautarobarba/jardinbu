import { useAppSelector } from "../../redux/hooks";
import { selectCurrentSession, selectCurrentUser } from "./authSlice";

export const useUserIsAuthenticated = () => {
	const session = useAppSelector(selectCurrentSession);
	const isAuthenticated = session ? true : false;
	return isAuthenticated;
}

export const useCurrentUser = () => {
	const user = useAppSelector(selectCurrentUser);
	return user;
}

export const useCurrentSession = () => {
	const session = useAppSelector(selectCurrentSession);
	return session;
}

export const useUserRole = () => {
	const user = useAppSelector(selectCurrentUser);
	if (user)
		return user.role;
	return null;
}

export const useJwtToken = () => {
	const session = useAppSelector(selectCurrentSession);
	if (session)
		return session.accessToken;
	return null;
}
