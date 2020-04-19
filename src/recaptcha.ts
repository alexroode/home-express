import * as expressRecaptcha from "express-recaptcha";
import * as config from "../config";

const recaptchaSiteKey = config.recaptchaSiteKey;
const Recaptcha = expressRecaptcha.RecaptchaV3;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecretKey, { callback: "recaptchaCallback" });

export { recaptcha, recaptchaSiteKey };