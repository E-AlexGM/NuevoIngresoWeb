import * as chai from "../../../lib/chai/index.js";
import ExamenDAO from "../../../../../src/js/control/examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionExamenDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionDAO from "../../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_dao.js";
import TipoPruebaDAO from "../../../../../src/js/control/tipo_prueba_dao.js";
import PruebaDAO from "../../../../../src/js/control/prueba_dao.js";
import JornadaDAO from "../../../../../src/js/control/jornada_dao.js";
import AspiranteDAO from "../../../../../src/js/control/aspirante_dao.js";
import AspiranteOpcionDAO from "../../../../../src/js/control/aspirante_opcion_dao.js";
import PruebaJornadaDAO from "../../../../../src/js/control/prueba_jornada_dao.js";
import JornadaAulaDAO from "../../../../../src/js/control/jornada_aula_dao.js";
import PruebaClaveDAO from "../../../../../src/js/control/prueba_clave_dao.js";

import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import PruebaJornadaAulaAspiranteOpcionExamen from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion_examen.js";
import PruebaJornadaAulaAspiranteOpcion from "../../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion.js";
import TipoPrueba from "../../../../../src/js/entity/tipo_prueba.js";
import Prueba from "../../../../../src/js/entity/prueba.js";
import Jornada from "../../../../../src/js/entity/jornada.js";
import Aspirante from "../../../../../src/js/entity/aspirante.js";
import AspiranteOpcion from "../../../../../src/js/entity/aspirante_opcion.js";
import PruebaJornada from "../../../../../src/js/entity/prueba_jornada.js";
import JornadaAula from "../../../../../src/js/entity/jornada_aula.js";
import PruebaClave from "../../../../../src/js/entity/prueba_clave.js";

mocha.setup("bdd");

