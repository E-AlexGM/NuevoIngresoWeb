import * as chai from "../../../lib/chai/index.js";
import PruebaJornadaAulaAspiranteOpcionExamenDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionExamen from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion_examen.js";

mocha.setup("bdd");

describe("PruebaJornadaAulaAspiranteOpcionExamenDAO - Offline Tests (Servidor Apagado)", function () {
  let cut;
  const idFicticio = "123e4567-e89b-12d3-a456-426614174000";

  before(function () {
    cut = new PruebaJornadaAulaAspiranteOpcionExamenDAO(idFicticio, idFicticio, "LAB-0000", idFicticio);
  });

  describe("Method: create()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const registro = new PruebaJornadaAulaAspiranteOpcionExamen();
      cut.create(registro)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: findById()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut.findById("")
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: update()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      const registro = new PruebaJornadaAulaAspiranteOpcionExamen();
      cut.update("", registro)
        .then(() => {
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });

  describe("Method: delete()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut.delete("")
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al acceder al repositorio");
          done();
        })
        .catch(done);
    });
  });
});

mocha.run();