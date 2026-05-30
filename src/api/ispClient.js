import ispAxios from './clients/ispAxios.js';


export async function getAllCustomers() {
    const response = await ispAxios.get('/customers');

    return response.data
}