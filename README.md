# sexpression v1.0.3

S-expression is a formal language for representing data and code. *Sexpression* project is an implementation of s-expression language parser.

## project specifics

This package contains a version of s-expression parser written in Javascript. Beside ordinary s-expression support, it features peculiar style comments and indent sensitive multi-line strings. In short, we expose all of its features by the following example:

```
///
this is a
multi-line
comment
///

(
    single-atom
    
    (
        /this is a comment/
        this is a nested list
        (
            one more list /also a comment/
        )
    )
    
    "unicode string \u2713"
    
    (more atoms)
    
    """
    indent sensitive
    multi-line string
    """
)
```

## resources

- Test this package in the [online playground](https://tearflake.github.io/sexpression/playground/).
- Read the [Sexpression specification](https://tearflake.github.io/sexpression/docs/sexpression).

## javascript API access

*Sexpression* may expose its functionality through javascript API, both in Node.js and browser.

To access the API from Node.js, install it by: `npm i @tearflake/sexpression`, and include the following line in your code:

```
const Sexpression = require('@tearflake/sexpression');
```

To access the API from browser, clone this repository from GitHub: `git clone https://github.com/tearflake/sexpression`, and include the following line in your code:

```
<script src="./src/sexpression.js"></script>
```

Below, use the package as:

```
var arrOutput = Sexpression.parse("(a b c)");
console.log(JSON.stringify(arrOutput, null, 4));
```
