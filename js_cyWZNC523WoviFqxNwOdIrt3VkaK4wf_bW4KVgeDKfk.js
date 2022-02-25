(function($) {
    Drupal.behaviors.springboard_cookie = {
        attach: function(context, settings) {
            $('body').once(function() {
                // Is the Springboard cookie set on this client?
                var cookie = $.cookie(Drupal.settings.springboard_cookie.name);
                if (!cookie) {
                    // No cookie, so make sure cookies are enabled.
                    $.cookie('cookies_enabled', '1', { path: '/' });
                    if ($.cookie('cookies_enabled') == '1') {
                        // Call out to the server for a cookie.
                        $.post(
                            '/js/springboard_cookie/new_cookie',
                            {
                                js_callback: 'new_cookie',
                                js_module: 'springboard_cookie'
                            },
                            function(data, status) {
                                // Save the cookie to this client.
                                var settings = {
                                    expires: parseInt(data.expires),
                                    path: data.path
                                };
                                if (Drupal.settings.springboard_cookie.domain != '') {
                                    settings.domain = Drupal.settings.springboard_cookie.domain;
                                }
                                $.cookie(
                                    Drupal.settings.springboard_cookie.name,
                                    data.cookie,
                                    settings
                                );
                            }
                        );
                    }
                }

            })
        }
    };
})(jQuery);;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;

/**
 * JavaScript behaviors for the front-end display of webforms.
 */

