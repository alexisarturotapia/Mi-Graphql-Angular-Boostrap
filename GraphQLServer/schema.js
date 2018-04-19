// schema.js

const schema = `
# declaro un scalar personalizado para la fecha como GQDate
scalar GQDate

# tipo Registration
# Pensarlo como una tabla
type Registration {
    id: ID!
    firstName: String
    lastName: String
    dob: GQDate
    email: String
    password: String
    country: String
}

# Pensarlo como los "R" de un CRUD.
type Query {
    # Devuelve un registration por id
    Registration(id: ID!): Registration
    # Devuelve todos los registrations
    Registrations(limit: Int): [Registration]
}

# Pensarlo como los "CUD" de un CRUD.
type Mutation {
    # Crear un registro
    createRegistration (firstName: String,lastName: String, dob: GQDate, email: String, password: String, country: String): Registration
    # Actualizar un registro
    updateRegistration (id: ID!, firstName: String,lastName: String, dob: GQDate, email: String, password: String, country: String): Registration
    # Borrar un registro
    deleteRegistration(id: ID!): Registration
}
`;

module.exports.Schema = schema;
