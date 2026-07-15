import * as chai from "../../../lib/chai/index.js";
import JornadaAulaDAO from "../../../../../src/js/control/jornada_aula_dao.js";
import JornadaDAO from "../../../../../src/js/control/jornada_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import JornadaAula from "../../../../../src/js/entity/jornada_aula.js";
import Jornada from "../../../../../src/js/entity/jornada.js";

mocha.setup("bdd");

describe("JornadaAulaDAO Integration Tests - Online", function () {
  let cut;
  let jornadaDAO;

  let idJornadaCreado;
  let idAulaBase;
  let idJornadaAulaCreado;

  let jornadaAulaBase;

  before(function (done) {
    jornadaDAO = new JornadaDAO();

    const ts = Date.now();
    idAulaBase = "AULA-" + ts.toString().slice(-4);
    let pasoActual = "Crear Jornada";

    const jornada = new Jornada();
    jornada.nombre = "JORNADA_JA_" + ts.toString().slice(-6);
    jornada.fechaInicio = "2026-06-01T08:00:00-06:00";
    jornada.fechaFin = "2026-06-01T12:00:00-06:00";

    jornadaDAO
      .create(jornada)
      .then((resJornada) => {
        pasoActual = "Configurar JornadaAulaDAO y registro base";
        idJornadaCreado = resJornada.datos.id;

        cut = new JornadaAulaDAO(idJornadaCreado);

        jornadaAulaBase = new JornadaAula();
        jornadaAulaBase.idAula = idAulaBase;
        jornadaAulaBase.idDocente = null; 

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    let pLimpieza = (idJornadaAulaCreado && cut) 
      ? cut.delete(idJornadaAulaCreado).catch(() => true) 
      : Promise.resolve();

    pLimpieza
      .then(() => (idJornadaCreado && jornadaDAO) 
        ? jornadaDAO.delete(idJornadaCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de JornadaAulaDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(JornadaAulaDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse con los datos de la jornada_aula creada", function (done) {
      cut
        .create(jornadaAulaBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          
          idJornadaAulaCreado = response.datos.id || idAulaBase;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando falla la creación por payload vacío (500/400)", function (done) {
      const jornadaAulaInvalida = new JornadaAula();
      
      cut
        .create(jornadaAulaInvalida)
        .then(() => {
          done(new Error("La creación debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.match(/Error al crear los datos: (400|500)/);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de jornada_aulas y total_datos", function (done) {
      cut
        .findRange(0, 10)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response).to.have.property("total_datos");
          chai.expect(response.datos.length).to.be.above(0);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si se mandan parámetros inválidos, id inexistente )", function (done) {
        let jaDao = new JornadaAulaDAO("123456789012345678901234");

      jaDao
        .findRange(-1, -5)
        .then(() => {
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 500");
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
        json: () => Promise.reject(new Error("Simulado: JSON corrupto al obtener rango"))
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
    it("Debe eliminar la jornada_aula creada exitosamente", function (done) {
      cut
        .delete(idJornadaAulaCreado)
        .then(() => {
          const idEliminado = idJornadaAulaCreado;
          idJornadaAulaCreado = null; 

          cut
            .delete(idEliminado)
            .then(() => {
              done(new Error("La segunda eliminación debió retornar 404 porque el recurso ya no existe"));
            })
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
              done();
            });
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar eliminar una jornada_aula que no existe", function (done) {
      cut
        .delete("AULA-INEXISTENTE-9999")
        .then(() => {
          done(new Error("La eliminación debería haber fallado"));
        })
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