/* SimpleToast, (c) 2021 Philipp Nies
 * @license MIT
 */

;(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.SimpleToast = factory();
    }

})(this, function () {
    var SimpleToast = {};

    SimpleToast.version = '0.1.0';

    var Settings = SimpleToast.settings = {
        position: 'top-right',
        parent: 'body',
        type: 'light',
        durationInSeconds: 6,
        template: '<div class="toast show mb-2" role="alert" aria-live="assertive" aria-atomic="true">\n' +
            '    <div class="toast-header">\n' +
            '      <strong class="me-auto">{title}</strong>\n' +
            '      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>\n' +
            '    </div>\n' +
            '    <div class="toast-body">\n' +
            '      {message}' +
            '    </div>\n' +
            '  </div>'
    };

    SimpleToast.configure = function (options) {
        for (let key in options) {
            let val = options[key];
            if (val !== undefined && options.hasOwnProperty(key)) {
                Settings[key] = val;
            }
        }
    };

    SimpleToast.show = function (message, title = undefined, type = undefined) {
        var container = SimpleToast.render(),
            template = fillTemplate({
                '{message}': message,
                '{title}': title
            }, type),
            id = 'test123' // TODO: Implement unique id genration generateId();

        container.offsetWidth;

        var wrapper = document.createElement('div');
        wrapper.id = id;
        wrapper.innerHTML = template;

        container.appendChild(wrapper);

        setTimeout(function () {
            SimpleToast.remove(id);
        }, Settings.durationInSeconds * 1000);
    };

    SimpleToast.remove = function (elementId) {
        var container = SimpleToast.render(),
            element = container.querySelector('#' + elementId);

        element.remove();
    };

    SimpleToast.render = function () {
        if (SimpleToast.isRendered()) return document.getElementById('toastContainer');

        var container = document.createElement('div'),
            parent = isDOM(Settings.parent)
                ? Settings.parent
                : document.querySelector(Settings.parent);

        container.id = 'toastContainer';

        css(container, {
            position: 'fixed',
            top: '20px',
            right: '20px'
        });

        parent.appendChild(container);
        return container;
    };

    SimpleToast.isRendered = function () {
        return !!document.getElementById('toastContainer');
    }

    function isDOM (obj) {
        if (typeof HTMLElement === 'object') {
            return obj instanceof HTMLElement
        }
        return (
            obj &&
            typeof obj === 'object' &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === 'string'
        )
    }

    function fillTemplate(vars, type = undefined) {
        var template = Settings.template;

        Object.keys(vars).forEach(function (key) {
            template = template.replace(key, vars[key]);
        });
        if (type) {
            let contrastClass = '';
            switch (type) {
                case 'primary':
                case 'secondary':
                case 'success':
                case 'danger':
                case 'dark':
                    contrastClass = ' text-white';
            }
            template = template.replace('toast-header', 'toast-header bg-' + type + contrastClass);
        }
        return template;
    }
    /*
        var idCreator = function* () {
            let i = 0;
            while (true) yield i++;
        };
        const idsGenerator = idCreator();
        const generateId = () => isdGenerator.next().value;*/

    var css = (function() {
        var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
            cssProps    = {};

        function camelCase(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
                return letter.toUpperCase();
            });
        }

        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = cssPrefixes.length,
                capName = name.charAt(0).toUpperCase() + name.slice(1),
                vendorName;
            while (i--) {
                vendorName = cssPrefixes[i] + capName;
                if (vendorName in style) return vendorName;
            }

            return name;
        }

        function getStyleProp(name) {
            name = camelCase(name);
            return cssProps[name] || (cssProps[name] = getVendorProp(name));
        }

        function applyCss(element, prop, value) {
            prop = getStyleProp(prop);
            element.style[prop] = value;
        }

        return function(element, properties) {
            var args = arguments,
                prop,
                value;

            if (args.length == 2) {
                for (prop in properties) {
                    value = properties[prop];
                    if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
                }
            } else {
                applyCss(element, args[1], args[2]);
            }
        }
    })();

    return SimpleToast;
});
