import { sliceArrayIntoChunks } from '../utils/sliceArrayIntoChunks';

export default class FetchService {
  private aldiIngredientPrices(productIdList: Array<string>) {
    // split array into multiple chunks
    const chunks = sliceArrayIntoChunks(productIdList, 10);

    // promise array of all requests
    const ingredientPriceRequests = chunks.map((chunk) => {
      return fetch('https://groceries.aldi.co.uk/api/product/calculatePrices', {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
          'accept-language': 'en-GB',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify({ products: chunk }),
      }).then((res) => res.json());
    });

    // wait for all fetch requests to complete
    return Promise.all(ingredientPriceRequests)
      .then((results) => {
        return results.reduce((prev, current) => {
          const productPrices = current.ProductPrices;
          return [...prev, ...productPrices];
        }, []);
      })
      .then((productPrices: Array<any>) => {
        return productPrices.map(
          ({
            ProductId,
            ListPrice,
          }: {
            ProductId: string;
            ListPrice: string;
          }) => {
            return {
              productId: ProductId,
              pricePerUnit: parseFloat(ListPrice.slice(1)),
            };
          },
        );
      });
  }

  ingredientPrices = (supermarketId: number, productIDList: Array<string>) => {
    switch (supermarketId) {
      case 1: {
        return this.aldiIngredientPrices(productIDList);
      }
      default:
        throw new Error('Invalid supermarket ID provided');
    }
  };
}
