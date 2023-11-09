const numbers = "0123456789";
const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
const specialCharacters = "!'^+%&/()=?_#$½§{[]}|;:>÷`<.*-@é";

export function generatePassword({
  passwordLength = 10,
  includeUppercase = false,
  includeLowercase = false,
  includeNumbers = false,
  includeSymbols = false,
}) {
  const handleGeneratePassword = () => {
    let characterList = "";

    if (includeLowercase) {
      characterList = characterList + lowerCaseLetters;
    }

    if (includeUppercase) {
      characterList = characterList + upperCaseLetters;
    }

    if (includeNumbers) {
      characterList = characterList + numbers;
    }

    if (includeSymbols) {
      characterList = characterList + specialCharacters;
    }
    return characterList;
  };

  const createPassword = characterList => {
    let password = "";
    const characterListLength = characterList.length;

    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      password = password + characterList.charAt(characterIndex);
    }
    return password;
  };

  return createPassword(handleGeneratePassword());
}
