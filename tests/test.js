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
      it('validates a required value for checkboxes');
      it('validates a required value for select elements');
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
      it("validates true unless the validation is 'required'");
      it('validates a phone number');
      it('validates a minimum length');
      it('validates a maximum length');
      it('validates that the value is a number');
      it('does not validate hidden input elements');
      return it('validates hidden elements if given the data-force-validation option');
    });
    describe('errors', function() {
      it('creates a default div after the input element when no options are specified');
      return it('opts for the data-error-target if specified');
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
