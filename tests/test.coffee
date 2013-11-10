expect = chai.expect  

describe 'FormLogic', ->

  errorClass = 'has-error'


  describe 'errors', ->

    # This one must run first. 
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

    it 'shows specialized error messages data-message-`validator` if provided', ->
      $input = $('#special-message')
      message = $('#special-message').data('message-number')
      $input.val 200
      $input.blur()
      $error = $input.next()
      expect($error.text() == message).to.be.true

    it 'shows general message (data-message) if specialized messages are not provided', ->
      $input = $('#no-special-message')
      message = $('#no-special-message').data('message')
      $input.val 200
      $input.blur()
      $error = $input.next()
      expect($error.text() == message).to.be.true

  describe 'validators', ->
    it 'validates a required value', ->
      $input = $('#required')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a required value for checkboxes', ->
      $input = $('[name="check"]').first()
      $('#form-one').submit()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates a required value for select elements', ->
      $input = $('#select')
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

    it 'validates credit card number', ->
      $input = $('#card-number')
      $input.val('4242-4242-4242-424')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates cvc code', ->
      $input = $('#card-cvc')
      $input.val('00939')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true      

    it 'validates expiration date'


  describe 'API', ->
    it 'exists in the global scope', ->
      fl = new FormLogic
      expect(fl).to.exist

    it 'allows for creating custom validators', ->
      FormLogic.validate 'custom', ($input, $form) ->
        val = $input.val()
        'rosie' == $.trim(val)

      $input = $('#validate-custom')
      $input.val 'cherry'
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true


    it 'allows custom validators to override existing/default validators', ->
      FormLogic.validate 'number', ($input, $form) ->
        val = $input.val()
        val > 700

      $input = $('#validate-custom-override')
      $input.val 600
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'calls onValidSubmit callback', (done) ->
      $form = $('#form-two')
      FormLogic.onValidSubmit $form, (event) ->
        done()
        return false
      $form.submit()


  describe 'Chosen JS', ->
    it 'validates required for select elements', ->
      $input = $('#chosen-required')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true

    it 'validates required for select multiple elements', ->
      $input = $('#chosen-required-multiple')
      $input.blur()
      expect($input.hasClass(errorClass)).to.be.true


  # describe 'validators', ->
