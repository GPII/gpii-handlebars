/* eslint-env browser */
(function () {
    "use strict";
    // Test all "template aware" components.
    //
    // This is a test component that is meant to be included in a client-side document.
    //
    /* global fluid */
    fluid.registerNamespace("gpii.tests.templateFormControl");

    fluid.defaults("gpii.tests.templateFormControl", {
        gradeNames: ["gpii.handlebars.templateAware.serverAware", "gpii.handlebars.templateFormControl"],
        templateKeys: {
            success: "common-success",
            error:   "common-error"
        },
        rules: {
            successResponseToModel: {
                successMessage: { literalValue: "The response was successful..." }
            },
            errorResponseToModel: {
                errorMessage: { literalValue: "The response was not successful..." }
            }
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForSuccess", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url:    "/content/json/success.json"
        },
        model: {
            buttonName: "Succeed"
        },
        templateKeys: {
            initial: "form-success-initial",
            success: "form-success"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForGetSuccess", {
        gradeNames: ["gpii.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            method: "GET"
        },
        model: {
            buttonName: "Get Successful"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringifySuccess", {
        gradeNames: ["gpii.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            url:      "/content/stringifySuccess.txt",
            dataType: "json"
        },
        model: {
            buttonName: "Stringify Succeed"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringSuccess", {
        gradeNames: ["gpii.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            url:      "/content/stringSuccess.txt"
        },
        rules: {
            successResponseToModel: {
                ok:             false,
                successMessage: "responseText"
            }
        },
        model: {
            buttonName: "String Succeed"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/error"
        },
        model: {
            buttonName: "Fail"
        },
        templateKeys: {
            initial: "form-failure-initial"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringifyFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/errorJsonString"
        },
        model: {
            buttonName: "Stringify Fail"
        },
        templateKeys: {
            initial: "form-failure-initial"
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/errorString"
        },
        model: {
            buttonName: "String Fail"
        },
        rules: {
            errorResponseToModel: {
                ok:           false,
                errorMessage: "responseText"
            }
        },
        templateKeys: {
            initial: "form-failure-initial"
        }
    });
})();
