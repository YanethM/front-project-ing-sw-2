import { ENV } from "../utils";
const { BASE_PATH, API_ROUTES } = ENV;

export class Auth {
  async signIn(data) {
    try {
      const response = await fetch(`${ENV.BASE_API}${API_ROUTES.SIGNIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      return result;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }
}
export const auth = new Auth();
