import * as chai from "../../../lib/chai/index.js";
import PruebaJornadaAulaAspiranteOpcionDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import JornadaDAO from "../../../../../src/js/control/jornada_dao.js";
import AspiranteDAO from "../../../../../src/js/control/aspirante_dao.js";
import AspiranteOpcionDAO from "../../../../../src/js/control/aspirante_opcion_dao.js";
import PruebaJornadaDAO from "../../../../../src/js/control/prueba_jornada_dao.js";
import JornadaAulaDAO from "../../../../../src/js/control/jornada_aula_dao.js";

import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaJornadaAulaAspiranteOpcion from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import Jornada from "../../../../../src/js/entity/jornada.js";
import Aspirante from "../../../../../src/js/entity/aspirante.js";
import AspiranteOpcion from "../../../../../src/js/entity/aspirante_opcion.js";
import PruebaJornada from "../../../../../src/js/entity/prueba_jornada.js";
import JornadaAula from "../../../../../src/js/entity/jornada_aula.js";

mocha.setup("bdd");

describe("PruebaJornadaAulaAspiranteOpcionDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO, pruebaDAO, jornadaDAO, aspiranteDAO;
  let aspiranteOpcionDAO, pruebaJornadaDAO, jornadaAulaDAO;

  let idTipoPruebaCreado, idPruebaCreado, idJornadaCreado, idAspiranteCreado;
  let idAspiranteOpcionCreado;
  let idPruebaJornadaCreado, idJornadaAulaCreado;
  let idMapeoCreado;
  let idAulaBase;

  let registroBase;

  before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    jornadaDAO = new JornadaDAO();
    aspiranteDAO = new AspiranteDAO();

    const ts = Date.now();
    idAulaBase = "LAB-" + ts.toString().slice(-4);
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_PJA_" + ts;
    tipoPrueba.activo = true;

    tipoPruebaDAO
      .create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPruebaCreado = resTipo.datos.id;

        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_PJA_" + ts;
        prueba.indicaciones = "Indicaciones";
        prueba.puntajeMaximo = 10.0;
        prueba.notaAprobacion = 6.0;
        prueba.duracion = 90;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00";
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPruebaCreado };
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Crear Jornada";
        idPruebaCreado = resPrueba.datos.id;

        const jornada = new Jornada();
        jornada.nombre = "JORNADA_PJA_" + ts;
        jornada.fechaInicio = "2026-06-01T08:00:00-06:00";
        jornada.fechaFin = "2026-06-01T12:00:00-06:00";
        return jornadaDAO.create(jornada);
      })
      .then((resJornada) => {
        pasoActual = "Crear Aspirante";
        idJornadaCreado = resJornada.datos.id;

        const aspirante = new Aspirante();
        aspirante.nombres = "Aspirante PJA " + ts;
        aspirante.apellidos = "Sistema";
        aspirante.fechaNacimiento = "2000-01-01";
        aspirante.documentoIdentidad = "DOC-" + ts.toString().slice(-8);
        aspirante.correo = `st-${ts}@mail.com`;
        aspirante.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteDAO.create(aspirante);
      })
      .then((resAspirante) => {
        pasoActual = "Crear AspiranteOpcion";
        idAspiranteCreado = resAspirante.datos.id;

        aspiranteOpcionDAO = new AspiranteOpcionDAO(idAspiranteCreado);
        const opcion = new AspiranteOpcion();
        opcion.idOpcion = "OPC-" + ts.toString().slice(-4);
        opcion.prioridad = 1;
        opcion.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteOpcionDAO.create(opcion);
      })
      .then((resOpcion) => {
        pasoActual = "Crear Relación PruebaJornada";
        idAspiranteOpcionCreado = resOpcion.datos.id;

        pruebaJornadaDAO = new PruebaJornadaDAO(idPruebaCreado);
        const pj = new PruebaJornada();
        pj.idJornada = { idJornada: idJornadaCreado };
        return pruebaJornadaDAO.create(pj);
      })
      .then((resPJ) => {
        pasoActual = "Crear Relación JornadaAula";
        idPruebaJornadaCreado = resPJ?.datos?.id;

        jornadaAulaDAO = new JornadaAulaDAO(idJornadaCreado);
        const ja = new JornadaAula();
        ja.idAula = idAulaBase;
        return jornadaAulaDAO.create(ja);
      })
      .then((resJA) => {
        pasoActual = "Configuración del DAO a probar (cut)";
        idJornadaAulaCreado = resJA?.datos?.id;

        cut = new PruebaJornadaAulaAspiranteOpcionDAO(
          idPruebaCreado,
          idJornadaCreado,
          idAulaBase,
        );

        registroBase = new PruebaJornadaAulaAspiranteOpcion();
        const objOpcion = new AspiranteOpcion();
        objOpcion.idAspiranteOpcion = idAspiranteOpcionCreado;
        registroBase.idAspiranteOpcion = objOpcion;
        registroBase.activo = true;

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    let pLimpieza = idMapeoCreado
      ? cut.delete(idMapeoCreado).catch(() => true)
      : Promise.resolve();

    pLimpieza
      .then(() =>
        idAulaBase
          ? jornadaAulaDAO.delete(idAulaBase).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idJornadaCreado
          ? pruebaJornadaDAO.delete(idJornadaCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idAspiranteOpcionCreado
          ? aspiranteOpcionDAO.delete(idAspiranteOpcionCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idAspiranteCreado
          ? aspiranteDAO.delete(idAspiranteCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idJornadaCreado
          ? jornadaDAO.delete(idJornadaCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idPruebaCreado
          ? pruebaDAO.delete(idPruebaCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() =>
        idTipoPruebaCreado
          ? tipoPruebaDAO.delete(idTipoPruebaCreado).catch(() => true)
          : Promise.resolve(),
      )
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de PruebaJornadaAulaAspiranteOpcionDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(PruebaJornadaAulaAspiranteOpcionDAO);
  });

  describe("Method: create()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe retornar un DefaultResponse con los datos del recurso asociado (201)", function (done) {
      cut
        .create(registroBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          idMapeoCreado = idAspiranteOpcionCreado; 
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando falta información obligatoria en el payload (400)", function (done) {
      const mapeoInvalido = new PruebaJornadaAulaAspiranteOpcion();

      cut
        .create(mapeoInvalido)
        .then(() =>
          done(new Error("La creación debió fallar por payload vacío")),
        )
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al crear los datos: 400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar cuando el ID de AspiranteOpcion enviado no existe (404)", function (done) {
      const registro = new PruebaJornadaAulaAspiranteOpcion();
      const objOpcionFalsa = new AspiranteOpcion();
      objOpcionFalsa.idAspiranteOpcion = idFalso;
      registro.idAspiranteOpcion = objOpcionFalsa;

      cut
        .create(registro)
        .then(() =>
          done(
            new Error("La creación debió fallar por dependencia no encontrada"),
          ),
        )
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al crear los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  describe("Method: findById()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe encontrar el recurso recién creado por su ID (200)", function (done) {
      cut
        .findById(idMapeoCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos.idAspiranteOpcion.idAspiranteOpcion).to.equal(idMapeoCreado);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe retornar 404 si el ID buscado no existe en el contexto", function (done) {
      cut
        .findById(idFalso)
        .then(() =>
          done(new Error("La búsqueda debió fallar por no encontrado")),
        )
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai
            .expect(error.mensaje)
            .to.include("Error al obtener los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar error al parsear los datos al buscar por ID", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en findById"))
      });

      cut.findById(idMapeoCreado)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La búsqueda debería haber fallado por parseo"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto en findById");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: update()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe actualizar parcialmente el registro, cambiando 'activo' a false (200)", function (done) {
      const registroUpdate = new PruebaJornadaAulaAspiranteOpcion();
      registroUpdate.activo = false;
      const objOpcion = new AspiranteOpcion();
      objOpcion.idAspiranteOpcion = idAspiranteOpcionCreado;
      registroUpdate.idAspiranteOpcion = objOpcion;

      cut.update(idMapeoCreado, registroUpdate)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar la actualización si el recurso no existe (404)", function (done) {
      const registroUpdate = new PruebaJornadaAulaAspiranteOpcion();
      registroUpdate.activo = true;
      
      const objOpcionFalsa = new AspiranteOpcion();
      objOpcionFalsa.idAspiranteOpcion = idFalso;
      registroUpdate.idAspiranteOpcion = objOpcionFalsa;

      cut.update(idFalso, registroUpdate)
        .then(() => done(new Error("La actualización debió fallar")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al modificar los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar error al parsear los datos al actualizar", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en update"))
      });

      const registroUpdate = new PruebaJornadaAulaAspiranteOpcion();
      registroUpdate.activo = false;
      const objOpcion = new AspiranteOpcion();
      objOpcion.idAspiranteOpcion = idAspiranteOpcionCreado;
      registroUpdate.idAspiranteOpcion = objOpcion;

      cut.update(idMapeoCreado, registroUpdate)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La actualización debería haber fallado"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto en update");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con la lista de registros del contexto (200)", function (done) {
      cut.findRange(0, 50)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("array");
          chai.expect(response).to.have.property("total_datos");
          chai.expect(response.datos.length).to.be.above(0); 
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si se mandan parámetros de paginación inválidos (400)", function (done) {
      cut.findRange(-1, 0)
        .then(() => done(new Error("La consulta debió fallar")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 400");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar error al parsear los datos al consultar un rango", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en findRange"))
      });

      cut.findRange(0, 50)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La consulta debería haber fallado"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto en findRange");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });
  });

  describe("Method: delete()", function () {
    const idFalso = "123e4567-e89b-12d3-a456-426614174000";

    it("Debe eliminar el recurso exitosamente (204) y fallar al buscar de nuevo", function (done) {
      cut.delete(idMapeoCreado)
        .then(() => {
          idMapeoCreado = null; 
          return cut.findById(idAspiranteOpcionCreado);
        })
        .then(() => done(new Error("El recurso aún existe después de eliminarlo")))
        .catch((error) => {
          try {
            chai.expect(error.mensaje).to.include("404");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });

    it("Debe rechazar al intentar eliminar un registro inexistente (404)", function (done) {
      cut.delete(idFalso)
        .then(() => done(new Error("La eliminación debió fallar para un ID inexistente")))
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