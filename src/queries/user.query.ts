const createUser = `
INSERT INTO user_info (firstName, lastName, email, password, salt, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING id, email
`;

const findUserByEmail = `
SELECT * FROM user_info WHERE email = $1
`;

const userQueries = {
    createUser,
    findUserByEmail
};

export default userQueries;
