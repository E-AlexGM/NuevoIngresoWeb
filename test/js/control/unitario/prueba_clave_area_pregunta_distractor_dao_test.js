import * as chai from "../../lib/chai/index.js";
import sinon from "../../lib/sinon/sinon-esm.js";
import PruebaClaveAreaPreguntaDistractorDAO from "../../../../src/js/control/prueba_clave_area_pregunta_distractor_dao.js";

mocha.setup("tdd");

suite("PruebaClaveAreaPreguntaDistractorDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new PruebaClaveAreaPreguntaDistractorDAO("clave-1", "area-1", "pregunta-1", "distractor-1");
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

            const pruebaClaveAreaPreguntaDistractor = { correcto: true };

            const resultado = cut.create(pruebaClaveAreaPreguntaDistractor);

            chai.assert.equal(resultado, mockPromise);
            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(pruebaClaveAreaPreguntaDistractor));
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