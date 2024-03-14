const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();//app  para ver el servidor
const mysql = require('mysql');


//Envia  parametros por body
app.use(bodyParser.json());
app.use(cors());


// Iniciar el servidor
app.listen(5000, () => {
    console.log('Nuestro Servidor esta corriendo en el puerto 5000');
    // Llamar a la función para cargar los usuarios cuando se inicie la aplicación
   
});

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DaaNiieeL1',
    database: 'informe4'
});




// Ruta para cerrar sesión 
app.post('/cerrarSesion', (req, res) => {
    connection.end();
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
});

// Ruta para crear un estudiante y guardarlo en la base de datos
app.post('/crearEstudiante', (req, res) => {
    const { nombre, apellido, contrasena, correo, carnet } = req.body;

    // Verifica si el correo ya esta registrado en la base de datos
    connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (errorCorreo, resultadosCorreo) => {
        if (errorCorreo) {
            console.error('Error al verificar el correo en la base de datos:', errorCorreo);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultadosCorreo.length > 0) {
            console.log('Error: El correo ya está registrado');
            res.status(400).json({ mensaje: 'El correo ya está registrado' });
            return;
        }

        // Verifica si el carnet ya esta registrado en la base de datos
        connection.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet], (errorCarnet, resultadosCarnet) => {
            if (errorCarnet) {
                console.error('Error al verificar el carnet en la base de datos:', errorCarnet);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
                return;
            }

            if (resultadosCarnet.length > 0) {
                console.log('Error: El carnet ya está registrado');
                res.status(400).json({ mensaje: 'El carnet ya está registrado' });
                return;
            }

            // Si el correo y el carnet son únicos, insertar el estudiante en la base de datos
            connection.query('INSERT INTO usuarios (nombre, apellido, contrasena, correo, carnet) VALUES (?, ?, ?, ?, ?)', 
                [nombre, apellido, contrasena, correo, carnet], 
                (errorInsert, resultadoInsert) => {
                    if (errorInsert) {
                        console.error('Error al insertar el estudiante en la base de datos:', errorInsert);
                        res.status(500).json({ mensaje: 'Error interno del servidor' });
                        return;
                    }
                    
                    console.log('Estudiante registrado exitosamente');
                    res.status(200).json({ mensaje: 'Estudiante registrado exitosamente' });
                    // Llamar a la función para cargar los usuarios cuando se inicie la aplicación
                 
                }
            );
        });
    });
});


// Array para almacenar los datos de los usuarios
let usuarios = [];

// Función para cargar los datos de la tabla de usuarios en el array
function cargarUsuarios() {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al cargar usuarios desde la base de datos:', error);
            return;
        }

        // Almacenar los resultados en el array de usuarios
        usuarios = results;
        console.log('Usuarios cargados desde la base de datos:', usuarios);
    });
}


// Ruta para cargar usuarios desde la base de datos
app.post('/cargarUsuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al cargar usuarios desde la base de datos:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        // Enviar los resultados de los usuarios al cliente
        res.status(200).json(results);
    });
});


// Función para iniciar sesión utilizando la base de datos
function iniciarSesion(carnet, contrasena, callback) {
    // Consultar la base de datos para encontrar al usuario con el carnet y contraseña proporcionados
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND contrasena = ?';
    connection.query(query, [carnet, contrasena], (error, results) => {
        if (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            return callback(error, null);
        }

        if (results.length > 0) {
            // Usuario encontrado
            return callback(null, 1);
        } else {
            // Usuario y/o Contraseña incorrectos
            return callback(null, 0);
        }
    });
}

