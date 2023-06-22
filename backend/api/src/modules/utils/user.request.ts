import { IJWTPayload } from "modules/auth/jwt-payload.interface";
import { RequestWithUser } from "modules/auth/request-with-user.interface";

export const getUserIdFromRequest = (request: RequestWithUser): number => {
  const session: IJWTPayload = request.user as IJWTPayload;
  return session.sub;
};
