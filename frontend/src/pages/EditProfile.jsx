import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Layout from "../components/Layout";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { fetcher } from "../helpers/axios";
import { Row, Col } from "react-bootstrap";

function EditProfile() {
    const { profileId } = useParams();

    const profile = useSWR(`/users/${profileId}/`, fetcher);

    return (
        <Layout hasNavigationBack>
            {profile.data ? (
                <Row className="justify-content-evenly">
                    <Col sm={9}>
                        <UpdateProfileForm profile={profile.data} refresh={profile.mutate} />
                    </Col>
                </Row>
            ) : (
                <div>Loading ...</div>
            )}
        </Layout>
    );
}

export default EditProfile;
