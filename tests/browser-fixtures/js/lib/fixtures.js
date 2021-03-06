(function (fluid) {
    "use strict";

    /*

        An overlay on the default templateAware.serverResourceAware grade which forces the message locale to `en-GB` to
        avoid inconsistencies when running tests on various machines.

     */
    fluid.defaults("fluid.tests.handlebars.templateAware.serverResourceAware", {
        gradeNames: ["fluid.handlebars.templateAware.serverResourceAware"],
        resources: {
            messages: {
                url: "/messages?locale=en-GB"
            }
        }
    });
})(fluid);
