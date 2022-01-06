import React, { useEffect } from "react";

interface ErrorMessageProps {
  error: any;
  errorMessage?: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({error, errorMessage, onRetry}) => {
  useEffect(() => {
    console.log(error);
  }, ["error"]);

  return <>
    {error ?
      <div className="alert alert-danger my-3">
        <p>
          {errorMessage ? errorMessage : "Sorry, something went wrong."}
        </p>
        <p className="text-center">
          <button className="btn btn-danger" onClick={onRetry}>Try again</button>
        </p>
      </div>
      : null}
  </>;
};

export default ErrorMessage;