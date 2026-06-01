import { useSession } from '@descope/react-sdk';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const { isSessionLoading } = useSession();

  if (isSessionLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return <Outlet />;
};

export default Layout;
