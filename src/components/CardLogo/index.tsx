// components
import MDBox from "components/MDBox";

// images
import visaLogo from "assets/images/logos/visa.png";
import jbcLogo from "assets/images/logos/jcb-logo.jpg";
import bankLogo from "assets/images/logos/bank.png";
import masterCardLogo from "assets/images/logos/mastercard.png";
import discoverLogo from "assets/images/logos/discover-logo.webp";
import americanExpressLogo from "assets/images/logos/american-express-logo.png";

import pxToRem from "assets/theme/functions/pxToRem";

interface ICardLogoProps {
  type: string;
}

const CardLogo = ({ type }: ICardLogoProps): JSX.Element => {
  const handleLogo = () => {
    const typeLowerText = type?.toLowerCase();
    switch (typeLowerText) {
      case "mastercard":
        return masterCardLogo;
      case "visa":
        return visaLogo;
      case "discover":
        return discoverLogo;
      case "jcb":
        return jbcLogo;
      default:
        if (["americanexpress", "amex", "american express"].includes(typeLowerText))
          return americanExpressLogo;
        else if (typeLowerText.includes("bank")) return bankLogo;
        return;
    }
  };
  return <MDBox component="img" src={handleLogo()} height={pxToRem(30)} mr={2} />;
};

export default CardLogo;
