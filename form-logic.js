// Generated by CoffeeScript 1.6.2
(function() {
  var Child, DataValidate, FormLogic;

  FormLogic = (function() {
    function FormLogic() {}

    return FormLogic;

  })();

  Child = (function() {
    function Child($el) {
      var x, _i, _len, _ref;

      this.$el = $el;
      this.$el.hide();
      this.parentName = this.$el.data('depends-on');
      this.parents = [];
      _ref = $('[name="' + this.parentName + '"]:not([type="hidden"])');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        if ($(x).is('[type="checkbox"]')) {
          this.parentType = 'checkbox';
        } else if ($(x).is('[type="radio"]')) {
          this.parentType = 'radio';
        }
        this.parents.push($(x));
      }
      if (this.$el.data('show-if') !== '') {
        this.setupShowIf();
      } else if (this.$el.data('show-if-any') !== '') {
        this.setupShowIfAny();
      }
    }

    Child.prototype.setupShowIf = function() {
      var $parent, my, val, _i, _len, _ref, _results;

      val = this.$el.data('show-if');
      if (!val) {
        return;
      }
      val = val.toString().split(';');
      val = $.map(val, function(str) {
        return $.trim(str);
      });
      my = this;
      _ref = this.parents;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        $parent = _ref[_i];
        _results.push($parent.change(function() {
          var $p, _j, _len1, _ref1;

          if (my.parentType === 'checkbox' || my.parentType === 'radio') {
            _ref1 = my.parents;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              $p = _ref1[_j];
              if ($p.is(':checked') && $.inArray($p.val(), val) !== -1) {
                my.show();
                return;
              }
            }
            return my.hide();
          } else {
            if ($.inArray($(this).val(), val) !== -1) {
              return my.show();
            } else {
              return my.hide();
            }
          }
        }).change());
      }
      return _results;
    };

    Child.prototype.setupShowIfAny = function() {
      var $parent, my, _i, _j, _len, _len1, _ref, _ref1, _results, _results1,
        _this = this;

      if (this.parentType === 'radio' || this.parentType === 'checkbox') {
        my = this;
        _ref = this.parents;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          $parent = _ref[_i];
          _results.push($parent.change(function() {
            var any, _j, _len1, _ref1;

            any = false;
            _ref1 = my.parents;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              $parent = _ref1[_j];
              if ($parent.is(':checked')) {
                any = true;
              }
            }
            if (any) {
              return my.show();
            } else {
              return my.hide();
            }
          }));
        }
        return _results;
      } else {
        _ref1 = this.parents;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          $parent = _ref1[_j];
          _results1.push($parent.change(function() {
            if ($parent.val() !== '') {
              return _this.show();
            } else {
              return _this.hide();
            }
          }));
        }
        return _results1;
      }
    };

    Child.prototype.show = function() {
      var child, dependents, name, _i, _len, _ref, _results;

      this.$el.show().data('ignore-validation', false);
      _ref = this.$el.find('*');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        name = $(child).attr('name');
        if (name) {
          dependents = $('[data-depends-on="' + name + '"]');
          if (dependents.length > 0) {
            _results.push($(child).change());
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Child.prototype.hide = function() {
      var child, name, _i, _len, _ref, _results;

      this.$el.data('ignore-validation', true).hide();
      _ref = this.$el.find('*');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        name = $(child).attr('name');
        if (name) {
          _results.push($('[data-depends-on="' + name + '"]').data('ignore-validation', true).hide());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Child;

  })();

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
      $('[data-flash-errors]').hide();
      this.stripeKey = this.$el.data('stripe-key');
      if (this.stripeKey) {
        Stripe.setPublishableKey(this.stripeKey);
      }
      this.$submit.click(function() {
        var $input, errorInputs, errorMessages, inputs, vString, validator, validators, _j, _k, _l, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3;

        _this.reset();
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
        $('[data-flash-errors]').hide();
        inputs = _this.$el.find('input, select, textarea');
        for (_l = 0, _len3 = inputs.length; _l < _len3; _l++) {
          input = inputs[_l];
          $input = $(input);
          if ($input.is(':hidden') || $input.is(':submit')) {
            continue;
          }
          if ($input.hasClass('has-hint')) {
            $input.val('');
          }
          if ($input.data('ignore-validation')) {
            continue;
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
                break;
              case 'stripe-number':
                _this.validateStripeNumber($input);
                break;
              case 'stripe-cvc':
                _this.validateStripeCVC($input);
                break;
              case 'stripe-expiry':
                _this.validateStripeExpiry($input);
            }
          }
        }
        if (_this.isValid() && (FormLogic.onValidSubmit != null)) {
          return FormLogic.onValidSubmit();
        } else if (!_this.isValid()) {
          $('[data-flash-errors]').show();
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
      var name, option, _i, _len, _ref;

      if ($input.attr('type') === 'radio' || $input.attr('type') === 'checkbox') {
        name = $input.attr('name');
        _ref = $('[name="' + name + '"]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          if ($(option).is(':checked')) {
            return;
          }
        }
        return this.showError($input, 'required');
      } else {
        if ($input.val() === '') {
          return this.showError($input, 'required');
        }
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

    DataValidate.prototype.validateStripeNumber = function($input) {
      var val;

      val = $input.val();
      if (val === '' || !this.stripeKey) {
        return;
      }
      if (!Stripe.validateCardNumber(val)) {
        return this.showError($input, 'stripe-number');
      }
    };

    DataValidate.prototype.validateStripeCVC = function($input) {
      var val;

      val = $input.val();
      if (val === '' || !this.stripeKey) {
        return;
      }
      if (!Stripe.validateCVC(val)) {
        return this.showError($input, 'stripe-cvc');
      }
    };

    DataValidate.prototype.validateStripeExpiry = function($input) {
      var $month, $year;

      $month = this.$el.find($input.data('expiry-month-target'));
      $year = this.$el.find($input.data('expiry-year-target'));
      if ($month.length === 0 || $year.length === 0) {
        return;
      }
      if ($month.hasClass('has-hint')) {
        $month.val('');
      }
      if ($year.hasClass('has-hint')) {
        $year.val('');
      }
      if ($month.val() === '' || $year.val() === '') {
        return;
      }
      if (!Stripe.validateExpiry($month.val(), $year.val())) {
        return this.showError($input, 'stripe-expiry');
      }
    };

    DataValidate.prototype.showError = function($input, type) {
      var $error, $next, errorTarget, msg;

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
      if (!$error.length) {
        $error = $input.siblings('.error').first();
      }
      if (typeof $error !== 'undefined') {
        msg = $input.data('message-' + type);
        if (typeof msg === 'undefined') {
          msg = $input.data('message');
          return $error.html('<div class="error-msg">' + msg + '</div>');
        } else {
          return $error.append('<div class="error-msg">' + msg + '</div>');
        }
      }
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
    var child, _i, _len, _ref, _results;

    $('form').each(function() {
      if ($(this).find('[data-validate]').length) {
        return new DataValidate($(this));
      }
    });
    _ref = $('[data-depends-on]');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(new Child($(child)));
    }
    return _results;
  });

}).call(this);
