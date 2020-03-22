$(document).ready(function(){
	var spanUsernameInfo = document.createElement("span");
	$(spanUsernameInfo).attr("id", "spanUsernameInfo");
	$(spanUsernameInfo).css("display", "none");
	$("#username").after(spanUsernameInfo);
	var usernameAvailable = false;

	var spanPasswordInfo = document.createElement("span");
	$(spanPasswordInfo).attr("id", "spanPasswordInfo");
	$(spanPasswordInfo).css("display", "none");
	$("#password").after(spanPasswordInfo);
	var passwordAvailable = false;

	$("#username").blur(function(){
		if ($(this).val() == "") {
			$(spanUsernameInfo).text("Username cannot be empty").css("display", "inline").removeClass("text-info").addClass("text-danger");
			usernameAvailable = false;
		} else {
			$.ajax({
				type: "GET",
				url: "existeduser?username=" + $(this).val(),
				success: function(notExist){
					if (notExist) {
						$(spanUsernameInfo).text("Username available").css("display", "inline").removeClass("text-danger").addClass("text-info");
						usernameAvailable = true;
					} else {
						$(spanUsernameInfo).text("Username existed").css("display", "inline").removeClass("text-info").addClass("text-danger");
						usernameAvailable = false;
					}
				}
			});
		}
	});

	$("#password").blur(function(){
		if ($(this).val() == "") {
			$(spanPasswordInfo).text("Password cannot be empty").css("display", "inline").removeClass("text-info").addClass("text-danger");
			passwordAvailable = false;
		} else {
			if($(this).val().length >= 5) {
				$(spanPasswordInfo).text("Password OK").css("display", "inline").removeClass("text-danger").addClass("text-info");
				passwordAvailable = true;
			} else {
				$(spanPasswordInfo).text("Password at least five characters long").css("display", "inline").removeClass("text-info").addClass("text-danger");
				passwordAvailable = false;
			}
		}
	});

	$("form").submit(function(e){
		if (!usernameAvailable || !passwordAvailable) {
			e.preventDefault();
			if (!usernameAvailable) {
				$("#username").focus();
			} else {
				$("#password").focus();
			}
		}
	});
});
