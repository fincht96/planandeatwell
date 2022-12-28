import camelize from 'camelize-ts';

export const syncClaims = ({ accessToken }: { accessToken: string }) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/sync-claims`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};

export const createUser = (userDetails: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDetails),
  }).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return camelize(json.result);
  });
};
