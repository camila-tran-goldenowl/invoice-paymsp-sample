// libs
import { useSelector } from "react-redux";

// store
import { selectThemeSetting } from "components/Tenant/slice/selectors";

export function useDarkmode() {
  const { darkMode } = useSelector(selectThemeSetting);
  return darkMode;
}
