import { useSession } from "@descope/react-sdk";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  const { isSessionLoading, isAuthenticated } = useSession();

  if (isSessionLoading) {
    return <></>;
  }
  return (
    <>
      <nav>
        <ul>
          {
            !isAuthenticated && <li>
                <Link to="/">Home</Link>
            </li>
          }

          {
            !isAuthenticated ? <li>
            <Link to="/signin">Sign in</Link>
            </li> : <li>
                <Link to="/dashboard">Dashboard</Link>
            </li>
          }
          
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;