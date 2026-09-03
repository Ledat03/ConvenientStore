import Lottie from "lottie-react";
import loadingAnimation from "../../../loadingV2.json";
import "../../assets/scss/loading.scss";
const LoadingAnimation = ({ width = 100, height = 100, loop = true, autoplay = true }) => {
  return (
    <div className="Main-Loading">
      <span>Vui Lòng Chờ...</span>
      <Lottie animationData={loadingAnimation} style={{ width, height }} loop={loop} autoplay={autoplay} />;
    </div>
  );
};

export default LoadingAnimation;
