(function() {
  var fl;

  this.FormLogic = (function() {
    function FormLogic() {
      if (FormLogic._instance) {
        return FormLogic._instance;
      }
      FormLogic._validators = {};
      this.buildDefaultValidators();
      this.setupValidationHandlers();
      this.setupPrompts();
      this.setupMasks();
      this.hideErrorTargets();
      this.fieldErrorClass = 'has-error';
      this.errorClass = 'error';
      FormLogic._instance = this;
    }

    FormLogic.validate = function(name, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument passed to FormLogic.validator() must be a function.';
      }
      return FormLogic._validators[name] = func;
    };

    FormLogic.onBeforeValidation = function(form, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument passed to FormLogic.onBeforeValidation() must be a function.';
      }
      return $(form).data('fl-before-validation-callback', func);
    };

    FormLogic.onValidSubmit = function(form, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument passed to FormLogic.onValidSubmit() must be a function.';
      }
      return $(form).data('fl-valid-submit-callback', func);
    };

    FormLogic.onInvalidSubmit = function(form, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument passed to FormLogic.onInvalidSubmit() must be a function.';
      }
      return $(form).data('fl-invalid-submit-callback', func);
    };

    FormLogic.prototype.setupMasks = function() {
      return $('[data-mask]').each(function(i, el) {
        var $el, mask, type;
        $el = $(el);
        mask = $el.data('mask');
        if ($.trim(mask) === '') {
          return;
        }
        type = $el.prop('type');
        if (!(type === 'text' || type === 'textfield' || type === 'input')) {
          return;
        }
        return $el.on('input', function(event) {
          var cursorPosition, index, inputVal, isLetter, isLetterOrNumber, isNumber, lastMaskChars, maskChar, newVal, next, nextChar, nextVal, numMaskCharsToRemove, pos, _i, _j, _ref, _ref1;
          inputVal = $(this).val().replace(/( )+$/, '');
          nextVal = (function() {
            var valPos;
            valPos = 0;
            return function() {
              return inputVal.charAt(valPos++);
            };
          })();
          nextChar = function(compareFunc) {
            var valChar;
            valChar = nextVal();
            if (!valChar) {
              return false;
            }
            if (compareFunc(valChar)) {
              return valChar;
            }
            return nextChar(compareFunc);
          };
          isNumber = function(str) {
            var _ref;
            return (47 < (_ref = str.charCodeAt(0)) && _ref < 58);
          };
          isLetter = function(str) {
            var _ref, _ref1;
            return ((64 < (_ref = str.charCodeAt(0)) && _ref < 91)) || ((96 < (_ref1 = str.charCodeAt(0)) && _ref1 < 123));
          };
          isLetterOrNumber = function(str) {
            return isNumber(str) || isLetter(str);
          };
          newVal = '';
          cursorPosition = 0;
          lastMaskChars = '';
          for (pos = _i = 0, _ref = mask.length; 0 <= _ref ? _i <= _ref : _i >= _ref; pos = 0 <= _ref ? ++_i : --_i) {
            maskChar = mask.charAt(pos);
            switch (maskChar) {
              case '0':
                next = nextChar(isNumber);
                break;
              case 'A':
                next = nextChar(isLetter);
                if (next !== false) {
                  next.toUpperCase();
                }
                break;
              case 'a':
                next = nextChar(isLetter);
                if (next !== false) {
                  next.toLowerCase();
                }
                break;
              case 'Z':
                next = nextChar(isLetter);
                break;
              case '?':
                next = nextChar(isLetterOrNumber);
                break;
              case 'X':
                next = nextChar(isLetterOrNumber);
                if (next !== false) {
                  next.toUpperCase();
                }
                break;
              case 'x':
                next = nextChar(isLetterOrNumber);
                if (next !== false) {
                  next.toLowerCase();
                }
                break;
              case '\\':
                next = mask.charAt(++pos);
                break;
              default:
                next = maskChar;
                lastMaskChars += maskChar;
            }
            if (next === false) {
              break;
            }
            ++cursorPosition;
            newVal += next;
          }
          numMaskCharsToRemove = 0;
          for (index = _j = -1, _ref1 = newVal.length * -1; -1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; index = -1 <= _ref1 ? ++_j : --_j) {
            if (newVal.substr(index, 1) === lastMaskChars.substr(index, 1)) {
              ++numMaskCharsToRemove;
            } else {
              break;
            }
          }
          if (numMaskCharsToRemove !== 0) {
            newVal = newVal.slice(0, numMaskCharsToRemove * -1);
            cursorPosition -= numMaskCharsToRemove;
          }
          if (this.setSelectionRange) {
            if (this.selectionStart !== inputVal.length) {
              cursorPosition = this.selectionStart > inputVal.length ? this.selectionStart + 1 : this.selectionStart;
            }
          }
          $(this).val(newVal);
          if (this.setSelectionRange) {
            return this.setSelectionRange(cursorPosition, cursorPosition);
          }
        });
      });
    };

    FormLogic.prototype.setupPrompts = function() {
      var form, hideChildren, showChildren, _i, _len, _ref, _results;
      showChildren = function($el) {
        var $child, input, _i, _j, _len, _len1, _ref, _ref1, _results;
        $el.show();
        _ref = $el.find('[name]').addBack('[name]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          $child = $('[data-prompt="' + $(input).attr('name') + '"]');
          if ($child) {
            $(input).change();
          }
        }
        _ref1 = $el.find('[id]').addBack('[id]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $child = $('[data-prompt="#' + $(input).attr('id') + '"]');
          if ($child) {
            _results.push($(input).change());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      hideChildren = function($el) {
        var $child, input, _i, _j, _len, _len1, _ref, _ref1, _results;
        $el.hide();
        _ref = $el.find('[name]').addBack('[name]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          $child = $('[data-prompt="' + $(input).attr('name') + '"]');
          if ($child) {
            hideChildren($child);
          }
        }
        _ref1 = $el.find('[id]').addBack('[id]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $child = $('[data-prompt="#' + $(input).attr('id') + '"]');
          if ($child) {
            _results.push(hideChildren($child));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      _ref = $('form');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        form = _ref[_i];
        _results.push($('[data-prompt]').each(function(i, el) {
          var $el, $form, $parent, goalString, goals, handle, handleVisibility, parentName, parentType;
          $el = $(el);
          $form = $el.parents('form:first');
          $el.hide();
          handle = $el.data('prompt');
          $parent = handle.charAt(0) === '#' ? $($form.find(handle)) : $($form.find('[name="' + handle + '"]'));
          goalString = $el.data('show-if');
          goals = [];
          if (goalString) {
            goals = $.map(goalString.split(';'), function(str) {
              return $.trim(str);
            });
          }
          parentType = $parent.prop('type');
          parentName = $parent.attr('name');
          handleVisibility = function() {
            var checkbox, givenValue, goal, option, show, siblings, val, values, _j, _k, _l, _len1, _len2, _len3, _ref1;
            show = false;
            values = [];
            val = $(this).val();
            switch (parentType) {
              case 'radio':
              case 'checkbox':
                siblings = $form.find('[name="' + parentName + '"]:checked');
                for (_j = 0, _len1 = siblings.length; _j < _len1; _j++) {
                  checkbox = siblings[_j];
                  values.push($(checkbox).val());
                }
                break;
              case 'select-one':
              case 'select-multiple':
                _ref1 = $(this).find('option:selected');
                for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                  option = _ref1[_k];
                  givenValue = $(option).attr('value');
                  if (givenValue) {
                    values.push(givenValue);
                  }
                }
                break;
              default:
                values.push(val);
            }
            if (values.length === 0) {
              show = false;
            } else if (goals.length === 0 && values.length > 0) {
              show = true;
            } else {
              for (_l = 0, _len3 = goals.length; _l < _len3; _l++) {
                goal = goals[_l];
                if ($.inArray(goal, values) !== -1) {
                  show = true;
                  break;
                }
              }
            }
            if (show) {
              return showChildren($el);
            } else {
              return hideChildren($el);
            }
          };
          $parent.change(handleVisibility);
          return handleVisibility.call($parent);
        }));
      }
      return _results;
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

    FormLogic.prototype.setupValidationHandlers = function() {
      var my;
      my = this;
      return $('form').each(function(i, form) {
        var $form;
        $form = $(form);
        $form.find('[data-validate]').each(function(x, input) {
          var $input;
          $input = $(input);
          if ($(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio') {
            return;
          }
          $input.blur(function() {
            return my.runValidators($(this), $form);
          });
          return $input.focus(function() {
            var name, vNames, vString, _i, _len, _results;
            vString = $(this).data('validate');
            if (typeof vString !== 'string') {
              return my.clearErrors($(this));
            } else {
              vNames = vString.split(' ');
              _results = [];
              for (_i = 0, _len = vNames.length; _i < _len; _i++) {
                name = vNames[_i];
                _results.push(my.clearErrors($(this), name));
              }
              return _results;
            }
          });
        });
        return $form.submit(function(event) {
          var callback, hasError, input, _i, _len, _ref;
          hasError = false;
          callback = $(this).data('fl-before-validation-callback');
          if (callback && typeof callback === 'function') {
            callback.call($(this), event);
          }
          _ref = $(this).find('[data-validate]');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            input = _ref[_i];
            if (!my.runValidators($(input), $(this))) {
              hasError = true;
            }
          }
          if (hasError) {
            callback = $(this).data('fl-invalid-submit-callback');
            if (callback && typeof callback === 'function') {
              callback.call($(this), event);
            }
          } else {
            callback = $(this).data('fl-valid-submit-callback');
            if (callback && typeof callback === 'function') {
              return callback.call($(this), event);
            }
          }
          return !hasError;
        });
      });
    };

    FormLogic.prototype.runValidators = function($input, $form) {
      var hasError, name, vNames, vString, _i, _len;
      hasError = false;
      if ((($input.is(':hidden') && !$input.next('.chosen-container').length) || $input.is(':submit')) && !$input.data('force-validation')) {
        return true;
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
      if (name) {
        target = $input.data('error-' + name);
      }
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
      if (name) {
        message = $input.data('message-' + name);
      }
      if (!message) {
        message = $input.data('message');
      }
      if (name) {
        target = $input.data('error-' + name);
      }
      if (!target) {
        target = $input.data('error');
      }
      if (target && message) {
        return $(target).text(message).show();
      } else if (target) {
        return $(target).show();
      } else if (message) {
        return $input.after('<div class="' + this.errorClass + '">' + message + '</div>');
      }
    };

    FormLogic.prototype.buildDefaultValidators = function() {
      FormLogic.validate('required', function($input, $form) {
        var name, option, val, _i, _len, _ref;
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
          val = $input.val();
          return val && $input.val() !== '';
        }
      });
      FormLogic.validate('email', function($input, $form) {
        var re;
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test($input.val());
      });
      FormLogic.validate('number', function($input, $form) {
        var isnum, max, min, val;
        isnum = function(v) {
          return !isNaN(v) && isFinite(v) && /^[0-9]*\.?[0-9]+$/.test(v);
        };
        if (!isnum($input.val())) {
          return false;
        }
        val = parseFloat($input.val());
        min = parseFloat($input.data('min'));
        max = parseFloat($input.data('max'));
        if (isnum(max) && isnum(min)) {
          return (min <= val && val <= max);
        }
        if (isnum(max) && !isnum(min)) {
          return val <= max;
        }
        if (!isnum(max) && isnum(min)) {
          return min <= val;
        }
        return true;
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
      FormLogic.validate('length', function($input, $form) {
        var max, min, val;
        min = $input.data('min');
        max = $input.data('max');
        val = $input.val().length;
        if (max !== void 0 && min !== void 0) {
          return (min <= val && val <= max);
        }
        if (max !== void 0 && min === void 0) {
          return val <= max;
        }
        if (max === void 0 && min !== void 0) {
          return min <= val;
        }
        return true;
      });
      FormLogic.validate('card-cvc', function($input, $form) {
        var _ref;
        return (3 <= (_ref = $input.val().replace(/\D/g, '').length) && _ref <= 4);
      });
      return FormLogic.validate('card-number', function($input, $form) {
        var regex;
        regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
        return $input.val().replace(/\D/g, '').match(regex) !== null;
      });
    };

    return FormLogic;

  })();

  fl = new FormLogic;

}).call(this);
