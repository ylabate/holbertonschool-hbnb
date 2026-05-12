import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/constants";
import { ArrowLeft, Check, Pencil, Plus, Trash2, X } from "lucide-react";

const ADMIN_SECTIONS = [
  { id: "amenities", label: "Amenities" },
  { id: "users", label: "Users" },
  { id: "places", label: "Places" },
];

const EMPTY_AMENITY_FORM = {
  name: "",
  description: "",
};

function sortByName(items, accessor) {
  return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)));
}

export default function AdminPanel({
  authToken,
  onClose = () => {},
  isPage = false,
}) {
  const [activeSection, setActiveSection] = useState("amenities");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [amenities, setAmenities] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);

  const [newAmenity, setNewAmenity] = useState(EMPTY_AMENITY_FORM);
  const [editingAmenityId, setEditingAmenityId] = useState(null);
  const [editingAmenityForm, setEditingAmenityForm] = useState(
    EMPTY_AMENITY_FORM,
  );

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserForm, setEditingUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const sortedAmenities = useMemo(
    () => sortByName(amenities, (amenity) => amenity.name || ""),
    [amenities],
  );
  const sortedUsers = useMemo(
    () =>
      sortByName(
        users,
        (user) => `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      ),
    [users],
  );
  const sortedPlaces = useMemo(
    () => sortByName(places, (place) => place.title || ""),
    [places],
  );

  useEffect(() => {
    let ignore = false;

    async function loadAdminData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const headers = { Authorization: authToken };
        const [amenitiesResponse, usersResponse, placesResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/amenities/`, { headers }),
            fetch(`${API_BASE_URL}/users/`, { headers }),
            fetch(`${API_BASE_URL}/places/`, { headers }),
          ]);

        const [amenitiesData, usersData, placesData] = await Promise.all([
          amenitiesResponse.json(),
          usersResponse.json(),
          placesResponse.json(),
        ]);

        if (!amenitiesResponse.ok) {
          throw new Error(
            amenitiesData.message || "Unable to load amenities list",
          );
        }
        if (!usersResponse.ok) {
          throw new Error(usersData.message || "Unable to load users list");
        }
        if (!placesResponse.ok) {
          throw new Error(placesData.message || "Unable to load places list");
        }

        if (ignore) return;

        setAmenities(Array.isArray(amenitiesData) ? amenitiesData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setPlaces(Array.isArray(placesData) ? placesData : []);
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      ignore = true;
    };
  }, [authToken]);

  const setSectionStatus = (message) => {
    setStatusMessage(message);
    setErrorMessage("");
  };

  const setSectionError = (message) => {
    setErrorMessage(message);
    setStatusMessage("");
  };

  const handleCreateAmenity = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/amenities/`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAmenity),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create amenity");
      }

      setAmenities((prev) => [...prev, data]);
      setNewAmenity(EMPTY_AMENITY_FORM);
      setSectionStatus("Amenity created successfully.");
    } catch (error) {
      setSectionError(error.message);
    }
  };

  const startAmenityEdit = (amenity) => {
    setEditingAmenityId(amenity.id);
    setEditingAmenityForm({
      name: amenity.name || "",
      description: amenity.description || "",
    });
    setStatusMessage("");
    setErrorMessage("");
  };

  const handleAmenityUpdate = async (amenityId) => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/amenities/${amenityId}`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingAmenityForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update amenity");
      }

      setAmenities((prev) =>
        prev.map((amenity) =>
          amenity.id === amenityId
            ? { ...amenity, ...editingAmenityForm }
            : amenity,
        ),
      );
      setEditingAmenityId(null);
      setEditingAmenityForm(EMPTY_AMENITY_FORM);
      setSectionStatus(data.message || "Amenity updated successfully.");
    } catch (error) {
      setSectionError(error.message);
    }
  };

  const startUserEdit = (user) => {
    setEditingUserId(user.id);
    setEditingUserForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      password: "",
    });
    setStatusMessage("");
    setErrorMessage("");
  };

  const handleUserUpdate = async (userId) => {
    setStatusMessage("");
    setErrorMessage("");

    try {
      const payload = {
        first_name: editingUserForm.first_name,
        last_name: editingUserForm.last_name,
        email: editingUserForm.email,
      };
      if (editingUserForm.password.trim()) {
        payload.password = editingUserForm.password;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update user");
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? data : user)),
      );
      setEditingUserId(null);
      setEditingUserForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      setSectionStatus("User updated successfully.");
    } catch (error) {
      setSectionError(error.message);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Delete this user and all related data?")) return;

    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: authToken },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setPlaces((prev) => prev.filter((place) => place.owner_id !== userId));
      if (editingUserId === userId) {
        setEditingUserId(null);
      }
      setSectionStatus(data.message || "User deleted successfully.");
    } catch (error) {
      setSectionError(error.message);
    }
  };

  const handlePlaceDelete = async (placeId) => {
    if (!window.confirm("Delete this place?")) return;

    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
        method: "DELETE",
        headers: { Authorization: authToken },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete place");
      }

      setPlaces((prev) => prev.filter((place) => place.id !== placeId));
      setSectionStatus(data.message || "Place deleted successfully.");
    } catch (error) {
      setSectionError(error.message);
    }
  };

  const panelContent = (
    <section
      className={`profile-card w-full max-w-6xl ${
        isPage ? "overflow-visible" : "max-h-[90vh] overflow-hidden"
      }`}
    >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bg-separator)]">
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-fg-muted mt-1">
              Manage amenities, users and places from one menu.
            </p>
          </div>
          {isPage ? (
            <Link
              to="/profile"
              className="p-2 bg-bg-button rounded-full inline-flex"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={onClose}
              className="p-2 bg-bg-button rounded-full"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] ${
            isPage ? "" : "max-h-[calc(90vh-81px)]"
          }`}
        >
          <aside className="border-b lg:border-b-0 lg:border-r border-[var(--bg-separator)] p-4 flex lg:flex-col gap-3 overflow-x-auto">
            {ADMIN_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id);
                  setStatusMessage("");
                  setErrorMessage("");
                }}
                className={`px-4 py-3 rounded-2xl text-left transition whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-[color:color-mix(in_srgb,var(--accent-pink)_16%,transparent)] border border-[var(--accent-pink)]"
                    : "bg-bg-button border border-[var(--bg-separator)]"
                }`}
              >
                {section.label}
              </button>
            ))}
          </aside>

          <div className={`p-6 ${isPage ? "" : "overflow-y-auto"}`}>
            {isLoading ? (
              <p className="status-text">Loading admin data...</p>
            ) : (
              <>
                {errorMessage ? (
                  <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
                ) : null}
                {statusMessage ? (
                  <p className="text-sm text-green-600 mb-4">
                    {statusMessage}
                  </p>
                ) : null}

                {activeSection === "amenities" ? (
                  <div className="flex flex-col gap-6">
                    <form
                      onSubmit={handleCreateAmenity}
                      className="place-copy p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-accent-pink" />
                        <p className="font-semibold">Create amenity</p>
                      </div>
                      <input
                        type="text"
                        value={newAmenity.name}
                        onChange={(event) =>
                          setNewAmenity((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Amenity name"
                        required
                        className="w-full"
                      />
                      <textarea
                        value={newAmenity.description}
                        onChange={(event) =>
                          setNewAmenity((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Optional description"
                        rows={3}
                        className="w-full"
                      ></textarea>
                      <button
                        type="submit"
                        className="primary-button py-2 px-4 self-start"
                      >
                        Create
                      </button>
                    </form>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {sortedAmenities.map((amenity) => {
                        const isEditing = editingAmenityId === amenity.id;
                        return (
                          <article
                            key={amenity.id}
                            className="place-copy p-4 flex flex-col gap-3"
                          >
                            {isEditing ? (
                              <>
                                <input
                                  type="text"
                                  value={editingAmenityForm.name}
                                  onChange={(event) =>
                                    setEditingAmenityForm((prev) => ({
                                      ...prev,
                                      name: event.target.value,
                                    }))
                                  }
                                  required
                                  className="w-full"
                                />
                                <textarea
                                  value={editingAmenityForm.description}
                                  onChange={(event) =>
                                    setEditingAmenityForm((prev) => ({
                                      ...prev,
                                      description: event.target.value,
                                    }))
                                  }
                                  rows={3}
                                  className="w-full"
                                ></textarea>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-semibold">
                                      {amenity.name}
                                    </p>
                                    <p className="text-xs text-fg-muted mt-1">
                                      {amenity.id}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => startAmenityEdit(amenity)}
                                    className="icon-chip p-2"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-sm text-fg-muted">
                                  {amenity.description || "No description"}
                                </p>
                              </>
                            )}

                            {isEditing ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAmenityUpdate(amenity.id)
                                  }
                                  className="primary-button py-2 px-4 flex items-center gap-2"
                                >
                                  <Check className="w-4 h-4" />
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAmenityId(null);
                                    setEditingAmenityForm(EMPTY_AMENITY_FORM);
                                  }}
                                  className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                    {sortedAmenities.length === 0 ? (
                      <p className="status-text">No amenities found.</p>
                    ) : null}
                  </div>
                ) : null}

                {activeSection === "users" ? (
                  <div className="flex flex-col gap-4">
                    {sortedUsers.map((user) => {
                      const isEditing = editingUserId === user.id;
                      return (
                        <article
                          key={user.id}
                          className="place-copy p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-sm text-fg-muted">
                                {user.email}
                              </p>
                              <p className="text-xs text-fg-muted mt-1">
                                {user.id}
                              </p>
                            </div>
                            {!isEditing ? (
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/user/${user.id}`}
                                  className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                                >
                                  View
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => startUserEdit(user)}
                                  className="px-4 py-2 border border-[var(--bg-separator)] rounded-full flex items-center gap-2"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUserDelete(user.id)}
                                  className="px-4 py-2 rounded-full bg-red-500 text-white flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>

                          {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={editingUserForm.first_name}
                                onChange={(event) =>
                                  setEditingUserForm((prev) => ({
                                    ...prev,
                                    first_name: event.target.value,
                                  }))
                                }
                                placeholder="First name"
                                className="w-full"
                              />
                              <input
                                type="text"
                                value={editingUserForm.last_name}
                                onChange={(event) =>
                                  setEditingUserForm((prev) => ({
                                    ...prev,
                                    last_name: event.target.value,
                                  }))
                                }
                                placeholder="Last name"
                                className="w-full"
                              />
                              <input
                                type="email"
                                value={editingUserForm.email}
                                onChange={(event) =>
                                  setEditingUserForm((prev) => ({
                                    ...prev,
                                    email: event.target.value,
                                  }))
                                }
                                placeholder="Email"
                                className="w-full md:col-span-2"
                              />
                              <input
                                type="password"
                                value={editingUserForm.password}
                                onChange={(event) =>
                                  setEditingUserForm((prev) => ({
                                    ...prev,
                                    password: event.target.value,
                                  }))
                                }
                                placeholder="New password"
                                className="w-full md:col-span-2"
                              />
                            </div>
                          ) : null}

                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUserUpdate(user.id)}
                                className="primary-button py-2 px-4 flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUserId(null);
                                  setEditingUserForm({
                                    first_name: "",
                                    last_name: "",
                                    email: "",
                                    password: "",
                                  });
                                }}
                                className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                              >
                                Cancel
                              </button>
                              <Link
                                to={`/user/${user.id}`}
                                className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                              >
                                View
                              </Link>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                    {sortedUsers.length === 0 ? (
                      <p className="status-text">No users found.</p>
                    ) : null}
                  </div>
                ) : null}

                {activeSection === "places" ? (
                  <div className="flex flex-col gap-4">
                    {sortedPlaces.map((place) => (
                      <article
                        key={place.id}
                        className="place-copy p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{place.title}</p>
                          <p className="text-sm text-fg-muted">
                            {place.owner_first_name} {place.owner_last_name}
                          </p>
                          <p className="text-sm text-fg-muted">
                            ${place.price}
                          </p>
                          <p className="text-xs text-fg-muted mt-1 break-all">
                            {place.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/place/${place.id}`}
                            className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-place/${place.id}`}
                            className="px-4 py-2 border border-[var(--bg-separator)] rounded-full"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handlePlaceDelete(place.id)}
                            className="px-4 py-2 rounded-full bg-red-500 text-white flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                    {sortedPlaces.length === 0 ? (
                      <p className="status-text">No places found.</p>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
  );

  if (isPage) {
    return <div className="w-full">{panelContent}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
      {panelContent}
    </div>
  );
}
