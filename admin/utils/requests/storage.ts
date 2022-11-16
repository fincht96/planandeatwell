import camelize from 'camelize-ts';

export const getSignedUploadUrl = (
  objectKey: string,
  contentType: string,
  acl: string = 'private',
) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/signed-upload-url`);
  const params = new URLSearchParams({
    objectKey,
    contentType,
    acl,
  });

  url.search = params;
  return fetch(url).then(async (res) => {
    const json = await res.json();
    if (json?.errors.length) {
      throw json.errors[0];
    }
    return json.result;
  });
};
