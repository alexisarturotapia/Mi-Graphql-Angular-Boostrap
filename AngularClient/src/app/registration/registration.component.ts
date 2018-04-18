// src/app/registration/registration.component.ts

import { Component, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

class Registration {
  constructor(
    public firstName: string = "",
    public lastName: string = "",
    public dob: NgbDateStruct = null,
    public email: string = "",
    public password: string = "",
    public country: string = "Seleccione un país"
  ) {}
}

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  // Mantiene una lista de registros
  registrations: Array<any> = [];
  // Mantiene el modelo de registro
  regModel: Registration;
  // Mantiene el estado de visualización del formulario de registro. Por defecto será falso.
  showNew: Boolean = false;
  // Será 'Guardar' o 'Actualizar' en función de la operación.
  submitType: string = "Save";
  // Mantiene el índice de fila de la tabla basado en la selección.
  selectedRow: number;
  // Mantiene una matriz de países.
  countries: string[] = ["MX", "IT", "CL", "VE", "CO", "AR"];

  registrationList: Array<any> = []; // Lista de usuarios

  comments: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.displayRegistrations();
  }

  // Obtener todos los registros
  displayRegistrations() {
  //D1 Solución
    const getRegistrations = gql`
      {
        Registrations {
          id
          firstName
          lastName
          dob
          email
          country
        }
      }
    `;

    this.apollo
      .watchQuery({
        query: getRegistrations,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.Registrations)
      .subscribe(data => {
        this.registrations = data;
      });
  }

  // Este método se asocia al botón nuevo.
  onNew() {
    // Iniciar un nuevo registro.
    this.regModel = new Registration();
    // Cambia submitType a 'Save'.
    this.submitType = "Save";
    // mostrar la sección Bakanosa de entrada de registro.
    this.showNew = true;
  }

  // Este método se asocia al botón Save.
  onSave() {
    var dateVal =
      this.regModel.dob.year.toString() +
      "-" +
      this.regModel.dob.month.toString() +
      "-" +
      this.regModel.dob.day.toString();
    if (this.submitType === "Save") {
      const saveRegistration = gql`
        mutation createRegistration(
          $firstName: String!
          $lastName: String!
          $dob: GQDate!
          $email: String!
          $password: String!
          $country: String!
        ) {
          createRegistration(
            firstName: $firstName
            lastName: $lastName
            dob: $dob
            email: $email
            password: $password
            country: $country
          ) {
            id
            dob
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: saveRegistration,
          variables: {
            firstName: this.regModel.firstName,
            lastName: this.regModel.lastName,
            dob: new Date(dateVal),
            email: this.regModel.email,
            password: this.regModel.password,
            country: this.regModel.country
          }
        })
        .subscribe(
          ({ data }) => {
            this.displayRegistrations();
          },
          error => {
            console.log("Hubo un error al enviar la consulta. Castigaremos al programador", error);
          }
        );

      // Pone el objeto del modelo de registro en la lista de registro.
      // this.registrations.push(this.regModel);
    } else {
      const updateRegistration = gql`
        mutation updateRegistration(
          $id: ID!
          $firstName: String!
          $lastName: String!
          $dob: GQDate!
          $email: String!
          $password: String!
          $country: String!
        ) {
          updateRegistration(
            id: $id
            firstName: $firstName
            lastName: $lastName
            dob: $dob
            email: $email
            password: $password
            country: $country
          ) {
            id
            country
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: updateRegistration,
          variables: {
            id: this.selectedRow + 1,
            firstName: this.regModel.firstName,
            lastName: this.regModel.lastName,
            dob: new Date(dateVal),
            email: this.regModel.email,
            password: this.regModel.password,
            country: this.regModel.country
          }
        })
        .subscribe(
          ({ data }) => {
            console.log("got editdata", data);
            this.displayRegistrations();
          },
          error => {
            console.log("there was an error sending the query", error);
          }
        );
    }
    // Ocultar la sección Bakanosa de entrada de registro.
    this.showNew = false;
  }

  // Este método esta asociada al botón Editar.
  onEdit(index: number) {
    this.selectedRow = index;
    this.regModel = new Registration();
    this.regModel = Object.assign({}, this.registrations[this.selectedRow]);
    const dob = new Date(this.registrations[this.selectedRow].dob);

    this.regModel.dob = {
      day: dob.getDate(),
      month: dob.getMonth() + 1,
      year: dob.getFullYear()
    };

    // Cambiar submitType para Update.
    this.submitType = "Update";
    // Mostra la sección Bakanosa de registro.
    this.showNew = true;
  }

  // Método asociado al boton Eliminar
  onDelete(index: number) {
    const deleteRegistration = gql`
      mutation deleteRegistration($id: ID!) {
        deleteRegistration(id: $id) {
          id
        }
      }
    `;
    this.apollo
      .mutate({
        mutation: deleteRegistration,
        variables: {
          id: index + 1
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("got editdata", data);
          this.displayRegistrations();
        },
        error => {
          console.log("there was an error sending the query", error);
        }
      );
  }

  // Método asociado al botón Cancelar
  onCancel() {
    // Oculat la sección de registro.
    this.showNew = false;
  }

  // Método asociado con el cambio de selección desplegable de Bootstrap. Mi experimento.
  onChangeCountry(country: string) {
    // Asignar el país seleccionado correspondiente al modelo.
    this.regModel.country = country;
  }
}
