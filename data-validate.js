// Generated by CoffeeScript 1.3.3
(function() {
  var DataValidate;

  DataValidate = (function() {

    function DataValidate(el, options) {
      var input, _i, _len, _ref,
        _this = this;
      this.options = options;
      this.$el = $(el);
      this.$submit = this.$el.find('input[type="submit"]');
      _ref = this.$el.find('input');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        this.addHint($(input));
      }
      this.$submit.click(function() {
        var $input, errorInputs, errorMessages, inputs, vString, validator, validators, _j, _k, _l, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3;
        _ref1 = _this.$el.find('.hasError');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          errorInputs = _ref1[_j];
          $(errorInputs).removeClass('.hasError');
        }
        _ref2 = _this.$el.find('.error');
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          errorMessages = _ref2[_k];
          $(errorMessages).html('');
        }
        inputs = _this.$el.find('input');
        for (_l = 0, _len3 = inputs.length; _l < _len3; _l++) {
          input = inputs[_l];
          $input = $(input);
          if ($input.attr('type') === 'submit') {
            _this.$submit = $input;
            continue;
          }
          if ($input.hasClass('has-hint')) {
            $input.val('');
          }
          vString = $input.data('validate');
          if (typeof vString !== 'string') {
            continue;
          }
          validators = vString.split(' ');
          for (_m = 0, _len4 = validators.length; _m < _len4; _m++) {
            validator = validators[_m];
            switch (validator) {
              case 'required':
                _this.validateRequired($input);
                break;
              case 'email':
                _this.validateEmail($input);
                break;
              case 'minimum':
                _this.validateMinimum($input);
                break;
              case 'maximum':
                _this.validateMaximum($input);
                break;
              case 'number':
                _this.validateNumber($input);
                break;
              case 'confirm':
                _this.validateConfirm($input);
            }
          }
        }
        if (_this.isValid() && (DataValidate.onValidSubmit != null)) {
          return DataValidate.onValidSubmit();
        } else if (!_this.isValid()) {
          _ref3 = _this.$el.find('input');
          for (_n = 0, _len5 = _ref3.length; _n < _len5; _n++) {
            input = _ref3[_n];
            _this.addHint($(input));
          }
          return false;
        }
        return true;
      });
    }

    DataValidate.prototype.validateRequired = function($input) {
      if ($input.val() === '') {
        return this.showError($input, 'required');
      }
    };

    DataValidate.prototype.validateEmail = function($input) {
      var bool, re;
      if ($input.val() === '') {
        return;
      }
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      bool = re.test($input.val());
      if (!bool) {
        return this.showError($input, 'email');
      }
    };

    DataValidate.prototype.validateMinimum = function($input) {
      var min, val;
      if ($input.val() === '') {
        return;
      }
      min = parseInt($input.data('minimum'));
      val = parseInt($input.val());
      if (val < min) {
        return this.showError($input, 'minimum');
      }
    };

    DataValidate.prototype.validateMaximum = function($input) {
      var max, val;
      if ($input.val() === '') {
        return;
      }
      max = parseInt($input.data('maximum'));
      val = parseInt($input.val());
      if (val > max) {
        return this.showError($input, 'maximum');
      }
    };

    DataValidate.prototype.validateNumber = function($input) {
      var val;
      if ($input.val() === '') {
        return;
      }
      val = $input.val();
      if (isNaN(parseFloat(val)) || !isFinite(val)) {
        return this.showError($input, 'number');
      }
    };

    DataValidate.prototype.validateConfirm = function($input) {
      var confirm, confirmTarget, password;
      if ($input.val() === '') {
        return;
      }
      confirmTarget = $input.data('confirm-target');
      password = $input.val();
      confirm = $(confirmTarget).val();
      if (password !== confirm) {
        return this.showError($input, 'confirm');
      }
    };

    DataValidate.prototype.showError = function($input, type) {
      var $error, $next, errorTarget, focusHandler, msg, my;
      this.isValid(false);
      $input.addClass('has-error');
      errorTarget = $input.data('error-target');
      if (typeof errorTarget !== 'undefined') {
        $error = this.$el.find(errorTarget);
      } else {
        $next = $input.next();
        if (typeof $next !== 'undefined' && $next.hasClass('error')) {
          $error = $next;
        }
      }
      if (typeof $error !== 'undefined') {
        msg = $input.data('message-' + type);
        if (typeof msg === 'undefined') {
          msg = $input.data('message');
          $error.html('<div class="error-msg">' + msg + '</div>');
        } else {
          $error.append('<div class="error-msg">' + msg + '</div>');
        }
      }
      my = this;
      focusHandler = function() {
        $(this).removeClass('has-error');
        if (typeof $error !== 'undefined') {
          $error.html('');
        }
        $(this).unbind('focus', focusHandler);
        return my.reset();
      };
      return $input.focus(focusHandler);
    };

    DataValidate.prototype.addHint = function($input) {
      var blurHandler, focusHandler, hint, my;
      if ($input.val() !== '') {
        return;
      }
      hint = $input.data('hint');
      if (typeof hint === 'undefined') {
        return;
      }
      $input.addClass('has-hint');
      $input.val(hint);
      my = this;
      focusHandler = function() {
        $(this).val('');
        $input.removeClass('has-hint');
        return $(this).unbind('focus', focusHandler);
      };
      blurHandler = function() {
        if ($(this).val() === '') {
          $(this).unbind('blur', blurHandler);
          return my.addHint($(this));
        }
      };
      $input.focus(focusHandler);
      return $input.blur(blurHandler);
    };

    DataValidate.prototype.isValid = function(bool) {
      if (typeof this.valid === 'undefined') {
        this.valid = true;
      }
      if ((bool != null) && bool === false) {
        this.valid = false;
      }
      return this.valid;
    };

    DataValidate.prototype.reset = function() {
      return this.valid = true;
    };

    return DataValidate;

  })();

  $(function() {
    return $('form').each(function() {
      if ($(this).find('[data-validate]')) {
        return new DataValidate($(this));
      }
    });
  });

}).call(this);