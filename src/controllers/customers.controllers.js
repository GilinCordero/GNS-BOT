import { getAllCustomers } from "../api/ispClient";

export async function getCustomersController(req, res) {
  try {
    const customers = await getAllCustomers();
    return res.send(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).send({ error: 'Failed to fetch customers' });
  }
    