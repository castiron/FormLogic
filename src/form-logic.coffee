class @FormLogic
	constructor: ->
		console.log 'yo'
		@validators = {}

		@buildDefaultValidators()
		@setupHandlers()


	validator: (name, func) ->
		if !func || typeof(func) != 'function'
			throw 'The second argument you passed to FormLogic.validator() was not a function'

		@validators[name] = func


	setupHandlers: ->
		for input in $('[data-validate')
			$(input).blur @runValidators
			$(input).focus @clearErrors


	runValidators: (e) ->
		$input = $(@)
		return if ($input.is(':hidden') or $input.is(':submit')) and !$input.data('force-validation')

		vString = $input.data('validate')
		return if typeof vString != 'string'
		vNames = vString.split(' ')

		for name in vNames
			continue unless @validators[name]
			unless @validators.name $input
				@showError $input, name


	clearErrors: (e) ->


	showError: ($input, name) ->


	buildDefaultValidators: ->
		@validator 'required', ($input)->
			console.log 'validating required'
			if $input.attr('type') == 'radio' || $input.attr('type') == 'checkbox'
				name = $input.attr('name')
				for option in $('[name="'+name+'"]')
					return if $(option).is(':checked')
				showError($input, 'required')
			else
				showError($input, 'required') if $input.val() == ''



fl = new FormLogic
