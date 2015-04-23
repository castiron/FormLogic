# FormLogic

FormLogic is an unobtrusive JavaScript library for handling client-side form validation and dynamic form manipulation. Unlike other validation libraries, all of the work is in the markup using the underrated `data` property.


## Getting Started

FormLogic depends on jQuery.

    <head>
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="form-logic.js" type="text/javascript"></script>
    </head>
    <body>
        <form>
            <!-- VALIDATION -->
            <label>Name:</label>
            <input name="name" type="text" data-validate="required"
                   data-message="Please provide a name." />

            <!-- DYNAMIC FIELDS -->
            <div data-prompt="name" data-show-if="Samantha">
                <label>Special Field for Samantha</label>
                <input name="age" type="text" />
            </div>

            <input type="submit" value="submit" />
        </form>
    </body>

This, `data-validate="required"`, will validate the input element to make sure that the user enters something. If the user doesn't enter anything, then the value of `data-message` is shown as an error message after the input element. All validations happen when the user submits the form.

The `data-prompt` attribute hides this element until the user types 'Samantha' into the field with the name `name`.

## Configuration

The main goal of FormLogic is to be light on the JavaScript configuration and heavy on the markup.


#### Do something after valid submit
Currently, the only possible configuration is a callback for when the form is successfully validated:

    FormLogic.onValidSubmit = function() {
         // Do whatever extra validation you need to do.
         // Return false to halt the submit. (Be sure to display your own errors.)

         return true; // to submit the form
    }

#### Add custom validators

    // Custom validation that number is greater than 700
    FormLogic.validate('my-requirements', function($input, $form) {
        var val = $input.val();
        return val > 700;
    });

It works like normal validators:

    <input data-validate="required my-requirements" type="text"
           data-message-required="Please guess a number"
           data-message-my-requirements="Gotcha! It's gotta be greater than 700." />

If a custom validator has the same name as a default one, then it will override the default.

One thing to note about custom validators is that the only validator that checks for empty values is the `required` validator. So, if you create a custom validator, it won't be invoked for empty values. Just use `required` to check that it's not empty. 

#### Change some details

    // Class added to invalid fields
    FormLogic.fieldErrorClass = 'this-input-is-invalid'

    // Class used when generating an error tag after the input (see data-message)
    FormLogic.errorClass = 'oops'

## Validation

#### `data-validate`

This property accepts a space separated list of validator names.

    data-validate="required number minimum maximum"

The current set of validators are:

* `required` - The value can't be an empty string.
* `email` - The value must be a valid email.
* `minimum` - The value must be equal or above the value in the `data-minimum` property.
* `maximum` - The value must be equal or below the value in the `data-maximum` property.
* `number` - The value must be an integer or float.
* `confirm` - The value must match the value of the element specified by `data-confirm-target`
* `phone` - Simple phone validation (mostly just length, ignores non digits)
* `length` - Used with `data-min` and/or `data-max` to check string lengths

Credit card validators:
* `card-number` - Credit card validation; checks against patterns of major credit card companies
* `card-cvc` - Credit card security code validation; checks 3 or 4 digits long


#### `data-message`

This property determines what the error message should be if the input value is invalid. Using `data-message` is fine if there is only one validator. However, to give a more specific error, you can have different messages for different validators. You just have to add the validator name to the `data-message` property. For example, `data-message-email` will only show if the email is not properly validated and `data-message-required` show if the value is empty.

If you want to use the same error message for all validators, then, by all means, use `data-message`. However, using `data-message` means that all validators except `required` will show that message if there's an error. So, the only time you can use `data-message` with other messages is with `data-message-required`.

For example, the error will be 'Please provide a year', if nothing is provided. And if there is a value and it's invalid, the error will be 'Please provide a _valid_ year in the future.'

    <input type="text" class="exp-year" data-hint="YYYY"
           data-validate="required number minimum maximum"
           data-minimum="2012"
           data-maximum="2060"
           data-message-required="Please provide a year."
           data-message="Please provide a <em>valid</em> year in the future."/>
    <div class="error"></div>

After error messages are shown, if the user clicks on the input field again, then the error message goes away.

#### `data-error`

Use this to be more specific about where the error messages show up. With it you specify a selector, probably an ID: `data-error="#my-custom-error-for-this-input"`. Now if there is an error, this will be shown. Nothing is thus added to the dom, because it is already there. Used in conjunction with `data-message`, you can both specify a target and a message. The message will be added as the text value of the `data-error` target.

    <input data-validate="required" type=text"
           data-message="You should enter something here"
           data-error="#error-for-this" />
    <div class="error-wrap">
        <div id="error-for-this">
            <!-- I am populated later -->
        </div>
    </div>


