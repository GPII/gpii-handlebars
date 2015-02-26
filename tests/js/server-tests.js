// Test all server side modules (including basic template rendering)...
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");
var path = require("path");

var jqUnit  = fluid.require("jqUnit");
var request = require("request");

require("gpii-express");

require("../../src/js/server/dispatcher");
require("../../src/js/server/handlebars");
require("../../src/js/common/helper");
require("../../src/js/common/jsonify");
require("../../src/js/common/md-common");
require("../../src/js/server/inline");
require("../../src/js/server/md-server");

var viewDir = path.resolve(__dirname, "../views");

// Set up a test instance of express with all of "our" modules.
//
// We include the standard middleware from gpii.express to ensure that it does not cause problems with any of "our" modules...
var testServer = gpii.express({
    config:  {
        "express": {
            "port" :   6984,
            "baseUrl": "http://localhost:6984/",
            "views":   viewDir,
            "session": {
                "secret": "Printer, printer take a hint-ter."
            }
        }
    },
    "model": {
        myvar:    "modelvariable",
        json:     { "foo": "bar" },
        markdown: "*this works*"
    },
    components: {
        "json": {
            "type": "gpii.express.middleware.bodyparser.json"
        },
        "urlencoded": {
            "type": "gpii.express.middleware.bodyparser.urlencoded"
        },
        "cookieparser": {
            "type": "gpii.express.middleware.cookieparser"
        },
        "session": {
            "type": "gpii.express.middleware.session"
        },
        inline: {
            type: "gpii.express.hb.inline"
        },
        dispatcher: {
            type: "gpii.express.hb.dispatcher",
            options: {
                model: "{gpii.express}.model"
            }
        },
        handlebars: {
            type: "gpii.express.hb"
        }
    }
});

testServer.isSaneResponse = function (jqUnit, error, response, body) {
    jqUnit.assertNull("There should be no errors.", error);

    jqUnit.assertEquals("The response should have a reasonable status code", 200, response.statusCode);
    if (response.statusCode !== 200) {
        console.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};

testServer.runTests = function () {
    jqUnit.module("Tests for inlining of templates...");

    jqUnit.asyncTest("Confirm that template content is inlined...", function () {
        request.get(testServer.options.config.express.baseUrl + "inline", function (error, response, body) {
            jqUnit.start();

            testServer.isSaneResponse(jqUnit, error, response, body);

            if (body) {
                var templateRegexp = /type="text\/x-handlebars-template">/gi;
                var matches = body.match(templateRegexp);

                jqUnit.assertNotNull("There should be templates found in the body.", matches);
                if (matches) {
                    // TODO:  This will need to be updated as we add templates.  If it comes up often, refactor.
                    jqUnit.assertTrue("There should be at least three templates in the returned source.", matches.length > 3);
                }
            }
        });
    });

    jqUnit.module("Tests for dispatcher...");

    // Test the following variations:
    //
    //   1. The default home page with the default layout
    //   2. A custom page with matching layout
    //   3. A custom page with no matching layout
    //
    //  All variations should test partials and variables
    var pages = ["custom", "custom-no-matching-layout"];

    pages.forEach(function (page) {
        jqUnit.asyncTest("Test template handling dispatcher for page '" + page + "' ...", function () {
            request.get(testServer.options.config.express.baseUrl + "dispatcher/" + page + "?myvar=queryvariable", function (error, response, body) {
                jqUnit.start();

                testServer.isSaneResponse(jqUnit, error, response, body);

                jqUnit.assertNotNull("There should be layout content in the body...",         body.match(/from the layout/));
                jqUnit.assertNotNull("There should be page content in the body...",           body.match(/from the page/));
                jqUnit.assertNotNull("There should be partial content in the body...",        body.match(/from the partial/));

                var mdRegexp = /<p><em>this works<\/em><\/p>/i;
                jqUnit.assertNotNull("The results should contain transformed markdown.", body.match(mdRegexp));

                jqUnit.assertNotNull("There should be model variable content in the body...", body.match(/modelvariable/));
                jqUnit.assertNotNull("There should be query variable content in the body...", body.match(/queryvariable/));

                jqUnit.assertTrue("There should be jsonify content in the body...", body.indexOf(JSON.stringify(testServer.dispatcher.model.json)) !== -1);
            });
        });
    });

    jqUnit.asyncTest("Test 404 handling for dispatcher...", function () {
        request.get(testServer.options.config.express.baseUrl + "dispatcher/bogus", function (error, response) {
            jqUnit.start();

            jqUnit.assertNull("There should be no errors...", error);
            jqUnit.assertEquals("The status code should be 404...", 404, response.statusCode);
        });
    });
};

testServer.runTests();


