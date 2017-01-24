'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  function resolve() {
    document.body.removeAttribute('unresolved');
  }
  if (window.WebComponents) {
    addEventListener('WebComponentsReady', resolve);
  } else {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      resolve();
    } else {
      addEventListener('DOMContentLoaded', resolve);
    }
  }
})();window.Polymer = {
  Settings: (function () {
    var settings = window.Polymer || {};
    if (!settings.noUrlSettings) {
      var parts = location.search.slice(1).split('&');
      for (var i = 0, o; i < parts.length && (o = parts[i]); i++) {
        o = o.split('=');
        o[0] && (settings[o[0]] = o[1] || true);
      }
    }
    settings.wantShadow = settings.dom === 'shadow';
    settings.hasShadow = Boolean(Element.prototype.createShadowRoot);
    settings.nativeShadow = settings.hasShadow && !window.ShadowDOMPolyfill;
    settings.useShadow = settings.wantShadow && settings.hasShadow;
    settings.hasNativeImports = Boolean('import' in document.createElement('link'));
    settings.useNativeImports = settings.hasNativeImports;
    settings.useNativeCustomElements = !window.CustomElements || window.CustomElements.useNative;
    settings.useNativeShadow = settings.useShadow && settings.nativeShadow;
    settings.usePolyfillProto = !settings.useNativeCustomElements && !Object.__proto__;
    settings.hasNativeCSSProperties = !navigator.userAgent.match('AppleWebKit/601') && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)');
    settings.useNativeCSSProperties = settings.hasNativeCSSProperties && settings.lazyRegister && settings.useNativeCSSProperties;
    settings.isIE = navigator.userAgent.match('Trident');
    return settings;
  })()
};(function () {
  var userPolymer = window.Polymer;
  window.Polymer = function (prototype) {
    if (typeof prototype === 'function') {
      prototype = prototype.prototype;
    }
    if (!prototype) {
      prototype = {};
    }
    var factory = desugar(prototype);
    prototype = factory.prototype;
    var options = { prototype: prototype };
    if (prototype['extends']) {
      options['extends'] = prototype['extends'];
    }
    Polymer.telemetry._registrate(prototype);
    document.registerElement(prototype.is, options);
    return factory;
  };
  var desugar = function desugar(prototype) {
    var base = Polymer.Base;
    if (prototype['extends']) {
      base = Polymer.Base._getExtendedPrototype(prototype['extends']);
    }
    prototype = Polymer.Base.chainObject(prototype, base);
    prototype.registerCallback();
    return prototype.constructor;
  };
  if (userPolymer) {
    for (var i in userPolymer) {
      Polymer[i] = userPolymer[i];
    }
  }
  Polymer.Class = desugar;
})();
Polymer.telemetry = {
  registrations: [],
  _regLog: function _regLog(prototype) {
    console.log('[' + prototype.is + ']: registered');
  },
  _registrate: function _registrate(prototype) {
    this.registrations.push(prototype);
    Polymer.log && this._regLog(prototype);
  },
  dumpRegistrations: function dumpRegistrations() {
    this.registrations.forEach(this._regLog);
  }
};Object.defineProperty(window, 'currentImport', {
  enumerable: true,
  configurable: true,
  get: function get() {
    return (document._currentScript || document.currentScript || {}).ownerDocument;
  }
});Polymer.RenderStatus = {
  _ready: false,
  _callbacks: [],
  whenReady: function whenReady(cb) {
    if (this._ready) {
      cb();
    } else {
      this._callbacks.push(cb);
    }
  },
  _makeReady: function _makeReady() {
    this._ready = true;
    for (var i = 0; i < this._callbacks.length; i++) {
      this._callbacks[i]();
    }
    this._callbacks = [];
  },
  _catchFirstRender: function _catchFirstRender() {
    requestAnimationFrame(function () {
      Polymer.RenderStatus._makeReady();
    });
  },
  _afterNextRenderQueue: [],
  _waitingNextRender: false,
  afterNextRender: function afterNextRender(element, fn, args) {
    this._watchNextRender();
    this._afterNextRenderQueue.push([element, fn, args]);
  },
  hasRendered: function hasRendered() {
    return this._ready;
  },
  _watchNextRender: function _watchNextRender() {
    if (!this._waitingNextRender) {
      this._waitingNextRender = true;
      var fn = function fn() {
        Polymer.RenderStatus._flushNextRender();
      };
      if (!this._ready) {
        this.whenReady(fn);
      } else {
        requestAnimationFrame(fn);
      }
    }
  },
  _flushNextRender: function _flushNextRender() {
    var self = this;
    setTimeout(function () {
      self._flushRenderCallbacks(self._afterNextRenderQueue);
      self._afterNextRenderQueue = [];
      self._waitingNextRender = false;
    });
  },
  _flushRenderCallbacks: function _flushRenderCallbacks(callbacks) {
    for (var i = 0, h; i < callbacks.length; i++) {
      h = callbacks[i];
      h[1].apply(h[0], h[2] || Polymer.nar);
    }
  }
};
if (window.HTMLImports) {
  HTMLImports.whenReady(function () {
    Polymer.RenderStatus._catchFirstRender();
  });
} else {
  Polymer.RenderStatus._catchFirstRender();
}
Polymer.ImportStatus = Polymer.RenderStatus;
Polymer.ImportStatus.whenLoaded = Polymer.ImportStatus.whenReady;(function () {
  'use strict';
  var settings = Polymer.Settings;
  Polymer.Base = {
    __isPolymerInstance__: true,
    _addFeature: function _addFeature(feature) {
      this.extend(this, feature);
    },
    registerCallback: function registerCallback() {
      if (settings.lazyRegister === 'max') {
        if (this.beforeRegister) {
          this.beforeRegister();
        }
      } else {
        this._desugarBehaviors();
        this._doBehavior('beforeRegister');
      }
      this._registerFeatures();
      if (!settings.lazyRegister) {
        this.ensureRegisterFinished();
      }
    },
    createdCallback: function createdCallback() {
      if (!this.__hasRegisterFinished) {
        this._ensureRegisterFinished(this.__proto__);
      }
      Polymer.telemetry.instanceCount++;
      this.root = this;
      this._doBehavior('created');
      this._initFeatures();
    },
    ensureRegisterFinished: function ensureRegisterFinished() {
      this._ensureRegisterFinished(this);
    },
    _ensureRegisterFinished: function _ensureRegisterFinished(proto) {
      if (proto.__hasRegisterFinished !== proto.is || !proto.is) {
        if (settings.lazyRegister === 'max') {
          proto._desugarBehaviors();
          proto._doBehaviorOnly('beforeRegister');
        }
        proto.__hasRegisterFinished = proto.is;
        if (proto._finishRegisterFeatures) {
          proto._finishRegisterFeatures();
        }
        proto._doBehavior('registered');
        if (settings.usePolyfillProto && proto !== this) {
          proto.extend(this, proto);
        }
      }
    },
    attachedCallback: function attachedCallback() {
      var self = this;
      Polymer.RenderStatus.whenReady(function () {
        self.isAttached = true;
        self._doBehavior('attached');
      });
    },
    detachedCallback: function detachedCallback() {
      var self = this;
      Polymer.RenderStatus.whenReady(function () {
        self.isAttached = false;
        self._doBehavior('detached');
      });
    },
    attributeChangedCallback: function attributeChangedCallback(name, oldValue, newValue) {
      this._attributeChangedImpl(name);
      this._doBehavior('attributeChanged', [name, oldValue, newValue]);
    },
    _attributeChangedImpl: function _attributeChangedImpl(name) {
      this._setAttributeToProperty(this, name);
    },
    extend: function extend(target, source) {
      if (target && source) {
        var n$ = Object.getOwnPropertyNames(source);
        for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
          this.copyOwnProperty(n, source, target);
        }
      }
      return target || source;
    },
    mixin: function mixin(target, source) {
      for (var i in source) {
        target[i] = source[i];
      }
      return target;
    },
    copyOwnProperty: function copyOwnProperty(name, source, target) {
      var pd = Object.getOwnPropertyDescriptor(source, name);
      if (pd) {
        Object.defineProperty(target, name, pd);
      }
    },
    _logger: function _logger(level, args) {
      if (args.length === 1 && Array.isArray(args[0])) {
        args = args[0];
      }
      switch (level) {
        case 'log':
        case 'warn':
        case 'error':
          console[level].apply(console, args);
          break;
      }
    },
    _log: function _log() {
      var args = Array.prototype.slice.call(arguments, 0);
      this._logger('log', args);
    },
    _warn: function _warn() {
      var args = Array.prototype.slice.call(arguments, 0);
      this._logger('warn', args);
    },
    _error: function _error() {
      var args = Array.prototype.slice.call(arguments, 0);
      this._logger('error', args);
    },
    _logf: function _logf() {
      return this._logPrefix.concat(this.is).concat(Array.prototype.slice.call(arguments, 0));
    }
  };
  Polymer.Base._logPrefix = (function () {
    var color = window.chrome && !/edge/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent);
    return color ? ['%c[%s::%s]:', 'font-weight: bold; background-color:#EEEE00;'] : ['[%s::%s]:'];
  })();
  Polymer.Base.chainObject = function (object, inherited) {
    if (object && inherited && object !== inherited) {
      if (!Object.__proto__) {
        object = Polymer.Base.extend(Object.create(inherited), object);
      }
      object.__proto__ = inherited;
    }
    return object;
  };
  Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype);
  if (window.CustomElements) {
    Polymer['instanceof'] = CustomElements['instanceof'];
  } else {
    Polymer['instanceof'] = function (obj, ctor) {
      return obj instanceof ctor;
    };
  }
  Polymer.isInstance = function (obj) {
    return Boolean(obj && obj.__isPolymerInstance__);
  };
  Polymer.telemetry.instanceCount = 0;
})();(function () {
  var modules = {};
  var lcModules = {};
  var findModule = function findModule(id) {
    return modules[id] || lcModules[id.toLowerCase()];
  };
  var DomModule = function DomModule() {
    return document.createElement('dom-module');
  };
  DomModule.prototype = Object.create(HTMLElement.prototype);
  Polymer.Base.extend(DomModule.prototype, {
    constructor: DomModule,
    createdCallback: function createdCallback() {
      this.register();
    },
    register: function register(id) {
      id = id || this.id || this.getAttribute('name') || this.getAttribute('is');
      if (id) {
        this.id = id;
        modules[id] = this;
        lcModules[id.toLowerCase()] = this;
      }
    },
    'import': function _import(id, selector) {
      if (id) {
        var m = findModule(id);
        if (!m) {
          forceDomModulesUpgrade();
          m = findModule(id);
        }
        if (m && selector) {
          m = m.querySelector(selector);
        }
        return m;
      }
    }
  });
  var cePolyfill = window.CustomElements && !CustomElements.useNative;
  document.registerElement('dom-module', DomModule);
  function forceDomModulesUpgrade() {
    if (cePolyfill) {
      var script = document._currentScript || document.currentScript;
      var doc = script && script.ownerDocument || document;
      var modules = doc.querySelectorAll('dom-module');
      for (var i = modules.length - 1, m; i >= 0 && (m = modules[i]); i--) {
        if (m.__upgraded__) {
          return;
        } else {
          CustomElements.upgrade(m);
        }
      }
    }
  }
})();Polymer.Base._addFeature({
  _prepIs: function _prepIs() {
    if (!this.is) {
      var module = (document._currentScript || document.currentScript).parentNode;
      if (module.localName === 'dom-module') {
        var id = module.id || module.getAttribute('name') || module.getAttribute('is');
        this.is = id;
      }
    }
    if (this.is) {
      this.is = this.is.toLowerCase();
    }
  }
});Polymer.Base._addFeature({
  behaviors: [],
  _desugarBehaviors: function _desugarBehaviors() {
    if (this.behaviors.length) {
      this.behaviors = this._desugarSomeBehaviors(this.behaviors);
    }
  },
  _desugarSomeBehaviors: function _desugarSomeBehaviors(behaviors) {
    var behaviorSet = [];
    behaviors = this._flattenBehaviorsList(behaviors);
    for (var i = behaviors.length - 1; i >= 0; i--) {
      var b = behaviors[i];
      if (behaviorSet.indexOf(b) === -1) {
        this._mixinBehavior(b);
        behaviorSet.unshift(b);
      }
    }
    return behaviorSet;
  },
  _flattenBehaviorsList: function _flattenBehaviorsList(behaviors) {
    var flat = [];
    for (var i = 0; i < behaviors.length; i++) {
      var b = behaviors[i];
      if (b instanceof Array) {
        flat = flat.concat(this._flattenBehaviorsList(b));
      } else if (b) {
        flat.push(b);
      } else {
        this._warn(this._logf('_flattenBehaviorsList', 'behavior is null, check for missing or 404 import'));
      }
    }
    return flat;
  },
  _mixinBehavior: function _mixinBehavior(b) {
    var n$ = Object.getOwnPropertyNames(b);
    for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
      if (!Polymer.Base._behaviorProperties[n] && !this.hasOwnProperty(n)) {
        this.copyOwnProperty(n, b, this);
      }
    }
  },
  _prepBehaviors: function _prepBehaviors() {
    this._prepFlattenedBehaviors(this.behaviors);
  },
  _prepFlattenedBehaviors: function _prepFlattenedBehaviors(behaviors) {
    for (var i = 0, l = behaviors.length; i < l; i++) {
      this._prepBehavior(behaviors[i]);
    }
    this._prepBehavior(this);
  },
  _doBehavior: function _doBehavior(name, args) {
    for (var i = 0; i < this.behaviors.length; i++) {
      this._invokeBehavior(this.behaviors[i], name, args);
    }
    this._invokeBehavior(this, name, args);
  },
  _doBehaviorOnly: function _doBehaviorOnly(name, args) {
    for (var i = 0; i < this.behaviors.length; i++) {
      this._invokeBehavior(this.behaviors[i], name, args);
    }
  },
  _invokeBehavior: function _invokeBehavior(b, name, args) {
    var fn = b[name];
    if (fn) {
      fn.apply(this, args || Polymer.nar);
    }
  },
  _marshalBehaviors: function _marshalBehaviors() {
    for (var i = 0; i < this.behaviors.length; i++) {
      this._marshalBehavior(this.behaviors[i]);
    }
    this._marshalBehavior(this);
  }
});
Polymer.Base._behaviorProperties = {
  hostAttributes: true,
  beforeRegister: true,
  registered: true,
  properties: true,
  observers: true,
  listeners: true,
  created: true,
  attached: true,
  detached: true,
  attributeChanged: true,
  ready: true
};Polymer.Base._addFeature({
  _getExtendedPrototype: function _getExtendedPrototype(tag) {
    return this._getExtendedNativePrototype(tag);
  },
  _nativePrototypes: {},
  _getExtendedNativePrototype: function _getExtendedNativePrototype(tag) {
    var p = this._nativePrototypes[tag];
    if (!p) {
      var np = this.getNativePrototype(tag);
      p = this.extend(Object.create(np), Polymer.Base);
      this._nativePrototypes[tag] = p;
    }
    return p;
  },
  getNativePrototype: function getNativePrototype(tag) {
    return Object.getPrototypeOf(document.createElement(tag));
  }
});Polymer.Base._addFeature({
  _prepConstructor: function _prepConstructor() {
    this._factoryArgs = this['extends'] ? [this['extends'], this.is] : [this.is];
    var ctor = function ctor() {
      return this._factory(arguments);
    };
    if (this.hasOwnProperty('extends')) {
      ctor['extends'] = this['extends'];
    }
    Object.defineProperty(this, 'constructor', {
      value: ctor,
      writable: true,
      configurable: true
    });
    ctor.prototype = this;
  },
  _factory: function _factory(args) {
    var elt = document.createElement.apply(document, this._factoryArgs);
    if (this.factoryImpl) {
      this.factoryImpl.apply(elt, args);
    }
    return elt;
  }
});Polymer.nob = Object.create(null);
Polymer.Base._addFeature({
  properties: {},
  getPropertyInfo: function getPropertyInfo(property) {
    var info = this._getPropertyInfo(property, this.properties);
    if (!info) {
      for (var i = 0; i < this.behaviors.length; i++) {
        info = this._getPropertyInfo(property, this.behaviors[i].properties);
        if (info) {
          return info;
        }
      }
    }
    return info || Polymer.nob;
  },
  _getPropertyInfo: function _getPropertyInfo(property, properties) {
    var p = properties && properties[property];
    if (typeof p === 'function') {
      p = properties[property] = { type: p };
    }
    if (p) {
      p.defined = true;
    }
    return p;
  },
  _prepPropertyInfo: function _prepPropertyInfo() {
    this._propertyInfo = {};
    for (var i = 0; i < this.behaviors.length; i++) {
      this._addPropertyInfo(this._propertyInfo, this.behaviors[i].properties);
    }
    this._addPropertyInfo(this._propertyInfo, this.properties);
    this._addPropertyInfo(this._propertyInfo, this._propertyEffects);
  },
  _addPropertyInfo: function _addPropertyInfo(target, source) {
    if (source) {
      var t, s;
      for (var i in source) {
        t = target[i];
        s = source[i];
        if (i[0] === '_' && !s.readOnly) {
          continue;
        }
        if (!target[i]) {
          target[i] = {
            type: typeof s === 'function' ? s : s.type,
            readOnly: s.readOnly,
            attribute: Polymer.CaseMap.camelToDashCase(i)
          };
        } else {
          if (!t.type) {
            t.type = s.type;
          }
          if (!t.readOnly) {
            t.readOnly = s.readOnly;
          }
        }
      }
    }
  }
});Polymer.CaseMap = {
  _caseMap: {},
  _rx: {
    dashToCamel: /-[a-z]/g,
    camelToDash: /([A-Z])/g
  },
  dashToCamelCase: function dashToCamelCase(dash) {
    return this._caseMap[dash] || (this._caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(this._rx.dashToCamel, function (m) {
      return m[1].toUpperCase();
    }));
  },
  camelToDashCase: function camelToDashCase(camel) {
    return this._caseMap[camel] || (this._caseMap[camel] = camel.replace(this._rx.camelToDash, '-$1').toLowerCase());
  }
};Polymer.Base._addFeature({
  _addHostAttributes: function _addHostAttributes(attributes) {
    if (!this._aggregatedAttributes) {
      this._aggregatedAttributes = {};
    }
    if (attributes) {
      this.mixin(this._aggregatedAttributes, attributes);
    }
  },
  _marshalHostAttributes: function _marshalHostAttributes() {
    if (this._aggregatedAttributes) {
      this._applyAttributes(this, this._aggregatedAttributes);
    }
  },
  _applyAttributes: function _applyAttributes(node, attr$) {
    for (var n in attr$) {
      if (!this.hasAttribute(n) && n !== 'class') {
        var v = attr$[n];
        this.serializeValueToAttribute(v, n, this);
      }
    }
  },
  _marshalAttributes: function _marshalAttributes() {
    this._takeAttributesToModel(this);
  },
  _takeAttributesToModel: function _takeAttributesToModel(model) {
    if (this.hasAttributes()) {
      for (var i in this._propertyInfo) {
        var info = this._propertyInfo[i];
        if (this.hasAttribute(info.attribute)) {
          this._setAttributeToProperty(model, info.attribute, i, info);
        }
      }
    }
  },
  _setAttributeToProperty: function _setAttributeToProperty(model, attribute, property, info) {
    if (!this._serializing) {
      property = property || Polymer.CaseMap.dashToCamelCase(attribute);
      info = info || this._propertyInfo && this._propertyInfo[property];
      if (info && !info.readOnly) {
        var v = this.getAttribute(attribute);
        model[property] = this.deserialize(v, info.type);
      }
    }
  },
  _serializing: false,
  reflectPropertyToAttribute: function reflectPropertyToAttribute(property, attribute, value) {
    this._serializing = true;
    value = value === undefined ? this[property] : value;
    this.serializeValueToAttribute(value, attribute || Polymer.CaseMap.camelToDashCase(property));
    this._serializing = false;
  },
  serializeValueToAttribute: function serializeValueToAttribute(value, attribute, node) {
    var str = this.serialize(value);
    node = node || this;
    if (str === undefined) {
      node.removeAttribute(attribute);
    } else {
      node.setAttribute(attribute, str);
    }
  },
  deserialize: function deserialize(value, type) {
    switch (type) {
      case Number:
        value = Number(value);
        break;
      case Boolean:
        value = value != null;
        break;
      case Object:
        try {
          value = JSON.parse(value);
        } catch (x) {}
        break;
      case Array:
        try {
          value = JSON.parse(value);
        } catch (x) {
          value = null;
          console.warn('Polymer::Attributes: couldn`t decode Array as JSON');
        }
        break;
      case Date:
        value = new Date(value);
        break;
      case String:
      default:
        break;
    }
    return value;
  },
  serialize: function serialize(value) {
    switch (typeof value) {
      case 'boolean':
        return value ? '' : undefined;
      case 'object':
        if (value instanceof Date) {
          return value.toString();
        } else if (value) {
          try {
            return JSON.stringify(value);
          } catch (x) {
            return '';
          }
        }
      default:
        return value != null ? value : undefined;
    }
  }
});Polymer.version = "1.7.1";Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepBehaviors();
    this._prepConstructor();
    this._prepPropertyInfo();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addHostAttributes(b.hostAttributes);
  },
  _marshalBehavior: function _marshalBehavior(b) {},
  _initFeatures: function _initFeatures() {
    this._marshalHostAttributes();
    this._marshalBehaviors();
  }
});
Polymer.Base._addFeature({
  _prepTemplate: function _prepTemplate() {
    if (this._template === undefined) {
      this._template = Polymer.DomModule['import'](this.is, 'template');
    }
    if (this._template && this._template.hasAttribute('is')) {
      this._warn(this._logf('_prepTemplate', 'top-level Polymer template ' + 'must not be a type-extension, found', this._template, 'Move inside simple <template>.'));
    }
    if (this._template && !this._template.content && window.HTMLTemplateElement && HTMLTemplateElement.decorate) {
      HTMLTemplateElement.decorate(this._template);
    }
  },
  _stampTemplate: function _stampTemplate() {
    if (this._template) {
      this.root = this.instanceTemplate(this._template);
    }
  },
  instanceTemplate: function instanceTemplate(template) {
    var dom = document.importNode(template._content || template.content, true);
    return dom;
  }
});(function () {
  var baseAttachedCallback = Polymer.Base.attachedCallback;
  Polymer.Base._addFeature({
    _hostStack: [],
    ready: function ready() {},
    _registerHost: function _registerHost(host) {
      this.dataHost = host = host || Polymer.Base._hostStack[Polymer.Base._hostStack.length - 1];
      if (host && host._clients) {
        host._clients.push(this);
      }
      this._clients = null;
      this._clientsReadied = false;
    },
    _beginHosting: function _beginHosting() {
      Polymer.Base._hostStack.push(this);
      if (!this._clients) {
        this._clients = [];
      }
    },
    _endHosting: function _endHosting() {
      Polymer.Base._hostStack.pop();
    },
    _tryReady: function _tryReady() {
      this._readied = false;
      if (this._canReady()) {
        this._ready();
      }
    },
    _canReady: function _canReady() {
      return !this.dataHost || this.dataHost._clientsReadied;
    },
    _ready: function _ready() {
      this._beforeClientsReady();
      if (this._template) {
        this._setupRoot();
        this._readyClients();
      }
      this._clientsReadied = true;
      this._clients = null;
      this._afterClientsReady();
      this._readySelf();
    },
    _readyClients: function _readyClients() {
      this._beginDistribute();
      var c$ = this._clients;
      if (c$) {
        for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
          c._ready();
        }
      }
      this._finishDistribute();
    },
    _readySelf: function _readySelf() {
      this._doBehavior('ready');
      this._readied = true;
      if (this._attachedPending) {
        this._attachedPending = false;
        this.attachedCallback();
      }
    },
    _beforeClientsReady: function _beforeClientsReady() {},
    _afterClientsReady: function _afterClientsReady() {},
    _beforeAttached: function _beforeAttached() {},
    attachedCallback: function attachedCallback() {
      if (this._readied) {
        this._beforeAttached();
        baseAttachedCallback.call(this);
      } else {
        this._attachedPending = true;
      }
    }
  });
})();Polymer.ArraySplice = (function () {
  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }
  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;
  function ArraySplice() {}
  ArraySplice.prototype = {
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }
      for (var j = 0; j < columnCount; j++) distances[0][j] = j;
      for (i = 1; i < rowCount; i++) {
        for (j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1])) distances[i][j] = distances[i - 1][j - 1];else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }
      return distances;
    },
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];
        var min;
        if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;
        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }
      edits.reverse();
      return edits;
    },
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;
      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);
      if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;
      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];
      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);
        return [splice];
      } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];
      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
      splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }
            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice) splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice) splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice) splice = newSplice(index, [], 0);
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }
      if (splice) {
        splices.push(splice);
      }
      return splices;
    },
    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++) if (!this.equals(current[i], old[i])) return i;
      return searchLength;
    },
    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;
      return count;
    },
    calculateSplices: function calculateSplices(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },
    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };
  return new ArraySplice();
})();Polymer.domInnerHTML = (function () {
  var escapeAttrRegExp = /[&\u00A0"]/g;
  var escapeDataRegExp = /[&\u00A0<>]/g;
  function escapeReplace(c) {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\xA0':
        return '&nbsp;';
    }
  }
  function escapeAttr(s) {
    return s.replace(escapeAttrRegExp, escapeReplace);
  }
  function escapeData(s) {
    return s.replace(escapeDataRegExp, escapeReplace);
  }
  function makeSet(arr) {
    var set = {};
    for (var i = 0; i < arr.length; i++) {
      set[arr[i]] = true;
    }
    return set;
  }
  var voidElements = makeSet(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  var plaintextParents = makeSet(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);
  function getOuterHTML(node, parentNode, composed) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        var tagName = node.localName;
        var s = '<' + tagName;
        var attrs = node.attributes;
        for (var i = 0, attr; attr = attrs[i]; i++) {
          s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
        }
        s += '>';
        if (voidElements[tagName]) {
          return s;
        }
        return s + getInnerHTML(node, composed) + '</' + tagName + '>';
      case Node.TEXT_NODE:
        var data = node.data;
        if (parentNode && plaintextParents[parentNode.localName]) {
          return data;
        }
        return escapeData(data);
      case Node.COMMENT_NODE:
        return '<!--' + node.data + '-->';
      default:
        console.error(node);
        throw new Error('not implemented');
    }
  }
  function getInnerHTML(node, composed) {
    if (node instanceof HTMLTemplateElement) node = node.content;
    var s = '';
    var c$ = Polymer.dom(node).childNodes;
    for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
      s += getOuterHTML(child, node, composed);
    }
    return s;
  }
  return { getInnerHTML: getInnerHTML };
})();(function () {
  'use strict';
  var nativeInsertBefore = Element.prototype.insertBefore;
  var nativeAppendChild = Element.prototype.appendChild;
  var nativeRemoveChild = Element.prototype.removeChild;
  Polymer.TreeApi = {
    arrayCopyChildNodes: function arrayCopyChildNodes(parent) {
      var copy = [],
          i = 0;
      for (var n = parent.firstChild; n; n = n.nextSibling) {
        copy[i++] = n;
      }
      return copy;
    },
    arrayCopyChildren: function arrayCopyChildren(parent) {
      var copy = [],
          i = 0;
      for (var n = parent.firstElementChild; n; n = n.nextElementSibling) {
        copy[i++] = n;
      }
      return copy;
    },
    arrayCopy: function arrayCopy(a$) {
      var l = a$.length;
      var copy = new Array(l);
      for (var i = 0; i < l; i++) {
        copy[i] = a$[i];
      }
      return copy;
    }
  };
  Polymer.TreeApi.Logical = {
    hasParentNode: function hasParentNode(node) {
      return Boolean(node.__dom && node.__dom.parentNode);
    },
    hasChildNodes: function hasChildNodes(node) {
      return Boolean(node.__dom && node.__dom.childNodes !== undefined);
    },
    getChildNodes: function getChildNodes(node) {
      return this.hasChildNodes(node) ? this._getChildNodes(node) : node.childNodes;
    },
    _getChildNodes: function _getChildNodes(node) {
      if (!node.__dom.childNodes) {
        node.__dom.childNodes = [];
        for (var n = node.__dom.firstChild; n; n = n.__dom.nextSibling) {
          node.__dom.childNodes.push(n);
        }
      }
      return node.__dom.childNodes;
    },
    getParentNode: function getParentNode(node) {
      return node.__dom && node.__dom.parentNode !== undefined ? node.__dom.parentNode : node.parentNode;
    },
    getFirstChild: function getFirstChild(node) {
      return node.__dom && node.__dom.firstChild !== undefined ? node.__dom.firstChild : node.firstChild;
    },
    getLastChild: function getLastChild(node) {
      return node.__dom && node.__dom.lastChild !== undefined ? node.__dom.lastChild : node.lastChild;
    },
    getNextSibling: function getNextSibling(node) {
      return node.__dom && node.__dom.nextSibling !== undefined ? node.__dom.nextSibling : node.nextSibling;
    },
    getPreviousSibling: function getPreviousSibling(node) {
      return node.__dom && node.__dom.previousSibling !== undefined ? node.__dom.previousSibling : node.previousSibling;
    },
    getFirstElementChild: function getFirstElementChild(node) {
      return node.__dom && node.__dom.firstChild !== undefined ? this._getFirstElementChild(node) : node.firstElementChild;
    },
    _getFirstElementChild: function _getFirstElementChild(node) {
      var n = node.__dom.firstChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.nextSibling;
      }
      return n;
    },
    getLastElementChild: function getLastElementChild(node) {
      return node.__dom && node.__dom.lastChild !== undefined ? this._getLastElementChild(node) : node.lastElementChild;
    },
    _getLastElementChild: function _getLastElementChild(node) {
      var n = node.__dom.lastChild;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.previousSibling;
      }
      return n;
    },
    getNextElementSibling: function getNextElementSibling(node) {
      return node.__dom && node.__dom.nextSibling !== undefined ? this._getNextElementSibling(node) : node.nextElementSibling;
    },
    _getNextElementSibling: function _getNextElementSibling(node) {
      var n = node.__dom.nextSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.nextSibling;
      }
      return n;
    },
    getPreviousElementSibling: function getPreviousElementSibling(node) {
      return node.__dom && node.__dom.previousSibling !== undefined ? this._getPreviousElementSibling(node) : node.previousElementSibling;
    },
    _getPreviousElementSibling: function _getPreviousElementSibling(node) {
      var n = node.__dom.previousSibling;
      while (n && n.nodeType !== Node.ELEMENT_NODE) {
        n = n.__dom.previousSibling;
      }
      return n;
    },
    saveChildNodes: function saveChildNodes(node) {
      if (!this.hasChildNodes(node)) {
        node.__dom = node.__dom || {};
        node.__dom.firstChild = node.firstChild;
        node.__dom.lastChild = node.lastChild;
        node.__dom.childNodes = [];
        for (var n = node.firstChild; n; n = n.nextSibling) {
          n.__dom = n.__dom || {};
          n.__dom.parentNode = node;
          node.__dom.childNodes.push(n);
          n.__dom.nextSibling = n.nextSibling;
          n.__dom.previousSibling = n.previousSibling;
        }
      }
    },
    recordInsertBefore: function recordInsertBefore(node, container, ref_node) {
      container.__dom.childNodes = null;
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        for (var n = node.firstChild; n; n = n.nextSibling) {
          this._linkNode(n, container, ref_node);
        }
      } else {
        this._linkNode(node, container, ref_node);
      }
    },
    _linkNode: function _linkNode(node, container, ref_node) {
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (ref_node) {
        ref_node.__dom = ref_node.__dom || {};
      }
      node.__dom.previousSibling = ref_node ? ref_node.__dom.previousSibling : container.__dom.lastChild;
      if (node.__dom.previousSibling) {
        node.__dom.previousSibling.__dom.nextSibling = node;
      }
      node.__dom.nextSibling = ref_node || null;
      if (node.__dom.nextSibling) {
        node.__dom.nextSibling.__dom.previousSibling = node;
      }
      node.__dom.parentNode = container;
      if (ref_node) {
        if (ref_node === container.__dom.firstChild) {
          container.__dom.firstChild = node;
        }
      } else {
        container.__dom.lastChild = node;
        if (!container.__dom.firstChild) {
          container.__dom.firstChild = node;
        }
      }
      container.__dom.childNodes = null;
    },
    recordRemoveChild: function recordRemoveChild(node, container) {
      node.__dom = node.__dom || {};
      container.__dom = container.__dom || {};
      if (node === container.__dom.firstChild) {
        container.__dom.firstChild = node.__dom.nextSibling;
      }
      if (node === container.__dom.lastChild) {
        container.__dom.lastChild = node.__dom.previousSibling;
      }
      var p = node.__dom.previousSibling;
      var n = node.__dom.nextSibling;
      if (p) {
        p.__dom.nextSibling = n;
      }
      if (n) {
        n.__dom.previousSibling = p;
      }
      node.__dom.parentNode = node.__dom.previousSibling = node.__dom.nextSibling = undefined;
      container.__dom.childNodes = null;
    }
  };
  Polymer.TreeApi.Composed = {
    getChildNodes: function getChildNodes(node) {
      return Polymer.TreeApi.arrayCopyChildNodes(node);
    },
    getParentNode: function getParentNode(node) {
      return node.parentNode;
    },
    clearChildNodes: function clearChildNodes(node) {
      node.textContent = '';
    },
    insertBefore: function insertBefore(parentNode, newChild, refChild) {
      return nativeInsertBefore.call(parentNode, newChild, refChild || null);
    },
    appendChild: function appendChild(parentNode, newChild) {
      return nativeAppendChild.call(parentNode, newChild);
    },
    removeChild: function removeChild(parentNode, node) {
      return nativeRemoveChild.call(parentNode, node);
    }
  };
})();Polymer.DomApi = (function () {
  'use strict';
  var Settings = Polymer.Settings;
  var TreeApi = Polymer.TreeApi;
  var DomApi = function DomApi(node) {
    this.node = needsToWrap ? DomApi.wrap(node) : node;
  };
  var needsToWrap = Settings.hasShadow && !Settings.nativeShadow;
  DomApi.wrap = window.wrap ? window.wrap : function (node) {
    return node;
  };
  DomApi.prototype = {
    flush: function flush() {
      Polymer.dom.flush();
    },
    deepContains: function deepContains(node) {
      if (this.node.contains(node)) {
        return true;
      }
      var n = node;
      var doc = node.ownerDocument;
      while (n && n !== doc && n !== this.node) {
        n = Polymer.dom(n).parentNode || n.host;
      }
      return n === this.node;
    },
    queryDistributedElements: function queryDistributedElements(selector) {
      var c$ = this.getEffectiveChildNodes();
      var list = [];
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        if (c.nodeType === Node.ELEMENT_NODE && DomApi.matchesSelector.call(c, selector)) {
          list.push(c);
        }
      }
      return list;
    },
    getEffectiveChildNodes: function getEffectiveChildNodes() {
      var list = [];
      var c$ = this.childNodes;
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        if (c.localName === CONTENT) {
          var d$ = dom(c).getDistributedNodes();
          for (var j = 0; j < d$.length; j++) {
            list.push(d$[j]);
          }
        } else {
          list.push(c);
        }
      }
      return list;
    },
    observeNodes: function observeNodes(callback) {
      if (callback) {
        if (!this.observer) {
          this.observer = this.node.localName === CONTENT ? new DomApi.DistributedNodesObserver(this) : new DomApi.EffectiveNodesObserver(this);
        }
        return this.observer.addListener(callback);
      }
    },
    unobserveNodes: function unobserveNodes(handle) {
      if (this.observer) {
        this.observer.removeListener(handle);
      }
    },
    notifyObserver: function notifyObserver() {
      if (this.observer) {
        this.observer.notify();
      }
    },
    _query: function _query(matcher, node, halter) {
      node = node || this.node;
      var list = [];
      this._queryElements(TreeApi.Logical.getChildNodes(node), matcher, halter, list);
      return list;
    },
    _queryElements: function _queryElements(elements, matcher, halter, list) {
      for (var i = 0, l = elements.length, c; i < l && (c = elements[i]); i++) {
        if (c.nodeType === Node.ELEMENT_NODE) {
          if (this._queryElement(c, matcher, halter, list)) {
            return true;
          }
        }
      }
    },
    _queryElement: function _queryElement(node, matcher, halter, list) {
      var result = matcher(node);
      if (result) {
        list.push(node);
      }
      if (halter && halter(result)) {
        return result;
      }
      this._queryElements(TreeApi.Logical.getChildNodes(node), matcher, halter, list);
    }
  };
  var CONTENT = DomApi.CONTENT = 'content';
  var dom = DomApi.factory = function (node) {
    node = node || document;
    if (!node.__domApi) {
      node.__domApi = new DomApi.ctor(node);
    }
    return node.__domApi;
  };
  DomApi.hasApi = function (node) {
    return Boolean(node.__domApi);
  };
  DomApi.ctor = DomApi;
  Polymer.dom = function (obj, patch) {
    if (obj instanceof Event) {
      return Polymer.EventApi.factory(obj);
    } else {
      return DomApi.factory(obj, patch);
    }
  };
  var p = Element.prototype;
  DomApi.matchesSelector = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;
  return DomApi;
})();(function () {
  'use strict';
  var Settings = Polymer.Settings;
  var DomApi = Polymer.DomApi;
  var dom = DomApi.factory;
  var TreeApi = Polymer.TreeApi;
  var getInnerHTML = Polymer.domInnerHTML.getInnerHTML;
  var CONTENT = DomApi.CONTENT;
  if (Settings.useShadow) {
    return;
  }
  var nativeCloneNode = Element.prototype.cloneNode;
  var nativeImportNode = Document.prototype.importNode;
  Polymer.Base.extend(DomApi.prototype, {
    _lazyDistribute: function _lazyDistribute(host) {
      if (host.shadyRoot && host.shadyRoot._distributionClean) {
        host.shadyRoot._distributionClean = false;
        Polymer.dom.addDebouncer(host.debounce('_distribute', host._distributeContent));
      }
    },
    appendChild: function appendChild(node) {
      return this.insertBefore(node);
    },
    insertBefore: function insertBefore(node, ref_node) {
      if (ref_node && TreeApi.Logical.getParentNode(ref_node) !== this.node) {
        throw Error('The ref_node to be inserted before is not a child ' + 'of this node');
      }
      if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        var parent = TreeApi.Logical.getParentNode(node);
        if (parent) {
          if (DomApi.hasApi(parent)) {
            dom(parent).notifyObserver();
          }
          this._removeNode(node);
        } else {
          this._removeOwnerShadyRoot(node);
        }
      }
      if (!this._addNode(node, ref_node)) {
        if (ref_node) {
          ref_node = ref_node.localName === CONTENT ? this._firstComposedNode(ref_node) : ref_node;
        }
        var container = this.node._isShadyRoot ? this.node.host : this.node;
        if (ref_node) {
          TreeApi.Composed.insertBefore(container, node, ref_node);
        } else {
          TreeApi.Composed.appendChild(container, node);
        }
      }
      this.notifyObserver();
      return node;
    },
    _addNode: function _addNode(node, ref_node) {
      var root = this.getOwnerRoot();
      if (root) {
        var ipAdded = this._maybeAddInsertionPoint(node, this.node);
        if (!root._invalidInsertionPoints) {
          root._invalidInsertionPoints = ipAdded;
        }
        this._addNodeToHost(root.host, node);
      }
      if (TreeApi.Logical.hasChildNodes(this.node)) {
        TreeApi.Logical.recordInsertBefore(node, this.node, ref_node);
      }
      var handled = this._maybeDistribute(node) || this.node.shadyRoot;
      if (handled) {
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          while (node.firstChild) {
            TreeApi.Composed.removeChild(node, node.firstChild);
          }
        } else {
          var parent = TreeApi.Composed.getParentNode(node);
          if (parent) {
            TreeApi.Composed.removeChild(parent, node);
          }
        }
      }
      return handled;
    },
    removeChild: function removeChild(node) {
      if (TreeApi.Logical.getParentNode(node) !== this.node) {
        throw Error('The node to be removed is not a child of this node: ' + node);
      }
      if (!this._removeNode(node)) {
        var container = this.node._isShadyRoot ? this.node.host : this.node;
        var parent = TreeApi.Composed.getParentNode(node);
        if (container === parent) {
          TreeApi.Composed.removeChild(container, node);
        }
      }
      this.notifyObserver();
      return node;
    },
    _removeNode: function _removeNode(node) {
      var logicalParent = TreeApi.Logical.hasParentNode(node) && TreeApi.Logical.getParentNode(node);
      var distributed;
      var root = this._ownerShadyRootForNode(node);
      if (logicalParent) {
        distributed = dom(node)._maybeDistributeParent();
        TreeApi.Logical.recordRemoveChild(node, logicalParent);
        if (root && this._removeDistributedChildren(root, node)) {
          root._invalidInsertionPoints = true;
          this._lazyDistribute(root.host);
        }
      }
      this._removeOwnerShadyRoot(node);
      if (root) {
        this._removeNodeFromHost(root.host, node);
      }
      return distributed;
    },
    replaceChild: function replaceChild(node, ref_node) {
      this.insertBefore(node, ref_node);
      this.removeChild(ref_node);
      return node;
    },
    _hasCachedOwnerRoot: function _hasCachedOwnerRoot(node) {
      return Boolean(node._ownerShadyRoot !== undefined);
    },
    getOwnerRoot: function getOwnerRoot() {
      return this._ownerShadyRootForNode(this.node);
    },
    _ownerShadyRootForNode: function _ownerShadyRootForNode(node) {
      if (!node) {
        return;
      }
      var root = node._ownerShadyRoot;
      if (root === undefined) {
        if (node._isShadyRoot) {
          root = node;
        } else {
          var parent = TreeApi.Logical.getParentNode(node);
          if (parent) {
            root = parent._isShadyRoot ? parent : this._ownerShadyRootForNode(parent);
          } else {
            root = null;
          }
        }
        if (root || document.documentElement.contains(node)) {
          node._ownerShadyRoot = root;
        }
      }
      return root;
    },
    _maybeDistribute: function _maybeDistribute(node) {
      var fragContent = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noContent && dom(node).querySelector(CONTENT);
      var wrappedContent = fragContent && TreeApi.Logical.getParentNode(fragContent).nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
      var hasContent = fragContent || node.localName === CONTENT;
      if (hasContent) {
        var root = this.getOwnerRoot();
        if (root) {
          this._lazyDistribute(root.host);
        }
      }
      var needsDist = this._nodeNeedsDistribution(this.node);
      if (needsDist) {
        this._lazyDistribute(this.node);
      }
      return needsDist || hasContent && !wrappedContent;
    },
    _maybeAddInsertionPoint: function _maybeAddInsertionPoint(node, parent) {
      var added;
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noContent) {
        var c$ = dom(node).querySelectorAll(CONTENT);
        for (var i = 0, n, np, na; i < c$.length && (n = c$[i]); i++) {
          np = TreeApi.Logical.getParentNode(n);
          if (np === node) {
            np = parent;
          }
          na = this._maybeAddInsertionPoint(n, np);
          added = added || na;
        }
      } else if (node.localName === CONTENT) {
        TreeApi.Logical.saveChildNodes(parent);
        TreeApi.Logical.saveChildNodes(node);
        added = true;
      }
      return added;
    },
    _updateInsertionPoints: function _updateInsertionPoints(host) {
      var i$ = host.shadyRoot._insertionPoints = dom(host.shadyRoot).querySelectorAll(CONTENT);
      for (var i = 0, c; i < i$.length; i++) {
        c = i$[i];
        TreeApi.Logical.saveChildNodes(c);
        TreeApi.Logical.saveChildNodes(TreeApi.Logical.getParentNode(c));
      }
    },
    _nodeNeedsDistribution: function _nodeNeedsDistribution(node) {
      return node && node.shadyRoot && DomApi.hasInsertionPoint(node.shadyRoot);
    },
    _addNodeToHost: function _addNodeToHost(host, node) {
      if (host._elementAdd) {
        host._elementAdd(node);
      }
    },
    _removeNodeFromHost: function _removeNodeFromHost(host, node) {
      if (host._elementRemove) {
        host._elementRemove(node);
      }
    },
    _removeDistributedChildren: function _removeDistributedChildren(root, container) {
      var hostNeedsDist;
      var ip$ = root._insertionPoints;
      for (var i = 0; i < ip$.length; i++) {
        var content = ip$[i];
        if (this._contains(container, content)) {
          var dc$ = dom(content).getDistributedNodes();
          for (var j = 0; j < dc$.length; j++) {
            hostNeedsDist = true;
            var node = dc$[j];
            var parent = TreeApi.Composed.getParentNode(node);
            if (parent) {
              TreeApi.Composed.removeChild(parent, node);
            }
          }
        }
      }
      return hostNeedsDist;
    },
    _contains: function _contains(container, node) {
      while (node) {
        if (node == container) {
          return true;
        }
        node = TreeApi.Logical.getParentNode(node);
      }
    },
    _removeOwnerShadyRoot: function _removeOwnerShadyRoot(node) {
      if (this._hasCachedOwnerRoot(node)) {
        var c$ = TreeApi.Logical.getChildNodes(node);
        for (var i = 0, l = c$.length, n; i < l && (n = c$[i]); i++) {
          this._removeOwnerShadyRoot(n);
        }
      }
      node._ownerShadyRoot = undefined;
    },
    _firstComposedNode: function _firstComposedNode(content) {
      var n$ = dom(content).getDistributedNodes();
      for (var i = 0, l = n$.length, n, p$; i < l && (n = n$[i]); i++) {
        p$ = dom(n).getDestinationInsertionPoints();
        if (p$[p$.length - 1] === content) {
          return n;
        }
      }
    },
    querySelector: function querySelector(selector) {
      var result = this._query(function (n) {
        return DomApi.matchesSelector.call(n, selector);
      }, this.node, function (n) {
        return Boolean(n);
      })[0];
      return result || null;
    },
    querySelectorAll: function querySelectorAll(selector) {
      return this._query(function (n) {
        return DomApi.matchesSelector.call(n, selector);
      }, this.node);
    },
    getDestinationInsertionPoints: function getDestinationInsertionPoints() {
      return this.node._destinationInsertionPoints || [];
    },
    getDistributedNodes: function getDistributedNodes() {
      return this.node._distributedNodes || [];
    },
    _clear: function _clear() {
      while (this.childNodes.length) {
        this.removeChild(this.childNodes[0]);
      }
    },
    setAttribute: function setAttribute(name, value) {
      this.node.setAttribute(name, value);
      this._maybeDistributeParent();
    },
    removeAttribute: function removeAttribute(name) {
      this.node.removeAttribute(name);
      this._maybeDistributeParent();
    },
    _maybeDistributeParent: function _maybeDistributeParent() {
      if (this._nodeNeedsDistribution(this.parentNode)) {
        this._lazyDistribute(this.parentNode);
        return true;
      }
    },
    cloneNode: function cloneNode(deep) {
      var n = nativeCloneNode.call(this.node, false);
      if (deep) {
        var c$ = this.childNodes;
        var d = dom(n);
        for (var i = 0, nc; i < c$.length; i++) {
          nc = dom(c$[i]).cloneNode(true);
          d.appendChild(nc);
        }
      }
      return n;
    },
    importNode: function importNode(externalNode, deep) {
      var doc = this.node instanceof Document ? this.node : this.node.ownerDocument;
      var n = nativeImportNode.call(doc, externalNode, false);
      if (deep) {
        var c$ = TreeApi.Logical.getChildNodes(externalNode);
        var d = dom(n);
        for (var i = 0, nc; i < c$.length; i++) {
          nc = dom(doc).importNode(c$[i], true);
          d.appendChild(nc);
        }
      }
      return n;
    },
    _getComposedInnerHTML: function _getComposedInnerHTML() {
      return getInnerHTML(this.node, true);
    }
  });
  Object.defineProperties(DomApi.prototype, {
    activeElement: {
      get: function get() {
        var active = document.activeElement;
        if (!active) {
          return null;
        }
        var isShadyRoot = !!this.node._isShadyRoot;
        if (this.node !== document) {
          if (!isShadyRoot) {
            return null;
          }
          if (this.node.host === active || !this.node.host.contains(active)) {
            return null;
          }
        }
        var activeRoot = dom(active).getOwnerRoot();
        while (activeRoot && activeRoot !== this.node) {
          active = activeRoot.host;
          activeRoot = dom(active).getOwnerRoot();
        }
        if (this.node === document) {
          return activeRoot ? null : active;
        } else {
          return activeRoot === this.node ? active : null;
        }
      },
      configurable: true
    },
    childNodes: {
      get: function get() {
        var c$ = TreeApi.Logical.getChildNodes(this.node);
        return Array.isArray(c$) ? c$ : TreeApi.arrayCopyChildNodes(this.node);
      },
      configurable: true
    },
    children: {
      get: function get() {
        if (TreeApi.Logical.hasChildNodes(this.node)) {
          return Array.prototype.filter.call(this.childNodes, function (n) {
            return n.nodeType === Node.ELEMENT_NODE;
          });
        } else {
          return TreeApi.arrayCopyChildren(this.node);
        }
      },
      configurable: true
    },
    parentNode: {
      get: function get() {
        return TreeApi.Logical.getParentNode(this.node);
      },
      configurable: true
    },
    firstChild: {
      get: function get() {
        return TreeApi.Logical.getFirstChild(this.node);
      },
      configurable: true
    },
    lastChild: {
      get: function get() {
        return TreeApi.Logical.getLastChild(this.node);
      },
      configurable: true
    },
    nextSibling: {
      get: function get() {
        return TreeApi.Logical.getNextSibling(this.node);
      },
      configurable: true
    },
    previousSibling: {
      get: function get() {
        return TreeApi.Logical.getPreviousSibling(this.node);
      },
      configurable: true
    },
    firstElementChild: {
      get: function get() {
        return TreeApi.Logical.getFirstElementChild(this.node);
      },
      configurable: true
    },
    lastElementChild: {
      get: function get() {
        return TreeApi.Logical.getLastElementChild(this.node);
      },
      configurable: true
    },
    nextElementSibling: {
      get: function get() {
        return TreeApi.Logical.getNextElementSibling(this.node);
      },
      configurable: true
    },
    previousElementSibling: {
      get: function get() {
        return TreeApi.Logical.getPreviousElementSibling(this.node);
      },
      configurable: true
    },
    textContent: {
      get: function get() {
        var nt = this.node.nodeType;
        if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
          return this.node.textContent;
        } else {
          var tc = [];
          for (var i = 0, cn = this.childNodes, c; c = cn[i]; i++) {
            if (c.nodeType !== Node.COMMENT_NODE) {
              tc.push(c.textContent);
            }
          }
          return tc.join('');
        }
      },
      set: function set(text) {
        var nt = this.node.nodeType;
        if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
          this.node.textContent = text;
        } else {
          this._clear();
          if (text) {
            this.appendChild(document.createTextNode(text));
          }
        }
      },
      configurable: true
    },
    innerHTML: {
      get: function get() {
        var nt = this.node.nodeType;
        if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
          return null;
        } else {
          return getInnerHTML(this.node);
        }
      },
      set: function set(text) {
        var nt = this.node.nodeType;
        if (nt !== Node.TEXT_NODE || nt !== Node.COMMENT_NODE) {
          this._clear();
          var d = document.createElement('div');
          d.innerHTML = text;
          var c$ = TreeApi.arrayCopyChildNodes(d);
          for (var i = 0; i < c$.length; i++) {
            this.appendChild(c$[i]);
          }
        }
      },
      configurable: true
    }
  });
  DomApi.hasInsertionPoint = function (root) {
    return Boolean(root && root._insertionPoints.length);
  };
})();(function () {
  'use strict';
  var Settings = Polymer.Settings;
  var TreeApi = Polymer.TreeApi;
  var DomApi = Polymer.DomApi;
  if (!Settings.useShadow) {
    return;
  }
  Polymer.Base.extend(DomApi.prototype, {
    querySelectorAll: function querySelectorAll(selector) {
      return TreeApi.arrayCopy(this.node.querySelectorAll(selector));
    },
    getOwnerRoot: function getOwnerRoot() {
      var n = this.node;
      while (n) {
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host) {
          return n;
        }
        n = n.parentNode;
      }
    },
    importNode: function importNode(externalNode, deep) {
      var doc = this.node instanceof Document ? this.node : this.node.ownerDocument;
      return doc.importNode(externalNode, deep);
    },
    getDestinationInsertionPoints: function getDestinationInsertionPoints() {
      var n$ = this.node.getDestinationInsertionPoints && this.node.getDestinationInsertionPoints();
      return n$ ? TreeApi.arrayCopy(n$) : [];
    },
    getDistributedNodes: function getDistributedNodes() {
      var n$ = this.node.getDistributedNodes && this.node.getDistributedNodes();
      return n$ ? TreeApi.arrayCopy(n$) : [];
    }
  });
  Object.defineProperties(DomApi.prototype, {
    activeElement: {
      get: function get() {
        var node = DomApi.wrap(this.node);
        var activeElement = node.activeElement;
        return node.contains(activeElement) ? activeElement : null;
      },
      configurable: true
    },
    childNodes: {
      get: function get() {
        return TreeApi.arrayCopyChildNodes(this.node);
      },
      configurable: true
    },
    children: {
      get: function get() {
        return TreeApi.arrayCopyChildren(this.node);
      },
      configurable: true
    },
    textContent: {
      get: function get() {
        return this.node.textContent;
      },
      set: function set(value) {
        return this.node.textContent = value;
      },
      configurable: true
    },
    innerHTML: {
      get: function get() {
        return this.node.innerHTML;
      },
      set: function set(value) {
        return this.node.innerHTML = value;
      },
      configurable: true
    }
  });
  var forwardMethods = function forwardMethods(m$) {
    for (var i = 0; i < m$.length; i++) {
      forwardMethod(m$[i]);
    }
  };
  var forwardMethod = function forwardMethod(method) {
    DomApi.prototype[method] = function () {
      return this.node[method].apply(this.node, arguments);
    };
  };
  forwardMethods(['cloneNode', 'appendChild', 'insertBefore', 'removeChild', 'replaceChild', 'setAttribute', 'removeAttribute', 'querySelector']);
  var forwardProperties = function forwardProperties(f$) {
    for (var i = 0; i < f$.length; i++) {
      forwardProperty(f$[i]);
    }
  };
  var forwardProperty = function forwardProperty(name) {
    Object.defineProperty(DomApi.prototype, name, {
      get: function get() {
        return this.node[name];
      },
      configurable: true
    });
  };
  forwardProperties(['parentNode', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'firstElementChild', 'lastElementChild', 'nextElementSibling', 'previousElementSibling']);
})();Polymer.Base.extend(Polymer.dom, {
  _flushGuard: 0,
  _FLUSH_MAX: 100,
  _needsTakeRecords: !Polymer.Settings.useNativeCustomElements,
  _debouncers: [],
  _staticFlushList: [],
  _finishDebouncer: null,
  flush: function flush() {
    this._flushGuard = 0;
    this._prepareFlush();
    while (this._debouncers.length && this._flushGuard < this._FLUSH_MAX) {
      while (this._debouncers.length) {
        this._debouncers.shift().complete();
      }
      if (this._finishDebouncer) {
        this._finishDebouncer.complete();
      }
      this._prepareFlush();
      this._flushGuard++;
    }
    if (this._flushGuard >= this._FLUSH_MAX) {
      console.warn('Polymer.dom.flush aborted. Flush may not be complete.');
    }
  },
  _prepareFlush: function _prepareFlush() {
    if (this._needsTakeRecords) {
      CustomElements.takeRecords();
    }
    for (var i = 0; i < this._staticFlushList.length; i++) {
      this._staticFlushList[i]();
    }
  },
  addStaticFlush: function addStaticFlush(fn) {
    this._staticFlushList.push(fn);
  },
  removeStaticFlush: function removeStaticFlush(fn) {
    var i = this._staticFlushList.indexOf(fn);
    if (i >= 0) {
      this._staticFlushList.splice(i, 1);
    }
  },
  addDebouncer: function addDebouncer(debouncer) {
    this._debouncers.push(debouncer);
    this._finishDebouncer = Polymer.Debounce(this._finishDebouncer, this._finishFlush);
  },
  _finishFlush: function _finishFlush() {
    Polymer.dom._debouncers = [];
  }
});Polymer.EventApi = (function () {
  'use strict';
  var DomApi = Polymer.DomApi.ctor;
  var Settings = Polymer.Settings;
  DomApi.Event = function (event) {
    this.event = event;
  };
  if (Settings.useShadow) {
    DomApi.Event.prototype = Object.defineProperties({}, {
      rootTarget: {
        get: function get() {
          return this.event.path[0];
        },
        configurable: true,
        enumerable: true
      },
      localTarget: {
        get: function get() {
          return this.event.target;
        },
        configurable: true,
        enumerable: true
      },
      path: {
        get: function get() {
          var path = this.event.path;
          if (!Array.isArray(path)) {
            path = Array.prototype.slice.call(path);
          }
          return path;
        },
        configurable: true,
        enumerable: true
      }
    });
  } else {
    DomApi.Event.prototype = Object.defineProperties({}, {
      rootTarget: {
        get: function get() {
          return this.event.target;
        },
        configurable: true,
        enumerable: true
      },
      localTarget: {
        get: function get() {
          var current = this.event.currentTarget;
          var currentRoot = current && Polymer.dom(current).getOwnerRoot();
          var p$ = this.path;
          for (var i = 0; i < p$.length; i++) {
            if (Polymer.dom(p$[i]).getOwnerRoot() === currentRoot) {
              return p$[i];
            }
          }
        },
        configurable: true,
        enumerable: true
      },
      path: {
        get: function get() {
          if (!this.event._path) {
            var path = [];
            var current = this.rootTarget;
            while (current) {
              path.push(current);
              var insertionPoints = Polymer.dom(current).getDestinationInsertionPoints();
              if (insertionPoints.length) {
                for (var i = 0; i < insertionPoints.length - 1; i++) {
                  path.push(insertionPoints[i]);
                }
                current = insertionPoints[insertionPoints.length - 1];
              } else {
                current = Polymer.dom(current).parentNode || current.host;
              }
            }
            path.push(window);
            this.event._path = path;
          }
          return this.event._path;
        },
        configurable: true,
        enumerable: true
      }
    });
  }
  var factory = function factory(event) {
    if (!event.__eventApi) {
      event.__eventApi = new DomApi.Event(event);
    }
    return event.__eventApi;
  };
  return { factory: factory };
})();(function () {
  'use strict';
  var DomApi = Polymer.DomApi.ctor;
  var useShadow = Polymer.Settings.useShadow;
  Object.defineProperty(DomApi.prototype, 'classList', {
    get: function get() {
      if (!this._classList) {
        this._classList = new DomApi.ClassList(this);
      }
      return this._classList;
    },
    configurable: true
  });
  DomApi.ClassList = function (host) {
    this.domApi = host;
    this.node = host.node;
  };
  DomApi.ClassList.prototype = {
    add: function add() {
      this.node.classList.add.apply(this.node.classList, arguments);
      this._distributeParent();
    },
    remove: function remove() {
      this.node.classList.remove.apply(this.node.classList, arguments);
      this._distributeParent();
    },
    toggle: function toggle() {
      this.node.classList.toggle.apply(this.node.classList, arguments);
      this._distributeParent();
    },
    _distributeParent: function _distributeParent() {
      if (!useShadow) {
        this.domApi._maybeDistributeParent();
      }
    },
    contains: function contains() {
      return this.node.classList.contains.apply(this.node.classList, arguments);
    }
  };
})();(function () {
  'use strict';
  var DomApi = Polymer.DomApi.ctor;
  var Settings = Polymer.Settings;
  DomApi.EffectiveNodesObserver = function (domApi) {
    this.domApi = domApi;
    this.node = this.domApi.node;
    this._listeners = [];
  };
  DomApi.EffectiveNodesObserver.prototype = {
    addListener: function addListener(callback) {
      if (!this._isSetup) {
        this._setup();
        this._isSetup = true;
      }
      var listener = {
        fn: callback,
        _nodes: []
      };
      this._listeners.push(listener);
      this._scheduleNotify();
      return listener;
    },
    removeListener: function removeListener(handle) {
      var i = this._listeners.indexOf(handle);
      if (i >= 0) {
        this._listeners.splice(i, 1);
        handle._nodes = [];
      }
      if (!this._hasListeners()) {
        this._cleanup();
        this._isSetup = false;
      }
    },
    _setup: function _setup() {
      this._observeContentElements(this.domApi.childNodes);
    },
    _cleanup: function _cleanup() {
      this._unobserveContentElements(this.domApi.childNodes);
    },
    _hasListeners: function _hasListeners() {
      return Boolean(this._listeners.length);
    },
    _scheduleNotify: function _scheduleNotify() {
      if (this._debouncer) {
        this._debouncer.stop();
      }
      this._debouncer = Polymer.Debounce(this._debouncer, this._notify);
      this._debouncer.context = this;
      Polymer.dom.addDebouncer(this._debouncer);
    },
    notify: function notify() {
      if (this._hasListeners()) {
        this._scheduleNotify();
      }
    },
    _notify: function _notify() {
      this._beforeCallListeners();
      this._callListeners();
    },
    _beforeCallListeners: function _beforeCallListeners() {
      this._updateContentElements();
    },
    _updateContentElements: function _updateContentElements() {
      this._observeContentElements(this.domApi.childNodes);
    },
    _observeContentElements: function _observeContentElements(elements) {
      for (var i = 0, n; i < elements.length && (n = elements[i]); i++) {
        if (this._isContent(n)) {
          n.__observeNodesMap = n.__observeNodesMap || new WeakMap();
          if (!n.__observeNodesMap.has(this)) {
            n.__observeNodesMap.set(this, this._observeContent(n));
          }
        }
      }
    },
    _observeContent: function _observeContent(content) {
      var self = this;
      var h = Polymer.dom(content).observeNodes(function () {
        self._scheduleNotify();
      });
      h._avoidChangeCalculation = true;
      return h;
    },
    _unobserveContentElements: function _unobserveContentElements(elements) {
      for (var i = 0, n, h; i < elements.length && (n = elements[i]); i++) {
        if (this._isContent(n)) {
          h = n.__observeNodesMap.get(this);
          if (h) {
            Polymer.dom(n).unobserveNodes(h);
            n.__observeNodesMap['delete'](this);
          }
        }
      }
    },
    _isContent: function _isContent(node) {
      return node.localName === 'content';
    },
    _callListeners: function _callListeners() {
      var o$ = this._listeners;
      var nodes = this._getEffectiveNodes();
      for (var i = 0, o; i < o$.length && (o = o$[i]); i++) {
        var info = this._generateListenerInfo(o, nodes);
        if (info || o._alwaysNotify) {
          this._callListener(o, info);
        }
      }
    },
    _getEffectiveNodes: function _getEffectiveNodes() {
      return this.domApi.getEffectiveChildNodes();
    },
    _generateListenerInfo: function _generateListenerInfo(listener, newNodes) {
      if (listener._avoidChangeCalculation) {
        return true;
      }
      var oldNodes = listener._nodes;
      var info = {
        target: this.node,
        addedNodes: [],
        removedNodes: []
      };
      var splices = Polymer.ArraySplice.calculateSplices(newNodes, oldNodes);
      for (var i = 0, s; i < splices.length && (s = splices[i]); i++) {
        for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
          info.removedNodes.push(n);
        }
      }
      for (i = 0, s; i < splices.length && (s = splices[i]); i++) {
        for (j = s.index; j < s.index + s.addedCount; j++) {
          info.addedNodes.push(newNodes[j]);
        }
      }
      listener._nodes = newNodes;
      if (info.addedNodes.length || info.removedNodes.length) {
        return info;
      }
    },
    _callListener: function _callListener(listener, info) {
      return listener.fn.call(this.node, info);
    },
    enableShadowAttributeTracking: function enableShadowAttributeTracking() {}
  };
  if (Settings.useShadow) {
    var baseSetup = DomApi.EffectiveNodesObserver.prototype._setup;
    var baseCleanup = DomApi.EffectiveNodesObserver.prototype._cleanup;
    Polymer.Base.extend(DomApi.EffectiveNodesObserver.prototype, {
      _setup: function _setup() {
        if (!this._observer) {
          var self = this;
          this._mutationHandler = function (mxns) {
            if (mxns && mxns.length) {
              self._scheduleNotify();
            }
          };
          this._observer = new MutationObserver(this._mutationHandler);
          this._boundFlush = function () {
            self._flush();
          };
          Polymer.dom.addStaticFlush(this._boundFlush);
          this._observer.observe(this.node, { childList: true });
        }
        baseSetup.call(this);
      },
      _cleanup: function _cleanup() {
        this._observer.disconnect();
        this._observer = null;
        this._mutationHandler = null;
        Polymer.dom.removeStaticFlush(this._boundFlush);
        baseCleanup.call(this);
      },
      _flush: function _flush() {
        if (this._observer) {
          this._mutationHandler(this._observer.takeRecords());
        }
      },
      enableShadowAttributeTracking: function enableShadowAttributeTracking() {
        if (this._observer) {
          this._makeContentListenersAlwaysNotify();
          this._observer.disconnect();
          this._observer.observe(this.node, {
            childList: true,
            attributes: true,
            subtree: true
          });
          var root = this.domApi.getOwnerRoot();
          var host = root && root.host;
          if (host && Polymer.dom(host).observer) {
            Polymer.dom(host).observer.enableShadowAttributeTracking();
          }
        }
      },
      _makeContentListenersAlwaysNotify: function _makeContentListenersAlwaysNotify() {
        for (var i = 0, h; i < this._listeners.length; i++) {
          h = this._listeners[i];
          h._alwaysNotify = h._isContentListener;
        }
      }
    });
  }
})();(function () {
  'use strict';
  var DomApi = Polymer.DomApi.ctor;
  var Settings = Polymer.Settings;
  DomApi.DistributedNodesObserver = function (domApi) {
    DomApi.EffectiveNodesObserver.call(this, domApi);
  };
  DomApi.DistributedNodesObserver.prototype = Object.create(DomApi.EffectiveNodesObserver.prototype);
  Polymer.Base.extend(DomApi.DistributedNodesObserver.prototype, {
    _setup: function _setup() {},
    _cleanup: function _cleanup() {},
    _beforeCallListeners: function _beforeCallListeners() {},
    _getEffectiveNodes: function _getEffectiveNodes() {
      return this.domApi.getDistributedNodes();
    }
  });
  if (Settings.useShadow) {
    Polymer.Base.extend(DomApi.DistributedNodesObserver.prototype, {
      _setup: function _setup() {
        if (!this._observer) {
          var root = this.domApi.getOwnerRoot();
          var host = root && root.host;
          if (host) {
            var self = this;
            this._observer = Polymer.dom(host).observeNodes(function () {
              self._scheduleNotify();
            });
            this._observer._isContentListener = true;
            if (this._hasAttrSelect()) {
              Polymer.dom(host).observer.enableShadowAttributeTracking();
            }
          }
        }
      },
      _hasAttrSelect: function _hasAttrSelect() {
        var select = this.node.getAttribute('select');
        return select && select.match(/[[.]+/);
      },
      _cleanup: function _cleanup() {
        var root = this.domApi.getOwnerRoot();
        var host = root && root.host;
        if (host) {
          Polymer.dom(host).unobserveNodes(this._observer);
        }
        this._observer = null;
      }
    });
  }
})();(function () {
  var DomApi = Polymer.DomApi;
  var TreeApi = Polymer.TreeApi;
  Polymer.Base._addFeature(Object.defineProperties({
    _prepShady: function _prepShady() {
      this._useContent = this._useContent || Boolean(this._template);
    },
    _setupShady: function _setupShady() {
      this.shadyRoot = null;
      if (!this.__domApi) {
        this.__domApi = null;
      }
      if (!this.__dom) {
        this.__dom = null;
      }
      if (!this._ownerShadyRoot) {
        this._ownerShadyRoot = undefined;
      }
    },
    _poolContent: function _poolContent() {
      if (this._useContent) {
        TreeApi.Logical.saveChildNodes(this);
      }
    },
    _setupRoot: function _setupRoot() {
      if (this._useContent) {
        this._createLocalRoot();
        if (!this.dataHost) {
          upgradeLogicalChildren(TreeApi.Logical.getChildNodes(this));
        }
      }
    },
    _createLocalRoot: function _createLocalRoot() {
      this.shadyRoot = this.root;
      this.shadyRoot._distributionClean = false;
      this.shadyRoot._hasDistributed = false;
      this.shadyRoot._isShadyRoot = true;
      this.shadyRoot._dirtyRoots = [];
      var i$ = this.shadyRoot._insertionPoints = !this._notes || this._notes._hasContent ? this.shadyRoot.querySelectorAll('content') : [];
      TreeApi.Logical.saveChildNodes(this.shadyRoot);
      for (var i = 0, c; i < i$.length; i++) {
        c = i$[i];
        TreeApi.Logical.saveChildNodes(c);
        TreeApi.Logical.saveChildNodes(c.parentNode);
      }
      this.shadyRoot.host = this;
    },

    distributeContent: function distributeContent(updateInsertionPoints) {
      if (this.shadyRoot) {
        this.shadyRoot._invalidInsertionPoints = this.shadyRoot._invalidInsertionPoints || updateInsertionPoints;
        var host = getTopDistributingHost(this);
        Polymer.dom(this)._lazyDistribute(host);
      }
    },
    _distributeContent: function _distributeContent() {
      if (this._useContent && !this.shadyRoot._distributionClean) {
        if (this.shadyRoot._invalidInsertionPoints) {
          Polymer.dom(this)._updateInsertionPoints(this);
          this.shadyRoot._invalidInsertionPoints = false;
        }
        this._beginDistribute();
        this._distributeDirtyRoots();
        this._finishDistribute();
      }
    },
    _beginDistribute: function _beginDistribute() {
      if (this._useContent && DomApi.hasInsertionPoint(this.shadyRoot)) {
        this._resetDistribution();
        this._distributePool(this.shadyRoot, this._collectPool());
      }
    },
    _distributeDirtyRoots: function _distributeDirtyRoots() {
      var c$ = this.shadyRoot._dirtyRoots;
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        c._distributeContent();
      }
      this.shadyRoot._dirtyRoots = [];
    },
    _finishDistribute: function _finishDistribute() {
      if (this._useContent) {
        this.shadyRoot._distributionClean = true;
        if (DomApi.hasInsertionPoint(this.shadyRoot)) {
          this._composeTree();
          notifyContentObservers(this.shadyRoot);
        } else {
          if (!this.shadyRoot._hasDistributed) {
            TreeApi.Composed.clearChildNodes(this);
            this.appendChild(this.shadyRoot);
          } else {
            var children = this._composeNode(this);
            this._updateChildNodes(this, children);
          }
        }
        if (!this.shadyRoot._hasDistributed) {
          notifyInitialDistribution(this);
        }
        this.shadyRoot._hasDistributed = true;
      }
    },
    elementMatches: function elementMatches(selector, node) {
      node = node || this;
      return DomApi.matchesSelector.call(node, selector);
    },
    _resetDistribution: function _resetDistribution() {
      var children = TreeApi.Logical.getChildNodes(this);
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child._destinationInsertionPoints) {
          child._destinationInsertionPoints = undefined;
        }
        if (isInsertionPoint(child)) {
          clearDistributedDestinationInsertionPoints(child);
        }
      }
      var root = this.shadyRoot;
      var p$ = root._insertionPoints;
      for (var j = 0; j < p$.length; j++) {
        p$[j]._distributedNodes = [];
      }
    },
    _collectPool: function _collectPool() {
      var pool = [];
      var children = TreeApi.Logical.getChildNodes(this);
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (isInsertionPoint(child)) {
          pool.push.apply(pool, child._distributedNodes);
        } else {
          pool.push(child);
        }
      }
      return pool;
    },
    _distributePool: function _distributePool(node, pool) {
      var p$ = node._insertionPoints;
      for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
        this._distributeInsertionPoint(p, pool);
        maybeRedistributeParent(p, this);
      }
    },
    _distributeInsertionPoint: function _distributeInsertionPoint(content, pool) {
      var anyDistributed = false;
      for (var i = 0, l = pool.length, node; i < l; i++) {
        node = pool[i];
        if (!node) {
          continue;
        }
        if (this._matchesContentSelect(node, content)) {
          distributeNodeInto(node, content);
          pool[i] = undefined;
          anyDistributed = true;
        }
      }
      if (!anyDistributed) {
        var children = TreeApi.Logical.getChildNodes(content);
        for (var j = 0; j < children.length; j++) {
          distributeNodeInto(children[j], content);
        }
      }
    },
    _composeTree: function _composeTree() {
      this._updateChildNodes(this, this._composeNode(this));
      var p$ = this.shadyRoot._insertionPoints;
      for (var i = 0, l = p$.length, p, parent; i < l && (p = p$[i]); i++) {
        parent = TreeApi.Logical.getParentNode(p);
        if (!parent._useContent && parent !== this && parent !== this.shadyRoot) {
          this._updateChildNodes(parent, this._composeNode(parent));
        }
      }
    },
    _composeNode: function _composeNode(node) {
      var children = [];
      var c$ = TreeApi.Logical.getChildNodes(node.shadyRoot || node);
      for (var i = 0; i < c$.length; i++) {
        var child = c$[i];
        if (isInsertionPoint(child)) {
          var distributedNodes = child._distributedNodes;
          for (var j = 0; j < distributedNodes.length; j++) {
            var distributedNode = distributedNodes[j];
            if (isFinalDestination(child, distributedNode)) {
              children.push(distributedNode);
            }
          }
        } else {
          children.push(child);
        }
      }
      return children;
    },
    _updateChildNodes: function _updateChildNodes(container, children) {
      var composed = TreeApi.Composed.getChildNodes(container);
      var splices = Polymer.ArraySplice.calculateSplices(children, composed);
      for (var i = 0, d = 0, s; i < splices.length && (s = splices[i]); i++) {
        for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
          if (TreeApi.Composed.getParentNode(n) === container) {
            TreeApi.Composed.removeChild(container, n);
          }
          composed.splice(s.index + d, 1);
        }
        d -= s.addedCount;
      }
      for (var i = 0, s, next; i < splices.length && (s = splices[i]); i++) {
        next = composed[s.index];
        for (j = s.index, n; j < s.index + s.addedCount; j++) {
          n = children[j];
          TreeApi.Composed.insertBefore(container, n, next);
          composed.splice(j, 0, n);
        }
      }
    },
    _matchesContentSelect: function _matchesContentSelect(node, contentElement) {
      var select = contentElement.getAttribute('select');
      if (!select) {
        return true;
      }
      select = select.trim();
      if (!select) {
        return true;
      }
      if (!(node instanceof Element)) {
        return false;
      }
      var validSelectors = /^(:not\()?[*.#[a-zA-Z_|]/;
      if (!validSelectors.test(select)) {
        return false;
      }
      return this.elementMatches(select, node);
    },
    _elementAdd: function _elementAdd() {},
    _elementRemove: function _elementRemove() {}
  }, {
    domHost: {
      get: function get() {
        var root = Polymer.dom(this).getOwnerRoot();
        return root && root.host;
      },
      configurable: true,
      enumerable: true
    }
  }));
  function distributeNodeInto(child, insertionPoint) {
    insertionPoint._distributedNodes.push(child);
    var points = child._destinationInsertionPoints;
    if (!points) {
      child._destinationInsertionPoints = [insertionPoint];
    } else {
      points.push(insertionPoint);
    }
  }
  function clearDistributedDestinationInsertionPoints(content) {
    var e$ = content._distributedNodes;
    if (e$) {
      for (var i = 0; i < e$.length; i++) {
        var d = e$[i]._destinationInsertionPoints;
        if (d) {
          d.splice(d.indexOf(content) + 1, d.length);
        }
      }
    }
  }
  function maybeRedistributeParent(content, host) {
    var parent = TreeApi.Logical.getParentNode(content);
    if (parent && parent.shadyRoot && DomApi.hasInsertionPoint(parent.shadyRoot) && parent.shadyRoot._distributionClean) {
      parent.shadyRoot._distributionClean = false;
      host.shadyRoot._dirtyRoots.push(parent);
    }
  }
  function isFinalDestination(insertionPoint, node) {
    var points = node._destinationInsertionPoints;
    return points && points[points.length - 1] === insertionPoint;
  }
  function isInsertionPoint(node) {
    return node.localName == 'content';
  }
  function getTopDistributingHost(host) {
    while (host && hostNeedsRedistribution(host)) {
      host = host.domHost;
    }
    return host;
  }
  function hostNeedsRedistribution(host) {
    var c$ = TreeApi.Logical.getChildNodes(host);
    for (var i = 0, c; i < c$.length; i++) {
      c = c$[i];
      if (c.localName && c.localName === 'content') {
        return host.domHost;
      }
    }
  }
  function notifyContentObservers(root) {
    for (var i = 0, c; i < root._insertionPoints.length; i++) {
      c = root._insertionPoints[i];
      if (DomApi.hasApi(c)) {
        Polymer.dom(c).notifyObserver();
      }
    }
  }
  function notifyInitialDistribution(host) {
    if (DomApi.hasApi(host)) {
      Polymer.dom(host).notifyObserver();
    }
  }
  var needsUpgrade = window.CustomElements && !CustomElements.useNative;
  function upgradeLogicalChildren(children) {
    if (needsUpgrade && children) {
      for (var i = 0; i < children.length; i++) {
        CustomElements.upgrade(children[i]);
      }
    }
  }
})();if (Polymer.Settings.useShadow) {
  Polymer.Base._addFeature({
    _poolContent: function _poolContent() {},
    _beginDistribute: function _beginDistribute() {},
    distributeContent: function distributeContent() {},
    _distributeContent: function _distributeContent() {},
    _finishDistribute: function _finishDistribute() {},
    _createLocalRoot: function _createLocalRoot() {
      this.createShadowRoot();
      this.shadowRoot.appendChild(this.root);
      this.root = this.shadowRoot;
    }
  });
}Polymer.Async = {
  _currVal: 0,
  _lastVal: 0,
  _callbacks: [],
  _twiddleContent: 0,
  _twiddle: document.createTextNode(''),
  run: function run(callback, waitTime) {
    if (waitTime > 0) {
      return ~setTimeout(callback, waitTime);
    } else {
      this._twiddle.textContent = this._twiddleContent++;
      this._callbacks.push(callback);
      return this._currVal++;
    }
  },
  cancel: function cancel(handle) {
    if (handle < 0) {
      clearTimeout(~handle);
    } else {
      var idx = handle - this._lastVal;
      if (idx >= 0) {
        if (!this._callbacks[idx]) {
          throw 'invalid async handle: ' + handle;
        }
        this._callbacks[idx] = null;
      }
    }
  },
  _atEndOfMicrotask: function _atEndOfMicrotask() {
    var len = this._callbacks.length;
    for (var i = 0; i < len; i++) {
      var cb = this._callbacks[i];
      if (cb) {
        try {
          cb();
        } catch (e) {
          i++;
          this._callbacks.splice(0, i);
          this._lastVal += i;
          this._twiddle.textContent = this._twiddleContent++;
          throw e;
        }
      }
    }
    this._callbacks.splice(0, len);
    this._lastVal += len;
  }
};
new window.MutationObserver(function () {
  Polymer.Async._atEndOfMicrotask();
}).observe(Polymer.Async._twiddle, { characterData: true });Polymer.Debounce = (function () {
  var Async = Polymer.Async;
  var Debouncer = function Debouncer(context) {
    this.context = context;
    var self = this;
    this.boundComplete = function () {
      self.complete();
    };
  };
  Debouncer.prototype = {
    go: function go(callback, wait) {
      var h;
      this.finish = function () {
        Async.cancel(h);
      };
      h = Async.run(this.boundComplete, wait);
      this.callback = callback;
    },
    stop: function stop() {
      if (this.finish) {
        this.finish();
        this.finish = null;
        this.callback = null;
      }
    },
    complete: function complete() {
      if (this.finish) {
        var callback = this.callback;
        this.stop();
        callback.call(this.context);
      }
    }
  };
  function debounce(debouncer, callback, wait) {
    if (debouncer) {
      debouncer.stop();
    } else {
      debouncer = new Debouncer(this);
    }
    debouncer.go(callback, wait);
    return debouncer;
  }
  return debounce;
})();Polymer.Base._addFeature({
  _setupDebouncers: function _setupDebouncers() {
    this._debouncers = {};
  },
  debounce: function debounce(jobName, callback, wait) {
    return this._debouncers[jobName] = Polymer.Debounce.call(this, this._debouncers[jobName], callback, wait);
  },
  isDebouncerActive: function isDebouncerActive(jobName) {
    var debouncer = this._debouncers[jobName];
    return !!(debouncer && debouncer.finish);
  },
  flushDebouncer: function flushDebouncer(jobName) {
    var debouncer = this._debouncers[jobName];
    if (debouncer) {
      debouncer.complete();
    }
  },
  cancelDebouncer: function cancelDebouncer(jobName) {
    var debouncer = this._debouncers[jobName];
    if (debouncer) {
      debouncer.stop();
    }
  }
});Polymer.DomModule = document.createElement('dom-module');
Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepBehaviors();
    this._prepConstructor();
    this._prepTemplate();
    this._prepShady();
    this._prepPropertyInfo();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addHostAttributes(b.hostAttributes);
  },
  _initFeatures: function _initFeatures() {
    this._registerHost();
    if (this._template) {
      this._poolContent();
      this._beginHosting();
      this._stampTemplate();
      this._endHosting();
    }
    this._marshalHostAttributes();
    this._setupDebouncers();
    this._marshalBehaviors();
    this._tryReady();
  },
  _marshalBehavior: function _marshalBehavior(b) {}
});
Polymer.nar = [];
Polymer.Annotations = {
  parseAnnotations: function parseAnnotations(template) {
    var list = [];
    var content = template._content || template.content;
    this._parseNodeAnnotations(content, list, template.hasAttribute('strip-whitespace'));
    return list;
  },
  _parseNodeAnnotations: function _parseNodeAnnotations(node, list, stripWhiteSpace) {
    return node.nodeType === Node.TEXT_NODE ? this._parseTextNodeAnnotation(node, list) : this._parseElementAnnotations(node, list, stripWhiteSpace);
  },
  _bindingRegex: (function () {
    var IDENT = '(?:' + '[a-zA-Z_$][\\w.:$\\-*]*' + ')';
    var NUMBER = '(?:' + '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?' + ')';
    var SQUOTE_STRING = '(?:' + '\'(?:[^\'\\\\]|\\\\.)*\'' + ')';
    var DQUOTE_STRING = '(?:' + '"(?:[^"\\\\]|\\\\.)*"' + ')';
    var STRING = '(?:' + SQUOTE_STRING + '|' + DQUOTE_STRING + ')';
    var ARGUMENT = '(?:' + IDENT + '|' + NUMBER + '|' + STRING + '\\s*' + ')';
    var ARGUMENTS = '(?:' + ARGUMENT + '(?:,\\s*' + ARGUMENT + ')*' + ')';
    var ARGUMENT_LIST = '(?:' + '\\(\\s*' + '(?:' + ARGUMENTS + '?' + ')' + '\\)\\s*' + ')';
    var BINDING = '(' + IDENT + '\\s*' + ARGUMENT_LIST + '?' + ')';
    var OPEN_BRACKET = '(\\[\\[|{{)' + '\\s*';
    var CLOSE_BRACKET = '(?:]]|}})';
    var NEGATE = '(?:(!)\\s*)?';
    var EXPRESSION = OPEN_BRACKET + NEGATE + BINDING + CLOSE_BRACKET;
    return new RegExp(EXPRESSION, 'g');
  })(),
  _parseBindings: function _parseBindings(text) {
    var re = this._bindingRegex;
    var parts = [];
    var lastIndex = 0;
    var m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > lastIndex) {
        parts.push({ literal: text.slice(lastIndex, m.index) });
      }
      var mode = m[1][0];
      var negate = Boolean(m[2]);
      var value = m[3].trim();
      var customEvent, notifyEvent, colon;
      if (mode == '{' && (colon = value.indexOf('::')) > 0) {
        notifyEvent = value.substring(colon + 2);
        value = value.substring(0, colon);
        customEvent = true;
      }
      parts.push({
        compoundIndex: parts.length,
        value: value,
        mode: mode,
        negate: negate,
        event: notifyEvent,
        customEvent: customEvent
      });
      lastIndex = re.lastIndex;
    }
    if (lastIndex && lastIndex < text.length) {
      var literal = text.substring(lastIndex);
      if (literal) {
        parts.push({ literal: literal });
      }
    }
    if (parts.length) {
      return parts;
    }
  },
  _literalFromParts: function _literalFromParts(parts) {
    var s = '';
    for (var i = 0; i < parts.length; i++) {
      var literal = parts[i].literal;
      s += literal || '';
    }
    return s;
  },
  _parseTextNodeAnnotation: function _parseTextNodeAnnotation(node, list) {
    var parts = this._parseBindings(node.textContent);
    if (parts) {
      node.textContent = this._literalFromParts(parts) || ' ';
      var annote = {
        bindings: [{
          kind: 'text',
          name: 'textContent',
          parts: parts,
          isCompound: parts.length !== 1
        }]
      };
      list.push(annote);
      return annote;
    }
  },
  _parseElementAnnotations: function _parseElementAnnotations(element, list, stripWhiteSpace) {
    var annote = {
      bindings: [],
      events: []
    };
    if (element.localName === 'content') {
      list._hasContent = true;
    }
    this._parseChildNodesAnnotations(element, annote, list, stripWhiteSpace);
    if (element.attributes) {
      this._parseNodeAttributeAnnotations(element, annote, list);
      if (this.prepElement) {
        this.prepElement(element);
      }
    }
    if (annote.bindings.length || annote.events.length || annote.id) {
      list.push(annote);
    }
    return annote;
  },
  _parseChildNodesAnnotations: function _parseChildNodesAnnotations(root, annote, list, stripWhiteSpace) {
    if (root.firstChild) {
      var node = root.firstChild;
      var i = 0;
      while (node) {
        var next = node.nextSibling;
        if (node.localName === 'template' && !node.hasAttribute('preserve-content')) {
          this._parseTemplate(node, i, list, annote);
        }
        if (node.localName == 'slot') {
          node = this._replaceSlotWithContent(node);
        }
        if (node.nodeType === Node.TEXT_NODE) {
          var n = next;
          while (n && n.nodeType === Node.TEXT_NODE) {
            node.textContent += n.textContent;
            next = n.nextSibling;
            root.removeChild(n);
            n = next;
          }
          if (stripWhiteSpace && !node.textContent.trim()) {
            root.removeChild(node);
            i--;
          }
        }
        if (node.parentNode) {
          var childAnnotation = this._parseNodeAnnotations(node, list, stripWhiteSpace);
          if (childAnnotation) {
            childAnnotation.parent = annote;
            childAnnotation.index = i;
          }
        }
        node = next;
        i++;
      }
    }
  },
  _replaceSlotWithContent: function _replaceSlotWithContent(slot) {
    var content = slot.ownerDocument.createElement('content');
    while (slot.firstChild) {
      content.appendChild(slot.firstChild);
    }
    var attrs = slot.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      content.setAttribute(attr.name, attr.value);
    }
    var name = slot.getAttribute('name');
    if (name) {
      content.setAttribute('select', '[slot=\'' + name + '\']');
    }
    slot.parentNode.replaceChild(content, slot);
    return content;
  },
  _parseTemplate: function _parseTemplate(node, index, list, parent) {
    var content = document.createDocumentFragment();
    content._notes = this.parseAnnotations(node);
    content.appendChild(node.content);
    list.push({
      bindings: Polymer.nar,
      events: Polymer.nar,
      templateContent: content,
      parent: parent,
      index: index
    });
  },
  _parseNodeAttributeAnnotations: function _parseNodeAttributeAnnotations(node, annotation) {
    var attrs = Array.prototype.slice.call(node.attributes);
    for (var i = attrs.length - 1, a; a = attrs[i]; i--) {
      var n = a.name;
      var v = a.value;
      var b;
      if (n.slice(0, 3) === 'on-') {
        node.removeAttribute(n);
        annotation.events.push({
          name: n.slice(3),
          value: v
        });
      } else if (b = this._parseNodeAttributeAnnotation(node, n, v)) {
        annotation.bindings.push(b);
      } else if (n === 'id') {
        annotation.id = v;
      }
    }
  },
  _parseNodeAttributeAnnotation: function _parseNodeAttributeAnnotation(node, name, value) {
    var parts = this._parseBindings(value);
    if (parts) {
      var origName = name;
      var kind = 'property';
      if (name[name.length - 1] == '$') {
        name = name.slice(0, -1);
        kind = 'attribute';
      }
      var literal = this._literalFromParts(parts);
      if (literal && kind == 'attribute') {
        node.setAttribute(name, literal);
      }
      if (node.localName === 'input' && origName === 'value') {
        node.setAttribute(origName, '');
      }
      node.removeAttribute(origName);
      var propertyName = Polymer.CaseMap.dashToCamelCase(name);
      if (kind === 'property') {
        name = propertyName;
      }
      return {
        kind: kind,
        name: name,
        propertyName: propertyName,
        parts: parts,
        literal: literal,
        isCompound: parts.length !== 1
      };
    }
  },
  findAnnotatedNode: function findAnnotatedNode(root, annote) {
    var parent = annote.parent && Polymer.Annotations.findAnnotatedNode(root, annote.parent);
    if (parent) {
      for (var n = parent.firstChild, i = 0; n; n = n.nextSibling) {
        if (annote.index === i++) {
          return n;
        }
      }
    } else {
      return root;
    }
  }
};(function () {
  function resolveCss(cssText, ownerDocument) {
    return cssText.replace(CSS_URL_RX, function (m, pre, url, post) {
      return pre + '\'' + resolve(url.replace(/["']/g, ''), ownerDocument) + '\'' + post;
    });
  }
  function resolveAttrs(element, ownerDocument) {
    for (var name in URL_ATTRS) {
      var a$ = URL_ATTRS[name];
      for (var i = 0, l = a$.length, a, at, v; i < l && (a = a$[i]); i++) {
        if (name === '*' || element.localName === name) {
          at = element.attributes[a];
          v = at && at.value;
          if (v && v.search(BINDING_RX) < 0) {
            at.value = a === 'style' ? resolveCss(v, ownerDocument) : resolve(v, ownerDocument);
          }
        }
      }
    }
  }
  function resolve(url, ownerDocument) {
    if (url && ABS_URL.test(url)) {
      return url;
    }
    var resolver = getUrlResolver(ownerDocument);
    resolver.href = url;
    return resolver.href || url;
  }
  var tempDoc;
  var tempDocBase;
  function resolveUrl(url, baseUri) {
    if (!tempDoc) {
      tempDoc = document.implementation.createHTMLDocument('temp');
      tempDocBase = tempDoc.createElement('base');
      tempDoc.head.appendChild(tempDocBase);
    }
    tempDocBase.href = baseUri;
    return resolve(url, tempDoc);
  }
  function getUrlResolver(ownerDocument) {
    return ownerDocument.body.__urlResolver || (ownerDocument.body.__urlResolver = ownerDocument.createElement('a'));
  }
  var CSS_URL_RX = /(url\()([^)]*)(\))/g;
  var URL_ATTRS = {
    '*': ['href', 'src', 'style', 'url'],
    form: ['action']
  };
  var ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
  var BINDING_RX = /\{\{|\[\[/;
  Polymer.ResolveUrl = {
    resolveCss: resolveCss,
    resolveAttrs: resolveAttrs,
    resolveUrl: resolveUrl
  };
})();Polymer.Path = {
  root: function root(path) {
    var dotIndex = path.indexOf('.');
    if (dotIndex === -1) {
      return path;
    }
    return path.slice(0, dotIndex);
  },
  isDeep: function isDeep(path) {
    return path.indexOf('.') !== -1;
  },
  isAncestor: function isAncestor(base, path) {
    return base.indexOf(path + '.') === 0;
  },
  isDescendant: function isDescendant(base, path) {
    return path.indexOf(base + '.') === 0;
  },
  translate: function translate(base, newBase, path) {
    return newBase + path.slice(base.length);
  },
  matches: function matches(base, wildcard, path) {
    return base === path || this.isAncestor(base, path) || Boolean(wildcard) && this.isDescendant(base, path);
  }
};Polymer.Base._addFeature({
  _prepAnnotations: function _prepAnnotations() {
    if (!this._template) {
      this._notes = [];
    } else {
      var self = this;
      Polymer.Annotations.prepElement = function (element) {
        self._prepElement(element);
      };
      if (this._template._content && this._template._content._notes) {
        this._notes = this._template._content._notes;
      } else {
        this._notes = Polymer.Annotations.parseAnnotations(this._template);
        this._processAnnotations(this._notes);
      }
      Polymer.Annotations.prepElement = null;
    }
  },
  _processAnnotations: function _processAnnotations(notes) {
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      for (var j = 0; j < note.bindings.length; j++) {
        var b = note.bindings[j];
        for (var k = 0; k < b.parts.length; k++) {
          var p = b.parts[k];
          if (!p.literal) {
            var signature = this._parseMethod(p.value);
            if (signature) {
              p.signature = signature;
            } else {
              p.model = Polymer.Path.root(p.value);
            }
          }
        }
      }
      if (note.templateContent) {
        this._processAnnotations(note.templateContent._notes);
        var pp = note.templateContent._parentProps = this._discoverTemplateParentProps(note.templateContent._notes);
        var bindings = [];
        for (var prop in pp) {
          var name = '_parent_' + prop;
          bindings.push({
            index: note.index,
            kind: 'property',
            name: name,
            propertyName: name,
            parts: [{
              mode: '{',
              model: prop,
              value: prop
            }]
          });
        }
        note.bindings = note.bindings.concat(bindings);
      }
    }
  },
  _discoverTemplateParentProps: function _discoverTemplateParentProps(notes) {
    var pp = {};
    for (var i = 0, n; i < notes.length && (n = notes[i]); i++) {
      for (var j = 0, b$ = n.bindings, b; j < b$.length && (b = b$[j]); j++) {
        for (var k = 0, p$ = b.parts, p; k < p$.length && (p = p$[k]); k++) {
          if (p.signature) {
            var args = p.signature.args;
            for (var kk = 0; kk < args.length; kk++) {
              var model = args[kk].model;
              if (model) {
                pp[model] = true;
              }
            }
            if (p.signature.dynamicFn) {
              pp[p.signature.method] = true;
            }
          } else {
            if (p.model) {
              pp[p.model] = true;
            }
          }
        }
      }
      if (n.templateContent) {
        var tpp = n.templateContent._parentProps;
        Polymer.Base.mixin(pp, tpp);
      }
    }
    return pp;
  },
  _prepElement: function _prepElement(element) {
    Polymer.ResolveUrl.resolveAttrs(element, this._template.ownerDocument);
  },
  _findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,
  _marshalAnnotationReferences: function _marshalAnnotationReferences() {
    if (this._template) {
      this._marshalIdNodes();
      this._marshalAnnotatedNodes();
      this._marshalAnnotatedListeners();
    }
  },
  _configureAnnotationReferences: function _configureAnnotationReferences() {
    var notes = this._notes;
    var nodes = this._nodes;
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var node = nodes[i];
      this._configureTemplateContent(note, node);
      this._configureCompoundBindings(note, node);
    }
  },
  _configureTemplateContent: function _configureTemplateContent(note, node) {
    if (note.templateContent) {
      node._content = note.templateContent;
    }
  },
  _configureCompoundBindings: function _configureCompoundBindings(note, node) {
    var bindings = note.bindings;
    for (var i = 0; i < bindings.length; i++) {
      var binding = bindings[i];
      if (binding.isCompound) {
        var storage = node.__compoundStorage__ || (node.__compoundStorage__ = {});
        var parts = binding.parts;
        var literals = new Array(parts.length);
        for (var j = 0; j < parts.length; j++) {
          literals[j] = parts[j].literal;
        }
        var name = binding.name;
        storage[name] = literals;
        if (binding.literal && binding.kind == 'property') {
          if (node._configValue) {
            node._configValue(name, binding.literal);
          } else {
            node[name] = binding.literal;
          }
        }
      }
    }
  },
  _marshalIdNodes: function _marshalIdNodes() {
    this.$ = {};
    for (var i = 0, l = this._notes.length, a; i < l && (a = this._notes[i]); i++) {
      if (a.id) {
        this.$[a.id] = this._findAnnotatedNode(this.root, a);
      }
    }
  },
  _marshalAnnotatedNodes: function _marshalAnnotatedNodes() {
    if (this._notes && this._notes.length) {
      var r = new Array(this._notes.length);
      for (var i = 0; i < this._notes.length; i++) {
        r[i] = this._findAnnotatedNode(this.root, this._notes[i]);
      }
      this._nodes = r;
    }
  },
  _marshalAnnotatedListeners: function _marshalAnnotatedListeners() {
    for (var i = 0, l = this._notes.length, a; i < l && (a = this._notes[i]); i++) {
      if (a.events && a.events.length) {
        var node = this._findAnnotatedNode(this.root, a);
        for (var j = 0, e$ = a.events, e; j < e$.length && (e = e$[j]); j++) {
          this.listen(node, e.name, e.value);
        }
      }
    }
  }
});Polymer.Base._addFeature({
  listeners: {},
  _listenListeners: function _listenListeners(listeners) {
    var node, name, eventName;
    for (eventName in listeners) {
      if (eventName.indexOf('.') < 0) {
        node = this;
        name = eventName;
      } else {
        name = eventName.split('.');
        node = this.$[name[0]];
        name = name[1];
      }
      this.listen(node, name, listeners[eventName]);
    }
  },
  listen: function listen(node, eventName, methodName) {
    var handler = this._recallEventHandler(this, eventName, node, methodName);
    if (!handler) {
      handler = this._createEventHandler(node, eventName, methodName);
    }
    if (handler._listening) {
      return;
    }
    this._listen(node, eventName, handler);
    handler._listening = true;
  },
  _boundListenerKey: function _boundListenerKey(eventName, methodName) {
    return eventName + ':' + methodName;
  },
  _recordEventHandler: function _recordEventHandler(host, eventName, target, methodName, handler) {
    var hbl = host.__boundListeners;
    if (!hbl) {
      hbl = host.__boundListeners = new WeakMap();
    }
    var bl = hbl.get(target);
    if (!bl) {
      bl = {};
      if (!Polymer.Settings.isIE || target != window) {
        hbl.set(target, bl);
      }
    }
    var key = this._boundListenerKey(eventName, methodName);
    bl[key] = handler;
  },
  _recallEventHandler: function _recallEventHandler(host, eventName, target, methodName) {
    var hbl = host.__boundListeners;
    if (!hbl) {
      return;
    }
    var bl = hbl.get(target);
    if (!bl) {
      return;
    }
    var key = this._boundListenerKey(eventName, methodName);
    return bl[key];
  },
  _createEventHandler: function _createEventHandler(node, eventName, methodName) {
    var host = this;
    var handler = function handler(e) {
      if (host[methodName]) {
        host[methodName](e, e.detail);
      } else {
        host._warn(host._logf('_createEventHandler', 'listener method `' + methodName + '` not defined'));
      }
    };
    handler._listening = false;
    this._recordEventHandler(host, eventName, node, methodName, handler);
    return handler;
  },
  unlisten: function unlisten(node, eventName, methodName) {
    var handler = this._recallEventHandler(this, eventName, node, methodName);
    if (handler) {
      this._unlisten(node, eventName, handler);
      handler._listening = false;
    }
  },
  _listen: function _listen(node, eventName, handler) {
    node.addEventListener(eventName, handler);
  },
  _unlisten: function _unlisten(node, eventName, handler) {
    node.removeEventListener(eventName, handler);
  }
});(function () {
  'use strict';
  var wrap = Polymer.DomApi.wrap;
  var HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  var GESTURE_KEY = '__polymerGestures';
  var HANDLED_OBJ = '__polymerGesturesHandled';
  var TOUCH_ACTION = '__polymerGesturesTouchAction';
  var TAP_DISTANCE = 25;
  var TRACK_DISTANCE = 5;
  var TRACK_LENGTH = 2;
  var MOUSE_TIMEOUT = 2500;
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
  var MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
  var MOUSE_HAS_BUTTONS = (function () {
    try {
      return new MouseEvent('test', { buttons: 1 }).buttons === 1;
    } catch (e) {
      return false;
    }
  })();
  var SUPPORTS_PASSIVE = false;
  (function () {
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          SUPPORTS_PASSIVE = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}
  })();
  var IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);
  var mouseCanceller = function mouseCanceller(mouseEvent) {
    var sc = mouseEvent.sourceCapabilities;
    if (sc && !sc.firesTouchEvents) {
      return;
    }
    mouseEvent[HANDLED_OBJ] = { skip: true };
    if (mouseEvent.type === 'click') {
      var path = Polymer.dom(mouseEvent).path;
      for (var i = 0; i < path.length; i++) {
        if (path[i] === POINTERSTATE.mouse.target) {
          return;
        }
      }
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }
  };
  function setupTeardownMouseCanceller(setup) {
    var events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;
    for (var i = 0, en; i < events.length; i++) {
      en = events[i];
      if (setup) {
        document.addEventListener(en, mouseCanceller, true);
      } else {
        document.removeEventListener(en, mouseCanceller, true);
      }
    }
  }
  function ignoreMouse(ev) {
    if (!POINTERSTATE.mouse.mouseIgnoreJob) {
      setupTeardownMouseCanceller(true);
    }
    var unset = function unset() {
      setupTeardownMouseCanceller();
      POINTERSTATE.mouse.target = null;
      POINTERSTATE.mouse.mouseIgnoreJob = null;
    };
    POINTERSTATE.mouse.target = Polymer.dom(ev).rootTarget;
    POINTERSTATE.mouse.mouseIgnoreJob = Polymer.Debounce(POINTERSTATE.mouse.mouseIgnoreJob, unset, MOUSE_TIMEOUT);
  }
  function hasLeftMouseButton(ev) {
    var type = ev.type;
    if (MOUSE_EVENTS.indexOf(type) === -1) {
      return false;
    }
    if (type === 'mousemove') {
      var buttons = ev.buttons === undefined ? 1 : ev.buttons;
      if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
        buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
      }
      return Boolean(buttons & 1);
    } else {
      var button = ev.button === undefined ? 0 : ev.button;
      return button === 0;
    }
  }
  function isSyntheticClick(ev) {
    if (ev.type === 'click') {
      if (ev.detail === 0) {
        return true;
      }
      var t = Gestures.findOriginalTarget(ev);
      var bcr = t.getBoundingClientRect();
      var x = ev.pageX,
          y = ev.pageY;
      return !(x >= bcr.left && x <= bcr.right && y >= bcr.top && y <= bcr.bottom);
    }
    return false;
  }
  var POINTERSTATE = {
    mouse: {
      target: null,
      mouseIgnoreJob: null
    },
    touch: {
      x: 0,
      y: 0,
      id: -1,
      scrollDecided: false
    }
  };
  function firstTouchAction(ev) {
    var path = Polymer.dom(ev).path;
    var ta = 'auto';
    for (var i = 0, n; i < path.length; i++) {
      n = path[i];
      if (n[TOUCH_ACTION]) {
        ta = n[TOUCH_ACTION];
        break;
      }
    }
    return ta;
  }
  function trackDocument(stateObj, movefn, upfn) {
    stateObj.movefn = movefn;
    stateObj.upfn = upfn;
    document.addEventListener('mousemove', movefn);
    document.addEventListener('mouseup', upfn);
  }
  function untrackDocument(stateObj) {
    document.removeEventListener('mousemove', stateObj.movefn);
    document.removeEventListener('mouseup', stateObj.upfn);
    stateObj.movefn = null;
    stateObj.upfn = null;
  }
  document.addEventListener('touchend', ignoreMouse, SUPPORTS_PASSIVE ? { passive: true } : false);
  var Gestures = {
    gestures: {},
    recognizers: [],
    deepTargetFind: function deepTargetFind(x, y) {
      var node = document.elementFromPoint(x, y);
      var next = node;
      while (next && next.shadowRoot) {
        next = next.shadowRoot.elementFromPoint(x, y);
        if (next) {
          node = next;
        }
      }
      return node;
    },
    findOriginalTarget: function findOriginalTarget(ev) {
      if (ev.path) {
        return ev.path[0];
      }
      return ev.target;
    },
    handleNative: function handleNative(ev) {
      var handled;
      var type = ev.type;
      var node = wrap(ev.currentTarget);
      var gobj = node[GESTURE_KEY];
      if (!gobj) {
        return;
      }
      var gs = gobj[type];
      if (!gs) {
        return;
      }
      if (!ev[HANDLED_OBJ]) {
        ev[HANDLED_OBJ] = {};
        if (type.slice(0, 5) === 'touch') {
          var t = ev.changedTouches[0];
          if (type === 'touchstart') {
            if (ev.touches.length === 1) {
              POINTERSTATE.touch.id = t.identifier;
            }
          }
          if (POINTERSTATE.touch.id !== t.identifier) {
            return;
          }
          if (!HAS_NATIVE_TA) {
            if (type === 'touchstart' || type === 'touchmove') {
              Gestures.handleTouchAction(ev);
            }
          }
        }
      }
      handled = ev[HANDLED_OBJ];
      if (handled.skip) {
        return;
      }
      var recognizers = Gestures.recognizers;
      for (var i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name] && !handled[r.name]) {
          if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
            r.reset();
          }
        }
      }
      for (i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name] && !handled[r.name]) {
          handled[r.name] = true;
          r[type](ev);
        }
      }
    },
    handleTouchAction: function handleTouchAction(ev) {
      var t = ev.changedTouches[0];
      var type = ev.type;
      if (type === 'touchstart') {
        POINTERSTATE.touch.x = t.clientX;
        POINTERSTATE.touch.y = t.clientY;
        POINTERSTATE.touch.scrollDecided = false;
      } else if (type === 'touchmove') {
        if (POINTERSTATE.touch.scrollDecided) {
          return;
        }
        POINTERSTATE.touch.scrollDecided = true;
        var ta = firstTouchAction(ev);
        var prevent = false;
        var dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
        var dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
        if (!ev.cancelable) {} else if (ta === 'none') {
          prevent = true;
        } else if (ta === 'pan-x') {
          prevent = dy > dx;
        } else if (ta === 'pan-y') {
          prevent = dx > dy;
        }
        if (prevent) {
          ev.preventDefault();
        } else {
          Gestures.prevent('track');
        }
      }
    },
    add: function add(node, evType, handler) {
      node = wrap(node);
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (!gobj) {
        node[GESTURE_KEY] = gobj = {};
      }
      for (var i = 0, dep, gd; i < deps.length; i++) {
        dep = deps[i];
        if (IS_TOUCH_ONLY && MOUSE_EVENTS.indexOf(dep) > -1 && dep !== 'click') {
          continue;
        }
        gd = gobj[dep];
        if (!gd) {
          gobj[dep] = gd = { _count: 0 };
        }
        if (gd._count === 0) {
          node.addEventListener(dep, this.handleNative);
        }
        gd[name] = (gd[name] || 0) + 1;
        gd._count = (gd._count || 0) + 1;
      }
      node.addEventListener(evType, handler);
      if (recognizer.touchAction) {
        this.setTouchAction(node, recognizer.touchAction);
      }
    },
    remove: function remove(node, evType, handler) {
      node = wrap(node);
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (gobj) {
        for (var i = 0, dep, gd; i < deps.length; i++) {
          dep = deps[i];
          gd = gobj[dep];
          if (gd && gd[name]) {
            gd[name] = (gd[name] || 1) - 1;
            gd._count = (gd._count || 1) - 1;
            if (gd._count === 0) {
              node.removeEventListener(dep, this.handleNative);
            }
          }
        }
      }
      node.removeEventListener(evType, handler);
    },
    register: function register(recog) {
      this.recognizers.push(recog);
      for (var i = 0; i < recog.emits.length; i++) {
        this.gestures[recog.emits[i]] = recog;
      }
    },
    findRecognizerByEvent: function findRecognizerByEvent(evName) {
      for (var i = 0, r; i < this.recognizers.length; i++) {
        r = this.recognizers[i];
        for (var j = 0, n; j < r.emits.length; j++) {
          n = r.emits[j];
          if (n === evName) {
            return r;
          }
        }
      }
      return null;
    },
    setTouchAction: function setTouchAction(node, value) {
      if (HAS_NATIVE_TA) {
        node.style.touchAction = value;
      }
      node[TOUCH_ACTION] = value;
    },
    fire: function fire(target, type, detail) {
      var ev = Polymer.Base.fire(type, detail, {
        node: target,
        bubbles: true,
        cancelable: true
      });
      if (ev.defaultPrevented) {
        var preventer = detail.preventer || detail.sourceEvent;
        if (preventer && preventer.preventDefault) {
          preventer.preventDefault();
        }
      }
    },
    prevent: function prevent(evName) {
      var recognizer = this.findRecognizerByEvent(evName);
      if (recognizer.info) {
        recognizer.info.prevent = true;
      }
    },
    resetMouseCanceller: function resetMouseCanceller() {
      if (POINTERSTATE.mouse.mouseIgnoreJob) {
        POINTERSTATE.mouse.mouseIgnoreJob.complete();
      }
    }
  };
  Gestures.register({
    name: 'downup',
    deps: ['mousedown', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['down', 'up'],
    info: {
      movefn: null,
      upfn: null
    },
    reset: function reset() {
      untrackDocument(this.info);
    },
    mousedown: function mousedown(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      var t = Gestures.findOriginalTarget(e);
      var self = this;
      var movefn = function movefn(e) {
        if (!hasLeftMouseButton(e)) {
          self.fire('up', t, e);
          untrackDocument(self.info);
        }
      };
      var upfn = function upfn(e) {
        if (hasLeftMouseButton(e)) {
          self.fire('up', t, e);
        }
        untrackDocument(self.info);
      };
      trackDocument(this.info, movefn, upfn);
      this.fire('down', t, e);
    },
    touchstart: function touchstart(e) {
      this.fire('down', Gestures.findOriginalTarget(e), e.changedTouches[0], e);
    },
    touchend: function touchend(e) {
      this.fire('up', Gestures.findOriginalTarget(e), e.changedTouches[0], e);
    },
    fire: function fire(type, target, event, preventer) {
      Gestures.fire(target, type, {
        x: event.clientX,
        y: event.clientY,
        sourceEvent: event,
        preventer: preventer,
        prevent: function prevent(e) {
          return Gestures.prevent(e);
        }
      });
    }
  });
  Gestures.register({
    name: 'track',
    touchAction: 'none',
    deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['track'],
    info: {
      x: 0,
      y: 0,
      state: 'start',
      started: false,
      moves: [],
      addMove: function addMove(move) {
        if (this.moves.length > TRACK_LENGTH) {
          this.moves.shift();
        }
        this.moves.push(move);
      },
      movefn: null,
      upfn: null,
      prevent: false
    },
    reset: function reset() {
      this.info.state = 'start';
      this.info.started = false;
      this.info.moves = [];
      this.info.x = 0;
      this.info.y = 0;
      this.info.prevent = false;
      untrackDocument(this.info);
    },
    hasMovedEnough: function hasMovedEnough(x, y) {
      if (this.info.prevent) {
        return false;
      }
      if (this.info.started) {
        return true;
      }
      var dx = Math.abs(this.info.x - x);
      var dy = Math.abs(this.info.y - y);
      return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
    },
    mousedown: function mousedown(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      var t = Gestures.findOriginalTarget(e);
      var self = this;
      var movefn = function movefn(e) {
        var x = e.clientX,
            y = e.clientY;
        if (self.hasMovedEnough(x, y)) {
          self.info.state = self.info.started ? e.type === 'mouseup' ? 'end' : 'track' : 'start';
          if (self.info.state === 'start') {
            Gestures.prevent('tap');
          }
          self.info.addMove({
            x: x,
            y: y
          });
          if (!hasLeftMouseButton(e)) {
            self.info.state = 'end';
            untrackDocument(self.info);
          }
          self.fire(t, e);
          self.info.started = true;
        }
      };
      var upfn = function upfn(e) {
        if (self.info.started) {
          movefn(e);
        }
        untrackDocument(self.info);
      };
      trackDocument(this.info, movefn, upfn);
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    touchstart: function touchstart(e) {
      var ct = e.changedTouches[0];
      this.info.x = ct.clientX;
      this.info.y = ct.clientY;
    },
    touchmove: function touchmove(e) {
      var t = Gestures.findOriginalTarget(e);
      var ct = e.changedTouches[0];
      var x = ct.clientX,
          y = ct.clientY;
      if (this.hasMovedEnough(x, y)) {
        if (this.info.state === 'start') {
          Gestures.prevent('tap');
        }
        this.info.addMove({
          x: x,
          y: y
        });
        this.fire(t, ct);
        this.info.state = 'track';
        this.info.started = true;
      }
    },
    touchend: function touchend(e) {
      var t = Gestures.findOriginalTarget(e);
      var ct = e.changedTouches[0];
      if (this.info.started) {
        this.info.state = 'end';
        this.info.addMove({
          x: ct.clientX,
          y: ct.clientY
        });
        this.fire(t, ct, e);
      }
    },
    fire: function fire(target, touch, preventer) {
      var secondlast = this.info.moves[this.info.moves.length - 2];
      var lastmove = this.info.moves[this.info.moves.length - 1];
      var dx = lastmove.x - this.info.x;
      var dy = lastmove.y - this.info.y;
      var ddx,
          ddy = 0;
      if (secondlast) {
        ddx = lastmove.x - secondlast.x;
        ddy = lastmove.y - secondlast.y;
      }
      return Gestures.fire(target, 'track', {
        state: this.info.state,
        x: touch.clientX,
        y: touch.clientY,
        dx: dx,
        dy: dy,
        ddx: ddx,
        ddy: ddy,
        sourceEvent: touch,
        preventer: preventer,
        hover: function hover() {
          return Gestures.deepTargetFind(touch.clientX, touch.clientY);
        }
      });
    }
  });
  Gestures.register({
    name: 'tap',
    deps: ['mousedown', 'click', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['click', 'touchend']
    },
    emits: ['tap'],
    info: {
      x: NaN,
      y: NaN,
      prevent: false
    },
    reset: function reset() {
      this.info.x = NaN;
      this.info.y = NaN;
      this.info.prevent = false;
    },
    save: function save(e) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    mousedown: function mousedown(e) {
      if (hasLeftMouseButton(e)) {
        this.save(e);
      }
    },
    click: function click(e) {
      if (hasLeftMouseButton(e)) {
        this.forward(e);
      }
    },
    touchstart: function touchstart(e) {
      this.save(e.changedTouches[0], e);
    },
    touchend: function touchend(e) {
      this.forward(e.changedTouches[0], e);
    },
    forward: function forward(e, preventer) {
      var dx = Math.abs(e.clientX - this.info.x);
      var dy = Math.abs(e.clientY - this.info.y);
      var t = Gestures.findOriginalTarget(e);
      if (isNaN(dx) || isNaN(dy) || dx <= TAP_DISTANCE && dy <= TAP_DISTANCE || isSyntheticClick(e)) {
        if (!this.info.prevent) {
          Gestures.fire(t, 'tap', {
            x: e.clientX,
            y: e.clientY,
            sourceEvent: e,
            preventer: preventer
          });
        }
      }
    }
  });
  var DIRECTION_MAP = {
    x: 'pan-x',
    y: 'pan-y',
    none: 'none',
    all: 'auto'
  };
  Polymer.Base._addFeature({
    _setupGestures: function _setupGestures() {
      this.__polymerGestures = null;
    },
    _listen: function _listen(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.add(node, eventName, handler);
      } else {
        node.addEventListener(eventName, handler);
      }
    },
    _unlisten: function _unlisten(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.remove(node, eventName, handler);
      } else {
        node.removeEventListener(eventName, handler);
      }
    },
    setScrollDirection: function setScrollDirection(direction, node) {
      node = node || this;
      Gestures.setTouchAction(node, DIRECTION_MAP[direction] || 'auto');
    }
  });
  Polymer.Gestures = Gestures;
})();(function () {
  'use strict';
  Polymer.Base._addFeature({
    $$: function $$(slctr) {
      return Polymer.dom(this.root).querySelector(slctr);
    },
    toggleClass: function toggleClass(name, bool, node) {
      node = node || this;
      if (arguments.length == 1) {
        bool = !node.classList.contains(name);
      }
      if (bool) {
        Polymer.dom(node).classList.add(name);
      } else {
        Polymer.dom(node).classList.remove(name);
      }
    },
    toggleAttribute: function toggleAttribute(name, bool, node) {
      node = node || this;
      if (arguments.length == 1) {
        bool = !node.hasAttribute(name);
      }
      if (bool) {
        Polymer.dom(node).setAttribute(name, '');
      } else {
        Polymer.dom(node).removeAttribute(name);
      }
    },
    classFollows: function classFollows(name, toElement, fromElement) {
      if (fromElement) {
        Polymer.dom(fromElement).classList.remove(name);
      }
      if (toElement) {
        Polymer.dom(toElement).classList.add(name);
      }
    },
    attributeFollows: function attributeFollows(name, toElement, fromElement) {
      if (fromElement) {
        Polymer.dom(fromElement).removeAttribute(name);
      }
      if (toElement) {
        Polymer.dom(toElement).setAttribute(name, '');
      }
    },
    getEffectiveChildNodes: function getEffectiveChildNodes() {
      return Polymer.dom(this).getEffectiveChildNodes();
    },
    getEffectiveChildren: function getEffectiveChildren() {
      var list = Polymer.dom(this).getEffectiveChildNodes();
      return list.filter(function (n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
    },
    getEffectiveTextContent: function getEffectiveTextContent() {
      var cn = this.getEffectiveChildNodes();
      var tc = [];
      for (var i = 0, c; c = cn[i]; i++) {
        if (c.nodeType !== Node.COMMENT_NODE) {
          tc.push(Polymer.dom(c).textContent);
        }
      }
      return tc.join('');
    },
    queryEffectiveChildren: function queryEffectiveChildren(slctr) {
      var e$ = Polymer.dom(this).queryDistributedElements(slctr);
      return e$ && e$[0];
    },
    queryAllEffectiveChildren: function queryAllEffectiveChildren(slctr) {
      return Polymer.dom(this).queryDistributedElements(slctr);
    },
    getContentChildNodes: function getContentChildNodes(slctr) {
      var content = Polymer.dom(this.root).querySelector(slctr || 'content');
      return content ? Polymer.dom(content).getDistributedNodes() : [];
    },
    getContentChildren: function getContentChildren(slctr) {
      return this.getContentChildNodes(slctr).filter(function (n) {
        return n.nodeType === Node.ELEMENT_NODE;
      });
    },
    fire: function fire(type, detail, options) {
      options = options || Polymer.nob;
      var node = options.node || this;
      detail = detail === null || detail === undefined ? {} : detail;
      var bubbles = options.bubbles === undefined ? true : options.bubbles;
      var cancelable = Boolean(options.cancelable);
      var useCache = options._useCache;
      var event = this._getEvent(type, bubbles, cancelable, useCache);
      event.detail = detail;
      if (useCache) {
        this.__eventCache[type] = null;
      }
      node.dispatchEvent(event);
      if (useCache) {
        this.__eventCache[type] = event;
      }
      return event;
    },
    __eventCache: {},
    _getEvent: function _getEvent(type, bubbles, cancelable, useCache) {
      var event = useCache && this.__eventCache[type];
      if (!event || event.bubbles != bubbles || event.cancelable != cancelable) {
        event = new Event(type, {
          bubbles: Boolean(bubbles),
          cancelable: cancelable
        });
      }
      return event;
    },
    async: function async(callback, waitTime) {
      var self = this;
      return Polymer.Async.run(function () {
        callback.call(self);
      }, waitTime);
    },
    cancelAsync: function cancelAsync(handle) {
      Polymer.Async.cancel(handle);
    },
    arrayDelete: function arrayDelete(path, item) {
      var index;
      if (Array.isArray(path)) {
        index = path.indexOf(item);
        if (index >= 0) {
          return path.splice(index, 1);
        }
      } else {
        var arr = this._get(path);
        index = arr.indexOf(item);
        if (index >= 0) {
          return this.splice(path, index, 1);
        }
      }
    },
    transform: function transform(_transform, node) {
      node = node || this;
      node.style.webkitTransform = _transform;
      node.style.transform = _transform;
    },
    translate3d: function translate3d(x, y, z, node) {
      node = node || this;
      this.transform('translate3d(' + x + ',' + y + ',' + z + ')', node);
    },
    importHref: function importHref(href, onload, onerror, optAsync) {
      var link = document.createElement('link');
      link.rel = 'import';
      link.href = href;
      var list = Polymer.Base.importHref.imported = Polymer.Base.importHref.imported || {};
      var cached = list[link.href];
      var imprt = cached || link;
      var self = this;
      var loadListener = function loadListener(e) {
        e.target.__firedLoad = true;
        e.target.removeEventListener('load', loadListener);
        e.target.removeEventListener('error', errorListener);
        return onload.call(self, e);
      };
      var errorListener = function errorListener(e) {
        e.target.__firedError = true;
        e.target.removeEventListener('load', loadListener);
        e.target.removeEventListener('error', errorListener);
        return onerror.call(self, e);
      };
      if (onload) {
        imprt.addEventListener('load', loadListener);
      }
      if (onerror) {
        imprt.addEventListener('error', errorListener);
      }
      if (cached) {
        if (cached.__firedLoad) {
          cached.dispatchEvent(new Event('load'));
        }
        if (cached.__firedError) {
          cached.dispatchEvent(new Event('error'));
        }
      } else {
        list[link.href] = link;
        optAsync = Boolean(optAsync);
        if (optAsync) {
          link.setAttribute('async', '');
        }
        document.head.appendChild(link);
      }
      return imprt;
    },
    create: function create(tag, props) {
      var elt = document.createElement(tag);
      if (props) {
        for (var n in props) {
          elt[n] = props[n];
        }
      }
      return elt;
    },
    isLightDescendant: function isLightDescendant(node) {
      return this !== node && this.contains(node) && Polymer.dom(this).getOwnerRoot() === Polymer.dom(node).getOwnerRoot();
    },
    isLocalDescendant: function isLocalDescendant(node) {
      return this.root === Polymer.dom(node).getOwnerRoot();
    }
  });
  if (!Polymer.Settings.useNativeCustomElements) {
    var importHref = Polymer.Base.importHref;
    Polymer.Base.importHref = function (href, onload, onerror, optAsync) {
      CustomElements.ready = false;
      var loadFn = function loadFn(e) {
        CustomElements.upgradeDocumentTree(document);
        CustomElements.ready = true;
        if (onload) {
          return onload.call(this, e);
        }
      };
      return importHref.call(this, href, loadFn, onerror, optAsync);
    };
  }
})();Polymer.Bind = {
  prepareModel: function prepareModel(model) {
    Polymer.Base.mixin(model, this._modelApi);
  },
  _modelApi: {
    _notifyChange: function _notifyChange(source, event, value) {
      value = value === undefined ? this[source] : value;
      event = event || Polymer.CaseMap.camelToDashCase(source) + '-changed';
      this.fire(event, { value: value }, {
        bubbles: false,
        cancelable: false,
        _useCache: Polymer.Settings.eventDataCache || !Polymer.Settings.isIE
      });
    },
    _propertySetter: function _propertySetter(property, value, effects, fromAbove) {
      var old = this.__data__[property];
      if (old !== value && (old === old || value === value)) {
        this.__data__[property] = value;
        if (typeof value == 'object') {
          this._clearPath(property);
        }
        if (this._propertyChanged) {
          this._propertyChanged(property, value, old);
        }
        if (effects) {
          this._effectEffects(property, value, effects, old, fromAbove);
        }
      }
      return old;
    },
    __setProperty: function __setProperty(property, value, quiet, node) {
      node = node || this;
      var effects = node._propertyEffects && node._propertyEffects[property];
      if (effects) {
        node._propertySetter(property, value, effects, quiet);
      } else if (node[property] !== value) {
        node[property] = value;
      }
    },
    _effectEffects: function _effectEffects(property, value, effects, old, fromAbove) {
      for (var i = 0, l = effects.length, fx; i < l && (fx = effects[i]); i++) {
        fx.fn.call(this, property, this[property], fx.effect, old, fromAbove);
      }
    },
    _clearPath: function _clearPath(path) {
      for (var prop in this.__data__) {
        if (Polymer.Path.isDescendant(path, prop)) {
          this.__data__[prop] = undefined;
        }
      }
    }
  },
  ensurePropertyEffects: function ensurePropertyEffects(model, property) {
    if (!model._propertyEffects) {
      model._propertyEffects = {};
    }
    var fx = model._propertyEffects[property];
    if (!fx) {
      fx = model._propertyEffects[property] = [];
    }
    return fx;
  },
  addPropertyEffect: function addPropertyEffect(model, property, kind, effect) {
    var fx = this.ensurePropertyEffects(model, property);
    var propEffect = {
      kind: kind,
      effect: effect,
      fn: Polymer.Bind['_' + kind + 'Effect']
    };
    fx.push(propEffect);
    return propEffect;
  },
  createBindings: function createBindings(model) {
    var fx$ = model._propertyEffects;
    if (fx$) {
      for (var n in fx$) {
        var fx = fx$[n];
        fx.sort(this._sortPropertyEffects);
        this._createAccessors(model, n, fx);
      }
    }
  },
  _sortPropertyEffects: (function () {
    var EFFECT_ORDER = {
      'compute': 0,
      'annotation': 1,
      'annotatedComputation': 2,
      'reflect': 3,
      'notify': 4,
      'observer': 5,
      'complexObserver': 6,
      'function': 7
    };
    return function (a, b) {
      return EFFECT_ORDER[a.kind] - EFFECT_ORDER[b.kind];
    };
  })(),
  _createAccessors: function _createAccessors(model, property, effects) {
    var defun = {
      get: function get() {
        return this.__data__[property];
      }
    };
    var setter = function setter(value) {
      this._propertySetter(property, value, effects);
    };
    var info = model.getPropertyInfo && model.getPropertyInfo(property);
    if (info && info.readOnly) {
      if (!info.computed) {
        model['_set' + this.upper(property)] = setter;
      }
    } else {
      defun.set = setter;
    }
    Object.defineProperty(model, property, defun);
  },
  upper: function upper(name) {
    return name[0].toUpperCase() + name.substring(1);
  },
  _addAnnotatedListener: function _addAnnotatedListener(model, index, property, path, event, negated) {
    if (!model._bindListeners) {
      model._bindListeners = [];
    }
    var fn = this._notedListenerFactory(property, path, Polymer.Path.isDeep(path), negated);
    var eventName = event || Polymer.CaseMap.camelToDashCase(property) + '-changed';
    model._bindListeners.push({
      index: index,
      property: property,
      path: path,
      changedFn: fn,
      event: eventName
    });
  },
  _isEventBogus: function _isEventBogus(e, target) {
    return e.path && e.path[0] !== target;
  },
  _notedListenerFactory: function _notedListenerFactory(property, path, isStructured, negated) {
    return function (target, value, targetPath) {
      if (targetPath) {
        var newPath = Polymer.Path.translate(property, path, targetPath);
        this._notifyPath(newPath, value);
      } else {
        value = target[property];
        if (negated) {
          value = !value;
        }
        if (!isStructured) {
          this[path] = value;
        } else {
          if (this.__data__[path] != value) {
            this.set(path, value);
          }
        }
      }
    };
  },
  prepareInstance: function prepareInstance(inst) {
    inst.__data__ = Object.create(null);
  },
  setupBindListeners: function setupBindListeners(inst) {
    var b$ = inst._bindListeners;
    for (var i = 0, l = b$.length, info; i < l && (info = b$[i]); i++) {
      var node = inst._nodes[info.index];
      this._addNotifyListener(node, inst, info.event, info.changedFn);
    }
  },
  _addNotifyListener: function _addNotifyListener(element, context, event, changedFn) {
    element.addEventListener(event, function (e) {
      return context._notifyListener(changedFn, e);
    });
  }
};Polymer.Base.extend(Polymer.Bind, {
  _shouldAddListener: function _shouldAddListener(effect) {
    return effect.name && effect.kind != 'attribute' && effect.kind != 'text' && !effect.isCompound && effect.parts[0].mode === '{';
  },
  _annotationEffect: function _annotationEffect(source, value, effect) {
    if (source != effect.value) {
      value = this._get(effect.value);
      this.__data__[effect.value] = value;
    }
    this._applyEffectValue(effect, value);
  },
  _reflectEffect: function _reflectEffect(source, value, effect) {
    this.reflectPropertyToAttribute(source, effect.attribute, value);
  },
  _notifyEffect: function _notifyEffect(source, value, effect, old, fromAbove) {
    if (!fromAbove) {
      this._notifyChange(source, effect.event, value);
    }
  },
  _functionEffect: function _functionEffect(source, value, fn, old, fromAbove) {
    fn.call(this, source, value, old, fromAbove);
  },
  _observerEffect: function _observerEffect(source, value, effect, old) {
    var fn = this[effect.method];
    if (fn) {
      fn.call(this, value, old);
    } else {
      this._warn(this._logf('_observerEffect', 'observer method `' + effect.method + '` not defined'));
    }
  },
  _complexObserverEffect: function _complexObserverEffect(source, value, effect) {
    var fn = this[effect.method];
    if (fn) {
      var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
      if (args) {
        fn.apply(this, args);
      }
    } else if (effect.dynamicFn) {} else {
      this._warn(this._logf('_complexObserverEffect', 'observer method `' + effect.method + '` not defined'));
    }
  },
  _computeEffect: function _computeEffect(source, value, effect) {
    var fn = this[effect.method];
    if (fn) {
      var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
      if (args) {
        var computedvalue = fn.apply(this, args);
        this.__setProperty(effect.name, computedvalue);
      }
    } else if (effect.dynamicFn) {} else {
      this._warn(this._logf('_computeEffect', 'compute method `' + effect.method + '` not defined'));
    }
  },
  _annotatedComputationEffect: function _annotatedComputationEffect(source, value, effect) {
    var computedHost = this._rootDataHost || this;
    var fn = computedHost[effect.method];
    if (fn) {
      var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
      if (args) {
        var computedvalue = fn.apply(computedHost, args);
        this._applyEffectValue(effect, computedvalue);
      }
    } else if (effect.dynamicFn) {} else {
      computedHost._warn(computedHost._logf('_annotatedComputationEffect', 'compute method `' + effect.method + '` not defined'));
    }
  },
  _marshalArgs: function _marshalArgs(model, effect, path, value) {
    var values = [];
    var args = effect.args;
    var bailoutEarly = args.length > 1 || effect.dynamicFn;
    for (var i = 0, l = args.length; i < l; i++) {
      var arg = args[i];
      var name = arg.name;
      var v;
      if (arg.literal) {
        v = arg.value;
      } else if (path === name) {
        v = value;
      } else {
        v = model[name];
        if (v === undefined && arg.structured) {
          v = Polymer.Base._get(name, model);
        }
      }
      if (bailoutEarly && v === undefined) {
        return;
      }
      if (arg.wildcard) {
        var matches = Polymer.Path.isAncestor(path, name);
        values[i] = {
          path: matches ? path : name,
          value: matches ? value : v,
          base: v
        };
      } else {
        values[i] = v;
      }
    }
    return values;
  }
});Polymer.Base._addFeature({
  _addPropertyEffect: function _addPropertyEffect(property, kind, effect) {
    var prop = Polymer.Bind.addPropertyEffect(this, property, kind, effect);
    prop.pathFn = this['_' + prop.kind + 'PathEffect'];
  },
  _prepEffects: function _prepEffects() {
    Polymer.Bind.prepareModel(this);
    this._addAnnotationEffects(this._notes);
  },
  _prepBindings: function _prepBindings() {
    Polymer.Bind.createBindings(this);
  },
  _addPropertyEffects: function _addPropertyEffects(properties) {
    if (properties) {
      for (var p in properties) {
        var prop = properties[p];
        if (prop.observer) {
          this._addObserverEffect(p, prop.observer);
        }
        if (prop.computed) {
          prop.readOnly = true;
          this._addComputedEffect(p, prop.computed);
        }
        if (prop.notify) {
          this._addPropertyEffect(p, 'notify', { event: Polymer.CaseMap.camelToDashCase(p) + '-changed' });
        }
        if (prop.reflectToAttribute) {
          var attr = Polymer.CaseMap.camelToDashCase(p);
          if (attr[0] === '-') {
            this._warn(this._logf('_addPropertyEffects', 'Property ' + p + ' cannot be reflected to attribute ' + attr + ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'));
          } else {
            this._addPropertyEffect(p, 'reflect', { attribute: attr });
          }
        }
        if (prop.readOnly) {
          Polymer.Bind.ensurePropertyEffects(this, p);
        }
      }
    }
  },
  _addComputedEffect: function _addComputedEffect(name, expression) {
    var sig = this._parseMethod(expression);
    var dynamicFn = sig.dynamicFn;
    for (var i = 0, arg; i < sig.args.length && (arg = sig.args[i]); i++) {
      this._addPropertyEffect(arg.model, 'compute', {
        method: sig.method,
        args: sig.args,
        trigger: arg,
        name: name,
        dynamicFn: dynamicFn
      });
    }
    if (dynamicFn) {
      this._addPropertyEffect(sig.method, 'compute', {
        method: sig.method,
        args: sig.args,
        trigger: null,
        name: name,
        dynamicFn: dynamicFn
      });
    }
  },
  _addObserverEffect: function _addObserverEffect(property, observer) {
    this._addPropertyEffect(property, 'observer', {
      method: observer,
      property: property
    });
  },
  _addComplexObserverEffects: function _addComplexObserverEffects(observers) {
    if (observers) {
      for (var i = 0, o; i < observers.length && (o = observers[i]); i++) {
        this._addComplexObserverEffect(o);
      }
    }
  },
  _addComplexObserverEffect: function _addComplexObserverEffect(observer) {
    var sig = this._parseMethod(observer);
    if (!sig) {
      throw new Error('Malformed observer expression \'' + observer + '\'');
    }
    var dynamicFn = sig.dynamicFn;
    for (var i = 0, arg; i < sig.args.length && (arg = sig.args[i]); i++) {
      this._addPropertyEffect(arg.model, 'complexObserver', {
        method: sig.method,
        args: sig.args,
        trigger: arg,
        dynamicFn: dynamicFn
      });
    }
    if (dynamicFn) {
      this._addPropertyEffect(sig.method, 'complexObserver', {
        method: sig.method,
        args: sig.args,
        trigger: null,
        dynamicFn: dynamicFn
      });
    }
  },
  _addAnnotationEffects: function _addAnnotationEffects(notes) {
    for (var i = 0, note; i < notes.length && (note = notes[i]); i++) {
      var b$ = note.bindings;
      for (var j = 0, binding; j < b$.length && (binding = b$[j]); j++) {
        this._addAnnotationEffect(binding, i);
      }
    }
  },
  _addAnnotationEffect: function _addAnnotationEffect(note, index) {
    if (Polymer.Bind._shouldAddListener(note)) {
      Polymer.Bind._addAnnotatedListener(this, index, note.name, note.parts[0].value, note.parts[0].event, note.parts[0].negate);
    }
    for (var i = 0; i < note.parts.length; i++) {
      var part = note.parts[i];
      if (part.signature) {
        this._addAnnotatedComputationEffect(note, part, index);
      } else if (!part.literal) {
        if (note.kind === 'attribute' && note.name[0] === '-') {
          this._warn(this._logf('_addAnnotationEffect', 'Cannot set attribute ' + note.name + ' because "-" is not a valid attribute starting character'));
        } else {
          this._addPropertyEffect(part.model, 'annotation', {
            kind: note.kind,
            index: index,
            name: note.name,
            propertyName: note.propertyName,
            value: part.value,
            isCompound: note.isCompound,
            compoundIndex: part.compoundIndex,
            event: part.event,
            customEvent: part.customEvent,
            negate: part.negate
          });
        }
      }
    }
  },
  _addAnnotatedComputationEffect: function _addAnnotatedComputationEffect(note, part, index) {
    var sig = part.signature;
    if (sig['static']) {
      this.__addAnnotatedComputationEffect('__static__', index, note, part, null);
    } else {
      for (var i = 0, arg; i < sig.args.length && (arg = sig.args[i]); i++) {
        if (!arg.literal) {
          this.__addAnnotatedComputationEffect(arg.model, index, note, part, arg);
        }
      }
      if (sig.dynamicFn) {
        this.__addAnnotatedComputationEffect(sig.method, index, note, part, null);
      }
    }
  },
  __addAnnotatedComputationEffect: function __addAnnotatedComputationEffect(property, index, note, part, trigger) {
    this._addPropertyEffect(property, 'annotatedComputation', {
      index: index,
      isCompound: note.isCompound,
      compoundIndex: part.compoundIndex,
      kind: note.kind,
      name: note.name,
      negate: part.negate,
      method: part.signature.method,
      args: part.signature.args,
      trigger: trigger,
      dynamicFn: part.signature.dynamicFn
    });
  },
  _parseMethod: function _parseMethod(expression) {
    var m = expression.match(/([^\s]+?)\(([\s\S]*)\)/);
    if (m) {
      var sig = {
        method: m[1],
        'static': true
      };
      if (this.getPropertyInfo(sig.method) !== Polymer.nob) {
        sig['static'] = false;
        sig.dynamicFn = true;
      }
      if (m[2].trim()) {
        var args = m[2].replace(/\\,/g, '&comma;').split(',');
        return this._parseArgs(args, sig);
      } else {
        sig.args = Polymer.nar;
        return sig;
      }
    }
  },
  _parseArgs: function _parseArgs(argList, sig) {
    sig.args = argList.map(function (rawArg) {
      var arg = this._parseArg(rawArg);
      if (!arg.literal) {
        sig['static'] = false;
      }
      return arg;
    }, this);
    return sig;
  },
  _parseArg: function _parseArg(rawArg) {
    var arg = rawArg.trim().replace(/&comma;/g, ',').replace(/\\(.)/g, '$1');
    var a = { name: arg };
    var fc = arg[0];
    if (fc === '-') {
      fc = arg[1];
    }
    if (fc >= '0' && fc <= '9') {
      fc = '#';
    }
    switch (fc) {
      case '\'':
      case '"':
        a.value = arg.slice(1, -1);
        a.literal = true;
        break;
      case '#':
        a.value = Number(arg);
        a.literal = true;
        break;
    }
    if (!a.literal) {
      a.model = Polymer.Path.root(arg);
      a.structured = Polymer.Path.isDeep(arg);
      if (a.structured) {
        a.wildcard = arg.slice(-2) == '.*';
        if (a.wildcard) {
          a.name = arg.slice(0, -2);
        }
      }
    }
    return a;
  },
  _marshalInstanceEffects: function _marshalInstanceEffects() {
    Polymer.Bind.prepareInstance(this);
    if (this._bindListeners) {
      Polymer.Bind.setupBindListeners(this);
    }
  },
  _applyEffectValue: function _applyEffectValue(info, value) {
    var node = this._nodes[info.index];
    var property = info.name;
    value = this._computeFinalAnnotationValue(node, property, value, info);
    if (info.kind == 'attribute') {
      this.serializeValueToAttribute(value, property, node);
    } else {
      var pinfo = node._propertyInfo && node._propertyInfo[property];
      if (pinfo && pinfo.readOnly) {
        return;
      }
      this.__setProperty(property, value, false, node);
    }
  },
  _computeFinalAnnotationValue: function _computeFinalAnnotationValue(node, property, value, info) {
    if (info.negate) {
      value = !value;
    }
    if (info.isCompound) {
      var storage = node.__compoundStorage__[property];
      storage[info.compoundIndex] = value;
      value = storage.join('');
    }
    if (info.kind !== 'attribute') {
      if (property === 'className') {
        value = this._scopeElementClass(node, value);
      }
      if (property === 'textContent' || node.localName == 'input' && property == 'value') {
        value = value == undefined ? '' : value;
      }
    }
    return value;
  },
  _executeStaticEffects: function _executeStaticEffects() {
    if (this._propertyEffects && this._propertyEffects.__static__) {
      this._effectEffects('__static__', null, this._propertyEffects.__static__);
    }
  }
});(function () {
  var usePolyfillProto = Polymer.Settings.usePolyfillProto;
  Polymer.Base._addFeature({
    _setupConfigure: function _setupConfigure(initialConfig) {
      this._config = {};
      this._handlers = [];
      this._aboveConfig = null;
      if (initialConfig) {
        for (var i in initialConfig) {
          if (initialConfig[i] !== undefined) {
            this._config[i] = initialConfig[i];
          }
        }
      }
    },
    _marshalAttributes: function _marshalAttributes() {
      this._takeAttributesToModel(this._config);
    },
    _attributeChangedImpl: function _attributeChangedImpl(name) {
      var model = this._clientsReadied ? this : this._config;
      this._setAttributeToProperty(model, name);
    },
    _configValue: function _configValue(name, value) {
      var info = this._propertyInfo[name];
      if (!info || !info.readOnly) {
        this._config[name] = value;
      }
    },
    _beforeClientsReady: function _beforeClientsReady() {
      this._configure();
    },
    _configure: function _configure() {
      this._configureAnnotationReferences();
      this._configureInstanceProperties();
      this._aboveConfig = this.mixin({}, this._config);
      var config = {};
      for (var i = 0; i < this.behaviors.length; i++) {
        this._configureProperties(this.behaviors[i].properties, config);
      }
      this._configureProperties(this.properties, config);
      this.mixin(config, this._aboveConfig);
      this._config = config;
      if (this._clients && this._clients.length) {
        this._distributeConfig(this._config);
      }
    },
    _configureInstanceProperties: function _configureInstanceProperties() {
      for (var i in this._propertyEffects) {
        if (!usePolyfillProto && this.hasOwnProperty(i)) {
          this._configValue(i, this[i]);
          delete this[i];
        }
      }
    },
    _configureProperties: function _configureProperties(properties, config) {
      for (var i in properties) {
        var c = properties[i];
        if (c.value !== undefined) {
          var value = c.value;
          if (typeof value == 'function') {
            value = value.call(this, this._config);
          }
          config[i] = value;
        }
      }
    },
    _distributeConfig: function _distributeConfig(config) {
      var fx$ = this._propertyEffects;
      if (fx$) {
        for (var p in config) {
          var fx = fx$[p];
          if (fx) {
            for (var i = 0, l = fx.length, x; i < l && (x = fx[i]); i++) {
              if (x.kind === 'annotation') {
                var node = this._nodes[x.effect.index];
                var name = x.effect.propertyName;
                var isAttr = x.effect.kind == 'attribute';
                var hasEffect = node._propertyEffects && node._propertyEffects[name];
                if (node._configValue && (hasEffect || !isAttr)) {
                  var value = p === x.effect.value ? config[p] : this._get(x.effect.value, config);
                  value = this._computeFinalAnnotationValue(node, name, value, x.effect);
                  if (isAttr) {
                    value = node.deserialize(this.serialize(value), node._propertyInfo[name].type);
                  }
                  node._configValue(name, value);
                }
              }
            }
          }
        }
      }
    },
    _afterClientsReady: function _afterClientsReady() {
      this._executeStaticEffects();
      this._applyConfig(this._config, this._aboveConfig);
      this._flushHandlers();
    },
    _applyConfig: function _applyConfig(config, aboveConfig) {
      for (var n in config) {
        if (this[n] === undefined) {
          this.__setProperty(n, config[n], n in aboveConfig);
        }
      }
    },
    _notifyListener: function _notifyListener(fn, e) {
      if (!Polymer.Bind._isEventBogus(e, e.target)) {
        var value, path;
        if (e.detail) {
          value = e.detail.value;
          path = e.detail.path;
        }
        if (!this._clientsReadied) {
          this._queueHandler([fn, e.target, value, path]);
        } else {
          return fn.call(this, e.target, value, path);
        }
      }
    },
    _queueHandler: function _queueHandler(args) {
      this._handlers.push(args);
    },
    _flushHandlers: function _flushHandlers() {
      var h$ = this._handlers;
      for (var i = 0, l = h$.length, h; i < l && (h = h$[i]); i++) {
        h[0].call(this, h[1], h[2], h[3]);
      }
      this._handlers = [];
    }
  });
})();(function () {
  'use strict';
  var Path = Polymer.Path;
  Polymer.Base._addFeature({
    notifyPath: function notifyPath(path, value, fromAbove) {
      var info = {};
      var v = this._get(path, this, info);
      if (arguments.length === 1) {
        value = v;
      }
      if (info.path) {
        this._notifyPath(info.path, value, fromAbove);
      }
    },
    _notifyPath: function _notifyPath(path, value, fromAbove) {
      var old = this._propertySetter(path, value);
      if (old !== value && (old === old || value === value)) {
        this._pathEffector(path, value);
        if (!fromAbove) {
          this._notifyPathUp(path, value);
        }
        return true;
      }
    },
    _getPathParts: function _getPathParts(path) {
      if (Array.isArray(path)) {
        var parts = [];
        for (var i = 0; i < path.length; i++) {
          var args = path[i].toString().split('.');
          for (var j = 0; j < args.length; j++) {
            parts.push(args[j]);
          }
        }
        return parts;
      } else {
        return path.toString().split('.');
      }
    },
    set: function set(path, value, root) {
      var prop = root || this;
      var parts = this._getPathParts(path);
      var array;
      var last = parts[parts.length - 1];
      if (parts.length > 1) {
        for (var i = 0; i < parts.length - 1; i++) {
          var part = parts[i];
          if (array && part[0] == '#') {
            prop = Polymer.Collection.get(array).getItem(part);
          } else {
            prop = prop[part];
            if (array && parseInt(part, 10) == part) {
              parts[i] = Polymer.Collection.get(array).getKey(prop);
            }
          }
          if (!prop) {
            return;
          }
          array = Array.isArray(prop) ? prop : null;
        }
        if (array) {
          var coll = Polymer.Collection.get(array);
          var old, key;
          if (last[0] == '#') {
            key = last;
            old = coll.getItem(key);
            last = array.indexOf(old);
            coll.setItem(key, value);
          } else if (parseInt(last, 10) == last) {
            old = prop[last];
            key = coll.getKey(old);
            parts[i] = key;
            coll.setItem(key, value);
          }
        }
        prop[last] = value;
        if (!root) {
          this._notifyPath(parts.join('.'), value);
        }
      } else {
        prop[path] = value;
      }
    },
    get: function get(path, root) {
      return this._get(path, root);
    },
    _get: function _get(path, root, info) {
      var prop = root || this;
      var parts = this._getPathParts(path);
      var array;
      for (var i = 0; i < parts.length; i++) {
        if (!prop) {
          return;
        }
        var part = parts[i];
        if (array && part[0] == '#') {
          prop = Polymer.Collection.get(array).getItem(part);
        } else {
          prop = prop[part];
          if (info && array && parseInt(part, 10) == part) {
            parts[i] = Polymer.Collection.get(array).getKey(prop);
          }
        }
        array = Array.isArray(prop) ? prop : null;
      }
      if (info) {
        info.path = parts.join('.');
      }
      return prop;
    },
    _pathEffector: function _pathEffector(path, value) {
      var model = Path.root(path);
      var fx$ = this._propertyEffects && this._propertyEffects[model];
      if (fx$) {
        for (var i = 0, fx; i < fx$.length && (fx = fx$[i]); i++) {
          var fxFn = fx.pathFn;
          if (fxFn) {
            fxFn.call(this, path, value, fx.effect);
          }
        }
      }
      if (this._boundPaths) {
        this._notifyBoundPaths(path, value);
      }
    },
    _annotationPathEffect: function _annotationPathEffect(path, value, effect) {
      if (Path.matches(effect.value, false, path)) {
        Polymer.Bind._annotationEffect.call(this, path, value, effect);
      } else if (!effect.negate && Path.isDescendant(effect.value, path)) {
        var node = this._nodes[effect.index];
        if (node && node._notifyPath) {
          var newPath = Path.translate(effect.value, effect.name, path);
          node._notifyPath(newPath, value, true);
        }
      }
    },
    _complexObserverPathEffect: function _complexObserverPathEffect(path, value, effect) {
      if (Path.matches(effect.trigger.name, effect.trigger.wildcard, path)) {
        Polymer.Bind._complexObserverEffect.call(this, path, value, effect);
      }
    },
    _computePathEffect: function _computePathEffect(path, value, effect) {
      if (Path.matches(effect.trigger.name, effect.trigger.wildcard, path)) {
        Polymer.Bind._computeEffect.call(this, path, value, effect);
      }
    },
    _annotatedComputationPathEffect: function _annotatedComputationPathEffect(path, value, effect) {
      if (Path.matches(effect.trigger.name, effect.trigger.wildcard, path)) {
        Polymer.Bind._annotatedComputationEffect.call(this, path, value, effect);
      }
    },
    linkPaths: function linkPaths(to, from) {
      this._boundPaths = this._boundPaths || {};
      if (from) {
        this._boundPaths[to] = from;
      } else {
        this.unlinkPaths(to);
      }
    },
    unlinkPaths: function unlinkPaths(path) {
      if (this._boundPaths) {
        delete this._boundPaths[path];
      }
    },
    _notifyBoundPaths: function _notifyBoundPaths(path, value) {
      for (var a in this._boundPaths) {
        var b = this._boundPaths[a];
        if (Path.isDescendant(a, path)) {
          this._notifyPath(Path.translate(a, b, path), value);
        } else if (Path.isDescendant(b, path)) {
          this._notifyPath(Path.translate(b, a, path), value);
        }
      }
    },
    _notifyPathUp: function _notifyPathUp(path, value) {
      var rootName = Path.root(path);
      var dashCaseName = Polymer.CaseMap.camelToDashCase(rootName);
      var eventName = dashCaseName + this._EVENT_CHANGED;
      this.fire(eventName, {
        path: path,
        value: value
      }, {
        bubbles: false,
        _useCache: Polymer.Settings.eventDataCache || !Polymer.Settings.isIE
      });
    },
    _EVENT_CHANGED: '-changed',
    notifySplices: function notifySplices(path, splices) {
      var info = {};
      var array = this._get(path, this, info);
      this._notifySplices(array, info.path, splices);
    },
    _notifySplices: function _notifySplices(array, path, splices) {
      var change = {
        keySplices: Polymer.Collection.applySplices(array, splices),
        indexSplices: splices
      };
      var splicesPath = path + '.splices';
      this._notifyPath(splicesPath, change);
      this._notifyPath(path + '.length', array.length);
      this.__data__[splicesPath] = {
        keySplices: null,
        indexSplices: null
      };
    },
    _notifySplice: function _notifySplice(array, path, index, added, removed) {
      this._notifySplices(array, path, [{
        index: index,
        addedCount: added,
        removed: removed,
        object: array,
        type: 'splice'
      }]);
    },
    push: function push(path) {
      var info = {};
      var array = this._get(path, this, info);
      var args = Array.prototype.slice.call(arguments, 1);
      var len = array.length;
      var ret = array.push.apply(array, args);
      if (args.length) {
        this._notifySplice(array, info.path, len, args.length, []);
      }
      return ret;
    },
    pop: function pop(path) {
      var info = {};
      var array = this._get(path, this, info);
      var hadLength = Boolean(array.length);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.pop.apply(array, args);
      if (hadLength) {
        this._notifySplice(array, info.path, array.length, 0, [ret]);
      }
      return ret;
    },
    splice: function splice(path, start) {
      var info = {};
      var array = this._get(path, this, info);
      if (start < 0) {
        start = array.length - Math.floor(-start);
      } else {
        start = Math.floor(start);
      }
      if (!start) {
        start = 0;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.splice.apply(array, args);
      var addedCount = Math.max(args.length - 2, 0);
      if (addedCount || ret.length) {
        this._notifySplice(array, info.path, start, addedCount, ret);
      }
      return ret;
    },
    shift: function shift(path) {
      var info = {};
      var array = this._get(path, this, info);
      var hadLength = Boolean(array.length);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.shift.apply(array, args);
      if (hadLength) {
        this._notifySplice(array, info.path, 0, 0, [ret]);
      }
      return ret;
    },
    unshift: function unshift(path) {
      var info = {};
      var array = this._get(path, this, info);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.unshift.apply(array, args);
      if (args.length) {
        this._notifySplice(array, info.path, 0, args.length, []);
      }
      return ret;
    },
    prepareModelNotifyPath: function prepareModelNotifyPath(model) {
      this.mixin(model, {
        fire: Polymer.Base.fire,
        _getEvent: Polymer.Base._getEvent,
        __eventCache: Polymer.Base.__eventCache,
        notifyPath: Polymer.Base.notifyPath,
        _get: Polymer.Base._get,
        _EVENT_CHANGED: Polymer.Base._EVENT_CHANGED,
        _notifyPath: Polymer.Base._notifyPath,
        _notifyPathUp: Polymer.Base._notifyPathUp,
        _pathEffector: Polymer.Base._pathEffector,
        _annotationPathEffect: Polymer.Base._annotationPathEffect,
        _complexObserverPathEffect: Polymer.Base._complexObserverPathEffect,
        _annotatedComputationPathEffect: Polymer.Base._annotatedComputationPathEffect,
        _computePathEffect: Polymer.Base._computePathEffect,
        _notifyBoundPaths: Polymer.Base._notifyBoundPaths,
        _getPathParts: Polymer.Base._getPathParts
      });
    }
  });
})();Polymer.Base._addFeature({
  resolveUrl: function resolveUrl(url) {
    var module = Polymer.DomModule['import'](this.is);
    var root = '';
    if (module) {
      var assetPath = module.getAttribute('assetpath') || '';
      root = Polymer.ResolveUrl.resolveUrl(assetPath, module.ownerDocument.baseURI);
    }
    return Polymer.ResolveUrl.resolveUrl(url, root);
  }
});Polymer.CssParse = (function () {
  return {
    parse: function parse(text) {
      text = this._clean(text);
      return this._parseCss(this._lex(text), text);
    },
    _clean: function _clean(cssText) {
      return cssText.replace(this._rx.comments, '').replace(this._rx.port, '');
    },
    _lex: function _lex(text) {
      var root = {
        start: 0,
        end: text.length
      };
      var n = root;
      for (var i = 0, l = text.length; i < l; i++) {
        switch (text[i]) {
          case this.OPEN_BRACE:
            if (!n.rules) {
              n.rules = [];
            }
            var p = n;
            var previous = p.rules[p.rules.length - 1];
            n = {
              start: i + 1,
              parent: p,
              previous: previous
            };
            p.rules.push(n);
            break;
          case this.CLOSE_BRACE:
            n.end = i + 1;
            n = n.parent || root;
            break;
        }
      }
      return root;
    },
    _parseCss: function _parseCss(node, text) {
      var t = text.substring(node.start, node.end - 1);
      node.parsedCssText = node.cssText = t.trim();
      if (node.parent) {
        var ss = node.previous ? node.previous.end : node.parent.start;
        t = text.substring(ss, node.start - 1);
        t = this._expandUnicodeEscapes(t);
        t = t.replace(this._rx.multipleSpaces, ' ');
        t = t.substring(t.lastIndexOf(';') + 1);
        var s = node.parsedSelector = node.selector = t.trim();
        node.atRule = s.indexOf(this.AT_START) === 0;
        if (node.atRule) {
          if (s.indexOf(this.MEDIA_START) === 0) {
            node.type = this.types.MEDIA_RULE;
          } else if (s.match(this._rx.keyframesRule)) {
            node.type = this.types.KEYFRAMES_RULE;
            node.keyframesName = node.selector.split(this._rx.multipleSpaces).pop();
          }
        } else {
          if (s.indexOf(this.VAR_START) === 0) {
            node.type = this.types.MIXIN_RULE;
          } else {
            node.type = this.types.STYLE_RULE;
          }
        }
      }
      var r$ = node.rules;
      if (r$) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          this._parseCss(r, text);
        }
      }
      return node;
    },
    _expandUnicodeEscapes: function _expandUnicodeEscapes(s) {
      return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
        var code = arguments[1],
            repeat = 6 - code.length;
        while (repeat--) {
          code = '0' + code;
        }
        return '\\' + code;
      });
    },
    stringify: function stringify(node, preserveProperties, text) {
      text = text || '';
      var cssText = '';
      if (node.cssText || node.rules) {
        var r$ = node.rules;
        if (r$ && !this._hasMixinRules(r$)) {
          for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
            cssText = this.stringify(r, preserveProperties, cssText);
          }
        } else {
          cssText = preserveProperties ? node.cssText : this.removeCustomProps(node.cssText);
          cssText = cssText.trim();
          if (cssText) {
            cssText = '  ' + cssText + '\n';
          }
        }
      }
      if (cssText) {
        if (node.selector) {
          text += node.selector + ' ' + this.OPEN_BRACE + '\n';
        }
        text += cssText;
        if (node.selector) {
          text += this.CLOSE_BRACE + '\n\n';
        }
      }
      return text;
    },
    _hasMixinRules: function _hasMixinRules(rules) {
      return rules[0].selector.indexOf(this.VAR_START) === 0;
    },
    removeCustomProps: function removeCustomProps(cssText) {
      cssText = this.removeCustomPropAssignment(cssText);
      return this.removeCustomPropApply(cssText);
    },
    removeCustomPropAssignment: function removeCustomPropAssignment(cssText) {
      return cssText.replace(this._rx.customProp, '').replace(this._rx.mixinProp, '');
    },
    removeCustomPropApply: function removeCustomPropApply(cssText) {
      return cssText.replace(this._rx.mixinApply, '').replace(this._rx.varApply, '');
    },
    types: {
      STYLE_RULE: 1,
      KEYFRAMES_RULE: 7,
      MEDIA_RULE: 4,
      MIXIN_RULE: 1000
    },
    OPEN_BRACE: '{',
    CLOSE_BRACE: '}',
    _rx: {
      comments: /\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gim,
      port: /@import[^;]*;/gim,
      customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
      mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
      mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
      varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
      keyframesRule: /^@[^\s]*keyframes/,
      multipleSpaces: /\s+/g
    },
    VAR_START: '--',
    MEDIA_START: '@media',
    AT_START: '@'
  };
})();Polymer.StyleUtil = (function () {
  var settings = Polymer.Settings;
  return {
    NATIVE_VARIABLES: Polymer.Settings.useNativeCSSProperties,
    MODULE_STYLES_SELECTOR: 'style, link[rel=import][type~=css], template',
    INCLUDE_ATTR: 'include',
    toCssText: function toCssText(rules, callback) {
      if (typeof rules === 'string') {
        rules = this.parser.parse(rules);
      }
      if (callback) {
        this.forEachRule(rules, callback);
      }
      return this.parser.stringify(rules, this.NATIVE_VARIABLES);
    },
    forRulesInStyles: function forRulesInStyles(styles, styleRuleCallback, keyframesRuleCallback) {
      if (styles) {
        for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
          this.forEachRuleInStyle(s, styleRuleCallback, keyframesRuleCallback);
        }
      }
    },
    forActiveRulesInStyles: function forActiveRulesInStyles(styles, styleRuleCallback, keyframesRuleCallback) {
      if (styles) {
        for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
          this.forEachRuleInStyle(s, styleRuleCallback, keyframesRuleCallback, true);
        }
      }
    },
    rulesForStyle: function rulesForStyle(style) {
      if (!style.__cssRules && style.textContent) {
        style.__cssRules = this.parser.parse(style.textContent);
      }
      return style.__cssRules;
    },
    isKeyframesSelector: function isKeyframesSelector(rule) {
      return rule.parent && rule.parent.type === this.ruleTypes.KEYFRAMES_RULE;
    },
    forEachRuleInStyle: function forEachRuleInStyle(style, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
      var rules = this.rulesForStyle(style);
      var styleCallback, keyframeCallback;
      if (styleRuleCallback) {
        styleCallback = function (rule) {
          styleRuleCallback(rule, style);
        };
      }
      if (keyframesRuleCallback) {
        keyframeCallback = function (rule) {
          keyframesRuleCallback(rule, style);
        };
      }
      this.forEachRule(rules, styleCallback, keyframeCallback, onlyActiveRules);
    },
    forEachRule: function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
      if (!node) {
        return;
      }
      var skipRules = false;
      if (onlyActiveRules) {
        if (node.type === this.ruleTypes.MEDIA_RULE) {
          var matchMedia = node.selector.match(this.rx.MEDIA_MATCH);
          if (matchMedia) {
            if (!window.matchMedia(matchMedia[1]).matches) {
              skipRules = true;
            }
          }
        }
      }
      if (node.type === this.ruleTypes.STYLE_RULE) {
        styleRuleCallback(node);
      } else if (keyframesRuleCallback && node.type === this.ruleTypes.KEYFRAMES_RULE) {
        keyframesRuleCallback(node);
      } else if (node.type === this.ruleTypes.MIXIN_RULE) {
        skipRules = true;
      }
      var r$ = node.rules;
      if (r$ && !skipRules) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          this.forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
        }
      }
    },
    applyCss: function applyCss(cssText, moniker, target, contextNode) {
      var style = this.createScopeStyle(cssText, moniker);
      return this.applyStyle(style, target, contextNode);
    },
    applyStyle: function applyStyle(style, target, contextNode) {
      target = target || document.head;
      var after = contextNode && contextNode.nextSibling || target.firstChild;
      this.__lastHeadApplyNode = style;
      return target.insertBefore(style, after);
    },
    createScopeStyle: function createScopeStyle(cssText, moniker) {
      var style = document.createElement('style');
      if (moniker) {
        style.setAttribute('scope', moniker);
      }
      style.textContent = cssText;
      return style;
    },
    __lastHeadApplyNode: null,
    applyStylePlaceHolder: function applyStylePlaceHolder(moniker) {
      var placeHolder = document.createComment(' Shady DOM styles for ' + moniker + ' ');
      var after = this.__lastHeadApplyNode ? this.__lastHeadApplyNode.nextSibling : null;
      var scope = document.head;
      scope.insertBefore(placeHolder, after || scope.firstChild);
      this.__lastHeadApplyNode = placeHolder;
      return placeHolder;
    },
    cssFromModules: function cssFromModules(moduleIds, warnIfNotFound) {
      var modules = moduleIds.trim().split(' ');
      var cssText = '';
      for (var i = 0; i < modules.length; i++) {
        cssText += this.cssFromModule(modules[i], warnIfNotFound);
      }
      return cssText;
    },
    cssFromModule: function cssFromModule(moduleId, warnIfNotFound) {
      var m = Polymer.DomModule['import'](moduleId);
      if (m && !m._cssText) {
        m._cssText = this.cssFromElement(m);
      }
      if (!m && warnIfNotFound) {
        console.warn('Could not find style data in module named', moduleId);
      }
      return m && m._cssText || '';
    },
    cssFromElement: function cssFromElement(element) {
      var cssText = '';
      var content = element.content || element;
      var e$ = Polymer.TreeApi.arrayCopy(content.querySelectorAll(this.MODULE_STYLES_SELECTOR));
      for (var i = 0, e; i < e$.length; i++) {
        e = e$[i];
        if (e.localName === 'template') {
          if (!e.hasAttribute('preserve-content')) {
            cssText += this.cssFromElement(e);
          }
        } else {
          if (e.localName === 'style') {
            var include = e.getAttribute(this.INCLUDE_ATTR);
            if (include) {
              cssText += this.cssFromModules(include, true);
            }
            e = e.__appliedElement || e;
            e.parentNode.removeChild(e);
            cssText += this.resolveCss(e.textContent, element.ownerDocument);
          } else if (e['import'] && e['import'].body) {
            cssText += this.resolveCss(e['import'].body.textContent, e['import']);
          }
        }
      }
      return cssText;
    },
    isTargetedBuild: function isTargetedBuild(buildType) {
      return settings.useNativeShadow ? buildType === 'shadow' : buildType === 'shady';
    },
    cssBuildTypeForModule: function cssBuildTypeForModule(module) {
      var dm = Polymer.DomModule['import'](module);
      if (dm) {
        return this.getCssBuildType(dm);
      }
    },
    getCssBuildType: function getCssBuildType(element) {
      return element.getAttribute('css-build');
    },
    _findMatchingParen: function _findMatchingParen(text, start) {
      var level = 0;
      for (var i = start, l = text.length; i < l; i++) {
        switch (text[i]) {
          case '(':
            level++;
            break;
          case ')':
            if (--level === 0) {
              return i;
            }
            break;
        }
      }
      return -1;
    },
    processVariableAndFallback: function processVariableAndFallback(str, callback) {
      var start = str.indexOf('var(');
      if (start === -1) {
        return callback(str, '', '', '');
      }
      var end = this._findMatchingParen(str, start + 3);
      var inner = str.substring(start + 4, end);
      var prefix = str.substring(0, start);
      var suffix = this.processVariableAndFallback(str.substring(end + 1), callback);
      var comma = inner.indexOf(',');
      if (comma === -1) {
        return callback(prefix, inner.trim(), '', suffix);
      }
      var value = inner.substring(0, comma).trim();
      var fallback = inner.substring(comma + 1).trim();
      return callback(prefix, value, fallback, suffix);
    },
    rx: {
      VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,
      MIXIN_MATCH: /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
      VAR_CONSUMED: /(--[\w-]+)\s*([:,;)]|$)/gi,
      ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/,
      MEDIA_MATCH: /@media[^(]*(\([^)]*\))/,
      IS_VAR: /^--/,
      BRACKETED: /\{[^}]*\}/g,
      HOST_PREFIX: '(?:^|[^.#[:])',
      HOST_SUFFIX: '($|[.:[\\s>+~])'
    },
    resolveCss: Polymer.ResolveUrl.resolveCss,
    parser: Polymer.CssParse,
    ruleTypes: Polymer.CssParse.types
  };
})();Polymer.StyleTransformer = (function () {
  var styleUtil = Polymer.StyleUtil;
  var settings = Polymer.Settings;
  var api = {
    dom: function dom(node, scope, useAttr, shouldRemoveScope) {
      this._transformDom(node, scope || '', useAttr, shouldRemoveScope);
    },
    _transformDom: function _transformDom(node, selector, useAttr, shouldRemoveScope) {
      if (node.setAttribute) {
        this.element(node, selector, useAttr, shouldRemoveScope);
      }
      var c$ = Polymer.dom(node).childNodes;
      for (var i = 0; i < c$.length; i++) {
        this._transformDom(c$[i], selector, useAttr, shouldRemoveScope);
      }
    },
    element: function element(_element, scope, useAttr, shouldRemoveScope) {
      if (useAttr) {
        if (shouldRemoveScope) {
          _element.removeAttribute(SCOPE_NAME);
        } else {
          _element.setAttribute(SCOPE_NAME, scope);
        }
      } else {
        if (scope) {
          if (_element.classList) {
            if (shouldRemoveScope) {
              _element.classList.remove(SCOPE_NAME);
              _element.classList.remove(scope);
            } else {
              _element.classList.add(SCOPE_NAME);
              _element.classList.add(scope);
            }
          } else if (_element.getAttribute) {
            var c = _element.getAttribute(CLASS);
            if (shouldRemoveScope) {
              if (c) {
                _element.setAttribute(CLASS, c.replace(SCOPE_NAME, '').replace(scope, ''));
              }
            } else {
              _element.setAttribute(CLASS, (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope);
            }
          }
        }
      }
    },
    elementStyles: function elementStyles(element, callback) {
      var styles = element._styles;
      var cssText = '';
      var cssBuildType = element.__cssBuild;
      var passthrough = settings.useNativeShadow || cssBuildType === 'shady';
      var cb;
      if (passthrough) {
        var self = this;
        cb = function (rule) {
          rule.selector = self._slottedToContent(rule.selector);
          rule.selector = rule.selector.replace(ROOT, ':host > *');
          if (callback) {
            callback(rule);
          }
        };
      }
      for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
        var rules = styleUtil.rulesForStyle(s);
        cssText += passthrough ? styleUtil.toCssText(rules, cb) : this.css(rules, element.is, element['extends'], callback, element._scopeCssViaAttr) + '\n\n';
      }
      return cssText.trim();
    },
    css: function css(rules, scope, ext, callback, useAttr) {
      var hostScope = this._calcHostScope(scope, ext);
      scope = this._calcElementScope(scope, useAttr);
      var self = this;
      return styleUtil.toCssText(rules, function (rule) {
        if (!rule.isScoped) {
          self.rule(rule, scope, hostScope);
          rule.isScoped = true;
        }
        if (callback) {
          callback(rule, scope, hostScope);
        }
      });
    },
    _calcElementScope: function _calcElementScope(scope, useAttr) {
      if (scope) {
        return useAttr ? CSS_ATTR_PREFIX + scope + CSS_ATTR_SUFFIX : CSS_CLASS_PREFIX + scope;
      } else {
        return '';
      }
    },
    _calcHostScope: function _calcHostScope(scope, ext) {
      return ext ? '[is=' + scope + ']' : scope;
    },
    rule: function rule(_rule, scope, hostScope) {
      this._transformRule(_rule, this._transformComplexSelector, scope, hostScope);
    },
    _transformRule: function _transformRule(rule, transformer, scope, hostScope) {
      rule.selector = rule.transformedSelector = this._transformRuleCss(rule, transformer, scope, hostScope);
    },
    _transformRuleCss: function _transformRuleCss(rule, transformer, scope, hostScope) {
      var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
      if (!styleUtil.isKeyframesSelector(rule)) {
        for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
          p$[i] = transformer.call(this, p, scope, hostScope);
        }
      }
      return p$.join(COMPLEX_SELECTOR_SEP);
    },
    _transformComplexSelector: function _transformComplexSelector(selector, scope, hostScope) {
      var stop = false;
      var hostContext = false;
      var self = this;
      selector = selector.trim();
      selector = this._slottedToContent(selector);
      selector = selector.replace(ROOT, ':host > *');
      selector = selector.replace(CONTENT_START, HOST + ' $1');
      selector = selector.replace(SIMPLE_SELECTOR_SEP, function (m, c, s) {
        if (!stop) {
          var info = self._transformCompoundSelector(s, c, scope, hostScope);
          stop = stop || info.stop;
          hostContext = hostContext || info.hostContext;
          c = info.combinator;
          s = info.value;
        } else {
          s = s.replace(SCOPE_JUMP, ' ');
        }
        return c + s;
      });
      if (hostContext) {
        selector = selector.replace(HOST_CONTEXT_PAREN, function (m, pre, paren, post) {
          return pre + paren + ' ' + hostScope + post + COMPLEX_SELECTOR_SEP + ' ' + pre + hostScope + paren + post;
        });
      }
      return selector;
    },
    _transformCompoundSelector: function _transformCompoundSelector(selector, combinator, scope, hostScope) {
      var jumpIndex = selector.search(SCOPE_JUMP);
      var hostContext = false;
      if (selector.indexOf(HOST_CONTEXT) >= 0) {
        hostContext = true;
      } else if (selector.indexOf(HOST) >= 0) {
        selector = this._transformHostSelector(selector, hostScope);
      } else if (jumpIndex !== 0) {
        selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
      }
      if (selector.indexOf(CONTENT) >= 0) {
        combinator = '';
      }
      var stop;
      if (jumpIndex >= 0) {
        selector = selector.replace(SCOPE_JUMP, ' ');
        stop = true;
      }
      return {
        value: selector,
        combinator: combinator,
        stop: stop,
        hostContext: hostContext
      };
    },
    _transformSimpleSelector: function _transformSimpleSelector(selector, scope) {
      var p$ = selector.split(PSEUDO_PREFIX);
      p$[0] += scope;
      return p$.join(PSEUDO_PREFIX);
    },
    _transformHostSelector: function _transformHostSelector(selector, hostScope) {
      var m = selector.match(HOST_PAREN);
      var paren = m && m[2].trim() || '';
      if (paren) {
        if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
          var typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
          if (typeSelector === hostScope) {
            return paren;
          } else {
            return SELECTOR_NO_MATCH;
          }
        } else {
          return selector.replace(HOST_PAREN, function (m, host, paren) {
            return hostScope + paren;
          });
        }
      } else {
        return selector.replace(HOST, hostScope);
      }
    },
    documentRule: function documentRule(rule) {
      rule.selector = rule.parsedSelector;
      this.normalizeRootSelector(rule);
      if (!settings.useNativeShadow) {
        this._transformRule(rule, this._transformDocumentSelector);
      }
    },
    normalizeRootSelector: function normalizeRootSelector(rule) {
      rule.selector = rule.selector.replace(ROOT, 'html');
    },
    _transformDocumentSelector: function _transformDocumentSelector(selector) {
      return selector.match(SCOPE_JUMP) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
    },
    _slottedToContent: function _slottedToContent(cssText) {
      return cssText.replace(SLOTTED_PAREN, CONTENT + '> $1');
    },
    SCOPE_NAME: 'style-scope'
  };
  var SCOPE_NAME = api.SCOPE_NAME;
  var SCOPE_DOC_SELECTOR = ':not([' + SCOPE_NAME + '])' + ':not(.' + SCOPE_NAME + ')';
  var COMPLEX_SELECTOR_SEP = ',';
  var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g;
  var SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
  var HOST = ':host';
  var ROOT = ':root';
  var HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
  var HOST_CONTEXT = ':host-context';
  var HOST_CONTEXT_PAREN = /(.*)(?::host-context)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))(.*)/;
  var CONTENT = '::content';
  var SCOPE_JUMP = /::content|::shadow|\/deep\//;
  var CSS_CLASS_PREFIX = '.';
  var CSS_ATTR_PREFIX = '[' + SCOPE_NAME + '~=';
  var CSS_ATTR_SUFFIX = ']';
  var PSEUDO_PREFIX = ':';
  var CLASS = 'class';
  var CONTENT_START = new RegExp('^(' + CONTENT + ')');
  var SELECTOR_NO_MATCH = 'should_not_match';
  var SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g;
  return api;
})();Polymer.StyleExtends = (function () {
  var styleUtil = Polymer.StyleUtil;
  return {
    hasExtends: function hasExtends(cssText) {
      return Boolean(cssText.match(this.rx.EXTEND));
    },
    transform: function transform(style) {
      var rules = styleUtil.rulesForStyle(style);
      var self = this;
      styleUtil.forEachRule(rules, function (rule) {
        self._mapRuleOntoParent(rule);
        if (rule.parent) {
          var m;
          while (m = self.rx.EXTEND.exec(rule.cssText)) {
            var extend = m[1];
            var extendor = self._findExtendor(extend, rule);
            if (extendor) {
              self._extendRule(rule, extendor);
            }
          }
        }
        rule.cssText = rule.cssText.replace(self.rx.EXTEND, '');
      });
      return styleUtil.toCssText(rules, function (rule) {
        if (rule.selector.match(self.rx.STRIP)) {
          rule.cssText = '';
        }
      }, true);
    },
    _mapRuleOntoParent: function _mapRuleOntoParent(rule) {
      if (rule.parent) {
        var map = rule.parent.map || (rule.parent.map = {});
        var parts = rule.selector.split(',');
        for (var i = 0, p; i < parts.length; i++) {
          p = parts[i];
          map[p.trim()] = rule;
        }
        return map;
      }
    },
    _findExtendor: function _findExtendor(extend, rule) {
      return rule.parent && rule.parent.map && rule.parent.map[extend] || this._findExtendor(extend, rule.parent);
    },
    _extendRule: function _extendRule(target, source) {
      if (target.parent !== source.parent) {
        this._cloneAndAddRuleToParent(source, target.parent);
      }
      target['extends'] = target['extends'] || [];
      target['extends'].push(source);
      source.selector = source.selector.replace(this.rx.STRIP, '');
      source.selector = (source.selector && source.selector + ',\n') + target.selector;
      if (source['extends']) {
        source['extends'].forEach(function (e) {
          this._extendRule(target, e);
        }, this);
      }
    },
    _cloneAndAddRuleToParent: function _cloneAndAddRuleToParent(rule, parent) {
      rule = Object.create(rule);
      rule.parent = parent;
      if (rule['extends']) {
        rule['extends'] = rule['extends'].slice();
      }
      parent.rules.push(rule);
    },
    rx: {
      EXTEND: /@extends\(([^)]*)\)\s*?;/gim,
      STRIP: /%[^,]*$/
    }
  };
})();Polymer.ApplyShim = (function () {
  'use strict';
  var styleUtil = Polymer.StyleUtil;
  var MIXIN_MATCH = styleUtil.rx.MIXIN_MATCH;
  var VAR_ASSIGN = styleUtil.rx.VAR_ASSIGN;
  var BAD_VAR = /var\(\s*(--[^,]*),\s*(--[^)]*)\)/g;
  var APPLY_NAME_CLEAN = /;\s*/m;
  var INITIAL_INHERIT = /^\s*(initial)|(inherit)\s*$/;
  var MIXIN_VAR_SEP = '_-_';
  var mixinMap = {};
  function mapSet(name, props) {
    name = name.trim();
    mixinMap[name] = {
      properties: props,
      dependants: {}
    };
  }
  function mapGet(name) {
    name = name.trim();
    return mixinMap[name];
  }
  function replaceInitialOrInherit(property, value) {
    var match = INITIAL_INHERIT.exec(value);
    if (match) {
      if (match[1]) {
        value = ApplyShim._getInitialValueForProperty(property);
      } else {
        value = 'apply-shim-inherit';
      }
    }
    return value;
  }
  function cssTextToMap(text) {
    var props = text.split(';');
    var property, value;
    var out = {};
    for (var i = 0, p, sp; i < props.length; i++) {
      p = props[i];
      if (p) {
        sp = p.split(':');
        if (sp.length > 1) {
          property = sp[0].trim();
          value = replaceInitialOrInherit(property, sp.slice(1).join(':'));
          out[property] = value;
        }
      }
    }
    return out;
  }
  function invalidateMixinEntry(mixinEntry) {
    var currentProto = ApplyShim.__currentElementProto;
    var currentElementName = currentProto && currentProto.is;
    for (var elementName in mixinEntry.dependants) {
      if (elementName !== currentElementName) {
        mixinEntry.dependants[elementName].__applyShimInvalid = true;
      }
    }
  }
  function produceCssProperties(matchText, propertyName, valueProperty, valueMixin) {
    if (valueProperty) {
      styleUtil.processVariableAndFallback(valueProperty, function (prefix, value) {
        if (value && mapGet(value)) {
          valueMixin = '@apply ' + value + ';';
        }
      });
    }
    if (!valueMixin) {
      return matchText;
    }
    var mixinAsProperties = consumeCssProperties(valueMixin);
    var prefix = matchText.slice(0, matchText.indexOf('--'));
    var mixinValues = cssTextToMap(mixinAsProperties);
    var combinedProps = mixinValues;
    var mixinEntry = mapGet(propertyName);
    var oldProps = mixinEntry && mixinEntry.properties;
    if (oldProps) {
      combinedProps = Object.create(oldProps);
      combinedProps = Polymer.Base.mixin(combinedProps, mixinValues);
    } else {
      mapSet(propertyName, combinedProps);
    }
    var out = [];
    var p, v;
    var needToInvalidate = false;
    for (p in combinedProps) {
      v = mixinValues[p];
      if (v === undefined) {
        v = 'initial';
      }
      if (oldProps && !(p in oldProps)) {
        needToInvalidate = true;
      }
      out.push(propertyName + MIXIN_VAR_SEP + p + ': ' + v);
    }
    if (needToInvalidate) {
      invalidateMixinEntry(mixinEntry);
    }
    if (mixinEntry) {
      mixinEntry.properties = combinedProps;
    }
    if (valueProperty) {
      prefix = matchText + ';' + prefix;
    }
    return prefix + out.join('; ') + ';';
  }
  function fixVars(matchText, varA, varB) {
    return 'var(' + varA + ',' + 'var(' + varB + '))';
  }
  function atApplyToCssProperties(mixinName, fallbacks) {
    mixinName = mixinName.replace(APPLY_NAME_CLEAN, '');
    var vars = [];
    var mixinEntry = mapGet(mixinName);
    if (!mixinEntry) {
      mapSet(mixinName, {});
      mixinEntry = mapGet(mixinName);
    }
    if (mixinEntry) {
      var currentProto = ApplyShim.__currentElementProto;
      if (currentProto) {
        mixinEntry.dependants[currentProto.is] = currentProto;
      }
      var p, parts, f;
      for (p in mixinEntry.properties) {
        f = fallbacks && fallbacks[p];
        parts = [p, ': var(', mixinName, MIXIN_VAR_SEP, p];
        if (f) {
          parts.push(',', f);
        }
        parts.push(')');
        vars.push(parts.join(''));
      }
    }
    return vars.join('; ');
  }
  function consumeCssProperties(text) {
    var m;
    while (m = MIXIN_MATCH.exec(text)) {
      var matchText = m[0];
      var mixinName = m[1];
      var idx = m.index;
      var applyPos = idx + matchText.indexOf('@apply');
      var afterApplyPos = idx + matchText.length;
      var textBeforeApply = text.slice(0, applyPos);
      var textAfterApply = text.slice(afterApplyPos);
      var defaults = cssTextToMap(textBeforeApply);
      var replacement = atApplyToCssProperties(mixinName, defaults);
      text = [textBeforeApply, replacement, textAfterApply].join('');
      MIXIN_MATCH.lastIndex = idx + replacement.length;
    }
    return text;
  }
  var ApplyShim = {
    _measureElement: null,
    _map: mixinMap,
    _separator: MIXIN_VAR_SEP,
    transform: function transform(styles, elementProto) {
      this.__currentElementProto = elementProto;
      styleUtil.forRulesInStyles(styles, this._boundFindDefinitions);
      styleUtil.forRulesInStyles(styles, this._boundFindApplications);
      if (elementProto) {
        elementProto.__applyShimInvalid = false;
      }
      this.__currentElementProto = null;
    },
    _findDefinitions: function _findDefinitions(rule) {
      var cssText = rule.parsedCssText;
      cssText = cssText.replace(BAD_VAR, fixVars);
      cssText = cssText.replace(VAR_ASSIGN, produceCssProperties);
      rule.cssText = cssText;
      if (rule.selector === ':root') {
        rule.selector = ':host > *';
      }
    },
    _findApplications: function _findApplications(rule) {
      rule.cssText = consumeCssProperties(rule.cssText);
    },
    transformRule: function transformRule(rule) {
      this._findDefinitions(rule);
      this._findApplications(rule);
    },
    _getInitialValueForProperty: function _getInitialValueForProperty(property) {
      if (!this._measureElement) {
        this._measureElement = document.createElement('meta');
        this._measureElement.style.all = 'initial';
        document.head.appendChild(this._measureElement);
      }
      return window.getComputedStyle(this._measureElement).getPropertyValue(property);
    }
  };
  ApplyShim._boundTransformRule = ApplyShim.transformRule.bind(ApplyShim);
  ApplyShim._boundFindDefinitions = ApplyShim._findDefinitions.bind(ApplyShim);
  ApplyShim._boundFindApplications = ApplyShim._findApplications.bind(ApplyShim);
  return ApplyShim;
})();(function () {
  var prepElement = Polymer.Base._prepElement;
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var styleUtil = Polymer.StyleUtil;
  var styleTransformer = Polymer.StyleTransformer;
  var styleExtends = Polymer.StyleExtends;
  var applyShim = Polymer.ApplyShim;
  var settings = Polymer.Settings;
  Polymer.Base._addFeature({
    _prepElement: function _prepElement(element) {
      if (this._encapsulateStyle && this.__cssBuild !== 'shady') {
        styleTransformer.element(element, this.is, this._scopeCssViaAttr);
      }
      prepElement.call(this, element);
    },
    _prepStyles: function _prepStyles() {
      if (this._encapsulateStyle === undefined) {
        this._encapsulateStyle = !nativeShadow;
      }
      if (!nativeShadow) {
        this._scopeStyle = styleUtil.applyStylePlaceHolder(this.is);
      }
      this.__cssBuild = styleUtil.cssBuildTypeForModule(this.is);
    },
    _prepShimStyles: function _prepShimStyles() {
      if (this._template) {
        var hasTargetedCssBuild = styleUtil.isTargetedBuild(this.__cssBuild);
        if (settings.useNativeCSSProperties && this.__cssBuild === 'shadow' && hasTargetedCssBuild) {
          return;
        }
        this._styles = this._styles || this._collectStyles();
        if (settings.useNativeCSSProperties && !this.__cssBuild) {
          applyShim.transform(this._styles, this);
        }
        var cssText = settings.useNativeCSSProperties && hasTargetedCssBuild ? this._styles.length && this._styles[0].textContent.trim() : styleTransformer.elementStyles(this);
        this._prepStyleProperties();
        if (!this._needsStyleProperties() && cssText) {
          styleUtil.applyCss(cssText, this.is, nativeShadow ? this._template.content : null, this._scopeStyle);
        }
      } else {
        this._styles = [];
      }
    },
    _collectStyles: function _collectStyles() {
      var styles = [];
      var cssText = '',
          m$ = this.styleModules;
      if (m$) {
        for (var i = 0, l = m$.length, m; i < l && (m = m$[i]); i++) {
          cssText += styleUtil.cssFromModule(m);
        }
      }
      cssText += styleUtil.cssFromModule(this.is);
      var p = this._template && this._template.parentNode;
      if (this._template && (!p || p.id.toLowerCase() !== this.is)) {
        cssText += styleUtil.cssFromElement(this._template);
      }
      if (cssText) {
        var style = document.createElement('style');
        style.textContent = cssText;
        if (styleExtends.hasExtends(style.textContent)) {
          cssText = styleExtends.transform(style);
        }
        styles.push(style);
      }
      return styles;
    },
    _elementAdd: function _elementAdd(node) {
      if (this._encapsulateStyle) {
        if (node.__styleScoped) {
          node.__styleScoped = false;
        } else {
          styleTransformer.dom(node, this.is, this._scopeCssViaAttr);
        }
      }
    },
    _elementRemove: function _elementRemove(node) {
      if (this._encapsulateStyle) {
        styleTransformer.dom(node, this.is, this._scopeCssViaAttr, true);
      }
    },
    scopeSubtree: function scopeSubtree(container, shouldObserve) {
      if (nativeShadow) {
        return;
      }
      var self = this;
      var scopify = function scopify(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          var className = node.getAttribute('class');
          node.setAttribute('class', self._scopeElementClass(node, className));
          var n$ = node.querySelectorAll('*');
          for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
            className = n.getAttribute('class');
            n.setAttribute('class', self._scopeElementClass(n, className));
          }
        }
      };
      scopify(container);
      if (shouldObserve) {
        var mo = new MutationObserver(function (mxns) {
          for (var i = 0, m; i < mxns.length && (m = mxns[i]); i++) {
            if (m.addedNodes) {
              for (var j = 0; j < m.addedNodes.length; j++) {
                scopify(m.addedNodes[j]);
              }
            }
          }
        });
        mo.observe(container, {
          childList: true,
          subtree: true
        });
        return mo;
      }
    }
  });
})();Polymer.StyleProperties = (function () {
  'use strict';
  var matchesSelector = Polymer.DomApi.matchesSelector;
  var styleUtil = Polymer.StyleUtil;
  var styleTransformer = Polymer.StyleTransformer;
  var IS_IE = navigator.userAgent.match('Trident');
  var settings = Polymer.Settings;
  return {
    decorateStyles: function decorateStyles(styles, scope) {
      var self = this,
          props = {},
          keyframes = [],
          ruleIndex = 0;
      var scopeSelector = styleTransformer._calcHostScope(scope.is, scope['extends']);
      styleUtil.forRulesInStyles(styles, function (rule, style) {
        self.decorateRule(rule);
        rule.index = ruleIndex++;
        self.whenHostOrRootRule(scope, rule, style, function (info) {
          if (rule.parent.type === styleUtil.ruleTypes.MEDIA_RULE) {
            scope.__notStyleScopeCacheable = true;
          }
          if (info.isHost) {
            var hostContextOrFunction = info.selector.split(' ').some(function (s) {
              return s.indexOf(scopeSelector) === 0 && s.length !== scopeSelector.length;
            });
            scope.__notStyleScopeCacheable = scope.__notStyleScopeCacheable || hostContextOrFunction;
          }
        });
        self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
      }, function onKeyframesRule(rule) {
        keyframes.push(rule);
      });
      styles._keyframes = keyframes;
      var names = [];
      for (var i in props) {
        names.push(i);
      }
      return names;
    },
    decorateRule: function decorateRule(rule) {
      if (rule.propertyInfo) {
        return rule.propertyInfo;
      }
      var info = {},
          properties = {};
      var hasProperties = this.collectProperties(rule, properties);
      if (hasProperties) {
        info.properties = properties;
        rule.rules = null;
      }
      info.cssText = this.collectCssText(rule);
      rule.propertyInfo = info;
      return info;
    },
    collectProperties: function collectProperties(rule, properties) {
      var info = rule.propertyInfo;
      if (info) {
        if (info.properties) {
          Polymer.Base.mixin(properties, info.properties);
          return true;
        }
      } else {
        var m,
            rx = this.rx.VAR_ASSIGN;
        var cssText = rule.parsedCssText;
        var value;
        var any;
        while (m = rx.exec(cssText)) {
          value = (m[2] || m[3]).trim();
          if (value !== 'inherit') {
            properties[m[1].trim()] = value;
          }
          any = true;
        }
        return any;
      }
    },
    collectCssText: function collectCssText(rule) {
      return this.collectConsumingCssText(rule.parsedCssText);
    },
    collectConsumingCssText: function collectConsumingCssText(cssText) {
      return cssText.replace(this.rx.BRACKETED, '').replace(this.rx.VAR_ASSIGN, '');
    },
    collectPropertiesInCssText: function collectPropertiesInCssText(cssText, props) {
      var m;
      while (m = this.rx.VAR_CONSUMED.exec(cssText)) {
        var name = m[1];
        if (m[2] !== ':') {
          props[name] = true;
        }
      }
    },
    reify: function reify(props) {
      var names = Object.getOwnPropertyNames(props);
      for (var i = 0, n; i < names.length; i++) {
        n = names[i];
        props[n] = this.valueForProperty(props[n], props);
      }
    },
    valueForProperty: function valueForProperty(property, props) {
      if (property) {
        if (property.indexOf(';') >= 0) {
          property = this.valueForProperties(property, props);
        } else {
          var self = this;
          var fn = function fn(prefix, value, fallback, suffix) {
            var propertyValue = self.valueForProperty(props[value], props);
            if (!propertyValue || propertyValue === 'initial') {
              propertyValue = self.valueForProperty(props[fallback] || fallback, props) || fallback;
            } else if (propertyValue === 'apply-shim-inherit') {
              propertyValue = 'inherit';
            }
            return prefix + (propertyValue || '') + suffix;
          };
          property = styleUtil.processVariableAndFallback(property, fn);
        }
      }
      return property && property.trim() || '';
    },
    valueForProperties: function valueForProperties(property, props) {
      var parts = property.split(';');
      for (var i = 0, p, m; i < parts.length; i++) {
        if (p = parts[i]) {
          this.rx.MIXIN_MATCH.lastIndex = 0;
          m = this.rx.MIXIN_MATCH.exec(p);
          if (m) {
            p = this.valueForProperty(props[m[1]], props);
          } else {
            var colon = p.indexOf(':');
            if (colon !== -1) {
              var pp = p.substring(colon);
              pp = pp.trim();
              pp = this.valueForProperty(pp, props) || pp;
              p = p.substring(0, colon) + pp;
            }
          }
          parts[i] = p && p.lastIndexOf(';') === p.length - 1 ? p.slice(0, -1) : p || '';
        }
      }
      return parts.join(';');
    },
    applyProperties: function applyProperties(rule, props) {
      var output = '';
      if (!rule.propertyInfo) {
        this.decorateRule(rule);
      }
      if (rule.propertyInfo.cssText) {
        output = this.valueForProperties(rule.propertyInfo.cssText, props);
      }
      rule.cssText = output;
    },
    applyKeyframeTransforms: function applyKeyframeTransforms(rule, keyframeTransforms) {
      var input = rule.cssText;
      var output = rule.cssText;
      if (rule.hasAnimations == null) {
        rule.hasAnimations = this.rx.ANIMATION_MATCH.test(input);
      }
      if (rule.hasAnimations) {
        var transform;
        if (rule.keyframeNamesToTransform == null) {
          rule.keyframeNamesToTransform = [];
          for (var keyframe in keyframeTransforms) {
            transform = keyframeTransforms[keyframe];
            output = transform(input);
            if (input !== output) {
              input = output;
              rule.keyframeNamesToTransform.push(keyframe);
            }
          }
        } else {
          for (var i = 0; i < rule.keyframeNamesToTransform.length; ++i) {
            transform = keyframeTransforms[rule.keyframeNamesToTransform[i]];
            input = transform(input);
          }
          output = input;
        }
      }
      rule.cssText = output;
    },
    propertyDataFromStyles: function propertyDataFromStyles(styles, element) {
      var props = {},
          self = this;
      var o = [];
      styleUtil.forActiveRulesInStyles(styles, function (rule) {
        if (!rule.propertyInfo) {
          self.decorateRule(rule);
        }
        var selectorToMatch = rule.transformedSelector || rule.parsedSelector;
        if (element && rule.propertyInfo.properties && selectorToMatch) {
          if (matchesSelector.call(element, selectorToMatch)) {
            self.collectProperties(rule, props);
            addToBitMask(rule.index, o);
          }
        }
      });
      return {
        properties: props,
        key: o
      };
    },
    _rootSelector: /:root|:host\s*>\s*\*/,
    _checkRoot: function _checkRoot(hostScope, selector) {
      return Boolean(selector.match(this._rootSelector)) || hostScope === 'html' && selector.indexOf('html') > -1;
    },
    whenHostOrRootRule: function whenHostOrRootRule(scope, rule, style, callback) {
      if (!rule.propertyInfo) {
        self.decorateRule(rule);
      }
      if (!rule.propertyInfo.properties) {
        return;
      }
      var hostScope = scope.is ? styleTransformer._calcHostScope(scope.is, scope['extends']) : 'html';
      var parsedSelector = rule.parsedSelector;
      var isRoot = this._checkRoot(hostScope, parsedSelector);
      var isHost = !isRoot && parsedSelector.indexOf(':host') === 0;
      var cssBuild = scope.__cssBuild || style.__cssBuild;
      if (cssBuild === 'shady') {
        isRoot = parsedSelector === hostScope + ' > *.' + hostScope || parsedSelector.indexOf('html') > -1;
        isHost = !isRoot && parsedSelector.indexOf(hostScope) === 0;
      }
      if (!isRoot && !isHost) {
        return;
      }
      var selectorToMatch = hostScope;
      if (isHost) {
        if (settings.useNativeShadow && !rule.transformedSelector) {
          rule.transformedSelector = styleTransformer._transformRuleCss(rule, styleTransformer._transformComplexSelector, scope.is, hostScope);
        }
        selectorToMatch = rule.transformedSelector || rule.parsedSelector;
      }
      if (isRoot && hostScope === 'html') {
        selectorToMatch = rule.transformedSelector || rule.parsedSelector;
      }
      callback({
        selector: selectorToMatch,
        isHost: isHost,
        isRoot: isRoot
      });
    },
    hostAndRootPropertiesForScope: function hostAndRootPropertiesForScope(scope) {
      var hostProps = {},
          rootProps = {},
          self = this;
      styleUtil.forActiveRulesInStyles(scope._styles, function (rule, style) {
        self.whenHostOrRootRule(scope, rule, style, function (info) {
          var element = scope._element || scope;
          if (matchesSelector.call(element, info.selector)) {
            if (info.isHost) {
              self.collectProperties(rule, hostProps);
            } else {
              self.collectProperties(rule, rootProps);
            }
          }
        });
      });
      return {
        rootProps: rootProps,
        hostProps: hostProps
      };
    },
    transformStyles: function transformStyles(element, properties, scopeSelector) {
      var self = this;
      var hostSelector = styleTransformer._calcHostScope(element.is, element['extends']);
      var rxHostSelector = element['extends'] ? '\\' + hostSelector.slice(0, -1) + '\\]' : hostSelector;
      var hostRx = new RegExp(this.rx.HOST_PREFIX + rxHostSelector + this.rx.HOST_SUFFIX);
      var keyframeTransforms = this._elementKeyframeTransforms(element, scopeSelector);
      return styleTransformer.elementStyles(element, function (rule) {
        self.applyProperties(rule, properties);
        if (!settings.useNativeShadow && !Polymer.StyleUtil.isKeyframesSelector(rule) && rule.cssText) {
          self.applyKeyframeTransforms(rule, keyframeTransforms);
          self._scopeSelector(rule, hostRx, hostSelector, element._scopeCssViaAttr, scopeSelector);
        }
      });
    },
    _elementKeyframeTransforms: function _elementKeyframeTransforms(element, scopeSelector) {
      var keyframesRules = element._styles._keyframes;
      var keyframeTransforms = {};
      if (!settings.useNativeShadow && keyframesRules) {
        for (var i = 0, keyframesRule = keyframesRules[i]; i < keyframesRules.length; keyframesRule = keyframesRules[++i]) {
          this._scopeKeyframes(keyframesRule, scopeSelector);
          keyframeTransforms[keyframesRule.keyframesName] = this._keyframesRuleTransformer(keyframesRule);
        }
      }
      return keyframeTransforms;
    },
    _keyframesRuleTransformer: function _keyframesRuleTransformer(keyframesRule) {
      return function (cssText) {
        return cssText.replace(keyframesRule.keyframesNameRx, keyframesRule.transformedKeyframesName);
      };
    },
    _scopeKeyframes: function _scopeKeyframes(rule, scopeId) {
      rule.keyframesNameRx = new RegExp(rule.keyframesName, 'g');
      rule.transformedKeyframesName = rule.keyframesName + '-' + scopeId;
      rule.transformedSelector = rule.transformedSelector || rule.selector;
      rule.selector = rule.transformedSelector.replace(rule.keyframesName, rule.transformedKeyframesName);
    },
    _scopeSelector: function _scopeSelector(rule, hostRx, hostSelector, viaAttr, scopeId) {
      rule.transformedSelector = rule.transformedSelector || rule.selector;
      var selector = rule.transformedSelector;
      var scope = viaAttr ? '[' + styleTransformer.SCOPE_NAME + '~=' + scopeId + ']' : '.' + scopeId;
      var parts = selector.split(',');
      for (var i = 0, l = parts.length, p; i < l && (p = parts[i]); i++) {
        parts[i] = p.match(hostRx) ? p.replace(hostSelector, scope) : scope + ' ' + p;
      }
      rule.selector = parts.join(',');
    },
    applyElementScopeSelector: function applyElementScopeSelector(element, selector, old, viaAttr) {
      var c = viaAttr ? element.getAttribute(styleTransformer.SCOPE_NAME) : element.getAttribute('class') || '';
      var v = old ? c.replace(old, selector) : (c ? c + ' ' : '') + this.XSCOPE_NAME + ' ' + selector;
      if (c !== v) {
        if (viaAttr) {
          element.setAttribute(styleTransformer.SCOPE_NAME, v);
        } else {
          element.setAttribute('class', v);
        }
      }
    },
    applyElementStyle: function applyElementStyle(element, properties, selector, style) {
      var cssText = style ? style.textContent || '' : this.transformStyles(element, properties, selector);
      var s = element._customStyle;
      if (s && !settings.useNativeShadow && s !== style) {
        s._useCount--;
        if (s._useCount <= 0 && s.parentNode) {
          s.parentNode.removeChild(s);
        }
      }
      if (settings.useNativeShadow) {
        if (element._customStyle) {
          element._customStyle.textContent = cssText;
          style = element._customStyle;
        } else if (cssText) {
          style = styleUtil.applyCss(cssText, selector, element.root, element._scopeStyle);
        }
      } else {
        if (!style) {
          if (cssText) {
            style = styleUtil.applyCss(cssText, selector, null, element._scopeStyle);
          }
        } else if (!style.parentNode) {
          if (IS_IE && cssText.indexOf('@media') > -1) {
            style.textContent = cssText;
          }
          styleUtil.applyStyle(style, null, element._scopeStyle);
        }
      }
      if (style) {
        style._useCount = style._useCount || 0;
        if (element._customStyle != style) {
          style._useCount++;
        }
        element._customStyle = style;
      }
      return style;
    },
    mixinCustomStyle: function mixinCustomStyle(props, customStyle) {
      var v;
      for (var i in customStyle) {
        v = customStyle[i];
        if (v || v === 0) {
          props[i] = v;
        }
      }
    },
    updateNativeStyleProperties: function updateNativeStyleProperties(element, properties) {
      var oldPropertyNames = element.__customStyleProperties;
      if (oldPropertyNames) {
        for (var i = 0; i < oldPropertyNames.length; i++) {
          element.style.removeProperty(oldPropertyNames[i]);
        }
      }
      var propertyNames = [];
      for (var p in properties) {
        if (properties[p] !== null) {
          element.style.setProperty(p, properties[p]);
          propertyNames.push(p);
        }
      }
      element.__customStyleProperties = propertyNames;
    },
    rx: styleUtil.rx,
    XSCOPE_NAME: 'x-scope'
  };
  function addToBitMask(n, bits) {
    var o = parseInt(n / 32);
    var v = 1 << n % 32;
    bits[o] = (bits[o] || 0) | v;
  }
})();(function () {
  Polymer.StyleCache = function () {
    this.cache = {};
  };
  Polymer.StyleCache.prototype = {
    MAX: 100,
    store: function store(is, data, keyValues, keyStyles) {
      data.keyValues = keyValues;
      data.styles = keyStyles;
      var s$ = this.cache[is] = this.cache[is] || [];
      s$.push(data);
      if (s$.length > this.MAX) {
        s$.shift();
      }
    },
    retrieve: function retrieve(is, keyValues, keyStyles) {
      var cache = this.cache[is];
      if (cache) {
        for (var i = cache.length - 1, data; i >= 0; i--) {
          data = cache[i];
          if (keyStyles === data.styles && this._objectsEqual(keyValues, data.keyValues)) {
            return data;
          }
        }
      }
    },
    clear: function clear() {
      this.cache = {};
    },
    _objectsEqual: function _objectsEqual(target, source) {
      var t, s;
      for (var i in target) {
        t = target[i], s = source[i];
        if (!(typeof t === 'object' && t ? this._objectsStrictlyEqual(t, s) : t === s)) {
          return false;
        }
      }
      if (Array.isArray(target)) {
        return target.length === source.length;
      }
      return true;
    },
    _objectsStrictlyEqual: function _objectsStrictlyEqual(target, source) {
      return this._objectsEqual(target, source) && this._objectsEqual(source, target);
    }
  };
})();Polymer.StyleDefaults = (function () {
  var styleProperties = Polymer.StyleProperties;
  var StyleCache = Polymer.StyleCache;
  var nativeVariables = Polymer.Settings.useNativeCSSProperties;
  var api = Object.defineProperties({
    _styles: [],
    _properties: null,
    customStyle: {},
    _styleCache: new StyleCache(),
    _element: Polymer.DomApi.wrap(document.documentElement),
    addStyle: function addStyle(style) {
      this._styles.push(style);
      this._properties = null;
    },

    hasStyleProperties: function hasStyleProperties() {
      return Boolean(this._properties);
    },
    _needsStyleProperties: function _needsStyleProperties() {},
    _computeStyleProperties: function _computeStyleProperties() {
      return this._styleProperties;
    },
    updateStyles: function updateStyles(properties) {
      this._properties = null;
      if (properties) {
        Polymer.Base.mixin(this.customStyle, properties);
      }
      this._styleCache.clear();
      for (var i = 0, s; i < this._styles.length; i++) {
        s = this._styles[i];
        s = s.__importElement || s;
        s._apply();
      }
      if (nativeVariables) {
        styleProperties.updateNativeStyleProperties(document.documentElement, this.customStyle);
      }
    }
  }, {
    _styleProperties: {
      get: function get() {
        if (!this._properties) {
          styleProperties.decorateStyles(this._styles, this);
          this._styles._scopeStyleProperties = null;
          this._properties = styleProperties.hostAndRootPropertiesForScope(this).rootProps;
          styleProperties.mixinCustomStyle(this._properties, this.customStyle);
          styleProperties.reify(this._properties);
        }
        return this._properties;
      },
      configurable: true,
      enumerable: true
    }
  });
  return api;
})();(function () {
  'use strict';
  var _serializeValueToAttribute = Polymer.Base.serializeValueToAttribute;
  var propertyUtils = Polymer.StyleProperties;
  var styleTransformer = Polymer.StyleTransformer;
  var styleDefaults = Polymer.StyleDefaults;
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var nativeVariables = Polymer.Settings.useNativeCSSProperties;
  Polymer.Base._addFeature({
    _prepStyleProperties: function _prepStyleProperties() {
      if (!nativeVariables) {
        this._ownStylePropertyNames = this._styles && this._styles.length ? propertyUtils.decorateStyles(this._styles, this) : null;
      }
    },
    customStyle: null,
    getComputedStyleValue: function getComputedStyleValue(property) {
      if (!nativeVariables && !this._styleProperties) {
        this._computeStyleProperties();
      }
      return !nativeVariables && this._styleProperties && this._styleProperties[property] || getComputedStyle(this).getPropertyValue(property);
    },
    _setupStyleProperties: function _setupStyleProperties() {
      this.customStyle = {};
      this._styleCache = null;
      this._styleProperties = null;
      this._scopeSelector = null;
      this._ownStyleProperties = null;
      this._customStyle = null;
    },
    _needsStyleProperties: function _needsStyleProperties() {
      return Boolean(!nativeVariables && this._ownStylePropertyNames && this._ownStylePropertyNames.length);
    },
    _validateApplyShim: function _validateApplyShim() {
      if (this.__applyShimInvalid) {
        Polymer.ApplyShim.transform(this._styles, this.__proto__);
        var cssText = styleTransformer.elementStyles(this);
        if (nativeShadow) {
          var templateStyle = this._template.content.querySelector('style');
          if (templateStyle) {
            templateStyle.textContent = cssText;
          }
        } else {
          var shadyStyle = this._scopeStyle && this._scopeStyle.nextSibling;
          if (shadyStyle) {
            shadyStyle.textContent = cssText;
          }
        }
      }
    },
    _beforeAttached: function _beforeAttached() {
      if ((!this._scopeSelector || this.__stylePropertiesInvalid) && this._needsStyleProperties()) {
        this.__stylePropertiesInvalid = false;
        this._updateStyleProperties();
      }
    },
    _findStyleHost: function _findStyleHost() {
      var e = this,
          root;
      while (root = Polymer.dom(e).getOwnerRoot()) {
        if (Polymer.isInstance(root.host)) {
          return root.host;
        }
        e = root.host;
      }
      return styleDefaults;
    },
    _updateStyleProperties: function _updateStyleProperties() {
      var info,
          scope = this._findStyleHost();
      if (!scope._styleProperties) {
        scope._computeStyleProperties();
      }
      if (!scope._styleCache) {
        scope._styleCache = new Polymer.StyleCache();
      }
      var scopeData = propertyUtils.propertyDataFromStyles(scope._styles, this);
      var scopeCacheable = !this.__notStyleScopeCacheable;
      if (scopeCacheable) {
        scopeData.key.customStyle = this.customStyle;
        info = scope._styleCache.retrieve(this.is, scopeData.key, this._styles);
      }
      var scopeCached = Boolean(info);
      if (scopeCached) {
        this._styleProperties = info._styleProperties;
      } else {
        this._computeStyleProperties(scopeData.properties);
      }
      this._computeOwnStyleProperties();
      if (!scopeCached) {
        info = styleCache.retrieve(this.is, this._ownStyleProperties, this._styles);
      }
      var globalCached = Boolean(info) && !scopeCached;
      var style = this._applyStyleProperties(info);
      if (!scopeCached) {
        style = style && nativeShadow ? style.cloneNode(true) : style;
        info = {
          style: style,
          _scopeSelector: this._scopeSelector,
          _styleProperties: this._styleProperties
        };
        if (scopeCacheable) {
          scopeData.key.customStyle = {};
          this.mixin(scopeData.key.customStyle, this.customStyle);
          scope._styleCache.store(this.is, info, scopeData.key, this._styles);
        }
        if (!globalCached) {
          styleCache.store(this.is, Object.create(info), this._ownStyleProperties, this._styles);
        }
      }
    },
    _computeStyleProperties: function _computeStyleProperties(scopeProps) {
      var scope = this._findStyleHost();
      if (!scope._styleProperties) {
        scope._computeStyleProperties();
      }
      var props = Object.create(scope._styleProperties);
      var hostAndRootProps = propertyUtils.hostAndRootPropertiesForScope(this);
      this.mixin(props, hostAndRootProps.hostProps);
      scopeProps = scopeProps || propertyUtils.propertyDataFromStyles(scope._styles, this).properties;
      this.mixin(props, scopeProps);
      this.mixin(props, hostAndRootProps.rootProps);
      propertyUtils.mixinCustomStyle(props, this.customStyle);
      propertyUtils.reify(props);
      this._styleProperties = props;
    },
    _computeOwnStyleProperties: function _computeOwnStyleProperties() {
      var props = {};
      for (var i = 0, n; i < this._ownStylePropertyNames.length; i++) {
        n = this._ownStylePropertyNames[i];
        props[n] = this._styleProperties[n];
      }
      this._ownStyleProperties = props;
    },
    _scopeCount: 0,
    _applyStyleProperties: function _applyStyleProperties(info) {
      var oldScopeSelector = this._scopeSelector;
      this._scopeSelector = info ? info._scopeSelector : this.is + '-' + this.__proto__._scopeCount++;
      var style = propertyUtils.applyElementStyle(this, this._styleProperties, this._scopeSelector, info && info.style);
      if (!nativeShadow) {
        propertyUtils.applyElementScopeSelector(this, this._scopeSelector, oldScopeSelector, this._scopeCssViaAttr);
      }
      return style;
    },
    serializeValueToAttribute: function serializeValueToAttribute(value, attribute, node) {
      node = node || this;
      if (attribute === 'class' && !nativeShadow) {
        var host = node === this ? this.domHost || this.dataHost : this;
        if (host) {
          value = host._scopeElementClass(node, value);
        }
      }
      node = this.shadyRoot && this.shadyRoot._hasDistributed ? Polymer.dom(node) : node;
      _serializeValueToAttribute.call(this, value, attribute, node);
    },
    _scopeElementClass: function _scopeElementClass(element, selector) {
      if (!nativeShadow && !this._scopeCssViaAttr) {
        selector = (selector ? selector + ' ' : '') + SCOPE_NAME + ' ' + this.is + (element._scopeSelector ? ' ' + XSCOPE_NAME + ' ' + element._scopeSelector : '');
      }
      return selector;
    },
    updateStyles: function updateStyles(properties) {
      if (properties) {
        this.mixin(this.customStyle, properties);
      }
      if (nativeVariables) {
        propertyUtils.updateNativeStyleProperties(this, this.customStyle);
      } else {
        if (this.isAttached) {
          if (this._needsStyleProperties()) {
            this._updateStyleProperties();
          } else {
            this._styleProperties = null;
          }
        } else {
          this.__stylePropertiesInvalid = true;
        }
        if (this._styleCache) {
          this._styleCache.clear();
        }
        this._updateRootStyles();
      }
    },
    _updateRootStyles: function _updateRootStyles(root) {
      root = root || this.root;
      var c$ = Polymer.dom(root)._query(function (e) {
        return e.shadyRoot || e.shadowRoot;
      });
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        if (c.updateStyles) {
          c.updateStyles();
        }
      }
    }
  });
  Polymer.updateStyles = function (properties) {
    styleDefaults.updateStyles(properties);
    Polymer.Base._updateRootStyles(document);
  };
  var styleCache = new Polymer.StyleCache();
  Polymer.customStyleCache = styleCache;
  var SCOPE_NAME = styleTransformer.SCOPE_NAME;
  var XSCOPE_NAME = propertyUtils.XSCOPE_NAME;
})();Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepConstructor();
    this._prepStyles();
  },
  _finishRegisterFeatures: function _finishRegisterFeatures() {
    this._prepTemplate();
    this._prepShimStyles();
    this._prepAnnotations();
    this._prepEffects();
    this._prepBehaviors();
    this._prepPropertyInfo();
    this._prepBindings();
    this._prepShady();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addPropertyEffects(b.properties);
    this._addComplexObserverEffects(b.observers);
    this._addHostAttributes(b.hostAttributes);
  },
  _initFeatures: function _initFeatures() {
    this._setupGestures();
    this._setupConfigure();
    this._setupStyleProperties();
    this._setupDebouncers();
    this._setupShady();
    this._registerHost();
    if (this._template) {
      this._validateApplyShim();
      this._poolContent();
      this._beginHosting();
      this._stampTemplate();
      this._endHosting();
      this._marshalAnnotationReferences();
    }
    this._marshalInstanceEffects();
    this._marshalBehaviors();
    this._marshalHostAttributes();
    this._marshalAttributes();
    this._tryReady();
  },
  _marshalBehavior: function _marshalBehavior(b) {
    if (b.listeners) {
      this._listenListeners(b.listeners);
    }
  }
});(function () {
  var propertyUtils = Polymer.StyleProperties;
  var styleUtil = Polymer.StyleUtil;
  var cssParse = Polymer.CssParse;
  var styleDefaults = Polymer.StyleDefaults;
  var styleTransformer = Polymer.StyleTransformer;
  var applyShim = Polymer.ApplyShim;
  var debounce = Polymer.Debounce;
  var settings = Polymer.Settings;
  var updateDebouncer;
  Polymer({
    is: 'custom-style',
    'extends': 'style',
    _template: null,
    properties: { include: String },
    ready: function ready() {
      this.__appliedElement = this.__appliedElement || this;
      this.__cssBuild = styleUtil.getCssBuildType(this);
      if (this.__appliedElement !== this) {
        this.__appliedElement.__cssBuild = this.__cssBuild;
      }
      this._tryApply();
    },
    attached: function attached() {
      this._tryApply();
    },
    _tryApply: function _tryApply() {
      if (!this._appliesToDocument) {
        if (this.parentNode && this.parentNode.localName !== 'dom-module') {
          this._appliesToDocument = true;
          var e = this.__appliedElement;
          if (!settings.useNativeCSSProperties) {
            this.__needsUpdateStyles = styleDefaults.hasStyleProperties();
            styleDefaults.addStyle(e);
          }
          if (e.textContent || this.include) {
            this._apply(true);
          } else {
            var self = this;
            var observer = new MutationObserver(function () {
              observer.disconnect();
              self._apply(true);
            });
            observer.observe(e, { childList: true });
          }
        }
      }
    },
    _updateStyles: function _updateStyles() {
      Polymer.updateStyles();
    },
    _apply: function _apply(initialApply) {
      var e = this.__appliedElement;
      if (this.include) {
        e.textContent = styleUtil.cssFromModules(this.include, true) + e.textContent;
      }
      if (!e.textContent) {
        return;
      }
      var buildType = this.__cssBuild;
      var targetedBuild = styleUtil.isTargetedBuild(buildType);
      if (settings.useNativeCSSProperties && targetedBuild) {
        return;
      }
      var styleRules = styleUtil.rulesForStyle(e);
      if (!targetedBuild) {
        styleUtil.forEachRule(styleRules, function (rule) {
          styleTransformer.documentRule(rule);
        });
        if (settings.useNativeCSSProperties && !buildType) {
          applyShim.transform([e]);
        }
      }
      if (settings.useNativeCSSProperties) {
        e.textContent = styleUtil.toCssText(styleRules);
      } else {
        var self = this;
        var fn = function fn() {
          self._flushCustomProperties();
        };
        if (initialApply) {
          Polymer.RenderStatus.whenReady(fn);
        } else {
          fn();
        }
      }
    },
    _flushCustomProperties: function _flushCustomProperties() {
      if (this.__needsUpdateStyles) {
        this.__needsUpdateStyles = false;
        updateDebouncer = debounce(updateDebouncer, this._updateStyles);
      } else {
        this._applyCustomProperties();
      }
    },
    _applyCustomProperties: function _applyCustomProperties() {
      var element = this.__appliedElement;
      this._computeStyleProperties();
      var props = this._styleProperties;
      var rules = styleUtil.rulesForStyle(element);
      if (!rules) {
        return;
      }
      element.textContent = styleUtil.toCssText(rules, function (rule) {
        var css = rule.cssText = rule.parsedCssText;
        if (rule.propertyInfo && rule.propertyInfo.cssText) {
          css = cssParse.removeCustomPropAssignment(css);
          rule.cssText = propertyUtils.valueForProperties(css, props);
        }
      });
    }
  });
})();Polymer.Templatizer = {
  properties: { __hideTemplateChildren__: { observer: '_showHideChildren' } },
  _instanceProps: Polymer.nob,
  _parentPropPrefix: '_parent_',
  templatize: function templatize(template) {
    this._templatized = template;
    if (!template._content) {
      template._content = template.content;
    }
    if (template._content._ctor) {
      this.ctor = template._content._ctor;
      this._prepParentProperties(this.ctor.prototype, template);
      return;
    }
    var archetype = Object.create(Polymer.Base);
    this._customPrepAnnotations(archetype, template);
    this._prepParentProperties(archetype, template);
    archetype._prepEffects();
    this._customPrepEffects(archetype);
    archetype._prepBehaviors();
    archetype._prepPropertyInfo();
    archetype._prepBindings();
    archetype._notifyPathUp = this._notifyPathUpImpl;
    archetype._scopeElementClass = this._scopeElementClassImpl;
    archetype.listen = this._listenImpl;
    archetype._showHideChildren = this._showHideChildrenImpl;
    archetype.__setPropertyOrig = this.__setProperty;
    archetype.__setProperty = this.__setPropertyImpl;
    var _constructor = this._constructorImpl;
    var ctor = function TemplateInstance(model, host) {
      _constructor.call(this, model, host);
    };
    ctor.prototype = archetype;
    archetype.constructor = ctor;
    template._content._ctor = ctor;
    this.ctor = ctor;
  },
  _getRootDataHost: function _getRootDataHost() {
    return this.dataHost && this.dataHost._rootDataHost || this.dataHost;
  },
  _showHideChildrenImpl: function _showHideChildrenImpl(hide) {
    var c = this._children;
    for (var i = 0; i < c.length; i++) {
      var n = c[i];
      if (Boolean(hide) != Boolean(n.__hideTemplateChildren__)) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hide) {
            n.__polymerTextContent__ = n.textContent;
            n.textContent = '';
          } else {
            n.textContent = n.__polymerTextContent__;
          }
        } else if (n.style) {
          if (hide) {
            n.__polymerDisplay__ = n.style.display;
            n.style.display = 'none';
          } else {
            n.style.display = n.__polymerDisplay__;
          }
        }
      }
      n.__hideTemplateChildren__ = hide;
    }
  },
  __setPropertyImpl: function __setPropertyImpl(property, value, fromAbove, node) {
    if (node && node.__hideTemplateChildren__ && property == 'textContent') {
      property = '__polymerTextContent__';
    }
    this.__setPropertyOrig(property, value, fromAbove, node);
  },
  _debounceTemplate: function _debounceTemplate(fn) {
    Polymer.dom.addDebouncer(this.debounce('_debounceTemplate', fn));
  },
  _flushTemplates: function _flushTemplates() {
    Polymer.dom.flush();
  },
  _customPrepEffects: function _customPrepEffects(archetype) {
    var parentProps = archetype._parentProps;
    for (var prop in parentProps) {
      archetype._addPropertyEffect(prop, 'function', this._createHostPropEffector(prop));
    }
    for (prop in this._instanceProps) {
      archetype._addPropertyEffect(prop, 'function', this._createInstancePropEffector(prop));
    }
  },
  _customPrepAnnotations: function _customPrepAnnotations(archetype, template) {
    archetype._template = template;
    var c = template._content;
    if (!c._notes) {
      var rootDataHost = archetype._rootDataHost;
      if (rootDataHost) {
        Polymer.Annotations.prepElement = function () {
          rootDataHost._prepElement();
        };
      }
      c._notes = Polymer.Annotations.parseAnnotations(template);
      Polymer.Annotations.prepElement = null;
      this._processAnnotations(c._notes);
    }
    archetype._notes = c._notes;
    archetype._parentProps = c._parentProps;
  },
  _prepParentProperties: function _prepParentProperties(archetype, template) {
    var parentProps = this._parentProps = archetype._parentProps;
    if (this._forwardParentProp && parentProps) {
      var proto = archetype._parentPropProto;
      var prop;
      if (!proto) {
        for (prop in this._instanceProps) {
          delete parentProps[prop];
        }
        proto = archetype._parentPropProto = Object.create(null);
        if (template != this) {
          Polymer.Bind.prepareModel(proto);
          Polymer.Base.prepareModelNotifyPath(proto);
        }
        for (prop in parentProps) {
          var parentProp = this._parentPropPrefix + prop;
          var effects = [{
            kind: 'function',
            effect: this._createForwardPropEffector(prop),
            fn: Polymer.Bind._functionEffect
          }, {
            kind: 'notify',
            fn: Polymer.Bind._notifyEffect,
            effect: { event: Polymer.CaseMap.camelToDashCase(parentProp) + '-changed' }
          }];
          Polymer.Bind._createAccessors(proto, parentProp, effects);
        }
      }
      var self = this;
      if (template != this) {
        Polymer.Bind.prepareInstance(template);
        template._forwardParentProp = function (source, value) {
          self._forwardParentProp(source, value);
        };
      }
      this._extendTemplate(template, proto);
      template._pathEffector = function (path, value, fromAbove) {
        return self._pathEffectorImpl(path, value, fromAbove);
      };
    }
  },
  _createForwardPropEffector: function _createForwardPropEffector(prop) {
    return function (source, value) {
      this._forwardParentProp(prop, value);
    };
  },
  _createHostPropEffector: function _createHostPropEffector(prop) {
    var prefix = this._parentPropPrefix;
    return function (source, value) {
      this.dataHost._templatized[prefix + prop] = value;
    };
  },
  _createInstancePropEffector: function _createInstancePropEffector(prop) {
    return function (source, value, old, fromAbove) {
      if (!fromAbove) {
        this.dataHost._forwardInstanceProp(this, prop, value);
      }
    };
  },
  _extendTemplate: function _extendTemplate(template, proto) {
    var n$ = Object.getOwnPropertyNames(proto);
    if (proto._propertySetter) {
      template._propertySetter = proto._propertySetter;
    }
    for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
      var val = template[n];
      var pd = Object.getOwnPropertyDescriptor(proto, n);
      Object.defineProperty(template, n, pd);
      if (val !== undefined) {
        template._propertySetter(n, val);
      }
    }
  },
  _showHideChildren: function _showHideChildren(hidden) {},
  _forwardInstancePath: function _forwardInstancePath(inst, path, value) {},
  _forwardInstanceProp: function _forwardInstanceProp(inst, prop, value) {},
  _notifyPathUpImpl: function _notifyPathUpImpl(path, value) {
    var dataHost = this.dataHost;
    var root = Polymer.Path.root(path);
    dataHost._forwardInstancePath.call(dataHost, this, path, value);
    if (root in dataHost._parentProps) {
      dataHost._templatized._notifyPath(dataHost._parentPropPrefix + path, value);
    }
  },
  _pathEffectorImpl: function _pathEffectorImpl(path, value, fromAbove) {
    if (this._forwardParentPath) {
      if (path.indexOf(this._parentPropPrefix) === 0) {
        var subPath = path.substring(this._parentPropPrefix.length);
        var model = Polymer.Path.root(subPath);
        if (model in this._parentProps) {
          this._forwardParentPath(subPath, value);
        }
      }
    }
    Polymer.Base._pathEffector.call(this._templatized, path, value, fromAbove);
  },
  _constructorImpl: function _constructorImpl(model, host) {
    this._rootDataHost = host._getRootDataHost();
    this._setupConfigure(model);
    this._registerHost(host);
    this._beginHosting();
    this.root = this.instanceTemplate(this._template);
    this.root.__noContent = !this._notes._hasContent;
    this.root.__styleScoped = true;
    this._endHosting();
    this._marshalAnnotatedNodes();
    this._marshalInstanceEffects();
    this._marshalAnnotatedListeners();
    var children = [];
    for (var n = this.root.firstChild; n; n = n.nextSibling) {
      children.push(n);
      n._templateInstance = this;
    }
    this._children = children;
    if (host.__hideTemplateChildren__) {
      this._showHideChildren(true);
    }
    this._tryReady();
  },
  _listenImpl: function _listenImpl(node, eventName, methodName) {
    var model = this;
    var host = this._rootDataHost;
    var handler = host._createEventHandler(node, eventName, methodName);
    var decorated = function decorated(e) {
      e.model = model;
      handler(e);
    };
    host._listen(node, eventName, decorated);
  },
  _scopeElementClassImpl: function _scopeElementClassImpl(node, value) {
    var host = this._rootDataHost;
    if (host) {
      return host._scopeElementClass(node, value);
    }
    return value;
  },
  stamp: function stamp(model) {
    model = model || {};
    if (this._parentProps) {
      var templatized = this._templatized;
      for (var prop in this._parentProps) {
        if (model[prop] === undefined) {
          model[prop] = templatized[this._parentPropPrefix + prop];
        }
      }
    }
    return new this.ctor(model, this);
  },
  modelForElement: function modelForElement(el) {
    var model;
    while (el) {
      if (model = el._templateInstance) {
        if (model.dataHost != this) {
          el = model.dataHost;
        } else {
          return model;
        }
      } else {
        el = el.parentNode;
      }
    }
  }
};Polymer({
  is: 'dom-template',
  'extends': 'template',
  _template: null,
  behaviors: [Polymer.Templatizer],
  ready: function ready() {
    this.templatize(this);
  }
});Polymer._collections = new WeakMap();
Polymer.Collection = function (userArray) {
  Polymer._collections.set(userArray, this);
  this.userArray = userArray;
  this.store = userArray.slice();
  this.initMap();
};
Polymer.Collection.prototype = {
  constructor: Polymer.Collection,
  initMap: function initMap() {
    var omap = this.omap = new WeakMap();
    var pmap = this.pmap = {};
    var s = this.store;
    for (var i = 0; i < s.length; i++) {
      var item = s[i];
      if (item && typeof item == 'object') {
        omap.set(item, i);
      } else {
        pmap[item] = i;
      }
    }
  },
  add: function add(item) {
    var key = this.store.push(item) - 1;
    if (item && typeof item == 'object') {
      this.omap.set(item, key);
    } else {
      this.pmap[item] = key;
    }
    return '#' + key;
  },
  removeKey: function removeKey(key) {
    if (key = this._parseKey(key)) {
      this._removeFromMap(this.store[key]);
      delete this.store[key];
    }
  },
  _removeFromMap: function _removeFromMap(item) {
    if (item && typeof item == 'object') {
      this.omap['delete'](item);
    } else {
      delete this.pmap[item];
    }
  },
  remove: function remove(item) {
    var key = this.getKey(item);
    this.removeKey(key);
    return key;
  },
  getKey: function getKey(item) {
    var key;
    if (item && typeof item == 'object') {
      key = this.omap.get(item);
    } else {
      key = this.pmap[item];
    }
    if (key != undefined) {
      return '#' + key;
    }
  },
  getKeys: function getKeys() {
    return Object.keys(this.store).map(function (key) {
      return '#' + key;
    });
  },
  _parseKey: function _parseKey(key) {
    if (key && key[0] == '#') {
      return key.slice(1);
    }
  },
  setItem: function setItem(key, item) {
    if (key = this._parseKey(key)) {
      var old = this.store[key];
      if (old) {
        this._removeFromMap(old);
      }
      if (item && typeof item == 'object') {
        this.omap.set(item, key);
      } else {
        this.pmap[item] = key;
      }
      this.store[key] = item;
    }
  },
  getItem: function getItem(key) {
    if (key = this._parseKey(key)) {
      return this.store[key];
    }
  },
  getItems: function getItems() {
    var items = [],
        store = this.store;
    for (var key in store) {
      items.push(store[key]);
    }
    return items;
  },
  _applySplices: function _applySplices(splices) {
    var keyMap = {},
        key;
    for (var i = 0, s; i < splices.length && (s = splices[i]); i++) {
      s.addedKeys = [];
      for (var j = 0; j < s.removed.length; j++) {
        key = this.getKey(s.removed[j]);
        keyMap[key] = keyMap[key] ? null : -1;
      }
      for (j = 0; j < s.addedCount; j++) {
        var item = this.userArray[s.index + j];
        key = this.getKey(item);
        key = key === undefined ? this.add(item) : key;
        keyMap[key] = keyMap[key] ? null : 1;
        s.addedKeys.push(key);
      }
    }
    var removed = [];
    var added = [];
    for (key in keyMap) {
      if (keyMap[key] < 0) {
        this.removeKey(key);
        removed.push(key);
      }
      if (keyMap[key] > 0) {
        added.push(key);
      }
    }
    return [{
      removed: removed,
      added: added
    }];
  }
};
Polymer.Collection.get = function (userArray) {
  return Polymer._collections.get(userArray) || new Polymer.Collection(userArray);
};
Polymer.Collection.applySplices = function (userArray, splices) {
  var coll = Polymer._collections.get(userArray);
  return coll ? coll._applySplices(splices) : null;
};Polymer({
  is: 'dom-repeat',
  'extends': 'template',
  _template: null,
  properties: {
    items: { type: Array },
    as: {
      type: String,
      value: 'item'
    },
    indexAs: {
      type: String,
      value: 'index'
    },
    sort: {
      type: Function,
      observer: '_sortChanged'
    },
    filter: {
      type: Function,
      observer: '_filterChanged'
    },
    observe: {
      type: String,
      observer: '_observeChanged'
    },
    delay: Number,
    renderedItemCount: {
      type: Number,
      notify: true,
      readOnly: true
    },
    initialCount: {
      type: Number,
      observer: '_initializeChunking'
    },
    targetFramerate: {
      type: Number,
      value: 20
    },
    _targetFrameTime: {
      type: Number,
      computed: '_computeFrameTime(targetFramerate)'
    }
  },
  behaviors: [Polymer.Templatizer],
  observers: ['_itemsChanged(items.*)'],
  created: function created() {
    this._instances = [];
    this._pool = [];
    this._limit = Infinity;
    var self = this;
    this._boundRenderChunk = function () {
      self._renderChunk();
    };
  },
  detached: function detached() {
    this.__isDetached = true;
    for (var i = 0; i < this._instances.length; i++) {
      this._detachInstance(i);
    }
  },
  attached: function attached() {
    if (this.__isDetached) {
      this.__isDetached = false;
      var parent = Polymer.dom(Polymer.dom(this).parentNode);
      for (var i = 0; i < this._instances.length; i++) {
        this._attachInstance(i, parent);
      }
    }
  },
  ready: function ready() {
    this._instanceProps = { __key__: true };
    this._instanceProps[this.as] = true;
    this._instanceProps[this.indexAs] = true;
    if (!this.ctor) {
      this.templatize(this);
    }
  },
  _sortChanged: function _sortChanged(sort) {
    var dataHost = this._getRootDataHost();
    this._sortFn = sort && (typeof sort == 'function' ? sort : function () {
      return dataHost[sort].apply(dataHost, arguments);
    });
    this._needFullRefresh = true;
    if (this.items) {
      this._debounceTemplate(this._render);
    }
  },
  _filterChanged: function _filterChanged(filter) {
    var dataHost = this._getRootDataHost();
    this._filterFn = filter && (typeof filter == 'function' ? filter : function () {
      return dataHost[filter].apply(dataHost, arguments);
    });
    this._needFullRefresh = true;
    if (this.items) {
      this._debounceTemplate(this._render);
    }
  },
  _computeFrameTime: function _computeFrameTime(rate) {
    return Math.ceil(1000 / rate);
  },
  _initializeChunking: function _initializeChunking() {
    if (this.initialCount) {
      this._limit = this.initialCount;
      this._chunkCount = this.initialCount;
      this._lastChunkTime = performance.now();
    }
  },
  _tryRenderChunk: function _tryRenderChunk() {
    if (this.items && this._limit < this.items.length) {
      this.debounce('renderChunk', this._requestRenderChunk);
    }
  },
  _requestRenderChunk: function _requestRenderChunk() {
    requestAnimationFrame(this._boundRenderChunk);
  },
  _renderChunk: function _renderChunk() {
    var currChunkTime = performance.now();
    var ratio = this._targetFrameTime / (currChunkTime - this._lastChunkTime);
    this._chunkCount = Math.round(this._chunkCount * ratio) || 1;
    this._limit += this._chunkCount;
    this._lastChunkTime = currChunkTime;
    this._debounceTemplate(this._render);
  },
  _observeChanged: function _observeChanged() {
    this._observePaths = this.observe && this.observe.replace('.*', '.').split(' ');
  },
  _itemsChanged: function _itemsChanged(change) {
    if (change.path == 'items') {
      if (Array.isArray(this.items)) {
        this.collection = Polymer.Collection.get(this.items);
      } else if (!this.items) {
        this.collection = null;
      } else {
        this._error(this._logf('dom-repeat', 'expected array for `items`,' + ' found', this.items));
      }
      this._keySplices = [];
      this._indexSplices = [];
      this._needFullRefresh = true;
      this._initializeChunking();
      this._debounceTemplate(this._render);
    } else if (change.path == 'items.splices') {
      this._keySplices = this._keySplices.concat(change.value.keySplices);
      this._indexSplices = this._indexSplices.concat(change.value.indexSplices);
      this._debounceTemplate(this._render);
    } else {
      var subpath = change.path.slice(6);
      this._forwardItemPath(subpath, change.value);
      this._checkObservedPaths(subpath);
    }
  },
  _checkObservedPaths: function _checkObservedPaths(path) {
    if (this._observePaths) {
      path = path.substring(path.indexOf('.') + 1);
      var paths = this._observePaths;
      for (var i = 0; i < paths.length; i++) {
        if (path.indexOf(paths[i]) === 0) {
          this._needFullRefresh = true;
          if (this.delay) {
            this.debounce('render', this._render, this.delay);
          } else {
            this._debounceTemplate(this._render);
          }
          return;
        }
      }
    }
  },
  render: function render() {
    this._needFullRefresh = true;
    this._debounceTemplate(this._render);
    this._flushTemplates();
  },
  _render: function _render() {
    if (this._needFullRefresh) {
      this._applyFullRefresh();
      this._needFullRefresh = false;
    } else if (this._keySplices.length) {
      if (this._sortFn) {
        this._applySplicesUserSort(this._keySplices);
      } else {
        if (this._filterFn) {
          this._applyFullRefresh();
        } else {
          this._applySplicesArrayOrder(this._indexSplices);
        }
      }
    } else {}
    this._keySplices = [];
    this._indexSplices = [];
    var keyToIdx = this._keyToInstIdx = {};
    for (var i = this._instances.length - 1; i >= 0; i--) {
      var inst = this._instances[i];
      if (inst.isPlaceholder && i < this._limit) {
        inst = this._insertInstance(i, inst.__key__);
      } else if (!inst.isPlaceholder && i >= this._limit) {
        inst = this._downgradeInstance(i, inst.__key__);
      }
      keyToIdx[inst.__key__] = i;
      if (!inst.isPlaceholder) {
        inst.__setProperty(this.indexAs, i, true);
      }
    }
    this._pool.length = 0;
    this._setRenderedItemCount(this._instances.length);
    this.fire('dom-change');
    this._tryRenderChunk();
  },
  _applyFullRefresh: function _applyFullRefresh() {
    var c = this.collection;
    var keys;
    if (this._sortFn) {
      keys = c ? c.getKeys() : [];
    } else {
      keys = [];
      var items = this.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          keys.push(c.getKey(items[i]));
        }
      }
    }
    var self = this;
    if (this._filterFn) {
      keys = keys.filter(function (a) {
        return self._filterFn(c.getItem(a));
      });
    }
    if (this._sortFn) {
      keys.sort(function (a, b) {
        return self._sortFn(c.getItem(a), c.getItem(b));
      });
    }
    for (i = 0; i < keys.length; i++) {
      var key = keys[i];
      var inst = this._instances[i];
      if (inst) {
        inst.__key__ = key;
        if (!inst.isPlaceholder && i < this._limit) {
          inst.__setProperty(this.as, c.getItem(key), true);
        }
      } else if (i < this._limit) {
        this._insertInstance(i, key);
      } else {
        this._insertPlaceholder(i, key);
      }
    }
    for (var j = this._instances.length - 1; j >= i; j--) {
      this._detachAndRemoveInstance(j);
    }
  },
  _numericSort: function _numericSort(a, b) {
    return a - b;
  },
  _applySplicesUserSort: function _applySplicesUserSort(splices) {
    var c = this.collection;
    var keyMap = {};
    var key;
    for (var i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (var j = 0; j < s.removed.length; j++) {
        key = s.removed[j];
        keyMap[key] = keyMap[key] ? null : -1;
      }
      for (j = 0; j < s.added.length; j++) {
        key = s.added[j];
        keyMap[key] = keyMap[key] ? null : 1;
      }
    }
    var removedIdxs = [];
    var addedKeys = [];
    for (key in keyMap) {
      if (keyMap[key] === -1) {
        removedIdxs.push(this._keyToInstIdx[key]);
      }
      if (keyMap[key] === 1) {
        addedKeys.push(key);
      }
    }
    if (removedIdxs.length) {
      removedIdxs.sort(this._numericSort);
      for (i = removedIdxs.length - 1; i >= 0; i--) {
        var idx = removedIdxs[i];
        if (idx !== undefined) {
          this._detachAndRemoveInstance(idx);
        }
      }
    }
    var self = this;
    if (addedKeys.length) {
      if (this._filterFn) {
        addedKeys = addedKeys.filter(function (a) {
          return self._filterFn(c.getItem(a));
        });
      }
      addedKeys.sort(function (a, b) {
        return self._sortFn(c.getItem(a), c.getItem(b));
      });
      var start = 0;
      for (i = 0; i < addedKeys.length; i++) {
        start = this._insertRowUserSort(start, addedKeys[i]);
      }
    }
  },
  _insertRowUserSort: function _insertRowUserSort(start, key) {
    var c = this.collection;
    var item = c.getItem(key);
    var end = this._instances.length - 1;
    var idx = -1;
    while (start <= end) {
      var mid = start + end >> 1;
      var midKey = this._instances[mid].__key__;
      var cmp = this._sortFn(c.getItem(midKey), item);
      if (cmp < 0) {
        start = mid + 1;
      } else if (cmp > 0) {
        end = mid - 1;
      } else {
        idx = mid;
        break;
      }
    }
    if (idx < 0) {
      idx = end + 1;
    }
    this._insertPlaceholder(idx, key);
    return idx;
  },
  _applySplicesArrayOrder: function _applySplicesArrayOrder(splices) {
    for (var i = 0, s; i < splices.length && (s = splices[i]); i++) {
      for (var j = 0; j < s.removed.length; j++) {
        this._detachAndRemoveInstance(s.index);
      }
      for (j = 0; j < s.addedKeys.length; j++) {
        this._insertPlaceholder(s.index + j, s.addedKeys[j]);
      }
    }
  },
  _detachInstance: function _detachInstance(idx) {
    var inst = this._instances[idx];
    if (!inst.isPlaceholder) {
      for (var i = 0; i < inst._children.length; i++) {
        var el = inst._children[i];
        Polymer.dom(inst.root).appendChild(el);
      }
      return inst;
    }
  },
  _attachInstance: function _attachInstance(idx, parent) {
    var inst = this._instances[idx];
    if (!inst.isPlaceholder) {
      parent.insertBefore(inst.root, this);
    }
  },
  _detachAndRemoveInstance: function _detachAndRemoveInstance(idx) {
    var inst = this._detachInstance(idx);
    if (inst) {
      this._pool.push(inst);
    }
    this._instances.splice(idx, 1);
  },
  _insertPlaceholder: function _insertPlaceholder(idx, key) {
    this._instances.splice(idx, 0, {
      isPlaceholder: true,
      __key__: key
    });
  },
  _stampInstance: function _stampInstance(idx, key) {
    var model = { __key__: key };
    model[this.as] = this.collection.getItem(key);
    model[this.indexAs] = idx;
    return this.stamp(model);
  },
  _insertInstance: function _insertInstance(idx, key) {
    var inst = this._pool.pop();
    if (inst) {
      inst.__setProperty(this.as, this.collection.getItem(key), true);
      inst.__setProperty('__key__', key, true);
    } else {
      inst = this._stampInstance(idx, key);
    }
    var beforeRow = this._instances[idx + 1];
    var beforeNode = beforeRow && !beforeRow.isPlaceholder ? beforeRow._children[0] : this;
    var parentNode = Polymer.dom(this).parentNode;
    Polymer.dom(parentNode).insertBefore(inst.root, beforeNode);
    this._instances[idx] = inst;
    return inst;
  },
  _downgradeInstance: function _downgradeInstance(idx, key) {
    var inst = this._detachInstance(idx);
    if (inst) {
      this._pool.push(inst);
    }
    inst = {
      isPlaceholder: true,
      __key__: key
    };
    this._instances[idx] = inst;
    return inst;
  },
  _showHideChildren: function _showHideChildren(hidden) {
    for (var i = 0; i < this._instances.length; i++) {
      if (!this._instances[i].isPlaceholder) this._instances[i]._showHideChildren(hidden);
    }
  },
  _forwardInstanceProp: function _forwardInstanceProp(inst, prop, value) {
    if (prop == this.as) {
      var idx;
      if (this._sortFn || this._filterFn) {
        idx = this.items.indexOf(this.collection.getItem(inst.__key__));
      } else {
        idx = inst[this.indexAs];
      }
      this.set('items.' + idx, value);
    }
  },
  _forwardInstancePath: function _forwardInstancePath(inst, path, value) {
    if (path.indexOf(this.as + '.') === 0) {
      this._notifyPath('items.' + inst.__key__ + '.' + path.slice(this.as.length + 1), value);
    }
  },
  _forwardParentProp: function _forwardParentProp(prop, value) {
    var i$ = this._instances;
    for (var i = 0, inst; i < i$.length && (inst = i$[i]); i++) {
      if (!inst.isPlaceholder) {
        inst.__setProperty(prop, value, true);
      }
    }
  },
  _forwardParentPath: function _forwardParentPath(path, value) {
    var i$ = this._instances;
    for (var i = 0, inst; i < i$.length && (inst = i$[i]); i++) {
      if (!inst.isPlaceholder) {
        inst._notifyPath(path, value, true);
      }
    }
  },
  _forwardItemPath: function _forwardItemPath(path, value) {
    if (this._keyToInstIdx) {
      var dot = path.indexOf('.');
      var key = path.substring(0, dot < 0 ? path.length : dot);
      var idx = this._keyToInstIdx[key];
      var inst = this._instances[idx];
      if (inst && !inst.isPlaceholder) {
        if (dot >= 0) {
          path = this.as + '.' + path.substring(dot + 1);
          inst._notifyPath(path, value, true);
        } else {
          inst.__setProperty(this.as, value, true);
        }
      }
    }
  },
  itemForElement: function itemForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance[this.as];
  },
  keyForElement: function keyForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance.__key__;
  },
  indexForElement: function indexForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance[this.indexAs];
  }
});Polymer({
  is: 'array-selector',
  _template: null,
  properties: {
    items: {
      type: Array,
      observer: 'clearSelection'
    },
    multi: {
      type: Boolean,
      value: false,
      observer: 'clearSelection'
    },
    selected: {
      type: Object,
      notify: true
    },
    selectedItem: {
      type: Object,
      notify: true
    },
    toggle: {
      type: Boolean,
      value: false
    }
  },
  clearSelection: function clearSelection() {
    if (Array.isArray(this.selected)) {
      for (var i = 0; i < this.selected.length; i++) {
        this.unlinkPaths('selected.' + i);
      }
    } else {
      this.unlinkPaths('selected');
      this.unlinkPaths('selectedItem');
    }
    if (this.multi) {
      if (!this.selected || this.selected.length) {
        this.selected = [];
        this._selectedColl = Polymer.Collection.get(this.selected);
      }
    } else {
      this.selected = null;
      this._selectedColl = null;
    }
    this.selectedItem = null;
  },
  isSelected: function isSelected(item) {
    if (this.multi) {
      return this._selectedColl.getKey(item) !== undefined;
    } else {
      return this.selected == item;
    }
  },
  deselect: function deselect(item) {
    if (this.multi) {
      if (this.isSelected(item)) {
        var skey = this._selectedColl.getKey(item);
        this.arrayDelete('selected', item);
        this.unlinkPaths('selected.' + skey);
      }
    } else {
      this.selected = null;
      this.selectedItem = null;
      this.unlinkPaths('selected');
      this.unlinkPaths('selectedItem');
    }
  },
  select: function select(item) {
    var icol = Polymer.Collection.get(this.items);
    var key = icol.getKey(item);
    if (this.multi) {
      if (this.isSelected(item)) {
        if (this.toggle) {
          this.deselect(item);
        }
      } else {
        this.push('selected', item);
        var skey = this._selectedColl.getKey(item);
        this.linkPaths('selected.' + skey, 'items.' + key);
      }
    } else {
      if (this.toggle && item == this.selected) {
        this.deselect();
      } else {
        this.selected = item;
        this.selectedItem = item;
        this.linkPaths('selected', 'items.' + key);
        this.linkPaths('selectedItem', 'items.' + key);
      }
    }
  }
});Polymer({
  is: 'dom-if',
  'extends': 'template',
  _template: null,
  properties: {
    'if': {
      type: Boolean,
      value: false,
      observer: '_queueRender'
    },
    restamp: {
      type: Boolean,
      value: false,
      observer: '_queueRender'
    }
  },
  behaviors: [Polymer.Templatizer],
  _queueRender: function _queueRender() {
    this._debounceTemplate(this._render);
  },
  detached: function detached() {
    if (!this.parentNode || this.parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE && (!Polymer.Settings.hasShadow || !(this.parentNode instanceof ShadowRoot))) {
      this._teardownInstance();
    }
  },
  attached: function attached() {
    if (this['if'] && this.ctor) {
      this.async(this._ensureInstance);
    }
  },
  render: function render() {
    this._flushTemplates();
  },
  _render: function _render() {
    if (this['if']) {
      if (!this.ctor) {
        this.templatize(this);
      }
      this._ensureInstance();
      this._showHideChildren();
    } else if (this.restamp) {
      this._teardownInstance();
    }
    if (!this.restamp && this._instance) {
      this._showHideChildren();
    }
    if (this['if'] != this._lastIf) {
      this.fire('dom-change');
      this._lastIf = this['if'];
    }
  },
  _ensureInstance: function _ensureInstance() {
    var parentNode = Polymer.dom(this).parentNode;
    if (parentNode) {
      var parent = Polymer.dom(parentNode);
      if (!this._instance) {
        this._instance = this.stamp();
        var root = this._instance.root;
        parent.insertBefore(root, this);
      } else {
        var c$ = this._instance._children;
        if (c$ && c$.length) {
          var lastChild = Polymer.dom(this).previousSibling;
          if (lastChild !== c$[c$.length - 1]) {
            for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
              parent.insertBefore(n, this);
            }
          }
        }
      }
    }
  },
  _teardownInstance: function _teardownInstance() {
    if (this._instance) {
      var c$ = this._instance._children;
      if (c$ && c$.length) {
        var parent = Polymer.dom(Polymer.dom(c$[0]).parentNode);
        for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
          parent.removeChild(n);
        }
      }
      this._instance = null;
    }
  },
  _showHideChildren: function _showHideChildren() {
    var hidden = this.__hideTemplateChildren__ || !this['if'];
    if (this._instance) {
      this._instance._showHideChildren(hidden);
    }
  },
  _forwardParentProp: function _forwardParentProp(prop, value) {
    if (this._instance) {
      this._instance.__setProperty(prop, value, true);
    }
  },
  _forwardParentPath: function _forwardParentPath(path, value) {
    if (this._instance) {
      this._instance._notifyPath(path, value, true);
    }
  }
});Polymer({
  is: 'dom-bind',
  'extends': 'template',
  _template: null,
  created: function created() {
    var self = this;
    Polymer.RenderStatus.whenReady(function () {
      if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          self._markImportsReady();
        });
      } else {
        self._markImportsReady();
      }
    });
  },
  _ensureReady: function _ensureReady() {
    if (!this._readied) {
      this._readySelf();
    }
  },
  _markImportsReady: function _markImportsReady() {
    this._importsReady = true;
    this._ensureReady();
  },
  _registerFeatures: function _registerFeatures() {
    this._prepConstructor();
  },
  _insertChildren: function _insertChildren() {
    var parentDom = Polymer.dom(Polymer.dom(this).parentNode);
    parentDom.insertBefore(this.root, this);
  },
  _removeChildren: function _removeChildren() {
    if (this._children) {
      for (var i = 0; i < this._children.length; i++) {
        this.root.appendChild(this._children[i]);
      }
    }
  },
  _initFeatures: function _initFeatures() {},
  _scopeElementClass: function _scopeElementClass(element, selector) {
    if (this.dataHost) {
      return this.dataHost._scopeElementClass(element, selector);
    } else {
      return selector;
    }
  },
  _configureInstanceProperties: function _configureInstanceProperties() {},
  _prepConfigure: function _prepConfigure() {
    var config = {};
    for (var prop in this._propertyEffects) {
      config[prop] = this[prop];
    }
    var setupConfigure = this._setupConfigure;
    this._setupConfigure = function () {
      setupConfigure.call(this, config);
    };
  },
  attached: function attached() {
    if (this._importsReady) {
      this.render();
    }
  },
  detached: function detached() {
    this._removeChildren();
  },
  render: function render() {
    this._ensureReady();
    if (!this._children) {
      this._template = this;
      this._prepAnnotations();
      this._prepEffects();
      this._prepBehaviors();
      this._prepConfigure();
      this._prepBindings();
      this._prepPropertyInfo();
      Polymer.Base._initFeatures.call(this);
      this._children = Polymer.TreeApi.arrayCopyChildNodes(this.root);
    }
    this._insertChildren();
    this.fire('dom-change');
  }
});
(function () {

  'use strict';

  var StockTicker = (function () {
    function StockTicker() {
      _classCallCheck(this, StockTicker);
    }

    _createClass(StockTicker, [{
      key: 'beforeRegister',
      value: function beforeRegister() {
        // Takes camelcase class name "StockTicker" -> "stock-ticker".
        var is = this.constructor.name.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();

        this.is = is;
        this.properties = {
          symbols: {
            type: Array,
            value: function value() {
              return [];
            },
            observer: '_updateQuotes'
          },
          tickers: {
            type: Array,
            value: function value() {
              return [];
            }
          }
        };
      }
    }, {
      key: '_updateQuotes',
      value: function _updateQuotes() {
        var _this = this;

        if (!this.symbols.length) {
          return;
        }

        var url = 'https://finance.google.com/finance/info?client=ig&q=' + this.symbols;
        //url = `https://crossorigin.me/${url}`;
        url = '' + url;

        fetch(url).then(function (resp) {
          return resp.text();
        }).then(function (text) {
          // Remove // prefix from response and parse as JSON.
          var tickers = JSON.parse(text.slice(text.indexOf('[')));
          _this.tickers = tickers;
        });
      }
    }, {
      key: '_computeColor',
      value: function _computeColor(gain) {
        return 'color:' + (gain >= 0 ? '#4CAF50' : '#F44336');
      }
    }, {
      key: '_computeArrow',
      value: function _computeArrow(gain) {
        return '' + (gain >= 0 ? '▲' : '▼');
      }
    }, {
      key: '_computeHref',
      value: function _computeHref(ticker) {
        return 'https://www.google.com/finance?q=' + ticker;
      }
    }, {
      key: '_computePoints',
      value: function _computePoints(points) {
        return Math.abs(points);
      }
    }, {
      key: '_computePercent',
      value: function _computePercent(percent) {
        return percent.slice(1);
      }
    }]);

    return StockTicker;
  })();

  Polymer(StockTicker);
})();
