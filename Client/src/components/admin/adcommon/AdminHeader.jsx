import { VscClose } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
export const AdminHeader = ({ setCollapse, collapse } = props) => {
  return (
    <div className="admin-header">
      <div>{collapse == false ? <VscClose className="i" size="30px" onClick={() => setCollapse(!collapse)} /> : <FaBars className="i" size="20px" onClick={() => setCollapse(!collapse)} />}</div>
      <div className="admin-action"></div>
    </div>
  );
};
