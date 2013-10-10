(function() {
  var expect;

  expect = chai.expect;

  describe('FormLogic', function() {
    var $form, errorClass;
    $form = $('#signupForm');
    errorClass = 'has-error';
    describe('constructor', function() {
      return it('exists in the global scope', function() {
        var fl;
        fl = new FormLogic;
        return expect(fl).to.exist;
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
        $form.submit();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates a required value for select elements', function() {
        var $input;
        $input = $('#select').first();
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
    describe('errors', function() {
      it('creates a default div after the input element when no options are specified');
      it('opts for the data-error-target if specified');
      it('shows specialized error messages data-message-`validator` if provided');
      return it('shows general message (data-message) if specialized messages are not provided');
    });
    describe('API', function() {
      it('allows for creating custom validators');
      it('allows custom validators to override existing/default validators');
      return it('calls onValidSubmit callback');
    });
    describe('Chosen JS', function() {
      return it('validates required for select elements');
    });
    return describe('Stripe', function() {
      it('validates credit card number');
      it('validates cvc code');
      return it('validates expiration date');
    });
  });

}).call(this);
