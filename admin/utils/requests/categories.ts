import camelize from 'camelize-ts';

export const getCategories = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?orderBy=createdAt&order=desc`,
  ).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
