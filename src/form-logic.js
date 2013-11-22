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

    FormLogic.onValidSubmit = function(form, func) {
      if (!func || typeof func !== 'function') {
        throw 'The second argument passed to FormLogic.onValidSubmit() must be a function.';
      }
      return $(form).data('fl-submit-callback', func);
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
          var cursorPosition, index, isLetter, isLetterOrNumber, isNumber, lastMaskChars, maskChar, newVal, next, nextChar, nextVal, numMaskCharsToRemove, pos, range, val, _i, _j, _ref, _ref1;
          val = $(this).val().replace(/( )+$/, '');
          console.log("val: '" + val + "'");
          nextVal = (function() {
            var valPos;
            valPos = 0;
            return function() {
              return val.charAt(valPos++);
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
            console.log('loop: ' + pos);
            maskChar = mask.charAt(pos);
            console.log("- maskChar: '" + maskChar + "'");
            switch (maskChar) {
              case '0':
                next = nextChar(isNumber);
                break;
              case 'A':
                next = nextChar(isLetter).toUpperCase();
                break;
              case 'a':
                next = nextChar(isLetter).toLowerCase();
                break;
              case 'Z':
                next = nextChar(isLetter);
                break;
              case '?':
                next = nextChar(isLetterOrNumber);
                break;
              case 'X':
                next = nextChar(isLetterOrNumber).toUpperCase();
                break;
              case 'x':
                next = nextChar(isLetterOrNumber).toLowerCase();
                break;
              case '\\':
                next = mask.charAt(++pos);
                break;
              default:
                next = maskChar;
                lastMaskChars += maskChar;
            }
            console.log('lastMaskChars: ' + lastMaskChars);
            if (next === false) {
              break;
            }
            ++cursorPosition;
            newVal += next;
            console.log("- next: '" + next + "'");
          }
          numMaskCharsToRemove = 0;
          for (index = _j = -1, _ref1 = newVal.length * -1; -1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; index = -1 <= _ref1 ? ++_j : --_j) {
            console.log('newval(index, 1): ' + newVal.substr(index, 1));
            console.log('lastMaskChars(index, 1): ' + lastMaskChars.substr(index, 1));
            if (newVal.substr(index, 1) === lastMaskChars.substr(index, 1)) {
              ++numMaskCharsToRemove;
            } else {
              break;
            }
          }
          if (numMaskCharsToRemove !== 0) {
            newVal = newVal.slice(0, numMaskCharsToRemove * -1);
          }
          $(this).val(newVal);
          console.log("newVal: '" + newVal.replace(/( )+$/, '') + "'");
          console.log('cursorPosition: ' + cursorPosition);
          console.log(' ');
          if (this.setSelectionRange) {
            return this.setSelectionRange(cursorPosition, cursorPosition);
          } else if (this.createTextRange) {
            range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', cursorPosition);
            range.moveStart('character', cursorPosition);
            return range.select();
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
          $child = $('[data-prompt="' + $(input).attr('name') + '"');
          if ($child) {
            $(input).change();
          }
        }
        _ref1 = $el.find('[id]').addBack('[id]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $child = $('[data-prompt="#' + $(input).attr('id') + '"');
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
          $child = $('[data-prompt="' + $(input).attr('name') + '"');
          if ($child) {
            hideChildren($child);
          }
        }
        _ref1 = $el.find('[id]').addBack('[id]');
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          input = _ref1[_j];
          $child = $('[data-prompt="#' + $(input).attr('id') + '"');
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
          var $el, $form, $parent, goalString, goals, handle, parentName, parentType;
          $el = $(el);
          $form = $el.parent('form');
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
          return $parent.change(function() {
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
          });
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
      var $form, $input, form, input, my, _i, _j, _len, _len1, _ref, _ref1;
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
            return my.clearErrors($(this));
          });
        }
        $form.submit(function(event) {
          var callback, hasError, _k, _len2, _ref2;
          hasError = false;
          _ref2 = $(this).find('[data-validate]');
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            input = _ref2[_k];
            if (!my.runValidators($(input), $(this))) {
              hasError = true;
            }
          }
          if (!hasError) {
            callback = $form.data('fl-submit-callback');
            if (callback && typeof callback === 'function') {
              return callback.call($form, event);
            }
          }
          return !hasError;
        });
      }
    };

    FormLogic.prototype.runValidators = function($input, $form) {
      var hasError, name, vNames, vString, _i, _len;
      hasError = false;
      if ((($input.is(':hidden') && !$input.next('.chosen-container').length) || $input.is(':submit')) && !$input.data('force-validation')) {
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
      if (target) {
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
        var max, min, val;
        val = parseFloat($input.val());
        min = parseFloat($input.data('max'));
        max = parseFloat($input.data('min'));
        if (!(!isNaN(val) && isFinite(val))) {
          return false;
        }
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
