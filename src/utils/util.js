/**
 * 查找数组中是否有元素
 */
export function hasParam (value, valueList=[]) {
    let i = 0, { length } = valueList;
    for (; i < length; i++) {
        if (value === valueList[i]) return true;
    }
    return false;
}

/**
 * 查找父组件
 */
export function findComponentParents (context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}


/**
 * 查找子组件
 */
export function findComponentChildren (context, componentName, ignoreComponentNames = []) {
    if ( typeOf(ignoreComponentNames) != 'array' ) {
        ignoreComponentNames = [ignoreComponentNames]
    }
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        if (ignoreComponentNames.indexOf(child.$options.name) < 0) {
            const _f = findComponentChildren(child, componentName);
            return components.concat(_f)
        } else {
            return components
        }
    }, [])
}

/**
 * 
 * @param {*} context 
 * @param {*} componentName 
 * @param {*} excepteMe 
 */
export function findComponentBrothers (context, componentName, excepteMe = true) {
    let res = context.$parent.$children.filter(item => {
        return item.$options.name = componentName
    });
    let index = res.findIndex(item => item._uid === context._uid);
    if (excepteMe) {
        res.splice(index, 1)
    }
    return res;
}

/**
 * deepcopy
 * @param {*} data 
 */
export function deepCopy (data) {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}


/**
 * scrollTop animation
 * @param {*} el 
 * @param {*} from 
 * @param {*} to 
 * @param {*} duration 
 * @param {*} endCallback 
 */
export function scrollTop(el, from = 0, to, duration = 500, endCallback) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) {
            endCallback && endCallback();
            return;
        }

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

/**
 * 
 * @param {*} str 
 */
export function firstUpperCase(str) {
    return str.toString()[0].toUpperCase() + str.toString().slice(1);
}


const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 * 
 * @param {dom} element 
 * @param {*} styleName 
 */
export function getStyle (element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch(e) {
        return element.style[styleName];
    }
}

/**
 * 事件绑定
 */
export const on = (function () {
    if (document.addEventListener) {
        return function (ele, type, fn) {
            ele.addEventListener(type, fn, false)
        }
    } else {
        return function (ele, type, fn) {
            ele.attachEvent(`on${type}`, fn)
        }
    }
})();


/**
 * 解除事件绑定
 */
export const off = (function (){
    if (document.addEventListener) {
        return function (ele, type, fn) {
            ele.removeEventListener(type, fn, false)
        }
    } else {
        return function (ele, type, fn) {
            ele.detachEvent(`on${type}`, fn)
        }
    }
})()

function typeOf (obj) {
    const toString  = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Object]': 'object',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        // es6引入的数据类型暂时未添加
        // '[object Set]': 'set',
        // '[object Symbol]': 'symbol',
    };
    return map[toString.call(obj)];
}



let cached;
export function getScrollBarSize (fresh) {
    // if (isServer) return 0;
    if (fresh || cached === undefined) {
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    }
    return cached;
}