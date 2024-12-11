export function selectTableAttribute(data, requiredColumns) {
  return data.map((user) => {
    const filteredUser = {};
    requiredColumns.forEach((column) => {
      if (user.hasOwnProperty(column)) {
        filteredUser[column] = user[column];
      }
    });
    return filteredUser;
  });
}
