import * as chai from "../../../lib/chai/index.js";
import AspiranteOpcionDAO from "../../../../../src/js/control/aspirante_opcion_dao.js";
import AspiranteDAO from "../../../../../src/js/control/aspirante_dao.js";
import DefaultResponse from "../../../../../src/js/entity/default_response.js";
import AspiranteOpcion from "../../../../../src/js/entity/aspirante_opcion.js";
import Aspirante from "../../../../../src/js/entity/aspirante.js";

mocha.setup("bdd");

describe("AspiranteOpcionDAO Integration Tests - Online", function () {
  let cut;
  let aspiranteDAO;

  let idAspiranteCreado;
  let idAspiranteOpcionCreado;

  let opcionBase;

  before(function (done) {
    aspiranteDAO = new AspiranteDAO();

    const ts = Date.now();
    let pasoActual = "Crear Aspirante";

    const aspirante = new Aspirante();
    aspirante.nombres = "Aspirante Opcion";
    aspirante.apellidos = "Integracion";
    aspirante.fechaNacimiento = "2000-01-01";
    aspirante.documentoIdentidad = "DOC-OP-" + ts.toString().slice(-6);
    aspirante.correo = `op-${ts}@mail.com`;
    aspirante.fechaCreacion = "2026-05-21T12:00:00-06:00";

    aspiranteDAO
      .create(aspirante)
      .then((resAspirante) => {
        pasoActual = "Configurar AspiranteOpcionDAO y registro base";
        idAspiranteCreado = resAspirante.datos.id;

        cut = new AspiranteOpcionDAO(idAspiranteCreado);

        opcionBase = new AspiranteOpcion();
        opcionBase.idOpcion = "OPC-" + ts.toString().slice(-4);
        opcionBase.prioridad = 1;
        opcionBase.fechaCreacion = "2026-05-21T12:00:00-06:00";
        // idAspirante se asigna en el backend mediante el PathParam de la URL

        done();
      })
      .catch((err) => {
        const msg = err.mensaje || JSON.stringify(err);
        done(new Error(`Falló en el paso [${pasoActual}]: ${msg}`));
      });
  });

  after(function (done) {
    let pLimpieza = (idAspiranteOpcionCreado && cut)
      ? cut.delete(idAspiranteOpcionCreado).catch(() => true)
      : Promise.resolve();

    pLimpieza
      .then(() => (idAspiranteCreado && aspiranteDAO) 
        ? aspiranteDAO.delete(idAspiranteCreado).catch(() => true) 
        : Promise.resolve())
      .then(() => done())
      .catch(done);
  });

  it("Debe crear una instancia de AspiranteOpcionDAO", function () {
    chai.expect(cut).to.be.an.instanceOf(AspiranteOpcionDAO);
  });

  // ==========================================
  // Método Create
  // ==========================================
  describe("Method: create()", function () {
    it("Debe retornar un DefaultResponse y estado 201 al crear la aspirante_opcion", function (done) {
      cut
        .create(opcionBase)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("id");
          
          idAspiranteOpcionCreado = response.datos.id;
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar con error (400/500) cuando el payload es nulo o inválido", function (done) {
      // El backend Java espera un objeto no nulo
      const payloadInvalido = null;
      
      cut
        .create(payloadInvalido)
        .then(() => done(new Error("La creación debió fallar por payload inválido")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.match(/Error al acceder al repositorio|Error al crear los datos/);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método FindRange
  // ==========================================
  describe("Method: findRange()", function () {
    it("Debe retornar un DefaultResponse con un array de opciones asignadas al aspirante", function (done) {
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
        json: () => Promise.reject(new Error("Simulado: JSON corrupto en listar opciones"))
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
    it("Debe retornar la aspirante_opcion creada por su ID", function (done) {
      cut
        .findById(idAspiranteOpcionCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos).to.have.property("idAspiranteOpcion");
          chai.expect(response.datos).to.have.property("idOpcion");
          chai.expect(response.datos.idAspiranteOpcion).to.equal(idAspiranteOpcionCreado);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar si no se encuentra el ID de la opción (500)", function (done) {
      cut
        .findById("123e4567-e89b-12d3-a456-426614174000")
        .then(() => done(new Error("La consulta debió fallar por no encontrado")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al obtener los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método Update
  // ==========================================
  describe("Method: update()", function () {
    it("Debe actualizar la aspirante_opcion exitosamente (200)", function (done) {
      const opcionActualizada = new AspiranteOpcion();
      opcionActualizada.idOpcion = opcionBase.idOpcion;
      opcionActualizada.prioridad = 2; 
      opcionActualizada.fechaCreacion = opcionBase.fechaCreacion;

      cut
        .update(idAspiranteOpcionCreado, opcionActualizada)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          chai.expect(response.datos).to.be.an("object");
          chai.expect(response.datos.prioridad).to.equal(2);
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar la actualización si la opción no existe (500)", function (done) {
      const opcionFalsa = new AspiranteOpcion();
      opcionFalsa.idOpcion = "FALSA";
      opcionFalsa.prioridad = 1;

      cut
        .update("123e4567-e89b-12d3-a456-426614174000", opcionFalsa)
        .then(() => done(new Error("La actualización debió fallar por no encontrado")))
        .catch((error) => {
          chai.expect(error).to.have.property("mensaje");
          chai.expect(error.mensaje).to.include("Error al modificar los datos: 404");
          done();
        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });
  });

  // ==========================================
  // Método Delete
  // ==========================================
  describe("Method: delete()", function () {
    it("Debe eliminar la aspirante_opcion exitosamente (204)", function (done) {
      cut
        .delete(idAspiranteOpcionCreado)
        .then((response) => {
          chai.expect(response).to.be.an.instanceOf(DefaultResponse);
          
          const idEliminado = idAspiranteOpcionCreado;
          idAspiranteOpcionCreado = null; 

          cut
            .delete(idEliminado)
            .then(() => done(new Error("La segunda eliminación debió retornar 404 porque el mapeo ya no existe")))
            .catch((error) => {
              chai.expect(error).to.have.property("mensaje");
              chai.expect(error.mensaje).to.include("Error al eliminar los datos: 404");
              console.log("hola: ", error.mensaje)
              done();
            });

        })
        .catch((e) => done(new Error(e.mensaje || e)));
    });

    it("Debe rechazar al intentar eliminar una opción que no existe (404)", function (done) {
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