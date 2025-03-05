# s-expr v1.0.12

S-expr is a formal language for representing data and code. *S-expr* project is an implementation of S-expr language parser.

## project specifics

This package contains a version of S-expr parser written in Javascript. Beside ordinary S-expr support, it features peculiar style comments and indent sensitive multi-line strings. Shortly, we expose all of its main features by the following example:

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

- Test this package in the [online playground](https://tearflake.github.io/s-expr/playground/).
- Read the [S-expr specification](https://tearflake.github.io/s-expr/docs/s-expr).

## javascript API access

*S-expr* may bring its functionality through javascript API, both in Node.js and browser.

To access the API from Node.js, install it by: `npm install git+ssh://github.com/tearflake/s-expr`, and include the following line in your code:

```
const S-expr = require('@tearflake/s-expr');
```

To access the API from browser, clone this repository from GitHub by: `git clone https://github.com/tearflake/s-expr`, and include the following line in your code:

```
<script src="path-to-s-expr-package/src/s-expr.js"></script>
```

Below, in both cases, use the package as:

```
var arrOutput = S-expr.parse('(a b c)');
if (!arrOutput.err) {
    console.log(JSON.stringify(arrOutput, null, 4));
}
```
