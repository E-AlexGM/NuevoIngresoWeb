import * as chai from "../lib/chai/index.js";
import sinon from "../lib/sinon/sinon-esm.js";
import PreguntaDistractorDAO from "../../../src/js/control/pregunta_distractor_dao.js";

mocha.setup("tdd");

suite("PreguntaDistractorDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new PreguntaDistractorDAO("pregunta-123");
    });

    teardown(function () {
        if (stubFetch) {
            stubFetch.restore();
            stubFetch = null;
        }
    });

    suite("findRange()", function () {
        test("Debe delegar la llamada a _findRange con los parámetros recibidos", function () {
            stubFetch = sinon.stub(cut, "_findRange").resolves();

            const firstParam = 0;
            const maxParam = 10;

            cut.findRange(firstParam, maxParam);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(firstParam, maxParam));
        });
    });

    suite("create()", function () {
        test("Debe delegar la llamada a _create con el objeto recibido", function () {
            stubFetch = sinon.stub(cut, "_create").resolves();

            const preguntaDistractor = { idDistractor: 1, correcto: false };

            cut.create(preguntaDistractor);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(preguntaDistractor));
        });
    });

    suite("delete()", function () {
        test("Debe delegar la llamada a _delete con el id recibido", function () {
            stubFetch = sinon.stub(cut, "_delete").resolves();

            const idParam = "123";

            cut.delete(idParam);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(idParam));
        });
    });
});

mocha.run();