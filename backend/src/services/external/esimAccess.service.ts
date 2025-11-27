import axios from "axios";
import AppError from "../../utils/AppError";

const API = "https://api.esimaccess.com/api/v1/open";

class EsimAccessService {
    async getAvailablePackages() {
        try {
        const response = await axios.post(
            `${API}/package/list`,
            {},
            {
            headers: this.headers,
            }
        );
        return response.data;
        } catch (err: any) {
        throw new AppError("Impossible de récupérer les packages eSIM", 500);
        }
    }

    async createOrder(transactionId: string, price: number, packageCode: string) {
        try {
        const response = await axios.post(
            `${API}/esim/order`,
            {
            transactionId,
            amount: price,
            packageInfoList: [{ packageCode, count: 1, price }],
            },
            { headers: this.headers }
        );

        return response.data;
        } catch (err: any) {
        throw new AppError("Erreur API: création de commande eSIM impossible", 500);
        }
    }

    async queryOrder(orderNo: string) {
        try {
        const response = await axios.post(
            `${API}/esim/query`,
            { orderNo },
            { headers: this.headers }
        );

        return response.data;
        } catch (err: any) {
        throw new AppError("Erreur API: impossible de récupérer les informations eSIM", 500);
        }
    }

    private get headers() {
        return {
        "RT-AccessCode": process.env.ESIM_ACCESS_CODE,
        "Content-Type": "application/json",
        };
    }
    }

export default new EsimAccessService();
