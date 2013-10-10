(function() {
  var fl;

  this.FormLogic = (function() {
    function FormLogic() {
      this.validators = {};
      this.buildDefaultValidators();
      this.setupHandlers();
      this.errorClass = 'has-error';
    }

    FormLogic.prototype.validate = function(name, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument you passed to FormLogic.validator() was not a function';
      }
      return this.validators[name] = func;
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
            if (!my.runValidators($(input))) {
              hasError = true;
            }
          }
          return !hasError;
        });
      }
    };

    FormLogic.prototype.runValidators = function($input) {
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
        if (!this.validators[name]) {
          continue;
        }
        if (!(name === 'required' || $input.val() !== '')) {
          continue;
        }
        if (!this.validators[name]($input)) {
          this.showError($input, name);
          hasError = true;
        }
      }
      return !hasError;
    };

    FormLogic.prototype.clearErrors = function($input) {
      if (($input.is(':hidden') || $input.is(':submit')) && !$input.data('force-validation')) {
        return;
      }
      return $input.removeClass(this.errorClass);
    };

    FormLogic.prototype.showError = function($input, name) {
      return $input.addClass(this.errorClass);
    };

    FormLogic.prototype.buildDefaultValidators = function() {
      this.validate('required', function($input) {
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
      this.validate('email', function($input) {
        var re;
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test($input.val());
      });
      this.validate('minimum', function($input) {
        var min, val;
        min = parseFloat($input.data('min'));
        val = parseFloat($input.val());
        return val >= min;
      });
      this.validate('maximum', function($input) {
        var max, val;
        max = parseFloat($input.data('max'));
        val = parseFloat($input.val());
        return val <= max;
      });
      this.validate('number', function($input) {
        var val;
        val = $input.val();
        return !isNaN(parseFloat(val)) && isFinite(val);
      });
      this.validate('confirm', function($input) {
        var target;
        target = $input.data('confirm-target');
        return $input.val() === $(target).val();
      });
      this.validate('phone', function($input) {
        var val;
        val = $input.val().replace(/[^\d.]/g, '');
        return val.length > 6 && val.length < 16;
      });
      this.validate('min-length', function($input) {
        return $input.val().length >= $input.data('min');
      });
      return this.validate('max-length', function($input) {
        return $input.val().length <= $input.data('max');
      });
    };

    return FormLogic;

  })();

  fl = new FormLogic;

}).call(this);
