require([
    'chai',
    'jquery',
    'tests/utils'
], function (
    chai,
    $,
    util
) {
    var assert = chai.assert,
        call = util.call;

    describe("Vellum core", function () {
        it("should not allow adding questions with matching paths", function (done) {
            util.init({
                core: {
                    onReady: function () {
                        var mug = util.addQuestion("Text", "question1"),
                            dup = util.addQuestion("Text", "question2");
                        dup.p.nodeID = "question1";

                        assert(!call('ensureCurrentMugIsSaved'),
                               "save should fail with duplicate question ID");

                        done();
                    }
                }
            });
        });
    });
});
