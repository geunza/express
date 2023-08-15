interface Regex {
  value: string;
  type: string;
}
export const onRegex = ({ value, type }: Regex) => {
  let result;
  if (value.length === 0) return false;
  switch (type) {
    case "email":
      const regexEmail = new RegExp(
        "^(?=.{1,64}$)(?=.{1,64}@)[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)+$"
      );
      result = regexEmail.test(value);
      break;
    case "password":
      const regexPassword = new RegExp(
        "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,16}$"
      );
      result = regexPassword.test(value);
      break;
    default:
      result = false;
  }
  return result;
};
export const removeTimeStamp = ({ time }: { time: any }) => {
  return time.toISOString().split(".")[0];
};
