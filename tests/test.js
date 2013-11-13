(function() {
  var expect;

  expect = chai.expect;

  describe('FormLogic', function() {
    var errorClass;
    errorClass = 'has-error';
    describe('Errors', function() {
      it('hides error targets on page load', function() {
        return expect($('#error-result').is(':hidden')).to.be["true"];
      });
      it('creates a default div after the input element when no options are specified', function() {
        var $error, $input, message;
        $input = $('#no-target');
        message = $('#no-target').data('message');
        $input.blur();
        $error = $input.next();
        return expect($error.text() === message).to.be["true"];
      });
      it('opts for the data-error if specified', function() {
        $('#error-target').blur();
        return expect($('#error-result').is(':hidden')).to.be["false"];
      });
      it('opts for the data-error-`validator` if specified', function() {
        var $input;
        $input = $('#error-target-special');
        $input.val(200);
        $input.blur();
        return expect($('#error-result-minimum').is(':hidden')).to.be["false"];
      });
      it('shows specialized error messages data-message-`validator` if provided', function() {
        var $error, $input, message;
        $input = $('#special-message');
        message = $('#special-message').data('message-number');
        $input.val(200);
        $input.blur();
        $error = $input.next();
        return expect($error.text() === message).to.be["true"];
      });
      return it('shows general message (data-message) if specialized messages are not provided', function() {
        var $error, $input, message;
        $input = $('#no-special-message');
        message = $('#no-special-message').data('message');
        $input.val(200);
        $input.blur();
        $error = $input.next();
        return expect($error.text() === message).to.be["true"];
      });
    });
    describe('Validators', function() {
      it('validates a required value', function() {
        var $input;
        $input = $('#required');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a required value for checkboxes', function() {
        var $input;
        $input = $('[name="check"]').first();
        $('#form-one').submit();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a required value for select elements', function() {
        var $input;
        $input = $('#select');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it("validates empty values as true unless the validation is 'required'", function() {
        var $input;
        $input = $('#email');
        $input.val('');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["false"];
      });
      it('validates email format', function() {
        var $input;
        $input = $('#email');
        $input.val('test@test');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a minimum number', function() {
        var $input;
        $input = $('#minimum');
        $input.val(200);
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a maximum number', function() {
        var $input;
        $input = $('#maximum');
        $input.val(400);
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a confirmation value', function() {
        var $input, $target;
        $target = $('#confirm-target');
        $input = $('#confirm');
        $target.val('test1');
        $input.val('test2');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a phone number', function() {
        var $input;
        $input = $('#phone');
        $input.val('1 353 43');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a minimum length', function() {
        var $input;
        $input = $('#min-length');
        $input.val('38');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a maximum length', function() {
        var $input;
        $input = $('#max-length');
        $input.val('34343');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates the minimum and maximum length', function() {
        var $input;
        $input = $('#min-max-length');
        $input.val('34343');
        $input.blur();
        expect($input.hasClass(errorClass)).to.be["true"];
        $input.val('33');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates that the value is a number', function() {
        var $input;
        $input = $('#number');
        $input.val('33de4');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('does not validate hidden input elements', function() {
        var $input;
        $input = $('#hidden1');
        $input.val('');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["false"];
      });
      it('validates hidden elements if given the data-force-validation option', function() {
        var $input;
        $input = $('#hidden2');
        $input.val('');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates credit card number', function() {
        var $input;
        $input = $('#card-number');
        $input.val('4242-4242-4242-424');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates cvc code', function() {
        var $input;
        $input = $('#card-cvc');
        $input.val('00939');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      return it('validates expiration date');
    });
    describe('Dynamic Fields', function() {
      it('hides dependent fields on page load', function() {
        return expect($('[data-prompt]').is(':hidden')).to.be["true"];
      });
      it('shows fields dependent on text input', function() {
        var $input;
        $input = $('[name="stimulus-text"]');
        $input.val('cherry');
        $input.change();
        return expect($('[data-prompt="stimulus-text"]').is(':hidden')).to.be["false"];
      });
      it('hides fields dependent on text input', function() {
        var $input;
        $input = $('[name="stimulus-text"]');
        $input.val('rosie');
        $input.change();
        return expect($('[data-prompt="stimulus-text"]').is(':hidden')).to.be["true"];
      });
      it('shows fields dependent on checkbox values', function() {
        var $input;
        $input = $('[name="stimulus-check"][value="check2"]');
        $input.prop('checked', true);
        $input.change();
        return expect($('[data-prompt="stimulus-check"]').is(':hidden')).to.be["false"];
      });
      it('hides fields dependent on checkbox values');
      it('shows fields dependent on radio values');
      it('hides fields dependent on radio values');
      it('shows fields dependent on select values');
      it('hides fields dependent on select values');
      it('shows fields dependent on select multiple values');
      it('hides fields dependent on select multiple values');
      it('takes the id selector for a prompt');
      it('shows fields dependent on any non-empty value');
      it('hides fields dependent on any non-empty value');
      it('shows fields dependent on values that are dependent on other fields');
      it('hides fields dependent on values that are dependent on other fields');
      it('shows fields dependent on multiple values (specified with semicolon-separated values)');
      return it('hides fields dependent on multiple values (specified with semicolon-separated values)');
    });
    describe('API', function() {
      it('exists in the global scope', function() {
        var fl;
        fl = new FormLogic;
        return expect(fl).to.exist;
      });
      it('allows for creating custom validators', function() {
        var $input;
        FormLogic.validate('custom', function($input, $form) {
          var val;
          val = $input.val();
          return 'rosie' === $.trim(val);
        });
        $input = $('#validate-custom');
        $input.val('cherry');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('allows custom validators to override existing/default validators', function() {
        var $input;
        FormLogic.validate('number', function($input, $form) {
          var val;
          val = $input.val();
          return val > 700;
        });
        $input = $('#validate-custom-override');
        $input.val(600);
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      return it('calls onValidSubmit callback', function(done) {
        var $form;
        $form = $('#form-two');
        FormLogic.onValidSubmit($form, function(event) {
          done();
          return false;
        });
        return $form.submit();
      });
    });
    return describe('Chosen JS', function() {
      it('validates required for select elements', function() {
        var $input;
        $input = $('#chosen-required');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      return it('validates required for select multiple elements', function() {
        var $input;
        $input = $('#chosen-required-multiple');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
    });
  });

}).call(this);
