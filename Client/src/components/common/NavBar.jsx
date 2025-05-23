import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
export const CommonNav = (props) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink to="/" className="navbar-brand">
          HomePage
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/login" className="nav-link">
              Link
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Form className="d-flex">
          <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
          <Button variant="outline-success">Search</Button>
        </Form>
        <Button className="nav-button">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        </Button>
        <Button className="nav-button">
          <NavLink to="/register" className="nav-link">
            Sign Up
          </NavLink>
        </Button>
        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Sign Up
          </NavLink>
          <NavDropdown.Item to="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item to="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown> */}
      </Container>
    </Navbar>
  );
};
