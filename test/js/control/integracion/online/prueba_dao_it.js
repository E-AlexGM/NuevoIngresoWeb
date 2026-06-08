import * as chai from "../../../lib/chai/index.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";

mocha.setup("bdd");

describe("PruebaDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO;
  let idCreado;

  let tipoPrueba;
  let idTipoPruebaCreado;

  // Este before se ejecuta antes de cualquier prueba de esta clase
  before(function () {

    tipoPruebaDAO = new TipoPruebaDAO();    
    cut = new PruebaDAO();

    tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "INGRESO_UNIVERSITARIO_PRIMERA_RONDA";
    tipoPrueba.activo = true;

  });

  it("Debe crear una instancia de PruebaDAO", function () {
    chai.expect(tipoPruebaDAO).to.be.an.instanceOf(TipoPruebaDAO);
    chai.expect(cut).to.be.an.instanceOf(PruebaDAO);
  });

  //Método Create
  describe("Method: create()", function () {

    it("Debe crear el contexto de TipoPrueba necesario para las pruebas", function (done) {
        tipoPruebaDAO.create(tipoPrueba)
        .then((response) => {
        chai.expect(response.datos.id).to.exist;
        idTipoPruebaCreado = response.datos.id;
        done();
        }).catch(done);
    });
    
    it("Debe retornar un DefaultResponse con los datos de la prueba creada", function (done) {

      const prueba = new Prueba();
      prueba.nombre = "Prueba de Ingreso";
      prueba.indicaciones = "Lee cuidadosamente cada pregunta";
      prueba.puntajeMaximo = 100;
      prueba.notaAprobacion = 60;
      prueba.duracion = 120;
      prueba.fechaCreacion = new Date().toISOString();
      prueba.idTipoPrueba = { idTipoPrueba: idTipoPruebaCreado };

      cut
        .create(prueba)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          chai.expect(response.datos).to.have.property("location");
          chai.expect(response.datos.id).to.exist;
          chai.expect(response.datos.location).to.exist;
          idCreado = response.datos.id;
          done();
        })
        .catch(done);
    });

    it("Debe rechazar leyendo el header Process-Error cuando falla la creación (500)", function (done) {
      const pruebaInvalida = { nombre: null }; // Nombre vacío para provocar error
      cut
        .create(pruebaInvalida)
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

  // ==========================================
  // Método List
  // ==========================================
  describe("Method: list()", function () {
    it("Debe retornar un DefaultResponse con un array de pruebas filtradas por estado activo", function (done) {
      cut
        .list(true)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          // Validamos que al menos los elementos cumplan con la lógica de ser activos
          if (response.datos.length > 0) {
            chai.expect(response.datos[0]).to.have.property("activo");
            chai.expect(response.datos[0].activo).to.be.true;
          }
          done();
        })
        .catch(done);
    });

    it("Debe rechazar con error si el servidor retorna un estado distinto a 200", function (done) {
      // Simulamos un escenario de error en el backend (ej. 500)
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        status: 500,
        ok: false
      });

      cut
        .list(true)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 500");
          done();
        });
    });

    it("Debe rechazar error al parsear los datos recibidos", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto en list"));
      };

      cut
        .list(false)
        .then(() => {
          Response.prototype.json = originalJson;
          done(new Error("La consulta debería haber fallado por JSON corrupto"));
        })
        .catch((error) => {
          Response.prototype.json = originalJson;

          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de pruebas ", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response.datos).to.have.length.above(0);
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


  describe("Method: findById()", function () {
    it("Debe retornar un DefaultResponse con la prueba encontrada", function (done) {
      cut
        .findById(idCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          var Prueba = response.datos;
          chai.expect(Prueba).to.have.property("idPrueba");
          chai.expect(Prueba).to.have.property("nombre");
          chai.expect(Prueba.idPrueba).to.exist;
          chai.expect(Prueba.nombre).to.exist;
          chai.expect(Prueba.idPrueba).to.equal(idCreado);
          chai.expect(Prueba.nombre).to.equal("Prueba de Ingreso");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar si no se encuentra la prueba", function (done) {
      cut
        .findById("123e4567-e89b-12d3-a456-426614174999")
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al obtener los datos: 404");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar si se manda un id inválido", function (done) {
      cut
        .findById("id-invalido")
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al obtener los datos: 500");
          done();
        })
        .catch(done);
    });

    it("Debe rechazar error al parsear los datos", function (done) {
      const originalJson = Response.prototype.json;
      Response.prototype.json = function () {
        return Promise.reject(new Error("Simulado: JSON corrupto"));
      };

      cut
        .findById(idCreado)
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
            done(); // Test exitoso
          } catch (assertError) {
            done(assertError); // Si la aserción de Chai falla, se le pasa a Mocha
          }
        });
    });
  });



  describe("Method: delete()", function () {
    it("Debe eliminar la prueba creada y rechazar al intentar encontrarla", function (done) {
      cut
        .delete(idCreado)
        .then(() => {
          cut
            .findById(idCreado)
            .then(() => {
              done(new Error("La prueba debería haber sido eliminada"));
            })
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai
                .expect(error.mensaje)
                .to.include("Error al obtener los datos: 404");
              done();
            })
            .catch(done);
        })
        .catch(done);
    });

    it("Debe rechazar al intentar eliminar una prueba que no existe", function (done) {
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
