import { render, screen, fireEvent } from "../../../helpers/test-utils";
import { v4 as uuid4 } from "uuid";
import userEvent from "@testing-library/user-event";
import UpdateComment from "../UpdateComment";
import { faker } from "@faker-js/faker";
import userFixtures from "../../../helpers/fixtures/user";
import commentFixtures from "../../../helpers/fixtures/comment";

const userData = userFixtures();
const commentData = commentFixtures(true, false, userData);

test("render UpdateComment component", async () => {
    const user = userEvent.setup();
    render(<UpdateComment postId={uuid4()} comment={commentData} />);

    const showModalForm = screen.getByTestId("show-modal-form");
    expect(showModalForm).toBeInTheDocument();

    fireEvent.click(showModalForm);

    const updateFormElement = screen.getByTestId("update-comment-form");
    expect(updateFormElement).toBeInTheDocument();
    const commentBodyField = screen.getByTestId("comment-body-field");
    expect(commentBodyField).toBeInTheDocument();

    const submitButton = screen.getByTestId("update-comment-submit");
    expect(submitButton).toBeInTheDocument();

    expect(submitButton.disabled).toBeFalsy();

    const commentBody = faker.lorem.sentence(10);
    await user.type(commentBodyField, commentBody);

    expect(commentBodyField.value).toBe(commentData.body + commentBody);
    expect(submitButton.disabled).toBeFalsy();
})
