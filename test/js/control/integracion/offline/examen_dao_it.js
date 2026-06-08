import * as chai from "../../../lib/chai/index.js";
import ExamenDAO from "../../../../../src/js/control/examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionExamen from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion_examen.js";

mocha.setup("bdd");

describe("ExamenDAO - Offline Tests (Servidor Apagado)", function () {
  let cut;
  const idFicticio = "123e4567-e89b-12d3-a456-426614174000";
  const correoFicticio = "aspirante.prueba@ejemplo.com";

  before(function () {
    cut = new ExamenDAO();
  });


  
  describe("Method: findByCorreo()", function () {
    it("Debe rechazar por servidor apagado", function (done) {
      cut.findByCorreo(correoFicticio)
        .then(() => {
          done(new Error("La consulta por correo debería haber fallado"));
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