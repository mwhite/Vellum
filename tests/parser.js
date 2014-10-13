/*jshint multistr: true */
require([
    'chai',
    'jquery',
    'underscore',
    'tests/utils',
    'vellum/parser'
], function (
    chai,
    $,
    _,
    util,
    parser
) {
    var assert = chai.assert,
        call = util.call,
        plugins = util.options.options.plugins || [],
        pluginsWithoutItemset = _(plugins).without("itemset");

    describe("The parser", function () {
        it("should gracefully handle itemset when the itemset plugin is disabled", function (done) {
            util.init({
                plugins: pluginsWithoutItemset,
                core: {
                    form: TEST_XML_1, 
                    onReady: function () {
                        var mug = call("getMugByPath", "/data/state");
                        assert.equal(mug.__className, "Select");
                        var xml = call("createXML"),
                            doc = $($.parseXML(xml)),
                            instance = '<instance id="states" src="jr://fixture/item-list:state"></instance>';
                        assert.operator(xml.indexOf(instance), ">", -1);
                        assert.equal(doc.find('itemset').attr('nodeset'),
                                     "instance('states')/state_list/state");
                        done();
                    }
                }
            });
        });

        it("should not drop newlines in calculate conditions", function (done) {
            util.init({
                core: {
                    form: TEST_XML_2,
                    onReady: function () {
                        var mug = call("getMugByPath", "/data/question1");
                        assert.equal(mug.p.calculateAttr, 'concat("Line 1","\nLine 2")');
                        done();
                    }
                }
            });
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

    var TEST_XML_2 = util.xmlines('' +
    '<?xml version="1.0" encoding="UTF-8"?>\
    <h:html xmlns:h="http://www.w3.org/1999/xhtml" xmlns:orx="http://openrosa.org/jr/xforms" xmlns="http://www.w3.org/2002/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:vellum="http://commcarehq.org/xforms/vellum">\
        <h:head>\
            <h:title>Untitled Form</h:title>\
            <model>\
                <instance>\
                    <data xmlns:jrm="http://dev.commcarehq.org/jr/xforms" xmlns="http://openrosa.org/formdesigner/398C9010-61DC-42D3-8A85-B857AC3A9CA0" uiVersion="1" version="1" name="Untitled Form">\
                        <question1 />\
                    </data>\
                </instance>\
                <bind nodeset="/data/question1" calculate="concat(&quot;Line 1&quot;,&quot;&#10;Line 2&quot;)" />\
                <itext>\
                    <translation lang="en" default=""/>\
                </itext>\
            </model>\
        </h:head>\
        <h:body></h:body>\
    </h:html>');
});
