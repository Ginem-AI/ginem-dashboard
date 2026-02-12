import { CONFIGS } from "../configs";
import { jwtDecode } from "jwt-decode";
import { ICredential, ICredentialWithDecodedUser } from "../interfaces/auth";

export const useCredential = () => {
  const CREDENTIAL_KEY = CONFIGS.localStorageKey;

  const getCredential = (): ICredentialWithDecodedUser | null => {
    const raw = localStorage.getItem(CREDENTIAL_KEY);

    if (!raw) return null;

    try {
      const authPayload: ICredential = JSON.parse(raw);
      const decoded = jwtDecode(
        authPayload.accessToken,
      ) as ICredentialWithDecodedUser["user"];

      return {
        ...authPayload,
        user: decoded,
      };
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  const setCredential = (payload: ICredential): void => {
    localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(payload));
  };

  const removeCredential = (): void => {
    localStorage.removeItem(CREDENTIAL_KEY);
  };

  return {
    getCredential,
    setCredential,
    removeCredential,
  };
};
