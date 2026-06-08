import * as chai from "../../../lib/chai/index.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";

mocha.setup("bdd");

describe("PruebaClaveDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO;
  let pruebaDAO;

  let idTipoPruebaCreado;
  let idPruebaCreado;
  let idPruebaClaveCreado;

  let pruebaClaveBase;

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();

    const ts = Date.now();
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_PC_" + ts.toString().slice(-6);
    tipoPrueba.activo = true;

    tipoPruebaDAO
      .create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPruebaCreado = resTipo.datos.id;

        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_PC_" + ts.toString().slice(-6);
        prueba.indicaciones = "Indicaciones para prueba clave";
        prueba.puntajeMaximo = 100.0;
        prueba.notaAprobacion = 60.0;
        prueba.duracion = 120;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00";
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPruebaCreado };
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Configurar PruebaClaveDAO y registro base";
        idPruebaCreado = resPrueba.datos.id;

        // Instanciamos el DAO inyectando el idPrueba en el path
        cut = new PruebaClaveDAO(idPruebaCreado);

        pruebaClaveBase = new PruebaClave();
        pruebaClaveBase.nombreClave = "CLAVE_TEST_" + ts.toString().slice(-4);
        // El idPrueba se asigna en el backend mediante el PathParam, pero es buena práctica enviarlo
        pruebaClaveBase.idPrueba = { idPrueba: idPruebaCreado };

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    // Limpieza en cascada invertida
    let pLimpieza = (idPruebaClaveCreado && cut)
      ? cut.delete(idPruebaClaveCreado).catch(() => true)
      : Promise.resolve();

    pLimpieza
      .then(() => (idPruebaCreado && pruebaDAO) 
        ? pruebaDAO.delete(idPruebaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => (idTipoPruebaCreado && tipoPruebaDAO) 
        ? tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PruebaClaveDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaClaveDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse y estado 201 al crear la prueba_clave", function (done) {
      cut
        .create(pruebaClaveBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          
          idPruebaClaveCreado = response.datos.id;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error cuando el payload es nulo o inválido", function (done) {
      const payloadInvalido = null;
      
      cut
        .create(payloadInvalido)
        .then(() => done(new Error("La creación debió fallar por payload inválido")))
        .catch((error) => {
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.match(/Error al acceder al repositorio|Error al crear los datos/);
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de claves asignadas a la prueba", function (done) {
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

    it("Debe rechazar con error de parseo al leer un JSON corrupto del servidor", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en listar claves"))
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
  // Método FindById
  // ==========================================
  describe("Method: findById()", function () {
    it("Debe retornar la prueba_clave creada por su ID", function (done) {
      cut
        .findById(idPruebaClaveCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("idPruebaClave");
          chai.expect(response.datos).to.have.property("nombreClave");
          chai.expect(response.datos.idPruebaClave).to.equal(idPruebaClaveCreado);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si no se encuentra el ID de la clave (404)", function (done) {
      cut
        .findById("123e4567-e89b-12d3-a456-426614174000")
        .then(() => done(new Error("La consulta debió fallar por no encontrado")))
        .catch((error) => {
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.match(/Error al obtener los datos: 404|Error al acceder al repositorio/);
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
    it("Debe eliminar la prueba_clave exitosamente (204) y fallar al reintentar", function (done) {
      cut
        .delete(idPruebaClaveCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          
          const idEliminado = idPruebaClaveCreado;
          idPruebaClaveCreado = null; 

          return cut.delete(idEliminado);
        })
        .then(() => done(new Error("La segunda eliminación debió retornar error porque la clave ya no existe")))
        .catch((error) => {
          try {
            const msg = error.mensaje || "";
            const esErrorValido = msg.includes("404") || msg.includes("500") || msg.includes("acceder al repositorio");
            chai.expect(esErrorValido, `Mensaje inesperado: ${msg}`).to.be.true;
            done();
          } catch (assertError) {
            done(assertError); 
          }
        });
    });

    it("Debe rechazar al intentar eliminar una clave inexistente", function (done) {
      cut
        .delete("00000000-0000-0000-0000-000000000000")
        .then(() => done(new Error("La eliminación debió fallar para un ID inexistente")))
        .catch((error) => {
          try {
            const msg = error.mensaje || "";
            const esErrorValido = msg.includes("404") || msg.includes("500") || msg.includes("acceder al repositorio");
            chai.expect(esErrorValido, `Mensaje inesperado: ${msg}`).to.be.true;
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });
});

mocha.run();