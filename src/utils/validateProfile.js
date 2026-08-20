const validateProfile = async (data) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "photoUrl",
    "gender",
    "skills",
    "about",
  ];

  const isValid = Object.keys(data).every((field) =>
    allowedFields.includes(field),
  );

  if (!isValid) {
    throw new Error("Invalid fields for update");
  }
  return true;
};

module.exports = { validateProfile: validateProfile };
