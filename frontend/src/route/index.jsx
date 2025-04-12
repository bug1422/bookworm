import { BrowserRouter, Route, Routes } from "react-router";
import { SiteRoutes } from "./routeList";
const RouteContext = () => {
  return (
    <BrowserRouter>
      {/* Guest */}
      <Routes>
        {SiteRoutes.map((v, k) => (
          <Route path={v.path} element={v.element} key={k} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
export default RouteContext;
