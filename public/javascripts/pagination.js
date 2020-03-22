$(document).ready(function(){
	if($("nav").length > 0) {
		console.log($("nav ul li.active").children("span").text());
		var pageNo = parseInt($("nav ul li.active").children("span.page-link").text());
		var numDishes = $("div.row").children("div.sm-col-3").length;
		for (var i = 0; i < numDishes; i++) {
			if(i >= (pageNo - 1) * 3 && i < pageNo * 3) {
				$("#dish" + i).show();
			} else {
				$("#dish" + i).hide();
			}
		}
	}

	$("li").on("click", "a.page-link", function(e){
		e.preventDefault();
		var prePageNo = parseInt($("nav ul li.active").children().text());
		var pageNo = 0;
		if ($(this).text() == "Previous") {
			pageNo = prePageNo - 1;
		} else if($(this).text() == "Next") {
			pageNo = prePageNo + 1;
		} else {
			pageNo = parseInt($(this).text());
		}	
		var currentParentLiSelector = "ul li:nth-child(" + (pageNo + 1)  + ")";

		$("nav ul li.active").empty();
		$("nav ul li.active").append("<a></a>");
		$("nav ul li.active").children().addClass("page-link").attr("href", "#").text(prePageNo);
		$("nav ul li.active").removeClass("active");
		if (prePageNo == 1) {
			$("nav ul").children().first().empty();
			$("nav ul").children().first().append("<a></a>");
			$("nav ul").children().first().children().addClass("page-link").attr("href", "#").text("Previous");
			$("nav ul").children().first().removeClass("disabled");
		} else if(prePageNo == $("nav ul").children().length - 2) {
			$("nav ul").children().last().empty();
			$("nav ul").children().last().append("<a></a>");
			$("nav ul").children().last().children().addClass("page-link").attr("href", "#").text("Next");
			$("nav ul").children().last().removeClass("disabled");
		}

		var parentLi = $(currentParentLiSelector);
		parentLi.empty();
		parentLi.append("<span></span>");
		parentLi.children().addClass("page-link").text(pageNo);
		parentLi.addClass("active");
		if (pageNo == 1) {
			$("nav ul").children().first().addClass("disabled");
			$("nav ul").children().first().empty();
			$("nav ul").children().first().append("<span></span>");
			$("nav ul").children().first().children().addClass("page-link").text("Previous");
		} else if(pageNo == $("nav ul").children().length - 2) {
			$("nav ul").children().last().addClass("disabled");
			$("nav ul").children().last().empty();
			$("nav ul").children().last().append("<span></span>");
			$("nav ul").children().last().children().addClass("page-link").text("Next");
		}

		var pageNo = parseInt($("nav ul li.active").children("span.page-link").text());
		var numDishes = $("div.row").children("div.sm-col-3").length;
		for (var i = 0; i < numDishes; i++) {
			if(i >= (pageNo - 1) * 3 && i < pageNo * 3) {
				$("#dish" + i).show();
			} else {
				$("#dish" + i).hide();
			}
		}
	});
	// var ntd = $("#newtodo").val();
	// $("ul").append("<li>" + ntd + "</li>");
	// $("ul li:last").addClass("todolist-item-padding").prepend("<i></i>");
	// $("ul li:last i").addClass("fa fa-trash text-white").hide();
	// $("#newtodo").val("");

	// var spanUsernameInfo = document.createElement("span");
	// $(spanUsernameInfo).attr("id", "spanUsernameInfo");
	// $(spanUsernameInfo).css("display", "none");
	// $("#username").after(spanUsernameInfo);
	// var usernameAvailable = false;

	// var spanPasswordInfo = document.createElement("span");
	// $(spanPasswordInfo).attr("id", "spanPasswordInfo");
	// $(spanPasswordInfo).css("display", "none");
	// $("#password").after(spanPasswordInfo);
	// var passwordAvailable = false;

	// $("#username").blur(function(){
	// 	if ($(this).val() == "") {
	// 		$(spanUsernameInfo).text("Username cannot be empty").css("display", "inline").removeClass("text-info").addClass("text-danger");
	// 		usernameAvailable = false;
	// 	} else {
	// 		$.ajax({
	// 			type: "GET",
	// 			url: "existeduser?username=" + $(this).val(),
	// 			success: function(notExist){
	// 				if (notExist) {
	// 					$(spanUsernameInfo).text("Username available").css("display", "inline").removeClass("text-danger").addClass("text-info");
	// 					usernameAvailable = true;
	// 				} else {
	// 					$(spanUsernameInfo).text("Username existed").css("display", "inline").removeClass("text-info").addClass("text-danger");
	// 					usernameAvailable = false;
	// 				}
	// 			}
	// 		});
	// 	}
	// });

	// $("#password").blur(function(){
	// 	if ($(this).val() == "") {
	// 		$(spanPasswordInfo).text("Password cannot be empty").css("display", "inline").removeClass("text-info").addClass("text-danger");
	// 		passwordAvailable = false;
	// 	} else {
	// 		if($(this).val().length >= 5) {
	// 			$(spanPasswordInfo).text("Password OK").css("display", "inline").removeClass("text-danger").addClass("text-info");
	// 			passwordAvailable = true;
	// 		} else {
	// 			$(spanPasswordInfo).text("Password at least five characters long").css("display", "inline").removeClass("text-info").addClass("text-danger");
	// 			passwordAvailable = false;
	// 		}
	// 	}
	// });

	// $("form").submit(function(e){
	// 	if (!usernameAvailable || !passwordAvailable) {
	// 		e.preventDefault();
	// 		if (!usernameAvailable) {
	// 			$("#username").focus();
	// 		} else {
	// 			$("#password").focus();
	// 		}
	// 	}
	// });
});
