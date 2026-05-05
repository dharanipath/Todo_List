const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json()); // server parse the Stringfy incoming data to json

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'todo'
})
db.connect((err) => {
    if(err){
        console.log("error in connecting db",err);
        return;
    }
    console.log("connected to db");
});

app.get('/get-tasks',(req,res) => {
    const userId = req.query.user_id; // Assuming user_id is sent in the request query
    db.query(`select * from todo_list where user_id = ? order by id DESC`, [userId],(err,results) => {
        if(err){
            console.log(err);
            res.send("Error in fetching tasks", err);
            return;
        }
        res.json(results);
    })
})

app.post('/save-task',(req,res) =>{
    db.query(`insert into todo_list(task_name, user_id) values(?, ?)`, 
        [req.body.task_name, req.body.user_id],(err,results) => {
        if(err){
            res.json({ error: 'Error in adding task', details: err });
            console.log(err);
            return;
        }
        res.json({ message: 'Task added successfully.', task: req.body.task_name, user_id: req.body.user_id });
    })
})

// Update task
app.put('/update-task',(req,res) =>{
    db.query(`update todo_list set task_name = ? where id = ?`, 
        [req.body.task_name, req.body.id],(err,results) => {
        if(err){
            res.json({ error: 'Error in updating task', details: err });
            return;
        }
        res.json({ message: 'Task updated successfully.', id: req.body.id });
    })
})

// Delete task
app.delete('/delete-task',(req,res) =>{
    db.query(`delete from todo_list where id = ?`,[req.body.id],(err,results) => {
        if(err){
            res.json({ error: 'Error in deleting task', details: err });
            return;
        }
        res.json({ message: 'Task deleted successfully.', id: req.body.id });
    })
})

app.delete('/delete-multiple-tasks',(req,res) =>{
    db.query(`delete from todo_list where id IN (${req.body.ids.join(',')})`,(err,results) => {
        if(err){
            res.json({ error: 'Error in deleting tasks', details: err });
            return;
        }
        res.json({ message: 'Tasks deleted successfully.', ids: req.body.ids });
    })
})

app.post('/get-user',(req,res) => {
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [req.body.email, req.body.password],(err,results) => {
        if(err){
            console.log(err);
            res.json({ error: 'Error in fetching user', details: err });
            return;
        }
        if(results.length === 0){
            res.json({ error: 'User not found' });
            return;
        }
        console.log("User found:", results[0]);
        res.json({ message: 'User found successfully.', user: results[0] });
    })
})

app.post('/save-user',(req,res) => {
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [req.body.name, req.body.email, req.body.password], (err, results) => {
        if(err){
            console.log(err);
            res.json({ error: 'Error in adding user', details: err });
            return;
        }
        res.json({ message: 'User added successfully.', user: req.body });
    });
});

app.listen(3000,() => {
    console.log('server started running on 3000');
})