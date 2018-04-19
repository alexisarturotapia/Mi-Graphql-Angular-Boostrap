// resolvers.js
//Piensarlo como que el Schema es una interfaz en Java y el resolver es la implementación de la interfaz.
//Fuente para aprender a hacerlo: http://graphql.org/

const { GraphQLScalarType } = require("graphql");

function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()), d.getFullYear()].join("/");
}

// defíno Date scalar type.

const GQDate = new GraphQLScalarType({
  name: "GQDate",
  description: "Date type",
  parseValue(value) {
    // el valor proviene del cliente
    return value; // envío al resolvers
  },
  serialize(value) {
    // el valor proviene del resolvers
    return value; // envío al cliente
  },
  parseLiteral(ast) {
    // el valor proviene del cliente
    return new Date(ast.value); // envío al resolvers
  }
});

// almacen de datos con datos por defecto
// se puede sustituir por un conector wrapper de rest api o algún motor de DB.
// Por ejemplo Apollo Engine o Apollo Server
const registrations = [
  {
    id: 1,
    firstName: "Jonatan",
    lastName: "Hernandez",
    dob: new Date("2014-08-31"),
    email: "jhernandezhh@ferreteria.cl",
    password: "j123",
    country: "MX"
  },
  {
    id: 2,
    firstName: "Vittorio",
    lastName: "Bertolini",
    dob: new Date("1981-11-24"),
    email: "vbertolini@ferreteria.cl",
    password: "v123",
    country: "IT"
  },
  {
    id: 3,
    firstName: "Falopa",
    lastName: "Parka",
    dob: new Date("1991-09-02"),
    email: "hflopezs@ferreteria.cl",
    password: "f123",
    country: "CL"
  }
];

const resolvers = {
  //la R de mi CRUD
  Query: {

    Registrations: () => registrations, // retorna todos los registros

    Registration: (_, { id }) =>
      registrations.find(registration => registration.id == id) // retorna registros por id
  },
  //el CUD de mi CRUD
  Mutation: {
    // crea nuevo registro
    createRegistration: (root, args) => {
      // obtengo el siguiente id de registro
      const nextId =
        registrations.reduce((id, registration) => {
          return Math.max(id, registration.id);
        }, -1) + 1;
      const newRegistration = {
        id: nextId,
        firstName: args.firstName,
        lastName: args.lastName,
        dob: args.dob,
        email: args.email,
        password: args.password,
        country: args.country
      };
      // sumo registro a la colección
      registrations.push(newRegistration);
      return newRegistration;
    }, // borro registro por id
    deleteRegistration: (root, args) => {
      // busco registro por id
      const index = registrations.findIndex(
        registration => registration.id == args.id
      );
      // borro registro por indice
      registrations.splice(index, 1);
    }, // actualizo registro
    updateRegistration: (root, args) => {
      // busco registro por id
      const index = registrations.findIndex(
        registration => registration.id == args.id
      );
      registrations[index].firstName = args.firstName;
      registrations[index].lastName = args.lastName;
      registrations[index].dob = args.dob;
      registrations[index].email = args.email;
      registrations[index].password = args.password;
      registrations[index].country = args.country;
      return registrations[index];
    }
  },
  GQDate
};

module.exports.Resolvers = resolvers;
