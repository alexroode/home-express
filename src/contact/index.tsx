import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import ContactForm from "./ContactForm";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const el = document.getElementById("contact-form");
const recaptchaSiteKey = el.getAttribute("data-recaptcha-site-key");

ReactDOM.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <ContactForm />
    </GoogleReCaptchaProvider>
  </React.StrictMode>,
  el
);