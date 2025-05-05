import { BrowserRouter, Route, Routes } from 'react-router';
import { SiteRoutes } from './routeList';
import UserLaytout from '../layout/userLayout';
const RouteContext = () => {
  return (
    <BrowserRouter>
      {/* Guest */}
      <Routes>
        <Route element={<UserLaytout />}>
          {SiteRoutes.map((v, k) => (
            <Route path={v.path} element={v.element} key={k} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default RouteContext;
