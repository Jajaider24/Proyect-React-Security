export function getErrorMessage(err: any): string {
  try {
    if (!err) return "Error desconocido";
    // Axios error with response
    if (err.response) {
      const data = err.response.data;
      if (typeof data === "string" && data) return data;
      if (data && typeof data === "object") {
        if (data.message) return String(data.message);
        if (data.error) return String(data.error);
        if (data.detail) return String(data.detail);
      }
      return `HTTP ${err.response.status || "error"}`;
    }
    // Axios no response
    if (err.request) return "Sin respuesta del servidor";
    // Generic error
    if (err.message) return String(err.message);
    return String(err);
  } catch (_e) {
    return "Ha ocurrido un error";
  }
}
