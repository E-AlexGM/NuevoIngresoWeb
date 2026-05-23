import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import PruebaJornadaAulaAspiranteOpcionExamenDAO from "../../../../src/js/control/prueba_jornada_aula_aspirante_opcion_examen_dao.js";
import PruebaJornadaAulaAspiranteOpcionExamen from "../../../../src/js/entity/prueba_jornada_aula_aspirante_opcion_examen.js";

mocha.setup("tdd");

suite("PruebaJornadaAulaAspiranteOpcionExamenDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new PruebaJornadaAulaAspiranteOpcionExamenDAO("prueba-1", "jornada-1", "aula-1", "opcion-1");
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });

    suite("findRange()", function () {
        test("Debe delegar la llamada a _findRange con los parámetros recibidos", function () {
            const mockPromise = Promise.resolve("datos_findRange");
            stubFetch = sinon.stub(cut, "_findRange").returns(mockPromise);

            const firstParam = 0;
            const maxParam = 10;

            const resultado = cut.findRange(firstParam, maxParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(firstParam, maxParam));
        });
    });

    suite("create()", function () {
        test("Debe delegar la llamada a _create con el objeto recibido", function () {
            const mockPromise = Promise.resolve("datos_create");
            stubFetch = sinon.stub(cut, "_create").returns(mockPromise);

            const pruebaJornadaAulaAspiranteOpcionExamen = new PruebaJornadaAulaAspiranteOpcionExamen();
            pruebaJornadaAulaAspiranteOpcionExamen.puntaje = 95;

            const resultado = cut.create(pruebaJornadaAulaAspiranteOpcionExamen);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(pruebaJornadaAulaAspiranteOpcionExamen));
        });
    });

    suite("findById()", function () {
        test("Debe delegar la llamada a _findById con el id recibido", function () {
            const mockPromise = Promise.resolve("datos_findById");
            stubFetch = sinon.stub(cut, "_findById").returns(mockPromise);

            const idParam = "123";

            const resultado = cut.findById(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("update()", function () {
        test("Debe delegar la llamada a _update con los parámetros recibidos", function () {
            const mockPromise = Promise.resolve("datos_update");
            stubFetch = sinon.stub(cut, "_update").returns(mockPromise);

            const idParam = "123";
            const pruebaJornadaAulaAspiranteOpcionExamen = new PruebaJornadaAulaAspiranteOpcionExamen();
            pruebaJornadaAulaAspiranteOpcionExamen.puntaje = 100;

            const resultado = cut.update(idParam, pruebaJornadaAulaAspiranteOpcionExamen);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam, pruebaJornadaAulaAspiranteOpcionExamen));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete con el id recibido", function () {
            const mockPromise = Promise.resolve("datos_delete");
            stubFetch = sinon.stub(cut, "_delete").returns(mockPromise);

            const idParam = "123";

            const resultado = cut.delete(idParam);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });

    suite("Constructor", function () {
        test("Debe invocar a super() y ajustar la URL base", function () {
            chai.assert.isDefined(cut.URL);
            chai.assert.isTrue(cut.URL.startsWith(cut.BASE_URL));
        });
    });
});

mocha.run();