class @FormLogic
  constructor: ->
    @validators = {}

    @buildDefaultValidators()
    @setupHandlers()
    @errorClass = 'has-error'


  # Adds a validator to FormLogic
  validate: (name, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument you passed to FormLogic.validator() was not a function'

    @validators[name] = func


  # Calls validators on blur and on form submit
  setupHandlers: ->
    my = @
    for form in $('form')
      $form = $(form)
      for input in $form.find('[data-validate]')
        $input = $(input)

        # Don't do blur validations for checkboxes and radio elements
        return if $(@).attr('type') == 'checkbox' || $(@).attr('type') == 'radio'

        $input.blur ->
          my.runValidators($(@))
        $input.focus =>
          my.clearErrors($(@))

      $form.submit ->
        hasError = false
        $form = $(@)
        for input in $form.find('[data-validate]')
          unless my.runValidators($(input))
            hasError = true

        return !hasError

  # Evaluates the input according to the validators specified by data-validate
  runValidators: ($input)->
    hasError = false
    return hasError if ($input.is(':hidden') or $input.is(':submit')) and !$input.data('force-validation')

    vString = $input.data('validate')
    return hasError if typeof vString != 'string'
    vNames = vString.split(' ')

    for name in vNames
      continue unless @validators[name]
      continue unless name == 'required' || $input.val() != ''
      unless @validators[name]($input)
        @showError $input, name
        hasError = true

    return !hasError

  # Removes errors for the given input field
  clearErrors: ($input) ->
    return if ($input.is(':hidden') or $input.is(':submit')) and !$input.data('force-validation')
    $input.removeClass(@errorClass)
  # TODO

  showError: ($input, name) ->
    $input.addClass(@errorClass)
  # TODO


  # Establishes a list of default validators
  buildDefaultValidators: ->

    # Checks that a value was provided (only validator that doesn't accept empty values)
    @validate 'required', ($input)->
      if $input.attr('type') == 'radio' || $input.attr('type') == 'checkbox'
        name = $input.attr('name')
        for option in $('[name="' + name + '"]')
          return true if $(option).is(':checked')
        return false
      else
        $input.val() != ''

    # Checks that the value is a valid email address
    @validate 'email', ($input) ->
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      re.test($input.val())

    # Checks that the value is greater than or equal to the given minimum
    @validate 'minimum', ($input) ->
      min = parseFloat($input.data('minimum'))
      val = parseFloat($input.val())
      val >= min

    # Checks that the value is less than or equal to the given maximum
    @validate 'maximum', ($input) ->
      max = parseFloat($input.data('maximum'))
      val = parseFloat($input.val())
      val <= max

    # Checks that the value is numeric
    @validate 'number', ($input) ->
      val = $input.val()
      !isNaN(parseFloat(val)) && isFinite(val)

    # Compares the value of two input elements to be sure they're equal
    @validate 'confirm', ($input) ->
      target = $input.data('confirm-target')
      $input.val() == $(target).val() 

    # Simply checks for 7-15 number digits minus all other characters, not the best check
    @validate 'phone', ($input) ->
      val = $input.val().replace(/[^\d.]/g, '')
      val.length > 6 && val.length < 16


fl = new FormLogic
