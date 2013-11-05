expect = chai.expect  

describe 'FormLogic', ->

  $form = $('#signupForm')
  errorClass = 'has-error'


  describe 'errors', ->

    it 'hides error targets on page load', ->
      expect($('#error-result').is(':hidden')).to.be.true

    it 'creates a default div after the input element when no options are specified', ->
      $input = $('#no-target')
      message = $('#no-target').data('message')
      $input.blur()
      $error = $input.next()
      expect($error.text() == message).to.be.true

    it 'opts for the data-error if specified', ->
      $('#error-target').blur()
      expect($('#error-result').is(':hidden')).to.be.false

    it 'opts for the data-error-`validator` if specified', ->
      $input = $('#error-target-special')
      $input.val 200
      $input.blur()
      expect($('#error-result-minimum').is(':hidden')).to.be.false

    it 'shows specialized error messages data-message-`validator` if provided'
    it 'shows general message (data-message) if specialized messages are not provided'


  describe 'validators', ->
    it 'validates a required value', ->
      $input = $('#required')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a required value for checkboxes', ->
      $input = $('[name="check"]').first()
      $form.submit()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a required value for select elements', ->
      $input = $('#select').first()
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it "validates empty values as true unless the validation is 'required'", ->
      $input = $('#email')
      $input.val('')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.false

    it 'validates email format', ->
      $input = $('#email')
      $input.val('test@test')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a minimum number', ->
      $input = $('#minimum')
      $input.val(200)
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a maximum number', ->
      $input = $('#maximum')
      $input.val(400)
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a confirmation value', ->
      $target = $('#confirm-target')
      $input = $('#confirm')
      $target.val('test1')
      $input.val('test2')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a phone number', ->
      $input = $('#phone')
      $input.val('1 353 43')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a minimum length', ->
      $input = $('#min-length')
      $input.val('38')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a maximum length', ->
      $input = $('#max-length')
      $input.val('34343')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates the minimum and maximum length', ->
      $input = $('#min-max-length')
      $input.val('34343')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true
      $input.val('33')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates that the value is a number', ->
      $input = $('#number')
      $input.val('33de4')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true
    
    it 'does not validate hidden input elements', ->
      $input = $('#hidden1')
      $input.val('')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.false

    it 'validates hidden elements if given the data-force-validation option', ->
      $input = $('#hidden2')
      $input.val('')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true


  describe 'API', ->
    it 'allows for creating custom validators' 
    it 'allows custom validators to override existing/default validators'
    it 'calls onValidSubmit callback'
    it 'exists in the global scope', ->
      fl = new FormLogic
      expect(fl).to.exist


  describe 'Chosen JS', ->
    it 'validates required for select elements'


  describe 'Stripe', ->
    it 'validates credit card number'
    it 'validates cvc code'
    it 'validates expiration date'


  # describe 'validators', ->
