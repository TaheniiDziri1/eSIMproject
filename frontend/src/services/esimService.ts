import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = process.env.REACT_APP_API_URL + "/esim";

export async function getAvailableEsimPackages() {
    const data = await fetchWithAuth(`${API_URL}/packages`, { method: "GET" });
    return data.obj.packageList || [];
}
