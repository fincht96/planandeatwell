import { useRouter } from 'next/router';

export const onNavigate = (href: string) => {
  const router = useRouter();
  router.push(href);
};
