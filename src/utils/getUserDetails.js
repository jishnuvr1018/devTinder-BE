const getUserDetails = async (user) => {
  const FieldsToShow = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "skills",
    "about",
  ];
  const userData = Object.fromEntries(
    FieldsToShow.map((field) => [field, user[field]]),
  );

  return userData;
};

module.exports = { getUserDetails };
