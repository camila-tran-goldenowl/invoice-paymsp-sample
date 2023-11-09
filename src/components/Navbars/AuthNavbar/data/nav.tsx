// icon
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

// components
import MDBox from "components/MDBox";

// images
import XeroLogo from "assets/images/logos/xero-logo.png";
import StripeLogo from "assets/images/logos/stripe-logo.svg";
import AuthorizeNetLogo from "assets/images/logos/authorize-net.png";
import AutotaskLogo from "assets/images/logos/autotask-square-logo.png";
import QuickbookLogo from "assets/images/logos/quickbook-square-logo.png";
import ConnectwiseLogo from "assets/images/logos/connectwise-square-logo.png";

// data
import { ENV } from "utils/constants";

const routes = [
  {
    name: "features",
    icon: <FeaturedPlayListIcon />,
    route: `${ENV.LANDING_PAGE_URL}#features`,
  },
  {
    name: "Pricing",
    icon: <PriceChangeIcon />,
    route: `${ENV.LANDING_PAGE_URL}#pricing`,
  },
  {
    name: "integrations",
    icon: <IntegrationInstructionsIcon />,
    route: `${ENV.LANDING_PAGE_URL}#integrations`,
    dropdown: true,
    collapse: [
      {
        name: "Quickbook",
        icon: <MDBox component="img" src={QuickbookLogo} sx={{ width: "2rem" }} mr={1} />,
        href: `${ENV.LANDING_PAGE_URL}/integration/quickbook`,
      },
      {
        name: "Xero",
        href: `${ENV.LANDING_PAGE_URL}/integration/xero`,
        icon: <MDBox component="img" src={XeroLogo} sx={{ height: "2rem" }} mr={1} />,
      },
      {
        name: "Connectwise",
        href: `${ENV.LANDING_PAGE_URL}/integration/connectwise`,
        icon: <MDBox component="img" src={ConnectwiseLogo} sx={{ height: "2rem" }} mr={1} />,
      },
      {
        name: "Autotask",
        href: `${ENV.LANDING_PAGE_URL}/integration/autotask`,
        icon: <MDBox component="img" src={AutotaskLogo} sx={{ height: "2rem" }} mr={1} />,
      },
      {
        name: "Authorize",
        href: `${ENV.LANDING_PAGE_URL}/integration/authorize`,
        icon: <MDBox component="img" src={AuthorizeNetLogo} sx={{ height: "1.5rem" }} mr={1} />,
      },
      {
        name: "Stripe",
        href: `${ENV.LANDING_PAGE_URL}/integration/stripe`,
        icon: <MDBox component="img" src={StripeLogo} sx={{ height: "1.5rem" }} mr={1} />,
      },
    ],
  },
  {
    name: "Support",
    icon: <ContactSupportIcon />,
    route: `${ENV.LANDING_PAGE_URL}#support`,
  },
];

export default routes;
