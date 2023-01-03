import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { IContactRequest } from "./contactRequest";

const nameFieldRules = {
  required: "This field is required",
  maxLength: {
    value: 100,
    message: "This field is too long"
  }
};

const messageBoxRules = {
  ...nameFieldRules,
  maxLength: {
    ...nameFieldRules.maxLength,
    value: 300
  }
};

const emailFieldRules = {
  ...nameFieldRules,
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address"
  }
};

const unexpectedErrorMessage = "An error occurred. Please try again later.";

export default function App() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitted } } = useForm<IContactRequest>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null as string);
  const [successMessage, setSuccessMessage] = useState(null as string);
  function resetForm() {
    reset();
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function doSubmit(data: IContactRequest, recaptchaToken: string) {
    try {
      const body = data;
      body["g-recaptcha-response"] = recaptchaToken;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.status >= 200 && response.status < 300) {
        resetForm();
        setSuccessMessage("Thank you! Your message has been sent.");
      } else {
        setErrorMessage(unexpectedErrorMessage);
      }
    } catch (error: any) {
      console.log(error);
      setErrorMessage(unexpectedErrorMessage);
    }

    setIsSubmitting(false);
  }

  async function trySubmit(data: IContactRequest) {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    const token = await executeRecaptcha("homepage");
    if (!token) {
      setIsSubmitting(false);
    }
    await doSubmit(data, token);
  }

  return (
    <form onSubmit={handleSubmit(trySubmit)}>
      <div className="mb-3">
        <label htmlFor="name">Your Name</label>
        <input id="name"
          className={"form-control " + (errors.name && isSubmitted ? "is-invalid" : "")}
          {...register("name", nameFieldRules)} />
        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email">Your Email</label>
        <input id="email"
          className={"form-control " + (errors.email && isSubmitted ? "is-invalid" : "")}
          {...register("email", emailFieldRules)} />
        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="message">Your Message</label>
        <textarea id="message"
          className={"form-control " + (errors.message && isSubmitted ? "is-invalid" : "")}
          {...register("message", messageBoxRules)} />
        {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
      </div>

      <div className="mb-3 mt-6">
        <button type="submit" className="btn btn-outline-primary" disabled={isSubmitting}>Submit</button>
      </div>

      {successMessage ? <div className="alert alert-success">{successMessage}</div> : null}
      {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null}
    </form>
  );
}
