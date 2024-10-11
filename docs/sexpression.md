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
- [4. conclusion](#4-conclusion)  

## 1. introduction

S-expressions (Symbolic Expressions) are a fundamental concept in computer science and programming language theory. S-expressions are a simple, yet powerful notation for representing nested list data structures and code in a parenthesized form. They are commonly associated with the Lisp family of programming languages, where they serve both as a way to represent code and data uniformly.

*Sexpression* is a s-expression parsing library. It features peculiar decisions in syntax definition regarding strings and comments.

## 2. informal definition

The general form of an S-expression is either:

- An atom (e.g., `atom`), or
- A list of S-expressions (e.g., `(expr1 expr2 expr3)`).

Lists can be nested, allowing for the representation of complex hierarchical structures. For example:

`(eq (pow x 2) (mul x x))`

This S-expression depicts equality between square and multiplication.

## 3. formal definition

In computer science, syntax of a language is a set of acceptable expressions defined by a grammar. We bring the syntax of *Sexpression* in a relaxed kind of Backus-Naur form syntax rules:

```
        <start> := <whitespace>* <primary> <whitespace>*
                 | ( <whitespace>* <list> <whitespace>* )
                 | ( <whitespace>* )
                 
         <list> := <primary> <whitespace>* <list>
                 | <primary>     
                
      <primary> := <ATOM>
                 | <string>
                 | ( <start> )

   <whitespace> := <TAB>
                 | <SPACE>
                 | <RETURN>
                 | <comment>
              
       <string> := " <CHAR-EXCEPT-NEWLINE>* "
                 | """
                   <CHAR>*
                   """
    
      <comment> := / <CHAR-EXCEPT-NEWLINE>* /
                 | ///
                   <CHAR>*
                   ///
```

The above grammar defines the syntax of *Sexpression*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Sexpression* language.

Some expressions (`<string>` and `<comment>`) may span over multiple lines. In those cases, each line is expected to share the same whitespace prefix.

Comments are not a part of s-expression definition, and they serve as additional utility for annotating code written in *Sexpression*.

## 4. conclusion

One of the most distinctive features of S-expressions is their uniform representation of code and data. In most cases where S-expressions are supported, code itself is written as S-expression, which means that programs can easily manipulate other programs as data, enabling powerful metaprogramming capabilities. S-expressions are a versatile and uniform notation for representing both code and data in a nested, list-based structure. 

