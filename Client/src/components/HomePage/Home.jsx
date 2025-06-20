import Notification from "./Notification";
import QuickCategory from "./QuickCategory";
import BestDeal from "./BestDeal";
import BestSeller from "./BestSeller";
import NewProduct from "./NewProduct";
import Promotion from "./Promotion";
export const Home = () => {
  return (
    <>
      <Notification />
      <Promotion />
      <QuickCategory />
      <BestDeal />
      <BestSeller />
      <NewProduct />
    </>
  );
};
