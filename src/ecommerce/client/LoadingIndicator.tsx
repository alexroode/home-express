import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";

const LoadingIndicator: React.FC = () => {
  return <FontAwesomeIcon icon={faCircleNotch} spin={true} className="my-5" size="2x"/>;
};

export default LoadingIndicator;