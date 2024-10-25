# sexpression

> **[about document]**  
> *Sexpression* specification document
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

*Sexpression* is a S-expression parsing library. Other than usual treatment of atoms and lists, it features peculiar decisions in syntax definition regarding strings and comments.

## 2. informal definition

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3)`).

Lists can be nested, allowing for the representation of complex hierarchical structures. For example:

`(eq (mul x x) (pow x 2))`

This S-expression depicts equality between multiplication and square.

## 3. formal definition

In computer science, syntax of a language is a set of acceptable expressions defined by a grammar. We bring the syntax of *Sexpression* in a relaxed kind of Backus-Naur form syntax rules:

```
         <start> := <whitespace>* <element> <whitespace>*

       <element> := <ATOM>
                  | "(" <list> ")"

          <list> := (<whitespace>* <element>)* <whitespace>*

    <whitespace> := <SPACE>
                  | <NEW-LINE>
```

The above grammar defines the syntax of *Sexpression*. To interpret these grammar rules, we use special symbols: `... := ...` for expressing assignment, `<...>` for noting identifiers, `"..."` for terminals, `(...)` for grouping, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions.

## 4. strings and comments

Although a great part of S-expressions power lies in its simplicity, let's introduce a few extensions in a hope of making expressed code more readable, namely: strings and comments.

#### strings

Strings in *Sexpression* may be single-line or multi-line. Single-line strings are atoms enclosed in `"..."` pairs, like in expression `"this is a single-line string"`, and represent Unicode format strings. Multi-line strings are enclosed between an odd number greater than 1 of `"` symbols in the following manner:

```
"""
this is a
multi-line
string
       """
```

Enclosing between a pair of `"""` symbols, multi-line strings are bound in a rectangle between the start of the first `"""` symbol, and the end of the second `"""` symbol. Remember to be careful when modifying contents of multi-line strings to make sure that the end of the second `"""` symbol is always placed horizontally behind the longest line in the string.

Notice that it is also possible to write expressions like:

```
(fst-atom """   trd-atom)
          00001
          00002
          00003
            """
```

where the expression stands for three atoms in a list.

#### comments

Comment expressions are ignored by the system, and they serve as notes to help programmers reading their code. They are parsed just like strings, only using the `/` instead of the `"` symbol. Thus, a single-line comment may be written as `/this is a single-line comment/`, and may appear repeatedly wherever a whitespace is expected. They can also be spanned over multiple lines, and an example of a multi-line comment may be:

```
///
this is a
multi-line
comment
       ///
```

Just like strings, enclosing between a pair of `///` symbols, multi-line comments are bound in a rectangle between the start of the first `///` symbol, and the end of the second `///` symbol. Notice that it is also possible to write expressions like:

```
///
00001 (
00002   fst-atom
00003   snd-atom
00004   trd-atom
00005 )
  ///
```

where the expression stands for three atoms in a list.

## 5. conclusion

We defined *Sexpression* code format and introduced somewhat peculiar way to treat strings and comments. We tried to be consistent with these add-ons to keep acceptable ratio between simplicity and usability. The resulting code format is a bit more complicated than it is in usual Lispy languages, but we hope that the introduced complexity is justified by the data readability expressed this way.

