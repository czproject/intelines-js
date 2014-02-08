/**
 * Cz\Intelines.JS
 *
 * @author    Jan Pecha <janpecha@email.cz>, 2014
 * @license   New BSD License (BSD-3)
 * @requires  Cz\Selection.js
 */

var Cz = Cz || {};
(function (Cz) {
	var IntelinesJs = (function () {
		function IntelinesJs(textarea, selection) {
			this.textarea = textarea;
			this.selection = selection;
			this.enterPressed = false;

			this.addScopedEvent(textarea, 'keydown', this.onKeyDown, this);
		}


		/**
		 * @param  Event
		 * @return bool
		 * @internal
		 */
		IntelinesJs.prototype.onKeyDown = function (e) {
			if (e.which == 9 /* TAB */ && !e.ctrlKey && !e.altKey) { // TAB handling
				if (!e.shiftKey) {
					// vybran jenom jeden radek
					// <DEL>a Start a End jsou stejné</DEL>
					// tak delame replace
					// jinak wrap lines
					if (this.selection.getLines().length > 1) {
						this.selection.wrapLines("\t", '', false);
					} else {
						this.selection.replace("\t", true, false);
					}
				} else {
					this.selection.unwrapLines("\t", '', false);
				}
				this.enterPressed = false;
				return false;

			} else if (e.which == 13 /* ENTER */  && !e.ctrlKey && !e.altKey && !e.shiftKey) {
				var lines = this.selection.getLines();
				if (lines.length == 1) {
					if (!this.enterPressed) {
						line = this.extractStartLine(lines[0]);
						this.enterPressed = !!line.length;
						if (line.length) {
							this.selection.replace("\n" + line, true, false);
						} else {
							return true;
						}
					} else {
						this.selection.replaceLines('', false, false);
						this.enterPressed = false;
						return true;
					}
					return this.cancelEvent(e);
				}
			} else {
				this.enterPressed = false;
			}

			return true;
		};



		IntelinesJs.prototype.extractStartLine = function(line) {
			var buffer = '';
			for (var i = 0; i < line.length; i++) {
				var code = line.charCodeAt(i);

				if (code === 9 /* TAB */ || code === 32 /* space */
				|| code === 42 /* '*' */ || code === 45 /* '-' */
				|| code === 124 /* | */ || code === 62 /* '>' */) {
					buffer += line.charAt(i);
				} else {
					break;
				}
			}
			return buffer;
		};


		/**
		 * @param	event
		 * @return	FALSE
		 * @internal
		 */
		IntelinesJs.prototype.cancelEvent = function(e) {
			e = e ? e : window.event;

			if(e.stopPropagation)
			{
				e.stopPropagation();
			}

			if(e.preventDefault)
			{
				e.preventDefault();
			}

			e.cancelBubble = true;
			e.cancel = true;
			e.returnValue = false;

			return false;
		};


		/**
		 * @param	HTMLElement
		 * @param	String  event type (click, etc.)
		 * @param	handler
		 * @return	bool
		 * @internal
		 */
		IntelinesJs.prototype.addEvent = function(el, type, handler) {
			if(el.addEventListener)
			{
				el.addEventListener(type, handler, false);
				return true;
			}
			else
			{
				if(el.attachEvent)
				{
					return el.attachEvent('on' + type, handler);
				}
			}
			return false;
		};


		/**
		 * http://helephant.com/2008/04/26/objects-event-handlers-and-this-in-javascript/
		 * @param	HTMLElement
		 * @param	String  event type (click, etc.)
		 * @param	handler
		 * @param	object|nothing
		 * @return	bool
		 */
		IntelinesJs.prototype.addScopedEvent = function(el, type, handler, scope) {
			var scopedEventHandler = scope ? function(e) { handler.apply(scope, [e]); } : handler;
			return this.addEvent(el, type, scopedEventHandler);
		};

		return IntelinesJs;
	})();
	Cz.IntelinesJs = IntelinesJs;
})(Cz || (Cz = {}));

