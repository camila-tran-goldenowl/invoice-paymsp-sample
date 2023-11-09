// components
import MDBox from "components/MDBox";

// logo
import XeroLogo from "assets/images/logos/xero-logo.png";
import AutotaskLogo from "assets/images/logos/autotask-square-logo.png";
import QuickbookLogo from "assets/images/logos/quickbook-integration.png";
import ConnectwiseLogo from "assets/images/logos/connectwise-square-logo.png";
import QuickbookDesktopLogo from "assets/images/logos/quickbook-desktop-integration.png";

interface IResourceLogoProps {
  service: string;
  styles?: {
    [key: string]: string | Number;
  };
}

const ResourceLogo = ({ service, styles = {} }: IResourceLogoProps): JSX.Element => {
  const type = service.split("::")?.[0];
  switch (type) {
    case `Quickbook`:
      return <MDBox component="img" src={QuickbookLogo} sx={{ width: "5rem", ...styles }} ml={1} />;
    case `Xero`:
      return <MDBox component="img" src={XeroLogo} sx={{ width: "2rem", ...styles }} ml={1} />;
    case `Autotask`:
      return <MDBox component="img" src={AutotaskLogo} sx={{ width: "2rem", ...styles }} ml={1} />;
    case `QuickbookDesktop`:
      return (
        <MDBox
          component="img"
          src={QuickbookDesktopLogo}
          sx={{ height: "2rem", ...styles }}
          ml={1}
        />
      );
    case `Connectwise`:
      return (
        <MDBox component="img" src={ConnectwiseLogo} sx={{ width: "2.4rem", ...styles }} ml={1} />
      );
    default:
      return null;
  }
};

export default ResourceLogo;
