/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import MDBox from "components/MDBox";
import DashboardFooter from "components/Footer/DashboardFooter";
import DashboardNavbar from "components/Navbars/DashboardNavbar";

// store
import { useModalSlice } from "components/MDModal/slice";
import { selectThemeSetting } from "components/Tenant/slice/selectors";

interface IDashboardLayoutProps {
  children: ReactNode;
  navbar?: {
    isAbsoluteNav?: boolean;
    children?: ReactNode;
    titleBreadcrumbs?: string;
  };
}
function DashboardLayout({ children, navbar }: IDashboardLayoutProps): JSX.Element {
  const { miniSidenav } = useSelector(selectThemeSetting);
  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();

  useEffect(() => {
    return () => {
      dispatch(modalActions.close({}));
    };
  }, []);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <DashboardNavbar
        titleBreadcrumbs={navbar?.titleBreadcrumbs}
        absolute={navbar?.isAbsoluteNav}
        children={navbar?.children}
      />
      <MDBox py={3} className="section-to-print">
        {children}
      </MDBox>
      <DashboardFooter />
    </MDBox>
  );
}
DashboardLayout.defaultProps = {
  titleBreadcrumbs: "",
  isAbsoluteNav: false,
};
export default DashboardLayout;
