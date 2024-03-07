import express from 'express'

const app = express();

app.listen(5000, ()=>{
    console.log('El servidor ha iniciado')
});

app.get('/', (req, res)=>{
    res.end('<h1>Hello World</h1>');
});