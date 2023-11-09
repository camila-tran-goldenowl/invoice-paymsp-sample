export const showLast4Digit = (card_number: string) => {
  if (!card_number) return "";
  // let string = card_number.match(/.{1,4}/g);
  let sliced = card_number.slice(-4);
  let mask = String(sliced).padStart(card_number.length, "*");
  return split4Digit(mask);
};

export const split4Digit = (card_number: string) => {
  return card_number.match(/.{1,4}/g).join(" ");
};

export const addSlashesToExp = value => {
  if (!value) return "";
  let ele = value.split("/").join("");
  if (ele.length < 4 && ele.length > 0) {
    let finalVal = ele.match(/.{1,2}/g).join("/");
    return finalVal;
  }
  return value;
};
