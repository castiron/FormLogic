(function() {
  var expect;

  expect = chai.expect;

  describe('FormLogic', function() {
    var errorClass;
    errorClass = 'has-error';
    describe('errors', function() {
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
    describe('validators', function() {
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
      return it('validates hidden elements if given the data-force-validation option', function() {
        var $input;
        $input = $('#hidden2');
        $input.val('');
        $input.blur();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
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
    describe('Chosen JS', function() {
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
    return describe('Stripe', function() {
      it('validates credit card number');
      it('validates cvc code');
      return it('validates expiration date');
    });
  });

}).call(this);
