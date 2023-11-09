/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { isEqual, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { sortAddressOptionList } from "utils/common";
import { useSelector, useDispatch } from "react-redux";

// store
import { selectCountries } from "components/Country/slice/selectors";
import { useSlice as useCountrySlice } from "components/Country/slice";

// data
import { COUNTRY_DEFAULT } from "utils/constants";

// type
import type { UseFormReturn } from "react-hook-form";

interface IAddressFormProps {
  form: Omit<UseFormReturn, "handleSubmit">;
  name?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

const useAddressForm = ({
  form: formInstance,
  name: { country: countryName, state: stateName, city: cityName },
}: IAddressFormProps) => {
  const { watch, setValue, getValues } = formInstance;

  const countries = useSelector(selectCountries);
  const dispatch = useDispatch();
  const { actions: countryActions } = useCountrySlice();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [sortedCountriesList, setSortedCountriesList] = useState(countries);

  const data = getValues();

  useEffect(() => {
    if (
      data?.state?.value &&
      !isEmpty(data?.country?.states) &&
      !data?.country?.states?.some(e => e.value === data.state.value)
    ) {
      setValue(stateName, {});
      setValue(cityName, {});
    }
    if (data.country && isEmpty(data.country.states)) {
      dispatch(countryActions.listFetchRequest({ country: data.country.value }));
    }
  }, [watch(countryName)]);

  useEffect(() => {
    if (
      data?.city?.value &&
      !isEmpty(data?.state?.cities) &&
      !data?.state?.cities?.some(e => e.value === data.city.value)
    )
      setValue(cityName, {});
    if (data.state && isEmpty(data.state.cities)) {
      dispatch(
        countryActions.listFetchRequest({
          country: data.country.value,
          country_state: data.state.value,
        })
      );
    }
  }, [watch(stateName)]);

  useEffect(() => {
    let country = watch(countryName, {});
    const countryValue =
      country?.value || (country && Object.keys(country).length ? country : COUNTRY_DEFAULT);
    let newContriesList;
    newContriesList =
      countries.length && countryValue ? sortAddressOptionList(countries, countryValue) : countries;
    setSortedCountriesList(newContriesList);
    const newCountry = countries.find(e => e.value === countryValue);
    if (newCountry && !isEqual(newCountry, country)) setValue(countryName, newCountry);
  }, [countries]);

  useEffect(() => {
    let country = watch(countryName, {});
    let state = watch(stateName, {});
    let states = country?.states || [];
    const stateValue = state?.value || state;
    if (states.length && stateValue) {
      states = sortAddressOptionList(states, stateValue);
    }
    setStates(states);
    const newState = country?.states?.find(e => e.value === stateValue);
    if (newState && !isEqual(newState, state)) setValue(stateName, newState);
  }, [watch(countryName)]);

  useEffect(() => {
    let state = watch(stateName, {});
    let city = watch(cityName, {});
    let cities = state?.cities || [];
    const cityValue = city?.value || city;

    if (cities.length && cityValue) {
      cities = sortAddressOptionList(cities, cityValue);
    }
    setCities(cities);
    const newCity = state?.cities?.find(e => e.value === cityValue);
    if (newCity && !isEqual(newCity, city)) setValue(cityName, newCity);
  }, [watch(stateName)]);

  return { cities, states, countries: sortedCountriesList };
};

export default useAddressForm;
