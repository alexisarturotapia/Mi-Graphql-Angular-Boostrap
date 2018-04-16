// schema.js

const schema = `
# declaro un scalar personalizado para la fecha como GQDate
scalar GQDate

# tipo Registration
type Registration {
    id: ID!
    firstName: String
    lastName: String
    dob: GQDate
    email: String
    password: String
    country: String
}

type Query {
    # Return a registration by id
    Registration(id: ID!): Registration
    # Return all registrations
    Registrations(limit: Int): [Registration]
}

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
