import { Route } from "react-router-dom";
import { JSXElementConstructor, Key, ReactElement } from "react";

const getRoutes = (allRoutes: any[]): any =>
  allRoutes.map(
    (route: {
      collapse: any;
      route: string;
      component: ReactElement<any, string | JSXElementConstructor<any>>;
      key: Key;
      isGuess: boolean;
    }) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    }
  );

export default getRoutes;
