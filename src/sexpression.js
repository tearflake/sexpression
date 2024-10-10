// s-expr.mjs
// (c) tearflake, 2024
// MIT License

"use strict"

var Sexpression = (
    function (obj) {
        return {
            parse: obj.parse,
            getErr: obj.getErr,
            normalizeSexpr: obj.normalizeSexpr,
            denormalizeSexpr: obj.denormalizeSexpr,
            denormalizeIndexes: obj.denormalizeIndexes,
            levelOut: obj.levelOut,
            getLevel: obj.getLevel,
            getMmmLevel: obj.getMmmLevel,
            stringify: obj.stringify
        };
    }
) (
    (function () {
        var parse = function (text, normalize, path, p) {
            var ret;
            ret = parseList (text, 0, normalize, path, p);
            if (ret.err === "Expected parenthesis error: '('") {
                ret = parseAtom (text, 0);
                if (ret.val === undefined && !ret.err) {
                    ret = {pos: ret.pos, err: "Expected content error"};
                }
            }

            if (ret.err) {
                return ret;
            }
            else if (ret.pos === text.length) {
                return ret.val;
            }
            else {
                return {err: "Expected end of file error", pos: ret.pos};
            }
        }
        
        var skipWhitespace = function (text, i) {
            do {
                var pos = i;
                while (i < text.length && " \t\n\r".indexOf(text.charAt(i)) > -1) {
                    i++;
                }
                
                if (text.charAt (i) === '/') {
                    var ret = blockChoice(text, i, '/');
                    if (ret.err) {
                        return ret;
                    }
                    else {
                        i = ret.pos;
                    }
                }
            }
            while (i > pos);
            
            return {pos: i};
        }
        
        var blockChoice = function (text, i, bound) {
            var ret, bound;
            var scnt = 1;
            if (!bound) {
                if (text.charAt (i) === '"') {
                    bound = '"';
                }
                else if (text.charAt (i) === '/') {
                    bound = '/';
                }
            }
            
            while (text.charAt (i + scnt) === bound) {
                scnt++;
            }
            
            if (scnt > 1 && scnt % 2 === 1) {
                ret = parseMLBlock (text, bound, i, scnt);
            }
            else {
                ret = parseBlock (text, bound, i);
            }
            
            return ret;
        };
        
        var parseBlock = function (text, bound, pos) {
            var i = pos;
            var lastToken = i;
            do {
                if (text.charAt (i) === "\\") {
                    i += 2;
                }
                else {
                    i++;
                }
            }
            while ((bound + '\n').indexOf (text.charAt (i)) === -1 && i < text.length);
            
            if (text.charAt (i) === bound) {
                i++;
                if (bound === '"') {
                    try {
                        return {pos: i, val: JSON.parse(text.substring (lastToken, i)).replaceAll ("\\", "&bsol;")};
                    }
                    catch {
                        return {err: "Unicode string syntax error", pos: lastToken}
                    }
                }
                else {
                    return {pos: i, val: text.substring (lastToken, i).replaceAll ("\\", "&bsol;")};
                }
            }
            else {
                if (bound === '"') {
                    return {err: "Unterminated string error", pos: lastToken};
                }
                else if (bound === '/') {
                    return {err: "Unterminated comment error", pos: lastToken};
                }
            }
        }
        
        var parseMLBlock = function (text, bound, pos, scnt) {
            var i = pos;
            var lastToken = i;
            
            if (text.charAt (pos + scnt) !== "\n") {
                return {err: "Expected new line error", pos: pos + scnt}
            }
            
            var start1 = i;
            var end1 = start1;
            while (true) {
                if (" \t\r\n".indexOf (text.charAt(start1)) === -1) {
                    end1 = start1;
                }
                
                if ("\n".indexOf (text.charAt(start1)) === -1 && start1 > -1) {
                    start1--;
                }
                else {
                    start1++;
                    break;
                }
            }
            
            i = pos + scnt;
            var allStr = "";
            var terminated = false;
            do {
                i++;
                var start2 = i;
                var end2 = start2;
                while (" \t\r".indexOf (text.charAt(end2)) > -1 && end2 < start2 + end1 - start1) {
                    end2++;
                }
                
                if (end2 - start2 < end1 - start1) {
                    return {err: "Expected whitespace error", pos: end2};
                }
                else if (text.substring(start1, end1) !== text.substring(start2, start2 + end1 - start1)) {
                    return {err: "Whitespace not matched error", pos: start2};
                }
                
                i = end2;
                while ('\n'.indexOf (text.charAt (i)) === -1 && i < text.length) {
                    i++;
                }
                
                if ((text.substr (end2, scnt) === bound.repeat (scnt)) && text.charAt(end2 + scnt) !== bound) {
                    terminated = true;
                    break;
                }

                allStr += text.substring (end2, i) + "\n";
            }
            while (text.charAt (i) === '\n');
            
            if (bound === "/") {
                allStr = bound.repeat (scnt) + '\n' + allStr + bound.repeat (scnt);
            }
            
            if (terminated) {
                return {pos: end2 + scnt, val: allStr.replaceAll ("\\", "&bsol;")};
            }
            else {
                if (bound === '"') {
                    return {err: "Unterminated string error", pos: lastToken};
                }
                else if (bound === '/') {
                    return {err: "Unterminated comment error", pos: lastToken};
                }
            }
        }
        
        var parseAtom = function (text, pos) {
            var i, lastToken, ret, ws;
            
            ws = skipWhitespace (text, pos);
            if (ws.err) {
                return ws;
            }
            
            i = ws.pos;
            lastToken = i;
            var pref = "";
            while(text.charAt (i) === '\\') {
                i++;
                pref += "\\";
                ret = false;
            }

            if ('"/'.indexOf (text.charAt (i)) > -1) {
                ret = blockChoice (text, i)
                if (ret.err) {
                    return ret;
                }
                
                i = ret.pos;
                ret = pref + ret.val;
            }
            else {
                while ('"\\/() \t\n\r'.indexOf (text.charAt (i)) === -1 && text.substr(i, 2) !== "//" && text.substr(i, 2) !== "/*" && i < text.length) {
                    i++;
                }
                
                if (i > lastToken + pref.length) {
                    ret = text.substring (lastToken, i);
                }
            }
            
            if (ret === false) {
                return {err: "Expected atom error", pos: i};
            }

            ws = skipWhitespace (text, i);
            if (ws.err) {
                return ws;
            }
            
            i = ws.pos;

            return {pos: i, val: ret};
        };
        
        var parseList = function (text, pos, normalize, path, p) {
            var lastToken, listType, arr, ws;
            
            arr = [];
            ws = skipWhitespace (text, pos);
            if (ws.err) {
                return ws;
            }
            
            var i = ws.pos;

            if (i === text.length) {
                return {err: "Unexpected end of file", pos: i};
            }
            else if ('('.indexOf (text.charAt (i)) > -1) {
                listType = '('.indexOf (text.charAt (i));
                //arr.push (text.charAt (i));
                i++;
            }
            else {
                return {pos: i, err: "Expected parenthesis error: '('"};
            }
            
            do {
                lastToken = i;
                if (!path || (path && path[p] !== arr.length)) {
                    var ret1 = parseList (text, i, normalize);
                }
                else {
                    var ret1 = parseList (text, i, normalize, path, p + 1);
                }
                
                if (ret1.err && ret1.err === "Expected parenthesis error: '('") {
                    var ret2 = parseAtom (text, i);
                    if (ret2.err) {
                        return ret2;
                    }
                    
                    if (ret2.val || ret2.val === "") {
                        arr.push (ret2.val);
                    }
                    
                    i = ret2.pos;
                }
                else if (ret1.err){
                    return ret1;
                }
                else {
                    arr.push (ret1.val);
                    i = ret1.pos;
                }
                
                if (path && p === path.length - 1 && path[p] === arr.length - 1) {
                    return {err: "Syntax error", pos: skipWhitespace (text, lastToken).pos};
                }
            }
            while (i > lastToken);
            
            if (path && p === path.length - 1 && path[p] > arr.length - 1) {
                return {err: "Too few list elements", pos: skipWhitespace (text, pos).pos};
            }

            if (')'.indexOf (text.charAt (i)) === listType) {
                //arr.push (')'.charAt (listType));
                ws = skipWhitespace (text, i + 1);
                if (ws.err) {
                    return ws;
                }
                
                i = ws.pos;

                if (normalize) {
                    //var lastExpr = ['(', ')'];
                    var lastExpr = [];
                    for (var j = arr.length - 2; j > 0; j--) {
                        lastExpr = ['('.charAt (listType), arr[j], lastExpr, ')'.charAt (listType)];
                    }
                    
                    arr = lastExpr;
                }
                
                return {pos: i, val: arr};
            }
            else if (text.charAt(i) === '\n'){
                return {err: "Unterminated string", pos: lastToken};
            }
            else {
                return {err: "Unterminated parenthesis error, expected '" + ')'.charAt (listType) + "'", pos: i};
            }
        };
        
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
        
        var getMmmLevel = function (arr, vars) {
            if (!Array.isArray (arr)) {
                return getLevel (arr, vars);
            }
            
            var cl = -Infinity;
            var nl = cl;
            for (var i = 0; i < arr.length; i++) {
                var nl = mmm (nl, getMmmLevel (arr[i], vars));
            }
            
            return nl;
        }
        
        function mmm (a1, a2) {
            return a1 > a2 ? a1 : a2;
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

        // start of Node.js support
        
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }
        
        function replaceAll(str, match, replacement){
           return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
        }
        
        if(typeof String.prototype.replaceAll === "undefined") {
            String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
        }
        
        // end of Node.js support
        
        return {
            parse: parse,
            getErr: getErr,
            normalizeSexpr: normalizeSexpr,
            denormalizeSexpr: denormalizeSexpr,
            denormalizeIndexes: denormalizeIndexes,
            levelOut: levelOut,
            getLevel: getLevel,
            getMmmLevel: getMmmLevel,
            stringify: stringify
        }
    }) ()
);

// start of Node.js support

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    module.exports = Sexpression;
}

// end of Node.js support

