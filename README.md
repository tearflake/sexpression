# sexpression v0.1.2

## about s-expressions

S-expressions (Symbolic Expressions) are a fundamental concept in computer science and programming language theory. S-expressions are a simple, yet powerful notation for representing nested list data structures and code in a parenthesized form. They are commonly associated with the Lisp family of programming languages, where they serve both as a way to represent code and data uniformly.

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3)`).

Lists can be nested, allowing for the representation of complex hierarchical structures. For example:

`(eq (pow x 2) (mul x x))`

This S-expression represents equality between square and multiplication.

One of the most distinctive features of S-expressions is their uniform representation of code and data. Where S-expressions are supported, code itself is written as S-expression, which means that programs can easily manipulate other programs as data, enabling powerful metaprogramming capabilities. S-expressions are a versatile and uniform notation for representing both code and data in a nested, list-based structure. 

## project specifics

This package contains a modernized version of s-expression parser for Javascript. Beside ordinary s-expression support, it borrows C style comments, Unicode strings, and Python style multi-line strings. S-expressions handled by this package may appear like the following:

```
/*
    Sexpression example
*/

(
    single-atom
    
    (
        these are nested atoms
        (and more nested atoms) // this is a single-line comment
    )
    
    /*
        this is a
        multi-line comment
    */
    
    "unicode string support \u2713"
    
    (more atoms)
    
    """
    indent sensitive
    multi-line string
    support
    """
)
```

## resources

Explore the [online playground](https://tearflake.github.io/sexpression/playground/).

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
var output = Sexpression.parse("(a b c)");
console.log(JSON.stringify(output, null, 4));
```
