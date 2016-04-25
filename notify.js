/*
 * Notify.js
 * (C) fxsinx
 * (MIT)
 */

;(function(factory, name = 'Notify') {
    if (typeof define === 'function') {
        define(factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        if (typeof window !== 'undefined')
            window[name] = factory();
    }
})(() => {

    const randomStr = () => {
        return new Date() * 1 + Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '');
    };

    const validatedExpression = (path) => {
        return path.replace(/(\/+$)/, '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/{2,}/g, '/').replace(/\*{2,}/g, '*').trim();
    };

    const N = function(expression, listener, id = randomStr()){
        let path = N.getPath(expression);
        this.expression = expression;
        this.listener = listener;
        this.id = id;
        path.items.push(this);
    };

    N.getPath = (expression, gen = true) => {
        let path = N.notifies.find((v) => {
            return v.expression === expression;
        });
        if(!path && gen){
            path = {expression, items:[]};
            path.reg = new RegExp('^' + addSlash(expression, "|?.[]{}\\/^$()").replace(/\*/g, '.+'));
            N.notifies.push(path);
        }
        return path;
    };

    const addSlash = (str, arr) => {
        ([]).forEach.call(arr, (v) => {
            str = str.replace(new RegExp('\\' + v, 'g'), '\\' + v);
        });
        return str;
    };

    N.matchPathes = (expression) => {
        expression = validatedExpression(expression);
        return N.notifies.filter((v) => {
            return v.reg.test(expression);
        });
    };

    N.on = (expression = '*', listener = ()=>{}) => {
        return new N(expression, listener).id;
    };

    N.off = (id) => {
        let found = false;
        var i,j;
        for (i = 0; i < N.notifies.length; i++) {
            let v = (N.notifies)[i];
            for (j = 0; j < v.items.length; j++) {
                if((v.items)[j].id === id){
                    v.items.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (found) {
                if (((v.items).length < 1)) {
                    N.notifies.splice(i, 1);
                }
                break;
            }
        }
        return found;
    };

    N.trigger = (expression, target, data) => {
        let matches = N.matchPathes(validatedExpression(expression));
        if(expression.indexOf('*')>-1)
            throw 'Expression should not contain *';
        let dtd = {
            target,
            data,
            actualExpression: expression
        };
        matches.forEach(v => {
            v.items.forEach(e => {
                dtd.expression = e.expression;
                e.listener(dtd);
            });
        });
    };

    N.clearAll =  () => {
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
