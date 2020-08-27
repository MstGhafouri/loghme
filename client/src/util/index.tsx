import React from "react";
import { toast } from "react-toastify";
import CustomToast from "../components/ui/customToast";
import { StatusCodes } from "../redux/actions";

export const toPersianDigits = function (input: string | number): string {
  if (typeof input === "number") input = input.toString();
  return input.replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
};

export const displayConditionalToast = function (statusCode: number, message?: string) {
  switch (statusCode) {
    case StatusCodes.notFound:
      toast.error(
        <CustomToast message={message || "اطلاعاتی برای نمایش وجود ندارد"} header="خطا" />
      );
      break;
    case StatusCodes.forbidden:
      toast.error(
        <CustomToast
          message={message || "امکان مشاهده‌ این صفحه برای شما وجود ندارد"}
          header="خطا"
        />
      );
      break;
    case StatusCodes.unauthorized:
      toast.error(<CustomToast message={message || "Unauthorized"} header="خطا" />);
      break;
    case StatusCodes.internalErr:
      toast.error(<CustomToast message="خطا در برقراری ارتباط با سرور" header="خطا" />);
      break;
    case StatusCodes.badRequest:
      toast.error(<CustomToast message={message || "درخواست شما معتبر نیست"} header="خطا" />);
      break;
    case StatusCodes.failedAddItem:
      toast.error(
        <CustomToast message="امکان اضافه‌کردن غذا تنها از یک رستوران میسر است" header="خطا" />
      );
      break;
    case StatusCodes.successfulAddItem:
      toast.success(<CustomToast message="محصول به سبد خرید شما اضافه شد" />, { autoClose: 3000 });
      break;
    case StatusCodes.successfulFinalizedOrders:
      toast.success(<CustomToast message="ثبت سفارش شما با موفقیت انجام شد" />);
      break;
    case StatusCodes.successfulRegister:
      toast.success(<CustomToast message="ثبت ‌نام شما با موفقیت انجام شد" />);
      break;
    case StatusCodes.failedAddFoodParty:
      toast.error(<CustomToast message="موجودی غذا کافی نمی‌باشد" header="خطا" />);
      break;
    case StatusCodes.creditNotEnough:
      toast.error(<CustomToast message="موجودی حساب شما کافی نمی‌باشد" header="خطا" />);
      break;
    case StatusCodes.unauthorizedUser:
      toast.info(
        <CustomToast
          message={message || "لطفا برای ثبت سفارش ابتدا وارد سایت شوید"}
          header="توجه"
        />
      );
      break;
    case StatusCodes.successfulRaiseCredit:
      toast.success(<CustomToast message="افزایش اعتبار شما با موفقیت انجام شد" />, {
        autoClose: 3000
      });
      break;
    case StatusCodes.success:
      toast.success(<CustomToast message={message || "عملیات با موفقیت انجام شد"} />, {
        autoClose: 3000
      });
  }
};

export const formatSeconds = function (timeInSeconds: number) {
  // const hours = Math.floor(timeInSeconds / 3600);
  // const secondsLeft = Math.floor(timeInSeconds - hours * 3600);
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds - minutes * 60);
  let formattedTime = "";
  // if (hours > 0) {
  //   if (hours < 10) formattedTime += "۰";
  //   formattedTime += hours + ":";
  // }
  if (minutes < 10) formattedTime += "۰";
  formattedTime += minutes + ":";
  if (seconds < 10) formattedTime += "۰";
  formattedTime += seconds.toString();

  return toPersianDigits(formattedTime);
};
