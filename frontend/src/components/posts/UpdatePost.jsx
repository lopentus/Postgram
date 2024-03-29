import React, {useContext, useState} from "react";
import {Button, Modal, Form, Dropdown} from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import { Context } from "../Layout";

function UpdatePost(props) {
    const { post, refresh } = props;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);
    const[form, setForm] = useState({});

    const user = getUser();

    const { setToaster } = useContext(Context)

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatePostForm = event.currentTarget;

        if (updatePostForm.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        const data = {
            author: user.id,
            body: form.body,
        };

        axiosService.put(`/post/${post.id}/`, data)
            .then(() => {
                handleClose();
                setToaster({
                    type: "success",
                    message: "Post updated!",
                    show: true,
                    title: "Post Successfully updated :)",
                });
                setForm({});
                refresh();
            })
            .catch((err) => {
                setToaster({
                    type: "danger",
                    message: "An error occurred.",
                    show: true,
                    title: "Post Error",
                });
            });
    };

    return (
        <>
            <Dropdown.Item data-testid="show-modal-form" onClick={handleShow}>Modify</Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Modify Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} data-testid="update-post-form">
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="body"
                                value={form.body}
                                data-testid="post-body-field"
                                onChange={(e) => setForm({
                                    ...form,
                                    body: e.target.value
                                })}
                                as="textarea"
                                rows={3}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                            data-testid={"update-post-submit"}
                            onClick={handleSubmit}
                            disabled={form.body === undefined}>
                        Modify
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdatePost;
