//login & registration functions
var Login_service = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : base_url;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

   
    this.login_member = function(personnel_username, personnel_password) {
		var request = url + "login/login_member/" + personnel_username + "/" + personnel_password;
  
        return $.ajax({url: request});
    }
    this.get_member_details = function(member_no){
    	var request = url + "login/get_member_information/" + member_no;
        return $.ajax({url: request});
    }
    this.getProfileDetails = function() {
		var request = url + "login/get_client_profile";
        return $.ajax({url: request});
    }

    this.get_time_reports = function(){
    	var request = url + "reports/all_transactions";
        return $.ajax({url: request});
    }
    this.get_department_reports = function(){
    	var request = url + "reports/department_reports";
        return $.ajax({url: request});
    }
    this.get_doctors_reports = function(){
    	var request = url + "reports/doctor_reports";
        return $.ajax({url: request});
    }
    
    this.get_cash_reports = function(){
    	var request = url + "reports/cash_report";
        return $.ajax({url: request});
    }
    
    this.get_debtors_reports = function(){
    	var request = url + "reports/debtors_report";
        return $.ajax({url: request});
    }
    this.get_petty_cash = function(){
    	var request = url + "reports/petty_cash";
        return $.ajax({url: request});
    }
    
    this.search_transactions = function(visit_type_id,visit_date_from,visit_date_to,branch_code){
    	var request = url + "reports/search_transactions/"+visit_type_id+"/"+personnel_id+"/"+visit_date_from+"/"+visit_date_to+"/"+branch_code;

        return $.ajax({url: request});
    }
    this.search_debtors = function(visit_type_id,visit_date_from,visit_date_to,branch_code){
    	var request = url + "reports/search_debtors/"+visit_type_id+"/"+personnel_id+"/"+visit_date_from+"/"+visit_date_to+"/"+branch_code;

        return $.ajax({url: request});
    }
    this.search_cash_reports = function(visit_type_id,visit_date_from,visit_date_to,branch_code){
    	var request = url + "reports/search_cash_reports/"+visit_type_id+"/"+personnel_id+"/"+visit_date_from+"/"+visit_date_to+"/"+branch_code;

        return $.ajax({url: request});
    }

    this.search_department  = function(visit_date_from,visit_date_to){
    	var request = url + "reports/search_departments/"+visit_date_from+"/"+visit_date_to;

        return $.ajax({url: request});
    }
    this.search_petty_cash  = function(visit_date_from,visit_date_to){
    	var request = url + "reports/search_petty_cash/"+visit_date_from+"/"+visit_date_to;

        return $.ajax({url: request});
    }

    

}


/* Function to check for network connectivity */
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() 
{
    
    cordova.plugins.backgroundMode.setDefaults({ title:'ICPAK LIVE', text:'ICPAK LIVE', silent: true});
    
    //check if background action is enabled
    var enabled = cordova.plugins.backgroundMode.isEnabled();
    if(enabled === false)
    {
        // Enable background mode
        cordova.plugins.backgroundMode.enable();
    }

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        
        //clear other timeouts
        //clearTimeout(all_message_timeout);
        //clearTimeout(single_message_timeout);
        
    };
    
    cordova.plugins.backgroundMode.onfailure = function(errorCode) {
        cordova.plugins.backgroundMode.configure({
                        text:errorCode
                    });        
    };
}



//on page load if the user has logged in previously,
//log them in automatically
$(document).ready(function(){
		
	$("span[id=user_pass]").val("user");
	$( ".main-nav ul li#pro_social" ).css( "display", 'none' );
	$( ".main-nav ul li#profile" ).css( "display", 'none' );
	$( ".main-nav ul li#cpd_live" ).css( "display", 'none' );
	$( ".user-nav ul li#my_account" ).css( "display", 'none' );
	
	automatic_login();
});

function get_profile_details()
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	
	service.getProfileDetails().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			// $( "#news-of-icpak" ).addClass( "display_block" );
			$( "#my_profile" ).html( data.result );
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{

		}
	});
}

//automatic login
function automatic_login()
{
	$( "#loader-wrapper" ).removeClass( "display_none" );

	
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get member's credentials
	var member_no = window.localStorage.getItem("personnel_username");
	var password = window.localStorage.getItem("personnel_password");
	
	service.login_member(member_no, password).done(function (employees) {
		var data = jQuery.parseJSON(employees);//alert(email+' '+password);
		
		if(data.message == "success")
		{
			//display login items
			$( ".main-nav ul li#pro_social" ).css( "display", 'inline-block' );
			$( ".main-nav ul li#profile" ).css( "display", 'inline-block' );
			$( ".main-nav ul li#cpd_live" ).css( "display", 'inline-block' );
			// $( "#first_page" ).css( "display_none", 'inline-block' );
			// $( "#logged_in_page" ).css( "display", 'inline-block' );
			$( "#user_logged_in" ).html( '<h4>Welcome back Martin</h4>' );
			$( "#login_icon" ).html( '<a href="events.html" class="close-popup"><img src="images/icons/white/toogle.png" alt="" title="" onClick="get_event_items()"/><span>Events</span></a>' );
			$( "#profile_icon" ).html( '<li><a href="my-profile.html" class="close-popup"><img src="images/icons/white/user.png" alt="" title="" onClick="get_profile_details()"/><span>Profile</span></a></li>' );
		}
		else
		{
			$("#response").html('<div class="alert alert-danger center-align">'+data.result+'</div>').fadeIn( "slow");
		}
		
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
}


//Login member
$(document).on("submit","form#login_member",function(e)
{
	e.preventDefault();
	$("#login_response").html('').fadeIn( "slow");
	$("#loader-wrapper" ).removeClass( "display_none" );
	
	//check if there is a network connection
	var connection = true;//is_connected();
	
	if(connection === true)
	{
		var service = new Login_service();
		service.initialize().done(function () {
			console.log("Service initialized");
		});
		
		//get form values
		var username = $("input[name=personnel_username]").val();
		var password = $("input[name=personnel_password]").val();
		
			service.login_member(username, password).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data.message == "success")
			{
				//display login items
				service.get_member_details(username).done(function (employees) {
				var data_two = jQuery.parseJSON(employees);
				var first_name = data_two.member_first_name;
				$( "#user_logged_in" ).html( '<h4>Welcome back '+first_name+'</h4>' );
				});
	
				window.location.href = "home.html";
			}
			else
			{
				$("#login_response").html('<div class="alert alert-danger center-align">'+data.result+'</div>').fadeIn( "slow");
			}
			
			$( "#loader-wrapper" ).addClass( "display_none" );
        });
	}
	
	else
	{
		$("#login_response").html('<div class="alert alert-danger center-align">'+"No internet connection - please check your internet connection then try again"+'</div>').fadeIn( "slow");
		$( "#loader-wrapper" ).addClass( "display_none" );
	}
	return false;
});


