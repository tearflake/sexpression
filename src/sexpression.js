// sexpression.js
// (c) tearflake, 2024
// MIT License

"use strict"

var Sexpression = (
    function (obj) {
        return {
            parse: obj.parse,
            getNodePos: obj.getNodePos,
            normalizeSexpr: obj.normalizeSexpr,
            denormalizeSexpr: obj.denormalizeSexpr,
            denormalizeIndexes: obj.denormalizeIndexes,
            levelOut: obj.levelOut,
            getLevel: obj.getLevel,
            getMaxLevel: obj.getMaxLevel,
            stringify: obj.stringify
        };
    }
) (
    (function () {
        var err = [];
        err[0] = "'\\t' character not allowed error";
        err[1] = "'\\u000B' character not allowed error";
        err[2] = "Expected end of S-expression error";
        err[3] = "Unexpected end of S-expression error";
        err[4] = "Unicode string syntax error";
        err[5] = "Unexpected end of line error";
        err[6] = "Block not terminated error";
        err[7] = "Unresolved block error";
        err[8] = "Expected ' ' error";
        
        var parse = function (text) {
            var m = createMatrix (text);
            var p = parseMatrix (m);
            return p;
        }
        
        var createMatrix = function (text) {
            var m, i;
            
            text = text.replaceAll ("\r\n", "\n");
            m = text.split ("\n");
            for (i = 0; i < m.length; i++) {
                m[i] = m[i].split ("");
            }
            
            return m;
        }
        
        var parseMatrix = function (m) {
            var x, y, pos, i, tmpPos, stack, currChar, currAtom, val;
            
            y = 0;
            x = 1;
            pos = [0, 0];
            //pos = skipWhitespace (m, pos[y], pos[x]);
            stack = [];
            while (pos[y] < m.length) {
                currChar = m[pos[y]][pos[x]];
                if (currChar === "\t") {
                    return {err: err[0], pos: {y: pos[y], x: pos[x]}};
                }
                else if (currChar === "\u000B") {
                    return {err: err[1], pos: {y: pos[y], x: pos[x]}};
                }
                
                if (currChar === '/' || currChar === ' ' || currChar === undefined) {
                    tmpPos = skipWhitespace (m, pos[y], pos[x]);
                    if (tmpPos.err) {
                        return tmpPos;
                    }
                    
                    if (m[tmpPos[y]] === undefined) {
                        tmpPos[y] = m.length - 1;
                        tmpPos[x] = 0;
                        while (m[tmpPos[y]] && m[tmpPos[y]][tmpPos[x]] !== undefined) {
                            tmpPos[x]++;
                        }
                        
                        return {err: err[3], pos: {y: tmpPos[y], x: tmpPos[x]}};
                    }
                    
                    pos = tmpPos;
                }
                else if (currChar === '(') {
                    stack.push ([]);
                    pos[x]++;
                }
                else if (currChar === ')') {
                    pos[x]++;
                    if (stack.length > 1) {
                        stack[stack.length - 2].push (stack[stack.length - 1]);
                        stack.pop ();
                    }
                    else {
                        val = stack[stack.length - 1];
                        break;
                    }
                }
                else if ('"'.indexOf (currChar) > -1) {
                    currAtom = getBlock (m, pos, currChar);
                    if (currAtom.err) {
                        return currAtom;
                    }
                    else {
                        pos[y] = currAtom.pos[y];
                        pos[x] = currAtom.pos[x];
                        if (stack.length > 0) {
                            stack[stack.length - 1].push (currAtom.val);
                            if (m[pos[y]][pos[x]] === undefined) {
                                pos[y]++;
                                pos[x] = 0;
                            }
                        }
                        else {
                            val = currAtom.val;
                            break;
                        }
                    }
                }
                else if (' ()"/'.indexOf (currChar) === -1 && currChar !== undefined) {
                    currAtom = "";
                    while (' ()"/'.indexOf (currChar) === -1 && currChar !== undefined) {
                        currAtom += currChar;
                        pos[x]++;
                        currChar = m[pos[y]][pos[x]];
                    }

                    if (stack.length > 0) {
                        stack[stack.length - 1].push (currAtom);
                    }
                    else {
                        val = currAtom;
                        break;
                    }
                }
            }
            
            pos = skipWhitespace (m, pos[y], pos[x]);
            if (pos.err) {
                return pos;
            }
            
            if (pos[y] < m.length && m[pos[y]][pos[x]] !== undefined) {
                return {err: err[2], pos: {y: pos[y], x: pos[x]}};
            }
            else {
                return val;
            }
        }
        
        var skipWhitespace = function (m, row, col) {
            var pos, x, y, i, j, k, currAtom;
            
            y = 0;
            x = 1;
            pos = [row, col];
            while (pos[y] < m.length) {
                while (m[pos[y]][pos[x]] === " ") {
                    pos[x]++;
                    if (m[pos[y]][pos[x]] === undefined) {
                        break;
                    }
                }
                
                if (m[pos[y]][pos[x]] === '/') {
                    currAtom = getBlock (m, pos, '/');
                    if (currAtom.err) {
                        return currAtom;
                    }
                    else {
                        pos[y] = currAtom.pos[y];
                        pos[x] = currAtom.pos[x];
                    }
                }
                else if (m[pos[y]][pos[x]] !== undefined) {
                    break;
                }
                else {
                    pos[x] = 0;
                    pos[y]++;
                }
            }
            
            return [pos[y], pos[x]];
        }
        
        var getBlock = function (m, pos, bound) {
            var i, j, ws, numBounds1 = 0, numBounds2, x = 1, y = 0, currAtom = "", val;
            var pos0 = [pos[y], pos[x]];
            var pos1 = [pos[y], pos[x]];
            if ('"/'.indexOf (bound) > -1) {
                i = pos1[x];
                numBounds1 = 0;
                while (m[pos1[y]][i] === bound) {
                    i++;
                    numBounds1++;
                }
                
                if (numBounds1 === 1 || numBounds1 % 2 === 0) {
                    currAtom = bound;
                    pos1[x]++;
                    while (m[pos1[y]][pos1[x]] !== undefined && m[pos1[y]][pos1[x]] !== bound) {
                        currAtom += m[pos1[y]][pos1[x]];
                        pos1[x]++;
                        if (m[pos1[y]][pos1[x]] === '\\') {
                            currAtom += m[pos1[y]][pos1[x]];
                            pos1[x]++;
                            currAtom += m[pos1[y]][pos1[x]];
                            pos1[x]++;
                        }
                    }
                    
                    if (m[pos1[y]][pos1[x]] === bound) {
                        currAtom += m[pos1[y]][pos1[x]];
                        if (bound === '"') {
                            try {
                                val = JSON.parse(currAtom).replaceAll ("\\", "&bsol;");
                            }
                            catch {
                                return {err: err[4], pos: {y: pos1[y], x: pos1[x]}};
                            }
                        }
                        else {
                            val = currAtom;
                        }
                        
                        return {pos: [pos1[y], pos1[x] + 1], val: val};
                    }
                    else {
                        return {err: err[5], pos: {y: pos1[y], x: pos1[x]}};
                    }
                }
                else {
                    ws = 0;
                    while (m[pos1[y]][ws] === " ") {
                        ws++;
                    }
                    
                    pos1[y]++;
                    pos1[x] = ws;
                    while (pos1[y] < m.length) {
                        for (i = 0; i < ws; i++) {
                            if (m[pos1[y]][i] !== " " && m[pos1[y]][i] !== undefined) {
                                return {err: err[8], pos: {y: pos1[y], x: i}};
                            }
                        }
                        
                        if (m[pos1[y]][ws] === bound) {
                            i = ws;
                            numBounds2 = 0;
                            while (m[pos1[y]][i] === bound) {
                                i++;
                                numBounds2++;
                            }
                            
                            if (numBounds1 === numBounds2) {
                                break;
                            }
                        }
                        
                        pos1[y]++;
                    }
                    
                    if (pos1[y] < m.length) {
                        return {pos: [pos1[y], pos1[x] + numBounds2], val: extractBlock (m, {begin: [pos0[y], ws], end: [pos1[y], ws + numBounds2]})};
                    }
                    else {
                        return {err: err[6], pos: {y: pos[y], x: pos[x]}};
                    }
                }
            }
        }
        
        var extractBlock = function (m, bounds) {
            var i, j, x = 1, y = 0, currChar, val = "";
            var pos = bounds.begin;
            for (i = pos[y] + 1; i < bounds.end[y]; i++) {
                for (j = pos[x]; m[i][j] !== undefined; j++) {
                    val += m[i][j];
                }
                
                val += "\n";
            }
            
            return val;
        }
        
        var getErr = function (text, path) {
            if (path.length === 0) {
                return {err: "Top node error", pos: skipWhitespace(text, 0).pos};
            }
            else {
                return parse (text, undefined, path, 0);
            }
        };
        
        var normalizeSexpr = function (expr) {
            if (Array.isArray (expr)) {
                //var lastExpr = ['(', ')'];
                var lastExpr = [];
                for (var i = expr.length - 1; i >= 0; i--) {
                    lastExpr = [normalizeSexpr (expr[i]), lastExpr];
                }
                
                return lastExpr;
            }
            else {
                return expr;
            }
        };
        
        var denormalizeSexpr = function (expr) {
            if (!Array.isArray(expr)) {
                return expr;
            }
            else {
                var dnm = [];
                while (expr.length === 2) {
                    dnm.push (denormalizeSexpr (expr[0]))
                    expr = expr[1];
                }
                
                return dnm;
            }
        }
        
        var denormalizeIndexes = function (nm) {
            var dnm = [];
            var idx = 0;
            for (var i = 0; i < nm.length; i++) {
                if (nm[i] === 0) {
                    dnm.push (idx);
                    idx = 0;
                }
                else {
                    idx++;
                }
            }
            
            if (idx > 0) {
                dnm.push (idx);
            }
            
            return dnm;
        };

        var levelOut = function (arr, vars, level) {
            if (vars === undefined) vars  = [];
            if (!Array.isArray (arr)) {
                if (arr !== "ATOMIC" && arr !== "COMPOUND" && arr !== "ANY" && arr !== undefined && /*arr !== "(" && arr !== ")" &&*/ vars.indexOf (arr) === -1){
                    for (var curLevelL = 0; curLevelL < arr.length && arr.charAt(curLevelL) === "\\"; curLevelL++);
                    for (var curLevelR = 0; arr.length - curLevelR - 1 > 0 && arr.charAt(arr.length - curLevelR - 1) === "\\"; curLevelR++);
                    
                    var lft = curLevelL;
                    var rgt = 0;
                    for (var i = 0; i < level; i++) {
                        if (lft > 0) {
                            lft--;
                        }
                        else {
                            rgt++;
                        }
                    }

                    var strMid = arr.substring (curLevelL, arr.length);
                    var strLft = lft > 0 ? "\\".repeat (lft): "";
                    var strRgt = rgt > 0 ? "\\".repeat (rgt): "";
                    
                    return strLft + strMid + strRgt;
                }
                else {
                    return arr;
                }
            }
            
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
                arr1[i] = levelOut (arr[i], vars, level);
            }
            
            return arr1;
        }
        
        var getLevel = function (str, vars) {
            if (vars === undefined) vars  = [];
            if (str !== "ATOMIC" && str !== "COMPOUND" && str !== "ANY" && str !== undefined && /*arr !== "(" && arr !== ")" &&*/ vars.indexOf (str) === -1){
                for (var curLevelL = 0; curLevelL < str.length && str.charAt(curLevelL) === "\\"; curLevelL++);
                for (var curLevelR = 0; str.length - curLevelR - 1 > 0 && str.charAt(str.length - curLevelR - 1) === "\\"; curLevelR++);
                
                return curLevelL > 0 ? -curLevelL : curLevelR;
            }
            else {
                return -Infinity ;
            }
        }
        
        var getMaxLevel = function (arr, vars) {
            if (!Array.isArray (arr)) {
                return getLevel (arr, vars);
            }
            
            var cl = -Infinity;
            var nl = cl;
            for (var i = 0; i < arr.length; i++) {
                var nl = Math.max (nl, getMaxLevel (arr[i], vars));
            }
            
            return nl;
        }
        
        function stringify (node, indent) {
            if (indent === undefined) {
                indent = ""
            }
            
            if (typeof node === "string") {
                return quoteIfNecessary (node) + "\n";
            }
            
            var str = ""
            str += indent + "(" + "\n";
            
            for (var i = 0; i < node.length; i++) {
                if (Array.isArray (node[i])) {
                    str += stringify (node[i], indent + "    ");
                }
                else {
                    var part
                    if (node[i] === undefined) {
                        part = "UNDEFINED";
                    }
                    else if (node[i] === true) {
                        part = "TRUE";
                    }
                    else if (node [i] === null) {
                        part = "NIL";
                    }
                    else {
                        part = quoteIfNecessary (node[i]);
                    }
                    
                    str += indent + "    " + part + "\n";
                }
            }
            
            str += indent + ")" + "\n";

            return str;
        }
        
        function quoteIfNecessary (str) {
            var quoted = false;
            for (var i = 0; i < str.length; i++) {
                if ('() \t\n\r'.indexOf (str.charAt (i)) > -1) {
                    quoted = true;
                    break;
                }
            }
            
            for (var i = 0; i < str.length && str.charAt(i) === "\\"; i++);
            for (var j = i; j < str.length && str.charAt(j) !== "\\"; j++);
            
            if (quoted || str.indexOf ("&bsol;") > -1) {
                return str.substring(0, i) + JSON.stringify(str.substring(i, j).replaceAll ("&bsol;", "\\")) + str.substring(j, str.length);
            }
            else {
                return str;
            }
        }

        return {
            parse: parse,
            getNodePos: getErr,
            normalizeSexpr: normalizeSexpr,
            denormalizeSexpr: denormalizeSexpr,
            denormalizeIndexes: denormalizeIndexes,
            levelOut: levelOut,
            getLevel: getLevel,
            getMaxLevel: getMaxLevel,
            stringify: stringify
        }
    }) ()
);

// begin of Node.js support

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    module.exports = Sexpression;
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }
}

// end of Node.js support

