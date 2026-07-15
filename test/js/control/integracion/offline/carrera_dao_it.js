import * as chai from "../../../lib/chai/index.js";
import CarreraDAO from "../../../../../src/js/control/carrera_dao.js";

mocha.setup("bdd");

describe("CarreraDAO Integration Tests - Offline", function () {
  let cut;

  before(function () {
    cut = new CarreraDAO();
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
});

mocha.run();