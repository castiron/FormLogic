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
        $input = $('#email');
        $form.submit();
        return expect($input.hasClass(errorClass)).to.be["true"];
      });
      it('validates email format');
      it('validates a phone number');
      it('validates a minimum number');
      it('validates a maximum number');
      it('validates a minimum length');
      it('validates a maximum length');
      it('validates that the value is a number');
      it('validates a confirmation value');
      it('does not validate hidden input elements');
      return it('validates hidden elements if given the data-force-validation option');
    });
    describe('errors', function() {
      it('creates a default div after the input element when no options are specified');
      return it('opts for the data-error-target if specified');
    });
    return describe('API', function() {
      it('allows for creating custom validators');
      it('allows custom validators to override existing/default validators');
      return it('calls onValidSubmit callback');
    });
  });

}).call(this);
