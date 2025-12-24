import { users } from "../../mock-db/users.js";

export const getUsers = (req, res) => {
  res.status(200).json(users);
  //   console.log(res);
};

export const deleteUser = (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    res.status(200).send(`User with ID ${userId} deleted ✅`);
  } else {
    res.status(404).send("User not found.");
  }
};

export const createUser = (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: String(users.length + 1),
    name: name,
    email: email,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};
