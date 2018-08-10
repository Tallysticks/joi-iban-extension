# Joi IBAN Extension

A Joi extension for validation of Bank Account IBAN and BIC (SWIFT code)

### Installation

```
npm install --save joi-iban-extension
```

### Usage

```js
const BaseJoi = require('joi')
const JoiIbanExtension = require('joi-iban-extension')
const Joi = BaseJoi.extend(JoiIbanExtension)

const schema = Joi.string().iban()
const result = await schema.validate('DE89 3704 0044 0532 0130 00')

console.log(result) // DE89370400440532013000
```

### Strict mode

Throws error if the string is not formatted precisely.

```js
const BaseJoi = require('joi')
const JoiIbanExtension = require('joi-iban-extension')
const Joi = BaseJoi.extend(JoiIbanExtension)

const schema = Joi.string().iban({ strict: true })
const result = await schema.validate('DE89 3704 0044 0532 0130 00') // Throws error
```

