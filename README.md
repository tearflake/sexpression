# sexpression v2.0.0

S-expression is a formal language for representing data and code. *Sexpression* project is an implementation of S-expression language parser.

## project specifics

This package contains a version of S-expression parser written in Javascript. Beside ordinary S-expression support, it features peculiar style comments and strings. Shortly, we expose all of its main features by the following example:

```
///
sexpression usage examples
                       ///

(
  atom

  (
    /this is a comment/                                    ///
    this is a list                                         this is a   
    (                                                      multi-line
      /one more comment/ one more list /also a comment/    comment
    )                                                             ///   
  )
  
  "this is an unicode string \u2713"
  
  """      
  this is a
  multi-line
  string
         """
  
  (atom1 """    atom2)
         middle
         block
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
<script src="./src/sexpression.js"></script>
```

Below, in both cases, use the package as:

```
var arrOutput = Sexpression.parse('(a b c)');
console.log(JSON.stringify(arrOutput, null, 4));
```
