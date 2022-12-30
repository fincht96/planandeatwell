import { AuthClaims } from '../types/AuthClaims';

export const idTokenResultToAuthClaims = (
  idTokenResult: any,
): AuthClaims | null => {
  if (idTokenResult?.claims) {
    const { roles, planandeatwell_id: userId } = idTokenResult.claims;
    if (!roles || !userId) {
      return null;
    }
    return {
      roles,
      userId,
    };
  }
  return null;
};
