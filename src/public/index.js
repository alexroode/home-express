import "bootstrap";
import "parsleyjs";
global.$ = require("jquery");

$(function () {
    $("#contact-form").parsley({
        errorClass: "is-invalid",
        successClass: "is-valid",
        classHandler: field => field.$element,
        errorsWrapper: '<div class="invalid-feedback"></div>',
        errorTemplate: "<div></div>"
    });

    $("#contact-form").submit(function (e) {
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
    }).then(_ => {
        form.trigger("reset");
        form.parsley().reset();
        showSuccess();
    }).catch(_ => {
        showError();
    }).always(() => {
        submitButton.prop("disabled", false);
    });
}