import express from 'express'
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();//app  para ver el servidor


//Variables
var estudiantes =[
    { nombre: 'estudiante', apellido: 'username', usuario: 'admin', correo:"prueba@gmail.com",cui:"1234567890" ,fechaNacimiento:"12-04-1999", genero:"Masculino" , contrasena: 'password', numTel:"12345678" }
];
 ;

 //------Funciones-------
 function existeUserEstudiantes(nombreUsuario) {
    let existe = false;
    for (let indice = 0; indice < estudiantes.length; indice++) {
        let estud = estudiantes[indice];
        if (nombreUsuario === estud.usuario) {
            existe = true;
        }
    }
    return existe;
}

function iniciarSesion(usuario, contrasena) {
    /**
     *  Esta funcion busca dentro de los arrays de pacientes  si encuentra una coincidencia de usuario y la contraseña, inciera sesion de lo contrario no. 
     *  estudiantes  = 1
     *  no existe   = 0
     */
    let tipo = 0;
    let temp = null;

    for (let indice = 0; indice < estudiantes.length; indice++) {
        temp = estudiantes[indice];
        if (usuario === temp.usuario && contrasena === temp.contrasena) {
            tipo = 1;
            usuarioActivo = temp;
        }
    }
    return tipo;
}

/**
 *  ENDPOINTS PARA EL MANEJO DE PACIENTES
 */
app.post('/guardarEstudiantesArreglo', function (req, res) {
    /**
     *  Este endpoint agrega un usuario al array de pacientes
     */
    const usuario = req.body.usuario;
    if (!existeUserEstudiantes(usuario)) {
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const usuario = req.body.usuario;
        const fechaNacimiento = req.body.fechaNacimiento;
        const genero = req.body.genero;
        const contrasena = req.body.contrasena;
        const numTel = req.body.numTel;
        const activo = 1;
        if (contrasena.length >= 8) {
            estudiantes.push({ nombre, apellido, usuario, fechaNacimiento, genero, contrasena, numTel , activo});
            res.json({ mensaje: "Ingresado al arreglo el Estudiante= " + nombre + ",usuario= " + usuario });
        } else {
            res.json({ mensaje: "La contraseña debe tener al menos 8 caracteres, Intente de Nuevo" });
        }

    } else {
        res.json({ mensaje: "El usuario: " + usuario + " ya existe" });
    }
});

app.post('/mostrarEstudiantes', function (req, res) {
    const usuario = req.body.usuario;
    let estud = { usuario: null };
    let temp = null;

    for (let indice = 0; indice < estudiantes.length; indice++) {
        temp = estudiantes[indice];
        if (temp.usuario === usuario) {
            estud = temp;
        }
    }
    res.json(estud);
});


app.get('/recorrerArregloEstudiantes', function (req, res) {     // se ve en la consola del servidor
    console.log("Info almacenada en el  arreglo: ");
    let estud;
    for (let indice = 0; indice < estudiantes.length; indice++) {
        estud = estudiantes[indice];
        console.log("---> " + indice + " Nombre: " + estud.nombre + ", Apellido: " + estud.apellido);
    }
    res.json(estudiantes);

});

app.post('/modificarEstudiantes', function (req, res) {
    let usu = req.body.usuario;
    for (let indice = 0; indice < estudiantes.length; indice++) {
        let estud = estudiantes[indice];
        if (usu == estud.usuario) {
            estud.nombre = req.body.nombre;
            estud.apellido = req.body.apellido;
            estud.fechaNacimiento = req.body.fechaNacimiento;
            estud.contrasena = req.body.contrasena;
            estud.numTel = req.body.numTel;
        }
    }
    res.json({ mensaje: "Usuario= " + usu + " modificado Exitosamente" });
});

/**
 *  ENDPOINTS PARA MANEJO DE LOS SITIOS
 */
app.get('/cerrarSesion', function (req, res) {     // se ve en la consola del servidor    
    usuarioActivo = null;
    res.json({ mensaje: "se cerro sesion exitosamente" });
});

app.post('/iniciarSesion', function (req, res) {    
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    let val = iniciarSesion(usuario, contrasena);

    let mensaje = "";

    if (val === 1) {
        mensaje = "Ingresó un Estudiante";
    } else {
        mensaje = "Usuario y/o Contraseña son incorrectos, por favor revise e intente de nuevo.";
    }

    // Aquí incluye el tipo de usuario en la respuesta
    res.json({ mensaje: "----Bienvenido---" + mensaje, tipoUsuario: val });
});


//Para poner nombre y apellido en la Url
app.get('/conParametros/:nombre/:apellido', function(req,res){
    const nombre = req.params.nombre;
    const apellido = req.params.apellido;
    res.send("Bienvenido: "+nombre+" "+apellido);
});

//Para poner nombre y apellido pero oculto
app.get('/conBody', function(req,res){
    const nombre = req.body.nombre;
    const apellido= req.body.apellido;

    res.send("Bienvenido: "+nombre+" "+apellido);
});


//Es un Post donde Guardamos la informacion
app.post('/guardarArreglo', function(req,res){
    const nombre = req.body.nombre;
    const apellido= req.body.apellido;
    const usuario = req.body.usuario;
    const fechaNacimiento = req.body.fechaNacimiento;
    const genero = req.body.genero;
    const contrasena = req.body.contrasena;
    const numTel = req.body.numTel;
    
    estudiantes.push({nombre:nombre, apellido:apellido, usuario:usuario, fechaNacimiento:fechaNacimiento, genero:genero, contrasena:contrasena, numTel:numTel});

    res.send("Ingresado al Arreglo: "+nombre+" "+usuario);
});

//Buscamos si Existe el Paciente si no, se Envia una mensaje.
app.get('/buscarIndice', function(req,res){
    const id = req.body.id;
    
    if(id>=0 && id<estudiantes.length){
        var estudiantesTemp = estudiantes[id];
        res.status(200).json(estudiantesTemp);
    }else{
        res.send("El Usaurio no existe.");
   }
});

app.get('/recorrerArreglo', function(req,res){
    let estudiantesTemp;
    console.log("------Inicio del Arreglo----")
    
    for(let id=0; id<pacientes.length; id++){
        estudiantesTemp = estudiantes[id];  
        console.log("-->"+estudiantesTemp.usuario+" "+estudiantesTemp.nombre+" "+estudiantesTemp.apellido+" "+estudiantesTemp.genero+" "+estudiantesTemp.fechaNacimiento+" "+estudiantesTemp.numTel);
   }
   console.log("------Fin del Arreglo----")
   res.send("Recorrido Exitosamente");
});

app.listen(5000, ()=>{
    console.log('El servidor ha iniciado')
});

app.get('/', (req, res)=>{
    res.end('<h1>Hello World</h1>');
});
