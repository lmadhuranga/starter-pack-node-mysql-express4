const express = require('express');
const app = express();
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'laravel_movie_manager'
});

// connect to database
mc.connect();
 
// Enable All CORS Requests
app.use(cors())

// Get all 
app.get('/qualities', function (req, res) {
    mc.query("SELECT * FROM `qualities`;", function (error, results, fields) {
        if (error) throw error; 
        return res.send(results);
    });
});

// Get all 
app.get('/movies', function (req, res) {
    mc.query("SELECT * FROM `movies`;", function (error, results, fields) {
        if (error) throw error; 
        return res.send(results);
    });
});

// Get details
app.get('/movie/:id', function (req, res) {
        
    let movieId = req.params.id;
    
    if (!movieId) {
        return res.status(400).send({ error:true, message: 'Please provide details' });
    }
    // get current count 
    mc.query("SELECT * FROM movies WHERE id=" +movieId, function (error, results, fields) {
        if(results.length > 0){
            return res.send(results[0]);
        }
        return res.send({});
    }); 
});
  
// udpate
app.put('/movie/:id', function (req, res) {
    let movie = req.body;
    let movieId = req.params.id;
    mc.query(`UPDATE movies SET name='${movie.name}',quality='${movie.quality}',path='${movie.path}',downloads='${movie.downloads}',details='${movie.details}' WHERE id=${movieId}`,
    (error, results, fields) => {
        if (error) throw error;
        return res.send(results);
    });
});

// Add new requiret
app.post('/movie', function (req, res) {
    let movie = req.body;
    mc.query(`INSERT INTO movies ('id', 'name', 'quality', 'path', 'downloads', 'details')",
    "VALUES (null, '${movie.name}', '${movie.quality}', '${movie.path}', '${movie.downloads}', null);`,
    (error, results, fields) => {
        if (error) throw error;
        return res.send({ error: false, data: header_count, message: 'Added requites Succsfully' });
    });
});

// Deleted
app.delete('/movie/:id', function (req, res) {
    let movieId = req.params.id;
    mc.query(`DELETE FROM movies WHERE id=${movieId}`,
    (error, results, fields) => {
        if (error) throw error;
        return res.send({id:movieId, message:'Deleted Movie'});
    });
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(3001, function () {
    console.log('Node app is running on port 3001');
});
