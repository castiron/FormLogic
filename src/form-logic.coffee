class @FormLogic
  constructor: ->
    return FormLogic._instance if FormLogic._instance
    FormLogic._validators = {}

    @buildDefaultValidators()
    @setupValidationHandlers()
    @setupPrompts()
    @setupMasks()
    @hideErrorTargets()
    @fieldErrorClass = 'has-error'
    @errorClass = 'error'

    FormLogic._instance = @


  # Adds a validator to FormLogic
  @validate: (name, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument passed to FormLogic.validator() must be a function.'

    FormLogic._validators[name] = func

  # Adds a listeners to  form submissions

  @onBeforeValidation: (form, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument passed to FormLogic.onBeforeValidation() must be a function.'
    $(form).data('fl-before-validation-callback', func)

  @onValidSubmit: (form, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument passed to FormLogic.onValidSubmit() must be a function.'
    $(form).data('fl-valid-submit-callback', func)

  @onInvalidSubmit: (form, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument passed to FormLogic.onInvalidSubmit() must be a function.'
    $(form).data('fl-invalid-submit-callback', func)


  setupMasks: ->
    $('[data-mask]').each (i,el) ->
      $el = $(el)
      mask = $el.data('mask')
      return if $.trim(mask) == ''
      type = $el.prop('type')
      return unless type == 'text' or type == 'textfield' or type == 'input'

      $el.on 'input', (event) ->
        inputVal = $(@).val().replace(/( )+$/,'')

        # Each call invokes the next letter in the value string
        nextVal = do ->
          valPos = 0
          return -> inputVal.charAt valPos++

        # Determines the next character for the new
        # value using a given compare function
        nextChar = (compareFunc) ->
          valChar = nextVal()
          return false unless valChar            # end of input
          return valChar if compareFunc(valChar) # nextVal is valid
          return nextChar compareFunc            # skip this valChar and try the next

        isNumber = (str) -> 47 < str.charCodeAt(0) < 58
        isLetter = (str) -> (64 < str.charCodeAt(0) < 91) or (96 < str.charCodeAt(0) < 123)
        isLetterOrNumber = (str) -> isNumber(str) or isLetter(str)

        # Loops through the mask characters and
        # determines what should be added to newVal
        # for each character
        newVal = ''
        cursorPosition = 0
        lastMaskChars = ''
        for pos in [0..mask.length]
          maskChar = mask.charAt pos
          switch maskChar

            # numbers only
            when '0'
              next = nextChar isNumber

            # letters only, uppercase
            when 'A'
              next = nextChar(isLetter)
              next.toUpperCase() if next != false

            # letters only, lowercase
            when 'a'
              next = nextChar(isLetter)
              next.toLowerCase() if next != false

            # letters only, any case
            when 'Z'
              next = nextChar isLetter

            # letter or number, any case
            when '?'
              next = nextChar isLetterOrNumber

            # letter or number, uppercase
            when 'X'
              next = nextChar(isLetterOrNumber)
              next.toUpperCase() if next != false

            # letter or number, lowercase
            when 'x'
              next = nextChar(isLetterOrNumber)
              next.toLowerCase() if next != false

            # escape character
            when '\\'
              next = mask.charAt ++pos

            # not a key letter, use maskChar
            else
              next = maskChar
              lastMaskChars += maskChar

          # Quit if there're no more input characters
          break if next == false

          ++cursorPosition
          newVal += next

        # remove mask chars at the end (makes dealing with backspaces easier)
        numMaskCharsToRemove = 0
        for index in [-1..(newVal.length * -1)]
          if newVal.substr(index, 1) == lastMaskChars.substr(index, 1)
            ++numMaskCharsToRemove
          else
            break

        if numMaskCharsToRemove != 0
          newVal = newVal.slice(0, numMaskCharsToRemove * -1)
          cursorPosition -= numMaskCharsToRemove

        # Adjust for middle of string edits
        if @setSelectionRange
          if @selectionStart != inputVal.length
            cursorPosition = if @selectionStart > inputVal.length then @selectionStart + 1 else @selectionStart

        # update value
        $(@).val newVal

        # update cursor
        if @setSelectionRange
          @setSelectionRange(cursorPosition, cursorPosition)



  setupPrompts: ->

    showChildren = ($el) ->
      $el.show()
      for input in $el.find('[name]').addBack('[name]')
        $child = $('[data-prompt="'+$(input).attr('name')+'"]')
        $(input).change() if $child
      for input in $el.find('[id]').addBack('[id]')
        $child = $('[data-prompt="#'+$(input).attr('id')+'"]')
        $(input).change() if $child

    hideChildren = ($el) ->
      $el.hide()
      for input in $el.find('[name]').addBack('[name]')
        $child = $('[data-prompt="'+$(input).attr('name')+'"]')
        hideChildren $child if $child
      for input in $el.find('[id]').addBack('[id]')
        $child = $('[data-prompt="#'+$(input).attr('id')+'"]')
        hideChildren $child if $child

    for form in $('form')
      $('[data-prompt]').each (i,el) ->
        $el = $(el)
        $form = $el.parents('form:first')

        # Hide dependent field from the start
        $el.hide()

        # Locate the parent using name or ID
        handle = $el.data('prompt')
        $parent = if handle.charAt(0) == '#' then $($form.find(handle)) else $($form.find('[name="'+handle+'"]'))

        # Determine the target values
        goalString = $el.data('show-if')
        goals = []
        if goalString
          goals = $.map goalString.split(';'), (str) -> return $.trim str

        # Collect info about the parent
        parentType = $parent.prop('type')
        parentName = $parent.attr('name')

        handleVisibility = ->
          show = false
          values = []
          val = $(@).val()

          # Build an array of values no matter what type of element it is
          switch parentType
            when 'radio'
            when 'checkbox'
              siblings = $form.find('[name="'+parentName+'"]:checked')
              values.push $(checkbox).val() for checkbox in siblings
            when 'select-one'
            when 'select-multiple'
              for option in $(@).find('option:selected')
                givenValue = $(option).attr('value')
                if givenValue then values.push givenValue
            else
              values.push val


          # Check the values
          if values.length == 0 # early exit
            show = false
          else if goals.length == 0 and values.length > 0
            show = true
          else
            for goal in goals
              if $.inArray(goal, values) != -1
                show = true
                break

          if show
            showChildren $el
          else
            hideChildren $el

        $parent.change handleVisibility
        handleVisibility.call($parent)

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
  setupValidationHandlers: ->
    my = @
    $('form').each (i, form) ->
      $form = $(form)
      $form.find('[data-validate]').each (x, input) ->
        $input = $(input)

        # Don't do blur validations for checkboxes and radio elements
        return if $(@).attr('type') == 'checkbox' || $(@).attr('type') == 'radio'

        $input.blur ->
          my.runValidators($(@), $form)
        $input.focus ->
          vString = $(@).data('validate')
          if typeof vString != 'string'
            my.clearErrors($(@))
          else
            vNames = vString.split(' ')
            my.clearErrors($(@), name) for name in vNames

      $form.submit (event) ->
        hasError = false

        callback = $(@).data('fl-before-validation-callback')
        if callback && typeof(callback) == 'function'
          callback.call($(@), event)

        for input in $(@).find('[data-validate]')
          unless my.runValidators($(input), $(@))
            hasError = true

        if hasError
          callback = $(@).data('fl-invalid-submit-callback')
          if callback && typeof(callback) == 'function'
            callback.call($(@), event)
        else
          callback = $(@).data('fl-valid-submit-callback')
          if callback && typeof(callback) == 'function'
            return callback.call($(@), event)

        return !hasError

  # Evaluates the input according to the validators specified by data-validate
  # Returns true if valid and false if not valid
  runValidators: ($input, $form)->
    hasError = false

    # Skip submit elements & hidden elements (unless using Chosen JS) unless forced to validate
    if (($input.is(':hidden') and !$input.next('.chosen-container').length) or $input.is(':submit')) and !$input.data('force-validation')
      return true

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
    target = $input.data('error-'+name) if name
    target = $input.data('error') unless target
    $next = $input.next('.'+@errorClass)

    if target
      $(target).hide()
    else if $next
      $next.hide()

  showError: ($input, name) ->
    @clearErrors $input, name
    $input.addClass(@fieldErrorClass)
    message = $input.data('message-'+name) if name
    message = $input.data('message') unless message
    target = $input.data('error-'+name) if name
    target = $input.data('error') unless target

    if target and message
      $(target).text(message).show()
    else if target
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
      isnum = (v) -> !isNaN(v) && isFinite(v) && /^[0-9]*\.?[0-9]+$/.test(v)

      # Check if original value is a number
      return false unless isnum($input.val())

      # Parse out numbers
      val = parseFloat($input.val())
      min = parseFloat($input.data('min'))
      max = parseFloat($input.data('max'))

      return min <= val <= max if isnum(max) and isnum(min)
      return val <= max        if isnum(max) and !isnum(min)
      return min <= val        if !isnum(max) and isnum(min)
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

    FormLogic.validate 'card-cvc', ($input, $form) ->
      3 <= $input.val().replace(/\D/g,'').length <= 4

    FormLogic.validate 'card-number', ($input, $form) ->
      regex = ///^(?:4[0-9]{12}(?:[0-9]{3})?        # Visa
              |  5[1-5][0-9]{14}                  # MasterCard
              |  3[47][0-9]{13}                   # American Express
              |  3(?:0[0-5]|[68][0-9])[0-9]{11}   # Diners Club
              |  6(?:011|5[0-9]{2})[0-9]{12}      # Discover
              |  (?:2131|1800|35\d{3})\d{11}      # JCB
      )$///
      $input.val().replace(/\D/g,'').match(regex) != null


fl = new FormLogic
