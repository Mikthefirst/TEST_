const Pool = require('pg').Pool;
const pdfCreate = require('./pdf');
const db = new Pool({
    user: "postgres",
    password: "246753981",
    host: "localhost",
    port: 5432,
    database: "Test-task"
});

//class that perform crud operations with user
class UserCrudOperations{
    async createUser([req, img]) {
        const { name, surname, mail } = req.body;
        const pdf = await pdfCreate(name, surname, img);
        const user = await db.query('INSERT INTO "user" VALUES ($1, $2, $3, $4, $5) RETURNING * ', [mail, name, surname, img, pdf]);
        if (user.rows[0]) 
            return true;
        return false;
    }
    async getUser(mail) {
        console.log(`mail: ${mail}`);
        const user = await db.query('SELECT * FROM "user" WHERE email = $1', [mail]);
        if (user.rows.length!=0) 
            return true;
        return false;
    }
    async deleteUser(mail) {
        await db.query('DELETE FROM "user" WHERE email = $1', [mail]);
    }
    async updateUser(req) {
        const { name, surname, mail } = req.body;
        const img = req.file.filename;
        const pdf = await pdfCreate(name, surname, img);
        const user = await db.query('UPDATE "user" set email = $1, firstName = $2, lastName = $3, image = $4, pdf = $5  WHERE email = $1 RETURNING *', [mail, name, surname, img, pdf]);
        if (user.rows[0]) 
            return true;
        return false;
    }
}
//{email}, {firstName}, {lastName}, {image}, {pdf}
module.exports = new UserCrudOperations();