export const appSessionStorage = {
  isTokenValid: (): boolean => {
    try {
      const value = sessionStorage.getItem("isValid");
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  setTokenValid: () => {
    try {
      sessionStorage.setItem("isValid", JSON.stringify(true));
    } catch (error) {
      console.error(error);
    }
  },
  unvalidateToken: () => {
    try {
      sessionStorage.setItem("isValid", JSON.stringify(false));
    } catch (error) {
      console.error(error);
    }
  },
  getItem: <T>(key: string): T | null => {
    try {
      const value = sessionStorage.getItem(key);

      if (value == null) {
        return null;
      }

      const encodedValue: T = JSON.parse(value);

      return encodedValue;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  setItem: <T>(key: string, value: T) => {
    try {
      const decodedValue = JSON.stringify(value);
      sessionStorage.setItem(key, decodedValue);
    } catch (error) {
      console.error(error);
    }
  },
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  },
  clearAll: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error(error);
    }
  },
};
