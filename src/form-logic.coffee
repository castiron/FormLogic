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

  # Adds a listener to valid form submissions
  @onValidSubmit: (form, func) ->
    if !func || typeof(func) != 'function'
      throw 'The second argument passed to FormLogic.onValidSubmit() must be a function.'

    $(form).data('fl-submit-callback', func)


  setupMasks: ->
    $('[data-mask]').each (i,el) ->
      $el = $(el)
      mask = $el.data('mask')
      return if $.trim(mask) == ''
      type = $el.prop('type')
      return unless type == 'text' or type == 'textfield' or type == 'input'

      $el.on 'input', (event) ->
        val = $(@).val().replace(/( )+$/,'')
        console.log "val: '"+val+"'"

        # Each call invokes the next letter in the value string
        nextVal = do ->
          valPos = 0
          return -> val.charAt valPos++

        # Determines the next character for the new 
        # value using a given compare function 
        nextChar = (compareFunc) ->
          valChar = nextVal()
          return false unless valChar            # end of input
          return valChar if compareFunc(valChar) # nextVal is valid
          return nextChar compareFunc            # skip this val and try the next

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
          console.log 'loop: '+pos
          maskChar = mask.charAt pos
          console.log "- maskChar: '"+ maskChar+"'"
          switch maskChar
            # numbers only
            when '0'  then next = nextChar isNumber
            # force uppercase
            when 'A'  then next = nextChar(isLetter).toUpperCase()
            # force lowercase
            when 'a'  then next = nextChar(isLetter).toLowerCase()
            # letters only, any case
            when 'Z'  then next = nextChar isLetter
            # letter or number, any case
            when '?'  then next = nextChar isLetterOrNumber
            # letter or number, uppercase
            when 'X'  then next = nextChar(isLetterOrNumber).toUpperCase()
            # letter or number, lowercase
            when 'x'  then next = nextChar(isLetterOrNumber).toLowerCase()
            # escape character
            when '\\' then next = mask.charAt ++pos 
            # not a key letter, use maskChar
            else           
              next = maskChar
              lastMaskChars += maskChar

          console.log 'lastMaskChars: '+lastMaskChars
          # Quit if there're no more input characters
          break if next == false 

          ++cursorPosition
          newVal += next
          console.log "- next: '"+next+"'"

        # remove mask chars at the end (makes dealing with backspaces easier)
        numMaskCharsToRemove = 0
        for index in [-1..(newVal.length * -1)]
          console.log 'newval(index, 1): '+newVal.substr(index, 1)
          console.log 'lastMaskChars(index, 1): '+lastMaskChars.substr(index, 1)
          if newVal.substr(index, 1) == lastMaskChars.substr(index, 1)
            ++numMaskCharsToRemove
          else 
            break
            
        if numMaskCharsToRemove != 0            
          newVal = newVal.slice(0, numMaskCharsToRemove * -1)


        # update value
        $(@).val newVal
        console.log "newVal: '"+newVal.replace(/( )+$/,'')+"'"
        console.log 'cursorPosition: '+cursorPosition
        console.log ' '

        # update cursor
        if @setSelectionRange
          @setSelectionRange cursorPosition, cursorPosition
        else if @createTextRange
          range = @createTextRange()
          range.collapse true
          range.moveEnd 'character', cursorPosition
          range.moveStart 'character', cursorPosition
          range.select()
        




  setupPrompts: ->

    showChildren = ($el) -> 
      $el.show()
      for input in $el.find('[name]').addBack('[name]')
        $child = $('[data-prompt="'+$(input).attr('name')+'"')
        $(input).change() if $child
      for input in $el.find('[id]').addBack('[id]')
        $child = $('[data-prompt="#'+$(input).attr('id')+'"')
        $(input).change() if $child

    hideChildren = ($el) -> 
      $el.hide()
      for input in $el.find('[name]').addBack('[name]')
        $child = $('[data-prompt="'+$(input).attr('name')+'"')
        hideChildren $child if $child
      for input in $el.find('[id]').addBack('[id]')
        $child = $('[data-prompt="#'+$(input).attr('id')+'"')
        hideChildren $child if $child

    for form in $('form')
      $('[data-prompt]').each (i,el) ->
        $el = $(el)
        $form = $el.parent('form')

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

        $parent.change ->
          show = false
          values = []
          val = $(@).val()

          # Build an array of values no matter what type of element it is          
          switch parentType
            when 'radio','checkbox'
              siblings = $form.find('[name="'+parentName+'"]:checked')
              values.push $(checkbox).val() for checkbox in siblings
            when 'select-one','select-multiple'
              for option in $(@).find('option:selected')
                givenValue = $(option).attr('value')
                values.push givenValue if givenValue  
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
    for form in $('form')
      $form = $(form)
      for input in $form.find('[data-validate]')
        $input = $(input)

        # Don't do blur validations for checkboxes and radio elements
        return if $(@).attr('type') == 'checkbox' || $(@).attr('type') == 'radio'

        $input.blur ->
          my.runValidators($(@))
        $input.focus ->
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
