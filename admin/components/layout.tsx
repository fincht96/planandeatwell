import Meta from './meta';
import Sidebar from './sidebar';

export const siteTitle = 'Admin | Plan and Eat Well';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Meta />
      <Sidebar>{children}</Sidebar>
    </>
  );
}
