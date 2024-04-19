import React, { useContext } from "react";
import { Navbar, Container, Image, NavDropdown, Nav } from "react-bootstrap";
import { getUser, useUserActions } from "../hooks/user.actions";
import { Link } from "react-router-dom";
import { Context } from "./Layout";

function Navigationbar() {
    const { setToaster } = useContext(Context);

    const userActions = useUserActions();

    const handleLogout = () => {
        userActions.logout().catch((e) =>
        setToaster({
            type: "danger",
            message: "Logout failed",
            show: true,
            title: e.data?.detail | "Error occurred.",
        }));
    };

    const user = getUser();

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand className="fw-bold" as={Link} to={"/"}>
                    Postgram
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown title={
                            <Image src={user.avatar} // src={`http://localhost:8000${user.avatar}`}
                                   roundedCircle
                                   width={36}
                                   height={36}
                            />
                        }
                    >
                            <NavDropdown.Item as={Link} to={`/profile/${user.id}/`}>Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/chats/`}>Chats</NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={handleLogout}>Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;
