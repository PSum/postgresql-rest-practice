require('dotenv').config();
const express = require('express')
const pool = require('./db/pool')
const port = 3000

const app = express()
app.use(express.json())

//routes
//app.get("/", (req, res) => {
//    res.send({name: "jon", age: 14})
//})

app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM schools')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/findSchool', async (req, res) => {
    const location = req.query.location;
    // possible search query:
    // localhost:3000/findSchool?location=Heitersheim
    try {
        const data = await pool.query('SELECT * FROM schools WHERE address = $1', [location]);
        res.status(200).send(data.rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.post('/', async (req, res) => {
    // possible post request with possible body:
    // localhost:3000/
    // {
    //     "name":"Friedensschule",
    //     "location": "Duesseldorf"
    // }
    const { name, location } = req.body
    try {
        await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, location])
        res.status(200).send({ message: "Successfully added child" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/setup', async (req, res) => {
    try {
        await pool.query(
          "CREATE TABLE schools( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))"
        );
        res.status(200).send({ message: "Successfully created table" });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get("/deleteAll", async (req,res) => {
    try{
        await pool.query(
            "DELETE FROM schools"
        );
        res.status(200).send({
            message: "Sucessfully deleted all the content"
        });
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))