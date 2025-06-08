import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import { UserTable } from "./manageuser/UserTable";
import { handleListUser } from "../../services/GetAPI";
import { useEffect, useState } from "react";
import CreateUser from "./manageuser/CreateUser";
import LoadingAnimation from "../common/LoadingAnimation";
export const AdminManageUser = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleUsers();
  }, []);
  const handleUsers = async () => {
    try {
      const listUsers = await handleListUser();
      setUsers(listUsers.data.data);
      setLoading(false);
      setError(null);
    } catch (e) {
      setLoading(false);
      setError(e);
      throw e;
    }
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Can't handle User List duo to {error}</div>;
  }
  return (
    <div className="manage-user-container">
      <div className="manage-user-subcontainer">
        <>
          <CreateUser handleUsers={handleUsers} />
        </>
      </div>
      <div className="table-user">
        <UserTable handleUsers={handleUsers} Users={Users} />
      </div>
    </div>
  );
};
