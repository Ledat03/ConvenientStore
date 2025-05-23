import { VscClose } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
export const AdminHeader = ({ setCollapse, collapse } = props) => {
  return (
    <div className="admin-header">
      {collapse == false ? (
        <VscClose size="30px" onClick={() => setCollapse(!collapse)} />
      ) : (
        <FaBars size="30px" onClick={() => setCollapse(!collapse)} />
      )}
    </div>
  );
};
