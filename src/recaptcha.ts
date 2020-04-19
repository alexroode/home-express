import * as expressRecaptcha from "express-recaptcha";
import * as config from "config";

const recaptchaSiteKey = config.get<string>("recaptchaSiteKey");
const recaptchaSecretKey = config.get<string>("recaptchaSecretKey");
const Recaptcha = expressRecaptcha.RecaptchaV3;
const recaptcha = new Recaptcha(recaptchaSiteKey, recaptchaSecretKey, { callback: "recaptchaCallback" });

export { recaptcha, recaptchaSiteKey };