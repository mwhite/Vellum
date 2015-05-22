// NOTE! Duplicated in require-config.js for bundles config.

define([
    'jquery',
    'underscore',
    'vellum/core',
    'vellum/ignoreButRetain',
    'vellum/intentManager',
    'vellum/itemset',
    'vellum/javaRosa',
    'vellum/lock',
    'vellum/uploader',
    'vellum/window',
    'vellum/polyfills'
], function (
    $,
    _,
    Vellum
) {

    // Plugins that are always enabled.
    var coreExtensions = [
        'ignore',
        'intents',
        'javaRosa',
        'lock',
        'uploader',
        'windowManager'
    ],
        instances = [];

    $.fn.vellum = function (options) {
        var isMethodCall = typeof options === 'string',
            args = Array.prototype.slice.call(arguments, 1),
            retVal;

        if (isMethodCall) {
            this.each(function () {
                var instanceId = $.data(this, "vellum_instance_id"),
                    instance = instances[instanceId];
                //console.error("instance", instance, options);
                retVal = instance[options].apply(instance, args);
            });
            return retVal;
        } else {
            // Instantiate an instance for each element in the jquery object set
            // passed.  In practice, it's unlikely that you'd ever want to
            // instantiate multiple instances at once.
            this.each(function () {
                options.extensions = _.union(coreExtensions, options.extensions || []);
                options.core.$f = $(this);
                //var instance = new $.vellum._instance($(this), options),
                // todo
                // instance.$f = $(this);
                var instance = Vellum.makeInstance(options),
                    instanceId = $.data(this, "vellum_instance_id");
                if (instanceId === undefined) {
                    instances.push({});
                    instanceId = instances.length - 1;
                }
                $.data(this, "vellum_instance_id", instanceId);
                instances[instanceId] = instance;
                instance.postInit();
            });
            return this;
        }
    };
});
