class DataValidate
  constructor: (el, @options) ->
    @$el = $(el)
    @$submit = @$el.find('input[type="submit"]')
    @addHint($(input)) for input in @$el.find('input')
        
    @$submit.click( =>
      
      # Hide existing errors
      for errorInputs in @$el.find('.hasError')
        $(errorInputs).removeClass('.hasError')
      for errorMessages in @$el.find('.error')
        $(errorMessages).html('')
        
      # Sort through all the inputs
      inputs = @$el.find('input')
      for input in inputs
        $input = $(input)
        if $input.attr('type') == 'submit'
          @$submit = $input
          continue
          
        $input.val('') if $input.hasClass('has-hint')
   
        # Split up the list of validators
        vString = $input.data('validate')
        if typeof vString != 'string'
          continue
        validators = vString.split(' ')
      
        # Invoke the appropriate validators
        for validator in validators
          switch validator
            when 'required'
              @validateRequired($input)
            when 'email'
              @validateEmail($input)
            when 'minimum'
              @validateMinimum($input)
            when 'maximum'
              @validateMaximum($input)
            when 'number'
              @validateNumber($input)
            when 'confirm'
              @validateConfirm($input)
      
      # Call a user defined function if it exists
      if @isValid() and DataValidate.onValidSubmit?
        return DataValidate.onValidSubmit()
      else if !@isValid()
        @addHint($(input)) for input in @$el.find('input')
        return false
      return true
    )        
       
  validateRequired: ($input) ->
    @showError($input, 'required') if $input.val() == ''
    
  validateEmail: ($input) ->
    return if $input.val() == ''
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    bool = re.test($input.val())
    @showError($input, 'email') if not bool 
    
  validateMinimum: ($input) ->
    return if $input.val() == ''
    min = parseInt($input.data('minimum'))
    val = parseInt($input.val())
    @showError($input, 'minimum') if val < min

  validateMaximum: ($input) ->
    return if $input.val() == ''
    max = parseInt($input.data('maximum'))
    val = parseInt($input.val())
    @showError($input, 'maximum') if val > max
    
  validateNumber: ($input) ->
    return if $input.val() == ''
    val = $input.val()
    @showError($input, 'number') if isNaN(parseFloat(val)) or !isFinite(val)

  validateConfirm: ($input) ->
    return if $input.val() == ''
    confirmTarget = $input.data('confirm-target')
    password = $input.val()
    confirm = $(confirmTarget).val()
    @showError($input, 'confirm') if password != confirm        
        
        
  showError: ($input, type) ->
    @isValid(false)
    $input.addClass('has-error')
    errorTarget = $input.data('error-target')
    if typeof errorTarget != 'undefined'
      $error = @$el.find(errorTarget)
    else
      $next = $input.next()
      $error = $next if typeof $next != 'undefined' and $next.hasClass('error')      
    # Only show the error if we found a place to show them
    if typeof $error != 'undefined'
      msg = $input.data('message-'+type)
      if typeof msg == 'undefined'
        # use general message only, no appending
        msg = $input.data('message') 
        $error.html('<div class="error-msg">'+msg+'</div>')
      else
        # append specific messages
        $error.append('<div class="error-msg">'+msg+'</div>')
    my = @
    
    focusHandler = ->
      $(@).removeClass('has-error')
      if typeof $error != 'undefined'
        $error.html('')
      $(@).unbind('focus', focusHandler)
      my.reset()  
    
    $input.focus(focusHandler)
    
  addHint: ($input) ->
    return if $input.val() != ''
    hint = $input.data('hint')
    return if typeof hint == 'undefined'
    $input.addClass('has-hint')
    $input.val(hint)
    my = @
    
    focusHandler = -> 
      $(@).val('')
      $input.removeClass('has-hint')
      $(@).unbind('focus', focusHandler)
      
    blurHandler = ->
      if $(@).val() == ''
        $(@).unbind('blur', blurHandler)
        my.addHint($(@))
      
    $input.focus(focusHandler)
    $input.blur(blurHandler)
  
  isValid: (bool) ->
    @valid = true if typeof @valid == 'undefined'
    @valid = false if bool? and bool == false
    return @valid
  
  reset: ->
    @valid = true

$ ->
	$('form').each( ->
		if $(@).find('[data-validate]')
			new DataValidate($(@))
	)