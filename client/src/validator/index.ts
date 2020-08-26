const required = (value: any, allValues: any, props: any, name: string) => {
  let fieldName = "";
  switch (name) {
    case "name":
      fieldName = "نام";
      break;
    case "family":
      fieldName = "نام خانوادگی";
      break;
    case "phone":
      fieldName = "شماره تماس";
      break;
    case "email":
      fieldName = "ایمیل";
      break;
    case "password":
      fieldName = "رمز‌عبور";
      break;
    case "password_confirm":
      fieldName = "تکرار رمز‌عبور";
      break;
    case "credit":
      fieldName = "اعتبار";
  }
  return value || typeof value === "number" ? undefined : `فیلد ${fieldName} الزامی است`;
};

const minLength = (min: any) => (value: string) =>
  value && value.length < min ? `حداقل طول رمز عبور ${min} کاراکتر می‌باشد` : undefined;

const minLength7 = minLength(7);

const number = (value: any) =>
  value && isNaN(Number(value)) ? "عبارت وارد‌شده عدد نمی‌باشد" : undefined;

const email = (value: any) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "آدرس ایمیل معتبر نیست"
    : undefined;

const minValue = (min: number) => (value: any) =>
  value && value < min ? `حداقل مقدار ${min} می‌باشد` : undefined;
const minValue500 = minValue(500);

const alphaNumeric = (value: any) =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "عبارت وارد‌شده می‌بایست ترکیبی از ارقام و حروف باشد"
    : undefined;

const phoneNumber = (value: any) =>
  value && !/^([0][9][0-9]{9})$/i.test(value) ? "شماره تماس معتبر نیست" : undefined;

const passwordsMatch = (value: any, allValues: any) =>
  value !== allValues.password ? "رمزعبور تطابق ندارد" : undefined;

export const Validator = {
  required,
  minLength7,
  minValue500,
  number,
  email,
  alphaNumeric,
  phoneNumber,
  passwordsMatch
};
