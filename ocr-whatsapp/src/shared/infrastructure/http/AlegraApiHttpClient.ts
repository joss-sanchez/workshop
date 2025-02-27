import { AbstractHttpClient } from './HttpClient';

export class AlegraApiHttpClient extends AbstractHttpClient {
  constructor(url: string, apiKey: string) {
    super({ baseUrl: url });

    this.api.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  }

  async createExpense(invoice: { date: Date; total: number }) {
    return this.api.post('/v1/bills', {
      date: invoice.date,
      dueDate: new Date(),
      provider: {
        id: '1',
      },
      purchases: {
        items: [],
        categories: [
          {
            id: '5080', // Gastos generales
            price: invoice.total,
            discount: 0,
            quantity: 1,
            observations: '',
            error: null,
          },
        ],
      },
      stamp: false,
      type: 'bill',
    });
  }
}