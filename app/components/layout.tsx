import Meta from './meta';
import Navbar from './navbar';

export const siteTitle = 'Meal Planner | Plan and Eat Well';

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <header>
        <Navbar />
      </header>
      <div>
        <main>{children}</main>
      </div>
    </>
  );
}
