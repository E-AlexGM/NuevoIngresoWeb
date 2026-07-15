import * as chai from "../../../lib/chai/index.js";
import PruebaJornadaDAO from "../../../../../src/js/control/prueba_jornada_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import JornadaDAO from "../../../../../src/js/control/jornada_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaJornada from "../../../../../src/js/entity/prueba_jornada.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import Jornada from "../../../../../src/js/entity/jornada.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";

mocha.setup("bdd");

describe("PruebaJornadaDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO;
  let pruebaDAO;
  let jornadaDAO;

  let idTipoPruebaCreado;
  let idPruebaCreado;
  let idJornadaCreado;
  let idPruebaJornadaCreado; // En este contexto, el Location devuelve el idJornada mapeado

  let pruebaJornadaBase;

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    jornadaDAO = new JornadaDAO();

    const ts = Date.now();
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_PJ_" + ts.toString().slice(-6);
    tipoPrueba.activo = true;

    tipoPruebaDAO
      .create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPruebaCreado = resTipo.datos.id;

        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_PJ_" + ts.toString().slice(-6);
        prueba.indicaciones = "Indicaciones de prueba jornada";
        prueba.puntajeMaximo = 100.0;
        prueba.notaAprobacion = 60.0;
        prueba.duracion = 120;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00";
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPruebaCreado };
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Crear Jornada";
        idPruebaCreado = resPrueba.datos.id;

        const jornada = new Jornada();
        jornada.nombre = "JORNADA_PJ_" + ts.toString().slice(-6);
        jornada.fechaInicio = "2026-06-01T08:00:00-06:00";
        jornada.fechaFin = "2026-06-01T12:00:00-06:00";
        return jornadaDAO.create(jornada);
      })
      .then((resJornada) => {
        pasoActual = "Configurar PruebaJornadaDAO y registro base";
        idJornadaCreado = resJornada.datos.id;

        cut = new PruebaJornadaDAO(idPruebaCreado);

        pruebaJornadaBase = new PruebaJornada();
        pruebaJornadaBase.idJornada = { idJornada: idJornadaCreado };

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    let pLimpieza = (idPruebaJornadaCreado && cut)
      ? cut.delete(idPruebaJornadaCreado).catch(() => true)
      : Promise.resolve();

    pLimpieza
      .then(() => (idJornadaCreado && jornadaDAO) 
        ? jornadaDAO.delete(idJornadaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => (idPruebaCreado && pruebaDAO) 
        ? pruebaDAO.delete(idPruebaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => (idTipoPruebaCreado && tipoPruebaDAO) 
        ? tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PruebaJornadaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaJornadaDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse y estado 201 al crear la asociación prueba_jornada", function (done) {
      cut
        .create(pruebaJornadaBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          
          idPruebaJornadaCreado = response.datos.id || idJornadaCreado;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error (400) cuando el payload no contiene la jornada", function (done) {
      const mapeoInvalido = new PruebaJornada();
      
      cut
        .create(mapeoInvalido)
        .then(() => done(new Error("La creación debió fallar por payload inválido")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al crear los datos: 400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error (404) cuando se envía un idJornada inexistente", function (done) {
      const jornadaFalsa = new PruebaJornada();
      jornadaFalsa.idJornada = { idJornada: "123e4567-e89b-12d3-a456-426614174000" };

      cut
        .create(jornadaFalsa)
        .then(() => done(new Error("La creación debió fallar por Jornada no encontrada")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al crear los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de jornadas asignadas a la prueba", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response.datos.length).to.be.above(0);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si se mandan parámetros de paginación inválidos (400)", function (done) {
      cut
        .findRange(-1, 0)
        .then(() => done(new Error("La consulta debió fallar")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error de parseo al leer un JSON corrupto del servidor", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ "Total-Records": "10" }),
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en listar jornadas"))
      });

      cut
        .findRange(0, 10)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La consulta debería haber fallado por error de parseo"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
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

  // ==========================================
  // Método Delete
  // ==========================================
  describe("Method: delete()", function () {
    it("Debe eliminar la asociación prueba_jornada exitosamente (204)", function (done) {
      cut
        .delete(idPruebaJornadaCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          
          const idEliminado = idPruebaJornadaCreado;
          idPruebaJornadaCreado = null; 

          cut
            .delete(idEliminado)
            .then(() => done(new Error("La segunda eliminación debió retornar 404 porque el mapeo ya no existe")))
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
              done();
            });
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar eliminar una jornada que no existe o no está asociada (404)", function (done) {
      cut
        .delete("123e4567-e89b-12d3-a456-426614174000")
        .then(() => done(new Error("La eliminación debería haber fallado")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });
});

mocha.run();