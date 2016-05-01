'use strict';

/*
 * Notify.js
 * (C) fxsinx
 * (MIT)
 */

;(function (factory) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? 'Notify' : arguments[1];

    if (typeof define === 'function') {
        define(factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        if (typeof window !== 'undefined') window[name] = factory();
    }
})(function () {

    var randomStr = function randomStr() {
        return new Date() * 1 + Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '');
    };

    var validatedExpression = function validatedExpression(path) {
        return path.replace(/(\/+$)/, '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/{2,}/g, '/').replace(/\*{2,}/g, '*').trim();
    };

    var N = function N(expression, listener) {
        var id = arguments.length <= 2 || arguments[2] === undefined ? randomStr() : arguments[2];

        var path = N.getPath(expression);
        this.expression = expression;
        this.listener = listener;
        this.id = id;
        path.items.push(this);
    };

    N.getPath = function (expression) {
        var gen = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        var path = N.notifies.find(function (v) {
            return v.expression === expression;
        });
        if (!path && gen) {
            path = { expression: expression, items: [] };
            path.reg = new RegExp('^' + addSlash(expression, "|?.[]{}\\/^$()").replace(/\*/g, '.+'));
            N.notifies.push(path);
        }
        return path;
    };

    var addSlash = function addSlash(str, arr) {
        [].forEach.call(arr, function (v) {
            str = str.replace(new RegExp('\\' + v, 'g'), '\\' + v);
        });
        return str;
    };

    N.matchPathes = function (expression) {
        expression = validatedExpression(expression);
        return N.notifies.filter(function (v) {
            return v.reg.test(expression);
        });
    };

    N.on = function () {
        var expression = arguments.length <= 0 || arguments[0] === undefined ? '*' : arguments[0];
        var listener = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
        var context = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        return new N(expression, listener.bind(context)).id;
    };

    N.off = function (id) {
        var found = false;
        var i, j;
        for (i = 0; i < N.notifies.length; i++) {
            var v = N.notifies[i];
            for (j = 0; j < v.items.length; j++) {
                if (v.items[j].id === id) {
                    v.items.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (found) {
                if (v.items.length < 1) {
                    N.notifies.splice(i, 1);
                }
                break;
            }
        }
        return found;
    };

    N.trigger = function (expression, target, data) {
        var matches = N.matchPathes(validatedExpression(expression));
        if (expression.indexOf('*') > -1) throw 'Expression should not contain *';
        var dtd = {
            target: target,
            data: data,
            actualExpression: expression
        };
        matches.forEach(function (v) {
            v.items.forEach(function (e) {
                dtd.expression = e.expression;
                e.listener(dtd);
            });
        });
    };

    N.clearAll = function () {
        N.notifies = [];
    };

    N.notifies = [];

    return {
        on: N.on,
        off: N.off,
        trigger: N.trigger,
        clearAll: N.clearAll
    };
});