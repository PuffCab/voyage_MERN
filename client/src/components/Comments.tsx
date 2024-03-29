import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { CommentsType } from "../types/customTypes";
import { AuthContext } from "../context/AuthContext";
import { formatDateAndTime } from "./Functions";
import { ExperiencesContext } from "../context/ExperiencesContext";

type CommentsProps = {
  comments: CommentsType[];
  _id: string;
};

function Comments({ comments, _id }: CommentsProps) {
  const { user } = useContext(AuthContext);
  const { experiences, fetchExperiences } = useContext(ExperiencesContext);
  const experienceID = _id;
  // console.log("experienceID on commentsComp:>> ", experienceID);

  console.log("user :>> ", user);
  console.log("experiences in COMMENTS:>> ", experiences);

  const [newComment, setNewComment] = useState({
    _id: "",
    author: {
      _id: "",
      email: "",
      username: "",
      user_image: "",
    },
    date: new Date(),
    message: "",
    experienceID: experienceID,
  });
  const [commments, setUpdatedComments] = useState<CommentsType[] | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleNewComments = (e: ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    setNewComment({
      ...newComment,
      [e.target.name]: e.target.value,
    });
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5005/api/comments/experience/${_id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("FETCHDATA :>> ", data);
        setUpdatedComments(data.comments);
        fetchExperiences();
        console.log("updatedComments :>> ", data.comments);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
    }

    if (token) {
      console.log("newComment :>> ", newComment);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const urlencoded = new URLSearchParams();
      urlencoded.append("_id", user!._id);
      urlencoded.append("email", user!.email);
      urlencoded.append("username", user!.username);
      urlencoded.append("user_image", user!.user_image);
      urlencoded.append("message", newComment.message);
      urlencoded.append("experience", experienceID);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };
      try {
        const response = await fetch(
          `http://localhost:5005/api/experiences/experiences/${_id}/comments`,
          requestOptions
        );

        console.log("results for posting comments :>> ", response);

        if (response.ok) {
          const data = await response.json();
          console.log("data for my new comment :>> ", data);
          const newComment: CommentsType = data.comment;
          fetchExperiences();
        } else {
          const data = await response.json();
          console.error("Error posting comment:", data.message);
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    }
    setTextInput("");
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found");
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      if (window.confirm("Are you SURE you want to delete your comment?")) {
        const response = await fetch(
          `http://localhost:5005/api/experiences/deletecomment/${commentId}`,
          requestOptions
        );

        console.log("Response status:", response.status);

        if (response.ok) {
          console.log("comment deleted successfully!");
          fetchExperiences();
        } else {
          console.log("error with response when deleting comment");
        }
      }
    } catch (error) {
      console.log("error when deleting comment:>> ", error);
    }
  };
  console.log("comments :>> ", comments);
  useEffect(() => {
    fetchComments();
  }, [user, experienceID]);

  return (
    <div>
      <h2>comments:</h2>
      <form onSubmit={handleSubmitComment}>
        <div className="inputContainer">
          <input
            name="message"
            type="text"
            placeholder="Leave a comment..."
            onChange={handleNewComments}
            value={textInput}
          />
          <button
            style={{ backgroundColor: "white" }}
            className="nakdButton"
            type="submit"
          >
            submit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                d="M2.08337 21.875L23.9584 12.5L2.08337 3.125V10.4167L17.7084 12.5L2.08337 14.5833V21.875Z"
                fill="#EFCB59"
              />
            </svg>
          </button>
        </div>
      </form>

      <div style={{ backgroundColor: "white" }}>
        <div>
          {experiences && experiences.length > 0 ? (
            experiences.map((experience) => {
              return (
                <div key={experience._id}>
                  {experience._id === experienceID &&
                    experience.comments
                      ?.slice()
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((comment) => {
                        return (
                          <div key={comment._id}>
                            {comment.author && (
                              <>
                                <img
                                  style={{
                                    width: "7%",
                                    borderRadius: "50%",
                                  }}
                                  src={comment.author.user_image}
                                  alt={comment.author.username}
                                />
                                <p>{comment.author.username}</p>
                                <p>{comment.author.user_image}</p>
                              </>
                            )}
                            <p>{formatDateAndTime(comment.date)}</p>
                            <p>{comment.message}</p>
                            {user && user.email === comment.author?.email && (
                              <button
                                onClick={() => {
                                  handleDeleteComment(comment._id);
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        );
                      })}
                </div>
              );
            })
          ) : (
            <p>Be the first one to leave a comment</p>
          )}
        </div>
        <hr />
      </div>
    </div>
  );
}

export default Comments;
