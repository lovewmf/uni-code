(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.code = {}));
})(this, (function (exports) { 'use strict';

	// export const UNIT_CONVERSION = function (num:string | number):number{
	// 	return uni.upx2px(Number(num));
	// }
	var UtF16TO8 = function (code) {
	    var out = '';
	    var c = 0;
	    for (var i = 0; i < code.length; i++) {
	        c = code.charCodeAt(i);
	        if ((c >= 0x0001) && (c <= 0x007F)) {
	            out += code.charAt(i);
	        }
	        else if (c > 0x07FF) {
	            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
	            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	        }
	        else {
	            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
	            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	        }
	    }
	    return out;
	};

	exports.UtF16TO8 = UtF16TO8;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
