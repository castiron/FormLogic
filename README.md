# DataValidate

DataValidate is an unobtrusive JavaScript library for handling client-side form validation.
Unlike other validation libraries, all of the work is in the markup using the underrated `data`
property.


### Getting Started

DataValidate depends on jQuery because I'm lazy and you should be too.

    <head>
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="data-validate.js" type="text/javascript"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                new DataValidate($('#signupForm'));
            });
        </script>
    </head>
    <body>
        <form id="signupForm">
            <label>Name:</label>
            <input type="text" data-validate="required" data-message="Please provide a name." />
            <div class="error"></div>

            <input type="submit" value="submit" />
        </form>
    </body>

This, `data-validate="required"`, will validate the input element to make sure that the user
enters something. If the user doesn't enter anything, then the value of `data-message` is
supplied in `<div class="error"></div>`. All validations happen when the user submits the form.

### API

#### Configuration

The main goal of DataValidate is to be light on the JavaScript configuration and heavy
on the markup.

Any configurations you need to make are made when you instantiate DataValidate.

    new DataValidate(element, options);

`element` can be a CSS selector or a jQuery object. `options` is an object containing
configuration properties.

Currently, the only possible option is a callback for when the form is successfully validated:

    new DataValidate('#signupForm', {
        onValidSubmit: function() {
            // Do whatever extra validation you need to do.
            // Return false to halt the submit. (Be sure to display your own errors.)

            return true; // to submit the form
        }
    });

At some point, custom validators can be added to the options object.

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

At some point, custom validators will also be accepted.

#### `data-message`

This property determines what the error message should be if the input value is
invalid. Using `data-message` is fine if there is only one validator. However,
to give a more specific error, you can have different messages for different validators.
You just have to add the validator name to the `data-message` property. For example,
`data-message-email` will only show if the email is not properly validated and `data-message-required`
show if the value is empty.

If you want to use the same error message for all validators, then, by all means, use
`data-message`. However, using `data-message` means that all validators except `required` will
show that message if there's an error. So, the only time you can use `data-message` with other
messages is with `data-message-required`.

For example, the error will be 'Please provide a year', if nothing is provided. And if there is
a value and it's invalid, the error will be 'Please provide a _valid_ year in the future.'

    <input type="text" class="exp-year" data-hint="YYYY"
           data-validate="required number minimum maximum"
           data-minimum="2012"
           data-maximum="2060"
           data-message-required="Please provide a year."
           data-message="Please provide a <em>valid</em> year in the future."/>
    <div class="error"></div>

After error messages are shown, if the user clicks on the input field again, then the error message
goes away.

#### `data-minimum`

When using the `minimum` validator, you must specify what that minimum should be with `data-minimum`.

#### `data-maximum`

When using the `maximum` validator, you must specify what that maximum should be with `data-maximum`.

#### `data-confirm-target`

When using the `confirm` validator, you must specify what element contains the value to confirm with.
This takes a CSS selector. Typically, you'd use this for situations where you have a password input
element and a password confirmation input element.

#### `data-hint`

This is a convenience property that shows a hint in the input box. While the hint is shown, the input
element will have the class `has-hint`.

#### `data-error-target`

All error messages are displayed in the next `<div class="error"></div>` element. If that isn't where
you want the message to go, then you can set `data-error-target` with a CSS selector of where you want
the message to be displayed.

### TODO

* Use custom validators.
* Accept an alternative error class other than `.error`.
* Create more validators: creditcard, phone, minlength, maxlength, etc.

### Example

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

        <input type="submit" class="submit btn" value="submit" />
    </form>
