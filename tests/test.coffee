expect = chai.expect  

describe 'FormLogic', ->

  $form = $('#signupForm')
  errorClass = 'has-error'

  describe 'constructor', ->
    it 'exists in the global scope', ->
      fl = new FormLogic
      expect(fl).to.exist

  describe 'validators', ->
    it 'validates a required value', ->
      $form.submit()
      $input = $('#email')
      setTimeout ->
        expect($input.hasClass(errorClass)).to.be.true
      , 50
    it 'validates email format'
    it 'validates a phone number'
    it 'validates a minimum number'
    it 'validates a maximum number'
    it 'validates a minimum length'
    it 'validates a maximum length'
    it 'validates that the value is a number'
    it 'validates a confirmation value'
    it 'does not validate hidden input elements'
    it 'validates hidden elements if given the data-force-validation option'

  describe 'errors', ->
    it 'creates a default div after the input element when no options are specified'
    it 'opts for the data-error-target if specified'

  describe 'API', ->
    it 'allows for creating custom validators' 
    it 'allows custom validators to override existing/default validators'
    it 'calls onValidSubmit callback'


  # describe 'validators', ->
