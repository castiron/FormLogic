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
        $input.blur ->
          @runValidators($input)
        $input.focus ->
          @clearErrors($input)

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

    @validate 'required', ($input)->
      if $input.attr('type') == 'radio' || $input.attr('type') == 'checkbox'
        name = $input.attr('name')
        for option in $('[name="' + name + '"]')
          return if $(option).is(':checked')
        return false
      else
        $input.val() != ''

    @validate 'email', ($input) ->
      return true if $input.val() == ''
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      re.test($input.val())

    @validate 'minimum', ($input) ->
      return true if $input.val() == ''
      min = parseFloat($input.data('minimum'))
      val = parseFloat($input.val())
      val >= min

    @validate 'maximum', ($input) ->
      return true if $input.val() == ''
      max = parseFloat($input.data('maximum'))
      val = parseFloat($input.val())
      val <= max

    @validate 'number', ($input) ->
      return true if $input.val() == ''
      val = $input.val()
      !isNaN(parseFloat(val)) && isFinite(val)

fl = new FormLogic
