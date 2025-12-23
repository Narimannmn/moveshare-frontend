export const b64ToUtf8 = (base64: string) => {
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(base64), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
};
