# s-expression

> **[about document]**  
> *S-expression* specification document
>
> **[intended audience]**  
> beginners in programming

## table of contents

- [1. introduction](#1-introduction)  
- [2. informal definition](#2-informal-definition)  
- [3. formal definition](#3-formal-definition)  
- [4. strings and comments](#4-strings-and-comments)
- [5. conclusion](#5-conclusion)  

## 1. introduction

S-expressions (Symbolic Expressions) are a fundamental concept in computer science and programming language theory. S-expressions are a simple, yet powerful notation for representing nested list data structures and code in a parenthesized form. They are commonly associated with the Lisp family of programming languages, where they serve both as a way to represent code and data uniformly.

*S-expression* is a S-expression parsing library. Other than usual treatment of atoms and lists, it features peculiar decisions in syntax definition regarding strings and comments.

## 2. informal definition

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3)`).

Lists can be nested, allowing for the representation of complex hierarchical structures. For example: `(eq (mul x x) (pow x 2))` expression depicts equality between multiplication and square.

## 3. formal definition

In computer science, syntax of a language is a set of acceptable expressions defined by a grammar. We bring the syntax of *S-expression* in a relaxed kind of Backus-Naur form syntax rules:

```
         <start> := <whitespace>* <element> <whitespace>*

       <element> := <ATOM>
                  | "(" <list> ")"

          <list> := (<whitespace>* <element>)* <whitespace>*

    <whitespace> := <SPACE>
                  | <NEW-LINE>
```

The above grammar defines the syntax of *S-expression*. To interpret these grammar rules, we use special symbols: `... := ...` for expressing assignment, `<...>` for noting identifiers, `"..."` for terminals, `(...)` for grouping, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions.

## 4. strings and comments

Although a great part of S-expressions power lies in its simplicity, let's introduce a couple of extensions in a hope of making expressed code more readable, namely: strings and comments.

#### strings

Strings in *S-expression* may be single-line or multi-line. Single-line strings are atoms enclosed within `"..."`, like in expression `"this is a single-line string"`, and represent Unicode format strings. Multi-line strings are enclosed between an odd number greater than 1 of `"` symbols in the following manner:

```
"""
this is a
multi-line
string
"""
```

Multi-line strings are indent sensitive.

#### comments

Comment expressions are ignored by the system, and they serve as notes to help programmers reading their code. They are parsed just like strings, only using the `/` instead of the `"` symbol. Thus, a single-line comment may be written as `/this is a single-line comment/`, and may appear repeatedly wherever a whitespace is expected. They can also be spanned over multiple lines, and an example of a multi-line comment may be:

```
///
this is a
multi-line
comment
///
```

Multi-line comments are also indent sensitive, just like strings.

## 5. conclusion

We defined *S-expression* code format and introduced a consistent way to treat strings and comments. Considering comments are analogous to strings, one may find comments a bit restrictive regarding their position and context, but we find the presented solution compact and acceptable.

