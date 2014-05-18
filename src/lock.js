/*
 * Locked Questions plugin.
 *
 * Lets you lock questions by setting vellum:lock on their bind.
 *
 *    'node':  The question can't be deleted or renamed, or moved to a different
 *         parent.  Everything else can be changed.
 *    'value': The only thing that can be changed is itext IDs and itext values.
 *    'none': same as nothing
 *
 * Locking is not recursive; you must lock a node's entire hierarchy if you
 * really don't want it to be moved.
 *
 * Spec:
 * https://docs.google.com/document/d/1g4o3_OQfAYHjHdw7m7WcIAIRTomRV48yRQayL31jvIc
 */
define([
    'require',
    'jquery'
], function (
    require,
    $
) {

    var deferred = new $.Deferred();

require(['promise!./core'], function () {
    $.vellum.plugin("lock", {}, {
        loadXML: function (xml) {
            this.__callOld();
            this.data.lock.locks = {};
        },
        parseBindElement: function (el, path) {
            this.__callOld();
            var locked = el.attr('vellum:lock');
            if (locked && locked !== 'none') {
                this.data.lock.locks[path] = locked;
            }
        },
        isPropertyLocked: function (mugPath, propertyPath) {
            if (this.__callOld()) {
                return true;
            }
            var lock = this.data.lock.locks[mugPath];
            if (!lock) { 
                return false; 
            }

            if ((lock === 'node' || lock === 'value') && 
                propertyPath === 'dataElement/nodeID') 
            {
                return true;
            } else if (lock === 'value' && propertyPath.indexOf('ItextID') === -1) {
                return true;
            }

            return false;
        },
        isMugPathMoveable: function (mugPath) {
            return this.__callOld() && !this.data.lock.locks[mugPath];
        },
        isMugRemoveable: function (mug, mugPath) {
            return this.__callOld() && !this.data.lock.locks[mugPath];
        },
        isMugTypeChangeable: function (mug, mugPath) {
            return this.__callOld() && this.data.lock.locks[mugPath] !== 'value';
        }
    });

    deferred.resolve();
});

    return deferred;

});
