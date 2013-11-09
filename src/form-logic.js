(function() {
  var fl;

  this.FormLogic = (function() {
    function FormLogic() {
      if (FormLogic._instance) {
        return FormLogic._instance;
      }
      FormLogic._validators = {};
      this.buildDefaultValidators();
      this.setupHandlers();
      this.hideErrorTargets();
      this.fieldErrorClass = 'has-error';
      this.errorClass = 'error';
      FormLogic._instance = this;
    }

    FormLogic.validate = function(name, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument you passed to FormLogic.validator() was not a function';
      }
      return FormLogic._validators[name] = func;
    };

    FormLogic.prototype.hideErrorTargets = function() {
      var $form, $input, $next, form, input, name, target, vNames, vString, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      if (FormLogic._instance) {
        return;
      }
      _ref = $('form');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        form = _ref[_i];
        $form = $(form);
        _ref1 = $form.find('[data-validate]');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $input = $(input);
          vString = $input.data('validate');
          if (typeof vString !== 'string') {
            continue;
          }
          vNames = vString.split(' ');
          for (_k = 0, _len2 = vNames.length; _k < _len2; _k++) {
            name = vNames[_k];
            target = $input.data('error-' + name);
            if (!target) {
              target = $input.data('error');
            }
            $next = $input.next('.' + this.errorClass);
            if (target) {
              $(target).hide();
            } else if ($next) {
              $next.hide();
            }
          }
        }
      }
      return true;
    };

    FormLogic.prototype.setupHandlers = function() {
      var $form, $input, form, input, my, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      my = this;
      _ref = $('form');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        form = _ref[_i];
        $form = $(form);
        _ref1 = $form.find('[data-validate]');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $input = $(input);
          if ($(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio') {
            return;
          }
          $input.blur(function() {
            return my.runValidators($(this));
          });
          $input.focus(function() {
            return my.clearErrors($(_this));
          });
        }
        $form.submit(function() {
          var hasError, _k, _len2, _ref2;
          hasError = false;
          $form = $(this);
          _ref2 = $form.find('[data-validate]');
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            input = _ref2[_k];
            if (!my.runValidators($(input), $form)) {
              hasError = true;
            }
          }
          return !hasError;
        });
      }
    };

    FormLogic.prototype.runValidators = function($input, $form) {
      var hasError, name, vNames, vString, _i, _len;
      hasError = false;
      if (($input.is(':hidden') || $input.is(':submit')) && !$input.data('force-validation')) {
        return false;
      }
      vString = $input.data('validate');
      if (typeof vString !== 'string') {
        return false;
      }
      vNames = vString.split(' ');
      for (_i = 0, _len = vNames.length; _i < _len; _i++) {
        name = vNames[_i];
        if (!FormLogic._validators[name]) {
          continue;
        }
        if (!(name === 'required' || $input.val() !== '')) {
          continue;
        }
        if (!FormLogic._validators[name]($input, $form)) {
          this.showError($input, name);
          hasError = true;
        }
      }
      return !hasError;
    };

    FormLogic.prototype.clearErrors = function($input, name) {
      var $next, target;
      if (($input.is(':hidden') || $input.is(':submit')) && !$input.data('force-validation')) {
        return;
      }
      $input.removeClass(this.fieldErrorClass);
      target = $input.data('error-' + name);
      if (!target) {
        target = $input.data('error');
      }
      $next = $input.next('.' + this.errorClass);
      if (target) {
        return $(target).hide();
      } else if ($next) {
        return $next.hide();
      }
    };

    FormLogic.prototype.showError = function($input, name) {
      var message, target;
      this.clearErrors($input, name);
      $input.addClass(this.fieldErrorClass);
      message = $input.data('message-' + name);
      if (!message) {
        message = $input.data('message');
      }
      target = $input.data('error-' + name);
      if (!target) {
        target = $input.data('error');
      }
      if (target) {
        return $(target).show();
      } else if (message) {
        return $input.after('<div class="' + this.errorClass + '">' + message + '</div>');
      }
    };

    FormLogic.prototype.buildDefaultValidators = function() {
      FormLogic.validate('required', function($input, $form) {
        var name, option, _i, _len, _ref;
        if ($input.attr('type') === 'radio' || $input.attr('type') === 'checkbox') {
          name = $input.attr('name');
          _ref = $('[name="' + name + '"]');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            if ($(option).is(':checked')) {
              return true;
            }
          }
          return false;
        } else {
          return $input.val() !== '';
        }
      });
      FormLogic.validate('email', function($input, $form) {
        var re;
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test($input.val());
      });
      FormLogic.validate('minimum', function($input, $form) {
        var min, val;
        min = parseFloat($input.data('min'));
        val = parseFloat($input.val());
        return val >= min;
      });
      FormLogic.validate('maximum', function($input, $form) {
        var max, val;
        max = parseFloat($input.data('max'));
        val = parseFloat($input.val());
        return val <= max;
      });
      FormLogic.validate('number', function($input, $form) {
        var val;
        val = $input.val();
        return !isNaN(parseFloat(val)) && isFinite(val);
      });
      FormLogic.validate('confirm', function($input, $form) {
        var target;
        target = $input.data('confirm-target');
        return $input.val() === $(target).val();
      });
      FormLogic.validate('phone', function($input, $form) {
        var val;
        val = $input.val().replace(/[^\d.]/g, '');
        return val.length > 6 && val.length < 16;
      });
      FormLogic.validate('min-length', function($input, $form) {
        return $input.val().length >= $input.data('min');
      });
      return FormLogic.validate('max-length', function($input, $form) {
        return $input.val().length <= $input.data('max');
      });
    };

    return FormLogic;

  })();

  fl = new FormLogic;

}).call(this);
