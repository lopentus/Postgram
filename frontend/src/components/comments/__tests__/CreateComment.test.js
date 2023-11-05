import { render, screen } from "../../../helpers/test-utils";
import { v4 as uuid4 } from "uuid";
import userEvent from "@testing-library/user-event";
import CreateComment from "../CreateComment";
import { faker } from "@faker-js/faker";
import {setUserData} from "../../../hooks/user.actions";
import userFixtures from "../../../helpers/fixtures/user";

const userData = userFixtures();

beforeEach(() => {
    // to fully reset the state between __tests__, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();

    setUserData({
        user: userData,
        access: null,
        refresh: null,
    });
});

test("renders CreateComment component", async () => {
    const user = userEvent.setup();
    render(<CreateComment postId={uuid4()} />);

    const createFormElement = screen.getByTestId("create-comment-form");
    expect(createFormElement).toBeInTheDocument();

    const commentBodyField = screen.getByTestId("comment-body-field");
    expect(commentBodyField).toBeInTheDocument();

    const submitButton = screen.getByTestId("create-comment-submit");
    expect(submitButton).toBeInTheDocument();

    expect(submitButton.disabled).toBeTruthy();

    const commentBody = faker.lorem.sentence(10);
    await user.type(commentBodyField, commentBody);

    expect(commentBodyField.value).toBe(commentBody);
    expect(submitButton.disabled).toBeFalsy();
})
