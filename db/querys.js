
const pgPool = require("./pool")

const pushUser = async (user) => {
    await pgPool.query(
        "INSERT INTO users (forename, surname, email, password, role_id) VALUES ($1, $2, $3, $4, $5);",
        [user.forename, user.surname, user.email, user.password, user.role_id]
      );
      
}

const pushNewMessage = async (newMessage, user) => {
    await pgPool.query("INSERT INTO messages (title, date, user_id, message) VALUES ($1, NOW()::date, $2, $3);",
        [newMessage.title, user.id, newMessage.message])
}

const getUserCredentials = async (email) => {
    const {rows} = await pgPool.query("SELECT id, email, password FROM users WHERE email = $1",
        [email]);
    return rows[0];
}

const getUserById = async (id) => {
    const {rows} = await pgPool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (rows.length === 0) {
        console.log("Kein Benutzer mit dieser ID gefunden.");
        return null;
    }
    return rows[0];
};


const updateUserRoleToMember = async (user_id) => {
    await pgPool.query("UPDATE users SET role_id = 2 WHERE id = $1", [user_id]);
}

const getAllMessages = async () => {
    const {rows} = await pgPool.query("SELECT m.id, m.title, m.message, TO_CHAR(m.date, 'DD/MM/YYYY') as date, u.forename, u.surname FROM messages as m JOIN users as u ON m.user_id = u.id");
    return rows;
}

const deleteMessage = async (id) => {
    await pgPool.query("DELETE FROM messages WHERE id = $1", [id]);
}

const getAllMemberCodes = async () => {
    const {rows} = await pgPool.query("SELECT code FROM member_codes;")
    return rows;
}

const getMemberCodeIdByCode = async (code) => {
    const {rows} = await pgPool.query("SELECT id FROM member_codes WHERE code = $1", [code]);
    return rows[0].id;
}

const removeMemberCode = async (id) => {
    await pgPool.query("DELETE FROM member_codes WHERE id = $1", [id]);
    await addNewMemberCode()
}

const addNewMemberCode = async () => {
    await pgPool.query("INSERT INTO member_codes (code) VALUES (DEFAULT)")
}

module.exports = {pushUser, getUserCredentials, getUserById, pushNewMessage, getAllMessages, deleteMessage, getAllMemberCodes, getMemberCodeIdByCode, removeMemberCode, updateUserRoleToMember}