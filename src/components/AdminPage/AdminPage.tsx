import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import Menu from "../Menu/Menu";
import EditUserModal from "./EditUserModal";
import "./EditUserModal.scss";
import "./UserList.scss";
import call from "../../assets/call.png";
import deleteIcon from "../../assets/delete.png";
import email from "../../assets/email.png";
import loader from "../../assets/loading.png";
import edit from "../../assets/edit.png";
import { UserData } from "../user-data/UserData";
import { adminItems } from "../Menu/MenuItem";
import "../user-data/loader.scss";

const AdminPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const fetchUsers = async (): Promise<UserData[]> => {
    const url =
      "https://rolereact-f4a63-default-rtdb.firebaseio.com/users.json";
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Network Issues");
    }

    const data = await res.json();
    console.log(data);
    return Object.values(data);
  };

  const deleteUser = async (email: string, token: string) => {
    try {
      const res = await fetch(
        `https://rolereact-f4a63-default-rtdb.firebaseio.com/users.json?auth=${token}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userId = Object.keys(data).find((key) => data[key].email === email);

      if (!userId) {
        throw new Error("User not found");
      }

      const deleteUrl = `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`;
      const deleteRes = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!deleteRes.ok) {
        throw new Error("Failed to delete user");
      }

      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUpdateUser = async (updatedUser: UserData) => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      Swal.fire("Error!", "Authentication token is missing.", "error");
      return;
    }

    try {
      const userId = updatedUser.id;
      const updateUrl = `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`;

      const res = await fetch(updateUrl, {
        method: "PATCH",
        body: JSON.stringify({
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          password: updatedUser.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? updatedUser : user))
        );
        Swal.fire("Success!", "User updated successfully.", "success");
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error!", "Failed to update user.", "error");
    } finally {
      setIsModalOpen(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <img src={loader} alt="Loading..." />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (email: string) => {
    const auth = getAuth();

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No valid authentication token");
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#D1B06B",
        cancelButtonColor: "#d7d7d7",
        confirmButtonText: "Yes, delete it!",
        background: "#1F2732",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteUser(email, token);
            setUsers(users.filter((user) => user.email !== email));
            Swal.fire("Deleted!", "User has been deleted.", "success");
          } catch (error) {
            Swal.fire(
              "Error!",
              "There was an error deleting the user.",
              "error"
            );
          }
        }
      });
    } catch (error) {
      console.error("Error getting token or deleting user:", error);
      Swal.fire("Error!", "Unable to retrieve authentication token.", "error");
    }
  };

  return (
    <div className="admin-page-wrap">
      <Menu menuItems={adminItems} />
      <div className="container">
        <div className="user-data-listing">
          <section className="user-data-wrap">
            <div className="container">
              <div className="user-data">
                <div className="product-search">
                  <input
                    type="text"
                    placeholder="Please search here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <ul className="user-listing">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <li key={user.email}>
                        <div className="listing-wrap">
                          <h2>{user.fullname}</h2>

                          <div className="phone-call">
                            <div className="call-img">
                              <img src={call} alt="call-img" />
                            </div>
                            <a href={`tel:${user.phone}`}>{user.phone}</a>
                          </div>

                          <div className="email-call">
                            <div className="email-img">
                              <img src={email} alt="email-img" />
                            </div>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </div>
                        </div>
                        <div className="actions-btn">
                          <div
                            className="edit-btn"
                            onClick={() => handleEditUser(user)}
                          >
                            <img src={edit} alt="edit" />
                          </div>
                          <div
                            className="delete-user"
                            onClick={() => handleDeleteUser(user.email)}
                          >
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>No users found</p>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default AdminPage;