describe("ExamenDAO Integration Tests - Online", function () {
  let cut;
  let tipoPruebaDAO, pruebaDAO, jornadaDAO, aspiranteDAO, aspiranteOpcionDAO;
  let pruebaJornadaDAO, jornadaAulaDAO, pruebaClaveDAO, pjaaoDAO, examenDAOBase;

  let idTipoPrueba, idPrueba, idJornada, idAspirante, idAspiranteOpcion;
  let idPruebaClave, idMapeoPjaao, idExamenCreado;
  let idAulaBase;
    let correoAspirante;

before(function (done) {
    tipoPruebaDAO = new TipoPruebaDAO();
    pruebaDAO = new PruebaDAO();
    jornadaDAO = new JornadaDAO();
    aspiranteDAO = new AspiranteDAO();

    const ts = Date.now();
    idAulaBase = "LAB-EXAM-" + ts.toString().slice(-4);
    correoAspirante = `exam-test-${ts}@mail.com`;
    let pasoActual = "Crear TipoPrueba";

    const tipoPrueba = new TipoPrueba();
    tipoPrueba.valor = "TIPO_EX_" + ts.toString().slice(-6);
    tipoPrueba.activo = true;

    tipoPruebaDAO
      .create(tipoPrueba)
      .then((resTipo) => {
        pasoActual = "Crear Prueba";
        idTipoPrueba = resTipo.datos.id;

        const prueba = new Prueba();
        prueba.nombre = "PRUEBA_EX_" + ts.toString().slice(-6); // Nombre más corto por si hay límite
        prueba.indicaciones = "Indicaciones de Examen";
        prueba.puntajeMaximo = 100.0; // Ajustado a 100
        prueba.notaAprobacion = 60.0; // Ajustado a 60
        prueba.duracion = 90;
        prueba.fechaCreacion = "2026-05-21T12:00:00-06:00"; // Formato estricto que usaste en otros tests
        prueba.idTipoPrueba = { idTipoPrueba: idTipoPrueba };
        
        return pruebaDAO.create(prueba);
      })
      .then((resPrueba) => {
        pasoActual = "Crear Jornada";
        idPrueba = resPrueba.datos.id;

        const jornada = new Jornada();
        jornada.nombre = "JORNADA_EX_" + ts.toString().slice(-6);
        jornada.fechaInicio = "2026-06-01T08:00:00-06:00";
        jornada.fechaFin = "2026-06-01T12:00:00-06:00";
        return jornadaDAO.create(jornada);
      })
      .then((resJornada) => {
        pasoActual = "Crear Aspirante (para Correo)";
        idJornada = resJornada.datos.id;

        const aspirante = new Aspirante();
        aspirante.nombres = "Aspirante Examen";
        aspirante.apellidos = "Sistema";
        aspirante.fechaNacimiento = "2000-01-01";
        aspirante.documentoIdentidad = "DOC-EX-" + ts.toString().slice(-6);
        aspirante.correo = correoAspirante; 
        aspirante.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteDAO.create(aspirante);
      })
      .then((resAspirante) => {
        pasoActual = "Crear AspiranteOpcion";
        idAspirante = resAspirante.datos.id;

        aspiranteOpcionDAO = new AspiranteOpcionDAO(idAspirante);
        const opcion = new AspiranteOpcion();
        opcion.idOpcion = "OPC-" + ts.toString().slice(-4);
        opcion.prioridad = 1;
        opcion.fechaCreacion = "2026-05-21T12:00:00-06:00";
        return aspiranteOpcionDAO.create(opcion);
      })
      .then((resOpcion) => {
        pasoActual = "Crear PruebaJornada";
        idAspiranteOpcion = resOpcion.datos.id;

        pruebaJornadaDAO = new PruebaJornadaDAO(idPrueba);
        const pj = new PruebaJornada();
        pj.idJornada = { idJornada: idJornada };
        return pruebaJornadaDAO.create(pj);
      })
      .then(() => {
        pasoActual = "Crear JornadaAula";
        jornadaAulaDAO = new JornadaAulaDAO(idJornada);
        const ja = new JornadaAula();
        ja.idAula = idAulaBase;
        return jornadaAulaDAO.create(ja);
      })
      .then(() => {
        pasoActual = "Crear PruebaClave";
        pruebaClaveDAO = new PruebaClaveDAO(idPrueba);
        const clave = new PruebaClave();
        clave.nombreClave = "Clave Examen " + ts.toString().slice(-4);
        clave.idPrueba = { idPrueba: idPrueba };
        return pruebaClaveDAO.create(clave);
      })
      .then((resClave) => {
        pasoActual = "Crear PruebaJornadaAulaAspiranteOpcion";
        idPruebaClave = resClave.datos.id;

        pjaaoDAO = new PruebaJornadaAulaAspiranteOpcionDAO(idPrueba, idJornada, idAulaBase);
        const pjaao = new PruebaJornadaAulaAspiranteOpcion();
        const objOpcion = new AspiranteOpcion();
        objOpcion.idAspiranteOpcion = idAspiranteOpcion;
        pjaao.idAspiranteOpcion = objOpcion;
        pjaao.activo = true;
        return pjaaoDAO.create(pjaao);
      })
      .then((resPjaao) => {
        pasoActual = "Crear Registro de Examen";
        idMapeoPjaao = idAspiranteOpcion; 

        examenDAOBase = new PruebaJornadaAulaAspiranteOpcionExamenDAO(idPrueba, idJornada, idAulaBase, idAspiranteOpcion);
        
        const examen = new PruebaJornadaAulaAspiranteOpcionExamen();
        examen.idPrueba = { idPrueba: idPrueba };
        examen.idJornada = { idJornada: idJornada };
        examen.idAula = idAulaBase;
        examen.idAspiranteOpcion = { idAspiranteOpcion: idAspiranteOpcion };
        examen.idPruebaClave = { idPruebaClave: idPruebaClave };
        examen.resultado = 8.5;
        examen.fechaResultado = "2026-05-21T12:00:00-06:00";

        return examenDAOBase.create(examen);
      })
      .then((resExamen) => {
        idExamenCreado = resExamen.datos.id;
        
        cut = new ExamenDAO();
        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    // Validamos que el DAO no sea undefined antes de intentar eliminar
    let pLimpieza = (idExamenCreado && examenDAOBase) ? examenDAOBase.delete(idExamenCreado).catch(() => true) : Promise.resolve();

    pLimpieza
      .then(() => (idMapeoPjaao && pjaaoDAO) ? pjaaoDAO.delete(idMapeoPjaao).catch(() => true) : Promise.resolve())
      .then(() => (idPruebaClave && pruebaClaveDAO) ? pruebaClaveDAO.delete(idPruebaClave).catch(() => true) : Promise.resolve())
      .then(() => (idAulaBase && jornadaAulaDAO) ? jornadaAulaDAO.delete(idAulaBase).catch(() => true) : Promise.resolve())
      .then(() => (idJornada && pruebaJornadaDAO) ? pruebaJornadaDAO.delete(idJornada).catch(() => true) : Promise.resolve())
      .then(() => (idAspiranteOpcion && aspiranteOpcionDAO) ? aspiranteOpcionDAO.delete(idAspiranteOpcion).catch(() => true) : Promise.resolve())
      .then(() => (idAspirante && aspiranteDAO) ? aspiranteDAO.delete(idAspirante).catch(() => true) : Promise.resolve())
      .then(() => (idJornada && jornadaDAO) ? jornadaDAO.delete(idJornada).catch(() => true) : Promise.resolve())
      .then(() => (idPrueba && pruebaDAO) ? pruebaDAO.delete(idPrueba).catch(() => true) : Promise.resolve())
      .then(() => (idTipoPrueba && tipoPruebaDAO) ? tipoPruebaDAO.delete(idTipoPrueba).catch(() => true) : Promise.resolve())
      .then(() => done())
      .catch(done);
  });





  it("Debe crear una instancia de ExamenDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(ExamenDAO);
  });

  describe("Method: findByCorreo()", function () {
    
    it("Debe retornar un DefaultResponse con los datos del examen asociado al correo proporcionado (200)", function (done) {
      cut
        .findByCorreo(correoAspirante)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.exist;
          // Validar la estructura esperada según tu esquema de Examen
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe retornar 404 al buscar un examen con un correo que no existe en el sistema", function (done) {
      const correoFalso = "usuario_inexistente_x999@mail.com";
      
      cut
        .findByCorreo(correoFalso)
        .then(() => {
          done(new Error("La consulta debió fallar por correo no encontrado"));
        })
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error de parseo al leer un JSON corrupto del servidor", function (done) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Simulado: JSON corrupto al obtener examen"))
      });

      cut
        .findByCorreo(correoAspirante)
        .then(() => {
          globalThis.fetch = originalFetch;
          done(new Error("La consulta debería haber fallado por error de parseo"));
        })
        .catch((error) => {
          globalThis.fetch = originalFetch;
          try {
            chai.expect(error).to.have.property("mensaje");
            chai.expect(error.mensaje).to.include("Error al parsear los datos: Simulado: JSON corrupto al obtener examen");
            done();
          } catch (assertError) {
            done(assertError);
          }
        });
    });

  });
});

mocha.run();