(function ($) {

Drupal.behaviors.webform = Drupal.behaviors.webform || {};

Drupal.behaviors.webform.attach = function(context) {
  // Calendar datepicker behavior.
  Drupal.webform.datepicker(context);
};

Drupal.webform = Drupal.webform || {};

Drupal.webform.datepicker = function(context) {
  $('div.webform-datepicker').each(function() {
    var $webformDatepicker = $(this);
    var $calendar = $webformDatepicker.find('input.webform-calendar');

    // Ensure the page we're on actually contains a datepicker.
    if ($calendar.length == 0) { 
      return;
    }

    var startDate = $calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var endDate = $calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/, '$1').split('-');
    var firstDay = $calendar[0].className.replace(/.*webform-calendar-day-(\d).*/, '$1');
    // Convert date strings into actual Date objects.
    startDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
    endDate = new Date(endDate[0], endDate[1] - 1, endDate[2]);

    // Ensure that start comes before end for datepicker.
    if (startDate > endDate) {
      var laterDate = startDate;
      startDate = endDate;
      endDate = laterDate;
    }

    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();

    // Set up the jQuery datepicker element.
    $calendar.datepicker({
      dateFormat: 'yy-mm-dd',
      yearRange: startYear + ':' + endYear,
      firstDay: parseInt(firstDay),
      minDate: startDate,
      maxDate: endDate,
      onSelect: function(dateText, inst) {
        var date = dateText.split('-');
        $webformDatepicker.find('select.year, input.year').val(+date[0]).trigger('change');
        $webformDatepicker.find('select.month').val(+date[1]).trigger('change');
        $webformDatepicker.find('select.day').val(+date[2]).trigger('change');
      },
      beforeShow: function(input, inst) {
        // Get the select list values.
        var year = $webformDatepicker.find('select.year, input.year').val();
        var month = $webformDatepicker.find('select.month').val();
        var day = $webformDatepicker.find('select.day').val();

        // If empty, default to the current year/month/day in the popup.
        var today = new Date();
        year = year ? year : today.getFullYear();
        month = month ? month : today.getMonth() + 1;
        day = day ? day : today.getDate();

        // Make sure that the default year fits in the available options.
        year = (year < startYear || year > endYear) ? startYear : year;

        // jQuery UI Datepicker will read the input field and base its date off
        // of that, even though in our case the input field is a button.
        $(input).val(year + '-' + month + '-' + day);
      }
    });

    // Prevent the calendar button from submitting the form.
    $calendar.click(function(event) {
      $(this).focus();
      event.preventDefault();
    });
  });
}

})(jQuery);
;
(function (FrTotal, FrFee, $, undefined) {

  // Dynamically replaces the [js:formatted-donation-amount] token
  Drupal.behaviors.fundraiser_total = {
    attach: function (context, settings) {

      // Check if there is a token on the page.
      if (!$('span.js-formatted-donation-amount').length) {
        return;
      }

      // Start the token replacement.
      FrTotal.initializeVars();
      FrTotal.updateTotal(settings);

      // Define the event handlers for the total amount re-calculation.
      $('body').once('fundraiser-total', function() {
        FrTotalSetClickEvents(settings);
      });
    }
  };

  // Find the fields we need to calulate the total.
  FrTotal.initializeVars = function () {
    FrTotal.processingFeeField = $('input[name*="[processing_fee]"]');
    FrTotal.paymentMethodFields = $('input[name*="[payment_method]"]');
    FrTotal.recursMonthlyField = $('input[name*="recurs_monthly"]');
    FrTotal.otherAmountField = $('input[name*="[other_amount]"]');
    FrTotal.recurringOtherAmountField = $('input[name*="[recurring_other_amount]"]');
    FrTotal.donationAmountFields = $('input[name*="donation][amount]"]');
    FrTotal.donationRecurringAmountFields = $('input[name*="donation][recurring_amount]"]');
    FrTotal.donationQuarterlyFreqAmounts = $('input[name*="frequencies[sb_fs_quarterly_amount]"]');
    FrTotal.donationSemiAnnualFreqAmounts = $('input[name*="frequencies[sb_fs_semi_amount]"]');
    FrTotal.donationAnnuallyFreqAmounts = $('input[name*="frequencies[sb_fs_annually_amount]"]');
  };

  // Retrieve the current donation amount from webform fields.
  FrTotal.getCurrentAmount = function (settings) {

    var recursSelected = false;
    var recursSelect = FrTotal.recursMonthlyField;
    if (recursSelect) {
      var recursSelectType = recursSelect.attr('type');
    }
    var currentAmount = 0;
    // fundraiser.recurring_settings does not exist on billing update form.
    var dualAsk = (settings.fundraiser.recurring_settings) ? settings.fundraiser.recurring_settings.recurring_dual_ask_amounts : false;

    if (!settings.fundraiserTickets) {
      if (recursSelectType && recursSelectType == 'hidden') {
        if (recursSelect.val() !== 'NO_RECURR') {
          recursSelected = recursSelect.val();
        }
      }
      else {
        if (FrTotal.recursMonthlyField && FrTotal.recursMonthlyField.filter(':checked').val()) {
          recursSelected = FrTotal.recursMonthlyField.filter(':checked').val();
        }
      }

      if ((!recursSelected || recursSelected === 'NO_RECURR' || (dualAsk == false && recursSelected))) {

        currentAmount = FrTotal.donationAmountFields.filter(":checked").val();

        if (currentAmount == 'other') {
          currentAmount = FrTotal.otherAmountField.val();
        }
        else if (
          typeof currentAmount === 'undefined'
          && FrTotal.otherAmountField.length
          && ('other' == FrTotal.donationAmountFields.filter(":hidden").val() || !FrTotal.donationAmountFields.length)
        ) {
          currentAmount = FrTotal.otherAmountField.val();
        }
      }
      else {
        if (recursSelected === 'recurs') {
          currentAmount = FrTotal.donationRecurringAmountFields.filter(':checked').val();
        }

        if (recursSelected !== 'NO_RECURR') {
          currentAmount = FrTotal.donationRecurringAmountFields.filter(':checked').val();
        }

        if (settings.fundraiser.multi_frequency) {

          if (recursSelected === 'sb_fs_quarterly') {
            currentAmount = FrTotal.donationQuarterlyFreqAmounts.filter(':checked').val();
          }

          if (recursSelected === 'sb_fs_semi') {
            currentAmount = FrTotal.donationSemiAnnualFreqAmounts.filter(':checked').val();
          }

          if (recursSelected === 'sb_fs_annually') {
            currentAmount = FrTotal.donationAnnuallyFreqAmounts.filter(':checked').val();
          }
        }

        if (currentAmount == 'other') {
          currentAmount = FrTotal.recurringOtherAmountField.val();
        }
        else if (
          typeof currentAmount === 'undefined'
          && FrTotal.recurringOtherAmountField.length
          && ('other' == FrTotal.donationRecurringAmountFields.filter(":hidden").val() || !FrTotal.donationRecurringAmountFields.length)
        ) {
          // damn when does this happen?
          currentAmount = FrTotal.recurringOtherAmountField.val();
        }
      }
    }

    if (settings.fdNid) {
      currentAmount = Drupal.fundraiserDesignations.prototype.calcTotalMinusFee();
    }

    if (settings.fundraiserTickets) {
      currentAmount = Drupal.fundraiserTickets.prototype.calcTotalMinusFee();
    }

    if (isNaN(parseFloat(currentAmount))) {
      currentAmount = 0;
    }
    return currentAmount;
  };

  // Update the total.
  FrTotal.updateTotal = function (settings) {

    if (settings.fundraiser.next_donation_amount) {
      // We're on the sustainers billing update form.
      var donationAmount = settings.fundraiser.next_donation_amount;
    }
    else {
      // We're on a donation form.
      donationAmount = FrTotal.getCurrentAmount(settings);
      if (typeof(donationAmount) == "undefined") {
        donationAmount = 0;
      }
    }

    if (settings.fundraiserTickets) {
      FrTotal.tickets = Drupal.fundraiserTickets.prototype;
      if (typeof(settings.fundraiser.fundraiser_fee) == "undefined") {
        var addon = FrTotal.tickets.calcExtra();
        donationAmount = donationAmount + addon;
      }
    }

    if (typeof(settings.fundraiser.fundraiser_fee) != "undefined") {

      if (FrTotal.paymentMethodFields.attr('type') != "hidden") {
        var $method = FrTotal.paymentMethodFields.filter(':checked').val();
      }
      else {
        $method = FrTotal.paymentMethodFields.val();
      }

      if (typeof(settings.fundraiser.fundraiser_fee[$method]) !== "undefined" || $method === 'free_tickets') {
        if ($method !== 'free_tickets') {
          var feeSettings = settings.fundraiser.fundraiser_fee[$method];
          var processingFee = FrFee.getFee(feeSettings, donationAmount);
        }
        if (settings.fundraiserTickets) {
          addon = FrTotal.tickets.calcExtra();
          donationAmount = donationAmount + addon;
        }
        if ($.isNumeric(processingFee) && FrTotal.processingFeeField.is(':checked')) {
          donationAmount = parseFloat(donationAmount) + parseFloat(processingFee);
        }
      }
    }

    if (typeof(settings.premiums) !== "undefined") {
      // Check for shipping charge, if present add to donation amount.
      var premiumShipping = $('.form-item-selected-premium-id input:checked').parents('.form-type-radio').siblings('.shipping-amount').data('attribute-shipping-amount');

      if (premiumShipping) {
        donationAmount = parseFloat(premiumShipping.replace("$", "")) + parseFloat(donationAmount);
      }
    }

    if ($('span.js-formatted-donation-amount').length) {
      FrTotal.replaceToken(donationAmount);
    }

    // Trigger for other modules to hook into the calculation (Togetherpay,
    // hide/show disaclaimer based on total amount).
    $(document).trigger("donation-total-update", [donationAmount]);

    return donationAmount;
  };

  // Replace the token.
  FrTotal.replaceToken = function(donationAmount) {
    var settings = Drupal.settings;
    var symbol = settings.fundraiser.currency.symbol;
    var dec = settings.fundraiser.currency.decimals;
    var sep = settings.fundraiser.currency.decimal_separator;
    var thou = settings.fundraiser.currency.thousands_separator;
    var newAmount = symbol + (parseFloat(donationAmount)).formatMoney(dec, sep, thou);
    $('span.js-formatted-donation-amount').text(newAmount);
  };

  function FrTotalSetClickEvents(settings) {
    FrTotal.paymentMethodFields.on('change', function () {
      FrTotal.updateTotal(settings);
    });
    if (typeof FrTotal.processingFeeField !== "undefined") {
      FrTotal.processingFeeField.on('change', function () {
        FrTotal.updateTotal(settings);
      });
    }
    FrTotal.recursMonthlyField.on('change', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.otherAmountField.on('keyup', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.otherAmountField.on('focus', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.recurringOtherAmountField.on('keyup', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.donationAmountFields.on('change', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.donationRecurringAmountFields.on('change', function () {
      FrTotal.updateTotal(settings);
    });
    FrTotal.donationQuarterlyFreqAmounts.on('change', function(){
      FrTotal.updateTotal(settings);
    });
    FrTotal.donationSemiAnnualFreqAmounts.on('change', function(){
      FrTotal.updateTotal(settings);
    });
    FrTotal.donationAnnuallyFreqAmounts.on('change', function(){
      FrTotal.updateTotal(settings);
    });
  }

  Number.prototype.formatMoney = function(c, d, t) {
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

})(
  window.FundraiserTotal = window.FundraiserTotal || {},
  window.FundraiserFee = window.FundraiserFee || {},
  jQuery);
;
(function($) {
  Drupal.behaviors.springboardFraudToken = {
    attach: function (context, settings) {
      if (settings.springboard_fraud_token === undefined) {
        settings.springboard_fraud_token = {};
      }

      $('form input[name=springboard_fraud_token]', context).once('springboardFraudToken', function() {
        var formId = null;
        try {
          formId = $(this).siblings('input[name=form_id]').val();
          settings.springboard_fraud_token[formId] = null;

          $(this).siblings('input[name=springboard_fraud_js_detect]').val(1);
        }
        catch(err) {
          console.log('Could not find form_id element: ' + err);
        }

        if (!$(this).hasClass('springboardFraudToken-requested') && formId !== null) {
          $.post(
            settings.basePath + 'js/springboard_fraud/get_token',
            {
              js_module: 'springboard_fraud',
              js_callback: 'get_token',
              form_id: formId,
            },
            function(data, status) {
              $(this).addClass('springboardFraudToken-requested');
              settings.springboard_fraud_token[formId] = data.token;
            },
            'json'
          );
        }

        $(this).parents('form').submit(function () {
          $(this).find('input[name=springboard_fraud_token]').val(settings.springboard_fraud_token[formId]);
        });
      });
    }
  };
})(jQuery);
;
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(2($){$.c.f=2(p){p=$.d({g:"!@#$%^&*()+=[]\\\\\\\';,/{}|\\":<>?~`.- ",4:"",9:""},p);7 3.b(2(){5(p.G)p.4+="Q";5(p.w)p.4+="n";s=p.9.z(\'\');x(i=0;i<s.y;i++)5(p.g.h(s[i])!=-1)s[i]="\\\\"+s[i];p.9=s.O(\'|\');6 l=N M(p.9,\'E\');6 a=p.g+p.4;a=a.H(l,\'\');$(3).J(2(e){5(!e.r)k=o.q(e.K);L k=o.q(e.r);5(a.h(k)!=-1)e.j();5(e.u&&k==\'v\')e.j()});$(3).B(\'D\',2(){7 F})})};$.c.I=2(p){6 8="n";8+=8.P();p=$.d({4:8},p);7 3.b(2(){$(3).f(p)})};$.c.t=2(p){6 m="A";p=$.d({4:m},p);7 3.b(2(){$(3).f(p)})}})(C);',53,53,'||function|this|nchars|if|var|return|az|allow|ch|each|fn|extend||alphanumeric|ichars|indexOf||preventDefault||reg|nm|abcdefghijklmnopqrstuvwxyz|String||fromCharCode|charCode||alpha|ctrlKey||allcaps|for|length|split|1234567890|bind|jQuery|contextmenu|gi|false|nocaps|replace|numeric|keypress|which|else|RegExp|new|join|toUpperCase|ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('|'),0,{}));
;
/**
 * jQuery Validation Plugin 1.9.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function(c){c.extend(c.fn,{validate:function(a){if(this.length){var b=c.data(this[0],"validator");if(b)return b;this.attr("novalidate","novalidate");b=new c.validator(a,this[0]);c.data(this[0],"validator",b);if(b.settings.onsubmit){a=this.find("input, button");a.filter(".cancel").click(function(){b.cancelSubmit=true});b.settings.submitHandler&&a.filter(":submit").click(function(){b.submitButton=this});this.submit(function(d){function e(){if(b.settings.submitHandler){if(b.submitButton)var f=c("<input type='hidden'/>").attr("name",
b.submitButton.name).val(b.submitButton.value).appendTo(b.currentForm);b.settings.submitHandler.call(b,b.currentForm);b.submitButton&&f.remove();return false}return true}b.settings.debug&&d.preventDefault();if(b.cancelSubmit){b.cancelSubmit=false;return e()}if(b.form()){if(b.pendingRequest){b.formSubmitted=true;return false}return e()}else{b.focusInvalid();return false}})}return b}else a&&a.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing")},valid:function(){if(c(this[0]).is("form"))return this.validate().form();
else{var a=true,b=c(this[0].form).validate();this.each(function(){a&=b.element(this)});return a}},removeAttrs:function(a){var b={},d=this;c.each(a.split(/\s/),function(e,f){b[f]=d.attr(f);d.removeAttr(f)});return b},rules:function(a,b){var d=this[0];if(a){var e=c.data(d.form,"validator").settings,f=e.rules,g=c.validator.staticRules(d);switch(a){case "add":c.extend(g,c.validator.normalizeRule(b));f[d.name]=g;if(b.messages)e.messages[d.name]=c.extend(e.messages[d.name],b.messages);break;case "remove":if(!b){delete f[d.name];
return g}var h={};c.each(b.split(/\s/),function(j,i){h[i]=g[i];delete g[i]});return h}}d=c.validator.normalizeRules(c.extend({},c.validator.metadataRules(d),c.validator.classRules(d),c.validator.attributeRules(d),c.validator.staticRules(d)),d);if(d.required){e=d.required;delete d.required;d=c.extend({required:e},d)}return d}});c.extend(c.expr[":"],{blank:function(a){return!c.trim(""+a.value)},filled:function(a){return!!c.trim(""+a.value)},unchecked:function(a){return!a.checked}});c.validator=function(a,
b){this.settings=c.extend(true,{},c.validator.defaults,a);this.currentForm=b;this.init()};c.validator.format=function(a,b){if(arguments.length==1)return function(){var d=c.makeArray(arguments);d.unshift(a);return c.validator.format.apply(this,d)};if(arguments.length>2&&b.constructor!=Array)b=c.makeArray(arguments).slice(1);if(b.constructor!=Array)b=[b];c.each(b,function(d,e){a=a.replace(RegExp("\\{"+d+"\\}","g"),e)});return a};c.extend(c.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",
validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:c([]),errorLabelContainer:c([]),onsubmit:true,ignore:":hidden",ignoreTitle:false,onfocusin:function(a){this.lastActive=a;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass);this.addWrapper(this.errorsFor(a)).hide()}},onfocusout:function(a){if(!this.checkable(a)&&(a.name in this.submitted||!this.optional(a)))this.element(a)},
onkeyup:function(a){if(a.name in this.submitted||a==this.lastElement)this.element(a)},onclick:function(a){if(a.name in this.submitted)this.element(a);else a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).addClass(b).removeClass(d):c(a).addClass(b).removeClass(d)},unhighlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).removeClass(b).addClass(d):c(a).removeClass(b).addClass(d)}},setDefaults:function(a){c.extend(c.validator.defaults,
a)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:c.validator.format("Please enter no more than {0} characters."),
minlength:c.validator.format("Please enter at least {0} characters."),rangelength:c.validator.format("Please enter a value between {0} and {1} characters long."),range:c.validator.format("Please enter a value between {0} and {1}."),max:c.validator.format("Please enter a value less than or equal to {0}."),min:c.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){function a(e){var f=c.data(this[0].form,"validator"),g="on"+e.type.replace(/^validate/,
"");f.settings[g]&&f.settings[g].call(f,this[0],e)}this.labelContainer=c(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||c(this.currentForm);this.containers=c(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=this.groups={};c.each(this.settings.groups,function(e,f){c.each(f.split(/\s/),function(g,h){b[h]=e})});var d=
this.settings.rules;c.each(d,function(e,f){d[e]=c.validator.normalizeRule(f)});c(this.currentForm).validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",a).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",
a);this.settings.invalidHandler&&c(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){this.checkForm();c.extend(this.submitted,this.errorMap);this.invalid=c.extend({},this.errorMap);this.valid()||c(this.currentForm).triggerHandler("invalid-form",[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(a){this.lastElement=
a=this.validationTargetFor(this.clean(a));this.prepareElement(a);this.currentElements=c(a);var b=this.check(a);if(b)delete this.invalid[a.name];else this.invalid[a.name]=true;if(!this.numberOfInvalids())this.toHide=this.toHide.add(this.containers);this.showErrors();return b},showErrors:function(a){if(a){c.extend(this.errorMap,a);this.errorList=[];for(var b in a)this.errorList.push({message:a[b],element:this.findByName(b)[0]});this.successList=c.grep(this.successList,function(d){return!(d.name in a)})}this.settings.showErrors?
this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){c.fn.resetForm&&c(this.currentForm).resetForm();this.submitted={};this.lastElement=null;this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b=0,d;for(d in a)b++;return b},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==
0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{c(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(a){}},findLastActive:function(){var a=this.lastActive;return a&&c.grep(this.errorList,function(b){return b.element.name==a.name}).length==1&&a},elements:function(){var a=this,b={};return c(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&
a.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in b||!a.objectLength(c(this).rules()))return false;return b[this.name]=true})},clean:function(a){return c(a)[0]},errors:function(){return c(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=c([]);this.toHide=c([]);this.currentElements=c([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},
prepareElement:function(a){this.reset();this.toHide=this.errorsFor(a)},check:function(a){a=this.validationTargetFor(this.clean(a));var b=c(a).rules(),d=false,e;for(e in b){var f={method:e,parameters:b[e]};try{var g=c.validator.methods[e].call(this,a.value.replace(/\r/g,""),a,f.parameters);if(g=="dependency-mismatch")d=true;else{d=false;if(g=="pending"){this.toHide=this.toHide.not(this.errorsFor(a));return}if(!g){this.formatAndAdd(a,f);return false}}}catch(h){this.settings.debug&&window.console&&console.log("exception occured when checking element "+
a.id+", check the '"+f.method+"' method",h);throw h;}}if(!d){this.objectLength(b)&&this.successList.push(a);return true}},customMetaMessage:function(a,b){if(c.metadata){var d=this.settings.meta?c(a).metadata()[this.settings.meta]:c(a).metadata();return d&&d.messages&&d.messages[b]}},customMessage:function(a,b){var d=this.settings.messages[a];return d&&(d.constructor==String?d:d[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(arguments[a]!==undefined)return arguments[a]},defaultMessage:function(a,
b){return this.findDefined(this.customMessage(a.name,b),this.customMetaMessage(a,b),!this.settings.ignoreTitle&&a.title||undefined,c.validator.messages[b],"<strong>Warning: No message defined for "+a.name+"</strong>")},formatAndAdd:function(a,b){var d=this.defaultMessage(a,b.method),e=/\$?\{(\d+)\}/g;if(typeof d=="function")d=d.call(this,b.parameters,a);else if(e.test(d))d=jQuery.format(d.replace(e,"{$1}"),b.parameters);this.errorList.push({message:d,element:a});this.errorMap[a.name]=d;this.submitted[a.name]=
d},addWrapper:function(a){if(this.settings.wrapper)a=a.add(a.parent(this.settings.wrapper));return a},defaultShowErrors:function(){for(var a=0;this.errorList[a];a++){var b=this.errorList[a];this.settings.highlight&&this.settings.highlight.call(this,b.element,this.settings.errorClass,this.settings.validClass);this.showLabel(b.element,b.message)}if(this.errorList.length)this.toShow=this.toShow.add(this.containers);if(this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);
if(this.settings.unhighlight){a=0;for(b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass)}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return c(this.errorList).map(function(){return this.element})},showLabel:function(a,b){var d=this.errorsFor(a);if(d.length){d.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
d.attr("generated")&&d.html(b)}else{d=c("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(a),generated:true}).addClass(this.settings.errorClass).html(b||"");if(this.settings.wrapper)d=d.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();this.labelContainer.append(d).length||(this.settings.errorPlacement?this.settings.errorPlacement(d,c(a)):d.insertAfter(a))}if(!b&&this.settings.success){d.text("");typeof this.settings.success=="string"?d.addClass(this.settings.success):this.settings.success(d)}this.toShow=
this.toShow.add(d)},errorsFor:function(a){var b=this.idOrName(a);return this.errors().filter(function(){return c(this).attr("for")==b})},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(a){if(this.checkable(a))a=this.findByName(a.name).not(this.settings.ignore)[0];return a},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(a){var b=this.currentForm;return c(document.getElementsByName(a)).map(function(d,
e){return e.form==b&&e.name==a&&e||null})},getLength:function(a,b){switch(b.nodeName.toLowerCase()){case "select":return c("option:selected",b).length;case "input":if(this.checkable(b))return this.findByName(b.name).filter(":checked").length}return a.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):true},dependTypes:{"boolean":function(a){return a},string:function(a,b){return!!c(a,b.form).length},"function":function(a,b){return a(b)}},optional:function(a){return!c.validator.methods.required.call(this,
c.trim(a.value),a)&&"dependency-mismatch"},startRequest:function(a){if(!this.pending[a.name]){this.pendingRequest++;this.pending[a.name]=true}},stopRequest:function(a,b){this.pendingRequest--;if(this.pendingRequest<0)this.pendingRequest=0;delete this.pending[a.name];if(b&&this.pendingRequest==0&&this.formSubmitted&&this.form()){c(this.currentForm).submit();this.formSubmitted=false}else if(!b&&this.pendingRequest==0&&this.formSubmitted){c(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=
false}},previousValue:function(a){return c.data(a,"previousValue")||c.data(a,"previousValue",{old:null,valid:true,message:this.defaultMessage(a,"remote")})}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(a,b){a.constructor==String?this.classRuleSettings[a]=b:c.extend(this.classRuleSettings,
a)},classRules:function(a){var b={};(a=c(a).attr("class"))&&c.each(a.split(" "),function(){this in c.validator.classRuleSettings&&c.extend(b,c.validator.classRuleSettings[this])});return b},attributeRules:function(a){var b={};a=c(a);for(var d in c.validator.methods){var e;if(e=d==="required"&&typeof c.fn.prop==="function"?a.prop(d):a.attr(d))b[d]=e;else if(a[0].getAttribute("type")===d)b[d]=true}b.maxlength&&/-1|2147483647|524288/.test(b.maxlength)&&delete b.maxlength;return b},metadataRules:function(a){if(!c.metadata)return{};
var b=c.data(a.form,"validator").settings.meta;return b?c(a).metadata()[b]:c(a).metadata()},staticRules:function(a){var b={},d=c.data(a.form,"validator");if(d.settings.rules)b=c.validator.normalizeRule(d.settings.rules[a.name])||{};return b},normalizeRules:function(a,b){c.each(a,function(d,e){if(e===false)delete a[d];else if(e.param||e.depends){var f=true;switch(typeof e.depends){case "string":f=!!c(e.depends,b.form).length;break;case "function":f=e.depends.call(b,b)}if(f)a[d]=e.param!==undefined?
e.param:true;else delete a[d]}});c.each(a,function(d,e){a[d]=c.isFunction(e)?e(b):e});c.each(["minlength","maxlength","min","max"],function(){if(a[this])a[this]=Number(a[this])});c.each(["rangelength","range"],function(){if(a[this])a[this]=[Number(a[this][0]),Number(a[this][1])]});if(c.validator.autoCreateRanges){if(a.min&&a.max){a.range=[a.min,a.max];delete a.min;delete a.max}if(a.minlength&&a.maxlength){a.rangelength=[a.minlength,a.maxlength];delete a.minlength;delete a.maxlength}}a.messages&&delete a.messages;
return a},normalizeRule:function(a){if(typeof a=="string"){var b={};c.each(a.split(/\s/),function(){b[this]=true});a=b}return a},addMethod:function(a,b,d){c.validator.methods[a]=b;c.validator.messages[a]=d!=undefined?d:c.validator.messages[a];b.length<3&&c.validator.addClassRules(a,c.validator.normalizeRule(a))},methods:{required:function(a,b,d){if(!this.depend(d,b))return"dependency-mismatch";switch(b.nodeName.toLowerCase()){case "select":return(a=c(b).val())&&a.length>0;case "input":if(this.checkable(b))return this.getLength(a,
b)>0;default:return c.trim(a).length>0}},remote:function(a,b,d){if(this.optional(b))return"dependency-mismatch";var e=this.previousValue(b);this.settings.messages[b.name]||(this.settings.messages[b.name]={});e.originalMessage=this.settings.messages[b.name].remote;this.settings.messages[b.name].remote=e.message;d=typeof d=="string"&&{url:d}||d;if(this.pending[b.name])return"pending";if(e.old===a)return e.valid;e.old=a;var f=this;this.startRequest(b);var g={};g[b.name]=a;c.ajax(c.extend(true,{url:d,
mode:"abort",port:"validate"+b.name,dataType:"json",data:g,success:function(h){f.settings.messages[b.name].remote=e.originalMessage;var j=h===true;if(j){var i=f.formSubmitted;f.prepareElement(b);f.formSubmitted=i;f.successList.push(b);f.showErrors()}else{i={};h=h||f.defaultMessage(b,"remote");i[b.name]=e.message=c.isFunction(h)?h(a):h;f.showErrors(i)}e.valid=j;f.stopRequest(b,j)}},d));return"pending"},minlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)>=d},maxlength:function(a,
b,d){return this.optional(b)||this.getLength(c.trim(a),b)<=d},rangelength:function(a,b,d){a=this.getLength(c.trim(a),b);return this.optional(b)||a>=d[0]&&a<=d[1]},min:function(a,b,d){return this.optional(b)||a>=d},max:function(a,b,d){return this.optional(b)||a<=d},range:function(a,b,d){return this.optional(b)||a>=d[0]&&a<=d[1]},email:function(a,b){return this.optional(b)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a)},
url:function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},
date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a))},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)},number:function(a,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9 -]+/.test(a))return false;var d=0,e=0,f=false;a=a.replace(/\D/g,"");for(var g=a.length-1;g>=
0;g--){e=a.charAt(g);e=parseInt(e,10);if(f)if((e*=2)>9)e-=9;d+=e;f=!f}return d%10==0},accept:function(a,b,d){d=typeof d=="string"?d.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(b)||a.match(RegExp(".("+d+")$","i"))},equalTo:function(a,b,d){d=c(d).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){c(b).valid()});return a==d.val()}}});c.format=c.validator.format})(jQuery);
(function(c){var a={};if(c.ajaxPrefilter)c.ajaxPrefilter(function(d,e,f){e=d.port;if(d.mode=="abort"){a[e]&&a[e].abort();a[e]=f}});else{var b=c.ajax;c.ajax=function(d){var e=("port"in d?d:c.ajaxSettings).port;if(("mode"in d?d:c.ajaxSettings).mode=="abort"){a[e]&&a[e].abort();return a[e]=b.apply(this,arguments)}return b.apply(this,arguments)}}})(jQuery);
(function(c){!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.handle.call(this,e)}c.event.special[b]={setup:function(){this.addEventListener(a,d,true)},teardown:function(){this.removeEventListener(a,d,true)},handler:function(e){arguments[0]=c.event.fix(e);arguments[0].type=b;return c.event.handle.apply(this,arguments)}}});c.extend(c.fn,{validateDelegate:function(a,
b,d){return this.bind(b,function(e){var f=c(e.target);if(f.is(a))return d.apply(f,arguments)})}})})(jQuery);
;
(function (Dv, $, undefined) {
  // Clear payment fields so they won't be populated on back button.
  var doUnload = function () {
    $('.fundraiser-payment-fields input[type="text"]').each(function (i, el) {
      var $el = $(el);
      $el.val('');
      try {
        $el.rules('remove');
      }
      catch (err) {
        if (window.console) {
          console.error(err)
          console.error('error href: ' + window.location.href)
        }
      }
    });
  };
  window.unload = window.onbeforeunload = doUnload;

  Drupal.behaviors.springboardForms = {
    attach: function (context, settings) {
      var clearElement = function($selector) {
        $selector
          .val('')
          .removeClass('valid')
          .next('label')
          .remove()
          .end()
          .parents('.success')
          .removeClass('success')
          .end()
          .parents('.error')
          .removeClass('error');
      };

      $(document).ready(function() {
        // Turn autocomplete off on CC and CVV form elements.
        $('input[name*="card_number"], input[name*="card_cvv"]').attr('autocomplete', 'off');

        // Helper function, provides the total display.
        function _recalculate_quantity_total() {
          if (!$('select[name*="quantity"]').length) {
            return;
          }

          $('#quantity-total').empty();
          var amount = $('input[type="radio"][name*="amount"]:checked:visible').val();
          if (amount == 'other') {
            amount = $('input[name*="other_amount"]').val();
          }
          // Prevent total from displaying NaN if other amount input is
          // incorrectly formatted.
          var total = 0.00;
          if (!isNaN(amount)) {
            var total = $('select[name*="quantity"]').val() * amount;
          }
          $('select[name*="quantity"]').after('<span id="quantity-total">Total: ' + Drupal.settings.fundraiser.currency.symbol + total + '</span>');
        }

        // When the amount changes, change the displayed total.
        $('select[name*="quantity"], input[name*="amount"], input[name*="other_amount"], input[name*="recurs_monthly"]').change(_recalculate_quantity_total());

        // Custom Validation Regex rules: AMEX, VISA, MASTERCARD, DISCOVER, Diner's Club, JCB
        $.validator.addMethod('creditcard', function(value, element) {
          return this.optional(element) || /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5]\d{14}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))\d{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/i.test(value);
          // Doesn't work for Australian Bankcard, Dankort (PBS) cards or
          // Switch/Solo (Paymentech).
          // Bankcard regexp below needs fixing:
          //^5610\5[6-9]d{2}\d{4}\d{4}$
        }, Drupal.t("Enter a valid credit card number"));

        // Custom amount validation
        $.validator.addMethod('amount', function(value, element) {
          // Add regexp
          return this.optional(element) || /^[0-9]*(\.\d{1,3})*(,\d{1,3})?$/i.test(value);
        }, Drupal.t("Enter a valid amount"));

        // Custom zipcode validation
        $.validator.addMethod('zipcode', function(value, element) {
          // Validate zip code when country is US.
          var country_field = $(':input[name*="[country]"]');
          if (country_field.length && country_field.val() == 'US') {
            return this.optional(element) || /(^\d{5}((-|\s)\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/i.test(value);
          }
          return true;
        }, "Enter a valid zipcode");

        var recurs_monthly = $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]:checked');
        Dv.frequencyCur = recurs_monthly.val();

        $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]')
          .on('change focus', function(){
            recurs_monthly = $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]:checked');
            Dv.frequencyCur = recurs_monthly.val();
          });

        // Instantiate Form Validation
        Drupal.settings.fundraiser.donationValidate = $('.fundraiser-donation-form').validate({
          // Custom keyup function checking for tab key (9) and when value is empty
          onkeyup: function (element, event) {
            if ($(element).next('.error').length){
              if (event.which === 9 && element.value === "") {
                return;
              } else {
                this.element(element);
              }
            }
          },
          onfocusout: function (element) {

            var recurs_monthly = $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]:checked');
            var newFrequency = recurs_monthly.val();

            setTimeout(function() {

              if (element.name.indexOf('recurring_other_amount') != -1) {
                if (Dv.frequencyCur !== newFrequency) {
                  return;
                }
              }

              // Callback for real-time onfocusout of form elements.
              var isValid;
              try {
                isValid = $(element).valid();
              }
              catch(err) {
                if (window.console) {
                  console.error(err)
                  console.error('error href: ' + window.location.href)
                }
              }

              if (typeof validateKeyCallback == 'undefined') {
                return;
              }

              if (isValid == 0) {
                // Set status to 0.
                validateKeyCallback.status = 0;
                validateKeyCallback.error(element);
              }
              else if (isValid == 1) {
                // Set status to 1.
                validateKeyCallback.status = 1;
                validateKeyCallback.success(element);
              }
            }, 500);
          },

          highlight: function(element) {
            $element = $(element);
            var single = $element.attr('name') == 'submitted[donation][amount]';
            var recurring = $element.attr('name') == 'submitted[donation][recurring_amount]';
            var QuarterlyFreqAmounts = $element.attr('name') == 'frequencies[sb_fs_quarterly_amount]';
            var SemiAnnualFreqAmounts = $element.attr('name') == 'frequencies[sb_fs_semi_amount]';
            var AnnuallyFreqAmounts = $element.attr('name') == 'frequencies[sb_fs_annually_amount]';

            if (single || recurring || QuarterlyFreqAmounts || SemiAnnualFreqAmounts || AnnuallyFreqAmounts) {
              var $error = $element.next('label.error');
              if ($error.length) {
                if (single) {
                  $error.detach().appendTo('#edit-submitted-donation-amount');
                }
                else if (recurring) {
                  $error.detach().appendTo('#edit-submitted-donation-recurring-amount');
                }
                else if (QuarterlyFreqAmounts) {
                  $error.detach().appendTo('#edit-frequencies-sb-fs-quarterly-amount');
                }
                else if (SemiAnnualFreqAmounts) {
                  $error.detach().appendTo('#edit-frequencies-sb-fs-semi-amount');
                }
                else if (AnnuallyFreqAmounts) {
                  $error.detach().appendTo('#edit-frequencies-sb-fs-annually-amount');
                }
              }

              $element.parent('.control-group').removeClass('success').addClass('error').siblings('.control-group').removeClass('success').addClass('error');
            }
            else {
              $(element).addClass('key-validate');
              $(element).closest('.control-group').removeClass('success').addClass('error');
            }
          },

          success: function(element) {
            $element = $(element);
            var single = $element.prev('input[name="submitted[donation][amount]"]').length;
            var recurring = $element.prev('input[name="submitted[donation][recurring_amount]"]').length;
            var QuarterlyFreqAmounts = $element.prev('input[name*="frequencies[sb_fs_quarterly_amount]"]').length;
            var SemiAnnualFreqAmounts = $element.prev('input[name*="frequencies[sb_fs_semi_amount]"]').length;
            var AnnuallyFreqAmounts = $element.prev('input[name*="frequencies[sb_fs_annually_amount]"]').length;

            if (single || recurring  || QuarterlyFreqAmounts || SemiAnnualFreqAmounts || AnnuallyFreqAmounts) {
              if (single) {
                $element.detach().appendTo('#edit-submitted-donation-amount');
              }
              else if (recurring) {
                $element.detach().appendTo('#edit-submitted-donation-recurring-amount');
              }
              else if (QuarterlyFreqAmounts) {
                $element.detach().appendTo('#edit-frequencies-sb-fs-quarterly-amount');
              }
              else if (SemiAnnualFreqAmounts) {
                $element.detach().appendTo('#edit-frequencies-sb-fs-semi-amount');
              }
              else if (AnnuallyFreqAmounts) {
                $element.detach().appendTo('#edit-frequencies-sb-fs-annually-amount');
              }
            }
            else {
              $element.text('OK').addClass('valid').closest('.control-group').removeClass('error').addClass('success');
            }
          }
        });

        // On change and keyup check form status
        $(".fundraiser-donation-form :input.key-validate").bind('change keyup', function() {
          Drupal.settings.fundraiser.donationValidate.element('#' + $(this).attr('id'));
        });

        // Track isValid status of each Braintree hosted field, if we are using that payment method.
        var braintreeFields = false;
        if ($('.braintree-hosted-field').length) {
          braintreeFields = {'number' : false, 'expirationMonth' : false , 'expirationYear' : false , 'cvv' : false };
          $(document).on('braintree.fieldEvent', function(event, param) {
            var field = param.fields[param.emittedBy];
            var $field = $(field.container);

            if (param.emittedBy == 'cvv') {
              braintreeFields[param.emittedBy] = field.isValid || !field.isEmpty;
            }
            else {
              braintreeFields[param.emittedBy] = field.isValid;
            }

            if (!braintreeFields[param.emittedBy]) {
              $field.closest('.control-group').removeClass('success').addClass('error');
            }
            else {
              $field.closest('.control-group').removeClass('error').addClass('success');
            }
          });
        }

        var formIsValid = function() {
          // If we are using Braintree, both the braintree form and the drupal
          // fields must validate.
          var standardFormValid = Drupal.settings.fundraiser.donationValidate.form();
          if (!standardFormValid) {
            return false;
          }
          //BRAINTREE
          else if (undefined !== Drupal.braintreeInstance) {
            if (Drupal.braintreeInstance.$cardonfile && Drupal.braintreeInstance.$cardonfile != 'new') {
              return true;
            }
            else if (Drupal.settings.braintree.currentPaymentMethod == 'paypal' || Drupal.settings.braintree.currentPaymentMethod == 'applepay') {
              if (!Drupal.settings.fundraiserTickets && !Drupal.settings.fdNid) {
                // Check recurring setting and validate appropriate amount fields.
                var $amount = $('input[name="submitted[donation][amount]"]');
                var $recurringAmount = $('input[name="submitted[donation][recurring_amount]"]');
                var $recurringQuarterlyAmount = $('input[name="frequencies[sb_fs_quarterly_amount]"]');
                var $recurringSemiAmount = $('input[name="frequencies[sb_fs_semi_amount]"]');
                var $recurringAnnuallyAmount = $('input[name="frequencies[sb_fs_annually_amount]"]');

                var $otherAmount = $('input[name="submitted[donation][other_amount]"]');
                var $recurringOtherAmount = $('input[name="submitted[donation][recurring_other_amount]"]');
                // Check if recurring setting is a checkbox or radios.
                if ($('input[name*="[recurs_monthly][recurs]"]').length) {
                  // Checkboxes have special settings.
                  var $recurs = $('input[name*="[recurs_monthly][recurs]"]');
                  if ($recurs.attr('checked') == 'checked') {
                    $recursValue = $('input[name*="[recurs_monthly][recurs]"]').val();
                  }
                  else {
                    $recursValue = false;
                  }
                }
                else {
                  var $recurs = $('input[name*="[recurs_monthly]"]');
                  var $recursValue = $('input[name*="[recurs_monthly]"]').filter(':checked').val();
                }

                var notHidden = true;
                if ($.inArray($recursValue, ["recurs", "sb_fs_quarterly", "sb_fs_semi", "sb_fs_annually"]) != -1) {
                  if ($recursValue === 'recurs') {
                    notHidden = $recurringAmount.attr("type") != "hidden"
                  }
                  else {
                    notHidden = $('input[name="frequencies[' + $recursValue + '_amount]"]').length > 0;
                  }
                }

                // Determine if this is a one-time or recurring dual ask form and take appropriate action.
                if ($recurs.attr("type") != "hidden"
                  && $.inArray($recursValue, ["recurs", "sb_fs_quarterly", "sb_fs_semi", "sb_fs_annually"]) != -1
                  && notHidden) {

                  switch ($recursValue) {
                    case 'recurs':
                      var $checked = $recurringAmount.filter(':checked').val();
                      break;

                    case 'sb_fs_quarterly':
                      if ($recurringQuarterlyAmount.length) {
                        $checked = $recurringQuarterlyAmount.filter(':checked').val()
                      }
                      break;

                    case 'sb_fs_semi':
                      if ($recurringSemiAmount.length) {
                        $checked = $recurringSemiAmount.filter(':checked').val();
                      }
                      break;

                    case 'sb_fs_annually':
                      if ($recurringAnnuallyAmount.length) {
                        $checked = $recurringAnnuallyAmount.filter(':checked').val();
                      }
                      break;
                  }

                  // Check for other only configuration.
                  if (typeof $checked === 'undefined' && $recurringOtherAmount.length) {
                    switch ($recursValue) {
                      case 'recurs':
                        if ('other' == $recurringAmount.filter(':hidden').val() || !$recurringAmount.length) {
                          $checked = $recurringOtherAmount.val();
                        }
                        break;

                      case 'sb_fs_quarterly':
                        // Any of the new frequencies can use the recurring amount field if there is only one
                        // recurring frequency active.
                        if ('other' == $recurringQuarterlyAmount.filter(':hidden').val() || !$recurringQuarterlyAmount.length) {
                          $checked = $recurringOtherAmount.val();
                        }
                        break;

                      case 'sb_fs_semi':
                        // Any of the new frequencies can use the recurring amount field if there is only one
                        // recurring frequency active.
                       if ('other' == $recurringSemiAmount.filter(':hidden').val() || !$recurringSemiAmount.length) {
                          $checked = $recurringOtherAmount.val();
                        }
                        break;

                      case 'sb_fs_annually':
                        // Any of the new frequencies can use the recurring amount field if there is only one
                        // recurring frequency active.
                        if ('other' == $recurringAnnuallyAmount.filter(':hidden').val() || !$recurringAnnuallyAmount.length) {
                          $checked = $recurringOtherAmount.val();
                        }
                        break;
                    }
                  }

                }
                else {
                  var $checked = $amount.filter(':checked').val();
                  if ($checked == 'other') {
                    $checked = $otherAmount.val();
                  }
                  // Other only, no radios.
                  else if (
                    typeof $checked === 'undefined'
                    && $otherAmount.length
                    && ($amount.filter(':hidden').val() == 'other' || !$amount.length)
                  ) {
                    $checked = $otherAmount.val();
                  }
                }

                // If we don't have a selected amount, return invalid.
                if (typeof($checked) === "undefined" || !$checked.length) {
                  return false;
                }
              }

              // If we have a valid amount, ensure we have a nonce.
              var $nonce = $('input[name=payment_method_nonce]');
              return $nonce.length > 0;
            }
            // Process credit card only if Braintree fields are populated.
            else if (braintreeFields !== false && braintreeFields.number !== false) {
              var isBillingUpdate = undefined !== Drupal.settings.braintree.billing_update_type;
              var $isOcd = $('input[name$="[cardonfile]"][value!="new"]');
              var braintreeFieldsAreValid = function() {
                if ($isOcd.filter(':checked').length) {
                  return true;
                }

                // Considered valid when not on a billing update form and all
                // fields are filled out, or on a billing update form and either
                // no fields are filled out or all fields are filled out.
                var returnValue = true;
                var atLeastOneTrue = false;
                $.each(braintreeFields, function(index, value) {
                  if (!value) {
                    returnValue = false;
                    // We can return early if not on a billing update form.
                    if (!isBillingUpdate) {
                      return false;
                    }
                  }
                  else {
                    atLeastOneTrue = true;
                  }
                });

                if (!returnValue && isBillingUpdate && !atLeastOneTrue) {
                  returnValue = true;
                }

                return returnValue;
              };

              return braintreeFieldsAreValid();
            }
          }
          // END BRAINTREEE

          return true;
        };
        // END formIsValid

        var $submit = $('.fundraiser-donation-form #edit-submit');
        var $submitMessage = $('.fundraiser_submit_message');

        var $span = $('<span/>').addClass('donation-processing-spinner');
        var $processtext = Drupal.t('Processing') + ' ';
        var $p = $('<p/>').addClass('donation-processing').text($processtext).append($span);
        var $div = $('<div/>').addClass('donation-processing-wrapper').append($p);
        $div.hide();

        // Add the processing button now since the background needs to be loaded
        // and doing it on submit might cause the background not to load in
        // time.
        $submit.once().after($div);

        // On submission hide the button and replace it with a new value.
        // Wrap the click in a once trigger to be sure that we bind it only
        // once.
        $('.fundraiser-donation-form').once(function() {
          $('.fundraiser-donation-form').on('submit.donationValidate', function() {
            // Validate the form
            if (formIsValid()) {
              $submit.add($submitMessage).hide();
              $div.show();

              // Scroll to donate button if it's not in view.
              var docTop = $(window).scrollTop();
              var docBottom = docTop + $(window).height();
              var divTop = $div.offset().top;
              var divBottom = divTop + $div.height();
              // Offset in pixels, so that element we scroll to isn't on edge.
              var offset = 50;
              if (divBottom > docBottom || divTop < docTop) {
                var newTop = parseInt(divTop);
                if (divBottom > docBottom) {
                  newTop += offset;
                }
                else {
                  newTop -= offset;
                }
                $('html, body').animate({
                  scrollTop: newTop
                }, 100);
              }

              return true;
            }
            return false;
          });
        });

        // If this is a Braintree paypal submission and the user closed the
        // paypal popup, set the submit button back to its initial state.
        $(document).on('braintree.error', function(e, error_msg) {
          if (typeof error_msg.code !== 'undefined' && error_msg.code == 'PAYPAL_POPUP_CLOSED') {
            $div.hide();
            $submit.add($submitMessage).show();
          }
        });

        // Iterate validation settings and apply rules.
        var $selector;
        if (Drupal.settings.fundraiser && Drupal.settings.fundraiser.js_validation_settings) {
          for ($key in Drupal.settings.fundraiser.js_validation_settings) {
            $selector = $('input[name*="' + $key + '"]');
            if ($selector.length) {
              $selector.rules('add', Drupal.settings.fundraiser.js_validation_settings[$key]);
            }
          }
        }

        // Other Amount
        var $other_amount = $('input[name*="[other_amount]"][type!="hidden"]');
        $($other_amount).blur(function () {
          var otherAmountField = $(this);
          if (otherAmountField.parent().children('.field-suffix').length > 0) {
            var errorMessage = otherAmountField.parent().children('label.error').detach();
            otherAmountField.parent().children('.description').after(errorMessage);
          }
        });

        if ($other_amount.length) {
          $other_amount.each(function() {
            $(this).rules('add', {
              required: function(element) {
                return $('input[type="radio"][name$="[amount]"]:checked').length == 0 || $('input[type="radio"][name$="[amount]"][value="other"]:visible').is(":checked");
              },
              amount: true,
              min: parseFloat(Drupal.settings.fundraiserWebform.minimum_donation_amount),
              max: parseFloat(Drupal.settings.fundraiserWebform.fundraiser_maximum_other_amount),
              messages: {
                required: Drupal.t("This field is required"),
                amount: Drupal.t("Enter a valid amount"),
                min: Drupal.t("The amount entered is less than the minimum donation amount.")
              }
            });
          });
        }

        var $recurring_other_amount = $('input[name$="[recurring_other_amount]"]');
        $($recurring_other_amount).blur(function () {
          var recurringOtherAmountField = $(this);
          if (recurringOtherAmountField.parent().children('.field-suffix').length > 0) {
            var errorMessage = recurringOtherAmountField.parent().children('label.error').detach();
            recurringOtherAmountField.parent().children('.description').after(errorMessage);
          }
        });

        var recurringOtherRuleEnabled = false;
        if ($recurring_other_amount.length) {
          $recurring_other_amount.each(function() {
            var $this = $(this);
            var enableRecurringOtherRule = function() {
              $this.rules('add', {
                required: function(element) {
                  var frequency = $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]:checked').val();
                  if (frequency === 'recurs') {
                    var req = $('input[type="radio"][name$="[recurring_amount]"]:checked').length == 0
                      || $('input[type="radio"][name$="[recurring_amount]"][value="other"]:visible').is(":checked");

                    return req;
                  }
                  else {
                    var req =  $('input[type="radio"][name$="[' + frequency + '_amount]"]:checked').length == 0
                      || $('input[type="radio"][name$="[' + frequency + '_amount]"][value="other"]:visible').is(":checked");
                    return req;
                  }
                },
                amount: true,
                min: function(){
                  var frequency = $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]:checked').val();
                  if (frequency === 'recurs') {
                    return parseFloat(Drupal.settings.fundraiserWebform.recurring_minimum_donation_amount)
                  }
                  else {
                    if ($('input[type="radio"][name$="[' + frequency + '_amount]"]:checked').length) {
                      var min = Drupal.settings.fundraiser.recurring_settings[frequency + '_minimum_donation_amount'];
                      return parseFloat(min)
                    }
                    return parseFloat(Drupal.settings.fundraiserWebform.recurring_minimum_donation_amount)
                  }
                },
                max: parseFloat(Drupal.settings.fundraiserWebform.fundraiser_maximum_other_amount),
                messages: {
                  required: Drupal.t("This field is required"),
                  amount: Drupal.t("Enter a valid amount"),
                  min: Drupal.t("The amount entered is less than the minimum donation amount.")
                },
              });
              recurringOtherRuleEnabled = true;
            };

            // If the recurring other amount is hidden by default (in the case
            // of dual ask amounts), we need to add it's rule when it becomes
            // visible.
            if (!$this.is(':visible') && !recurringOtherRuleEnabled) {
              $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]')
                .on('change', function(e) {
                  var $target = $(e.target);
                  var frequency = $target.val();
                  if ($target.is(':checked') &&
                    ( frequency == 'recurs'
                      || frequency == 'sb_fs_quarterly'
                      || frequency == 'sb_fs_semi'
                      || frequency == 'sb_fs_annually'
                    )) {
                  enableRecurringOtherRule();
                }
              });
            }
            else {
              enableRecurringOtherRule();
            }
          });

          $('input[name*="frequencies["], input[name="submitted[donation][amount]"], input[name="submitted[donation][recurring_amount]"]').change(function() {
            if ($(this).filter(':checked').length) {
              $(this).parent('.control-group').removeClass('error').addClass('success').siblings('.control-group').removeClass('error').addClass('success');
            }
          })
        }

        // If neither "other" field is present, add validation for the amount
        // radios.
        var recurSettings = Drupal.settings.fundraiser.recurring_settings;
        // Multifrequency == at least two recurring frequencies are active on the form.
        var multiFrequency = typeof(Drupal.settings.fundraiser.multi_frequency) != "undefined"

        if (!$other_amount.length
          || !recurSettings.recurs_show_other_amount == 0
          || !recurSettings.sb_fs_quarterly_show_other_amount == 0
          || !recurSettings.sb_fs_semi_show_other_amount == 0
          || !recurSettings.sb_fs_annually_show_other_amount == 0
        ) {

          var selector = [];
          var recurringRuleEnabled = false;

          if (!$other_amount.length && $recurring_other_amount.length) {
            if ($('input[name="submitted[donation][amount]"]:first').length > 0) {
              selector.push($('input[name="submitted[donation][amount]"]:first'));
            }
          }
          if (!$other_amount.length && !$recurring_other_amount.length) {
            if ($('input[name="submitted[donation][amount]"]:first').length > 0) {
              selector.push($('input[name="submitted[donation][amount]"]:first'));
            }
          }

          if (typeof(recurSettings) != "undefined") {
            $.each(recurSettings.active_frequencies, function(key, values) {
              if (key === 'NO_RECURR') {
                return;
              }

              var freq = key + '_show_other_amount';
              if (recurSettings[freq] == 0) {
                if (!multiFrequency || key =='recurs') {
                  if($('input[name="submitted[donation][recurring_amount]"]:first').length > 0) {
                    selector.push($('input[name="submitted[donation][recurring_amount]"]:first'));
                  }
                }
                if (multiFrequency && key !== 'recurs') {
                  if ($('input[name="frequencies[' + key + '_amount]"]:first').length > 0) {
                    selector.push($('input[name="frequencies[' + key + '_amount]"]:first'));
                  }
                }
              }
            });
          }

          $.each(selector, function() {

            var $this = this;

            var enableRecurringRule = function() {
              $this.rules('add', {
                required: function(element) {
                  return $this.siblings('input[type=radio]').filter(':checked').length == 0;
                },
                messages: {
                  required: Drupal.t("This field is required"),
                },
              });
              recurringRuleEnabled = true;
            };

            if (!$this.is(':visible') && !recurringRuleEnabled) {
              $('input[type="checkbox"][name*="[recurs_monthly]["], input[type="radio"][name*="[recurs_monthly]"]').on('change', function(e) {
                var $target = $(e.target);
                var frequency = $target.val();
                if ($target.is(':checked') &&
                  ( frequency == 'recurs'
                    || frequency == 'sb_fs_quarterly'
                    || frequency == 'sb_fs_semi'
                    || frequency == 'sb_fs_annually'
                  )) {
                  enableRecurringRule();
                }
              });
            }
            else {
              enableRecurringRule();
            }
          });

          $('input[name="submitted[donation][amount]"]').change(function() {
            if ($(this).filter(':checked').length) {
              $(this).parent('.control-group').removeClass('error').addClass('success').siblings('.control-group').removeClass('error').addClass('success');
            }
          });
        }

        // Focus and Blur conditional functions for non-recurring other amount.
        $('input[type="radio"][name*="[amount]"]').change(function(){
          if ($(this).val() == 'other') {
            $('input[name*="[other_amount]"]').focus();
          }
          else {
            clearElement($('input[name*="[other_amount]"]'));
          }
        });

        $('input[name*="[other_amount]"]').focus(function(){
          $('input[type="radio"][name*="[amount]"][value="other"]').attr('checked', 'checked');
        });

        // Focus and Blur conditional functions for recurring other amount.
        if (typeof(recurSettings) != "undefined") {
          $.each(recurSettings.active_frequencies, function(key, values) {
            if (key === 'NO_RECURR') {
              return;
            }
            if (!multiFrequency || key =='recurs') {
              $('input[type="radio"][name*="[recurring_amount]"]').change(function(){
                if ($(this).val() == 'other') {
                  $('input[name*="[recurring_other_amount]"]').focus();
                }
                else {
                  clearElement($('input[name*="[recurring_other_amount]"]'));
                }
              });
            }
            if (multiFrequency && key !== 'recurs') {
              $('input[type="radio"][name*="[' + key + '_amount]"]').change(function(){
                if ($(this).val() == 'other') {
                  $('input[name*="[recurring_other_amount]"]').focus();
                }
                else {
                  clearElement($('input[name*="[recurring_other_amount]"]'));
                }
              });
            }
          });
        }

        $('input[name*="[recurring_other_amount]"]').focus(function(){
          var $recursValue = $('input[name*="[recurs_monthly]"]').filter(':checked').val();
          switch($recursValue) {
            case 'recurs':
              $('input[type="radio"][name*="[recurring_amount]"][value="other"]').attr('checked', 'checked');
              break;

            default:
              if (multiFrequency) {
                $('input[type="radio"][name*="[' + $recursValue + '_amount]"][value="other"]').attr('checked', 'checked');
              }
              else {
                $('input[type="radio"][name*="[recurring_amount]"][value="other"]').attr('checked', 'checked');
              }
          }
        });

        // Runs on Other Amount field
        $('input[name*="other_amount"], input[name*="fee_amount"], input[name*="addon-amount"]').blur(function(){
          var value = this.value;
          // check for custom validation function object
          if (undefined == window.customValidation) {
            // If the value has length and includes at least one integer
            if (value.length && this.value.match(/\d/g)) {
              // Replace commas used as decimal place in international currency.
              if (value.match(/\,/)) {
                var count = value.length;
                var pos = value.lastIndexOf(",");
                if (pos !== -1) {
                  // Is the comma the third-to-last character in the amount? Replace it with a decimal.
                  var delimiterPosition = count - (pos + 1);
                  if (delimiterPosition === 2) {
                    value = value.substring(0, pos) + '.' + value.substring(pos + 1);
                  }
                }
              }
              // if no period period
              if (!value.match(/\./)) {
                // no decimals: strip all other chars, add decimal and 00
                value = value.replace(/[^\d]+/g,'') + '.00';
              } else {
                // Remove all non-integer/period chars
                value = value.replace(/[^\d\.]+/g,'')
                // make first decimal unique
                  .replace(/\./i,'-')
                  // replace subsequent decimals
                  .replace(/\./g,'')
                  // set first back to normal
                  .replace('-','.')
                  // match the last two digits, removing others
                  .match(/\d+\.\d{0,2}|\.\d{0,2}/);
                var newValue = value[0];
                if (newValue.match(/\.\d{2}/)) {
                } else if (newValue.match(/\.\d{1}/)) {
                  value += '0';
                } else {
                  value += '00';
                }
              }
              this.value = value;
              // total should be recalculated as value has changed without triggering .change() event handler.
              _recalculate_quantity_total();
              $(this).valid();
            }
          } else {
            window.customValidation(value);
            $(this).valid();
          }
        });

        // Ability to override the default message
        jQuery.extend(jQuery.validator.messages, {
          required: Drupal.t("This field is required"),
          remote: Drupal.t("Please fix this field"),
          email: Drupal.t("Enter a valid email address"),
          url: Drupal.t("Enter a valid URL"),
          date: Drupal.t("Enter a valid date"),
          dateISO: Drupal.t("Enter a valid date (ISO)"),
          number: Drupal.t("Must be a number"), // changed
          digits: Drupal.t("Enter only digits"),
          creditcard: Drupal.t("Enter a valid credit card number"),
          equalTo: Drupal.t("Enter the same value again"),
          accept: Drupal.t("Enter a value with a valid extension"),
          maxlength: jQuery.validator.format(Drupal.t("Enter no more than {0} characters")),
          minlength: jQuery.validator.format(Drupal.t("Enter at least {0} characters")),
          rangelength: jQuery.validator.format(Drupal.t("Enter a value between {0} and {1} characters long")),
          range: jQuery.validator.format(Drupal.t("Enter a value between {0} and {1}")),
          max: jQuery.validator.format(Drupal.t("Enter a value less than or equal to {0}")),
          min: jQuery.validator.format(Drupal.t("Enter a value greater than or equal to {0}"))
        });

        // Small helper item
        $('select').each(function(){
          if ($(this).next().is('select')) {
            $(this).next().addClass('spacer');
          }
        });

        // Implementing our own alert close
        // Bootstrap.js uses the .on method, not added until jQuery 1.7
        $('.close').click(function(){
          $(this).closest('.alert').fadeOut();
        });

      }); // window.ready
    } // attach.function
  } // drupal.behaviors
})(
  window.DonationValidation = window.DonationValidation || {},
  jQuery);

;
Drupal.behaviors.fundraiserGatewayBehavior = {

  attach: function(context, settings) { (function($) {
    // Payment selection triggered changes.
    function paymentImages() {
      var gateway = $(this).val();
      var paymentId = this.id;
      var text = Drupal.settings.fundraiser[gateway].text;
      var labelImg = Drupal.settings.fundraiser[gateway].selected_image;
      // Automatically change submit button text when payment gateway selected.
      if (typeof(text) !== "undefined") {
        var oldText = $("#edit-submit").val().toUpperCase();
        $("#edit-submit").val(text);
        var fsm = $(".fundraiser_submit_message");
        if (fsm.length > 0) {
          var fsmHtml = fsm.html().replace(oldText, text.toUpperCase());
          fsm.html(fsmHtml);
        }
      }
      $('label[for='+paymentId+'] img').attr('src', labelImg);
      $("input[name='submitted[payment_information][payment_method]']").each(function(gateway) {
        if (!$(this).is(":checked")) {
          gateway = $(this).val();
          var paymentId = this.id;
          var labelImg = Drupal.settings.fundraiser[gateway].unselected_image;
          $('label[for='+paymentId+'] img').attr('src', labelImg);
        }
      });
    }

    // Change payment method image on hover
    function hoverInImage() {
      var gateway = $(this).attr('data-gateway');
      var paymentId = this.id;
      var labelImg = Drupal.settings.fundraiser[gateway].selected_image;
      $(this).attr('src', labelImg);
    }

    // Change payment method image after hover to selected default.
    function hoverOutImage() {
      var gateway = $(this).attr('data-gateway');
      var parentLabel = $(this).parent();
      var labelParent = parentLabel.attr('for');
      var checked = $('#' + labelParent).is(':checked');
      if (!checked) {
        var labelImg = Drupal.settings.fundraiser[gateway].unselected_image;
        $(this).attr('src', labelImg);
      }
    }

    // Call change to payment method images and submit button on page load and selection/hover.
    try {
      if (Drupal.settings.fundraiser.enabled_count >= 1) {
        // Set button text when page first loaded
        // Loop over payment method radio fields to find selected
        var paymentMethods = $('input[class*="fundraiser-payment-methods"]');
        var paymentMethodSelected;
        for(var i = 0; i < paymentMethods.length; i++){
          if(paymentMethods[i].checked){
            paymentMethodSelected = paymentMethods[i];
          }
        }
        if (paymentMethodSelected == undefined) {
          paymentMethodSelected = paymentMethods[0];
        }
        // Call our button/image change function with checked payment method on load.
        paymentImages.call(paymentMethodSelected);

        // Change payment option image based on payment selection and hover.
        $('input[class*="fundraiser-payment-methods"]').change(paymentImages);
      }
    } catch (e) {
      console.log(e);
    }
    // Show payment option "selected" images when rolling over.
    $('img[id*="payment-option-img"]').hover(hoverInImage, hoverOutImage);

  })(jQuery); }
};
;
/*!
* jQuery Cycle2; version: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Dual licensed: MIT/GPL
*/
!function(a){"use strict";function b(a){return(a||"").toLowerCase()}var c="2.1.6";a.fn.cycle=function(c){var d;return 0!==this.length||a.isReady?this.each(function(){var d,e,f,g,h=a(this),i=a.fn.cycle.log;if(!h.data("cycle.opts")){(h.data("cycle-log")===!1||c&&c.log===!1||e&&e.log===!1)&&(i=a.noop),i("--c2 init--"),d=h.data();for(var j in d)d.hasOwnProperty(j)&&/^cycle[A-Z]+/.test(j)&&(g=d[j],f=j.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),i(f+":",g,"("+typeof g+")"),d[f]=g);e=a.extend({},a.fn.cycle.defaults,d,c||{}),e.timeoutId=0,e.paused=e.paused||!1,e.container=h,e._maxZ=e.maxZ,e.API=a.extend({_container:h},a.fn.cycle.API),e.API.log=i,e.API.trigger=function(a,b){return e.container.trigger(a,b),e.API},h.data("cycle.opts",e),h.data("cycle.API",e.API),e.API.trigger("cycle-bootstrap",[e,e.API]),e.API.addInitialSlides(),e.API.preInitSlideshow(),e.slides.length&&e.API.initSlideshow()}}):(d={s:this.selector,c:this.context},a.fn.cycle.log("requeuing slideshow (dom not ready)"),a(function(){a(d.s,d.c).cycle(c)}),this)},a.fn.cycle.API={opts:function(){return this._container.data("cycle.opts")},addInitialSlides:function(){var b=this.opts(),c=b.slides;b.slideCount=0,b.slides=a(),c=c.jquery?c:b.container.find(c),b.random&&c.sort(function(){return Math.random()-.5}),b.API.add(c)},preInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-pre-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.preInit)&&c.preInit(b),b._preInitialized=!0},postInitSlideshow:function(){var b=this.opts();b.API.trigger("cycle-post-initialize",[b]);var c=a.fn.cycle.transitions[b.fx];c&&a.isFunction(c.postInit)&&c.postInit(b)},initSlideshow:function(){var b,c=this.opts(),d=c.container;c.API.calcFirstSlide(),"static"==c.container.css("position")&&c.container.css("position","relative"),a(c.slides[c.currSlide]).css({opacity:1,display:"block",visibility:"visible"}),c.API.stackSlides(c.slides[c.currSlide],c.slides[c.nextSlide],!c.reverse),c.pauseOnHover&&(c.pauseOnHover!==!0&&(d=a(c.pauseOnHover)),d.hover(function(){c.API.pause(!0)},function(){c.API.resume(!0)})),c.timeout&&(b=c.API.getSlideOpts(c.currSlide),c.API.queueTransition(b,b.timeout+c.delay)),c._initialized=!0,c.API.updateView(!0),c.API.trigger("cycle-initialized",[c]),c.API.postInitSlideshow()},pause:function(b){var c=this.opts(),d=c.API.getSlideOpts(),e=c.hoverPaused||c.paused;b?c.hoverPaused=!0:c.paused=!0,e||(c.container.addClass("cycle-paused"),c.API.trigger("cycle-paused",[c]).log("cycle-paused"),d.timeout&&(clearTimeout(c.timeoutId),c.timeoutId=0,c._remainingTimeout-=a.now()-c._lastQueue,(c._remainingTimeout<0||isNaN(c._remainingTimeout))&&(c._remainingTimeout=void 0)))},resume:function(a){var b=this.opts(),c=!b.hoverPaused&&!b.paused;a?b.hoverPaused=!1:b.paused=!1,c||(b.container.removeClass("cycle-paused"),0===b.slides.filter(":animated").length&&b.API.queueTransition(b.API.getSlideOpts(),b._remainingTimeout),b.API.trigger("cycle-resumed",[b,b._remainingTimeout]).log("cycle-resumed"))},add:function(b,c){var d,e=this.opts(),f=e.slideCount,g=!1;"string"==a.type(b)&&(b=a.trim(b)),a(b).each(function(){var b,d=a(this);c?e.container.prepend(d):e.container.append(d),e.slideCount++,b=e.API.buildSlideOpts(d),e.slides=c?a(d).add(e.slides):e.slides.add(d),e.API.initSlide(b,d,--e._maxZ),d.data("cycle.opts",b),e.API.trigger("cycle-slide-added",[e,b,d])}),e.API.updateView(!0),g=e._preInitialized&&2>f&&e.slideCount>=1,g&&(e._initialized?e.timeout&&(d=e.slides.length,e.nextSlide=e.reverse?d-1:1,e.timeoutId||e.API.queueTransition(e)):e.API.initSlideshow())},calcFirstSlide:function(){var a,b=this.opts();a=parseInt(b.startingSlide||0,10),(a>=b.slides.length||0>a)&&(a=0),b.currSlide=a,b.reverse?(b.nextSlide=a-1,b.nextSlide<0&&(b.nextSlide=b.slides.length-1)):(b.nextSlide=a+1,b.nextSlide==b.slides.length&&(b.nextSlide=0))},calcNextSlide:function(){var a,b=this.opts();b.reverse?(a=b.nextSlide-1<0,b.nextSlide=a?b.slideCount-1:b.nextSlide-1,b.currSlide=a?0:b.nextSlide+1):(a=b.nextSlide+1==b.slides.length,b.nextSlide=a?0:b.nextSlide+1,b.currSlide=a?b.slides.length-1:b.nextSlide-1)},calcTx:function(b,c){var d,e=b;return e._tempFx?d=a.fn.cycle.transitions[e._tempFx]:c&&e.manualFx&&(d=a.fn.cycle.transitions[e.manualFx]),d||(d=a.fn.cycle.transitions[e.fx]),e._tempFx=null,this.opts()._tempFx=null,d||(d=a.fn.cycle.transitions.fade,e.API.log('Transition "'+e.fx+'" not found.  Using fade.')),d},prepareTx:function(a,b){var c,d,e,f,g,h=this.opts();return h.slideCount<2?void(h.timeoutId=0):(!a||h.busy&&!h.manualTrump||(h.API.stopTransition(),h.busy=!1,clearTimeout(h.timeoutId),h.timeoutId=0),void(h.busy||(0!==h.timeoutId||a)&&(d=h.slides[h.currSlide],e=h.slides[h.nextSlide],f=h.API.getSlideOpts(h.nextSlide),g=h.API.calcTx(f,a),h._tx=g,a&&void 0!==f.manualSpeed&&(f.speed=f.manualSpeed),h.nextSlide!=h.currSlide&&(a||!h.paused&&!h.hoverPaused&&h.timeout)?(h.API.trigger("cycle-before",[f,d,e,b]),g.before&&g.before(f,d,e,b),c=function(){h.busy=!1,h.container.data("cycle.opts")&&(g.after&&g.after(f,d,e,b),h.API.trigger("cycle-after",[f,d,e,b]),h.API.queueTransition(f),h.API.updateView(!0))},h.busy=!0,g.transition?g.transition(f,d,e,b,c):h.API.doTransition(f,d,e,b,c),h.API.calcNextSlide(),h.API.updateView()):h.API.queueTransition(f))))},doTransition:function(b,c,d,e,f){var g=b,h=a(c),i=a(d),j=function(){i.animate(g.animIn||{opacity:1},g.speed,g.easeIn||g.easing,f)};i.css(g.cssBefore||{}),h.animate(g.animOut||{},g.speed,g.easeOut||g.easing,function(){h.css(g.cssAfter||{}),g.sync||j()}),g.sync&&j()},queueTransition:function(b,c){var d=this.opts(),e=void 0!==c?c:b.timeout;return 0===d.nextSlide&&0===--d.loop?(d.API.log("terminating; loop=0"),d.timeout=0,e?setTimeout(function(){d.API.trigger("cycle-finished",[d])},e):d.API.trigger("cycle-finished",[d]),void(d.nextSlide=d.currSlide)):void 0!==d.continueAuto&&(d.continueAuto===!1||a.isFunction(d.continueAuto)&&d.continueAuto()===!1)?(d.API.log("terminating automatic transitions"),d.timeout=0,void(d.timeoutId&&clearTimeout(d.timeoutId))):void(e&&(d._lastQueue=a.now(),void 0===c&&(d._remainingTimeout=b.timeout),d.paused||d.hoverPaused||(d.timeoutId=setTimeout(function(){d.API.prepareTx(!1,!d.reverse)},e))))},stopTransition:function(){var a=this.opts();a.slides.filter(":animated").length&&(a.slides.stop(!1,!0),a.API.trigger("cycle-transition-stopped",[a])),a._tx&&a._tx.stopTransition&&a._tx.stopTransition(a)},advanceSlide:function(a){var b=this.opts();return clearTimeout(b.timeoutId),b.timeoutId=0,b.nextSlide=b.currSlide+a,b.nextSlide<0?b.nextSlide=b.slides.length-1:b.nextSlide>=b.slides.length&&(b.nextSlide=0),b.API.prepareTx(!0,a>=0),!1},buildSlideOpts:function(c){var d,e,f=this.opts(),g=c.data()||{};for(var h in g)g.hasOwnProperty(h)&&/^cycle[A-Z]+/.test(h)&&(d=g[h],e=h.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,b),f.API.log("["+(f.slideCount-1)+"]",e+":",d,"("+typeof d+")"),g[e]=d);g=a.extend({},a.fn.cycle.defaults,f,g),g.slideNum=f.slideCount;try{delete g.API,delete g.slideCount,delete g.currSlide,delete g.nextSlide,delete g.slides}catch(i){}return g},getSlideOpts:function(b){var c=this.opts();void 0===b&&(b=c.currSlide);var d=c.slides[b],e=a(d).data("cycle.opts");return a.extend({},c,e)},initSlide:function(b,c,d){var e=this.opts();c.css(b.slideCss||{}),d>0&&c.css("zIndex",d),isNaN(b.speed)&&(b.speed=a.fx.speeds[b.speed]||a.fx.speeds._default),b.sync||(b.speed=b.speed/2),c.addClass(e.slideClass)},updateView:function(a,b){var c=this.opts();if(c._initialized){var d=c.API.getSlideOpts(),e=c.slides[c.currSlide];!a&&b!==!0&&(c.API.trigger("cycle-update-view-before",[c,d,e]),c.updateView<0)||(c.slideActiveClass&&c.slides.removeClass(c.slideActiveClass).eq(c.currSlide).addClass(c.slideActiveClass),a&&c.hideNonActive&&c.slides.filter(":not(."+c.slideActiveClass+")").css("visibility","hidden"),0===c.updateView&&setTimeout(function(){c.API.trigger("cycle-update-view",[c,d,e,a])},d.speed/(c.sync?2:1)),0!==c.updateView&&c.API.trigger("cycle-update-view",[c,d,e,a]),a&&c.API.trigger("cycle-update-view-after",[c,d,e]))}},getComponent:function(b){var c=this.opts(),d=c[b];return"string"==typeof d?/^\s*[\>|\+|~]/.test(d)?c.container.find(d):a(d):d.jquery?d:a(d)},stackSlides:function(b,c,d){var e=this.opts();b||(b=e.slides[e.currSlide],c=e.slides[e.nextSlide],d=!e.reverse),a(b).css("zIndex",e.maxZ);var f,g=e.maxZ-2,h=e.slideCount;if(d){for(f=e.currSlide+1;h>f;f++)a(e.slides[f]).css("zIndex",g--);for(f=0;f<e.currSlide;f++)a(e.slides[f]).css("zIndex",g--)}else{for(f=e.currSlide-1;f>=0;f--)a(e.slides[f]).css("zIndex",g--);for(f=h-1;f>e.currSlide;f--)a(e.slides[f]).css("zIndex",g--)}a(c).css("zIndex",e.maxZ-1)},getSlideIndex:function(a){return this.opts().slides.index(a)}},a.fn.cycle.log=function(){window.console&&console.log&&console.log("[cycle2] "+Array.prototype.join.call(arguments," "))},a.fn.cycle.version=function(){return"Cycle2: "+c},a.fn.cycle.transitions={custom:{},none:{before:function(a,b,c,d){a.API.stackSlides(c,b,d),a.cssBefore={opacity:1,visibility:"visible",display:"block"}}},fade:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:0,visibility:"visible",display:"block"}),b.animIn={opacity:1},b.animOut={opacity:0}}},fadeout:{before:function(b,c,d,e){var f=b.API.getSlideOpts(b.nextSlide).slideCss||{};b.API.stackSlides(c,d,e),b.cssBefore=a.extend(f,{opacity:1,visibility:"visible",display:"block"}),b.animOut={opacity:0}}},scrollHorz:{before:function(a,b,c,d){a.API.stackSlides(b,c,d);var e=a.container.css("overflow","hidden").width();a.cssBefore={left:d?e:-e,top:0,opacity:1,visibility:"visible",display:"block"},a.cssAfter={zIndex:a._maxZ-2,left:0},a.animIn={left:0},a.animOut={left:d?-e:e}}}},a.fn.cycle.defaults={allowWrap:!0,autoSelector:".cycle-slideshow[data-cycle-auto-init!=false]",delay:0,easing:null,fx:"fade",hideNonActive:!0,loop:0,manualFx:void 0,manualSpeed:void 0,manualTrump:!0,maxZ:100,pauseOnHover:!1,reverse:!1,slideActiveClass:"cycle-slide-active",slideClass:"cycle-slide",slideCss:{position:"absolute",top:0,left:0},slides:"> img",speed:500,startingSlide:0,sync:!0,timeout:4e3,updateView:0},a(document).ready(function(){a(a.fn.cycle.defaults.autoSelector).cycle()})}(jQuery),/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130913 */
function(a){"use strict";function b(b,d){var e,f,g,h=d.autoHeight;if("container"==h)f=a(d.slides[d.currSlide]).outerHeight(),d.container.height(f);else if(d._autoHeightRatio)d.container.height(d.container.width()/d._autoHeightRatio);else if("calc"===h||"number"==a.type(h)&&h>=0){if(g="calc"===h?c(b,d):h>=d.slides.length?0:h,g==d._sentinelIndex)return;d._sentinelIndex=g,d._sentinel&&d._sentinel.remove(),e=a(d.slides[g].cloneNode(!0)),e.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"),e.css({position:"static",visibility:"hidden",display:"block"}).prependTo(d.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"),e.find("*").css("visibility","hidden"),d._sentinel=e}}function c(b,c){var d=0,e=-1;return c.slides.each(function(b){var c=a(this).height();c>e&&(e=c,d=b)}),d}function d(b,c,d,e){var f=a(e).outerHeight();c.container.animate({height:f},c.autoHeightSpeed,c.autoHeightEasing)}function e(c,f){f._autoHeightOnResize&&(a(window).off("resize orientationchange",f._autoHeightOnResize),f._autoHeightOnResize=null),f.container.off("cycle-slide-added cycle-slide-removed",b),f.container.off("cycle-destroyed",e),f.container.off("cycle-before",d),f._sentinel&&(f._sentinel.remove(),f._sentinel=null)}a.extend(a.fn.cycle.defaults,{autoHeight:0,autoHeightSpeed:250,autoHeightEasing:null}),a(document).on("cycle-initialized",function(c,f){function g(){b(c,f)}var h,i=f.autoHeight,j=a.type(i),k=null;("string"===j||"number"===j)&&(f.container.on("cycle-slide-added cycle-slide-removed",b),f.container.on("cycle-destroyed",e),"container"==i?f.container.on("cycle-before",d):"string"===j&&/\d+\:\d+/.test(i)&&(h=i.match(/(\d+)\:(\d+)/),h=h[1]/h[2],f._autoHeightRatio=h),"number"!==j&&(f._autoHeightOnResize=function(){clearTimeout(k),k=setTimeout(g,50)},a(window).on("resize orientationchange",f._autoHeightOnResize)),setTimeout(g,30))})}(jQuery),/*! caption plugin for Cycle2;  version: 20130306 */
function(a){"use strict";a.extend(a.fn.cycle.defaults,{caption:"> .cycle-caption",captionTemplate:"{{slideNum}} / {{slideCount}}",overlay:"> .cycle-overlay",overlayTemplate:"<div>{{title}}</div><div>{{desc}}</div>",captionModule:"caption"}),a(document).on("cycle-update-view",function(b,c,d,e){if("caption"===c.captionModule){a.each(["caption","overlay"],function(){var a=this,b=d[a+"Template"],f=c.API.getComponent(a);f.length&&b?(f.html(c.API.tmpl(b,d,c,e)),f.show()):f.hide()})}}),a(document).on("cycle-destroyed",function(b,c){var d;a.each(["caption","overlay"],function(){var a=this,b=c[a+"Template"];c[a]&&b&&(d=c.API.getComponent("caption"),d.empty())})})}(jQuery),/*! command plugin for Cycle2;  version: 20140415 */
function(a){"use strict";var b=a.fn.cycle;a.fn.cycle=function(c){var d,e,f,g=a.makeArray(arguments);return"number"==a.type(c)?this.cycle("goto",c):"string"==a.type(c)?this.each(function(){var h;return d=c,f=a(this).data("cycle.opts"),void 0===f?void b.log('slideshow must be initialized before sending commands; "'+d+'" ignored'):(d="goto"==d?"jump":d,e=f.API[d],a.isFunction(e)?(h=a.makeArray(g),h.shift(),e.apply(f.API,h)):void b.log("unknown command: ",d))}):b.apply(this,arguments)},a.extend(a.fn.cycle,b),a.extend(b.API,{next:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?-1:1;a.allowWrap===!1&&a.currSlide+b>=a.slideCount||(a.API.advanceSlide(b),a.API.trigger("cycle-next",[a]).log("cycle-next"))}},prev:function(){var a=this.opts();if(!a.busy||a.manualTrump){var b=a.reverse?1:-1;a.allowWrap===!1&&a.currSlide+b<0||(a.API.advanceSlide(b),a.API.trigger("cycle-prev",[a]).log("cycle-prev"))}},destroy:function(){this.stop();var b=this.opts(),c=a.isFunction(a._data)?a._data:a.noop;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stop(),b.API.trigger("cycle-destroyed",[b]).log("cycle-destroyed"),b.container.removeData(),c(b.container[0],"parsedAttrs",!1),b.retainStylesOnDestroy||(b.container.removeAttr("style"),b.slides.removeAttr("style"),b.slides.removeClass(b.slideActiveClass)),b.slides.each(function(){var d=a(this);d.removeData(),d.removeClass(b.slideClass),c(this,"parsedAttrs",!1)})},jump:function(a,b){var c,d=this.opts();if(!d.busy||d.manualTrump){var e=parseInt(a,10);if(isNaN(e)||0>e||e>=d.slides.length)return void d.API.log("goto: invalid slide index: "+e);if(e==d.currSlide)return void d.API.log("goto: skipping, already on slide",e);d.nextSlide=e,clearTimeout(d.timeoutId),d.timeoutId=0,d.API.log("goto: ",e," (zero-index)"),c=d.currSlide<d.nextSlide,d._tempFx=b,d.API.prepareTx(!0,c)}},stop:function(){var b=this.opts(),c=b.container;clearTimeout(b.timeoutId),b.timeoutId=0,b.API.stopTransition(),b.pauseOnHover&&(b.pauseOnHover!==!0&&(c=a(b.pauseOnHover)),c.off("mouseenter mouseleave")),b.API.trigger("cycle-stopped",[b]).log("cycle-stopped")},reinit:function(){var a=this.opts();a.API.destroy(),a.container.cycle()},remove:function(b){for(var c,d,e=this.opts(),f=[],g=1,h=0;h<e.slides.length;h++)c=e.slides[h],h==b?d=c:(f.push(c),a(c).data("cycle.opts").slideNum=g,g++);d&&(e.slides=a(f),e.slideCount--,a(d).remove(),b==e.currSlide?e.API.advanceSlide(1):b<e.currSlide?e.currSlide--:e.currSlide++,e.API.trigger("cycle-slide-removed",[e,b,d]).log("cycle-slide-removed"),e.API.updateView())}}),a(document).on("click.cycle","[data-cycle-cmd]",function(b){b.preventDefault();var c=a(this),d=c.data("cycle-cmd"),e=c.data("cycle-context")||".cycle-slideshow";a(e).cycle(d,c.data("cycle-arg"))})}(jQuery),/*! hash plugin for Cycle2;  version: 20130905 */
function(a){"use strict";function b(b,c){var d;return b._hashFence?void(b._hashFence=!1):(d=window.location.hash.substring(1),void b.slides.each(function(e){if(a(this).data("cycle-hash")==d){if(c===!0)b.startingSlide=e;else{var f=b.currSlide<e;b.nextSlide=e,b.API.prepareTx(!0,f)}return!1}}))}a(document).on("cycle-pre-initialize",function(c,d){b(d,!0),d._onHashChange=function(){b(d,!1)},a(window).on("hashchange",d._onHashChange)}),a(document).on("cycle-update-view",function(a,b,c){c.hash&&"#"+c.hash!=window.location.hash&&(b._hashFence=!0,window.location.hash=c.hash)}),a(document).on("cycle-destroyed",function(b,c){c._onHashChange&&a(window).off("hashchange",c._onHashChange)})}(jQuery),/*! loader plugin for Cycle2;  version: 20131121 */
function(a){"use strict";a.extend(a.fn.cycle.defaults,{loader:!1}),a(document).on("cycle-bootstrap",function(b,c){function d(b,d){function f(b){var f;"wait"==c.loader?(h.push(b),0===j&&(h.sort(g),e.apply(c.API,[h,d]),c.container.removeClass("cycle-loading"))):(f=a(c.slides[c.currSlide]),e.apply(c.API,[b,d]),f.show(),c.container.removeClass("cycle-loading"))}function g(a,b){return a.data("index")-b.data("index")}var h=[];if("string"==a.type(b))b=a.trim(b);else if("array"===a.type(b))for(var i=0;i<b.length;i++)b[i]=a(b[i])[0];b=a(b);var j=b.length;j&&(b.css("visibility","hidden").appendTo("body").each(function(b){function g(){0===--i&&(--j,f(k))}var i=0,k=a(this),l=k.is("img")?k:k.find("img");return k.data("index",b),l=l.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'),l.length?(i=l.length,void l.each(function(){this.complete?g():a(this).load(function(){g()}).on("error",function(){0===--i&&(c.API.log("slide skipped; img not loaded:",this.src),0===--j&&"wait"==c.loader&&e.apply(c.API,[h,d]))})})):(--j,void h.push(k))}),j&&c.container.addClass("cycle-loading"))}var e;c.loader&&(e=c.API.add,c.API.add=d)})}(jQuery),/*! pager plugin for Cycle2;  version: 20140415 */
function(a){"use strict";function b(b,c,d){var e,f=b.API.getComponent("pager");f.each(function(){var f=a(this);if(c.pagerTemplate){var g=b.API.tmpl(c.pagerTemplate,c,b,d[0]);e=a(g).appendTo(f)}else e=f.children().eq(b.slideCount-1);e.on(b.pagerEvent,function(a){b.pagerEventBubble||a.preventDefault(),b.API.page(f,a.currentTarget)})})}function c(a,b){var c=this.opts();if(!c.busy||c.manualTrump){var d=a.children().index(b),e=d,f=c.currSlide<e;c.currSlide!=e&&(c.nextSlide=e,c._tempFx=c.pagerFx,c.API.prepareTx(!0,f),c.API.trigger("cycle-pager-activated",[c,a,b]))}}a.extend(a.fn.cycle.defaults,{pager:"> .cycle-pager",pagerActiveClass:"cycle-pager-active",pagerEvent:"click.cycle",pagerEventBubble:void 0,pagerTemplate:"<span>&bull;</span>"}),a(document).on("cycle-bootstrap",function(a,c,d){d.buildPagerLink=b}),a(document).on("cycle-slide-added",function(a,b,d,e){b.pager&&(b.API.buildPagerLink(b,d,e),b.API.page=c)}),a(document).on("cycle-slide-removed",function(b,c,d){if(c.pager){var e=c.API.getComponent("pager");e.each(function(){var b=a(this);a(b.children()[d]).remove()})}}),a(document).on("cycle-update-view",function(b,c){var d;c.pager&&(d=c.API.getComponent("pager"),d.each(function(){a(this).children().removeClass(c.pagerActiveClass).eq(c.currSlide).addClass(c.pagerActiveClass)}))}),a(document).on("cycle-destroyed",function(a,b){var c=b.API.getComponent("pager");c&&(c.children().off(b.pagerEvent),b.pagerTemplate&&c.empty())})}(jQuery),/*! prevnext plugin for Cycle2;  version: 20140408 */
function(a){"use strict";a.extend(a.fn.cycle.defaults,{next:"> .cycle-next",nextEvent:"click.cycle",disabledClass:"disabled",prev:"> .cycle-prev",prevEvent:"click.cycle",swipe:!1}),a(document).on("cycle-initialized",function(a,b){if(b.API.getComponent("next").on(b.nextEvent,function(a){a.preventDefault(),b.API.next()}),b.API.getComponent("prev").on(b.prevEvent,function(a){a.preventDefault(),b.API.prev()}),b.swipe){var c=b.swipeVert?"swipeUp.cycle":"swipeLeft.cycle swipeleft.cycle",d=b.swipeVert?"swipeDown.cycle":"swipeRight.cycle swiperight.cycle";b.container.on(c,function(){b._tempFx=b.swipeFx,b.API.next()}),b.container.on(d,function(){b._tempFx=b.swipeFx,b.API.prev()})}}),a(document).on("cycle-update-view",function(a,b){if(!b.allowWrap){var c=b.disabledClass,d=b.API.getComponent("next"),e=b.API.getComponent("prev"),f=b._prevBoundry||0,g=void 0!==b._nextBoundry?b._nextBoundry:b.slideCount-1;b.currSlide==g?d.addClass(c).prop("disabled",!0):d.removeClass(c).prop("disabled",!1),b.currSlide===f?e.addClass(c).prop("disabled",!0):e.removeClass(c).prop("disabled",!1)}}),a(document).on("cycle-destroyed",function(a,b){b.API.getComponent("prev").off(b.nextEvent),b.API.getComponent("next").off(b.prevEvent),b.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")})}(jQuery),/*! progressive loader plugin for Cycle2;  version: 20130315 */
function(a){"use strict";a.extend(a.fn.cycle.defaults,{progressive:!1}),a(document).on("cycle-pre-initialize",function(b,c){if(c.progressive){var d,e,f=c.API,g=f.next,h=f.prev,i=f.prepareTx,j=a.type(c.progressive);if("array"==j)d=c.progressive;else if(a.isFunction(c.progressive))d=c.progressive(c);else if("string"==j){if(e=a(c.progressive),d=a.trim(e.html()),!d)return;if(/^(\[)/.test(d))try{d=a.parseJSON(d)}catch(k){return void f.log("error parsing progressive slides",k)}else d=d.split(new RegExp(e.data("cycle-split")||"\n")),d[d.length-1]||d.pop()}i&&(f.prepareTx=function(a,b){var e,f;return a||0===d.length?void i.apply(c.API,[a,b]):void(b&&c.currSlide==c.slideCount-1?(f=d[0],d=d.slice(1),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.API.advanceSlide(1)},50)}),c.API.add(f)):b||0!==c.currSlide?i.apply(c.API,[a,b]):(e=d.length-1,f=d[e],d=d.slice(0,e),c.container.one("cycle-slide-added",function(a,b){setTimeout(function(){b.currSlide=1,b.API.advanceSlide(-1)},50)}),c.API.add(f,!0)))}),g&&(f.next=function(){var a=this.opts();if(d.length&&a.currSlide==a.slideCount-1){var b=d[0];d=d.slice(1),a.container.one("cycle-slide-added",function(a,b){g.apply(b.API),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(b)}else g.apply(a.API)}),h&&(f.prev=function(){var a=this.opts();if(d.length&&0===a.currSlide){var b=d.length-1,c=d[b];d=d.slice(0,b),a.container.one("cycle-slide-added",function(a,b){b.currSlide=1,b.API.advanceSlide(-1),b.container.removeClass("cycle-loading")}),a.container.addClass("cycle-loading"),a.API.add(c,!0)}else h.apply(a.API)})}})}(jQuery),/*! tmpl plugin for Cycle2;  version: 20121227 */
function(a){"use strict";a.extend(a.fn.cycle.defaults,{tmplRegex:"{{((.)?.*?)}}"}),a.extend(a.fn.cycle.API,{tmpl:function(b,c){var d=new RegExp(c.tmplRegex||a.fn.cycle.defaults.tmplRegex,"g"),e=a.makeArray(arguments);return e.shift(),b.replace(d,function(b,c){var d,f,g,h,i=c.split(".");for(d=0;d<e.length;d++)if(g=e[d]){if(i.length>1)for(h=g,f=0;f<i.length;f++)g=h,h=h[i[f]]||c;else h=g[c];if(a.isFunction(h))return h.apply(g,e);if(void 0!==h&&null!==h&&h!=c)return h}return c})}})}(jQuery);
;

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {	
// To understand behaviors, see https://drupal.org/node/756722#behaviors

	/**
	 * ASPCA Image Gallery
	 */
	Drupal.behaviors.aspcaImageGallery = {
		attach: function (context, settings) {
			// check for visibility, if visible scroll, if invisible set speed to 0
			/*this.checkVisible = function () {
				// iterate through all image galleries on the page
				$('.view-id-image_gallery_view', context).each(function(){
					// if we can see the element, play the cycle
					if (elementInViewport($(this)[0])) {
						$(this).find('.view-content').cycle('resume');
					} else {
						// otherwise pause it
						$(this).find('.view-content').cycle('pause');
					}
				});
			}*/
			// If a gallery is present
			if (($('.image-gallery-view.view-display-id-panel_pane_1')[0] || $(".image-gallery-view.view-display-id-panel_pane_3")[0] || $(".image-gallery-view.view-display-id-panel_pane_4", context)[0]) && $('.image-gallery-view .views-row', context)[1]) {
				// Set nav
				$('.image-gallery-view.view-display-id-panel_pane_1 .view-content, .image-gallery-view.view-display-id-panel_pane_3 .view-content, .image-gallery-view.view-display-id-panel_pane_4 .view-content', context).before('<div id="gallery-controls"><a id="prev" href="#"><</a> <div id="current-index"></div> of <div id="slide-count"></div> <a id="next" href="#">></a>');
				// Initialize: set pager numbers
		  $('.image-gallery-view.view-display-id-panel_pane_1 .view-content, .image-gallery-view.view-display-id-panel_pane_3 .view-content, .image-gallery-view.view-display-id-panel_pane_4 .view-content', context).on( 'cycle-initialized', function(event, opts) {
					var currentSlide = $(this).data("cycle.opts").currSlide + 1;  
					var slideCount = opts.slideCount;
					$('#current-index').html(currentSlide);
					$('#slide-count').html(slideCount);
		  });
				// After: update pager numbers
		  $('.image-gallery-view.view-display-id-panel_pane_1 .view-content, .image-gallery-view.view-display-id-panel_pane_3 .view-content, .image-gallery-view.view-display-id-panel_pane_4 .view-content', context).on( 'cycle-after', function(event, opts, outgoingSlideEl, incomingSlideEl, forwardFlag) {
					var currentSlide = $(this).data("cycle.opts").currSlide + 1;  
					var slideCount = opts.slideCount;
					$('#current-index').html(currentSlide);
					$('#slide-count').html(slideCount);
		  });

				$('.image-gallery-view.view-display-id-panel_pane_1 .view-content, .image-gallery-view.view-display-id-panel_pane_3 .view-content, .image-gallery-view.view-display-id-panel_pane_4 .view-content', context).cycle({
					next: '#next',
					prev: '#prev',
					overlay: false,
					slides: '> .views-row',
					fx: 'fade',
					speed: 450,
					timeout: 0, // manual progression 
					loader: "wait",
				});
			} else if ($(".image-gallery-view.view-display-id-panel_pane_2", context)[0]) {
				$(".image-gallery-view.view-display-id-panel_pane_2", context).each(function (i) {
			$(this).addClass('slideshow');
					// Make sure view has more than one item
					if (!$('.views-row', this)[1]) {
						return;
					}
			$('.caption').addClass('cycle-overlay');
			$('.views-row', this).addClass('slide');
					// Make controls dynamic
					var prev = 'prev-' + i;
					var next = 'next-' + i;
					var galleryControls = 'gallery-controls-' + i;
					// Build controls
					$(this).find('.view-content').each(function () {
			  $(this).addClass('slides');
			  $(this).attr('data-cycle-auto-height','calc');
						$(this).before('<div id="' + galleryControls + '"><a id="' + prev + '" class="prev" href="#">Previous</a><a id="' + next + '" class="next" href="#">Next</a>');
					});
					// Build cycle
					$('.view-content', this).cycle({
			  next: '#' + galleryControls + ' .next',
			  prev: '#' + galleryControls + ' .prev',
			  overlay: '> .cycle-overlay',
			  slides: '> .views-row',
			  fx: 'fade',
			  // auto-height: 'calc',
			  speed: 450,
			  timeout: 0, // manual progression 
			  loader: "wait",
					});
				});
			} else if ($('.image-gallery-view.view-display-id-panel_pane_5',context)[0] && $('.image-gallery-view.view-display-id-panel_pane_5 .views-row',context)[1]) {
		  // Set nav
		  $('.image-gallery-view.view-display-id-panel_pane_5 .view-content').before('<div id="gallery-controls"><a id="prev" href="#"><</a><a id="next" href="#">></a>');
		  // Start cycle
		  $('.image-gallery-view.view-display-id-panel_pane_5 .view-content').cycle({
			slides: '.views-row',
			fx: 'scrollHorz',
			speed: 450,
			timeout: 8000,
			pause: true,
			timeout: 4000,
			next: '.image-gallery-view #gallery-controls #next',
			prev: '.image-gallery-view #gallery-controls #prev',
			loader: 'wait'
		  });
		}
			// check if gallery is present at all
			/*if ($('.view-id-image_gallery_view', context)[0] && $('.image-gallery-view .views-row',context)[1]) {
				this.throttleVisible = function () {
					var LID = setInterval(this.checkVisible, 2000);
				}
				$(window).scroll(this.throttleVisible());
			}*/
		}
	}

})(jQuery, Drupal, this, this.document);
;
/*
  mediaCheck
  http://github.com/sparkbox/mediaCheck

  Version: 0.4.5, 14-07-2014
  Author: Rob Tarr (http://twitter.com/robtarr)
*/!function(){window.mediaCheck=function(a){var b,c,d,e,f,g,h,i,j;if(i=void 0,j=void 0,d=void 0,c=void 0,e=void 0,f=void 0!==window.matchMedia&&!!window.matchMedia("!").addListener)return j=function(a,b){return a.matches?"function"==typeof b.entry&&b.entry(a):"function"==typeof b.exit&&b.exit(a),"function"==typeof b.both?b.both(a):void 0},d=function(){return i=window.matchMedia(a.media),i.addListener(function(){return j(i,a)}),window.addEventListener("orientationchange",function(){return i=window.matchMedia(a.media),j(i,a)},!1),j(i,a)},d();b={},j=function(a,c){return a.matches?"function"!=typeof c.entry||b[c.media]!==!1&&null!=b[c.media]||c.entry(a):"function"!=typeof c.exit||b[c.media]!==!0&&null!=b[c.media]||c.exit(a),"function"==typeof c.both&&c.both(a),b[c.media]=a.matches},c=function(a){var b,c;return b=void 0,b=document.createElement("div"),b.style.width="1em",b.style.position="absolute",document.body.appendChild(b),c=a*b.offsetWidth,document.body.removeChild(b),c},e=function(a,b){var d;switch(d=void 0,b){case"em":d=c(a);break;default:d=a}return d};for(g in a)b[a.media]=null;return h=function(){var b,c,d,f,g;return d=a.media.match(/\((.*)-.*:\s*([\d\.]*)(.*)\)/),b=d[1],f=e(parseInt(d[2],10),d[3]),c={},g=window.innerWidth||document.documentElement.clientWidth,c.matches="max"===b&&f>g||"min"===b&&g>f,j(c,a)},window.addEventListener?window.addEventListener("resize",h):window.attachEvent&&window.attachEvent("onresize",h),h()}}.call(this);
;
(function($) {
  Drupal.behaviors.DonationFormJS = {
    attach: function (context, settings) {
      if (!$('body').hasClass('form-processed')) {
        // vars
        var step = 0;
        var formFieldsets = '#main-wrapper .donation-form form.webform-client-form > fieldset.webform-component-fieldset';
        var amountText = 'You are making a [type] donation of <span>Rs. [amount]</span> to the Scooby Shelter!';
        // monthly vs one-time donation
        var typeMonthlyPrimary = false;
        if ($('body #donation-type-var').text().length > 0) {
          typeMonthlyPrimary = ($('body #donation-type-var').text() == 'true') ? true : false;
        }
        $('body',context).addClass('monthly-tab-first-' + ((typeMonthlyPrimary) ? 'true' : 'false'));

        $('#main-wrapper .donation-links a.secondary.active, #main-wrapper .donation-links a.primary.active',context).click(function(e){
          e.preventDefault();
        });

        // Remove title link from node body
        $('.donation-form > .node > h2').remove();

        // Remove ssl-cert from node body
        $('#ssl-cert').remove();

        // Move captcha to payment section.
        if ($('fieldset.captcha').length) {
          $('fieldset.captcha').appendTo('#webform-component-payment-information > .fieldset-wrapper').show();
        }

        // for select styling
        $('select',context).each(function(){
          $(this).wrap('<div class="dropdown-select" />');
        });

        // design requires this to make it look correct
        $('#main-wrapper .donation-links').once(function(){
          $(this).append('<div class="mobile-spacer"/>');
          $(this).find('a').each(function(){
            $(this).html('<span>' + $(this).text() + '</span>');
          });
        });

        // service links fixes
        $('#block-service-links-service-links .service-links ul li',context).each(function(){
          var linkClass = $(this).find('a').attr('class');
          if (typeof linkClass != 'undefined' && linkClass.length > 0) {
            $(this).addClass(linkClass);
          } else if ($(this).find('.service-links-google-plus-one')[0]) {
            $(this).addClass('share-google-plus');
          }
        });

        // check if the browser is responsive
        function isMobile() {
          return $('body #is-mobile').css('display') == 'block';
        }

        // check if a selector (input) has a value and add/remove class
        function addRemoveClassIfEmpty(sel,parent)  {
          if(sel.val().length == 0){
            parent.removeClass('has-value');
          } else {
            parent.addClass('has-value');
          }
        }
        // text and email label show/hide
        $('.webform-client-form .webform-component-email,.webform-client-form .webform-component-textfield,.webform-client-form .form-type-textfield',context).each(function(){
          var thisInput = $(this).find('input');
          var thisInputParent = $(this).find('input').parent();
          // hide or show initially
          addRemoveClassIfEmpty(thisInput,thisInputParent);
          // add the element-label class
          $(this).find('label:first-of-type').addClass('element-label');
          // keyup
          thisInput.keyup(function(){
            addRemoveClassIfEmpty(thisInput,thisInputParent);
          });
          // focus
          thisInput.focus(function(){
            thisInputParent.addClass('focused');
          });
          // blur
          thisInput.blur(function(){
            thisInputParent.removeClass('focused');
            addRemoveClassIfEmpty(thisInput,thisInputParent);
          });
          // autocomplete event
          thisInput.change(function(){
            addRemoveClassIfEmpty(thisInput,thisInputParent);
          });
        });
        // textarea show/hide
        $('.webform-client-form .webform-component-textarea',context).each(function(){
          var thisComponent = $(this);
          var thisTextarea = $(this).find('textarea');
          // hide or show initially
          addRemoveClassIfEmpty(thisTextarea,thisComponent);
          // add the element-label class
          $(this).find('label:first-of-type').addClass('element-label');
          // keyup
          thisTextarea.keyup(function(){
            addRemoveClassIfEmpty(thisTextarea,thisComponent);
          });
          // focus
          thisTextarea.focus(function(){
            thisComponent.addClass('focused');
          });
          // blur
          thisTextarea.blur(function(){
            thisComponent.removeClass('focused');
            addRemoveClassIfEmpty(thisTextarea,thisComponent);
          });
          // autocomplete event
          thisTextarea.change(function(){
            addRemoveClassIfEmpty(thisTextarea,thisComponent);
          });
        });

        // Fix the first state dropdown select option on step two and step three memorial giving
        $('.webform-client-form #webform-component-billing-information--state select,.webform-client-form #webform-component-payment-information-toggle-wrapper #webform-component-payment-information-toggle-wrapper-paper-card-fields #webform-component-payment-information--toggle-wrapper--paper-card-fields--shipping-state-province select',context)
          .find('option:first-child').text('Select');
        // Fix the other amount field label that conflicts with aspca.js
        $('#webform-component-donation #webform-component-donation--other-amount').append('<div class="element-label">Other</div>');

        // Fix the state dropdown abbrevations
        $('.webform-client-form #webform-component-billing-information--state select').once(function(){
          $(this).find('option').each(function(){
            if ($(this).val().length > 0) {
              $(this).text($(this).val());
            }
          });
        });
        // Get form Submit text
        submitText = $('#edit-submit').val();
        var submitTextValue = $('<span></span>').text(submitText).html();
        // setup fieldsets
        $(formFieldsets,context).once('progress').each(function(step){
          if (step == 0) {
            $(this).append('<div class="progress-buttons"><div class="progress-wrap"><div class="continue">Continue</div></div></div>').addClass('active');
          } else if (step == 1) {
            $(this).append('<div class="progress-buttons"><div class="progress-wrap"><div class="back">Back</div><div class="continue">Continue</div></div></div>');
          } else {
            $(this).append('<div class="progress-buttons"><div class="progress-wrap"><div class="back">Back</div><div class="complete">' + submitTextValue + '</div></div></div>');
          }
          $(this).addClass('step-' + step);
        });

        /**
         * check for errors in each fieldset
         * the approach was to check for the label.error since we are already doing validation with jQuery validate
         * if .error is not found, we need to check if the input is required and force the user to validate that input before progressing
         **/
        function checkForErrors(sel) {
          var hasError = false;
          var errors = '';
          // Find hidden conditional fields
          hiddenConditionals = sel.find('.form-item').filter('.conditional:hidden');
          // Validate form items, excluding hidden conditional fields
          sel.find('.form-item').not(hiddenConditionals).each(function(){
            // keep a reference to the .form-item elements
            var formItemEle = $(this);
            // check if the .error class exists, else we know that jQuery has not already validated or invalidated the input element
            if (formItemEle.find('label.error')[0]) {
              if (!formItemEle.find('label.error.valid')[0]) {
                // set error to true and label: error html to be displayed
                hasError = true;
                // first select option or the .element-label first-child
                if (formItemEle.find('label.error').siblings('select')[0]) {
                  var inputLabel = formItemEle.find('select option:first-child').text().trim();
                } else {
                  var inputLabel = formItemEle.find('.element-label:first-child').text().replace(/[.*]+/g,' ').trim();
                }
                errors += '<li><span>' + inputLabel + '</span>: ' + formItemEle.find('label.error').text().replace(/[.*]+/g,' ').trim() + '.</li>';
              }
            } else {
              if (formItemEle.find('input.required')[0] || formItemEle.find('select.required')) {

                // return before validation if the text element is the other amount on step one
                if (formItemEle.find('input.required[name*="other_amount"]')[0]) return;

                // if not a text element then we validate it as a select element, checkboxes by nature have multiple or no values
                if (formItemEle.find('input.required.form-text')[0]) {
                  var selectedValue = formItemEle.find('input.required.form-text').val();
                  if (!selectedValue.length > 0) {
                    // set error to true and label: error html to be displayed
                    hasError = true;
                    var inputLabel = formItemEle.find('.element-label:first-child').text().replace(/[.*]+/g,' ').trim();
                    errors += '<li><span>' + inputLabel + '</span>: This field is required.</li>';
                  }
                } else if (formItemEle.find('select.required')[0]) {
                  var selectedValue = formItemEle.find('select.required option:selected').val();
                  if (!selectedValue.length > 0) {
                    // set error to true and label: error html to be displayed
                    hasError = true;
                    var inputLabel = formItemEle.find('select.required option:first-child').text().trim();
                    errors += '<li><span>' + inputLabel + '</span>: Please select a value.</li>';
                  }
                }
              }
            }
          });
          if (hasError == true) {
            return '<ul>' + errors + '</ul>';
          }
          return '';
        }

        // set the error for a step
        function setStepError(stepSelector, errors) {
          if ($(stepSelector + ' .step-errors').length > 0) {
            $(stepSelector).find('.step-errors').html(errors);
          } else {
            $(stepSelector).prepend('<div class="mobile-message-wrapper"><div class="step-errors messages error"></div></div>');
            $(stepSelector).find('.step-errors').html(errors);
          }
        }

        // validate the inputs for the current step
        function validateStep(currentStep) {
          // assume the first tab selector
          var stepSelector = '.webform-client-form #webform-component-donation';
          // first tab specific validation
          if (currentStep == 0) {
            var value = $(stepSelector + ' input[type="radio"]:checked').val();
            var minimumAmount = parseInt(Drupal.settings.fundraiserWebform.minimum_donation_amount,10);
            // if the value is 0 or undefined
            if (typeof value == 'undefined' || value.length <= 0) {
              // specify validation error text
              setStepError(stepSelector,'<span>Error:</span> Please select a donation amount.');
              // return false
              return false;
            } else if (value == 'other') {
              // get the other amount
              var otherVal = $(stepSelector + ' #webform-component-donation--other-amount input').val();
              // if the other amount is 0 or undefined
              if (typeof otherVal == 'undefined' || otherVal.length <= 0) {
                // request that the user specify an amount
                setStepError(stepSelector,'<span>Error:</span> Please enter a donation amount.');
                // focus the other amount textfield
                $(stepSelector + ' #webform-component-donation--other-amount input').focus();
                // return false
                return false;
              }
              else if (otherVal < minimumAmount) {
                // request that the user specify an amount
                setStepError(stepSelector,'<span>Error:</span> The amount entered is less than the minimum donation amount.');
                // focus the other amount textfield
                $(stepSelector + ' #webform-component-donation--other-amount input').focus();
                // return false
                return false;
              }
            }
          }
          // second tab specific validation
          else if (currentStep == 1) {
            stepSelector = '.webform-client-form #webform-component-billing-information';
          }
          // third tab specific validation
          else if (currentStep == 2) {
            // last step
            stepSelector = '.webform-client-form #webform-component-payment-information';
            // get the payment selection
            var paymentMethod = jQuery(stepSelector + ' input.fundraiser-payment-methods[type="radio"]:checked').val();
            // if there is only one payment method it will be a hidden input
            if (typeof paymentMethod == 'undefined') {
              paymentMethod = jQuery(stepSelector + ' input[name*="payment_method"]').val();
            }
            // only check for errors if the payment method is credit
            if (paymentMethod == 'credit') {
              // credit card and cvv selectors
              $(stepSelector + ' .form-item-submitted-payment-information-payment-fields-credit-card-number input').blur();
              $(stepSelector + ' .form-item-submitted-payment-information-payment-fields-credit-card-cvv input').blur();
              // check for errors
              var errors = checkForErrors($(stepSelector));
              if (errors.length > 0) {
                // set step errors
                setStepError(stepSelector,errors);
                // return false
                return false;
              }
            }
            // if there is no defined payment method at this point we will let
            // Springboard & Webform's validation handle it but log a message
            if (typeof paymentMethod == 'undefined') {
              console.log('Error: payment method undefined');
            }
          }

          // all tabs except for the last: check for jQuery validation errors present on the fieldset selector
          if ((currentStep != 2)) {
            var errors = checkForErrors($(stepSelector));
            if (errors.length > 0) {
              // set step errors
              setStepError(stepSelector,errors);
              // return false
              return false;
            }
          }

          // default: clear out the visual errors if they have been corrected
          $(stepSelector + ' .step-errors').remove();
          // return true if no step-specific or general requred errors are found
          return true;
        }

        // get the donation amount
        function getDonationAmount() {
          var checkedVal = $('.webform-client-form #webform-component-donation input[type="radio"]:checked').val();
          if (checkedVal == 'other') {
            return $('.webform-client-form #webform-component-donation #webform-component-donation--other-amount input[type="text"]').val();
          }
          return checkedVal;
        }

        // get the donation type: one-time or monthly
        function getDonationType() {
          if (typeMonthlyPrimary) {
            return ($('#main-wrapper .donation-links .primary').hasClass('active')) ? 'monthly' : 'one time';
          } else {
            return ($('#main-wrapper .donation-links .primary').hasClass('active')) ? 'one time' : 'monthly';
          }
        }

        // include any step-based validation or amount display here
        function processStep(nextStep) {
          if (nextStep == 1) {
            var donationAmount = getDonationAmount();
            if (donationAmount.length > 0) {
              var type = getDonationType();
              var donationMessage = amountText.replace('[amount]',donationAmount);
              donationMessage = donationMessage.replace('[type]',type);
              // step 1 & 2 share the same message
              if ($('.webform-client-form #webform-component-billing-information .amount-display').length > 0) {
                $('.webform-client-form #webform-component-billing-information .amount-display').html(donationMessage);
                $('.webform-client-form #webform-component-payment-information .amount-display').html(donationMessage);
              } else {
                $('.webform-client-form #webform-component-billing-information > .fieldset-wrapper').before('<div class="amount-display">' + donationMessage + '</div>');
                $('.webform-client-form #webform-component-payment-information > .fieldset-wrapper').before('<div class="amount-display">' + donationMessage + '</div>');
              }
            }
          }
          // hide the below-form content and service links for steps two and three
          if (nextStep >= 1) {
            $('#main-wrapper .after-content,#main-wrapper #block-service-links-service-links').hide();
          } else {
            $('#main-wrapper .after-content,#main-wrapper #block-service-links-service-links').show();
          }
        }

        // go to a different step
        function goTo(direction) {
          // preform fieldset validation
          if (direction == '+') {
            var isValid = validateStep(step);
            if (!isValid) return;
          }

          // determine the new step based upon direction
          if (direction == '+') {
            if (step + 1 <= 2) {
              step = step + 1;
            }
          } else {
            if (step - 1 >= 0) {
              step = step - 1;
            }
          }
          // remove the step errors div
          $(formFieldsets + '.step-' + step).find('.step-errors').remove();
          // validation and amount display
          processStep(step);
          // display the new fieldset
          $(formFieldsets + '.active').removeClass('active');
          $(formFieldsets + '.step-' + step).addClass('active');
          // change the current step display
          $('#main-wrapper .donation-steps .step').removeClass('active');
          $('#main-wrapper .donation-steps .step-' + step).addClass('active');
          // set 'done'
          $('.donation-steps .done').removeClass('done');
          stepUpdate = false;
          $(formFieldsets).each(function(step){
            if (stepUpdate == false) {
              $('.donation-steps .step-'+step).addClass('done');
            }
            if ($('.donation-steps .step-'+ step).hasClass('active')) {
              stepUpdate = true;
            }
          });
        }
        // animate to top with callback
        function scrollTopAndMove(direction) {
          $('html,body').animate({
            scrollTop: $('#main-wrapper .donation-links').offset().top
          }, 500, goTo(direction));
        }

        function processDonation(){
          // hide the Complete and Back buttons, show a processing button.
          $('#webform-component-payment-information .progress-buttons .progress-wrap').find('.back').hide();
          $('#webform-component-payment-information .progress-buttons .progress-wrap').find('.complete').hide();
          $('#webform-component-payment-information .progress-buttons .progress-wrap').append('<div class="processing">Processing <div class="dots"></div></div>');
          // click the submit input
          $('.webform-client-form .form-actions input').click();
        }

        // click handlers
        $('#main-wrapper .donation-form .continue').click(function(){
          scrollTopAndMove('+');
        });
        $('#main-wrapper .donation-form .back').click(function(){
          scrollTopAndMove('-');
        });
        $('#main-wrapper .donation-form .complete').click(function(){
          // validate all steps for mobile
          if (isMobile()) {
            if (validateStep(0) == false || validateStep(1) == false || validateStep(2) == false) {
              $('html,body').animate({
                scrollTop: $('#main-wrapper .messages.error').offset().top
              }, 500);
              return;
            }
          }
          // otherwise just validate the last step
          else {
            // validation before submit
            if (validateStep(2) == false) return;
          }
          processDonation();
        });

        // Memorial gift and tribute
        $('.node-type-donation-form .webform-client-form',context).once(function(){
          // input vars
          var checkbox = $('#webform-component-donation #webform-component-donation--dedicate-to-a-friend-of-loved-one input',this);
          // checkbox description
          var checkboxDescription = $('#webform-component-donation #webform-component-donation--dedicate-to-a-friend-of-loved-one .description',this);
          // selection type
          var selectionRadio = $('#webform-component-payment-information #webform-component-payment-information-toggle-wrapper #webform-component-payment-information--toggle-wrapper--card-type input',this);
          // wrappers to toggle
          var toggleWrapper = $('#webform-component-payment-information #webform-component-payment-information-toggle-wrapper',this);
          var ecardWrapper = $('#webform-component-payment-information #webform-component-payment-information-toggle-wrapper #webform-component-payment-information-toggle-wrapper-ecard-fields',this);
          var paperCardWrapper = $('#webform-component-payment-information #webform-component-payment-information-toggle-wrapper #webform-component-payment-information-toggle-wrapper-paper-card-fields',this);

          // initial checkbox visibility
          if (checkbox.is(':checked')) {
            toggleWrapper.css('display','block');
            toggleWrapper.find('#webform-component-payment-information--toggle-wrapper--card-type').css('display','block');
            checkboxDescription.css('display','block');
          }
          // on change of memorial/gift
          checkbox.on('change',function(){
            if ($(this).is(':checked')) {
              toggleWrapper.css('display','block');
              checkboxDescription.css('display','block');
            } else {
              toggleWrapper.css('display','none');
              checkboxDescription.css('display','none');
            }
          });
          // on change of memorial/gift type
          selectionRadio.on('change',function(){
            if ($(this).val() == 'ecard') {
              ecardWrapper.find('.form-item.conditional').show();
              ecardWrapper.slideDown();
              paperCardWrapper.slideUp();
            } else {
              ecardWrapper.slideUp();
              paperCardWrapper.find('.form-item.conditional').show();
              paperCardWrapper.slideDown();
            }
          });

        });

        // Fix a mobile issue
        $('.donation-form',context).find('.messages').wrap('<div class="mobile-message-wrapper"/>');

        /*
         * The below code appends extra url parameters
         * to the tab links, but will not overwrite
         * existing parameters configured by the admin.

         * Further, if params are hard-code in a link
         * and that link is clicked, those link parameters
         * will be added to a skipParams parameter so that
         * they will not automatically be appended as parameters
         * in the destination page tab links.
         */
        // function to get parameters from a string
        function getQueryParams(qs) {
          qs = qs.split("+").join(' ');
          var params = {};
          var tokens;
          var regex = /[?&]?([^=]+)=([^&]*)/g;
          while (tokens = regex.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
          }
          return params;
        }
        // if a skipParams parameter is set, remove those objects and remove the skipParams object also
        // this will make sure parameters from hard-coded tabs are not passed through.
        function removeRestrictedParams(paramObject) {
          var skip = paramObject['skipParams'];
          if (typeof skip != 'undefined' && skip.length > 0) {
            var skipArray = paramObject['skipParams'].split('-');
            var skipArrayLength = skipArray.length;
            //console.log(skipArray);
            // loop through each parameter object
            for (var key in paramObject) {
              if (paramObject.hasOwnProperty(key)) {
                //console.log(key + ' : ' + paramObject[key]);
                // go through each skip array term
                for (var i = 0; i < skipArrayLength; i++) {
                  // if the skip array contains the key for the object property, delete it
                  if (skipArray[i] == key) {
                    // delete the object
                    delete paramObject[key];
                    break;
                  }
                }
              }
            }
            delete paramObject.skipParams;
            return paramObject;
          } else {
            return paramObject;
          }
        }
        // combine two objects into a string helper - not overwriting tab (priorityObject) link values
        // append object are the exisitng url parameters object from the document.location.search string
        function combineObjectsToString(priorityObject, appendObject) {
          if (typeof priorityObject == 'object' && typeof appendObject == 'object') {
            var fixedTerms = removeRestrictedParams(appendObject);
            var combined = jQuery.extend({}, fixedTerms, priorityObject);
            return jQuery.param(combined);
          }
          return '';
        }
        // if parameters exist in the url path, we want to append them to tab links
        if (document.location.search.length > 0) {
          // page visited parameters
          var queryParams = getQueryParams(document.location.search);
          // return if there are no query parameters
          if (jQuery.isEmptyObject(queryParams)) return;
          // make sure we pass any parameter variables to tab links
          $('#main-wrapper .donation-links > a').each(function(){
            var hrefValue = $(this).attr('href');
            // check if there is a href value
            if (hrefValue.length > 0) {
              var hrefArr = hrefValue.split('?');
              // get parameters from href in tab link
              var hrefParameters = getQueryParams(hrefArr.pop());
              // check if they exist
              if (jQuery.isEmptyObject(hrefParameters)) {
                // clear up and skipped parameters
                $(this).attr('href', hrefValue + '?' + jQuery.param(removeRestrictedParams(queryParams)));
              } else {
                var baseLink = hrefArr[0];
                var hrefParamKeys = Object.keys(hrefParameters).join('-');
                var newParamString = combineObjectsToString(hrefParameters,queryParams);
                if (newParamString.length > 0) {
                  $(this).attr('href', baseLink + '?' + newParamString + '&' + 'skipParams=' + hrefParamKeys);
                }
              }
            }
          });
        }

      }
      // Add processed class.
      $('body').addClass('form-processed');
    }
  };


  // Move donation title text and continue button for tablet
  Drupal.behaviors.donationTitle = {
    attach: function (context, settings) {
      // Set tablet header title location
      mediaCheck({
        media: '(min-width: 733px) and (max-width: 1140px)',
        entry: function() {
          $('.donation-title').prependTo($('#main-wrapper'));
          $('.step-1 .continue').prependTo($('.step-1 .progress-wrap'));
          $('.step-2 .complete').prependTo($('.step-2 .progress-wrap'));
        },
        exit: function() {
          $('.donation-title').prependTo($('.left-sidebar'));
          $('.step-1 .continue').appendTo($('.step-1 .progress-wrap'));
          $('.step-2 .complete').appendTo($('.step-2 .progress-wrap'));
        },
        both: function() {
          // Changing state;
        }
      });
    }
  }


  // Tablet step behavior
  Drupal.behaviors.tabletSteps = {
    attach: function (context, settings) {
      // Set tablet header title location
      mediaCheck({
        media: '(min-width: 733px) and (max-width: 1140px)',
        entry: function() {
          $('.donation-title').prependTo($('#main-wrapper'));
          $('.step-1 .continue').prependTo($('.step-1 .progress-wrap'));
          $('.step-2 .complete').prependTo($('.step-2 .progress-wrap'));
        },
        exit: function() {
          $('.donation-title').prependTo($('.left-sidebar'));
          $('.step-1 .continue').appendTo($('.step-1 .progress-wrap'));
          $('.step-2 .complete').appendTo($('.step-2 .progress-wrap'));
        },
        both: function() {
          // Changing state;
        }
      });
    }
  }

  // Mark conditional webform fields
  Drupal.behaviors.webformConditional = {
    attach: function (context, settings) {
      $.each(Drupal.settings, function(key, info) {
        if(key.substring(0, 20) == 'webform_conditional_') {
          $.each(info.fields, function(triggerField_key, triggerField_info) {
            // Add css class to conditional webform fields
            $.each(triggerField_info['dependent_fields'],function(dependent_field_key,dependent_field_info){
              var formItemWrapper = Drupal.webform_conditional.getWrapper(dependent_field_info);
              if(formItemWrapper.length > 0){
                formItemWrapper.addClass("conditional");
              }
            });
          });
        }
      });
    }
  }

  // Confirmation page behavior
  Drupal.behaviors.donationConfirmation = {
    attach: function (context, settings) {
      if ($('.donation-form .webform-confirmation', context).length > 0) {
        $('#donation-form-wrapper').addClass('confirmation-page');
      }
    }
  }

  // Conditional elements
  Drupal.behaviors.conditionalElements = {
    attach: function (context, settings) {
      // Only show after-content text if it's present
      if (!$('body').hasClass('page-node-done') && $('.after-content-wrapper').children().length > 0) {
        $('.after-content-wrapper').show();
      }
      // Display feature image field on mobile, if video present
      if ($('.donation-image .file-video-vimeo').length > 0) {
        $('.donation-image').addClass('vimeo');
      }
      // Optionally display share links
      if ($('.springboard-social-links').attr('data-share') == 'true') {
        $('.springboard-social-links').show();
      }
    }
  };

  // One-click behaviors.
  Drupal.behaviors.oneClickDonate = {
    attach: function (context, settings) {
      // Move saved-card fields.
      $('#edit-submitted-payment-information-payment-fields-credit').append($('.form-item-submitted-payment-information-payment-fields-credit-ocd'));

      // If form has been pre-populated, show edit fieldsets and
      // hide progress buttons.
      $(document).ready(function(){
        if ($('fieldset.readonly-information').length) {
          // Add form class for ocd-readonly.
          $('.webform-client-form').addClass('ocd-readonly');

          // Hide OCD fieldsets.
          $('#main-wrapper .webform-client-form.ocd-readonly').hide();
          // $('fieldset.webform-component-fieldset').last().find('.progress-buttons').show().appendTo('.webform-client-form');
        }
      });
    }
  }

})(jQuery);
;
(function($) {
  // Display check numbers guide in check payment section.
  Drupal.behaviors.checkGuide = {
    attach: function (context, settings) {
      var checkFieldset = $('#edit-submitted-payment-information-payment-fields-bank-account');
      if (checkFieldset.length) {

        checkFieldset.once('check-guide-processed', function () {
          var checkRoutingField = checkFieldset.find('.account-routing-number');
          var checkAccountField = checkFieldset.find('.account-account-number');

          // Build check guide elements.
          var RoutingText = '<div class="about">Your 9-digit routing number is the first set of numbers on the bottom of your checks.</div>';
          var AccountText = '<div class="about">Your account number is the second set of numbers on the bottom of your checks.</div>';

          var checkAboutRouting = $('<div class="check-guide"><span class="check-guide-icon">?</span>' + RoutingText + '</div>');
          var checkAboutAccount = $('<div class="check-guide"><span class="check-guide-icon">?</span>' + AccountText + '</div>');

          // Add check guide to routing and account number fields.
          checkAboutRouting.appendTo(checkRoutingField);
          checkAboutAccount.appendTo(checkAccountField);
        });
      }
    }
  };
})(jQuery);
;
(function($) {
  Drupal.behaviors.removePatternAttrZip = {
    attach: function (context, settings) {

      // Remove pattern attr. from zipcode.
      var $zip_input = $('#webform-component-billing-information--zip input');
      $zip_input.removeAttr('pattern');
    }
  }
})(jQuery);;
(function($) {
  // Reset progress buttons after paypal close.
  Drupal.behaviors.paypalClose = {
    attach: function (context, settings) {

      $(document).on('braintree.error', function(e, t) {
        if (typeof t.code !== 'undefined' && t.code == 'PAYPAL_POPUP_CLOSED') {
          $('#webform-component-payment-information .progress-buttons .progress-wrap').find('.back').show();
          $('#webform-component-payment-information .progress-buttons .progress-wrap').find('.complete').show();
          $('#webform-component-payment-information .progress-buttons .progress-wrap').find('.processing').remove();
          $('.webform-client-form .fundraiser_submit_message').remove();
        }
      });

    }
  };
})(jQuery);
;
(function($) {
  // Number field input-style attributes.
  Drupal.behaviors.creditCardInput = {
    attach: function (context, settings) {
      // Credit card number and CVV fields.
      var $numberFields = $(
        'input[name="submitted[payment_information][payment_fields][credit][card_number]"],' +
        'input[name="submitted[payment_information][payment_fields][credit][card_cvv]"]');
      $numberFields.once('cc-attr').attr('inputmode', 'numeric').attr('pattern','[0-9]*');
    }
  }

})(jQuery);
;
(function($) {
  // Move other buttons; separate behavior allows for gift-string ask amount rebuild.
  Drupal.behaviors.otherFields = {
    attach: function (context, settings) {
      $(window).load(function() {
        // Move Other fields into donation amount components.
        $('#webform-component-donation--other-amount').appendTo('#edit-submitted-donation-amount');
        $('#webform-component-donation--recurring-other-amount').appendTo('#edit-submitted-donation-recurring-amount');
      });
    }
  };

})(jQuery);
;
(function($) {
    // Consolidate transaction errors.
    Drupal.behaviors.transactionError = {
        attach: function (context, settings) {
            var errorList = $('.alert.error ul');
            // Check list for transaction errors.
            errorList.find('li').each(function(index, item) {
                if ($(item).text().indexOf('error processing your card') !== -1) {
                    // Consolidate failed-transaction errors.
                    errorList.html('<li>Donation transaction failed.</li>');
                    $('.alert.status').remove();
                    return false;
                }
            });
        }
    };
})(jQuery);
;
(function($){
    $(window).load(function(){
        // returns an object with the query strings as key:value
        function getQueryParams(qs) {
            qs = qs.split("+").join(' ');
            var params = {};
            var tokens;
            var regex = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = regex.exec(qs)) {
                var tokenKey = tokens[1];
                var tokenValue = tokens[2];
                if (tokenValue.indexOf('=') > -1) {
                    tokenValue = tokenValue.substr(tokenValue.indexOf("=") + 1);
                }
                params[decodeURIComponent(tokenKey)] = decodeURIComponent(tokenValue);
            }
            return params;
        }
        // get query strings
        var queryStrings = getQueryParams(document.location.search);
        // get amount
        var amount = queryStrings.amount;
        var recurring = queryStrings.recurring;
        var gs = queryStrings.gs;
        if (typeof recurring != 'undefined' && recurring == 1) {
            if ($('#webform-component-donation #edit-submitted-donation-recurs-monthly input[value="recurs"]').length > 0) {
                $('#webform-component-donation #edit-submitted-donation-recurs-monthly input[value="recurs"]').trigger('click');
            }
        }
        if (typeof amount != 'undefined' && !gs) {
            if (typeof recurring != 'undefined' && recurring == 1 && $('#webform-component-donation #edit-submitted-donation-recurring-amount .form-item').length ) {
                if ($('#webform-component-donation #edit-submitted-donation-recurring-amount input[value="'+amount+'"]').length > 0) {
                    // an actual value
                    $('#webform-component-donation #edit-submitted-donation-recurring-amount input[value="'+amount+'"]').prop('checked',true).trigger('change').parent().addClass('selected');
                } else {
                    // select other
                    $('#webform-component-donation #edit-submitted-donation-recurring-amount input[value*="other"]').prop('checked',true).trigger('change').parent().addClass('selected');
                    // set amount
                    $('#webform-component-donation input#edit-submitted-donation-recurring-other-amount').focus().val(amount).blur();
                }
            } else {
                if ($('#webform-component-donation #edit-submitted-donation-amount input[value="'+amount+'"]').length > 0) {
                    // an actual value
                    $('#webform-component-donation #edit-submitted-donation-amount input[value="'+amount+'"]').prop('checked',true).trigger('change').parent().addClass('selected');
                } else {
                    // select other
                    $('#webform-component-donation #edit-submitted-donation-amount input[value*="other"]').prop('checked',true).trigger('change').parent().addClass('selected');
                    // set amount
                    $('#webform-component-donation input#edit-submitted-donation-other-amount').focus().val(amount).trigger('change').blur();
                }
            }
        }
    });
})(jQuery);
;
(function($) {

    // Set class for zip-first / autofill feature enabled.
    Drupal.behaviors.zipAutofill = {
        attach: function (context, settings) {

          var $form = $('.webform-client-form');
          // Add class if zip-autofill is enabled.
          $form.once('zip-autofill', function(){
            if (typeof(Drupal.settings.zip_to_city) !== 'undefined') {
              $form.addClass('zip-autofill');
            }
          });

        }
    };
})(jQuery);
;
(function($) {
  Drupal.behaviors.mediaEmbed = {

    attach: function (context, settings) {

      // Support for responsive media
      function mediaWrap($element, source){
        var embedSources = ['youtube', 'vimeo', 'facebook', 'countingdownto'];

        // Wrap selected media embeds for responsive sizing.
        $.each(embedSources, function(index, sourceDomain){
          if (source.indexOf(sourceDomain) > -1) {
            $element.wrap('<div class="media-wrapper"></div>');
            return false;
          } // if().
        }); // each().
      } // mediaWrap()

      $('iframe,embed',context).each(function() {
        // Check source for embedded media.
        var mediaSource = $(this).attr('src');
        if (mediaSource) {
          mediaWrap($(this), mediaSource);
        }
      }); // each().

      $('object',context).each(function(){
        var mediaSource = $(this).attr('data');
        if (mediaSource) {
          mediaWrap($(this), mediaSource);
        }
      }); // each().

    } // attach().
  };

})(jQuery);
;
(function($) {
    // Configuration for smarty streets
    Drupal.behaviors.smartyConfig = {
        attach: function (context, settings) {
            <!-- Smarty Streets for address validation -->
            $.getScript("//d79i1fxsrar4t.cloudfront.net/jquery.liveaddress/5.2/jquery.liveaddress.min.js", function() {
                var liveaddress = jQuery.LiveAddress({
                    key: '9308230580129618',	// An HTML key from your account
                    waitForStreet: true,
                    autocomplete: 10,
                    candidates: 3,
                    certifyMessage: 'Use the address I entered.',
                    ambiguousMessage: 'We found this address, is this correct?',
                    invalidMessage: 'Sorry, but the address you entered might not be valid based on postal verification.',
                    geolocate: true,
                    geolocatePrecision: 'city',
                    smartyTag: false,
                    submitVerify: true,
                    autoVerify: true,
                    enforceVerification: false,
                    target: "US",
                    addresses: [{
                        address1: '#edit-submitted-billing-information-address',
                        locality: '#edit-submitted-billing-information-city',
                        administrative_area: '#edit-submitted-billing-information-state',
                        postal_code: '#edit-submitted-billing-information-zip',
                        country: '#edit-submitted-billing-information-country'
                    }]
                });
            });
        }
    };// Move zip code if autofill is not set
    Drupal.behaviors.zipAdjust = {
        attach: function (context, settings) {

            var $form = $('.webform-client-form');
            // Move zip code if zip-autofill is not enabled.
            $form.once('zip-adjust', function(){
                if (typeof(Drupal.settings.zip_to_city) == 'undefined') {
                    $('#webform-component-billing-information--zip').insertBefore('#webform-component-billing-information--country');
                }
            });

        }
    };
    // Correct Positioning of modal
    Drupal.behaviors.smartyReposition = {
        attach: function (context, settings) {
            $('.continue, .back, .amazonpay-button-inner-image').click(function(){
                var leftPos  = $("#edit-submitted-billing-information-address")[0].getBoundingClientRect().left   + $(window)['scrollLeft']();
                var bottomPos= $("#edit-submitted-billing-information-address")[0].getBoundingClientRect().bottom + $(window)['scrollTop']();

                $('.smarty-autocomplete').parents('.smarty-ui').css('left', leftPos);
                $('.smarty-autocomplete').parents('.smarty-ui').css('top', bottomPos);
            });
        }
    };
})(jQuery);;
