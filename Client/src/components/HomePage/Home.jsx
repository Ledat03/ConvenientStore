import Notification from "./Notification";
import QuickCategory from "./QuickCategory";
import BestDeal from "./BestDeal";
import BestSeller from "./BestSeller";
import NewProduct from "./NewProduct";
export const Home = () => {
  return (
    <>
      <Notification />
      <QuickCategory />
      <BestDeal />
      <BestSeller />
      <NewProduct />
    </>
  );
};
