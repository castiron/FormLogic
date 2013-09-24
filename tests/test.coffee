expect = chai.expect  

describe 'FormLogic', ->

  $form = $('#signupForm')
  errorClass = 'has-error'

  afterEach ->
    $('#signupForm')
      .find('input, select, textarea')
      .not('input[type="submit"]')
      .val('')
      .removeClass('has-error')
    $('.error').remove()

  describe 'constructor', ->
    it 'exists in the global scope', ->
      fl = new FormLogic
      expect(fl).to.exist

  describe 'validators', ->
    it 'validates a required value', ->
      $('#signupForm input[type="submit"]').click()
      setTimeout ->
        expect($input.hasClass(errorClass)).to.be.true
      , 50