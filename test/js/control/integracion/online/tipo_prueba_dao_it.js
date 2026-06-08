import * as chai from "../../../lib/chai/index.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";

mocha.setup("bdd");

describe("TipoPruebaDAO Integration Tests - Online", function () {
  let cut;
  let idCreado;

  before(function () {
    cut = new TipoPruebaDAO();
  });

  it("Debe crear una instancia de TipoPruebaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(TipoPruebaDAO);
  });

  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos del tipo prueba creado", function (done) {
      const tipoPrueba = { valor: "Tipo Prueba de Prueba", activo: true };
      cut
        .create(tipoPrueba)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;
          chai.expect(response.datos.location).to.exist;
          idCreado = response.datos.id;
          chai.expect(idCreado).to.exist;
          done();
        })
        .catch(done);
    });

    it("Debe rechazar leyendo el header Process-Error cuando falla la creación (500)", function (done) {
      const tipoPruebaInvalido = { valor: null };
      cut
        .create(tipoPruebaInvalido)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al crear los datos: 500");
          done();
        })
        .catch(done);
    });

  });

  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de tipos", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response.datos).to.have.length.above(1);
          done();
        })
        .catch(done);
    });

    it("Debe rechazar si se mandan parámetros inválidos", function (done) {
      cut
        .findRange(-1, -5)
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al obtener los datos: 400");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar error al parsear los datos al consultar un rango", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto"));
      };

      cut
        .findRange(0, 10)
        .then(() => {
          Response.prototype.json = originalJson;
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          Response.prototype.json = originalJson;

          try {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include(
                "Error al parsear los datos: Simulado: JSON corrupto",
              );
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: update()", function () {
    it("Debe actualizar el tipo prueba creado y retornar un DefaultResponse con los datos actualizados", function (done) {
      const tipoActualizado = { valor: "Tipo Prueba Actualizada", activo: false };
      cut
        .update(idCreado, tipoActualizado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("idTipoPrueba");
          chai.expect(response.datos).to.have.property("valor");
          chai.expect(response.datos.idTipoPrueba).to.equal(idCreado);
          chai.expect(response.datos.valor).to.equal("Tipo Prueba Actualizada");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar al intentar actualizar un tipo que no existe", function (done) {
      const tipoInexistente = { valor: "Tipo Inexistente" };
      cut
        .update("123e4567-e89b-12d3-a456-426614174999", tipoInexistente)
        .then(() => {
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al modificar los datos: 404");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar al intentar actualizar con datos inválidos", function (done) {
      const tipoInvalido = { valor: null };
      cut
        .update(idCreado, tipoInvalido)
        .then(() => {
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al modificar los datos: 500");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar error al parsear los datos al actualizar", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto"));
      };

      const tipoActualizado = { valor: "Tipo Prueba Actualizada" };
      cut
        .update(idCreado, tipoActualizado)
        .then(() => {
          Response.prototype.json = originalJson;
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          Response.prototype.json = originalJson;

          try {
            chai.expect(error).to.have.property("mensaje");
            chai
              .expect(error.mensaje)
              .to.include(
                "Error al parsear los datos: Simulado: JSON corrupto",
              );
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: delete()", function () {
    it("Debe eliminar el tipo prueba creado", function (done) {
      cut
        .delete(idCreado)
        .then(() => {
         done();
        })
        .catch(done);
    });

    it("Debe rechazar al intentar eliminar un tipo que no existe", function (done) {
      cut
        .delete("123e4567-e89b-12d3-a456-426614174999")
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al eliminar los datos: 404");
          done();
        })
        .catch(done);
    });
  });
});

mocha.run();
