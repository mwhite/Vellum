/*jshint multistr: true */
require([
    'chai',
    'jquery',
    'underscore',
    'tests/utils',
    'text!static/core/group-rename.xml',
    'text!static/core/invalid-questions.xml',
    'text!static/core/increment-item.xml'
], function (
    chai,
    $,
    _,
    util,
    GROUP_RENAME_XML,
    INVALID_QUESTIONS_XML,
    INCREMENT_ITEM_XML
) {
    var assert = chai.assert,
        call = util.call,
        extensionsWithoutItemset = _(util.options.options.extensions || []).without("itemset");

    describe("Vellum core", function () {
        it("should not allow adding questions with matching paths", function (done) {
            util.init({
                core: {
                    onReady: function () {
                        var dup;
                        util.addQuestion("Text", "question1");
                        dup = util.addQuestion("Text", "question2");
                        dup.p.nodeID = "question1";

                        assert(!call('ensureCurrentMugIsSaved'),
                               "save should fail with duplicate question ID");

                        done();
                    }
                }
            });
        });

        it("should allow mug rename with itemset in form when the itemset plugin is disabled", function (done) {
            util.init({
                extensions: extensionsWithoutItemset,
                core: {
                    form: TEST_XML_1,
                    onReady: function () {
                        var mug = call("getMugByPath", "/data/state"),
                            itemset = mug.form.getChildren(mug)[0];
                        assert.equal(mug.form.getAbsolutePath(itemset, true), null);
                        mug.p.nodeID = "stat"; // this change triggers the bug
                        done();
                    }
                }
            });
        });

        it("should update child references on group rename", function (done) {
            util.init({core: { form: GROUP_RENAME_XML, onReady: function () {
                var group = call("getMugByPath", "/data/group"),
                    q1 = call("getMugByPath", "/data/group/question1"),
                    q2 = call("getMugByPath", "/data/question2");
                group.p.nodeID = "g8";
                assert.equal(q1.form.getAbsolutePath(q1), "/data/g8/question1");
                assert.equal(q2.p.relevantAttr,
                    "/data/g8/question1 = 'valley girl' and /data/g8/question2 = 'dude'");
                done();
            }}});
        });

        it("should show warning icons on invalid questions", function (done) {
            util.init({core: { form: INVALID_QUESTIONS_XML, onReady: function () {
                var q0 = call("getMugByPath", "/data/q0"),
                    q1 = call("getMugByPath", "/data/q1"),
                    h1 = call("getMugByPath", "/data/h1");
                assert(util.isTreeNodeValid(q0), "q0 is invalid: sanity check failed");
                assert(!util.isTreeNodeValid(q1), "q1 should not be valid");
                assert(!util.isTreeNodeValid(h1), "h1 should not be valid");
                done();
            }}});
        });

        it("should increment item value on insert new select item as child of select", function (done) {
            util.init({core: { form: INCREMENT_ITEM_XML, onReady: function () {
                util.clickQuestion("question1");
                var item = util.addQuestion("Item");
                assert.equal(item.p.defaultValue, "item3");
                done();
            }}});
        });

        it("should increment item value on insert new select item after sibling item", function (done) {
            util.init({core: { form: INCREMENT_ITEM_XML, onReady: function () {
                util.clickQuestion("item1");
                var item = util.addQuestion("Item");
                assert.equal(item.p.defaultValue, "item3");
                done();
            }}});
        });
    });

    var TEST_XML_1 = '' +
    '<?xml version="1.0" encoding="UTF-8" ?>\
    <h:html xmlns:h="http://www.w3.org/1999/xhtml" xmlns:orx="http://openrosa.org/jr/xforms" xmlns="http://www.w3.org/2002/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:vellum="http://commcarehq.org/xforms/vellum">\
        <h:head>\
            <h:title>Vellum testing</h:title>\
            <model>\
                <instance>\
                    <data xmlns:jrm="http://dev.commcarehq.org/jr/xforms"\
                          xmlns="http://openrosa.org/formdesigner/FFD00941-A932-471A-AEC8-87F6EFEF767F"\
                          uiVersion="1" version="1" name="Vellum testing">\
                        <state />\
                    </data>\
                </instance>\
                <instance id="states" src="jr://fixture/item-list:state"></instance>\
                <bind nodeset="/data/state" />\
                <itext>\
                    <translation lang="en" default="">\
                        <text id="state-label">\
                            <value>State</value>\
                        </text>\
                    </translation>\
                </itext>\
            </model>\
        </h:head>\
        <h:body>\
            <select1 ref="/data/state">\
                <label ref="jr:itext(\'state-label\')" />\
                <itemset nodeset="instance(\'states\')/state_list/state">\
                  <label ref="name"></label>\
                  <value ref="id"></value>\
                </itemset>\
            </select1>\
        </h:body>\
    </h:html>';
});
