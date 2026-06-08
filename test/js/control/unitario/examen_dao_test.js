import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import ExamenDAO from "../../../../src/js/control/examen_dao.js";
import DefaultResponse from "../../../../src/js/entity/default_response.js";
import DefaultError from "../../../../src/js/entity/default_error.js";

mocha.setup("tdd");

suite("ExamenDAO Unit Test", function () {

    var cut;
    var stubFetch;

    setup(function () {
        cut = new ExamenDAO();
        stubFetch = sinon.stub(window, "fetch");
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });

    suite("Constructor", function () {
        test("Debe invocar a super() y concatenar 'examen/' a la URL base heredada", function () {
            chai.assert.isDefined(cut.URL);
            chai.assert.equal(cut.URL, "http://localhost:9080/admision-api/v1/examen/");
        });
    });
    
    suite("findByCorreo()", function () {

        test("Debe resolver con un DefaultResponse y los datos correspondientes cuando el servidor responde 200 OK", function () {
            const mockDatosExamen = [{ id: "123", correo: "aspirante@correo.com", resultado: 85.0 }];
            
            const mockResponse = {
                status: 200,
                json: sinon.stub().resolves(mockDatosExamen)
            };
            stubFetch.resolves(mockResponse);

            const correoParam = "aspirante@correo.com";

            return cut.findByCorreo(correoParam).then((resultado) => {
                chai.assert.isTrue(stubFetch.calledOnce);
                chai.assert.isTrue(stubFetch.calledWithExactly(`${cut.URL}?correo=${correoParam}`, { method: "GET" }));
                
                chai.assert.instanceOf(resultado, DefaultResponse);
                chai.assert.deepEqual(resultado.datos, mockDatosExamen);
            });
        });

        test("Debe rechazar con DefaultError si el estatus es 200 pero ocurre un error al parsear el JSON", function () {
            const errorParseo = new Error("Unexpected token < in JSON at position 0");
            
            const mockResponse = {
                status: 200,
                json: sinon.stub().rejects(errorParseo)
            };
            stubFetch.resolves(mockResponse);

            return cut.findByCorreo("aspirante@correo.com").then(
                () => { 
                    throw new Error("La promesa debió haber sido rechazada"); 
                },
                (error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, `Error al parsear los datos: ${errorParseo.message}`);
                    chai.assert.equal(error.error, errorParseo);
                }
            );
        });

        test("Debe rechazar con DefaultError y el código de estado si el servidor responde algo distinto a 200 (ej. 404)", function () {
            const mockResponse = {
                status: 404,
                json: sinon.stub()
            };
            stubFetch.resolves(mockResponse);

            return cut.findByCorreo("inexistente@correo.com").then(
                () => { 
                    throw new Error("La promesa debió haber sido rechazada por estado no exitoso"); 
                },
                (error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, "Error al obtener los datos: 404");
                    chai.assert.equal(error.error, mockResponse);
                }
            );
        });

        test("Debe rechazar con DefaultError indicando problemas de acceso si la petición fetch falla por red", function () {
            const errorRed = new TypeError("Failed to fetch");
            stubFetch.rejects(errorRed);

            return cut.findByCorreo("aspirante@correo.com").then(
                () => { 
                    throw new Error("La promesa debió haber sido rechazada por fallo de red"); 
                },
                (error) => {
                    chai.assert.instanceOf(error, DefaultError);
                    chai.assert.equal(error.mensaje, "Error al acceder al repositorio");
                    chai.assert.equal(error.error, errorRed);
                }
            );
        });

    });
});

mocha.run();