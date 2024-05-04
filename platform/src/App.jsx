import { useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeSettings } from "./theme/Theme";
import RTL from "./layouts/full/shared/customizer/RTL";
import ScrollToTop from "./components/shared/ScrollToTop";
import Router from "./routes/Router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { fetchListSite } from "@/store/apps/global/GlobalSlice";
import { fetchListCreative } from "@/store/apps/ad-management/CreativeSlice";
import {
  fetchUserProfile,
  fetchListRole,
  fetchListPermission,
} from "@/store/apps/system";
import { dispatch } from "@/store/Store";
import { useEffect } from "react";

import { getAccessTokenFromLS } from "@/services/auth.service.js";

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  const system = useSelector((state) => state.system);
  const {userProfile={}} = system;
  const listRoles = (userProfile?.roles?.data ||[]).map((item) => {
    return item?.name
  });
  const accessToken = getAccessTokenFromLS();

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchListSite());
      dispatch(fetchListCreative());
      dispatch(fetchUserProfile());
      if(listRoles.includes("Administrator") || listRoles.includes("Manager") ) {
        dispatch(fetchListRole());
        dispatch(fetchListPermission());
      }
    }
  }, [accessToken, JSON.stringify(listRoles)]);

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