$(document).on("submit","form#transaction_search",function(e)
{
	e.preventDefault();
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get form values
	var visit_type_id = $("select[name=visit_type_id]").val();

	var visit_date_from = $("input[name=visit_date_from]").val();
	var visit_date_to = $("input[name=visit_date_to]").val();
	var branch_code = $("select[name=branch_code]").val();

	if(visit_date_to == "")
	{
		visit_date_to = "_";
	}

	if(visit_date_from == "")
	{
		visit_date_from = "_";
	}

	service.search_transactions(visit_type_id,visit_date_from,visit_date_to,branch_code).done(function (employees) {
	var data = jQuery.parseJSON(employees);

	$("#transaction_reports_view").html(data).fadeIn( "slow");//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);

	//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
    });
});


$(document).on("submit","form#debtors_search",function(e)
{
	e.preventDefault();
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get form values
	var visit_type_id = $("select[name=visit_type_id]").val();

	var visit_date_from = $("input[name=visit_date_from]").val();
	var visit_date_to = $("input[name=visit_date_to]").val();
	var branch_code = $("select[name=branch_code]").val();

	if(visit_date_to == "")
	{
		visit_date_to = "_";
	}

	if(visit_date_from == "")
	{
		visit_date_from = "_";
	}

	service.search_debtors(visit_type_id,visit_date_from,visit_date_to,branch_code).done(function (employees) {
	var data = jQuery.parseJSON(employees);

	$("#transaction_reports_view").html(data).fadeIn( "slow");

	//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
    });
});

$(document).on("submit","form#cash_search",function(e)
{
	e.preventDefault();
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get form values
	var visit_type_id = $("select[name=visit_type_id]").val();

	var visit_date_from = $("input[name=visit_date_from]").val();
	var visit_date_to = $("input[name=visit_date_to]").val();
	var branch_code = $("select[name=branch_code]").val();

	if(visit_date_to == "")
	{
		visit_date_to = "_";
	}

	if(visit_date_from == "")
	{
		visit_date_from = "_";
	}

	service.search_cash_reports(visit_type_id,visit_date_from,visit_date_to,branch_code).done(function (employees) {
	var data = jQuery.parseJSON(employees);

	$("#transaction_reports_view").html(data).fadeIn( "slow");

	//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
    });
});

$(document).on("submit","form#department_search",function(e)
{
	e.preventDefault();
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get form values
	var visit_date_from = $("input[name=visit_date_from]").val();
	var visit_date_to = $("input[name=visit_date_to]").val();

	if(visit_date_to == "")
	{
		visit_date_to = "_";
	}

	if(visit_date_from == "")
	{
		visit_date_from = "_";
	}

	service.search_department(visit_date_from,visit_date_to).done(function (employees) {
	var data = jQuery.parseJSON(employees);

	$("#transaction_reports_view").html(data).fadeIn( "slow");

	//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
    });
});
$(document).on("submit","form#petty_cash_search",function(e)
{
	e.preventDefault();
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get form values
	var visit_date_from = $("input[name=date_from]").val();
	var visit_date_to = $("input[name=date_to]").val();

	if(visit_date_to == "")
	{
		visit_date_to = "_";
	}

	if(visit_date_from == "")
	{
		visit_date_from = "_";
	}

	service.search_petty_cash(visit_date_from,visit_date_to).done(function (employees) {
	var data = jQuery.parseJSON(employees);

	$("#transaction_reports_view").html(data).fadeIn( "slow");

	//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
    });
});


//get a logged in user's details
function get_time_reports()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_time_reports().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});
}

function get_department_reports()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_department_reports().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});
}
function get_doctors_reports()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_doctors_reports().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});	
}

function get_cash_reports()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_cash_reports().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});	
}


function get_debtors_reports()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_debtors_reports().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});	
}


function get_petty_cash()
{
	var service = new Login_service();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
		service.get_petty_cash().done(function (employees) {
			
		var data = jQuery.parseJSON(employees);

		$("#transaction_reports_view").html(data).fadeIn( "slow");

		//initialize datepicker
		(function( $ ) {

			'use strict';

			if ( $.isFunction($.fn[ 'datepicker' ]) ) {

				$(function() {
					$('[data-plugin-datepicker]').each(function() {
						var $this = $( this ),
							opts = {};

						var pluginOptions = $this.data('plugin-options');
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginDatePicker(opts);
					});
				});

			}

		}).apply(this, [ jQuery ]);
		
	});	
}






