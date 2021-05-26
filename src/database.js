// movimos la base de datos desde server
let id = 0,
  name = 'null',
  age = null,
  tdateCreated = null,
  tdateModified = null;
const DB = [{ name, age,id: 0, tdateCreated, tdateModified}];
// debemos exportar DB
module.exports = {
  DB,
  add (user) {
    id++;
    user.id = id;
    (user.tdateCreated = new Date ()), 
    (user.tdateModified ='no modificado'), 
      
      //pusheamos a nuestra base de datos
    DB.push (user);
  },
};