#### `data-minimum`

When using the `minimum` validator, you must specify what that minimum should be with `data-minimum`.

#### `data-maximum`

When using the `maximum` validator, you must specify what that maximum should be with `data-maximum`.

#### `data-confirm-target`

When using the `confirm` validator, you must specify what element contains the value to confirm with. This takes a CSS selector. Typically, you'd use this for situations where you have a password input element and a password confirmation input element.

#### `data-min` and/or `data-max`

Used when validating "length".

#### `data-force-validation`

For hidden elements (which are not normally validated), you may need to force validation by adding this attribute.

## Input Masking

#### `data-mask`

This is a simple implementation of masking user input as it's being typed. You can do something like:

    <input type="text" id="mask-phone" data-mask="(000) 000 - 0000" />
    <input type="text" id="mask-policy" data-mask="AA-????-????" />
    
And the input will be handled as expected. 

char | meaning
--- | ---
`0` | numbers only
`A` | letters only, uppercase
`a` | letters only, lowercase
`Z` | letters only, any case
`?` | letter or number, any case
`X` | letter or number, uppercase
`x` | letter or number, lowercase
`\` | escape character
other | used literally

    

## Dynamic Form Elements

#### `data-prompt`

Use this attribute to show that one field is dependent on another field. Use the `name` attribute of the form element, **not** the `id` attribute. Along with this, you must use a `data-show-if...` attribute.

#### `data-show-if`

Used with `data-prompt`, this attribute determines when to show this field. For example, if this element is dependent on a field named `charities` and `data-show-if="YMCA"`, then this element will only be shown when user selects the YMCA charity. This can take multiple values separated by semi-colons.

#### `data-show-if-any`

Used with `data-prompt`, this attribute shows this field whenever anything is selected or added to the field on which this depends.

## Example

    <form id="signupForm">
        <label>Email:</label>
        <input type="text" class="email"
               data-validate="required email"
               data-message-required="Please provide an email."
               data-message-email="Please provide a <em>valid</em> email address." />
        <div class="error"></div>

        <label>Password:</label>
        <input type="password" id="password" class="password"
               data-validate="required"
               data-message-required="Please provide a password."/>
        <div class="error"></div>

        <label>Confirm Password:</label>
        <input type="password"
               data-validate="required confirm"
               data-confirm-target="#password"
               data-message-required="Please confirm your password."
               data-message-confirm="Your passwords do not match." />
        <div class="error"></div>

        <label>Security Code:</label>
        <input type="text" class="cvc"
               data-validate="required number minimum maximum"
               data-message-required="Please provide a security code."
               data-message="Please provide a <em>valid</em> security code."
               data-minimum="100"
               data-maximum="999" />
        <div class="error"></div>

        <label>Expiration:</label>
        <input type="text" class="exp-month" data-hint="MM"
               data-validate="required number minimum maximum"
               data-minimum="1"
               data-maximum="12"
               data-error-target="#expiration-error"
               data-message-required="Please provide a month."
               data-message="Please provide a <em>valid</em> month in the future."/>
        <input type="text" class="exp-year" data-hint="YYYY"
               data-validate="required number minimum maximum"
               data-minimum="2012"
               data-maximum="2060"
               data-message-required="Please provide a year."
               data-message="Please provide a <em>valid</em> year in the future."/>
        <div class="error"></div>
        <div id="expiration-error" class="error"></div>

        <label>Donate to charities?</label>
        <label>
            <input type="radio" name="donate" value="yes"> Yes
        </label>
        <label>
            <input type="radio" name="donate" value="no"> No
        </label>

        <div data-prompt="donate" data-show-if="yes">
            <label>Which ones?</label>
            <label>
                <input type="checkbox" name="charities[]" value="For the kids"> For the kids
            </label>
            <label>
                <input type="checkbox" name="charities[]" value="Donald Fund"> Donald Fund
            </label>
            <label>
                <input type="checkbox" name="charities[]" value="Wounded Soldiers"> Wounded Soldier
            </label>
        </div>
        <div data-prompt="charities[]" data-show-if-any="true">
            <strong>THANKS!</strong>
        </div>
        <div data-prompt="charities[]" data-show-if="For the kids; Donald Fund">
            <strong>I like that one!</strong>
        </div>

        <input type="submit" class="submit btn" value="submit" />
    </form>

