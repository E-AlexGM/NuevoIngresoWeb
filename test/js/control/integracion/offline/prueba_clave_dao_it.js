import * as chai from "../../../lib/chai/index.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";

mocha.setup("bdd");

describe("PruebaClaveDAO Integration Tests - Offline", function () {
  let cut;
  // UUIDs falsos para simular el comportamiento con el servidor apagado
  const dummyPruebaId = "123e4567-e89b-12d3-a456-426614174000";
  const dummyClaveId = "987f6543-e21b-73d3-b654-987614174111";

  before(function () {
    // Se inicializa pasando el idPrueba requerido por el constructor del DAO
    cut = new PruebaClaveDAO(dummyPruebaId);
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const pruebaClaveInvalida = { nombreClave: null }; 
      cut
        .create(pruebaClaveInvalida)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: findRange()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut
        .findRange(0, 10)
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: findById()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut
        .findById(dummyClaveId)
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: delete()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut
        .delete(dummyClaveId)
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });
});

mocha.run();