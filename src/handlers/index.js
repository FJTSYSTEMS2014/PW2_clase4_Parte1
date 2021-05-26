// importamos libreria
const express = require ('express');
const app_Routing = express.Router ();
// importamos DB
const database=require("../database");
// mostrar todos los datos
app_Routing.get ('/api/user', (req, res) => {
    res.json (
      database.DB,
    );
  });
  // metodo post
  app_Routing.post ('/api/user', (req, res) => {
    if (req.body.name == null || req.body.age == null) {
      res.status (404).send ({Observaciones: `faltan datos`});
    } else {
      if (isNaN (req.body.age)) {
        res.status (409).send ({
          Observaciones: `la edad ingresada: - ${req.body.age} - No es un numero`,
        });
        console.info (` el valor de age no es un numero`);
      }
      if (req.body.age > 119 || req.body.age < 18) {
        res.status (409).send ({
          Observaciones: ` la edad: - ${req.body.age} - no es mayor a 18 y menor a 120`,
        });
      } else {
        // agregamos los datos del body - del archivo raw json
        const user = {
          name: req.body.name,
          age: req.body.age,
  
        };
  
        // para ver si hay alguien con el mismo nombre hacemos una validacion
        // pasamos todo a minusculas con el tolowerCase y sacamos los espacion con trim
        // y lo comparamos con el usario que estamos creando (comparamos item con usuario)
        const userName = user.name.toLowerCase ().trim ();
        if (database.DB.some (item => item.name.toLowerCase ().trim () === userName)) {
          //aca teremos un conflicto : error 409
          res.status (409).send ({
            Observaciones: `El usuario con Nombre: - ${user.name} - ya existe en la base de datos`,
          });
        } else {
          //agregamos el id desde database
          database.add(user);
          // agreamos esos datos a la base de datos y lo mandamos a POSTMAN.
          //database.DB.push (user);
          res.json ({
            user,
          });
        }
      }
    }
  });
  //buscar por userID
  app_Routing.get ('/api/user/:userID', (req, res) => {
    // Con parseInt pasammso el valor de ID a numero
    const userID = parseInt (req.params.userID);
    // hay que elegir el primer usuario
    //filter devuelve lo que coincide con item.id===userID)
    const user = database.DB.filter (item => item.id === userID)[0];
  
    if (user) {
      res.json (user);
    } else {
      // si no esta el userID le indicamos error 404
      res.status (404).send ({
        Observaciones: `El usuario con ID: ${userID} no existe en la base de datos`,
      });
    }
  });
  
  // metodo actualizar
  app_Routing.put ('/api/user/:userID', (req, res) => {
    if (isNaN (req.body.age)) {
      res.status (409).send ({
        Observaciones: `la edad ingresada: - ${req.body.age} - No es un numero`,
      });
      console.info (` el valor de age no es es un numero`);
    }
    if (req.body.age > 119 || req.body.age < 18) {
      res.status (409).send ({
        Observaciones: ` la edad: - ${req.body.age} - no es mayor a 18 y menor a 120`,
      });
    } else {
      // paso a numero el userID que llego pro parametro
      const userID = parseInt (req.params.userID);
  
      const userName = req.body.name.toLowerCase ().trim ();
      const user = database.DB.find (item => item.id === userID);
  
      if (user) {
        // si existe el iD luego se verifica si ya esta en la base de datos el nombre a actualizar
        if (database.DB.some (item => item.name.toLowerCase ().trim () === userName)) {
          //aca teremos un conflicto : error 409
          res.status (409).send ({
            Observaciones: `El usuario con Nombre: - ${userName} - ya existe en la base de datos`,
          });
        } else {
          user.name = req.body.name;
          user.age = req.body.age;
          user.tdateModified = new Date ();
          res
            .status (200)
            .send ({Observaciones: ` Los datos modificados son: `, user});
        }
      } else {
        res.status (404).send ({
          Observaciones: `El usuario con ID: ${userID} no existe en la base de datos`,
        });
      }
    }
  });
  
  app_Routing.delete ('/api/user/:userID', (req, res) => {
    // el dato de id del body l paso a numero
    const userID = parseInt (req.params.userID);
    // buscamos el dato dentro de la base de datos.
    // el findindex cuando (item)=>item.id===userID) devuelva true
    // se detiene y devuelve ese elemento
    const userIndex = database.DB.findIndex (item => item.id === userID);
    // findIndex devuelve -1 si no lo encuentra. 0 si lo encuentra
    if (userIndex > -1) {
      // usamos splice para remover el id especifico
      database.DB.splice (userIndex, 1);
      res.json ({Observaciones: `El usuario con ID: ${userID} fue eliminado`});
    } else {
      res.status (404).send ({
        Observaciones: `El usuario con ID: ${userID} no puede ser eliminado`,
      });
    }
  });
  
  //ordenar por nombre de A --> Z
  app_Routing.get ('/api/userName', (req, res) => {
    console.log ('Mostrar BD por nombre de: A --> Z');
    function comparacion (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }
  
    res.json (database.DB.sort (comparacion));
    console.log (database.DB.sort (comparacion));
  });
 
module.exports=app_Routing;