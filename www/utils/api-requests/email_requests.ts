import { ApiResp } from './response_type';

export const registerEmail = async (email: string): Promise<ApiResp> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/early-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => response.json());
};
