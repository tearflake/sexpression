# sexpression v1.0.9

S-expression is a formal language for representing data and code. *Sexpression* project is an implementation of S-expression language parser.

## project specifics

This package contains a version of S-expression parser written in Javascript. Beside ordinary S-expression support, it features peculiar style comments and indent sensitive multi-line strings. Shortly, we expose all of its main features by the following example:

```
///
this is a
multi-line
comment
///

(
    atom
    
    (
        /this is a comment/
        this is a list
        (
            /one more comment/ one more list /also a comment/
        )
    )
    
    "this is a unicode string \u2717 \u2714"
    
    (more atoms)
    
    """
    this is a
    multi-line
    string
    """
)
```

## resources

- Test this package in the [online playground](https://tearflake.github.io/sexpression/playground/).
- Read the [Sexpression specification](https://tearflake.github.io/sexpression/docs/sexpression).

## javascript API access

*Sexpression* may bring its functionality through javascript API, both in Node.js and browser.

To access the API from Node.js, install it by: `npm i @tearflake/sexpression`, and include the following line in your code:

```
const Sexpression = require('@tearflake/sexpression');
```

To access the API from browser, clone this repository from GitHub: `git clone https://github.com/tearflake/sexpression`, and include the following line in your code:

```
<script src="path-to-sexpression-package/src/sexpression.js"></script>
```

Below, in both cases, use the package as:

```
var arrOutput = Sexpression.parse('(a b c)');
if (!arrOutput.err) {
    console.log(JSON.stringify(arrOutput, null, 4));
}
```
