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
      $input = $('#required')
      $form.submit()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates email format', ->
      $input = $('#email')
      $input.val('test@test')
      $form.submit()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a minimum number', ->
      $input = $('#minimum')
      $input.val(200)
      $form.submit()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a maximum number', ->
      $input = $('#maximum')
      $input.val(400)
      $form.submit()
      expect($input.hasClass(errorClass)).to.be.true


    it 'validates a phone number'

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
