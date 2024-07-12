const api = import.meta.env.VITE_BACKEND_URI;

export const SIGNUP_API = api + "/signup";
export const LOGIN_API = api + "/login";
export const LOGOUT_API = api + "/logout";

export const HEALTHCHECK_API = api + "/healthcheck";
export const SEND_OTP_API = api + "/otp/send";
export const VERIFY_OTP_API = api + "/otp/verify";

export const healthcheckAPI = api + "/healthcheck";
export const sendOtpAPI = api + "/otp/send";
export const verifyOtpAPI = api + "/otp/verify";

export const getUserAPI = api + "/user";
export const createKYC = api + "/kyc/create";
export const getKYCStatusAPI = api + "/kyc/status";
export const DASHBOARD_API = api + '/dashboard/applications'


export const MAINNET_PAYMENT_API = api + "/make-payment/mainnet";
export const TESTNET_PAYMENT_API = api + "/make-payment/testnet";
