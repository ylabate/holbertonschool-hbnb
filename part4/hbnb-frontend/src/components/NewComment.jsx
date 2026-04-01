import { useState } from "react";
import { API_BASE_URL } from "@/constants";

const DEFAULT_FORM = {
  text: "",
  rating: 3,
};

export default function NewComment({
  placeId,
  authToken = "",
  userId = "",
  onSuccess = () => {},
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!authToken || !userId) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!placeId) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/`, {
        method: "POST",
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          place_id: placeId,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to submit comment",
        );
      }

      setSuccessMsg("Comment submitted successfully!");
      setForm(DEFAULT_FORM);
      onSuccess(data);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="new-comment-form add-review mt-4">
      <h3 className="font-semibold mb-3 text-center text-fg">Add a comment</h3>
      <form
        onSubmit={handleSubmit}
        className="form flex flex-col gap-3 text-left"
        aria-label="Add a new comment"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-fg-muted">
            Your comment
          </span>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows={4}
            required
            placeholder="What did you think about this place?"
            disabled={submitting}
            className="w-full"
          ></textarea>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-fg-muted">Rating</span>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            disabled={submitting}
            required
            className="w-full"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "Star" : "Stars"}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="primary-button details-button py-3 font-semibold disabled:opacity-60 cursor-pointer"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>

        {errorMsg ? (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        ) : null}

        {successMsg ? (
          <p className="text-green-600 text-sm text-center">{successMsg}</p>
        ) : null}
      </form>
    </section>
  );
}
