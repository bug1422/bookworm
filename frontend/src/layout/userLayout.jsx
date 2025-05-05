import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '@/components/footer';

const UserLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <div className="min-h-[80vh] mx-4 sm:mx-8 md:mx-12 lg:mx-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default UserLayout;
