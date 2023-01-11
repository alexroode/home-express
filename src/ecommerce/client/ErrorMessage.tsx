import { useEffect } from "react";

interface ErrorMessageProps {
  error: any;
  errorMessage?: string;
  onRetry: () => void;
}

const ErrorMessage = ({error, errorMessage, onRetry}: ErrorMessageProps) => {
  useEffect(() => {
    console.log(error);
  }, ["error"]);

  if (!error) {
    return null;
  }

  return <div className="alert alert-danger my-3">
    <p>
      {errorMessage ? errorMessage : "Sorry, something went wrong."}
    </p>
    <p className="text-center">
      <button className="btn btn-danger" onClick={onRetry}>Try again</button>
    </p>
  </div>;
};

export default ErrorMessage;