import camelize from 'camelize-ts';

export const getIngredientsSearch = (searchString: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ingredients?search=${searchString}`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