// Ruta /iniciarSesion para iniciar sesión utilizando la base de datos
app.post('/iniciarSesion', function (req, res) {
    const carnet = req.body.carnet;
    const contrasena = req.body.contrasena;

    // Llamar a la función para iniciar sesión utilizando la base de datos
    iniciarSesion(carnet, contrasena, (error, val) => {
        if (error) {
            console.error('Ocurrió un error al iniciar sesión:', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        let mensaje = "";

        if (val === 1) {
            mensaje = "Ingresó un Usuario";
        } else {
            mensaje = "Usuario y/o Contraseña son incorrectos, por favor revise e intente de nuevo.";
        }

        // Aquí incluye el tipo de usuario en la respuesta
        res.json({ mensaje: mensaje, tipoUsuario: val });
    });
});

/// Ruta para restablecer contraseña del Estudiante
app.post('/olvidoContrasena', (req, res) => {
    const { carnet, correo, nuevaContrasena } = req.body;

    // Verificar si los datos coinciden con algún estudiante registrado
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND correo = ?';
    connection.query(query, [carnet, correo], (error, resultados) => {
        if (error) {
            console.error('Error al verificar los datos en la base de datos:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultados.length === 0) {
            // No se encontró ningún usuario con los datos proporcionados
            res.status(400).json({ mensaje: 'Los datos proporcionados son incorrectos' });
            return;
        }

        // Actualizar la contraseña del usuario
        const usuario = resultados[0];
        const queryUpdate = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
        connection.query(queryUpdate, [nuevaContrasena, usuario.id], (errorUpdate, resultadoUpdate) => {
            if (errorUpdate) {
                console.error('Error al actualizar la contraseña en la base de datos:', errorUpdate);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
                return;
            }

            // Contraseña actualizada exitosamente
            res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
  
        });
    });
});

// Ruta para validar los datos del estudiante
app.post('/validarDatos', (req, res) => {
    const { carnet, correo } = req.body;
  
    // Verificar si los datos coinciden con algún estudiante registrado
    const query = 'SELECT * FROM usuarios WHERE carnet = ? AND correo = ?';
    connection.query(query, [carnet, correo], (error, resultados) => {
      if (error) {
        console.error('Error al verificar los datos en la base de datos:', error);
        res.status(500).json({ valido: false });
        return;
      }
  
      if (resultados.length === 0) {
        // No se encontró ningún usuario con los datos proporcionados
        res.status(200).json({ valido: false });
      } else {
        // Datos válidos, se encontró un usuario con los datos proporcionados
        res.status(200).json({ valido: true });
      }
    });
  });

// Ruta para modificar un estudiante
app.put('/modificarEstudiante/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, contraseña, correo } = req.body;

    // Verificar si el estudiante existe
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, resultados) => {
        if (error) {
            console.error('Error al buscar estudiante en la base de datos:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return;
        }

        if (resultados.length === 0) {
            // No se encontró ningún estudiante con el ID proporcionado
            res.status(404).json({ mensaje: 'Estudiante no encontrado' });
            return;
        }

        // Actualizar los datos del estudiante (excluyendo el campo del carnet)
        connection.query('UPDATE usuarios SET nombre = ?, apellido = ?, contraseña = ?, correo = ? WHERE id = ?', 
            [nombre, apellido, contraseña, correo, id], 
            (errorUpdate, resultadoUpdate) => {
                if (errorUpdate) {
                    console.error('Error al actualizar estudiante en la base de datos:', errorUpdate);
                    res.status(500).json({ mensaje: 'Error interno del servidor' });
                    return;
                }
                
                // Estudiante actualizado exitosamente
                res.status(200).json({ mensaje: 'Estudiante actualizado exitosamente' });
            }
        );
    });
});

// Ruta para el menú principal
app.get('/menuPrincipal', (req, res) => {
    if (usuarioActivo) {
        // Renderizar la página del menú principal con los datos del estudiante activo
        res.render('menuPrincipal', { 
            mensaje: `Bienvenido, ${usuarioActivo.nombre} ${usuarioActivo.apellido}` 
        });
    } else {
        // Si no hay ningún estudiante activo, redirigir al inicio de sesión
        res.redirect('/iniciarSesion');
    }
});