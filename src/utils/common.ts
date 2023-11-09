// libs
import moment from "moment";
import { orderBy } from "lodash";

// type
import { IOptionSelect, defaultOptionSelect } from "types/UI";

const toCapitalize = (text: string) => {
  if (!text) return null;
  const arr = text.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
};

const numberWithCommas = (x: number | string) => {
  if (!x) return "0";
  if (typeof x == "number") x = x.toString();
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function uniqueBy(arr: Array<{ [key: string]: any }>, prop: string) {
  return [...new Map(arr.map(item => [item[prop], item])).values()];
}

const mapDefaultOptions = (list: Array<IOptionSelect>, value: string): IOptionSelect => {
  if (!list.length || !value) return defaultOptionSelect;
  const item = list.find(item => item.value === value);
  if (!item) return defaultOptionSelect;
  return {
    value,
    text: item.text ?? "",
  };
};

const parseTimezone = (value, formatTime) =>
  moment.parseZone(value).utc(true).utcOffset(0).format(formatTime);

const sortAddressOptionList = (array, value) => {
  const sortedArrayByName = orderBy(array, ["label", "text"], ["asc"]);
  const indexSelected = sortedArrayByName.findIndex(item => item.value === value);
  if (indexSelected === -1) return array;
  const selectedItem = sortedArrayByName.find(item => item.value === value);
  const finalList = [...sortedArrayByName];
  finalList.splice(indexSelected, 1);
  return [selectedItem, ...finalList];
};

function convertSecondsToHms(timer: string | number) {
  timer = Number(timer);
  const hour = Math.floor(timer / 3600);
  const minute = Math.floor((timer % 3600) / 60);
  const second = Math.floor((timer % 3600) % 60);

  const hourDisplay = hour > 0 ? hour + (hour === 1 ? " hour " : " hours ") : "";
  const minuteDisplay = minute > 0 ? minute + (minute === 1 ? " minute, " : " minutes ") : "";
  const secondDisplay = second > 0 ? second + (second === 1 ? " second" : " seconds") : "";
  return hourDisplay + minuteDisplay + secondDisplay;
}

const USER_STATUS = {
  active: "active",
  blocked: "blocked",
  invited: "invited",
};

const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  //Filter only numbers from the input
  let cleaned = ("" + phone).replace(/\D/g, "");

  //Check if the input is of correct
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    //Remove the matched extension code
    //Change this to format for any country code.
    let intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return "";
};

function getUniqueListBy(arr, key): Array<any> {
  return [...new Map(arr.map(item => [item[key], item])).values()];
}

export {
  toCapitalize,
  numberWithCommas,
  uniqueBy,
  mapDefaultOptions,
  parseTimezone,
  sortAddressOptionList,
  convertSecondsToHms,
  USER_STATUS,
  formatPhoneNumber,
  getUniqueListBy,
};
