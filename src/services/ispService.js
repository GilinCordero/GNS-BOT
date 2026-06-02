import ispAxios from '../api/clients/ispAxios.js'

export async function getAllCustomers() {
  const res = await ispAxios.get('/customers')
  return Array.isArray(res.data) ? res.data : []
}

export async function getCustomerById(idCustomer) {
  const res = await ispAxios.get(`/customers/${idCustomer}`)
  return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null
}

export async function getServicesByCustomer(idCustomer) {
  const res = await ispAxios.get(`/services/${idCustomer}`)
  return Array.isArray(res.data) ? res.data : []
}

export async function getTicketsByCustomer(idCustomer) {
  const res = await ispAxios.get(`/tickets/${idCustomer}`)
  return Array.isArray(res.data) ? res.data : []
}

export async function createTicket({ idCategory, idCustomerPackage, problem, contact_name, phone_number }) {
  const res = await ispAxios.post('/tickets', {
    idCategory, idCustomerPackage, problem,
    ...(contact_name  && { contact_name }),
    ...(phone_number  && { phone_number }),
  })
  return res.data.idTicket
}

export async function addComment({ idTicket, comment }) {
  const res = await ispAxios.post('/comments', { idTicket, comment })
  return res.data.idComment
}

export async function getCategories() {
  const res = await ispAxios.get('/categories')
  return Array.isArray(res.data) ? res.data : []
}

export async function getCustomerBalance(idCustomer) {
  const res = await ispAxios.get(`/saldo/${idCustomer}`)
  return res.data
}
