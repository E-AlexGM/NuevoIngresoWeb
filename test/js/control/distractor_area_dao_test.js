import * as chai from "../lib/chai/index.js";
import sinon from "../lib/sinon/sinon-esm.js";
import DistractorAreaDAO from "../../../src/js/control/distractor_area_dao.js";

mocha.setup("tdd");

suite("DistractorAreaDAO Unit Test", function () {
    var cut;
    var stubFetch;

    setup(function () {
        cut = new DistractorAreaDAO("distractor-123");
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

            const distractorArea = { idArea: 1 };

            cut.create(distractorArea);

            chai.assert.isTrue(stubFetch.calledOnce);
            chai.assert.isTrue(stubFetch.calledWithExactly(distractorArea));
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