import Meta from './meta';
import Navbar from './navbar';

export const siteTitle = 'Meal Planner | Plan and Eat Well';

export default function Layout({
  children,
  includeNavBar = true,
}: {
  children: any;
  includeNavBar?: boolean;
}) {
  return (
    <>
      <Meta />
      {includeNavBar ? (
        <header>
          <Navbar>
            <div>
              <main>{children}</main>
            </div>
          </Navbar>
        </header>
      ) : (
        <div>
          <main>{children}</main>
        </div>
      )}
    </>
  );
}
