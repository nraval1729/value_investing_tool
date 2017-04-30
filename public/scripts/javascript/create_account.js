
function createAccount() {

    let email = $("#createEmail").val();
    let number = $("#createNumber").val();
    let password = $("#createPassword").val();
    let confirmPass = $("#createConfirm").val();

    if(password !== confirmPass) {
        console.log("Passwords do not match.");
    } else if (email.length == 0 || number.length == 0 || password.length == 0 || confirmPass.length == 0) {
        console.log("Must fill in all fields");
    } else {

        let postParameters = {
            email: email,
            number: number,
            password: password,
            confirmPass: confirmPass
        }

        $.post("/insert", postParameters, function(response) {

            if(response["message"] != "") {
                $("#alreadyEmail").html(response["message"]);
            } else {
                window.location = "/";
            }

        });

    }

}
