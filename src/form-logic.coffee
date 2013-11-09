class @FormLogic
  constructor: ->
    return FormLogic._instance if FormLogic._instance
    FormLogic._validators = {}

    @buildDefaultValidators()
    @setupHandlers()
    @hideErrorTargets()
    @fieldErrorClass = 'has-error'
    @errorClass = 'error'

    FormLogic._instance = @


  # Adds a validator to FormLogic
  @validate: (name, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument you passed to FormLogic.validator() was not a function.'

    FormLogic._validators[name] = func

  @onValidSubmit: (form, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument you passed to FormLogic.onValidSubmit() was not a function.'

    $(form).data('fl-submit-callback', func)



  # This makes it easier for users to leave error targets in the markup
  # without worrying about adding 'display: none' all the time.
  hideErrorTargets: ->
    return if FormLogic._instance
    for form in $('form')
      $form = $(form)
      for input in $form.find('[data-validate]')
        $input = $(input)

        # Parse out the specified validators
        vString = $input.data('validate')
        continue if typeof vString != 'string'
        vNames = vString.split(' ')

        for name in vNames
          target = $input.data('error-'+name)
          target = $input.data('error') unless target
          $next = $input.next('.'+@errorClass)

          if target
            $(target).hide()
          else if $next
            $next.hide()

    true

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

      $form.submit (event) ->
        hasError = false
        for input in $(@).find('[data-validate]')
          unless my.runValidators($(input), $(@))
            hasError = true

        unless hasError
          callback = $form.data('fl-submit-callback')
          if callback && typeof(callback) == 'function'
            return callback.call($form, event) 

        return !hasError

  # Evaluates the input according to the validators specified by data-validate
  runValidators: ($input, $form)->
    hasError = false

    # Skip submit elements & hidden elements (unless using Chosen JS) unless forced to validate
    if (($input.is(':hidden') and !$input.next('.chosen-container').length) or $input.is(':submit')) and !$input.data('force-validation')
      return false 

    # Parse out the specified validators
    vString = $input.data('validate')
    return false if typeof vString != 'string'
    vNames = vString.split(' ')

    for name in vNames

      # Skip validators we don't know
      continue unless FormLogic._validators[name]

      # The only validator for empty values is 'required'
      continue unless name == 'required' || $input.val() != ''

      # Call the validators one by one
      unless FormLogic._validators[name]($input, $form)
        @showError $input, name
        hasError = true

    return !hasError

  # Removes errors for the given input field
  clearErrors: ($input, name) ->
    return if ($input.is(':hidden') or $input.is(':submit')) and !$input.data('force-validation')
    $input.removeClass(@fieldErrorClass)
    target = $input.data('error-'+name)
    target = $input.data('error') unless target
    $next = $input.next('.'+@errorClass)

    if target
      $(target).hide()
    else if $next
      $next.hide()

  showError: ($input, name) ->
    @clearErrors $input, name
    $input.addClass(@fieldErrorClass)
    message = $input.data('message-'+name)
    message = $input.data('message') unless message
    target = $input.data('error-'+name)
    target = $input.data('error') unless target

    if target
      $(target).show()
    else if message
      $input.after('<div class="'+@errorClass+'">'+message+'</div>')

  # Establishes a list of default validators
  buildDefaultValidators: ->

    # Checks that a value was provided (only validator that doesn't accept empty values)
    FormLogic.validate 'required', ($input, $form)->
      if $input.attr('type') == 'radio' || $input.attr('type') == 'checkbox'
        name = $input.attr('name')
        for option in $('[name="' + name + '"]')
          return true if $(option).is(':checked')
        return false
      else
        val = $input.val()
        val && $input.val() != ''

    # Checks that the value is a valid email address
    FormLogic.validate 'email', ($input, $form) ->
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      re.test($input.val())

    # Checks that the value is numeric
    FormLogic.validate 'number', ($input, $form) ->
      val = parseFloat($input.val())
      min = parseFloat($input.data('max'))
      max = parseFloat($input.data('min'))
      return false             unless !isNaN(val) && isFinite(val)
      return min <= val <= max if max != undefined and min != undefined
      return val <= max        if max != undefined and min == undefined
      return min <= val        if max == undefined and min != undefined
      return true

    # Compares the value of two input elements to be sure they're equal
    FormLogic.validate 'confirm', ($input, $form) ->
      target = $input.data('confirm-target')
      $input.val() == $(target).val() 

    # Simply checks for 7-15 number digits minus all other characters, not the best check
    FormLogic.validate 'phone', ($input, $form) ->
      val = $input.val().replace(/[^\d.]/g, '')
      val.length > 6 && val.length < 16

    # Checks that string is greater than some specified length
    FormLogic.validate 'length', ($input, $form) ->
      min = $input.data('min')
      max = $input.data('max')
      val = $input.val().length

      return min <= val <= max if max != undefined and min != undefined
      return val <= max        if max != undefined and min == undefined
      return min <= val        if max == undefined and min != undefined
      return true
        

    # Checks that string is less than some specified length
    FormLogic.validate 'max-length', ($input, $form) ->
      $input.val().length <= $input.data('max')

fl = new FormLogic
