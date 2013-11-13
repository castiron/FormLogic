expect = chai.expect  

describe 'FormLogic', ->

  errorClass = 'has-error'


  describe 'Errors', ->

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


  describe 'Validators', ->

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


  describe 'Dynamic Fields', ->

    it 'hides dependent fields on page load', ->
      expect($('[data-prompt]').is(':hidden')).to.be.true

    it 'shows fields dependent on text input', ->
      $input = $('[name="stimulus-text"]')
      $input.val('cherry')
      $input.change()
      expect($('[data-prompt="stimulus-text"]').is(':hidden')).to.be.false

    it 'hides fields dependent on text input', ->
      $input = $('[name="stimulus-text"]')
      $input.val('rosie')
      $input.change()
      expect($('[data-prompt="stimulus-text"]').is(':hidden')).to.be.true

    it 'shows fields dependent on checkbox values', ->
      $input = $('[name="stimulus-check"][value="check2"]')
      $input.prop('checked', true)
      $input.change()
      expect($('[data-prompt="stimulus-check"]').is(':hidden')).to.be.false

    it 'hides fields dependent on checkbox values', ->
      $input = $('[name="stimulus-check"][value="check2"]')
      $input.prop('checked', false)
      $input.change()
      expect($('[data-prompt="stimulus-check"]').is(':hidden')).to.be.true

    it 'shows fields dependent on radio values', ->
      $input = $('[name="stimulus-radio"][value="radio2"]')
      $input.prop('checked', true)
      $input.change()
      expect($('[data-prompt="stimulus-radio"]').is(':hidden')).to.be.false

    it 'hides fields dependent on radio values', ->
      $input = $('[name="stimulus-radio"][value="radio2"]')
      $input.prop('checked', false)
      $input.change()
      expect($('[data-prompt="stimulus-radio"]').is(':hidden')).to.be.true

    it 'shows fields dependent on select values', ->
      $input = $('[name="stimulus-select"]')
      $input.val('opt2')
      $input.change()
      expect($('[data-prompt="stimulus-select"]').is(':hidden')).to.be.false

    it 'hides fields dependent on select values', ->
      $input = $('[name="stimulus-select"]')
      $input.val('opt1')
      $input.change()
      expect($('[data-prompt="stimulus-select"]').is(':hidden')).to.be.true

    it 'shows fields dependent on select multiple values', ->
      $input = $('[name="stimulus-select-multiple"]')
      $input.val(['opt6'])
      $input.change()
      expect($('[data-prompt="stimulus-select-multiple"]').is(':hidden')).to.be.false

    it 'hides fields dependent on select multiple values', ->
      $input = $('[name="stimulus-select-multiple"]')
      $input.val(['opt4'])
      $input.change()
      expect($('[data-prompt="stimulus-select-multiple"]').is(':hidden')).to.be.true

    it 'takes the id selector for a prompt', ->
      $input = $('[name="stimulus-id-select"]')
      $input.val('opt8')
      $input.change()
      expect($('[data-prompt="stimulus-id-select"]').is(':hidden')).to.be.false


    it 'shows fields dependent on any non-empty value', ->
      $input = $('[name="stimulus-any-select"]')
      $input.val('opt11')
      $input.change()
      expect($('[data-prompt="stimulus-any-select"]').is(':hidden')).to.be.false

    it 'hides fields dependent on any non-empty value', ->
      $input = $('[name="stimulus-any-select"]')
      $input.find('option').first().prop('selected', true)
      $input.change()
      expect($('[data-prompt="stimulus-any-select"]').is(':hidden')).to.be.true
   
    it 'shows fields dependent on values that are dependent on other fields' 
    it 'hides fields dependent on values that are dependent on other fields' 
    it 'shows fields dependent on multiple values (specified with semicolon-separated values)'
    it 'hides fields dependent on multiple values (specified with semicolon-separated values)'


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

