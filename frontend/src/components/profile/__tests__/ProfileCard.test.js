import { render, screen } from "@testing-library/react";
import TestRenderer from "react-test-renderer"
import ProfileCard from "../ProfileCard";
import { BrowserRouter } from "react-router-dom";

const userData = {
    id: "0590cd67-eacd-4289-8413-605bd547ea15",
    first_name: "Gregory",
    last_name: "Abramovich",
    post_count: 3,
    email: "Gregory@email.com",
    bio: "my bio",
    username: "GregoryAbramovich",
    avatar: null,
    created: "2023-11-05T16:54:23.410Z",
    updated: "2023-11-05T16:54:23.450Z",
};

test("profile card snapshot", () => {
    const profileCardDomTree = TestRenderer.create(
        <BrowserRouter>
            <ProfileCard user={userData} />
        </BrowserRouter>
    ).toJSON();
    expect(profileCardDomTree).toMatchSnapshot();
});
