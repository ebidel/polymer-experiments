(function(){ // monostate data
var metaDatas={};var metaArrays={};var singleton=null;Polymer.IronMeta = Polymer({is:'iron-meta',properties:{ /**
         * The type of meta-data.  All meta-data of the same type is stored
         * together.
         */type:{type:String,value:'default',observer:'_typeChanged'}, /**
         * The key used to store `value` under the `type` namespace.
         */key:{type:String,observer:'_keyChanged'}, /**
         * The meta-data to store or retrieve.
         */value:{type:Object,notify:true,observer:'_valueChanged'}, /**
         * If true, `value` is set to the iron-meta instance itself.
         */self:{type:Boolean,observer:'_selfChanged'}, /**
         * Array of all meta-data values for the given type.
         */list:{type:Array,notify:true}},hostAttributes:{hidden:true}, /**
       * Only runs if someone invokes the factory/constructor directly
       * e.g. `new Polymer.IronMeta()`
       *
       * @param {{type: (string|undefined), key: (string|undefined), value}=} config
       */factoryImpl:function(config){if(config){for(var n in config) {switch(n){case 'type':case 'key':case 'value':this[n] = config[n];break;}}}},created:function(){ // TODO(sjmiles): good for debugging?
this._metaDatas = metaDatas;this._metaArrays = metaArrays;},_keyChanged:function(key,old){this._resetRegistration(old);},_valueChanged:function(value){this._resetRegistration(this.key);},_selfChanged:function(self){if(self){this.value = this;}},_typeChanged:function(type){this._unregisterKey(this.key);if(!metaDatas[type]){metaDatas[type] = {};}this._metaData = metaDatas[type];if(!metaArrays[type]){metaArrays[type] = [];}this.list = metaArrays[type];this._registerKeyValue(this.key,this.value);}, /**
       * Retrieves meta data value by key.
       *
       * @method byKey
       * @param {string} key The key of the meta-data to be returned.
       * @return {*}
       */byKey:function(key){return this._metaData && this._metaData[key];},_resetRegistration:function(oldKey){this._unregisterKey(oldKey);this._registerKeyValue(this.key,this.value);},_unregisterKey:function(key){this._unregister(key,this._metaData,this.list);},_registerKeyValue:function(key,value){this._register(key,value,this._metaData,this.list);},_register:function(key,value,data,list){if(key && data && value !== undefined){data[key] = value;list.push(value);}},_unregister:function(key,data,list){if(key && data){if(key in data){var value=data[key];delete data[key];this.arrayDelete(list,value);}}}});Polymer.IronMeta.getIronMeta = function getIronMeta(){if(singleton === null){singleton = new Polymer.IronMeta();}return singleton;}; /**
    `iron-meta-query` can be used to access infomation stored in `iron-meta`.

    Examples:

    If I create an instance like this:

        <iron-meta key="info" value="foo/bar"></iron-meta>

    Note that value="foo/bar" is the metadata I've defined. I could define more
    attributes or use child nodes to define additional metadata.

    Now I can access that element (and it's metadata) from any `iron-meta-query` instance:

         var value = new Polymer.IronMetaQuery({key: 'info'}).value;

    @group Polymer Iron Elements
    @element iron-meta-query
    */Polymer.IronMetaQuery = Polymer({is:'iron-meta-query',properties:{ /**
         * The type of meta-data.  All meta-data of the same type is stored
         * together.
         */type:{type:String,value:'default',observer:'_typeChanged'}, /**
         * Specifies a key to use for retrieving `value` from the `type`
         * namespace.
         */key:{type:String,observer:'_keyChanged'}, /**
         * The meta-data to store or retrieve.
         */value:{type:Object,notify:true,readOnly:true}, /**
         * Array of all meta-data values for the given type.
         */list:{type:Array,notify:true}}, /**
       * Actually a factory method, not a true constructor. Only runs if
       * someone invokes it directly (via `new Polymer.IronMeta()`);
       *
       * @param {{type: (string|undefined), key: (string|undefined)}=} config
       */factoryImpl:function(config){if(config){for(var n in config) {switch(n){case 'type':case 'key':this[n] = config[n];break;}}}},created:function(){ // TODO(sjmiles): good for debugging?
this._metaDatas = metaDatas;this._metaArrays = metaArrays;},_keyChanged:function(key){this._setValue(this._metaData && this._metaData[key]);},_typeChanged:function(type){this._metaData = metaDatas[type];this.list = metaArrays[type];if(this.key){this._keyChanged(this.key);}}, /**
       * Retrieves meta data value by key.
       * @param {string} key The key of the meta-data to be returned.
       * @return {*}
       */byKey:function(key){return this._metaData && this._metaData[key];}});})(); /**
   * The `iron-iconset-svg` element allows users to define their own icon sets
   * that contain svg icons. The svg icon elements should be children of the
   * `iron-iconset-svg` element. Multiple icons should be given distinct id's.
   *
   * Using svg elements to create icons has a few advantages over traditional
   * bitmap graphics like jpg or png. Icons that use svg are vector based so
   * they are resolution independent and should look good on any device. They
   * are stylable via css. Icons can be themed, colorized, and even animated.
   *
   * Example:
   *
   *     <iron-iconset-svg name="my-svg-icons" size="24">
   *       <svg>
   *         <defs>
   *           <g id="shape">
   *             <rect x="12" y="0" width="12" height="24" />
   *             <circle cx="12" cy="12" r="12" />
   *           </g>
   *         </defs>
   *       </svg>
   *     </iron-iconset-svg>
   *
   * This will automatically register the icon set "my-svg-icons" to the iconset
   * database.  To use these icons from within another element, make a
   * `iron-iconset` element and call the `byId` method
   * to retrieve a given iconset. To apply a particular icon inside an
   * element use the `applyIcon` method. For example:
   *
   *     iconset.applyIcon(iconNode, 'car');
   *
   * @element iron-iconset-svg
   * @demo demo/index.html
   * @implements {Polymer.Iconset}
   */Polymer({is:'iron-iconset-svg',properties:{ /**
       * The name of the iconset.
       */name:{type:String,observer:'_nameChanged'}, /**
       * The size of an individual icon. Note that icons must be square.
       */size:{type:Number,value:24}},attached:function(){this.style.display = 'none';}, /**
     * Construct an array of all icon names in this iconset.
     *
     * @return {!Array} Array of icon names.
     */getIconNames:function(){this._icons = this._createIconMap();return Object.keys(this._icons).map(function(n){return this.name + ':' + n;},this);}, /**
     * Applies an icon to the given element.
     *
     * An svg icon is prepended to the element's shadowRoot if it exists,
     * otherwise to the element itself.
     *
     * @method applyIcon
     * @param {Element} element Element to which the icon is applied.
     * @param {string} iconName Name of the icon to apply.
     * @return {?Element} The svg element which renders the icon.
     */applyIcon:function(element,iconName){ // insert svg element into shadow root, if it exists
element = element.root || element; // Remove old svg element
this.removeIcon(element); // install new svg element
var svg=this._cloneIcon(iconName);if(svg){var pde=Polymer.dom(element);pde.insertBefore(svg,pde.childNodes[0]);return element._svgIcon = svg;}return null;}, /**
     * Remove an icon from the given element by undoing the changes effected
     * by `applyIcon`.
     *
     * @param {Element} element The element from which the icon is removed.
     */removeIcon:function(element){ // Remove old svg element
if(element._svgIcon){Polymer.dom(element).removeChild(element._svgIcon);element._svgIcon = null;}}, /**
     *
     * When name is changed, register iconset metadata
     *
     */_nameChanged:function(){new Polymer.IronMeta({type:'iconset',key:this.name,value:this});this.async(function(){this.fire('iron-iconset-added',this,{node:window});});}, /**
     * Create a map of child SVG elements by id.
     *
     * @return {!Object} Map of id's to SVG elements.
     */_createIconMap:function(){ // Objects chained to Object.prototype (`{}`) have members. Specifically,
// on FF there is a `watch` method that confuses the icon map, so we
// need to use a null-based object here.
var icons=Object.create(null);Polymer.dom(this).querySelectorAll('[id]').forEach(function(icon){icons[icon.id] = icon;});return icons;}, /**
     * Produce installable clone of the SVG element matching `id` in this
     * iconset, or `undefined` if there is no matching element.
     *
     * @return {Element} Returns an installable clone of the SVG element
     * matching `id`.
     */_cloneIcon:function(id){ // create the icon map on-demand, since the iconset itself has no discrete
// signal to know when it's children are fully parsed
this._icons = this._icons || this._createIconMap();return this._prepareSvgClone(this._icons[id],this.size);}, /**
     * @param {Element} sourceSvg
     * @param {number} size
     * @return {Element}
     */_prepareSvgClone:function(sourceSvg,size){if(sourceSvg){var content=sourceSvg.cloneNode(true),svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),viewBox=content.getAttribute('viewBox') || '0 0 ' + size + ' ' + size;svg.setAttribute('viewBox',viewBox);svg.setAttribute('preserveAspectRatio','xMidYMid meet'); // TODO(dfreedm): `pointer-events: none` works around https://crbug.com/370136
// TODO(sjmiles): inline style may not be ideal, but avoids requiring a shadow-root
svg.style.cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';svg.appendChild(content).removeAttribute('id');return svg;}return null;}});(function(){'use strict' /**
     * Chrome uses an older version of DOM Level 3 Keyboard Events
     *
     * Most keys are labeled as text, but some are Unicode codepoints.
     * Values taken from: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html#KeySet-Set
     */;var KEY_IDENTIFIER={'U+0009':'tab','U+001B':'esc','U+0020':'space','U+002A':'*','U+0030':'0','U+0031':'1','U+0032':'2','U+0033':'3','U+0034':'4','U+0035':'5','U+0036':'6','U+0037':'7','U+0038':'8','U+0039':'9','U+0041':'a','U+0042':'b','U+0043':'c','U+0044':'d','U+0045':'e','U+0046':'f','U+0047':'g','U+0048':'h','U+0049':'i','U+004A':'j','U+004B':'k','U+004C':'l','U+004D':'m','U+004E':'n','U+004F':'o','U+0050':'p','U+0051':'q','U+0052':'r','U+0053':'s','U+0054':'t','U+0055':'u','U+0056':'v','U+0057':'w','U+0058':'x','U+0059':'y','U+005A':'z','U+007F':'del'}; /**
     * Special table for KeyboardEvent.keyCode.
     * KeyboardEvent.keyIdentifier is better, and KeyBoardEvent.key is even better
     * than that.
     *
     * Values from: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.keyCode#Value_of_keyCode
     */var KEY_CODE={9:'tab',13:'enter',27:'esc',33:'pageup',34:'pagedown',35:'end',36:'home',32:'space',37:'left',38:'up',39:'right',40:'down',46:'del',106:'*'}; /**
     * MODIFIER_KEYS maps the short name for modifier keys used in a key
     * combo string to the property name that references those same keys
     * in a KeyboardEvent instance.
     */var MODIFIER_KEYS={'shift':'shiftKey','ctrl':'ctrlKey','alt':'altKey','meta':'metaKey'}; /**
     * KeyboardEvent.key is mostly represented by printable character made by
     * the keyboard, with unprintable keys labeled nicely.
     *
     * However, on OS X, Alt+char can make a Unicode character that follows an
     * Apple-specific mapping. In this case, we
     * fall back to .keyCode.
     */var KEY_CHAR=/[a-z0-9*]/; /**
     * Matches a keyIdentifier string.
     */var IDENT_CHAR=/U\+/; /**
     * Matches arrow keys in Gecko 27.0+
     */var ARROW_KEY=/^arrow/; /**
     * Matches space keys everywhere (notably including IE10's exceptional name
     * `spacebar`).
     */var SPACE_KEY=/^space(bar)?/;function transformKey(key){var validKey='';if(key){var lKey=key.toLowerCase();if(lKey.length == 1){if(KEY_CHAR.test(lKey)){validKey = lKey;}}else if(ARROW_KEY.test(lKey)){validKey = lKey.replace('arrow','');}else if(SPACE_KEY.test(lKey)){validKey = 'space';}else if(lKey == 'multiply'){ // numpad '*' can map to Multiply on IE/Windows
validKey = '*';}else {validKey = lKey;}}return validKey;}function transformKeyIdentifier(keyIdent){var validKey='';if(keyIdent){if(IDENT_CHAR.test(keyIdent)){validKey = KEY_IDENTIFIER[keyIdent];}else {validKey = keyIdent.toLowerCase();}}return validKey;}function transformKeyCode(keyCode){var validKey='';if(Number(keyCode)){if(keyCode >= 65 && keyCode <= 90){ // ascii a-z
// lowercase is 32 offset from uppercase
validKey = String.fromCharCode(32 + keyCode);}else if(keyCode >= 112 && keyCode <= 123){ // function keys f1-f12
validKey = 'f' + (keyCode - 112);}else if(keyCode >= 48 && keyCode <= 57){ // top 0-9 keys
validKey = String(48 - keyCode);}else if(keyCode >= 96 && keyCode <= 105){ // num pad 0-9
validKey = String(96 - keyCode);}else {validKey = KEY_CODE[keyCode];}}return validKey;}function normalizedKeyForEvent(keyEvent){ // fall back from .key, to .keyIdentifier, to .keyCode, and then to
// .detail.key to support artificial keyboard events
return transformKey(keyEvent.key) || transformKeyIdentifier(keyEvent.keyIdentifier) || transformKeyCode(keyEvent.keyCode) || transformKey(keyEvent.detail.key) || '';}function keyComboMatchesEvent(keyCombo,keyEvent){return normalizedKeyForEvent(keyEvent) === keyCombo.key && !!keyEvent.shiftKey === !!keyCombo.shiftKey && !!keyEvent.ctrlKey === !!keyCombo.ctrlKey && !!keyEvent.altKey === !!keyCombo.altKey && !!keyEvent.metaKey === !!keyCombo.metaKey;}function parseKeyComboString(keyComboString){return keyComboString.split('+').reduce(function(parsedKeyCombo,keyComboPart){var eventParts=keyComboPart.split(':');var keyName=eventParts[0];var event=eventParts[1];if(keyName in MODIFIER_KEYS){parsedKeyCombo[MODIFIER_KEYS[keyName]] = true;}else {parsedKeyCombo.key = keyName;parsedKeyCombo.event = event || 'keydown';}return parsedKeyCombo;},{combo:keyComboString.split(':').shift()});}function parseEventString(eventString){return eventString.split(' ').map(function(keyComboString){return parseKeyComboString(keyComboString);});} /**
     * `Polymer.IronA11yKeysBehavior` provides a normalized interface for processing
     * keyboard commands that pertain to [WAI-ARIA best practices](http://www.w3.org/TR/wai-aria-practices/#kbd_general_binding).
     * The element takes care of browser differences with respect to Keyboard events
     * and uses an expressive syntax to filter key presses.
     *
     * Use the `keyBindings` prototype property to express what combination of keys
     * will trigger the event to fire.
     *
     * Use the `key-event-target` attribute to set up event handlers on a specific
     * node.
     * The `keys-pressed` event will fire when one of the key combinations set with the
     * `keys` property is pressed.
     *
     * @demo demo/index.html
     * @polymerBehavior
     */Polymer.IronA11yKeysBehavior = {properties:{ /**
         * The HTMLElement that will be firing relevant KeyboardEvents.
         */keyEventTarget:{type:Object,value:function(){return this;}}, /**
         * If true, this property will cause the implementing element to
         * automatically stop propagation on any handled KeyboardEvents.
         */stopKeyboardEventPropagation:{type:Boolean,value:false},_boundKeyHandlers:{type:Array,value:function(){return [];}}, // We use this due to a limitation in IE10 where instances will have
// own properties of everything on the "prototype".
_imperativeKeyBindings:{type:Object,value:function(){return {};}}},observers:['_resetKeyEventListeners(keyEventTarget, _boundKeyHandlers)'],keyBindings:{},registered:function(){this._prepKeyBindings();},attached:function(){this._listenKeyEventListeners();},detached:function(){this._unlistenKeyEventListeners();}, /**
       * Can be used to imperatively add a key binding to the implementing
       * element. This is the imperative equivalent of declaring a keybinding
       * in the `keyBindings` prototype property.
       */addOwnKeyBinding:function(eventString,handlerName){this._imperativeKeyBindings[eventString] = handlerName;this._prepKeyBindings();this._resetKeyEventListeners();}, /**
       * When called, will remove all imperatively-added key bindings.
       */removeOwnKeyBindings:function(){this._imperativeKeyBindings = {};this._prepKeyBindings();this._resetKeyEventListeners();},keyboardEventMatchesKeys:function(event,eventString){var keyCombos=parseEventString(eventString);var index;for(index = 0;index < keyCombos.length;++index) {if(keyComboMatchesEvent(keyCombos[index],event)){return true;}}return false;},_collectKeyBindings:function(){var keyBindings=this.behaviors.map(function(behavior){return behavior.keyBindings;});if(keyBindings.indexOf(this.keyBindings) === -1){keyBindings.push(this.keyBindings);}return keyBindings;},_prepKeyBindings:function(){this._keyBindings = {};this._collectKeyBindings().forEach(function(keyBindings){for(var eventString in keyBindings) {this._addKeyBinding(eventString,keyBindings[eventString]);}},this);for(var eventString in this._imperativeKeyBindings) {this._addKeyBinding(eventString,this._imperativeKeyBindings[eventString]);}},_addKeyBinding:function(eventString,handlerName){parseEventString(eventString).forEach(function(keyCombo){this._keyBindings[keyCombo.event] = this._keyBindings[keyCombo.event] || [];this._keyBindings[keyCombo.event].push([keyCombo,handlerName]);},this);},_resetKeyEventListeners:function(){this._unlistenKeyEventListeners();if(this.isAttached){this._listenKeyEventListeners();}},_listenKeyEventListeners:function(){Object.keys(this._keyBindings).forEach(function(eventName){var keyBindings=this._keyBindings[eventName];var boundKeyHandler=this._onKeyBindingEvent.bind(this,keyBindings);this._boundKeyHandlers.push([this.keyEventTarget,eventName,boundKeyHandler]);this.keyEventTarget.addEventListener(eventName,boundKeyHandler);},this);},_unlistenKeyEventListeners:function(){var keyHandlerTuple;var keyEventTarget;var eventName;var boundKeyHandler;while(this._boundKeyHandlers.length) { // My kingdom for block-scope binding and destructuring assignment..
keyHandlerTuple = this._boundKeyHandlers.pop();keyEventTarget = keyHandlerTuple[0];eventName = keyHandlerTuple[1];boundKeyHandler = keyHandlerTuple[2];keyEventTarget.removeEventListener(eventName,boundKeyHandler);}},_onKeyBindingEvent:function(keyBindings,event){if(this.stopKeyboardEventPropagation){event.stopPropagation();}keyBindings.forEach(function(keyBinding){var keyCombo=keyBinding[0];var handlerName=keyBinding[1];if(!event.defaultPrevented && keyComboMatchesEvent(keyCombo,event)){this._triggerKeyHandler(keyCombo,handlerName,event);}},this);},_triggerKeyHandler:function(keyCombo,handlerName,keyboardEvent){var detail=Object.create(keyCombo);detail.keyboardEvent = keyboardEvent;var event=new CustomEvent(keyCombo.event,{detail:detail,cancelable:true});this[handlerName].call(this,event);if(event.defaultPrevented){keyboardEvent.preventDefault();}}};})(); /**
   * @demo demo/index.html
   * @polymerBehavior
   */Polymer.IronControlState = {properties:{ /**
       * If true, the element currently has focus.
       */focused:{type:Boolean,value:false,notify:true,readOnly:true,reflectToAttribute:true}, /**
       * If true, the user cannot interact with this element.
       */disabled:{type:Boolean,value:false,notify:true,observer:'_disabledChanged',reflectToAttribute:true},_oldTabIndex:{type:Number},_boundFocusBlurHandler:{type:Function,value:function(){return this._focusBlurHandler.bind(this);}}},observers:['_changedControlState(focused, disabled)'],ready:function(){this.addEventListener('focus',this._boundFocusBlurHandler,true);this.addEventListener('blur',this._boundFocusBlurHandler,true);},_focusBlurHandler:function(event){ // NOTE(cdata):  if we are in ShadowDOM land, `event.target` will
// eventually become `this` due to retargeting; if we are not in
// ShadowDOM land, `event.target` will eventually become `this` due
// to the second conditional which fires a synthetic event (that is also
// handled). In either case, we can disregard `event.path`.
if(event.target === this){this._setFocused(event.type === 'focus');}else if(!this.shadowRoot && !this.isLightDescendant(event.target)){this.fire(event.type,{sourceEvent:event},{node:this,bubbles:event.bubbles,cancelable:event.cancelable});}},_disabledChanged:function(disabled,old){this.setAttribute('aria-disabled',disabled?'true':'false');this.style.pointerEvents = disabled?'none':'';if(disabled){this._oldTabIndex = this.tabIndex;this.focused = false;this.tabIndex = -1;}else if(this._oldTabIndex !== undefined){this.tabIndex = this._oldTabIndex;}},_changedControlState:function(){ // _controlStateChanged is abstract, follow-on behaviors may implement it
if(this._controlStateChanged){this._controlStateChanged();}}}; /**
   * @demo demo/index.html
   * @polymerBehavior Polymer.IronButtonState
   */Polymer.IronButtonStateImpl = {properties:{ /**
       * If true, the user is currently holding down the button.
       */pressed:{type:Boolean,readOnly:true,value:false,reflectToAttribute:true,observer:'_pressedChanged'}, /**
       * If true, the button toggles the active state with each tap or press
       * of the spacebar.
       */toggles:{type:Boolean,value:false,reflectToAttribute:true}, /**
       * If true, the button is a toggle and is currently in the active state.
       */active:{type:Boolean,value:false,notify:true,reflectToAttribute:true}, /**
       * True if the element is currently being pressed by a "pointer," which
       * is loosely defined as mouse or touch input (but specifically excluding
       * keyboard input).
       */pointerDown:{type:Boolean,readOnly:true,value:false}, /**
       * True if the input device that caused the element to receive focus
       * was a keyboard.
       */receivedFocusFromKeyboard:{type:Boolean,readOnly:true}, /**
       * The aria attribute to be set if the button is a toggle and in the
       * active state.
       */ariaActiveAttribute:{type:String,value:'aria-pressed',observer:'_ariaActiveAttributeChanged'}},listeners:{down:'_downHandler',up:'_upHandler',tap:'_tapHandler'},observers:['_detectKeyboardFocus(focused)','_activeChanged(active, ariaActiveAttribute)'],keyBindings:{'enter:keydown':'_asyncClick','space:keydown':'_spaceKeyDownHandler','space:keyup':'_spaceKeyUpHandler'},_mouseEventRe:/^mouse/,_tapHandler:function(){if(this.toggles){ // a tap is needed to toggle the active state
this._userActivate(!this.active);}else {this.active = false;}},_detectKeyboardFocus:function(focused){this._setReceivedFocusFromKeyboard(!this.pointerDown && focused);}, // to emulate native checkbox, (de-)activations from a user interaction fire
// 'change' events
_userActivate:function(active){if(this.active !== active){this.active = active;this.fire('change');}},_downHandler:function(event){this._setPointerDown(true);this._setPressed(true);this._setReceivedFocusFromKeyboard(false);},_upHandler:function(){this._setPointerDown(false);this._setPressed(false);}, /**
     * @param {!KeyboardEvent} event .
     */_spaceKeyDownHandler:function(event){var keyboardEvent=event.detail.keyboardEvent;var target=Polymer.dom(keyboardEvent).localTarget; // Ignore the event if this is coming from a focused light child, since that
// element will deal with it.
if(this.isLightDescendant(target))return;keyboardEvent.preventDefault();keyboardEvent.stopImmediatePropagation();this._setPressed(true);}, /**
     * @param {!KeyboardEvent} event .
     */_spaceKeyUpHandler:function(event){var keyboardEvent=event.detail.keyboardEvent;var target=Polymer.dom(keyboardEvent).localTarget; // Ignore the event if this is coming from a focused light child, since that
// element will deal with it.
if(this.isLightDescendant(target))return;if(this.pressed){this._asyncClick();}this._setPressed(false);}, // trigger click asynchronously, the asynchrony is useful to allow one
// event handler to unwind before triggering another event
_asyncClick:function(){this.async(function(){this.click();},1);}, // any of these changes are considered a change to button state
_pressedChanged:function(pressed){this._changedButtonState();},_ariaActiveAttributeChanged:function(value,oldValue){if(oldValue && oldValue != value && this.hasAttribute(oldValue)){this.removeAttribute(oldValue);}},_activeChanged:function(active,ariaActiveAttribute){if(this.toggles){this.setAttribute(this.ariaActiveAttribute,active?'true':'false');}else {this.removeAttribute(this.ariaActiveAttribute);}this._changedButtonState();},_controlStateChanged:function(){if(this.disabled){this._setPressed(false);}else {this._changedButtonState();}}, // provide hook for follow-on behaviors to react to button-state
_changedButtonState:function(){if(this._buttonStateChanged){this._buttonStateChanged(); // abstract
}}}; /** @polymerBehavior */Polymer.IronButtonState = [Polymer.IronA11yKeysBehavior,Polymer.IronButtonStateImpl]; /**
   * `Polymer.PaperRippleBehavior` dynamically implements a ripple
   * when the element has focus via pointer or keyboard.
   *
   * NOTE: This behavior is intended to be used in conjunction with and after
   * `Polymer.IronButtonState` and `Polymer.IronControlState`.
   *
   * @polymerBehavior Polymer.PaperRippleBehavior
   */Polymer.PaperRippleBehavior = {properties:{ /**
       * If true, the element will not produce a ripple effect when interacted
       * with via the pointer.
       */noink:{type:Boolean,observer:'_noinkChanged'}, /**
       * @type {Element|undefined}
       */_rippleContainer:{type:Object}}, /**
     * Ensures a `<paper-ripple>` element is available when the element is
     * focused.
     */_buttonStateChanged:function(){if(this.focused){this.ensureRipple();}}, /**
     * In addition to the functionality provided in `IronButtonState`, ensures
     * a ripple effect is created when the element is in a `pressed` state.
     */_downHandler:function(event){Polymer.IronButtonStateImpl._downHandler.call(this,event);if(this.pressed){this.ensureRipple(event);}}, /**
     * Ensures this element contains a ripple effect. For startup efficiency
     * the ripple effect is dynamically on demand when needed.
     * @param {!Event=} optTriggeringEvent (optional) event that triggered the
     * ripple.
     */ensureRipple:function(optTriggeringEvent){if(!this.hasRipple()){this._ripple = this._createRipple();this._ripple.noink = this.noink;var rippleContainer=this._rippleContainer || this.root;if(rippleContainer){Polymer.dom(rippleContainer).appendChild(this._ripple);}if(optTriggeringEvent){ // Check if the event happened inside of the ripple container
// Fall back to host instead of the root because distributed text
// nodes are not valid event targets
var domContainer=Polymer.dom(this._rippleContainer || this);var target=Polymer.dom(optTriggeringEvent).rootTarget;if(domContainer.deepContains( /** @type {Node} */target)){this._ripple.uiDownAction(optTriggeringEvent);}}}}, /**
     * Returns the `<paper-ripple>` element used by this element to create
     * ripple effects. The element's ripple is created on demand, when
     * necessary, and calling this method will force the
     * ripple to be created.
     */getRipple:function(){this.ensureRipple();return this._ripple;}, /**
     * Returns true if this element currently contains a ripple effect.
     * @return {boolean}
     */hasRipple:function(){return Boolean(this._ripple);}, /**
     * Create the element's ripple effect via creating a `<paper-ripple>`.
     * Override this method to customize the ripple element.
     * @return {!PaperRippleElement} Returns a `<paper-ripple>` element.
     */_createRipple:function(){return  (/** @type {!PaperRippleElement} */document.createElement('paper-ripple'));},_noinkChanged:function(noink){if(this.hasRipple()){this._ripple.noink = noink;}}}; /** @polymerBehavior Polymer.PaperButtonBehavior */Polymer.PaperButtonBehaviorImpl = {properties:{ /**
       * The z-depth of this element, from 0-5. Setting to 0 will remove the
       * shadow, and each increasing number greater than 0 will be "deeper"
       * than the last.
       *
       * @attribute elevation
       * @type number
       * @default 1
       */elevation:{type:Number,reflectToAttribute:true,readOnly:true}},observers:['_calculateElevation(focused, disabled, active, pressed, receivedFocusFromKeyboard)','_computeKeyboardClass(receivedFocusFromKeyboard)'],hostAttributes:{role:'button',tabindex:'0',animated:true},_calculateElevation:function(){var e=1;if(this.disabled){e = 0;}else if(this.active || this.pressed){e = 4;}else if(this.receivedFocusFromKeyboard){e = 3;}this._setElevation(e);},_computeKeyboardClass:function(receivedFocusFromKeyboard){this.classList.toggle('keyboard-focus',receivedFocusFromKeyboard);}, /**
     * In addition to `IronButtonState` behavior, when space key goes down,
     * create a ripple down effect.
     *
     * @param {!KeyboardEvent} event .
     */_spaceKeyDownHandler:function(event){Polymer.IronButtonStateImpl._spaceKeyDownHandler.call(this,event);if(this.hasRipple()){this._ripple.uiDownAction();}}, /**
     * In addition to `IronButtonState` behavior, when space key goes up,
     * create a ripple up effect.
     *
     * @param {!KeyboardEvent} event .
     */_spaceKeyUpHandler:function(event){Polymer.IronButtonStateImpl._spaceKeyUpHandler.call(this,event);if(this.hasRipple()){this._ripple.uiUpAction();}}}; /** @polymerBehavior */Polymer.PaperButtonBehavior = [Polymer.IronButtonState,Polymer.IronControlState,Polymer.PaperRippleBehavior,Polymer.PaperButtonBehaviorImpl]; /**
   * `Polymer.PaperInkyFocusBehavior` implements a ripple when the element has keyboard focus.
   *
   * @polymerBehavior Polymer.PaperInkyFocusBehavior
   */Polymer.PaperInkyFocusBehaviorImpl = {observers:['_focusedChanged(receivedFocusFromKeyboard)'],_focusedChanged:function(receivedFocusFromKeyboard){if(receivedFocusFromKeyboard){this.ensureRipple();}if(this.hasRipple()){this._ripple.holdDown = receivedFocusFromKeyboard;}},_createRipple:function(){var ripple=Polymer.PaperRippleBehavior._createRipple();ripple.id = 'ink';ripple.setAttribute('center','');ripple.classList.add('circle');return ripple;}}; /** @polymerBehavior Polymer.PaperInkyFocusBehavior */Polymer.PaperInkyFocusBehavior = [Polymer.IronButtonState,Polymer.IronControlState,Polymer.PaperRippleBehavior,Polymer.PaperInkyFocusBehaviorImpl]; /** @polymerBehavior Polymer.PaperItemBehavior */Polymer.PaperItemBehaviorImpl = {hostAttributes:{role:'option',tabindex:'0'}}; /** @polymerBehavior */Polymer.PaperItemBehavior = [Polymer.IronControlState,Polymer.IronButtonState,Polymer.PaperItemBehaviorImpl]; /**
   * @param {!Function} selectCallback
   * @constructor
   */Polymer.IronSelection = function(selectCallback){this.selection = [];this.selectCallback = selectCallback;};Polymer.IronSelection.prototype = { /**
     * Retrieves the selected item(s).
     *
     * @method get
     * @returns Returns the selected item(s). If the multi property is true,
     * `get` will return an array, otherwise it will return
     * the selected item or undefined if there is no selection.
     */get:function(){return this.multi?this.selection.slice():this.selection[0];}, /**
     * Clears all the selection except the ones indicated.
     *
     * @method clear
     * @param {Array} excludes items to be excluded.
     */clear:function(excludes){this.selection.slice().forEach(function(item){if(!excludes || excludes.indexOf(item) < 0){this.setItemSelected(item,false);}},this);}, /**
     * Indicates if a given item is selected.
     *
     * @method isSelected
     * @param {*} item The item whose selection state should be checked.
     * @returns Returns true if `item` is selected.
     */isSelected:function(item){return this.selection.indexOf(item) >= 0;}, /**
     * Sets the selection state for a given item to either selected or deselected.
     *
     * @method setItemSelected
     * @param {*} item The item to select.
     * @param {boolean} isSelected True for selected, false for deselected.
     */setItemSelected:function(item,isSelected){if(item != null){if(isSelected){this.selection.push(item);}else {var i=this.selection.indexOf(item);if(i >= 0){this.selection.splice(i,1);}}if(this.selectCallback){this.selectCallback(item,isSelected);}}}, /**
     * Sets the selection state for a given item. If the `multi` property
     * is true, then the selected state of `item` will be toggled; otherwise
     * the `item` will be selected.
     *
     * @method select
     * @param {*} item The item to select.
     */select:function(item){if(this.multi){this.toggle(item);}else if(this.get() !== item){this.setItemSelected(this.get(),false);this.setItemSelected(item,true);}}, /**
     * Toggles the selection state for `item`.
     *
     * @method toggle
     * @param {*} item The item to toggle.
     */toggle:function(item){this.setItemSelected(item,!this.isSelected(item));}}; /** @polymerBehavior */Polymer.IronSelectableBehavior = { /**
       * Fired when iron-selector is activated (selected or deselected).
       * It is fired before the selected items are changed.
       * Cancel the event to abort selection.
       *
       * @event iron-activate
       */ /**
       * Fired when an item is selected
       *
       * @event iron-select
       */ /**
       * Fired when an item is deselected
       *
       * @event iron-deselect
       */ /**
       * Fired when the list of selectable items changes (e.g., items are
       * added or removed). The detail of the event is a list of mutation
       * records that describe what changed.
       *
       * @event iron-items-changed
       */properties:{ /**
       * If you want to use the attribute value of an element for `selected` instead of the index,
       * set this to the name of the attribute.
       */attrForSelected:{type:String,value:null}, /**
       * Gets or sets the selected element. The default is to use the index of the item.
       */selected:{type:String,notify:true}, /**
       * Returns the currently selected item.
       *
       * @type {?Object}
       */selectedItem:{type:Object,readOnly:true,notify:true}, /**
       * The event that fires from items when they are selected. Selectable
       * will listen for this event from items and update the selection state.
       * Set to empty string to listen to no events.
       */activateEvent:{type:String,value:'tap',observer:'_activateEventChanged'}, /**
       * This is a CSS selector string.  If this is set, only items that match the CSS selector
       * are selectable.
       */selectable:String, /**
       * The class to set on elements when selected.
       */selectedClass:{type:String,value:'iron-selected'}, /**
       * The attribute to set on elements when selected.
       */selectedAttribute:{type:String,value:null}, /**
       * The list of items from which a selection can be made.
       */items:{type:Array,readOnly:true,value:function(){return [];}}, /**
       * The set of excluded elements where the key is the `localName`
       * of the element that will be ignored from the item list.
       *
       * @default {template: 1}
       */_excludedLocalNames:{type:Object,value:function(){return {'template':1};}}},observers:['_updateSelected(attrForSelected, selected)'],created:function(){this._bindFilterItem = this._filterItem.bind(this);this._selection = new Polymer.IronSelection(this._applySelection.bind(this));},attached:function(){this._observer = this._observeItems(this);this._updateItems();if(!this._shouldUpdateSelection){this._updateSelected(this.attrForSelected,this.selected);}this._addListener(this.activateEvent);},detached:function(){if(this._observer){Polymer.dom(this).unobserveNodes(this._observer);}this._removeListener(this.activateEvent);}, /**
     * Returns the index of the given item.
     *
     * @method indexOf
     * @param {Object} item
     * @returns Returns the index of the item
     */indexOf:function(item){return this.items.indexOf(item);}, /**
     * Selects the given value.
     *
     * @method select
     * @param {string} value the value to select.
     */select:function(value){this.selected = value;}, /**
     * Selects the previous item.
     *
     * @method selectPrevious
     */selectPrevious:function(){var length=this.items.length;var index=(Number(this._valueToIndex(this.selected)) - 1 + length) % length;this.selected = this._indexToValue(index);}, /**
     * Selects the next item.
     *
     * @method selectNext
     */selectNext:function(){var index=(Number(this._valueToIndex(this.selected)) + 1) % this.items.length;this.selected = this._indexToValue(index);},get _shouldUpdateSelection(){return this.selected != null;},_addListener:function(eventName){this.listen(this,eventName,'_activateHandler');},_removeListener:function(eventName){this.unlisten(this,eventName,'_activateHandler');},_activateEventChanged:function(eventName,old){this._removeListener(old);this._addListener(eventName);},_updateItems:function(){var nodes=Polymer.dom(this).queryDistributedElements(this.selectable || '*');nodes = Array.prototype.filter.call(nodes,this._bindFilterItem);this._setItems(nodes);},_updateSelected:function(){this._selectSelected(this.selected);},_selectSelected:function(selected){this._selection.select(this._valueToItem(this.selected));},_filterItem:function(node){return !this._excludedLocalNames[node.localName];},_valueToItem:function(value){return value == null?null:this.items[this._valueToIndex(value)];},_valueToIndex:function(value){if(this.attrForSelected){for(var i=0,item;item = this.items[i];i++) {if(this._valueForItem(item) == value){return i;}}}else {return Number(value);}},_indexToValue:function(index){if(this.attrForSelected){var item=this.items[index];if(item){return this._valueForItem(item);}}else {return index;}},_valueForItem:function(item){return item[this.attrForSelected] || item.getAttribute(this.attrForSelected);},_applySelection:function(item,isSelected){if(this.selectedClass){this.toggleClass(this.selectedClass,isSelected,item);}if(this.selectedAttribute){this.toggleAttribute(this.selectedAttribute,isSelected,item);}this._selectionChange();this.fire('iron-' + (isSelected?'select':'deselect'),{item:item});},_selectionChange:function(){this._setSelectedItem(this._selection.get());}, // observe items change under the given node.
_observeItems:function(node){return Polymer.dom(node).observeNodes(function(mutations){ // Let other interested parties know about the change so that
// we don't have to recreate mutation observers everywher.
this.fire('iron-items-changed',mutations,{bubbles:false,cancelable:false});this._updateItems();if(this._shouldUpdateSelection){this._updateSelected();}});},_activateHandler:function(e){var t=e.target;var items=this.items;while(t && t != this) {var i=items.indexOf(t);if(i >= 0){var value=this._indexToValue(i);this._itemActivate(value,t);return;}t = t.parentNode;}},_itemActivate:function(value,item){if(!this.fire('iron-activate',{selected:value,item:item},{cancelable:true}).defaultPrevented){this.select(value);}}}; /** @polymerBehavior Polymer.IronMultiSelectableBehavior */Polymer.IronMultiSelectableBehaviorImpl = {properties:{ /**
       * If true, multiple selections are allowed.
       */multi:{type:Boolean,value:false,observer:'multiChanged'}, /**
       * Gets or sets the selected elements. This is used instead of `selected` when `multi`
       * is true.
       */selectedValues:{type:Array,notify:true}, /**
       * Returns an array of currently selected items.
       */selectedItems:{type:Array,readOnly:true,notify:true}},observers:['_updateSelected(attrForSelected, selectedValues)'], /**
     * Selects the given value. If the `multi` property is true, then the selected state of the
     * `value` will be toggled; otherwise the `value` will be selected.
     *
     * @method select
     * @param {string} value the value to select.
     */select:function(value){if(this.multi){if(this.selectedValues){this._toggleSelected(value);}else {this.selectedValues = [value];}}else {this.selected = value;}},multiChanged:function(multi){this._selection.multi = multi;},get _shouldUpdateSelection(){return this.selected != null || this.selectedValues != null && this.selectedValues.length;},_updateSelected:function(){if(this.multi){this._selectMulti(this.selectedValues);}else {this._selectSelected(this.selected);}},_selectMulti:function(values){this._selection.clear();if(values){for(var i=0;i < values.length;i++) {this._selection.setItemSelected(this._valueToItem(values[i]),true);}}},_selectionChange:function(){var s=this._selection.get();if(this.multi){this._setSelectedItems(s);}else {this._setSelectedItems([s]);this._setSelectedItem(s);}},_toggleSelected:function(value){var i=this.selectedValues.indexOf(value);var unselected=i < 0;if(unselected){this.push('selectedValues',value);}else {this.splice('selectedValues',i,1);}this._selection.setItemSelected(this._valueToItem(value),unselected);}}; /** @polymerBehavior */Polymer.IronMultiSelectableBehavior = [Polymer.IronSelectableBehavior,Polymer.IronMultiSelectableBehaviorImpl]; /**
   * `Polymer.IronMenuBehavior` implements accessible menu behavior.
   *
   * @demo demo/index.html
   * @polymerBehavior Polymer.IronMenuBehavior
   */Polymer.IronMenuBehaviorImpl = {properties:{ /**
       * Returns the currently focused item.
       * @type {?Object}
       */focusedItem:{observer:'_focusedItemChanged',readOnly:true,type:Object}, /**
       * The attribute to use on menu items to look up the item title. Typing the first
       * letter of an item when the menu is open focuses that item. If unset, `textContent`
       * will be used.
       */attrForItemTitle:{type:String}},hostAttributes:{'role':'menu','tabindex':'0'},observers:['_updateMultiselectable(multi)'],listeners:{'focus':'_onFocus','keydown':'_onKeydown','iron-items-changed':'_onIronItemsChanged'},keyBindings:{'up':'_onUpKey','down':'_onDownKey','esc':'_onEscKey','shift+tab:keydown':'_onShiftTabDown'},attached:function(){this._resetTabindices();}, /**
     * Selects the given value. If the `multi` property is true, then the selected state of the
     * `value` will be toggled; otherwise the `value` will be selected.
     *
     * @param {string} value the value to select.
     */select:function(value){if(this._defaultFocusAsync){this.cancelAsync(this._defaultFocusAsync);this._defaultFocusAsync = null;}var item=this._valueToItem(value);if(item && item.hasAttribute('disabled'))return;this._setFocusedItem(item);Polymer.IronMultiSelectableBehaviorImpl.select.apply(this,arguments);}, /**
     * Resets all tabindex attributes to the appropriate value based on the
     * current selection state. The appropriate value is `0` (focusable) for
     * the default selected item, and `-1` (not keyboard focusable) for all
     * other items.
     */_resetTabindices:function(){var selectedItem=this.multi?this.selectedItems && this.selectedItems[0]:this.selectedItem;this.items.forEach(function(item){item.setAttribute('tabindex',item === selectedItem?'0':'-1');},this);}, /**
     * Sets appropriate ARIA based on whether or not the menu is meant to be
     * multi-selectable.
     *
     * @param {boolean} multi True if the menu should be multi-selectable.
     */_updateMultiselectable:function(multi){if(multi){this.setAttribute('aria-multiselectable','true');}else {this.removeAttribute('aria-multiselectable');}}, /**
     * Given a KeyboardEvent, this method will focus the appropriate item in the
     * menu (if there is a relevant item, and it is possible to focus it).
     *
     * @param {KeyboardEvent} event A KeyboardEvent.
     */_focusWithKeyboardEvent:function(event){for(var i=0,item;item = this.items[i];i++) {var attr=this.attrForItemTitle || 'textContent';var title=item[attr] || item.getAttribute(attr);if(title && title.trim().charAt(0).toLowerCase() === String.fromCharCode(event.keyCode).toLowerCase()){this._setFocusedItem(item);break;}}}, /**
     * Focuses the previous item (relative to the currently focused item) in the
     * menu.
     */_focusPrevious:function(){var length=this.items.length;var index=(Number(this.indexOf(this.focusedItem)) - 1 + length) % length;this._setFocusedItem(this.items[index]);}, /**
     * Focuses the next item (relative to the currently focused item) in the
     * menu.
     */_focusNext:function(){var index=(Number(this.indexOf(this.focusedItem)) + 1) % this.items.length;this._setFocusedItem(this.items[index]);}, /**
     * Mutates items in the menu based on provided selection details, so that
     * all items correctly reflect selection state.
     *
     * @param {Element} item An item in the menu.
     * @param {boolean} isSelected True if the item should be shown in a
     * selected state, otherwise false.
     */_applySelection:function(item,isSelected){if(isSelected){item.setAttribute('aria-selected','true');}else {item.removeAttribute('aria-selected');}Polymer.IronSelectableBehavior._applySelection.apply(this,arguments);}, /**
     * Discretely updates tabindex values among menu items as the focused item
     * changes.
     *
     * @param {Element} focusedItem The element that is currently focused.
     * @param {?Element} old The last element that was considered focused, if
     * applicable.
     */_focusedItemChanged:function(focusedItem,old){old && old.setAttribute('tabindex','-1');if(focusedItem){focusedItem.setAttribute('tabindex','0');focusedItem.focus();}}, /**
     * A handler that responds to mutation changes related to the list of items
     * in the menu.
     *
     * @param {CustomEvent} event An event containing mutation records as its
     * detail.
     */_onIronItemsChanged:function(event){var mutations=event.detail;var mutation;var index;for(index = 0;index < mutations.length;++index) {mutation = mutations[index];if(mutation.addedNodes.length){this._resetTabindices();break;}}}, /**
     * Handler that is called when a shift+tab keypress is detected by the menu.
     *
     * @param {CustomEvent} event A key combination event.
     */_onShiftTabDown:function(event){var oldTabIndex;Polymer.IronMenuBehaviorImpl._shiftTabPressed = true;oldTabIndex = this.getAttribute('tabindex');this.setAttribute('tabindex','-1');this.async(function(){this.setAttribute('tabindex',oldTabIndex);Polymer.IronMenuBehaviorImpl._shiftTabPressed = false; // NOTE(cdata): polymer/polymer#1305
},1);}, /**
     * Handler that is called when the menu receives focus.
     *
     * @param {FocusEvent} event A focus event.
     */_onFocus:function(event){if(Polymer.IronMenuBehaviorImpl._shiftTabPressed){return;} // do not focus the menu itself
this.blur(); // clear the cached focus item
this._setFocusedItem(null);this._defaultFocusAsync = this.async(function(){ // focus the selected item when the menu receives focus, or the first item
// if no item is selected
var selectedItem=this.multi?this.selectedItems && this.selectedItems[0]:this.selectedItem;if(selectedItem){this._setFocusedItem(selectedItem);}else {this._setFocusedItem(this.items[0]);} // async 100ms to wait for `select` to get called from `_itemActivate`
},100);}, /**
     * Handler that is called when the up key is pressed.
     *
     * @param {CustomEvent} event A key combination event.
     */_onUpKey:function(event){ // up and down arrows moves the focus
this._focusPrevious();}, /**
     * Handler that is called when the down key is pressed.
     *
     * @param {CustomEvent} event A key combination event.
     */_onDownKey:function(event){this._focusNext();}, /**
     * Handler that is called when the esc key is pressed.
     *
     * @param {CustomEvent} event A key combination event.
     */_onEscKey:function(event){ // esc blurs the control
this.focusedItem.blur();}, /**
     * Handler that is called when a keydown event is detected.
     *
     * @param {KeyboardEvent} event A keyboard event.
     */_onKeydown:function(event){if(this.keyboardEventMatchesKeys(event,'up down esc')){return;} // all other keys focus the menu item starting with that character
this._focusWithKeyboardEvent(event);}};Polymer.IronMenuBehaviorImpl._shiftTabPressed = false; /** @polymerBehavior Polymer.IronMenuBehavior */Polymer.IronMenuBehavior = [Polymer.IronMultiSelectableBehavior,Polymer.IronA11yKeysBehavior,Polymer.IronMenuBehaviorImpl];Polymer({is:'iron-media-query',properties:{ /**
       * The Boolean return value of the media query.
       */queryMatches:{type:Boolean,value:false,readOnly:true,notify:true}, /**
       * The CSS media query to evaluate.
       */query:{type:String,observer:'queryChanged'}, /**
       * If true, the query attribute is assumed to be a complete media query
       * string rather than a single media feature.
       */full:{type:Boolean,value:false}, /**
       * @type {function(MediaQueryList)}
       */_boundMQHandler:{value:function(){return this.queryHandler.bind(this);}}, /**
       * @type {MediaQueryList}
       */_mq:{value:null}},attached:function(){this.queryChanged();},detached:function(){this._remove();},_add:function(){if(this._mq){this._mq.addListener(this._boundMQHandler);}},_remove:function(){if(this._mq){this._mq.removeListener(this._boundMQHandler);}this._mq = null;},queryChanged:function(){this._remove();var query=this.query;if(!query){return;}if(!this.full && query[0] !== '('){query = '(' + query + ')';}this._mq = window.matchMedia(query);this._add();this.queryHandler(this._mq);},queryHandler:function(mq){this._setQueryMatches(mq.matches);}}); /**
  `iron-selector` is an element which can be used to manage a list of elements
  that can be selected.  Tapping on the item will make the item selected.  The `selected` indicates
  which item is being selected.  The default is to use the index of the item.

  Example:

      <iron-selector selected="0">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </iron-selector>

  If you want to use the attribute value of an element for `selected` instead of the index,
  set `attrForSelected` to the name of the attribute.  For example, if you want to select item by
  `name`, set `attrForSelected` to `name`.

  Example:

      <iron-selector attr-for-selected="name" selected="foo">
        <div name="foo">Foo</div>
        <div name="bar">Bar</div>
        <div name="zot">Zot</div>
      </iron-selector>

  `iron-selector` is not styled. Use the `iron-selected` CSS class to style the selected element.

  Example:

      <style>
        .iron-selected {
          background: #eee;
        }
      </style>

      ...

      <iron-selector selected="0">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </iron-selector>

  @demo demo/index.html
  */Polymer({is:'iron-selector',behaviors:[Polymer.IronMultiSelectableBehavior]}); /**
   * `IronResizableBehavior` is a behavior that can be used in Polymer elements to
   * coordinate the flow of resize events between "resizers" (elements that control the
   * size or hidden state of their children) and "resizables" (elements that need to be
   * notified when they are resized or un-hidden by their parents in order to take
   * action on their new measurements).
   * Elements that perform measurement should add the `IronResizableBehavior` behavior to
   * their element definition and listen for the `iron-resize` event on themselves.
   * This event will be fired when they become showing after having been hidden,
   * when they are resized explicitly by another resizable, or when the window has been
   * resized.
   * Note, the `iron-resize` event is non-bubbling.
   *
   * @polymerBehavior Polymer.IronResizableBehavior
   * @demo demo/index.html
   **/Polymer.IronResizableBehavior = {properties:{ /**
       * The closest ancestor element that implements `IronResizableBehavior`.
       */_parentResizable:{type:Object,observer:'_parentResizableChanged'}, /**
       * True if this element is currently notifying its descedant elements of
       * resize.
       */_notifyingDescendant:{type:Boolean,value:false}},listeners:{'iron-request-resize-notifications':'_onIronRequestResizeNotifications'},created:function(){ // We don't really need property effects on these, and also we want them
// to be created before the `_parentResizable` observer fires:
this._interestedResizables = [];this._boundNotifyResize = this.notifyResize.bind(this);},attached:function(){this.fire('iron-request-resize-notifications',null,{node:this,bubbles:true,cancelable:true});if(!this._parentResizable){window.addEventListener('resize',this._boundNotifyResize);this.notifyResize();}},detached:function(){if(this._parentResizable){this._parentResizable.stopResizeNotificationsFor(this);}else {window.removeEventListener('resize',this._boundNotifyResize);}this._parentResizable = null;}, /**
     * Can be called to manually notify a resizable and its descendant
     * resizables of a resize change.
     */notifyResize:function(){if(!this.isAttached){return;}this._interestedResizables.forEach(function(resizable){if(this.resizerShouldNotify(resizable)){this._notifyDescendant(resizable);}},this);this._fireResize();}, /**
     * Used to assign the closest resizable ancestor to this resizable
     * if the ancestor detects a request for notifications.
     */assignParentResizable:function(parentResizable){this._parentResizable = parentResizable;}, /**
     * Used to remove a resizable descendant from the list of descendants
     * that should be notified of a resize change.
     */stopResizeNotificationsFor:function(target){var index=this._interestedResizables.indexOf(target);if(index > -1){this._interestedResizables.splice(index,1);this.unlisten(target,'iron-resize','_onDescendantIronResize');}}, /**
     * This method can be overridden to filter nested elements that should or
     * should not be notified by the current element. Return true if an element
     * should be notified, or false if it should not be notified.
     *
     * @param {HTMLElement} element A candidate descendant element that
     * implements `IronResizableBehavior`.
     * @return {boolean} True if the `element` should be notified of resize.
     */resizerShouldNotify:function(element){return true;},_onDescendantIronResize:function(event){if(this._notifyingDescendant){event.stopPropagation();return;} // NOTE(cdata): In ShadowDOM, event retargetting makes echoing of the
// otherwise non-bubbling event "just work." We do it manually here for
// the case where Polymer is not using shadow roots for whatever reason:
if(!Polymer.Settings.useShadow){this._fireResize();}},_fireResize:function(){this.fire('iron-resize',null,{node:this,bubbles:false});},_onIronRequestResizeNotifications:function(event){var target=event.path?event.path[0]:event.target;if(target === this){return;}if(this._interestedResizables.indexOf(target) === -1){this._interestedResizables.push(target);this.listen(target,'iron-resize','_onDescendantIronResize');}target.assignParentResizable(this);this._notifyDescendant(target);event.stopPropagation();},_parentResizableChanged:function(parentResizable){if(parentResizable){window.removeEventListener('resize',this._boundNotifyResize);}},_notifyDescendant:function(descendant){ // NOTE(cdata): In IE10, attached is fired on children first, so it's
// important not to notify them if the parent is not attached yet (or
// else they will get redundantly notified when the parent attaches).
if(!this.isAttached){return;}this._notifyingDescendant = true;descendant.notifyResize();this._notifyingDescendant = false;}};Polymer({is:'iron-icon',properties:{ /**
         * The name of the icon to use. The name should be of the form:
         * `iconset_name:icon_name`.
         */icon:{type:String,observer:'_iconChanged'}, /**
         * The name of the theme to used, if one is specified by the
         * iconset.
         */theme:{type:String,observer:'_updateIcon'}, /**
         * If using iron-icon without an iconset, you can set the src to be
         * the URL of an individual icon image file. Note that this will take
         * precedence over a given icon attribute.
         */src:{type:String,observer:'_srcChanged'}, /**
         * @type {!Polymer.IronMeta}
         */_meta:{value:Polymer.Base.create('iron-meta',{type:'iconset'})}},_DEFAULT_ICONSET:'icons',_iconChanged:function(icon){var parts=(icon || '').split(':');this._iconName = parts.pop();this._iconsetName = parts.pop() || this._DEFAULT_ICONSET;this._updateIcon();},_srcChanged:function(src){this._updateIcon();},_usesIconset:function(){return this.icon || !this.src;}, /** @suppress {visibility} */_updateIcon:function(){if(this._usesIconset()){if(this._iconsetName){this._iconset =  /** @type {?Polymer.Iconset} */this._meta.byKey(this._iconsetName);if(this._iconset){this._iconset.applyIcon(this,this._iconName,this.theme);this.unlisten(window,'iron-iconset-added','_updateIcon');}else {this.listen(window,'iron-iconset-added','_updateIcon');}}}else {if(!this._img){this._img = document.createElement('img');this._img.style.width = '100%';this._img.style.height = '100%';this._img.draggable = false;}this._img.src = this.src;Polymer.dom(this.root).appendChild(this._img);}}});Polymer({is:'paper-toolbar',hostAttributes:{'role':'toolbar'},properties:{ /**
         * Controls how the items are aligned horizontally when they are placed
         * at the bottom.
         * Options are `start`, `center`, `end`, `justified` and `around`.
         *
         * @attribute bottomJustify
         * @type string
         * @default ''
         */bottomJustify:{type:String,value:''}, /**
         * Controls how the items are aligned horizontally.
         * Options are `start`, `center`, `end`, `justified` and `around`.
         *
         * @attribute justify
         * @type string
         * @default ''
         */justify:{type:String,value:''}, /**
         * Controls how the items are aligned horizontally when they are placed
         * in the middle.
         * Options are `start`, `center`, `end`, `justified` and `around`.
         *
         * @attribute middleJustify
         * @type string
         * @default ''
         */middleJustify:{type:String,value:''}},attached:function(){this._observer = this._observe(this);this._updateAriaLabelledBy();},detached:function(){if(this._observer){this._observer.disconnect();}},_observe:function(node){var observer=new MutationObserver((function(){this._updateAriaLabelledBy();}).bind(this));observer.observe(node,{childList:true,subtree:true});return observer;},_updateAriaLabelledBy:function(){var labelledBy=[];var contents=Polymer.dom(this.root).querySelectorAll('content');for(var content,index=0;content = contents[index];index++) {var nodes=Polymer.dom(content).getDistributedNodes();for(var node,jndex=0;node = nodes[jndex];jndex++) {if(node.classList && node.classList.contains('title')){if(node.id){labelledBy.push(node.id);}else {var id='paper-toolbar-label-' + Math.floor(Math.random() * 10000);node.id = id;labelledBy.push(id);}}}}if(labelledBy.length > 0){this.setAttribute('aria-labelledby',labelledBy.join(' '));}},_computeBarExtraClasses:function(barJustify){if(!barJustify)return '';return barJustify + (barJustify === 'justified'?'':'-justified');}});(function(){'use strict';var SHADOW_WHEN_SCROLLING=1;var SHADOW_ALWAYS=2;var MODE_CONFIGS={outerScroll:{'scroll':true},shadowMode:{'standard':SHADOW_ALWAYS,'waterfall':SHADOW_WHEN_SCROLLING,'waterfall-tall':SHADOW_WHEN_SCROLLING},tallMode:{'waterfall-tall':true}};Polymer({is:'paper-header-panel', /**
       * Fired when the content has been scrolled.  `event.detail.target` returns
       * the scrollable element which you can use to access scroll info such as
       * `scrollTop`.
       *
       *     <paper-header-panel on-content-scroll="scrollHandler">
       *       ...
       *     </paper-header-panel>
       *
       *
       *     scrollHandler: function(event) {
       *       var scroller = event.detail.target;
       *       console.log(scroller.scrollTop);
       *     }
       *
       * @event content-scroll
       */properties:{ /**
         * Controls header and scrolling behavior. Options are
         * `standard`, `seamed`, `waterfall`, `waterfall-tall`, `scroll` and
         * `cover`. Default is `standard`.
         *
         * `standard`: The header is a step above the panel. The header will consume the
         * panel at the point of entry, preventing it from passing through to the
         * opposite side.
         *
         * `seamed`: The header is presented as seamed with the panel.
         *
         * `waterfall`: Similar to standard mode, but header is initially presented as
         * seamed with panel, but then separates to form the step.
         *
         * `waterfall-tall`: The header is initially taller (`tall` class is added to
         * the header).  As the user scrolls, the header separates (forming an edge)
         * while condensing (`tall` class is removed from the header).
         *
         * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
         *
         * `cover`: The panel covers the whole `paper-header-panel` including the
         * header. This allows user to style the panel in such a way that the panel is
         * partially covering the header.
         *
         *     <paper-header-panel mode="cover">
         *       <paper-toolbar class="tall">
         *         <core-icon-button icon="menu"></core-icon-button>
         *       </paper-toolbar>
         *       <div class="content"></div>
         *     </paper-header-panel>
         */mode:{type:String,value:'standard',observer:'_modeChanged',reflectToAttribute:true}, /**
         * If true, the drop-shadow is always shown no matter what mode is set to.
         */shadow:{type:Boolean,value:false}, /**
         * The class used in waterfall-tall mode.  Change this if the header
         * accepts a different class for toggling height, e.g. "medium-tall"
         */tallClass:{type:String,value:'tall'}, /**
         * If true, the scroller is at the top
         */atTop:{type:Boolean,value:true,readOnly:true}},observers:['_computeDropShadowHidden(atTop, mode, shadow)'],ready:function(){this.scrollHandler = this._scroll.bind(this);this._addListener(); // Run `scroll` logic once to initialze class names, etc.
this._keepScrollingState();},detached:function(){this._removeListener();}, /**
       * Returns the header element
       *
       * @property header
       * @type Object
       */get header(){return Polymer.dom(this.$.headerContent).getDistributedNodes()[0];}, /**
       * Returns the scrollable element.
       *
       * @property scroller
       * @type Object
       */get scroller(){return this._getScrollerForMode(this.mode);}, /**
       * Returns true if the scroller has a visible shadow.
       *
       * @property visibleShadow
       * @type Boolean
       */get visibleShadow(){return this.$.dropShadow.classList.contains('has-shadow');},_computeDropShadowHidden:function(atTop,mode,shadow){var shadowMode=MODE_CONFIGS.shadowMode[mode];if(this.shadow){this.toggleClass('has-shadow',true,this.$.dropShadow);}else if(shadowMode === SHADOW_ALWAYS){this.toggleClass('has-shadow',true,this.$.dropShadow);}else if(shadowMode === SHADOW_WHEN_SCROLLING && !atTop){this.toggleClass('has-shadow',true,this.$.dropShadow);}else {this.toggleClass('has-shadow',false,this.$.dropShadow);}},_computeMainContainerClass:function(mode){ // TODO:  It will be useful to have a utility for classes
// e.g. Polymer.Utils.classes({ foo: true });
var classes={};classes['flex'] = mode !== 'cover';return Object.keys(classes).filter(function(className){return classes[className];}).join(' ');},_addListener:function(){this.scroller.addEventListener('scroll',this.scrollHandler,false);},_removeListener:function(){this.scroller.removeEventListener('scroll',this.scrollHandler);},_modeChanged:function(newMode,oldMode){var configs=MODE_CONFIGS;var header=this.header;var animateDuration=200;if(header){ // in tallMode it may add tallClass to the header; so do the cleanup
// when mode is changed from tallMode to not tallMode
if(configs.tallMode[oldMode] && !configs.tallMode[newMode]){header.classList.remove(this.tallClass);this.async(function(){header.classList.remove('animate');},animateDuration);}else {header.classList.toggle('animate',configs.tallMode[newMode]);}}this._keepScrollingState();},_keepScrollingState:function(){var main=this.scroller;var header=this.header;this._setAtTop(main.scrollTop === 0);if(header && this.tallClass && MODE_CONFIGS.tallMode[this.mode]){this.toggleClass(this.tallClass,this.atTop || header.classList.contains(this.tallClass) && main.scrollHeight < this.offsetHeight,header);}},_scroll:function(){this._keepScrollingState();this.fire('content-scroll',{target:this.scroller},{bubbles:false});},_getScrollerForMode:function(mode){return MODE_CONFIGS.outerScroll[mode]?this:this.$.mainContainer;}});})();(function(){var Utility={distance:function(x1,y1,x2,y2){var xDelta=x1 - x2;var yDelta=y1 - y2;return Math.sqrt(xDelta * xDelta + yDelta * yDelta);},now:window.performance && window.performance.now?window.performance.now.bind(window.performance):Date.now}; /**
     * @param {HTMLElement} element
     * @constructor
     */function ElementMetrics(element){this.element = element;this.width = this.boundingRect.width;this.height = this.boundingRect.height;this.size = Math.max(this.width,this.height);}ElementMetrics.prototype = {get boundingRect(){return this.element.getBoundingClientRect();},furthestCornerDistanceFrom:function(x,y){var topLeft=Utility.distance(x,y,0,0);var topRight=Utility.distance(x,y,this.width,0);var bottomLeft=Utility.distance(x,y,0,this.height);var bottomRight=Utility.distance(x,y,this.width,this.height);return Math.max(topLeft,topRight,bottomLeft,bottomRight);}}; /**
     * @param {HTMLElement} element
     * @constructor
     */function Ripple(element){this.element = element;this.color = window.getComputedStyle(element).color;this.wave = document.createElement('div');this.waveContainer = document.createElement('div');this.wave.style.backgroundColor = this.color;this.wave.classList.add('wave');this.waveContainer.classList.add('wave-container');Polymer.dom(this.waveContainer).appendChild(this.wave);this.resetInteractionState();}Ripple.MAX_RADIUS = 300;Ripple.prototype = {get recenters(){return this.element.recenters;},get center(){return this.element.center;},get mouseDownElapsed(){var elapsed;if(!this.mouseDownStart){return 0;}elapsed = Utility.now() - this.mouseDownStart;if(this.mouseUpStart){elapsed -= this.mouseUpElapsed;}return elapsed;},get mouseUpElapsed(){return this.mouseUpStart?Utility.now() - this.mouseUpStart:0;},get mouseDownElapsedSeconds(){return this.mouseDownElapsed / 1000;},get mouseUpElapsedSeconds(){return this.mouseUpElapsed / 1000;},get mouseInteractionSeconds(){return this.mouseDownElapsedSeconds + this.mouseUpElapsedSeconds;},get initialOpacity(){return this.element.initialOpacity;},get opacityDecayVelocity(){return this.element.opacityDecayVelocity;},get radius(){var width2=this.containerMetrics.width * this.containerMetrics.width;var height2=this.containerMetrics.height * this.containerMetrics.height;var waveRadius=Math.min(Math.sqrt(width2 + height2),Ripple.MAX_RADIUS) * 1.1 + 5;var duration=1.1 - 0.2 * (waveRadius / Ripple.MAX_RADIUS);var timeNow=this.mouseInteractionSeconds / duration;var size=waveRadius * (1 - Math.pow(80,-timeNow));return Math.abs(size);},get opacity(){if(!this.mouseUpStart){return this.initialOpacity;}return Math.max(0,this.initialOpacity - this.mouseUpElapsedSeconds * this.opacityDecayVelocity);},get outerOpacity(){ // Linear increase in background opacity, capped at the opacity
// of the wavefront (waveOpacity).
var outerOpacity=this.mouseUpElapsedSeconds * 0.3;var waveOpacity=this.opacity;return Math.max(0,Math.min(outerOpacity,waveOpacity));},get isOpacityFullyDecayed(){return this.opacity < 0.01 && this.radius >= Math.min(this.maxRadius,Ripple.MAX_RADIUS);},get isRestingAtMaxRadius(){return this.opacity >= this.initialOpacity && this.radius >= Math.min(this.maxRadius,Ripple.MAX_RADIUS);},get isAnimationComplete(){return this.mouseUpStart?this.isOpacityFullyDecayed:this.isRestingAtMaxRadius;},get translationFraction(){return Math.min(1,this.radius / this.containerMetrics.size * 2 / Math.sqrt(2));},get xNow(){if(this.xEnd){return this.xStart + this.translationFraction * (this.xEnd - this.xStart);}return this.xStart;},get yNow(){if(this.yEnd){return this.yStart + this.translationFraction * (this.yEnd - this.yStart);}return this.yStart;},get isMouseDown(){return this.mouseDownStart && !this.mouseUpStart;},resetInteractionState:function(){this.maxRadius = 0;this.mouseDownStart = 0;this.mouseUpStart = 0;this.xStart = 0;this.yStart = 0;this.xEnd = 0;this.yEnd = 0;this.slideDistance = 0;this.containerMetrics = new ElementMetrics(this.element);},draw:function(){var scale;var translateString;var dx;var dy;this.wave.style.opacity = this.opacity;scale = this.radius / (this.containerMetrics.size / 2);dx = this.xNow - this.containerMetrics.width / 2;dy = this.yNow - this.containerMetrics.height / 2; // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
// https://bugs.webkit.org/show_bug.cgi?id=98538
this.waveContainer.style.webkitTransform = 'translate(' + dx + 'px, ' + dy + 'px)';this.waveContainer.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';this.wave.style.webkitTransform = 'scale(' + scale + ',' + scale + ')';this.wave.style.transform = 'scale3d(' + scale + ',' + scale + ',1)';}, /** @param {Event=} event */downAction:function(event){var xCenter=this.containerMetrics.width / 2;var yCenter=this.containerMetrics.height / 2;this.resetInteractionState();this.mouseDownStart = Utility.now();if(this.center){this.xStart = xCenter;this.yStart = yCenter;this.slideDistance = Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd);}else {this.xStart = event?event.detail.x - this.containerMetrics.boundingRect.left:this.containerMetrics.width / 2;this.yStart = event?event.detail.y - this.containerMetrics.boundingRect.top:this.containerMetrics.height / 2;}if(this.recenters){this.xEnd = xCenter;this.yEnd = yCenter;this.slideDistance = Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd);}this.maxRadius = this.containerMetrics.furthestCornerDistanceFrom(this.xStart,this.yStart);this.waveContainer.style.top = (this.containerMetrics.height - this.containerMetrics.size) / 2 + 'px';this.waveContainer.style.left = (this.containerMetrics.width - this.containerMetrics.size) / 2 + 'px';this.waveContainer.style.width = this.containerMetrics.size + 'px';this.waveContainer.style.height = this.containerMetrics.size + 'px';}, /** @param {Event=} event */upAction:function(event){if(!this.isMouseDown){return;}this.mouseUpStart = Utility.now();},remove:function(){Polymer.dom(this.waveContainer.parentNode).removeChild(this.waveContainer);}};Polymer({is:'paper-ripple',behaviors:[Polymer.IronA11yKeysBehavior],properties:{ /**
         * The initial opacity set on the wave.
         *
         * @attribute initialOpacity
         * @type number
         * @default 0.25
         */initialOpacity:{type:Number,value:0.25}, /**
         * How fast (opacity per second) the wave fades out.
         *
         * @attribute opacityDecayVelocity
         * @type number
         * @default 0.8
         */opacityDecayVelocity:{type:Number,value:0.8}, /**
         * If true, ripples will exhibit a gravitational pull towards
         * the center of their container as they fade away.
         *
         * @attribute recenters
         * @type boolean
         * @default false
         */recenters:{type:Boolean,value:false}, /**
         * If true, ripples will center inside its container
         *
         * @attribute recenters
         * @type boolean
         * @default false
         */center:{type:Boolean,value:false}, /**
         * A list of the visual ripples.
         *
         * @attribute ripples
         * @type Array
         * @default []
         */ripples:{type:Array,value:function(){return [];}}, /**
         * True when there are visible ripples animating within the
         * element.
         */animating:{type:Boolean,readOnly:true,reflectToAttribute:true,value:false}, /**
         * If true, the ripple will remain in the "down" state until `holdDown`
         * is set to false again.
         */holdDown:{type:Boolean,value:false,observer:'_holdDownChanged'}, /**
         * If true, the ripple will not generate a ripple effect
         * via pointer interaction.
         * Calling ripple's imperative api like `simulatedRipple` will
         * still generate the ripple effect.
         */noink:{type:Boolean,value:false},_animating:{type:Boolean},_boundAnimate:{type:Function,value:function(){return this.animate.bind(this);}}},get target(){var ownerRoot=Polymer.dom(this).getOwnerRoot();var target;if(this.parentNode.nodeType == 11){ // DOCUMENT_FRAGMENT_NODE
target = ownerRoot.host;}else {target = this.parentNode;}return target;},keyBindings:{'enter:keydown':'_onEnterKeydown','space:keydown':'_onSpaceKeydown','space:keyup':'_onSpaceKeyup'},attached:function(){ // Set up a11yKeysBehavior to listen to key events on the target,
// so that space and enter activate the ripple even if the target doesn't
// handle key events. The key handlers deal with `noink` themselves.
this.keyEventTarget = this.target;this.listen(this.target,'up','uiUpAction');this.listen(this.target,'down','uiDownAction');},detached:function(){this.unlisten(this.target,'up','uiUpAction');this.unlisten(this.target,'down','uiDownAction');},get shouldKeepAnimating(){for(var index=0;index < this.ripples.length;++index) {if(!this.ripples[index].isAnimationComplete){return true;}}return false;},simulatedRipple:function(){this.downAction(null); // Please see polymer/polymer#1305
this.async(function(){this.upAction();},1);}, /**
       * Provokes a ripple down effect via a UI event,
       * respecting the `noink` property.
       * @param {Event=} event
       */uiDownAction:function(event){if(!this.noink){this.downAction(event);}}, /**
       * Provokes a ripple down effect via a UI event,
       * *not* respecting the `noink` property.
       * @param {Event=} event
       */downAction:function(event){if(this.holdDown && this.ripples.length > 0){return;}var ripple=this.addRipple();ripple.downAction(event);if(!this._animating){this.animate();}}, /**
       * Provokes a ripple up effect via a UI event,
       * respecting the `noink` property.
       * @param {Event=} event
       */uiUpAction:function(event){if(!this.noink){this.upAction(event);}}, /**
       * Provokes a ripple up effect via a UI event,
       * *not* respecting the `noink` property.
       * @param {Event=} event
       */upAction:function(event){if(this.holdDown){return;}this.ripples.forEach(function(ripple){ripple.upAction(event);});this.animate();},onAnimationComplete:function(){this._animating = false;this.$.background.style.backgroundColor = null;this.fire('transitionend');},addRipple:function(){var ripple=new Ripple(this);Polymer.dom(this.$.waves).appendChild(ripple.waveContainer);this.$.background.style.backgroundColor = ripple.color;this.ripples.push(ripple);this._setAnimating(true);return ripple;},removeRipple:function(ripple){var rippleIndex=this.ripples.indexOf(ripple);if(rippleIndex < 0){return;}this.ripples.splice(rippleIndex,1);ripple.remove();if(!this.ripples.length){this._setAnimating(false);}},animate:function(){var index;var ripple;this._animating = true;for(index = 0;index < this.ripples.length;++index) {ripple = this.ripples[index];ripple.draw();this.$.background.style.opacity = ripple.outerOpacity;if(ripple.isOpacityFullyDecayed && !ripple.isRestingAtMaxRadius){this.removeRipple(ripple);}}if(!this.shouldKeepAnimating && this.ripples.length === 0){this.onAnimationComplete();}else {window.requestAnimationFrame(this._boundAnimate);}},_onEnterKeydown:function(){this.uiDownAction();this.async(this.uiUpAction,1);},_onSpaceKeydown:function(){this.uiDownAction();},_onSpaceKeyup:function(){this.uiUpAction();}, // note: holdDown does not respect noink since it can be a focus based
// effect.
_holdDownChanged:function(newVal,oldVal){if(oldVal === undefined){return;}if(newVal){this.downAction();}else {this.upAction();}}});})();Polymer({is:'paper-icon-button',hostAttributes:{role:'button',tabindex:'0'},behaviors:[Polymer.PaperInkyFocusBehavior],properties:{ /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         */src:{type:String}, /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         */icon:{type:String}, /**
         * Specifies the alternate text for the button, for accessibility.
         */alt:{type:String,observer:"_altChanged"}},_altChanged:function(newValue,oldValue){var label=this.getAttribute('aria-label'); // Don't stomp over a user-set aria-label.
if(!label || oldValue == label){this.setAttribute('aria-label',newValue);}}});Polymer({is:'paper-item',behaviors:[Polymer.PaperItemBehavior]});(function(){Polymer({is:'paper-menu',behaviors:[Polymer.IronMenuBehavior]});})();Polymer({is:'paper-material',properties:{ /**
       * The z-depth of this element, from 0-5. Setting to 0 will remove the
       * shadow, and each increasing number greater than 0 will be "deeper"
       * than the last.
       *
       * @attribute elevation
       * @type number
       * @default 1
       */elevation:{type:Number,reflectToAttribute:true,value:1}, /**
       * Set this to true to animate the shadow when setting a new
       * `elevation` value.
       *
       * @attribute animated
       * @type boolean
       * @default false
       */animated:{type:Boolean,reflectToAttribute:true,value:false}}});Polymer({is:'iron-image',properties:{ /**
       * The URL of an image.
       */src:{observer:'_srcChanged',type:String,value:''}, /**
       * When true, the image is prevented from loading and any placeholder is
       * shown.  This may be useful when a binding to the src property is known to
       * be invalid, to prevent 404 requests.
       */preventLoad:{type:Boolean,value:false}, /**
       * Sets a sizing option for the image.  Valid values are `contain` (full
       * aspect ratio of the image is contained within the element and
       * letterboxed) or `cover` (image is cropped in order to fully cover the
       * bounds of the element), or `null` (default: image takes natural size).
       */sizing:{type:String,value:null}, /**
       * When a sizing option is used (`cover` or `contain`), this determines
       * how the image is aligned within the element bounds.
       */position:{type:String,value:'center'}, /**
       * When `true`, any change to the `src` property will cause the `placeholder`
       * image to be shown until the new image has loaded.
       */preload:{type:Boolean,value:false}, /**
       * This image will be used as a background/placeholder until the src image has
       * loaded.  Use of a data-URI for placeholder is encouraged for instant rendering.
       */placeholder:{type:String,value:null}, /**
       * When `preload` is true, setting `fade` to true will cause the image to
       * fade into place.
       */fade:{type:Boolean,value:false}, /**
       * Read-only value that is true when the image is loaded.
       */loaded:{notify:true,type:Boolean,value:false}, /**
       * Read-only value that tracks the loading state of the image when the `preload`
       * option is used.
       */loading:{notify:true,type:Boolean,value:false}, /**
       * Can be used to set the width of image (e.g. via binding); size may also be
       * set via CSS.
       */width:{observer:'_widthChanged',type:Number,value:null}, /**
       * Can be used to set the height of image (e.g. via binding); size may also be
       * set via CSS.
       *
       * @attribute height
       * @type number
       * @default null
       */height:{observer:'_heightChanged',type:Number,value:null},_placeholderBackgroundUrl:{type:String,computed:'_computePlaceholderBackgroundUrl(preload,placeholder)',observer:'_placeholderBackgroundUrlChanged'},requiresPreload:{type:Boolean,computed:'_computeRequiresPreload(preload,loaded)'},canLoad:{type:Boolean,computed:'_computeCanLoad(preventLoad, src)'}},observers:['_transformChanged(sizing, position)','_loadBehaviorChanged(canLoad, preload, loaded)','_loadStateChanged(src, preload, loaded)'],ready:function(){if(!this.hasAttribute('role')){this.setAttribute('role','img');}},_computeImageVisibility:function(){return !!this.sizing;},_computePlaceholderVisibility:function(){return !this.preload || this.loaded && !this.fade;},_computePlaceholderClassName:function(){if(!this.preload){return '';}if(this.loaded && this.fade){return 'faded-out';}return '';},_computePlaceholderBackgroundUrl:function(){if(this.preload && this.placeholder){return 'url(' + this.placeholder + ')';}return null;},_computeRequiresPreload:function(){return this.preload && !this.loaded;},_computeCanLoad:function(){return Boolean(!this.preventLoad && this.src);},_widthChanged:function(){this.style.width = isNaN(this.width)?this.width:this.width + 'px';},_heightChanged:function(){this.style.height = isNaN(this.height)?this.height:this.height + 'px';},_srcChanged:function(newSrc,oldSrc){if(newSrc !== oldSrc){this.loaded = false;}},_placeholderBackgroundUrlChanged:function(){this.$.placeholder.style.backgroundImage = this._placeholderBackgroundUrl;},_transformChanged:function(){var placeholderStyle=this.$.placeholder.style;this.style.backgroundSize = placeholderStyle.backgroundSize = this.sizing;this.style.backgroundPosition = placeholderStyle.backgroundPosition = this.sizing?this.position:'';this.style.backgroundRepeat = placeholderStyle.backgroundRepeat = this.sizing?'no-repeat':'';},_loadBehaviorChanged:function(){var img;if(!this.canLoad){return;}if(this.requiresPreload){img = new Image();img.src = this.src;this.loading = true;img.onload = (function(){this.loading = false;this.loaded = true;}).bind(this);}else {this.loaded = true;}},_loadStateChanged:function(){if(this.requiresPreload){return;}if(this.sizing){this.style.backgroundImage = this.src?'url(' + this.src + ')':'';}else {this.$.img.src = this.src || '';}}});Polymer({is:'paper-card',properties:{ /**
       * The title of the card.
       */heading:{type:String,value:'',observer:'_headingChanged'}, /**
       * The url of the title image of the card.
       */image:{type:String,value:''}, /**
       * When `true`, any change to the image url property will cause the
       * `placeholder` image to be shown until the image is fully rendered.
       */preloadImage:{type:Boolean,value:false}, /**
       * When `preloadImage` is true, setting `fadeImage` to true will cause the
       * image to fade into place.
       */fadeImage:{type:Boolean,value:false}, /**
       * The z-depth of the card, from 0-5.
       */elevation:{type:Number,value:1,reflectToAttribute:true}, /**
       * Set this to true to animate the card shadow when setting a new
       * `z` value.
       */animatedShadow:{type:Boolean,value:false}, /**
       * Read-only property used to pass down the `animatedShadow` value to
       * the underlying paper-material style (since they have different names).
       */animated:{type:Boolean,reflectToAttribute:true,readOnly:true,computed:'_computeAnimated(animatedShadow)'}},_headingChanged:function(heading){var label=this.getAttribute('aria-label');this.setAttribute('aria-label',heading);},_computeHeadingClass:function(image){var cls='title-text';if(image)cls += ' over-image';return cls;},_computeAnimated:function(animatedShadow){return animatedShadow;}});Polymer({is:'paper-button',behaviors:[Polymer.PaperButtonBehavior],properties:{ /**
       * If true, the button should be styled with a shadow.
       */raised:{type:Boolean,reflectToAttribute:true,value:false,observer:'_calculateElevation'}},_calculateElevation:function(){if(!this.raised){this.elevation = 0;}else {Polymer.PaperButtonBehaviorImpl._calculateElevation.apply(this);}}});(function(){'use strict' // this would be the only `paper-drawer-panel` in
// the whole app that can be in `dragging` state
;var sharedPanel=null;function classNames(obj){var classes=[];for(var key in obj) {if(obj.hasOwnProperty(key) && obj[key]){classes.push(key);}}return classes.join(' ');}Polymer({is:'paper-drawer-panel',behaviors:[Polymer.IronResizableBehavior], /**
         * Fired when the narrow layout changes.
         *
         * @event paper-responsive-change {{narrow: boolean}} detail -
         *     narrow: true if the panel is in narrow layout.
         */ /**
         * Fired when the a panel is selected.
         *
         * Listening for this event is an alternative to observing changes in the `selected` attribute.
         * This event is fired both when a panel is selected.
         *
         * @event iron-select {{item: Object}} detail -
         *     item: The panel that the event refers to.
         */ /**
         * Fired when a panel is deselected.
         *
         * Listening for this event is an alternative to observing changes in the `selected` attribute.
         * This event is fired both when a panel is deselected.
         *
         * @event iron-deselect {{item: Object}} detail -
         *     item: The panel that the event refers to.
         */properties:{ /**
           * The panel to be selected when `paper-drawer-panel` changes to narrow
           * layout.
           */defaultSelected:{type:String,value:'main'}, /**
           * If true, swipe from the edge is disabled.
           */disableEdgeSwipe:{type:Boolean,value:false}, /**
           * If true, swipe to open/close the drawer is disabled.
           */disableSwipe:{type:Boolean,value:false}, /**
           * Whether the user is dragging the drawer interactively.
           */dragging:{type:Boolean,value:false,readOnly:true,notify:true}, /**
           * Width of the drawer panel.
           */drawerWidth:{type:String,value:'256px'}, /**
           * How many pixels on the side of the screen are sensitive to edge
           * swipes and peek.
           */edgeSwipeSensitivity:{type:Number,value:30}, /**
           * If true, ignore `responsiveWidth` setting and force the narrow layout.
           */forceNarrow:{type:Boolean,value:false}, /**
           * Whether the browser has support for the transform CSS property.
           */hasTransform:{type:Boolean,value:function(){return 'transform' in this.style;}}, /**
           * Whether the browser has support for the will-change CSS property.
           */hasWillChange:{type:Boolean,value:function(){return 'willChange' in this.style;}}, /**
           * Returns true if the panel is in narrow layout.  This is useful if you
           * need to show/hide elements based on the layout.
           */narrow:{reflectToAttribute:true,type:Boolean,value:false,readOnly:true,notify:true}, /**
           * Whether the drawer is peeking out from the edge.
           */peeking:{type:Boolean,value:false,readOnly:true,notify:true}, /**
           * Max-width when the panel changes to narrow layout.
           */responsiveWidth:{type:String,value:'600px'}, /**
           * If true, position the drawer to the right.
           */rightDrawer:{type:Boolean,value:false}, /**
           * The panel that is being selected. `drawer` for the drawer panel and
           * `main` for the main panel.
           */selected:{reflectToAttribute:true,notify:true,type:String,value:null}, /**
           * The attribute on elements that should toggle the drawer on tap, also elements will
           * automatically be hidden in wide layout.
           */drawerToggleAttribute:{type:String,value:'paper-drawer-toggle'}, /**
           * Whether the transition is enabled.
           */transition:{type:Boolean,value:false}},listeners:{tap:'_onTap',track:'_onTrack',down:'_downHandler',up:'_upHandler'},observers:['_forceNarrowChanged(forceNarrow, defaultSelected)'], /**
         * Toggles the panel open and closed.
         *
         * @method togglePanel
         */togglePanel:function(){if(this._isMainSelected()){this.openDrawer();}else {this.closeDrawer();}}, /**
         * Opens the drawer.
         *
         * @method openDrawer
         */openDrawer:function(){this.selected = 'drawer';}, /**
         * Closes the drawer.
         *
         * @method closeDrawer
         */closeDrawer:function(){this.selected = 'main';},ready:function(){ // Avoid transition at the beginning e.g. page loads and enable
// transitions only after the element is rendered and ready.
this.transition = true;},_onMainTransitionEnd:function(e){if(e.currentTarget === this.$.main && (e.propertyName === 'left' || e.propertyName === 'right')){this.notifyResize();}},_computeIronSelectorClass:function(narrow,transition,dragging,rightDrawer,peeking){return classNames({dragging:dragging,'narrow-layout':narrow,'right-drawer':rightDrawer,'left-drawer':!rightDrawer,transition:transition,peeking:peeking});},_computeDrawerStyle:function(drawerWidth){return 'width:' + drawerWidth + ';';},_computeMainStyle:function(narrow,rightDrawer,drawerWidth){var style='';style += 'left:' + (narrow || rightDrawer?'0':drawerWidth) + ';';if(rightDrawer){style += 'right:' + (narrow?'':drawerWidth) + ';';}return style;},_computeMediaQuery:function(forceNarrow,responsiveWidth){return forceNarrow?'':'(max-width: ' + responsiveWidth + ')';},_computeSwipeOverlayHidden:function(narrow,disableEdgeSwipe){return !narrow || disableEdgeSwipe;},_onTrack:function(event){if(sharedPanel && this !== sharedPanel){return;}switch(event.detail.state){case 'start':this._trackStart(event);break;case 'track':this._trackX(event);break;case 'end':this._trackEnd(event);break;}},_responsiveChange:function(narrow){this._setNarrow(narrow);if(this.narrow){this.selected = this.defaultSelected;}this.setScrollDirection(this._swipeAllowed()?'y':'all');this.fire('paper-responsive-change',{narrow:this.narrow});},_onQueryMatchesChanged:function(event){this._responsiveChange(event.detail.value);},_forceNarrowChanged:function(){ // set the narrow mode only if we reached the `responsiveWidth`
this._responsiveChange(this.forceNarrow || this.$.mq.queryMatches);},_swipeAllowed:function(){return this.narrow && !this.disableSwipe;},_isMainSelected:function(){return this.selected === 'main';},_startEdgePeek:function(){this.width = this.$.drawer.offsetWidth;this._moveDrawer(this._translateXForDeltaX(this.rightDrawer?-this.edgeSwipeSensitivity:this.edgeSwipeSensitivity));this._setPeeking(true);},_stopEdgePeek:function(){if(this.peeking){this._setPeeking(false);this._moveDrawer(null);}},_downHandler:function(event){if(!this.dragging && this._isMainSelected() && this._isEdgeTouch(event) && !sharedPanel){this._startEdgePeek(); // cancel selection
event.preventDefault(); // grab this panel
sharedPanel = this;}},_upHandler:function(){this._stopEdgePeek(); // release the panel
sharedPanel = null;},_onTap:function(event){var targetElement=Polymer.dom(event).localTarget;var isTargetToggleElement=targetElement && this.drawerToggleAttribute && targetElement.hasAttribute(this.drawerToggleAttribute);if(isTargetToggleElement){this.togglePanel();}},_isEdgeTouch:function(event){var x=event.detail.x;return !this.disableEdgeSwipe && this._swipeAllowed() && (this.rightDrawer?x >= this.offsetWidth - this.edgeSwipeSensitivity:x <= this.edgeSwipeSensitivity);},_trackStart:function(event){if(this._swipeAllowed()){sharedPanel = this;this._setDragging(true);if(this._isMainSelected()){this._setDragging(this.peeking || this._isEdgeTouch(event));}if(this.dragging){this.width = this.$.drawer.offsetWidth;this.transition = false;}}},_translateXForDeltaX:function(deltaX){var isMain=this._isMainSelected();if(this.rightDrawer){return Math.max(0,isMain?this.width + deltaX:deltaX);}else {return Math.min(0,isMain?deltaX - this.width:deltaX);}},_trackX:function(event){if(this.dragging){var dx=event.detail.dx;if(this.peeking){if(Math.abs(dx) <= this.edgeSwipeSensitivity){ // Ignore trackx until we move past the edge peek.
return;}this._setPeeking(false);}this._moveDrawer(this._translateXForDeltaX(dx));}},_trackEnd:function(event){if(this.dragging){var xDirection=event.detail.dx > 0;this._setDragging(false);this.transition = true;sharedPanel = null;this._moveDrawer(null);if(this.rightDrawer){this[xDirection?'closeDrawer':'openDrawer']();}else {this[xDirection?'openDrawer':'closeDrawer']();}}},_transformForTranslateX:function(translateX){if(translateX === null){return '';}return this.hasWillChange?'translateX(' + translateX + 'px)':'translate3d(' + translateX + 'px, 0, 0)';},_moveDrawer:function(translateX){this.transform(this._transformForTranslateX(translateX),this.$.drawer);}});})();
