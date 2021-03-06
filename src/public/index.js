import "bootstrap";
import "parsleyjs";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faHome, faEnvelope, faMusic, faUser } from '@fortawesome/free-solid-svg-icons'
global.$ = require("jquery");

library.add([faHome, faEnvelope, faMusic, faUser]);
dom.i2svg();

$(function () {
    $("#contact-form").parsley({
        errorClass: "is-invalid",
        successClass: "is-valid",
        classHandler: field => field.$element,
        errorsWrapper: '<div class="invalid-feedback"></div>',
        errorTemplate: "<div></div>"
    });

    $("#contact-form").on("submit", function (e) {
        const form = $(this);
        const submitButton = $("#submit-button");
        const siteKey = form.data("recaptcha-site-key");

        submitButton.prop("disabled", true);

        const promise = grecaptcha.execute(siteKey, {action: 'homepage'});
        promise.then(token => submitContactForm(form, submitButton, token),
            () => {
                submitButton.prop("disabled", false);
                showError();
            });
        return false;
    });
});

function showError() {
    $("#success-message").hide();
    $("#error-message").show();
}

function showSuccess() {
    $("#success-message").show();
    $("#error-message").hide();
}

function submitContactForm(form, submitButton, token) {
    const url = "/contact";
    let data = form
        .serializeArray()
        .reduce((data, pair) => { data[pair.name] = pair.value; return data }, {});

    data['g-recaptcha-response'] = token;

    $.ajax(url, {
        data : JSON.stringify(data),
        contentType : "application/json",
        type : "POST",
    }).then(() => {
        form.trigger("reset");
        form.parsley().reset();
        showSuccess();
    }).catch(() => {
        showError();
    }).always(() => {
        submitButton.prop("disabled", false);
    });
}