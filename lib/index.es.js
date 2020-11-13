import require$$0 from 'crypto';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var core = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory();
    }
  })(commonjsGlobal, function () {
    /*globals window, global, require*/

    /**
     * CryptoJS core components.
     */
    var CryptoJS = CryptoJS || function (Math, undefined$1) {
      var crypto; // Native crypto from window (Browser)

      if (typeof window !== 'undefined' && window.crypto) {
        crypto = window.crypto;
      } // Native (experimental IE 11) crypto from window (Browser)


      if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
        crypto = window.msCrypto;
      } // Native crypto from global (NodeJS)


      if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
        crypto = commonjsGlobal.crypto;
      } // Native crypto import via require (NodeJS)


      if (!crypto && typeof commonjsRequire === 'function') {
        try {
          crypto = require$$0;
        } catch (err) {}
      }
      /*
       * Cryptographically secure pseudorandom number generator
       *
       * As Math.random() is cryptographically not safe to use
       */


      var cryptoSecureRandomInt = function cryptoSecureRandomInt() {
        if (crypto) {
          // Use getRandomValues method (Browser)
          if (typeof crypto.getRandomValues === 'function') {
            try {
              return crypto.getRandomValues(new Uint32Array(1))[0];
            } catch (err) {}
          } // Use randomBytes method (NodeJS)


          if (typeof crypto.randomBytes === 'function') {
            try {
              return crypto.randomBytes(4).readInt32LE();
            } catch (err) {}
          }
        }

        throw new Error('Native crypto module could not be used to get secure random number.');
      };
      /*
       * Local polyfill of Object.create
        */


      var create = Object.create || function () {
        function F() {}

        return function (obj) {
          var subtype;
          F.prototype = obj;
          subtype = new F();
          F.prototype = null;
          return subtype;
        };
      }();
      /**
       * CryptoJS namespace.
       */


      var C = {};
      /**
       * Library namespace.
       */

      var C_lib = C.lib = {};
      /**
       * Base object for prototypal inheritance.
       */

      var Base = C_lib.Base = function () {
        return {
          /**
           * Creates a new object that inherits from this object.
           *
           * @param {Object} overrides Properties to copy into the new object.
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         field: 'value',
           *
           *         method: function () {
           *         }
           *     });
           */
          extend: function extend(overrides) {
            // Spawn
            var subtype = create(this); // Augment

            if (overrides) {
              subtype.mixIn(overrides);
            } // Create default initializer


            if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
              subtype.init = function () {
                subtype.$super.init.apply(this, arguments);
              };
            } // Initializer's prototype is the subtype object


            subtype.init.prototype = subtype; // Reference supertype

            subtype.$super = this;
            return subtype;
          },

          /**
           * Extends this object and runs the init method.
           * Arguments to create() will be passed to init().
           *
           * @return {Object} The new object.
           *
           * @static
           *
           * @example
           *
           *     var instance = MyType.create();
           */
          create: function create() {
            var instance = this.extend();
            instance.init.apply(instance, arguments);
            return instance;
          },

          /**
           * Initializes a newly created object.
           * Override this method to add some logic when your objects are created.
           *
           * @example
           *
           *     var MyType = CryptoJS.lib.Base.extend({
           *         init: function () {
           *             // ...
           *         }
           *     });
           */
          init: function init() {},

          /**
           * Copies properties into this object.
           *
           * @param {Object} properties The properties to mix in.
           *
           * @example
           *
           *     MyType.mixIn({
           *         field: 'value'
           *     });
           */
          mixIn: function mixIn(properties) {
            for (var propertyName in properties) {
              if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
              }
            } // IE won't copy toString using the loop above


            if (properties.hasOwnProperty('toString')) {
              this.toString = properties.toString;
            }
          },

          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = instance.clone();
           */
          clone: function clone() {
            return this.init.prototype.extend(this);
          }
        };
      }();
      /**
       * An array of 32-bit words.
       *
       * @property {Array} words The array of 32-bit words.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */


      var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function init(words, sigBytes) {
          words = this.words = words || [];

          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 4;
          }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function toString(encoder) {
          return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function concat(wordArray) {
          // Shortcuts
          var thisWords = this.words;
          var thatWords = wordArray.words;
          var thisSigBytes = this.sigBytes;
          var thatSigBytes = wordArray.sigBytes; // Clamp excess bits

          this.clamp(); // Concat

          if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (var i = 0; i < thatSigBytes; i++) {
              var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
            }
          } else {
            // Copy one word at a time
            for (var i = 0; i < thatSigBytes; i += 4) {
              thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
            }
          }

          this.sigBytes += thatSigBytes; // Chainable

          return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function clamp() {
          // Shortcuts
          var words = this.words;
          var sigBytes = this.sigBytes; // Clamp

          words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
          words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function clone() {
          var clone = Base.clone.call(this);
          clone.words = this.words.slice(0);
          return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function random(nBytes) {
          var words = [];

          for (var i = 0; i < nBytes; i += 4) {
            words.push(cryptoSecureRandomInt());
          }

          return new WordArray.init(words, nBytes);
        }
      });
      /**
       * Encoder namespace.
       */

      var C_enc = C.enc = {};
      /**
       * Hex encoding strategy.
       */

      var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes; // Convert

          var hexChars = [];

          for (var i = 0; i < sigBytes; i++) {
            var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
          }

          return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function parse(hexStr) {
          // Shortcut
          var hexStrLength = hexStr.length; // Convert

          var words = [];

          for (var i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
          }

          return new WordArray.init(words, hexStrLength / 2);
        }
      };
      /**
       * Latin1 encoding strategy.
       */

      var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes; // Convert

          var latin1Chars = [];

          for (var i = 0; i < sigBytes; i++) {
            var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
          }

          return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function parse(latin1Str) {
          // Shortcut
          var latin1StrLength = latin1Str.length; // Convert

          var words = [];

          for (var i = 0; i < latin1StrLength; i++) {
            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
          }

          return new WordArray.init(words, latin1StrLength);
        }
      };
      /**
       * UTF-8 encoding strategy.
       */

      var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
          } catch (e) {
            throw new Error('Malformed UTF-8 data');
          }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function parse(utf8Str) {
          return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
      };
      /**
       * Abstract buffered block algorithm template.
       *
       * The property blockSize must be implemented in a concrete subtype.
       *
       * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
       */

      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function reset() {
          // Initial values
          this._data = new WordArray.init();
          this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function _append(data) {
          // Convert string to WordArray, else assume WordArray already
          if (typeof data == 'string') {
            data = Utf8.parse(data);
          } // Append


          this._data.concat(data);

          this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function _process(doFlush) {
          var processedWords; // Shortcuts

          var data = this._data;
          var dataWords = data.words;
          var dataSigBytes = data.sigBytes;
          var blockSize = this.blockSize;
          var blockSizeBytes = blockSize * 4; // Count blocks ready

          var nBlocksReady = dataSigBytes / blockSizeBytes;

          if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
          } else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
          } // Count words ready


          var nWordsReady = nBlocksReady * blockSize; // Count bytes ready

          var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes); // Process blocks

          if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
              // Perform concrete-algorithm logic
              this._doProcessBlock(dataWords, offset);
            } // Remove processed words


            processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
          } // Return processed words


          return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function clone() {
          var clone = Base.clone.call(this);
          clone._data = this._data.clone();
          return clone;
        },
        _minBufferSize: 0
      });
      /**
       * Abstract hasher template.
       *
       * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
       */

      var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function init(cfg) {
          // Apply config defaults
          this.cfg = this.cfg.extend(cfg); // Set initial values

          this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function reset() {
          // Reset data buffer
          BufferedBlockAlgorithm.reset.call(this); // Perform concrete-hasher logic

          this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function update(messageUpdate) {
          // Append
          this._append(messageUpdate); // Update the hash


          this._process(); // Chainable


          return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function finalize(messageUpdate) {
          // Final message update
          if (messageUpdate) {
            this._append(messageUpdate);
          } // Perform concrete-hasher logic


          var hash = this._doFinalize();

          return hash;
        },
        blockSize: 512 / 32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function _createHelper(hasher) {
          return function (message, cfg) {
            return new hasher.init(cfg).finalize(message);
          };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function _createHmacHelper(hasher) {
          return function (message, key) {
            return new C_algo.HMAC.init(hasher, key).finalize(message);
          };
        }
      });
      /**
       * Algorithm namespace.
       */

      var C_algo = C.algo = {};
      return C;
    }(Math);

    return CryptoJS;
  });
});

var x64Core = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var X32WordArray = C_lib.WordArray;
      /**
       * x64 namespace.
       */

      var C_x64 = C.x64 = {};
      /**
       * A 64-bit word.
       */

      var X64Word = C_x64.Word = Base.extend({
        /**
         * Initializes a newly created 64-bit word.
         *
         * @param {number} high The high 32 bits.
         * @param {number} low The low 32 bits.
         *
         * @example
         *
         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
         */
        init: function init(high, low) {
          this.high = high;
          this.low = low;
        }
        /**
         * Bitwise NOTs this word.
         *
         * @return {X64Word} A new x64-Word object after negating.
         *
         * @example
         *
         *     var negated = x64Word.not();
         */
        // not: function () {
        // var high = ~this.high;
        // var low = ~this.low;
        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ANDs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to AND with this word.
         *
         * @return {X64Word} A new x64-Word object after ANDing.
         *
         * @example
         *
         *     var anded = x64Word.and(anotherX64Word);
         */
        // and: function (word) {
        // var high = this.high & word.high;
        // var low = this.low & word.low;
        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to OR with this word.
         *
         * @return {X64Word} A new x64-Word object after ORing.
         *
         * @example
         *
         *     var ored = x64Word.or(anotherX64Word);
         */
        // or: function (word) {
        // var high = this.high | word.high;
        // var low = this.low | word.low;
        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise XORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to XOR with this word.
         *
         * @return {X64Word} A new x64-Word object after XORing.
         *
         * @example
         *
         *     var xored = x64Word.xor(anotherX64Word);
         */
        // xor: function (word) {
        // var high = this.high ^ word.high;
        // var low = this.low ^ word.low;
        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the left.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftL(25);
         */
        // shiftL: function (n) {
        // if (n < 32) {
        // var high = (this.high << n) | (this.low >>> (32 - n));
        // var low = this.low << n;
        // } else {
        // var high = this.low << (n - 32);
        // var low = 0;
        // }
        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the right.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftR(7);
         */
        // shiftR: function (n) {
        // if (n < 32) {
        // var low = (this.low >>> n) | (this.high << (32 - n));
        // var high = this.high >>> n;
        // } else {
        // var low = this.high >>> (n - 32);
        // var high = 0;
        // }
        // return X64Word.create(high, low);
        // },

        /**
         * Rotates this word n bits to the left.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotL(25);
         */
        // rotL: function (n) {
        // return this.shiftL(n).or(this.shiftR(64 - n));
        // },

        /**
         * Rotates this word n bits to the right.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotR(7);
         */
        // rotR: function (n) {
        // return this.shiftR(n).or(this.shiftL(64 - n));
        // },

        /**
         * Adds this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to add with this word.
         *
         * @return {X64Word} A new x64-Word object after adding.
         *
         * @example
         *
         *     var added = x64Word.add(anotherX64Word);
         */
        // add: function (word) {
        // var low = (this.low + word.low) | 0;
        // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
        // var high = (this.high + word.high + carry) | 0;
        // return X64Word.create(high, low);
        // }

      });
      /**
       * An array of 64-bit words.
       *
       * @property {Array} words The array of CryptoJS.x64.Word objects.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */

      var X64WordArray = C_x64.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.x64.WordArray.create();
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ]);
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ], 10);
         */
        init: function init(words, sigBytes) {
          words = this.words = words || [];

          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 8;
          }
        },

        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        toX32: function toX32() {
          // Shortcuts
          var x64Words = this.words;
          var x64WordsLength = x64Words.length; // Convert

          var x32Words = [];

          for (var i = 0; i < x64WordsLength; i++) {
            var x64Word = x64Words[i];
            x32Words.push(x64Word.high);
            x32Words.push(x64Word.low);
          }

          return X32WordArray.create(x32Words, this.sigBytes);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {X64WordArray} The clone.
         *
         * @example
         *
         *     var clone = x64WordArray.clone();
         */
        clone: function clone() {
          var clone = Base.clone.call(this); // Clone "words" array

          var words = clone.words = this.words.slice(0); // Clone each X64Word object

          var wordsLength = words.length;

          for (var i = 0; i < wordsLength; i++) {
            words[i] = words[i].clone();
          }

          return clone;
        }
      });
    })();

    return CryptoJS;
  });
});

var libTypedarrays = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Check if typed arrays are supported
      if (typeof ArrayBuffer != 'function') {
        return;
      } // Shortcuts


      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray; // Reference original init

      var superInit = WordArray.init; // Augment WordArray.init to handle typed arrays

      var subInit = WordArray.init = function (typedArray) {
        // Convert buffers to uint8
        if (typedArray instanceof ArrayBuffer) {
          typedArray = new Uint8Array(typedArray);
        } // Convert other array views to uint8


        if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
          typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        } // Handle Uint8Array


        if (typedArray instanceof Uint8Array) {
          // Shortcut
          var typedArrayByteLength = typedArray.byteLength; // Extract bytes

          var words = [];

          for (var i = 0; i < typedArrayByteLength; i++) {
            words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
          } // Initialize this word array


          superInit.call(this, words, typedArrayByteLength);
        } else {
          // Else call normal init
          superInit.apply(this, arguments);
        }
      };

      subInit.prototype = WordArray;
    })();

    return CryptoJS.lib.WordArray;
  });
});

var encUtf16 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C.enc;
      /**
       * UTF-16 BE encoding strategy.
       */

      var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
        /**
         * Converts a word array to a UTF-16 BE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 BE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes; // Convert

          var utf16Chars = [];

          for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff;
            utf16Chars.push(String.fromCharCode(codePoint));
          }

          return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 BE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 BE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
         */
        parse: function parse(utf16Str) {
          // Shortcut
          var utf16StrLength = utf16Str.length; // Convert

          var words = [];

          for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
          }

          return WordArray.create(words, utf16StrLength * 2);
        }
      };
      /**
       * UTF-16 LE encoding strategy.
       */

      C_enc.Utf16LE = {
        /**
         * Converts a word array to a UTF-16 LE string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 LE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes; // Convert

          var utf16Chars = [];

          for (var i = 0; i < sigBytes; i += 2) {
            var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff);
            utf16Chars.push(String.fromCharCode(codePoint));
          }

          return utf16Chars.join('');
        },

        /**
         * Converts a UTF-16 LE string to a word array.
         *
         * @param {string} utf16Str The UTF-16 LE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
         */
        parse: function parse(utf16Str) {
          // Shortcut
          var utf16StrLength = utf16Str.length; // Convert

          var words = [];

          for (var i = 0; i < utf16StrLength; i++) {
            words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
          }

          return WordArray.create(words, utf16StrLength * 2);
        }
      };

      function swapEndian(word) {
        return word << 8 & 0xff00ff00 | word >>> 8 & 0x00ff00ff;
      }
    })();

    return CryptoJS.enc.Utf16;
  });
});

var encBase64 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C.enc;
      /**
       * Base64 encoding strategy.
       */

      var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function stringify(wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var map = this._map; // Clamp excess bits

          wordArray.clamp(); // Convert

          var base64Chars = [];

          for (var i = 0; i < sigBytes; i += 3) {
            var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
            var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
            var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
            var triplet = byte1 << 16 | byte2 << 8 | byte3;

            for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
              base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
            }
          } // Add padding


          var paddingChar = map.charAt(64);

          if (paddingChar) {
            while (base64Chars.length % 4) {
              base64Chars.push(paddingChar);
            }
          }

          return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function parse(base64Str) {
          // Shortcuts
          var base64StrLength = base64Str.length;
          var map = this._map;
          var reverseMap = this._reverseMap;

          if (!reverseMap) {
            reverseMap = this._reverseMap = [];

            for (var j = 0; j < map.length; j++) {
              reverseMap[map.charCodeAt(j)] = j;
            }
          } // Ignore padding


          var paddingChar = map.charAt(64);

          if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);

            if (paddingIndex !== -1) {
              base64StrLength = paddingIndex;
            }
          } // Convert


          return parseLoop(base64Str, base64StrLength, reverseMap);
        },
        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      };

      function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;

        for (var i = 0; i < base64StrLength; i++) {
          if (i % 4) {
            var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
            var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
            var bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
            nBytes++;
          }
        }

        return WordArray.create(words, nBytes);
      }
    })();

    return CryptoJS.enc.Base64;
  });
});

var md5 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo; // Constants table

      var T = []; // Compute constants

      (function () {
        for (var i = 0; i < 64; i++) {
          T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
        }
      })();
      /**
       * MD5 hash algorithm.
       */


      var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Swap endian
          for (var i = 0; i < 16; i++) {
            // Shortcuts
            var offset_i = offset + i;
            var M_offset_i = M[offset_i];
            M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
          } // Shortcuts


          var H = this._hash.words;
          var M_offset_0 = M[offset + 0];
          var M_offset_1 = M[offset + 1];
          var M_offset_2 = M[offset + 2];
          var M_offset_3 = M[offset + 3];
          var M_offset_4 = M[offset + 4];
          var M_offset_5 = M[offset + 5];
          var M_offset_6 = M[offset + 6];
          var M_offset_7 = M[offset + 7];
          var M_offset_8 = M[offset + 8];
          var M_offset_9 = M[offset + 9];
          var M_offset_10 = M[offset + 10];
          var M_offset_11 = M[offset + 11];
          var M_offset_12 = M[offset + 12];
          var M_offset_13 = M[offset + 13];
          var M_offset_14 = M[offset + 14];
          var M_offset_15 = M[offset + 15]; // Working varialbes

          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3]; // Computation

          a = FF(a, b, c, d, M_offset_0, 7, T[0]);
          d = FF(d, a, b, c, M_offset_1, 12, T[1]);
          c = FF(c, d, a, b, M_offset_2, 17, T[2]);
          b = FF(b, c, d, a, M_offset_3, 22, T[3]);
          a = FF(a, b, c, d, M_offset_4, 7, T[4]);
          d = FF(d, a, b, c, M_offset_5, 12, T[5]);
          c = FF(c, d, a, b, M_offset_6, 17, T[6]);
          b = FF(b, c, d, a, M_offset_7, 22, T[7]);
          a = FF(a, b, c, d, M_offset_8, 7, T[8]);
          d = FF(d, a, b, c, M_offset_9, 12, T[9]);
          c = FF(c, d, a, b, M_offset_10, 17, T[10]);
          b = FF(b, c, d, a, M_offset_11, 22, T[11]);
          a = FF(a, b, c, d, M_offset_12, 7, T[12]);
          d = FF(d, a, b, c, M_offset_13, 12, T[13]);
          c = FF(c, d, a, b, M_offset_14, 17, T[14]);
          b = FF(b, c, d, a, M_offset_15, 22, T[15]);
          a = GG(a, b, c, d, M_offset_1, 5, T[16]);
          d = GG(d, a, b, c, M_offset_6, 9, T[17]);
          c = GG(c, d, a, b, M_offset_11, 14, T[18]);
          b = GG(b, c, d, a, M_offset_0, 20, T[19]);
          a = GG(a, b, c, d, M_offset_5, 5, T[20]);
          d = GG(d, a, b, c, M_offset_10, 9, T[21]);
          c = GG(c, d, a, b, M_offset_15, 14, T[22]);
          b = GG(b, c, d, a, M_offset_4, 20, T[23]);
          a = GG(a, b, c, d, M_offset_9, 5, T[24]);
          d = GG(d, a, b, c, M_offset_14, 9, T[25]);
          c = GG(c, d, a, b, M_offset_3, 14, T[26]);
          b = GG(b, c, d, a, M_offset_8, 20, T[27]);
          a = GG(a, b, c, d, M_offset_13, 5, T[28]);
          d = GG(d, a, b, c, M_offset_2, 9, T[29]);
          c = GG(c, d, a, b, M_offset_7, 14, T[30]);
          b = GG(b, c, d, a, M_offset_12, 20, T[31]);
          a = HH(a, b, c, d, M_offset_5, 4, T[32]);
          d = HH(d, a, b, c, M_offset_8, 11, T[33]);
          c = HH(c, d, a, b, M_offset_11, 16, T[34]);
          b = HH(b, c, d, a, M_offset_14, 23, T[35]);
          a = HH(a, b, c, d, M_offset_1, 4, T[36]);
          d = HH(d, a, b, c, M_offset_4, 11, T[37]);
          c = HH(c, d, a, b, M_offset_7, 16, T[38]);
          b = HH(b, c, d, a, M_offset_10, 23, T[39]);
          a = HH(a, b, c, d, M_offset_13, 4, T[40]);
          d = HH(d, a, b, c, M_offset_0, 11, T[41]);
          c = HH(c, d, a, b, M_offset_3, 16, T[42]);
          b = HH(b, c, d, a, M_offset_6, 23, T[43]);
          a = HH(a, b, c, d, M_offset_9, 4, T[44]);
          d = HH(d, a, b, c, M_offset_12, 11, T[45]);
          c = HH(c, d, a, b, M_offset_15, 16, T[46]);
          b = HH(b, c, d, a, M_offset_2, 23, T[47]);
          a = II(a, b, c, d, M_offset_0, 6, T[48]);
          d = II(d, a, b, c, M_offset_7, 10, T[49]);
          c = II(c, d, a, b, M_offset_14, 15, T[50]);
          b = II(b, c, d, a, M_offset_5, 21, T[51]);
          a = II(a, b, c, d, M_offset_12, 6, T[52]);
          d = II(d, a, b, c, M_offset_3, 10, T[53]);
          c = II(c, d, a, b, M_offset_10, 15, T[54]);
          b = II(b, c, d, a, M_offset_1, 21, T[55]);
          a = II(a, b, c, d, M_offset_8, 6, T[56]);
          d = II(d, a, b, c, M_offset_15, 10, T[57]);
          c = II(c, d, a, b, M_offset_6, 15, T[58]);
          b = II(b, c, d, a, M_offset_13, 21, T[59]);
          a = II(a, b, c, d, M_offset_4, 6, T[60]);
          d = II(d, a, b, c, M_offset_11, 10, T[61]);
          c = II(c, d, a, b, M_offset_2, 15, T[62]);
          b = II(b, c, d, a, M_offset_9, 21, T[63]); // Intermediate hash value

          H[0] = H[0] + a | 0;
          H[1] = H[1] + b | 0;
          H[2] = H[2] + c | 0;
          H[3] = H[3] + d | 0;
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
          var nBitsTotalL = nBitsTotal;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;
          data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

          this._process(); // Shortcuts


          var hash = this._hash;
          var H = hash.words; // Swap endian

          for (var i = 0; i < 4; i++) {
            // Shortcut
            var H_i = H[i];
            H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
          } // Return final computed hash


          return hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });

      function FF(a, b, c, d, x, s, t) {
        var n = a + (b & c | ~b & d) + x + t;
        return (n << s | n >>> 32 - s) + b;
      }

      function GG(a, b, c, d, x, s, t) {
        var n = a + (b & d | c & ~d) + x + t;
        return (n << s | n >>> 32 - s) + b;
      }

      function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return (n << s | n >>> 32 - s) + b;
      }

      function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return (n << s | n >>> 32 - s) + b;
      }
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.MD5('message');
       *     var hash = CryptoJS.MD5(wordArray);
       */


      C.MD5 = Hasher._createHelper(MD5);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacMD5(message, key);
       */

      C.HmacMD5 = Hasher._createHmacHelper(MD5);
    })(Math);

    return CryptoJS.MD5;
  });
});

var sha1 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo; // Reusable object

      var W = [];
      /**
       * SHA-1 hash algorithm.
       */

      var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcut
          var H = this._hash.words; // Working variables

          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];
          var e = H[4]; // Computation

          for (var i = 0; i < 80; i++) {
            if (i < 16) {
              W[i] = M[offset + i] | 0;
            } else {
              var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
              W[i] = n << 1 | n >>> 31;
            }

            var t = (a << 5 | a >>> 27) + e + W[i];

            if (i < 20) {
              t += (b & c | ~b & d) + 0x5a827999;
            } else if (i < 40) {
              t += (b ^ c ^ d) + 0x6ed9eba1;
            } else if (i < 60) {
              t += (b & c | b & d | c & d) - 0x70e44324;
            } else
              /* if (i < 80) */
              {
                t += (b ^ c ^ d) - 0x359d3e2a;
              }

            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
          } // Intermediate hash value


          H[0] = H[0] + a | 0;
          H[1] = H[1] + b | 0;
          H[2] = H[2] + c | 0;
          H[3] = H[3] + d | 0;
          H[4] = H[4] + e | 0;
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4; // Hash final blocks

          this._process(); // Return final computed hash


          return this._hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA1('message');
       *     var hash = CryptoJS.SHA1(wordArray);
       */

      C.SHA1 = Hasher._createHelper(SHA1);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA1(message, key);
       */

      C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    })();

    return CryptoJS.SHA1;
  });
});

var sha256 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo; // Initialization and round constants tables

      var H = [];
      var K = []; // Compute constants

      (function () {
        function isPrime(n) {
          var sqrtN = Math.sqrt(n);

          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n % factor)) {
              return false;
            }
          }

          return true;
        }

        function getFractionalBits(n) {
          return (n - (n | 0)) * 0x100000000 | 0;
        }

        var n = 2;
        var nPrime = 0;

        while (nPrime < 64) {
          if (isPrime(n)) {
            if (nPrime < 8) {
              H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
            }

            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
            nPrime++;
          }

          n++;
        }
      })(); // Reusable object


      var W = [];
      /**
       * SHA-256 hash algorithm.
       */

      var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = new WordArray.init(H.slice(0));
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcut
          var H = this._hash.words; // Working variables

          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];
          var e = H[4];
          var f = H[5];
          var g = H[6];
          var h = H[7]; // Computation

          for (var i = 0; i < 64; i++) {
            if (i < 16) {
              W[i] = M[offset + i] | 0;
            } else {
              var gamma0x = W[i - 15];
              var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
              var gamma1x = W[i - 2];
              var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
              W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
            }

            var ch = e & f ^ ~e & g;
            var maj = a & b ^ a & c ^ b & c;
            var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
            var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
            var t1 = h + sigma1 + ch + K[i] + W[i];
            var t2 = sigma0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          } // Intermediate hash value


          H[0] = H[0] + a | 0;
          H[1] = H[1] + b | 0;
          H[2] = H[2] + c | 0;
          H[3] = H[3] + d | 0;
          H[4] = H[4] + e | 0;
          H[5] = H[5] + f | 0;
          H[6] = H[6] + g | 0;
          H[7] = H[7] + h | 0;
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4; // Hash final blocks

          this._process(); // Return final computed hash


          return this._hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA256('message');
       *     var hash = CryptoJS.SHA256(wordArray);
       */

      C.SHA256 = Hasher._createHelper(SHA256);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA256(message, key);
       */

      C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    })(Math);

    return CryptoJS.SHA256;
  });
});

var sha224 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, sha256);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var SHA256 = C_algo.SHA256;
      /**
       * SHA-224 hash algorithm.
       */

      var SHA224 = C_algo.SHA224 = SHA256.extend({
        _doReset: function _doReset() {
          this._hash = new WordArray.init([0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]);
        },
        _doFinalize: function _doFinalize() {
          var hash = SHA256._doFinalize.call(this);

          hash.sigBytes -= 4;
          return hash;
        }
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA224('message');
       *     var hash = CryptoJS.SHA224(wordArray);
       */

      C.SHA224 = SHA256._createHelper(SHA224);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA224(message, key);
       */

      C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
    })();

    return CryptoJS.SHA224;
  });
});

var sha512 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, x64Core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Hasher = C_lib.Hasher;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C.algo;

      function X64Word_create() {
        return X64Word.create.apply(X64Word, arguments);
      } // Constants


      var K = [X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd), X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc), X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019), X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118), X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe), X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2), X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1), X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694), X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3), X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65), X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483), X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5), X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210), X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4), X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725), X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70), X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926), X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df), X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8), X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b), X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001), X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30), X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910), X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8), X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53), X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8), X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb), X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3), X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60), X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec), X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9), X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b), X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207), X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178), X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6), X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b), X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493), X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c), X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a), X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)]; // Reusable objects

      var W = [];

      (function () {
        for (var i = 0; i < 80; i++) {
          W[i] = X64Word_create();
        }
      })();
      /**
       * SHA-512 hash algorithm.
       */


      var SHA512 = C_algo.SHA512 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = new X64WordArray.init([new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b), new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1), new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f), new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)]);
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcuts
          var H = this._hash.words;
          var H0 = H[0];
          var H1 = H[1];
          var H2 = H[2];
          var H3 = H[3];
          var H4 = H[4];
          var H5 = H[5];
          var H6 = H[6];
          var H7 = H[7];
          var H0h = H0.high;
          var H0l = H0.low;
          var H1h = H1.high;
          var H1l = H1.low;
          var H2h = H2.high;
          var H2l = H2.low;
          var H3h = H3.high;
          var H3l = H3.low;
          var H4h = H4.high;
          var H4l = H4.low;
          var H5h = H5.high;
          var H5l = H5.low;
          var H6h = H6.high;
          var H6l = H6.low;
          var H7h = H7.high;
          var H7l = H7.low; // Working variables

          var ah = H0h;
          var al = H0l;
          var bh = H1h;
          var bl = H1l;
          var ch = H2h;
          var cl = H2l;
          var dh = H3h;
          var dl = H3l;
          var eh = H4h;
          var el = H4l;
          var fh = H5h;
          var fl = H5l;
          var gh = H6h;
          var gl = H6l;
          var hh = H7h;
          var hl = H7l; // Rounds

          for (var i = 0; i < 80; i++) {
            var Wil;
            var Wih; // Shortcut

            var Wi = W[i]; // Extend message

            if (i < 16) {
              Wih = Wi.high = M[offset + i * 2] | 0;
              Wil = Wi.low = M[offset + i * 2 + 1] | 0;
            } else {
              // Gamma0
              var gamma0x = W[i - 15];
              var gamma0xh = gamma0x.high;
              var gamma0xl = gamma0x.low;
              var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
              var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25); // Gamma1

              var gamma1x = W[i - 2];
              var gamma1xh = gamma1x.high;
              var gamma1xl = gamma1x.low;
              var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
              var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26); // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]

              var Wi7 = W[i - 7];
              var Wi7h = Wi7.high;
              var Wi7l = Wi7.low;
              var Wi16 = W[i - 16];
              var Wi16h = Wi16.high;
              var Wi16l = Wi16.low;
              Wil = gamma0l + Wi7l;
              Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
              Wil = Wil + gamma1l;
              Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
              Wil = Wil + Wi16l;
              Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
              Wi.high = Wih;
              Wi.low = Wil;
            }

            var chh = eh & fh ^ ~eh & gh;
            var chl = el & fl ^ ~el & gl;
            var majh = ah & bh ^ ah & ch ^ bh & ch;
            var majl = al & bl ^ al & cl ^ bl & cl;
            var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
            var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
            var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
            var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9); // t1 = h + sigma1 + ch + K[i] + W[i]

            var Ki = K[i];
            var Kih = Ki.high;
            var Kil = Ki.low;
            var t1l = hl + sigma1l;
            var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
            var t1l = t1l + chl;
            var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
            var t1l = t1l + Kil;
            var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
            var t1l = t1l + Wil;
            var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0); // t2 = sigma0 + maj

            var t2l = sigma0l + majl;
            var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0); // Update working variables

            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = dl + t1l | 0;
            eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = t1l + t2l | 0;
            ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
          } // Intermediate hash value


          H0l = H0.low = H0l + al;
          H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
          H1l = H1.low = H1l + bl;
          H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
          H2l = H2.low = H2l + cl;
          H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
          H3l = H3.low = H3l + dl;
          H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
          H4l = H4.low = H4l + el;
          H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
          H5l = H5.low = H5l + fl;
          H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
          H6l = H6.low = H6l + gl;
          H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
          H7l = H7.low = H7l + hl;
          H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
          data.sigBytes = dataWords.length * 4; // Hash final blocks

          this._process(); // Convert hash to 32-bit word array before returning


          var hash = this._hash.toX32(); // Return final computed hash


          return hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        },
        blockSize: 1024 / 32
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA512('message');
       *     var hash = CryptoJS.SHA512(wordArray);
       */

      C.SHA512 = Hasher._createHelper(SHA512);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA512(message, key);
       */

      C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
    })();

    return CryptoJS.SHA512;
  });
});

var sha384 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, x64Core, sha512);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C.algo;
      var SHA512 = C_algo.SHA512;
      /**
       * SHA-384 hash algorithm.
       */

      var SHA384 = C_algo.SHA384 = SHA512.extend({
        _doReset: function _doReset() {
          this._hash = new X64WordArray.init([new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507), new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939), new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511), new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)]);
        },
        _doFinalize: function _doFinalize() {
          var hash = SHA512._doFinalize.call(this);

          hash.sigBytes -= 16;
          return hash;
        }
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA384('message');
       *     var hash = CryptoJS.SHA384(wordArray);
       */

      C.SHA384 = SHA512._createHelper(SHA384);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA384(message, key);
       */

      C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
    })();

    return CryptoJS.SHA384;
  });
});

var sha3 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, x64Core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var C_algo = C.algo; // Constants tables

      var RHO_OFFSETS = [];
      var PI_INDEXES = [];
      var ROUND_CONSTANTS = []; // Compute Constants

      (function () {
        // Compute rho offset constants
        var x = 1,
            y = 0;

        for (var t = 0; t < 24; t++) {
          RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
          var newX = y % 5;
          var newY = (2 * x + 3 * y) % 5;
          x = newX;
          y = newY;
        } // Compute pi index constants


        for (var x = 0; x < 5; x++) {
          for (var y = 0; y < 5; y++) {
            PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
          }
        } // Compute round constants


        var LFSR = 0x01;

        for (var i = 0; i < 24; i++) {
          var roundConstantMsw = 0;
          var roundConstantLsw = 0;

          for (var j = 0; j < 7; j++) {
            if (LFSR & 0x01) {
              var bitPosition = (1 << j) - 1;

              if (bitPosition < 32) {
                roundConstantLsw ^= 1 << bitPosition;
              } else
                /* if (bitPosition >= 32) */
                {
                  roundConstantMsw ^= 1 << bitPosition - 32;
                }
            } // Compute next LFSR


            if (LFSR & 0x80) {
              // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
              LFSR = LFSR << 1 ^ 0x71;
            } else {
              LFSR <<= 1;
            }
          }

          ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
        }
      })(); // Reusable objects for temporary values


      var T = [];

      (function () {
        for (var i = 0; i < 25; i++) {
          T[i] = X64Word.create();
        }
      })();
      /**
       * SHA-3 hash algorithm.
       */


      var SHA3 = C_algo.SHA3 = Hasher.extend({
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   Only values permitted are: 224, 256, 384, 512.
         *   Default: 512
         */
        cfg: Hasher.cfg.extend({
          outputLength: 512
        }),
        _doReset: function _doReset() {
          var state = this._state = [];

          for (var i = 0; i < 25; i++) {
            state[i] = new X64Word.init();
          }

          this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcuts
          var state = this._state;
          var nBlockSizeLanes = this.blockSize / 2; // Absorb

          for (var i = 0; i < nBlockSizeLanes; i++) {
            // Shortcuts
            var M2i = M[offset + 2 * i];
            var M2i1 = M[offset + 2 * i + 1]; // Swap endian

            M2i = (M2i << 8 | M2i >>> 24) & 0x00ff00ff | (M2i << 24 | M2i >>> 8) & 0xff00ff00;
            M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 0x00ff00ff | (M2i1 << 24 | M2i1 >>> 8) & 0xff00ff00; // Absorb message into state

            var lane = state[i];
            lane.high ^= M2i1;
            lane.low ^= M2i;
          } // Rounds


          for (var round = 0; round < 24; round++) {
            // Theta
            for (var x = 0; x < 5; x++) {
              // Mix column lanes
              var tMsw = 0,
                  tLsw = 0;

              for (var y = 0; y < 5; y++) {
                var lane = state[x + 5 * y];
                tMsw ^= lane.high;
                tLsw ^= lane.low;
              } // Temporary values


              var Tx = T[x];
              Tx.high = tMsw;
              Tx.low = tLsw;
            }

            for (var x = 0; x < 5; x++) {
              // Shortcuts
              var Tx4 = T[(x + 4) % 5];
              var Tx1 = T[(x + 1) % 5];
              var Tx1Msw = Tx1.high;
              var Tx1Lsw = Tx1.low; // Mix surrounding columns

              var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
              var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);

              for (var y = 0; y < 5; y++) {
                var lane = state[x + 5 * y];
                lane.high ^= tMsw;
                lane.low ^= tLsw;
              }
            } // Rho Pi


            for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
              var tMsw;
              var tLsw; // Shortcuts

              var lane = state[laneIndex];
              var laneMsw = lane.high;
              var laneLsw = lane.low;
              var rhoOffset = RHO_OFFSETS[laneIndex]; // Rotate lanes

              if (rhoOffset < 32) {
                tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
              } else
                /* if (rhoOffset >= 32) */
                {
                  tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                  tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                } // Transpose lanes


              var TPiLane = T[PI_INDEXES[laneIndex]];
              TPiLane.high = tMsw;
              TPiLane.low = tLsw;
            } // Rho pi at x = y = 0


            var T0 = T[0];
            var state0 = state[0];
            T0.high = state0.high;
            T0.low = state0.low; // Chi

            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                // Shortcuts
                var laneIndex = x + 5 * y;
                var lane = state[laneIndex];
                var TLane = T[laneIndex];
                var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                var Tx2Lane = T[(x + 2) % 5 + 5 * y]; // Mix rows

                lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
              }
            } // Iota


            var lane = state[0];
            var roundConstant = ROUND_CONSTANTS[round];
            lane.high ^= roundConstant.high;
            lane.low ^= roundConstant.low;
          }
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          var blockSizeBits = this.blockSize * 32; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x1 << 24 - nBitsLeft % 32;
          dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 0x80;
          data.sigBytes = dataWords.length * 4; // Hash final blocks

          this._process(); // Shortcuts


          var state = this._state;
          var outputLengthBytes = this.cfg.outputLength / 8;
          var outputLengthLanes = outputLengthBytes / 8; // Squeeze

          var hashWords = [];

          for (var i = 0; i < outputLengthLanes; i++) {
            // Shortcuts
            var lane = state[i];
            var laneMsw = lane.high;
            var laneLsw = lane.low; // Swap endian

            laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 0x00ff00ff | (laneMsw << 24 | laneMsw >>> 8) & 0xff00ff00;
            laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 0x00ff00ff | (laneLsw << 24 | laneLsw >>> 8) & 0xff00ff00; // Squeeze state to retrieve hash

            hashWords.push(laneLsw);
            hashWords.push(laneMsw);
          } // Return final computed hash


          return new WordArray.init(hashWords, outputLengthBytes);
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);

          var state = clone._state = this._state.slice(0);

          for (var i = 0; i < 25; i++) {
            state[i] = state[i].clone();
          }

          return clone;
        }
      });
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA3('message');
       *     var hash = CryptoJS.SHA3(wordArray);
       */

      C.SHA3 = Hasher._createHelper(SHA3);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA3(message, key);
       */

      C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
    })(Math);

    return CryptoJS.SHA3;
  });
});

var ripemd160 = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /** @preserve
    (c) 2012 by Cédric Mesnil. All rights reserved.
    	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
    	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo; // Constants table

      var _zl = WordArray.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);

      var _zr = WordArray.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);

      var _sl = WordArray.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);

      var _sr = WordArray.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

      var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);

      var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);
      /**
       * RIPEMD160 hash algorithm.
       */


      var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
        _doReset: function _doReset() {
          this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Swap endian
          for (var i = 0; i < 16; i++) {
            // Shortcuts
            var offset_i = offset + i;
            var M_offset_i = M[offset_i]; // Swap

            M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
          } // Shortcut


          var H = this._hash.words;
          var hl = _hl.words;
          var hr = _hr.words;
          var zl = _zl.words;
          var zr = _zr.words;
          var sl = _sl.words;
          var sr = _sr.words; // Working variables

          var al, bl, cl, dl, el;
          var ar, br, cr, dr, er;
          ar = al = H[0];
          br = bl = H[1];
          cr = cl = H[2];
          dr = dl = H[3];
          er = el = H[4]; // Computation

          var t;

          for (var i = 0; i < 80; i += 1) {
            t = al + M[offset + zl[i]] | 0;

            if (i < 16) {
              t += f1(bl, cl, dl) + hl[0];
            } else if (i < 32) {
              t += f2(bl, cl, dl) + hl[1];
            } else if (i < 48) {
              t += f3(bl, cl, dl) + hl[2];
            } else if (i < 64) {
              t += f4(bl, cl, dl) + hl[3];
            } else {
              // if (i<80) {
              t += f5(bl, cl, dl) + hl[4];
            }

            t = t | 0;
            t = rotl(t, sl[i]);
            t = t + el | 0;
            al = el;
            el = dl;
            dl = rotl(cl, 10);
            cl = bl;
            bl = t;
            t = ar + M[offset + zr[i]] | 0;

            if (i < 16) {
              t += f5(br, cr, dr) + hr[0];
            } else if (i < 32) {
              t += f4(br, cr, dr) + hr[1];
            } else if (i < 48) {
              t += f3(br, cr, dr) + hr[2];
            } else if (i < 64) {
              t += f2(br, cr, dr) + hr[3];
            } else {
              // if (i<80) {
              t += f1(br, cr, dr) + hr[4];
            }

            t = t | 0;
            t = rotl(t, sr[i]);
            t = t + er | 0;
            ar = er;
            er = dr;
            dr = rotl(cr, 10);
            cr = br;
            br = t;
          } // Intermediate hash value


          t = H[1] + cl + dr | 0;
          H[1] = H[2] + dl + er | 0;
          H[2] = H[3] + el + ar | 0;
          H[3] = H[4] + al + br | 0;
          H[4] = H[0] + bl + cr | 0;
          H[0] = t;
        },
        _doFinalize: function _doFinalize() {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8; // Add padding

          dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;
          data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

          this._process(); // Shortcuts


          var hash = this._hash;
          var H = hash.words; // Swap endian

          for (var i = 0; i < 5; i++) {
            // Shortcut
            var H_i = H[i]; // Swap

            H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
          } // Return final computed hash


          return hash;
        },
        clone: function clone() {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();
          return clone;
        }
      });

      function f1(x, y, z) {
        return x ^ y ^ z;
      }

      function f2(x, y, z) {
        return x & y | ~x & z;
      }

      function f3(x, y, z) {
        return (x | ~y) ^ z;
      }

      function f4(x, y, z) {
        return x & z | y & ~z;
      }

      function f5(x, y, z) {
        return x ^ (y | ~z);
      }

      function rotl(x, n) {
        return x << n | x >>> 32 - n;
      }
      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.RIPEMD160('message');
       *     var hash = CryptoJS.RIPEMD160(wordArray);
       */


      C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
       */

      C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
    })();

    return CryptoJS.RIPEMD160;
  });
});

var hmac = createCommonjsModule(function (module, exports) {

  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var C_enc = C.enc;
      var Utf8 = C_enc.Utf8;
      var C_algo = C.algo;
      /**
       * HMAC algorithm.
       */

      var HMAC = C_algo.HMAC = Base.extend({
        /**
         * Initializes a newly created HMAC.
         *
         * @param {Hasher} hasher The hash algorithm to use.
         * @param {WordArray|string} key The secret key.
         *
         * @example
         *
         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
         */
        init: function init(hasher, key) {
          // Init hasher
          hasher = this._hasher = new hasher.init(); // Convert string to WordArray, else assume WordArray already

          if (typeof key == 'string') {
            key = Utf8.parse(key);
          } // Shortcuts


          var hasherBlockSize = hasher.blockSize;
          var hasherBlockSizeBytes = hasherBlockSize * 4; // Allow arbitrary length keys

          if (key.sigBytes > hasherBlockSizeBytes) {
            key = hasher.finalize(key);
          } // Clamp excess bits


          key.clamp(); // Clone key for inner and outer pads

          var oKey = this._oKey = key.clone();
          var iKey = this._iKey = key.clone(); // Shortcuts

          var oKeyWords = oKey.words;
          var iKeyWords = iKey.words; // XOR keys with pad constants

          for (var i = 0; i < hasherBlockSize; i++) {
            oKeyWords[i] ^= 0x5c5c5c5c;
            iKeyWords[i] ^= 0x36363636;
          }

          oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes; // Set initial values

          this.reset();
        },

        /**
         * Resets this HMAC to its initial state.
         *
         * @example
         *
         *     hmacHasher.reset();
         */
        reset: function reset() {
          // Shortcut
          var hasher = this._hasher; // Reset

          hasher.reset();
          hasher.update(this._iKey);
        },

        /**
         * Updates this HMAC with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {HMAC} This HMAC instance.
         *
         * @example
         *
         *     hmacHasher.update('message');
         *     hmacHasher.update(wordArray);
         */
        update: function update(messageUpdate) {
          this._hasher.update(messageUpdate); // Chainable


          return this;
        },

        /**
         * Finalizes the HMAC computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The HMAC.
         *
         * @example
         *
         *     var hmac = hmacHasher.finalize();
         *     var hmac = hmacHasher.finalize('message');
         *     var hmac = hmacHasher.finalize(wordArray);
         */
        finalize: function finalize(messageUpdate) {
          // Shortcut
          var hasher = this._hasher; // Compute HMAC

          var innerHash = hasher.finalize(messageUpdate);
          hasher.reset();
          var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
          return hmac;
        }
      });
    })();
  });
});

var pbkdf2 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, sha1, hmac);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var SHA1 = C_algo.SHA1;
      var HMAC = C_algo.HMAC;
      /**
       * Password-Based Key Derivation Function 2 algorithm.
       */

      var PBKDF2 = C_algo.PBKDF2 = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: SHA1,
          iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.PBKDF2.create();
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
         */
        init: function init(cfg) {
          this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function compute(password, salt) {
          // Shortcut
          var cfg = this.cfg; // Init HMAC

          var hmac = HMAC.create(cfg.hasher, password); // Initial values

          var derivedKey = WordArray.create();
          var blockIndex = WordArray.create([0x00000001]); // Shortcuts

          var derivedKeyWords = derivedKey.words;
          var blockIndexWords = blockIndex.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations; // Generate key

          while (derivedKeyWords.length < keySize) {
            var block = hmac.update(salt).finalize(blockIndex);
            hmac.reset(); // Shortcuts

            var blockWords = block.words;
            var blockWordsLength = blockWords.length; // Iterations

            var intermediate = block;

            for (var i = 1; i < iterations; i++) {
              intermediate = hmac.finalize(intermediate);
              hmac.reset(); // Shortcut

              var intermediateWords = intermediate.words; // XOR intermediate with block

              for (var j = 0; j < blockWordsLength; j++) {
                blockWords[j] ^= intermediateWords[j];
              }
            }

            derivedKey.concat(block);
            blockIndexWords[0]++;
          }

          derivedKey.sigBytes = keySize * 4;
          return derivedKey;
        }
      });
      /**
       * Computes the Password-Based Key Derivation Function 2.
       *
       * @param {WordArray|string} password The password.
       * @param {WordArray|string} salt A salt.
       * @param {Object} cfg (Optional) The configuration options to use for this computation.
       *
       * @return {WordArray} The derived key.
       *
       * @static
       *
       * @example
       *
       *     var key = CryptoJS.PBKDF2(password, salt);
       *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
       *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
       */

      C.PBKDF2 = function (password, salt, cfg) {
        return PBKDF2.create(cfg).compute(password, salt);
      };
    })();

    return CryptoJS.PBKDF2;
  });
});

var evpkdf = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, sha1, hmac);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C.algo;
      var MD5 = C_algo.MD5;
      /**
       * This key derivation function is meant to conform with EVP_BytesToKey.
       * www.openssl.org/docs/crypto/EVP_BytesToKey.html
       */

      var EvpKDF = C_algo.EvpKDF = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: MD5,
          iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.EvpKDF.create();
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
         */
        init: function init(cfg) {
          this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function compute(password, salt) {
          var block; // Shortcut

          var cfg = this.cfg; // Init hasher

          var hasher = cfg.hasher.create(); // Initial values

          var derivedKey = WordArray.create(); // Shortcuts

          var derivedKeyWords = derivedKey.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations; // Generate key

          while (derivedKeyWords.length < keySize) {
            if (block) {
              hasher.update(block);
            }

            block = hasher.update(password).finalize(salt);
            hasher.reset(); // Iterations

            for (var i = 1; i < iterations; i++) {
              block = hasher.finalize(block);
              hasher.reset();
            }

            derivedKey.concat(block);
          }

          derivedKey.sigBytes = keySize * 4;
          return derivedKey;
        }
      });
      /**
       * Derives a key from a password.
       *
       * @param {WordArray|string} password The password.
       * @param {WordArray|string} salt A salt.
       * @param {Object} cfg (Optional) The configuration options to use for this computation.
       *
       * @return {WordArray} The derived key.
       *
       * @static
       *
       * @example
       *
       *     var key = CryptoJS.EvpKDF(password, salt);
       *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
       *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
       */

      C.EvpKDF = function (password, salt, cfg) {
        return EvpKDF.create(cfg).compute(password, salt);
      };
    })();

    return CryptoJS.EvpKDF;
  });
});

var cipherCore = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, evpkdf);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Cipher core components.
     */
    CryptoJS.lib.Cipher || function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
      var C_enc = C.enc;
      var Utf8 = C_enc.Utf8;
      var Base64 = C_enc.Base64;
      var C_algo = C.algo;
      var EvpKDF = C_algo.EvpKDF;
      /**
       * Abstract base cipher template.
       *
       * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
       * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
       * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
       * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
       */

      var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function createEncryptor(key, cfg) {
          return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function createDecryptor(key, cfg) {
          return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function init(xformMode, key, cfg) {
          // Apply config defaults
          this.cfg = this.cfg.extend(cfg); // Store transform mode and key

          this._xformMode = xformMode;
          this._key = key; // Set initial values

          this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function reset() {
          // Reset data buffer
          BufferedBlockAlgorithm.reset.call(this); // Perform concrete-cipher logic

          this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function process(dataUpdate) {
          // Append
          this._append(dataUpdate); // Process available blocks


          return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function finalize(dataUpdate) {
          // Final data update
          if (dataUpdate) {
            this._append(dataUpdate);
          } // Perform concrete-cipher logic


          var finalProcessedData = this._doFinalize();

          return finalProcessedData;
        },
        keySize: 128 / 32,
        ivSize: 128 / 32,
        _ENC_XFORM_MODE: 1,
        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: function () {
          function selectCipherStrategy(key) {
            if (typeof key == 'string') {
              return PasswordBasedCipher;
            } else {
              return SerializableCipher;
            }
          }

          return function (cipher) {
            return {
              encrypt: function encrypt(message, key, cfg) {
                return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
              },
              decrypt: function decrypt(ciphertext, key, cfg) {
                return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
              }
            };
          };
        }()
      });
      /**
       * Abstract base stream cipher template.
       *
       * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
       */

      var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function _doFinalize() {
          // Process partial blocks
          var finalProcessedBlocks = this._process(!!'flush');

          return finalProcessedBlocks;
        },
        blockSize: 1
      });
      /**
       * Mode namespace.
       */

      var C_mode = C.mode = {};
      /**
       * Abstract base block cipher mode template.
       */

      var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function createEncryptor(cipher, iv) {
          return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function createDecryptor(cipher, iv) {
          return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function init(cipher, iv) {
          this._cipher = cipher;
          this._iv = iv;
        }
      });
      /**
       * Cipher Block Chaining mode.
       */

      var CBC = C_mode.CBC = function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();
        /**
         * CBC encryptor.
         */

        CBC.Encryptor = CBC.extend({
          /**
           * Processes the data block at offset.
           *
           * @param {Array} words The data words to operate on.
           * @param {number} offset The offset where the block starts.
           *
           * @example
           *
           *     mode.processBlock(data.words, offset);
           */
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize; // XOR and encrypt

            xorBlock.call(this, words, offset, blockSize);
            cipher.encryptBlock(words, offset); // Remember this block to use with next block

            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });
        /**
         * CBC decryptor.
         */

        CBC.Decryptor = CBC.extend({
          /**
           * Processes the data block at offset.
           *
           * @param {Array} words The data words to operate on.
           * @param {number} offset The offset where the block starts.
           *
           * @example
           *
           *     mode.processBlock(data.words, offset);
           */
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize; // Remember this block to use with next block

            var thisBlock = words.slice(offset, offset + blockSize); // Decrypt and XOR

            cipher.decryptBlock(words, offset);
            xorBlock.call(this, words, offset, blockSize); // This block becomes the previous block

            this._prevBlock = thisBlock;
          }
        });

        function xorBlock(words, offset, blockSize) {
          var block; // Shortcut

          var iv = this._iv; // Choose mixing block

          if (iv) {
            block = iv; // Remove IV for subsequent blocks

            this._iv = undefined$1;
          } else {
            block = this._prevBlock;
          } // XOR blocks


          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= block[i];
          }
        }

        return CBC;
      }();
      /**
       * Padding namespace.
       */


      var C_pad = C.pad = {};
      /**
       * PKCS #5/7 padding strategy.
       */

      var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function pad(data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4; // Count padding bytes

          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Create padding word

          var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes; // Create padding

          var paddingWords = [];

          for (var i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(paddingWord);
          }

          var padding = WordArray.create(paddingWords, nPaddingBytes); // Add padding

          data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function unpad(data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

          data.sigBytes -= nPaddingBytes;
        }
      };
      /**
       * Abstract base block cipher template.
       *
       * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
       */

      var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
          mode: CBC,
          padding: Pkcs7
        }),
        reset: function reset() {
          var modeCreator; // Reset cipher

          Cipher.reset.call(this); // Shortcuts

          var cfg = this.cfg;
          var iv = cfg.iv;
          var mode = cfg.mode; // Reset block mode

          if (this._xformMode == this._ENC_XFORM_MODE) {
            modeCreator = mode.createEncryptor;
          } else
            /* if (this._xformMode == this._DEC_XFORM_MODE) */
            {
              modeCreator = mode.createDecryptor; // Keep at least one block in the buffer for unpadding

              this._minBufferSize = 1;
            }

          if (this._mode && this._mode.__creator == modeCreator) {
            this._mode.init(this, iv && iv.words);
          } else {
            this._mode = modeCreator.call(mode, this, iv && iv.words);
            this._mode.__creator = modeCreator;
          }
        },
        _doProcessBlock: function _doProcessBlock(words, offset) {
          this._mode.processBlock(words, offset);
        },
        _doFinalize: function _doFinalize() {
          var finalProcessedBlocks; // Shortcut

          var padding = this.cfg.padding; // Finalize

          if (this._xformMode == this._ENC_XFORM_MODE) {
            // Pad data
            padding.pad(this._data, this.blockSize); // Process final blocks

            finalProcessedBlocks = this._process(!!'flush');
          } else
            /* if (this._xformMode == this._DEC_XFORM_MODE) */
            {
              // Process final blocks
              finalProcessedBlocks = this._process(!!'flush'); // Unpad data

              padding.unpad(finalProcessedBlocks);
            }

          return finalProcessedBlocks;
        },
        blockSize: 128 / 32
      });
      /**
       * A collection of cipher parameters.
       *
       * @property {WordArray} ciphertext The raw ciphertext.
       * @property {WordArray} key The key to this ciphertext.
       * @property {WordArray} iv The IV used in the ciphering operation.
       * @property {WordArray} salt The salt used with a key derivation function.
       * @property {Cipher} algorithm The cipher algorithm.
       * @property {Mode} mode The block mode used in the ciphering operation.
       * @property {Padding} padding The padding scheme used in the ciphering operation.
       * @property {number} blockSize The block size of the cipher.
       * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
       */

      var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function init(cipherParams) {
          this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function toString(formatter) {
          return (formatter || this.formatter).stringify(this);
        }
      });
      /**
       * Format namespace.
       */

      var C_format = C.format = {};
      /**
       * OpenSSL formatting strategy.
       */

      var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function stringify(cipherParams) {
          var wordArray; // Shortcuts

          var ciphertext = cipherParams.ciphertext;
          var salt = cipherParams.salt; // Format

          if (salt) {
            wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
          } else {
            wordArray = ciphertext;
          }

          return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function parse(openSSLStr) {
          var salt; // Parse base64

          var ciphertext = Base64.parse(openSSLStr); // Shortcut

          var ciphertextWords = ciphertext.words; // Test for salt

          if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
            // Extract salt
            salt = WordArray.create(ciphertextWords.slice(2, 4)); // Remove salt from ciphertext

            ciphertextWords.splice(0, 4);
            ciphertext.sigBytes -= 16;
          }

          return CipherParams.create({
            ciphertext: ciphertext,
            salt: salt
          });
        }
      };
      /**
       * A cipher wrapper that returns ciphertext as a serializable cipher params object.
       */

      var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
          format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function encrypt(cipher, message, key, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg); // Encrypt

          var encryptor = cipher.createEncryptor(key, cfg);
          var ciphertext = encryptor.finalize(message); // Shortcut

          var cipherCfg = encryptor.cfg; // Create and return serializable cipher params

          return CipherParams.create({
            ciphertext: ciphertext,
            key: key,
            iv: cipherCfg.iv,
            algorithm: cipher,
            mode: cipherCfg.mode,
            padding: cipherCfg.padding,
            blockSize: cipher.blockSize,
            formatter: cfg.format
          });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function decrypt(cipher, ciphertext, key, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg); // Convert string to CipherParams

          ciphertext = this._parse(ciphertext, cfg.format); // Decrypt

          var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
          return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function _parse(ciphertext, format) {
          if (typeof ciphertext == 'string') {
            return format.parse(ciphertext, this);
          } else {
            return ciphertext;
          }
        }
      });
      /**
       * Key derivation function namespace.
       */

      var C_kdf = C.kdf = {};
      /**
       * OpenSSL key derivation function.
       */

      var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function execute(password, keySize, ivSize, salt) {
          // Generate random salt
          if (!salt) {
            salt = WordArray.random(64 / 8);
          } // Derive key and IV


          var key = EvpKDF.create({
            keySize: keySize + ivSize
          }).compute(password, salt); // Separate key and IV

          var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
          key.sigBytes = keySize * 4; // Return params

          return CipherParams.create({
            key: key,
            iv: iv,
            salt: salt
          });
        }
      };
      /**
       * A serializable cipher wrapper that derives the key from a password,
       * and returns ciphertext as a serializable cipher params object.
       */

      var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
          kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function encrypt(cipher, message, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg); // Derive key and other params

          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize); // Add IV to config

          cfg.iv = derivedParams.iv; // Encrypt

          var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg); // Mix in derived params

          ciphertext.mixIn(derivedParams);
          return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function decrypt(cipher, ciphertext, password, cfg) {
          // Apply config defaults
          cfg = this.cfg.extend(cfg); // Convert string to CipherParams

          ciphertext = this._parse(ciphertext, cfg.format); // Derive key and other params

          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt); // Add IV to config

          cfg.iv = derivedParams.iv; // Decrypt

          var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
          return plaintext;
        }
      });
    }();
  });
});

var modeCfb = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Cipher Feedback block mode.
     */
    CryptoJS.mode.CFB = function () {
      var CFB = CryptoJS.lib.BlockCipherMode.extend();
      CFB.Encryptor = CFB.extend({
        processBlock: function processBlock(words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // Remember this block to use with next block

          this._prevBlock = words.slice(offset, offset + blockSize);
        }
      });
      CFB.Decryptor = CFB.extend({
        processBlock: function processBlock(words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize; // Remember this block to use with next block

          var thisBlock = words.slice(offset, offset + blockSize);
          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // This block becomes the previous block

          this._prevBlock = thisBlock;
        }
      });

      function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
        var keystream; // Shortcut

        var iv = this._iv; // Generate keystream

        if (iv) {
          keystream = iv.slice(0); // Remove IV for subsequent blocks

          this._iv = undefined;
        } else {
          keystream = this._prevBlock;
        }

        cipher.encryptBlock(keystream, 0); // Encrypt

        for (var i = 0; i < blockSize; i++) {
          words[offset + i] ^= keystream[i];
        }
      }

      return CFB;
    }();

    return CryptoJS.mode.CFB;
  });
});

var modeCtr = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Counter block mode.
     */
    CryptoJS.mode.CTR = function () {
      var CTR = CryptoJS.lib.BlockCipherMode.extend();
      var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function processBlock(words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter; // Generate keystream

          if (iv) {
            counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

            this._iv = undefined;
          }

          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0); // Increment counter

          counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0; // Encrypt

          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });
      CTR.Decryptor = Encryptor;
      return CTR;
    }();

    return CryptoJS.mode.CTR;
  });
});

var modeCtrGladman = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /** @preserve
     * Counter block mode compatible with  Dr Brian Gladman fileenc.c
     * derived from CryptoJS.mode.CTR
     * Jan Hruby jhruby.web@gmail.com
     */
    CryptoJS.mode.CTRGladman = function () {
      var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

      function incWord(word) {
        if ((word >> 24 & 0xff) === 0xff) {
          //overflow
          var b1 = word >> 16 & 0xff;
          var b2 = word >> 8 & 0xff;
          var b3 = word & 0xff;

          if (b1 === 0xff) // overflow b1
            {
              b1 = 0;

              if (b2 === 0xff) {
                b2 = 0;

                if (b3 === 0xff) {
                  b3 = 0;
                } else {
                  ++b3;
                }
              } else {
                ++b2;
              }
            } else {
            ++b1;
          }

          word = 0;
          word += b1 << 16;
          word += b2 << 8;
          word += b3;
        } else {
          word += 0x01 << 24;
        }

        return word;
      }

      function incCounter(counter) {
        if ((counter[0] = incWord(counter[0])) === 0) {
          // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
          counter[1] = incWord(counter[1]);
        }

        return counter;
      }

      var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
        processBlock: function processBlock(words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter; // Generate keystream

          if (iv) {
            counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

            this._iv = undefined;
          }

          incCounter(counter);
          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0); // Encrypt

          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });
      CTRGladman.Decryptor = Encryptor;
      return CTRGladman;
    }();

    return CryptoJS.mode.CTRGladman;
  });
});

var modeOfb = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Output Feedback block mode.
     */
    CryptoJS.mode.OFB = function () {
      var OFB = CryptoJS.lib.BlockCipherMode.extend();
      var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function processBlock(words, offset) {
          // Shortcuts
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var keystream = this._keystream; // Generate keystream

          if (iv) {
            keystream = this._keystream = iv.slice(0); // Remove IV for subsequent blocks

            this._iv = undefined;
          }

          cipher.encryptBlock(keystream, 0); // Encrypt

          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
      });
      OFB.Decryptor = Encryptor;
      return OFB;
    }();

    return CryptoJS.mode.OFB;
  });
});

var modeEcb = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Electronic Codebook block mode.
     */
    CryptoJS.mode.ECB = function () {
      var ECB = CryptoJS.lib.BlockCipherMode.extend();
      ECB.Encryptor = ECB.extend({
        processBlock: function processBlock(words, offset) {
          this._cipher.encryptBlock(words, offset);
        }
      });
      ECB.Decryptor = ECB.extend({
        processBlock: function processBlock(words, offset) {
          this._cipher.decryptBlock(words, offset);
        }
      });
      return ECB;
    }();

    return CryptoJS.mode.ECB;
  });
});

var padAnsix923 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * ANSI X.923 padding strategy.
     */
    CryptoJS.pad.AnsiX923 = {
      pad: function pad(data, blockSize) {
        // Shortcuts
        var dataSigBytes = data.sigBytes;
        var blockSizeBytes = blockSize * 4; // Count padding bytes

        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes; // Compute last byte position

        var lastBytePos = dataSigBytes + nPaddingBytes - 1; // Pad

        data.clamp();
        data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
        data.sigBytes += nPaddingBytes;
      },
      unpad: function unpad(data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

        data.sigBytes -= nPaddingBytes;
      }
    };
    return CryptoJS.pad.Ansix923;
  });
});

var padIso10126 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * ISO 10126 padding strategy.
     */
    CryptoJS.pad.Iso10126 = {
      pad: function pad(data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4; // Count padding bytes

        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Pad

        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
      },
      unpad: function unpad(data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

        data.sigBytes -= nPaddingBytes;
      }
    };
    return CryptoJS.pad.Iso10126;
  });
});

var padIso97971 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * ISO/IEC 9797-1 Padding Method 2.
     */
    CryptoJS.pad.Iso97971 = {
      pad: function pad(data, blockSize) {
        // Add 0x80 byte
        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1)); // Zero pad the rest

        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
      },
      unpad: function unpad(data) {
        // Remove zero padding
        CryptoJS.pad.ZeroPadding.unpad(data); // Remove one more byte -- the 0x80 byte

        data.sigBytes--;
      }
    };
    return CryptoJS.pad.Iso97971;
  });
});

var padZeropadding = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * Zero padding strategy.
     */
    CryptoJS.pad.ZeroPadding = {
      pad: function pad(data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4; // Pad

        data.clamp();
        data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
      },
      unpad: function unpad(data) {
        // Shortcut
        var dataWords = data.words; // Unpad

        var i = data.sigBytes - 1;

        for (var i = data.sigBytes - 1; i >= 0; i--) {
          if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff) {
            data.sigBytes = i + 1;
            break;
          }
        }
      }
    };
    return CryptoJS.pad.ZeroPadding;
  });
});

var padNopadding = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    /**
     * A noop padding strategy.
     */
    CryptoJS.pad.NoPadding = {
      pad: function pad() {},
      unpad: function unpad() {}
    };
    return CryptoJS.pad.NoPadding;
  });
});

var formatHex = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var CipherParams = C_lib.CipherParams;
      var C_enc = C.enc;
      var Hex = C_enc.Hex;
      var C_format = C.format;
      var HexFormatter = C_format.Hex = {
        /**
         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The hexadecimally encoded string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
         */
        stringify: function stringify(cipherParams) {
          return cipherParams.ciphertext.toString(Hex);
        },

        /**
         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
         *
         * @param {string} input The hexadecimally encoded string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
         */
        parse: function parse(input) {
          var ciphertext = Hex.parse(input);
          return CipherParams.create({
            ciphertext: ciphertext
          });
        }
      };
    })();

    return CryptoJS.format.Hex;
  });
});

var aes = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C.algo; // Lookup tables

      var SBOX = [];
      var INV_SBOX = [];
      var SUB_MIX_0 = [];
      var SUB_MIX_1 = [];
      var SUB_MIX_2 = [];
      var SUB_MIX_3 = [];
      var INV_SUB_MIX_0 = [];
      var INV_SUB_MIX_1 = [];
      var INV_SUB_MIX_2 = [];
      var INV_SUB_MIX_3 = []; // Compute lookup tables

      (function () {
        // Compute double table
        var d = [];

        for (var i = 0; i < 256; i++) {
          if (i < 128) {
            d[i] = i << 1;
          } else {
            d[i] = i << 1 ^ 0x11b;
          }
        } // Walk GF(2^8)


        var x = 0;
        var xi = 0;

        for (var i = 0; i < 256; i++) {
          // Compute sbox
          var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
          sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
          SBOX[x] = sx;
          INV_SBOX[sx] = x; // Compute multiplication

          var x2 = d[x];
          var x4 = d[x2];
          var x8 = d[x4]; // Compute sub bytes, mix columns tables

          var t = d[sx] * 0x101 ^ sx * 0x1010100;
          SUB_MIX_0[x] = t << 24 | t >>> 8;
          SUB_MIX_1[x] = t << 16 | t >>> 16;
          SUB_MIX_2[x] = t << 8 | t >>> 24;
          SUB_MIX_3[x] = t; // Compute inv sub bytes, inv mix columns tables

          var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
          INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
          INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
          INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
          INV_SUB_MIX_3[sx] = t; // Compute next counter

          if (!x) {
            x = xi = 1;
          } else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
          }
        }
      })(); // Precomputed Rcon lookup


      var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
      /**
       * AES block cipher algorithm.
       */

      var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function _doReset() {
          var t; // Skip reset of nRounds has been set before and key did not change

          if (this._nRounds && this._keyPriorReset === this._key) {
            return;
          } // Shortcuts


          var key = this._keyPriorReset = this._key;
          var keyWords = key.words;
          var keySize = key.sigBytes / 4; // Compute number of rounds

          var nRounds = this._nRounds = keySize + 6; // Compute number of key schedule rows

          var ksRows = (nRounds + 1) * 4; // Compute key schedule

          var keySchedule = this._keySchedule = [];

          for (var ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keySize) {
              keySchedule[ksRow] = keyWords[ksRow];
            } else {
              t = keySchedule[ksRow - 1];

              if (!(ksRow % keySize)) {
                // Rot word
                t = t << 8 | t >>> 24; // Sub word

                t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff]; // Mix Rcon

                t ^= RCON[ksRow / keySize | 0] << 24;
              } else if (keySize > 6 && ksRow % keySize == 4) {
                // Sub word
                t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
              }

              keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
            }
          } // Compute inv key schedule


          var invKeySchedule = this._invKeySchedule = [];

          for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
            var ksRow = ksRows - invKsRow;

            if (invKsRow % 4) {
              var t = keySchedule[ksRow];
            } else {
              var t = keySchedule[ksRow - 4];
            }

            if (invKsRow < 4 || ksRow <= 4) {
              invKeySchedule[invKsRow] = t;
            } else {
              invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
            }
          }
        },
        encryptBlock: function encryptBlock(M, offset) {
          this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },
        decryptBlock: function decryptBlock(M, offset) {
          // Swap 2nd and 4th rows
          var t = M[offset + 1];
          M[offset + 1] = M[offset + 3];
          M[offset + 3] = t;

          this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX); // Inv swap 2nd and 4th rows


          var t = M[offset + 1];
          M[offset + 1] = M[offset + 3];
          M[offset + 3] = t;
        },
        _doCryptBlock: function _doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
          // Shortcut
          var nRounds = this._nRounds; // Get input, add round key

          var s0 = M[offset] ^ keySchedule[0];
          var s1 = M[offset + 1] ^ keySchedule[1];
          var s2 = M[offset + 2] ^ keySchedule[2];
          var s3 = M[offset + 3] ^ keySchedule[3]; // Key schedule row counter

          var ksRow = 4; // Rounds

          for (var round = 1; round < nRounds; round++) {
            // Shift rows, sub bytes, mix columns, add round key
            var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
            var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
            var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
            var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++]; // Update state

            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
          } // Shift rows, sub bytes, add round key


          var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
          var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
          var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
          var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]; // Set output

          M[offset] = t0;
          M[offset + 1] = t1;
          M[offset + 2] = t2;
          M[offset + 3] = t3;
        },
        keySize: 256 / 32
      });
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
       */

      C.AES = BlockCipher._createHelper(AES);
    })();

    return CryptoJS.AES;
  });
});

var tripledes = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C.algo; // Permuted Choice 1 constants

      var PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]; // Permuted Choice 2 constants

      var PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]; // Cumulative bit shift constants

      var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]; // SBOXes and round permutation constants

      var SBOX_P = [{
        0x0: 0x808200,
        0x10000000: 0x8000,
        0x20000000: 0x808002,
        0x30000000: 0x2,
        0x40000000: 0x200,
        0x50000000: 0x808202,
        0x60000000: 0x800202,
        0x70000000: 0x800000,
        0x80000000: 0x202,
        0x90000000: 0x800200,
        0xa0000000: 0x8200,
        0xb0000000: 0x808000,
        0xc0000000: 0x8002,
        0xd0000000: 0x800002,
        0xe0000000: 0x0,
        0xf0000000: 0x8202,
        0x8000000: 0x0,
        0x18000000: 0x808202,
        0x28000000: 0x8202,
        0x38000000: 0x8000,
        0x48000000: 0x808200,
        0x58000000: 0x200,
        0x68000000: 0x808002,
        0x78000000: 0x2,
        0x88000000: 0x800200,
        0x98000000: 0x8200,
        0xa8000000: 0x808000,
        0xb8000000: 0x800202,
        0xc8000000: 0x800002,
        0xd8000000: 0x8002,
        0xe8000000: 0x202,
        0xf8000000: 0x800000,
        0x1: 0x8000,
        0x10000001: 0x2,
        0x20000001: 0x808200,
        0x30000001: 0x800000,
        0x40000001: 0x808002,
        0x50000001: 0x8200,
        0x60000001: 0x200,
        0x70000001: 0x800202,
        0x80000001: 0x808202,
        0x90000001: 0x808000,
        0xa0000001: 0x800002,
        0xb0000001: 0x8202,
        0xc0000001: 0x202,
        0xd0000001: 0x800200,
        0xe0000001: 0x8002,
        0xf0000001: 0x0,
        0x8000001: 0x808202,
        0x18000001: 0x808000,
        0x28000001: 0x800000,
        0x38000001: 0x200,
        0x48000001: 0x8000,
        0x58000001: 0x800002,
        0x68000001: 0x2,
        0x78000001: 0x8202,
        0x88000001: 0x8002,
        0x98000001: 0x800202,
        0xa8000001: 0x202,
        0xb8000001: 0x808200,
        0xc8000001: 0x800200,
        0xd8000001: 0x0,
        0xe8000001: 0x8200,
        0xf8000001: 0x808002
      }, {
        0x0: 0x40084010,
        0x1000000: 0x4000,
        0x2000000: 0x80000,
        0x3000000: 0x40080010,
        0x4000000: 0x40000010,
        0x5000000: 0x40084000,
        0x6000000: 0x40004000,
        0x7000000: 0x10,
        0x8000000: 0x84000,
        0x9000000: 0x40004010,
        0xa000000: 0x40000000,
        0xb000000: 0x84010,
        0xc000000: 0x80010,
        0xd000000: 0x0,
        0xe000000: 0x4010,
        0xf000000: 0x40080000,
        0x800000: 0x40004000,
        0x1800000: 0x84010,
        0x2800000: 0x10,
        0x3800000: 0x40004010,
        0x4800000: 0x40084010,
        0x5800000: 0x40000000,
        0x6800000: 0x80000,
        0x7800000: 0x40080010,
        0x8800000: 0x80010,
        0x9800000: 0x0,
        0xa800000: 0x4000,
        0xb800000: 0x40080000,
        0xc800000: 0x40000010,
        0xd800000: 0x84000,
        0xe800000: 0x40084000,
        0xf800000: 0x4010,
        0x10000000: 0x0,
        0x11000000: 0x40080010,
        0x12000000: 0x40004010,
        0x13000000: 0x40084000,
        0x14000000: 0x40080000,
        0x15000000: 0x10,
        0x16000000: 0x84010,
        0x17000000: 0x4000,
        0x18000000: 0x4010,
        0x19000000: 0x80000,
        0x1a000000: 0x80010,
        0x1b000000: 0x40000010,
        0x1c000000: 0x84000,
        0x1d000000: 0x40004000,
        0x1e000000: 0x40000000,
        0x1f000000: 0x40084010,
        0x10800000: 0x84010,
        0x11800000: 0x80000,
        0x12800000: 0x40080000,
        0x13800000: 0x4000,
        0x14800000: 0x40004000,
        0x15800000: 0x40084010,
        0x16800000: 0x10,
        0x17800000: 0x40000000,
        0x18800000: 0x40084000,
        0x19800000: 0x40000010,
        0x1a800000: 0x40004010,
        0x1b800000: 0x80010,
        0x1c800000: 0x0,
        0x1d800000: 0x4010,
        0x1e800000: 0x40080010,
        0x1f800000: 0x84000
      }, {
        0x0: 0x104,
        0x100000: 0x0,
        0x200000: 0x4000100,
        0x300000: 0x10104,
        0x400000: 0x10004,
        0x500000: 0x4000004,
        0x600000: 0x4010104,
        0x700000: 0x4010000,
        0x800000: 0x4000000,
        0x900000: 0x4010100,
        0xa00000: 0x10100,
        0xb00000: 0x4010004,
        0xc00000: 0x4000104,
        0xd00000: 0x10000,
        0xe00000: 0x4,
        0xf00000: 0x100,
        0x80000: 0x4010100,
        0x180000: 0x4010004,
        0x280000: 0x0,
        0x380000: 0x4000100,
        0x480000: 0x4000004,
        0x580000: 0x10000,
        0x680000: 0x10004,
        0x780000: 0x104,
        0x880000: 0x4,
        0x980000: 0x100,
        0xa80000: 0x4010000,
        0xb80000: 0x10104,
        0xc80000: 0x10100,
        0xd80000: 0x4000104,
        0xe80000: 0x4010104,
        0xf80000: 0x4000000,
        0x1000000: 0x4010100,
        0x1100000: 0x10004,
        0x1200000: 0x10000,
        0x1300000: 0x4000100,
        0x1400000: 0x100,
        0x1500000: 0x4010104,
        0x1600000: 0x4000004,
        0x1700000: 0x0,
        0x1800000: 0x4000104,
        0x1900000: 0x4000000,
        0x1a00000: 0x4,
        0x1b00000: 0x10100,
        0x1c00000: 0x4010000,
        0x1d00000: 0x104,
        0x1e00000: 0x10104,
        0x1f00000: 0x4010004,
        0x1080000: 0x4000000,
        0x1180000: 0x104,
        0x1280000: 0x4010100,
        0x1380000: 0x0,
        0x1480000: 0x10004,
        0x1580000: 0x4000100,
        0x1680000: 0x100,
        0x1780000: 0x4010004,
        0x1880000: 0x10000,
        0x1980000: 0x4010104,
        0x1a80000: 0x10104,
        0x1b80000: 0x4000004,
        0x1c80000: 0x4000104,
        0x1d80000: 0x4010000,
        0x1e80000: 0x4,
        0x1f80000: 0x10100
      }, {
        0x0: 0x80401000,
        0x10000: 0x80001040,
        0x20000: 0x401040,
        0x30000: 0x80400000,
        0x40000: 0x0,
        0x50000: 0x401000,
        0x60000: 0x80000040,
        0x70000: 0x400040,
        0x80000: 0x80000000,
        0x90000: 0x400000,
        0xa0000: 0x40,
        0xb0000: 0x80001000,
        0xc0000: 0x80400040,
        0xd0000: 0x1040,
        0xe0000: 0x1000,
        0xf0000: 0x80401040,
        0x8000: 0x80001040,
        0x18000: 0x40,
        0x28000: 0x80400040,
        0x38000: 0x80001000,
        0x48000: 0x401000,
        0x58000: 0x80401040,
        0x68000: 0x0,
        0x78000: 0x80400000,
        0x88000: 0x1000,
        0x98000: 0x80401000,
        0xa8000: 0x400000,
        0xb8000: 0x1040,
        0xc8000: 0x80000000,
        0xd8000: 0x400040,
        0xe8000: 0x401040,
        0xf8000: 0x80000040,
        0x100000: 0x400040,
        0x110000: 0x401000,
        0x120000: 0x80000040,
        0x130000: 0x0,
        0x140000: 0x1040,
        0x150000: 0x80400040,
        0x160000: 0x80401000,
        0x170000: 0x80001040,
        0x180000: 0x80401040,
        0x190000: 0x80000000,
        0x1a0000: 0x80400000,
        0x1b0000: 0x401040,
        0x1c0000: 0x80001000,
        0x1d0000: 0x400000,
        0x1e0000: 0x40,
        0x1f0000: 0x1000,
        0x108000: 0x80400000,
        0x118000: 0x80401040,
        0x128000: 0x0,
        0x138000: 0x401000,
        0x148000: 0x400040,
        0x158000: 0x80000000,
        0x168000: 0x80001040,
        0x178000: 0x40,
        0x188000: 0x80000040,
        0x198000: 0x1000,
        0x1a8000: 0x80001000,
        0x1b8000: 0x80400040,
        0x1c8000: 0x1040,
        0x1d8000: 0x80401000,
        0x1e8000: 0x400000,
        0x1f8000: 0x401040
      }, {
        0x0: 0x80,
        0x1000: 0x1040000,
        0x2000: 0x40000,
        0x3000: 0x20000000,
        0x4000: 0x20040080,
        0x5000: 0x1000080,
        0x6000: 0x21000080,
        0x7000: 0x40080,
        0x8000: 0x1000000,
        0x9000: 0x20040000,
        0xa000: 0x20000080,
        0xb000: 0x21040080,
        0xc000: 0x21040000,
        0xd000: 0x0,
        0xe000: 0x1040080,
        0xf000: 0x21000000,
        0x800: 0x1040080,
        0x1800: 0x21000080,
        0x2800: 0x80,
        0x3800: 0x1040000,
        0x4800: 0x40000,
        0x5800: 0x20040080,
        0x6800: 0x21040000,
        0x7800: 0x20000000,
        0x8800: 0x20040000,
        0x9800: 0x0,
        0xa800: 0x21040080,
        0xb800: 0x1000080,
        0xc800: 0x20000080,
        0xd800: 0x21000000,
        0xe800: 0x1000000,
        0xf800: 0x40080,
        0x10000: 0x40000,
        0x11000: 0x80,
        0x12000: 0x20000000,
        0x13000: 0x21000080,
        0x14000: 0x1000080,
        0x15000: 0x21040000,
        0x16000: 0x20040080,
        0x17000: 0x1000000,
        0x18000: 0x21040080,
        0x19000: 0x21000000,
        0x1a000: 0x1040000,
        0x1b000: 0x20040000,
        0x1c000: 0x40080,
        0x1d000: 0x20000080,
        0x1e000: 0x0,
        0x1f000: 0x1040080,
        0x10800: 0x21000080,
        0x11800: 0x1000000,
        0x12800: 0x1040000,
        0x13800: 0x20040080,
        0x14800: 0x20000000,
        0x15800: 0x1040080,
        0x16800: 0x80,
        0x17800: 0x21040000,
        0x18800: 0x40080,
        0x19800: 0x21040080,
        0x1a800: 0x0,
        0x1b800: 0x21000000,
        0x1c800: 0x1000080,
        0x1d800: 0x40000,
        0x1e800: 0x20040000,
        0x1f800: 0x20000080
      }, {
        0x0: 0x10000008,
        0x100: 0x2000,
        0x200: 0x10200000,
        0x300: 0x10202008,
        0x400: 0x10002000,
        0x500: 0x200000,
        0x600: 0x200008,
        0x700: 0x10000000,
        0x800: 0x0,
        0x900: 0x10002008,
        0xa00: 0x202000,
        0xb00: 0x8,
        0xc00: 0x10200008,
        0xd00: 0x202008,
        0xe00: 0x2008,
        0xf00: 0x10202000,
        0x80: 0x10200000,
        0x180: 0x10202008,
        0x280: 0x8,
        0x380: 0x200000,
        0x480: 0x202008,
        0x580: 0x10000008,
        0x680: 0x10002000,
        0x780: 0x2008,
        0x880: 0x200008,
        0x980: 0x2000,
        0xa80: 0x10002008,
        0xb80: 0x10200008,
        0xc80: 0x0,
        0xd80: 0x10202000,
        0xe80: 0x202000,
        0xf80: 0x10000000,
        0x1000: 0x10002000,
        0x1100: 0x10200008,
        0x1200: 0x10202008,
        0x1300: 0x2008,
        0x1400: 0x200000,
        0x1500: 0x10000000,
        0x1600: 0x10000008,
        0x1700: 0x202000,
        0x1800: 0x202008,
        0x1900: 0x0,
        0x1a00: 0x8,
        0x1b00: 0x10200000,
        0x1c00: 0x2000,
        0x1d00: 0x10002008,
        0x1e00: 0x10202000,
        0x1f00: 0x200008,
        0x1080: 0x8,
        0x1180: 0x202000,
        0x1280: 0x200000,
        0x1380: 0x10000008,
        0x1480: 0x10002000,
        0x1580: 0x2008,
        0x1680: 0x10202008,
        0x1780: 0x10200000,
        0x1880: 0x10202000,
        0x1980: 0x10200008,
        0x1a80: 0x2000,
        0x1b80: 0x202008,
        0x1c80: 0x200008,
        0x1d80: 0x0,
        0x1e80: 0x10000000,
        0x1f80: 0x10002008
      }, {
        0x0: 0x100000,
        0x10: 0x2000401,
        0x20: 0x400,
        0x30: 0x100401,
        0x40: 0x2100401,
        0x50: 0x0,
        0x60: 0x1,
        0x70: 0x2100001,
        0x80: 0x2000400,
        0x90: 0x100001,
        0xa0: 0x2000001,
        0xb0: 0x2100400,
        0xc0: 0x2100000,
        0xd0: 0x401,
        0xe0: 0x100400,
        0xf0: 0x2000000,
        0x8: 0x2100001,
        0x18: 0x0,
        0x28: 0x2000401,
        0x38: 0x2100400,
        0x48: 0x100000,
        0x58: 0x2000001,
        0x68: 0x2000000,
        0x78: 0x401,
        0x88: 0x100401,
        0x98: 0x2000400,
        0xa8: 0x2100000,
        0xb8: 0x100001,
        0xc8: 0x400,
        0xd8: 0x2100401,
        0xe8: 0x1,
        0xf8: 0x100400,
        0x100: 0x2000000,
        0x110: 0x100000,
        0x120: 0x2000401,
        0x130: 0x2100001,
        0x140: 0x100001,
        0x150: 0x2000400,
        0x160: 0x2100400,
        0x170: 0x100401,
        0x180: 0x401,
        0x190: 0x2100401,
        0x1a0: 0x100400,
        0x1b0: 0x1,
        0x1c0: 0x0,
        0x1d0: 0x2100000,
        0x1e0: 0x2000001,
        0x1f0: 0x400,
        0x108: 0x100400,
        0x118: 0x2000401,
        0x128: 0x2100001,
        0x138: 0x1,
        0x148: 0x2000000,
        0x158: 0x100000,
        0x168: 0x401,
        0x178: 0x2100400,
        0x188: 0x2000001,
        0x198: 0x2100000,
        0x1a8: 0x0,
        0x1b8: 0x2100401,
        0x1c8: 0x100401,
        0x1d8: 0x400,
        0x1e8: 0x2000400,
        0x1f8: 0x100001
      }, {
        0x0: 0x8000820,
        0x1: 0x20000,
        0x2: 0x8000000,
        0x3: 0x20,
        0x4: 0x20020,
        0x5: 0x8020820,
        0x6: 0x8020800,
        0x7: 0x800,
        0x8: 0x8020000,
        0x9: 0x8000800,
        0xa: 0x20800,
        0xb: 0x8020020,
        0xc: 0x820,
        0xd: 0x0,
        0xe: 0x8000020,
        0xf: 0x20820,
        0x80000000: 0x800,
        0x80000001: 0x8020820,
        0x80000002: 0x8000820,
        0x80000003: 0x8000000,
        0x80000004: 0x8020000,
        0x80000005: 0x20800,
        0x80000006: 0x20820,
        0x80000007: 0x20,
        0x80000008: 0x8000020,
        0x80000009: 0x820,
        0x8000000a: 0x20020,
        0x8000000b: 0x8020800,
        0x8000000c: 0x0,
        0x8000000d: 0x8020020,
        0x8000000e: 0x8000800,
        0x8000000f: 0x20000,
        0x10: 0x20820,
        0x11: 0x8020800,
        0x12: 0x20,
        0x13: 0x800,
        0x14: 0x8000800,
        0x15: 0x8000020,
        0x16: 0x8020020,
        0x17: 0x20000,
        0x18: 0x0,
        0x19: 0x20020,
        0x1a: 0x8020000,
        0x1b: 0x8000820,
        0x1c: 0x8020820,
        0x1d: 0x20800,
        0x1e: 0x820,
        0x1f: 0x8000000,
        0x80000010: 0x20000,
        0x80000011: 0x800,
        0x80000012: 0x8020020,
        0x80000013: 0x20820,
        0x80000014: 0x20,
        0x80000015: 0x8020000,
        0x80000016: 0x8000000,
        0x80000017: 0x8000820,
        0x80000018: 0x8020820,
        0x80000019: 0x8000020,
        0x8000001a: 0x8000800,
        0x8000001b: 0x0,
        0x8000001c: 0x20800,
        0x8000001d: 0x820,
        0x8000001e: 0x20020,
        0x8000001f: 0x8020800
      }]; // Masks that select the SBOX input

      var SBOX_MASK = [0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f];
      /**
       * DES block cipher algorithm.
       */

      var DES = C_algo.DES = BlockCipher.extend({
        _doReset: function _doReset() {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words; // Select 56 bits according to PC1

          var keyBits = [];

          for (var i = 0; i < 56; i++) {
            var keyBitPos = PC1[i] - 1;
            keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
          } // Assemble 16 subkeys


          var subKeys = this._subKeys = [];

          for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
            // Create subkey
            var subKey = subKeys[nSubKey] = []; // Shortcut

            var bitShift = BIT_SHIFTS[nSubKey]; // Select 48 bits according to PC2

            for (var i = 0; i < 24; i++) {
              // Select from the left 28 key bits
              subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6; // Select from the right 28 key bits

              subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
            } // Since each subkey is applied to an expanded 32-bit input,
            // the subkey can be broken into 8 values scaled to 32-bits,
            // which allows the key to be used without expansion


            subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;

            for (var i = 1; i < 7; i++) {
              subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
            }

            subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
          } // Compute inverse subkeys


          var invSubKeys = this._invSubKeys = [];

          for (var i = 0; i < 16; i++) {
            invSubKeys[i] = subKeys[15 - i];
          }
        },
        encryptBlock: function encryptBlock(M, offset) {
          this._doCryptBlock(M, offset, this._subKeys);
        },
        decryptBlock: function decryptBlock(M, offset) {
          this._doCryptBlock(M, offset, this._invSubKeys);
        },
        _doCryptBlock: function _doCryptBlock(M, offset, subKeys) {
          // Get input
          this._lBlock = M[offset];
          this._rBlock = M[offset + 1]; // Initial permutation

          exchangeLR.call(this, 4, 0x0f0f0f0f);
          exchangeLR.call(this, 16, 0x0000ffff);
          exchangeRL.call(this, 2, 0x33333333);
          exchangeRL.call(this, 8, 0x00ff00ff);
          exchangeLR.call(this, 1, 0x55555555); // Rounds

          for (var round = 0; round < 16; round++) {
            // Shortcuts
            var subKey = subKeys[round];
            var lBlock = this._lBlock;
            var rBlock = this._rBlock; // Feistel function

            var f = 0;

            for (var i = 0; i < 8; i++) {
              f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
            }

            this._lBlock = rBlock;
            this._rBlock = lBlock ^ f;
          } // Undo swap from last round


          var t = this._lBlock;
          this._lBlock = this._rBlock;
          this._rBlock = t; // Final permutation

          exchangeLR.call(this, 1, 0x55555555);
          exchangeRL.call(this, 8, 0x00ff00ff);
          exchangeRL.call(this, 2, 0x33333333);
          exchangeLR.call(this, 16, 0x0000ffff);
          exchangeLR.call(this, 4, 0x0f0f0f0f); // Set output

          M[offset] = this._lBlock;
          M[offset + 1] = this._rBlock;
        },
        keySize: 64 / 32,
        ivSize: 64 / 32,
        blockSize: 64 / 32
      }); // Swap bits across the left and right words

      function exchangeLR(offset, mask) {
        var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
        this._rBlock ^= t;
        this._lBlock ^= t << offset;
      }

      function exchangeRL(offset, mask) {
        var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
        this._lBlock ^= t;
        this._rBlock ^= t << offset;
      }
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
       */


      C.DES = BlockCipher._createHelper(DES);
      /**
       * Triple-DES block cipher algorithm.
       */

      var TripleDES = C_algo.TripleDES = BlockCipher.extend({
        _doReset: function _doReset() {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words; // Make sure the key length is valid (64, 128 or >= 192 bit)

          if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
            throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
          } // Extend the key according to the keying options defined in 3DES standard


          var key1 = keyWords.slice(0, 2);
          var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
          var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6); // Create DES instances

          this._des1 = DES.createEncryptor(WordArray.create(key1));
          this._des2 = DES.createEncryptor(WordArray.create(key2));
          this._des3 = DES.createEncryptor(WordArray.create(key3));
        },
        encryptBlock: function encryptBlock(M, offset) {
          this._des1.encryptBlock(M, offset);

          this._des2.decryptBlock(M, offset);

          this._des3.encryptBlock(M, offset);
        },
        decryptBlock: function decryptBlock(M, offset) {
          this._des3.decryptBlock(M, offset);

          this._des2.encryptBlock(M, offset);

          this._des1.decryptBlock(M, offset);
        },
        keySize: 192 / 32,
        ivSize: 64 / 32,
        blockSize: 64 / 32
      });
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
       */

      C.TripleDES = BlockCipher._createHelper(TripleDES);
    })();

    return CryptoJS.TripleDES;
  });
});

var rc4 = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo;
      /**
       * RC4 stream cipher algorithm.
       */

      var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function _doReset() {
          // Shortcuts
          var key = this._key;
          var keyWords = key.words;
          var keySigBytes = key.sigBytes; // Init sbox

          var S = this._S = [];

          for (var i = 0; i < 256; i++) {
            S[i] = i;
          } // Key setup


          for (var i = 0, j = 0; i < 256; i++) {
            var keyByteIndex = i % keySigBytes;
            var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 0xff;
            j = (j + S[i] + keyByte) % 256; // Swap

            var t = S[i];
            S[i] = S[j];
            S[j] = t;
          } // Counters


          this._i = this._j = 0;
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          M[offset] ^= generateKeystreamWord.call(this);
        },
        keySize: 256 / 32,
        ivSize: 0
      });

      function generateKeystreamWord() {
        // Shortcuts
        var S = this._S;
        var i = this._i;
        var j = this._j; // Generate keystream word

        var keystreamWord = 0;

        for (var n = 0; n < 4; n++) {
          i = (i + 1) % 256;
          j = (j + S[i]) % 256; // Swap

          var t = S[i];
          S[i] = S[j];
          S[j] = t;
          keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
        } // Update counters


        this._i = i;
        this._j = j;
        return keystreamWord;
      }
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
       */


      C.RC4 = StreamCipher._createHelper(RC4);
      /**
       * Modified RC4 stream cipher algorithm.
       */

      var RC4Drop = C_algo.RC4Drop = RC4.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        cfg: RC4.cfg.extend({
          drop: 192
        }),
        _doReset: function _doReset() {
          RC4._doReset.call(this); // Drop


          for (var i = this.cfg.drop; i > 0; i--) {
            generateKeystreamWord.call(this);
          }
        }
      });
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
       */

      C.RC4Drop = StreamCipher._createHelper(RC4Drop);
    })();

    return CryptoJS.RC4;
  });
});

var rabbit = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo; // Reusable objects

      var S = [];
      var C_ = [];
      var G = [];
      /**
       * Rabbit stream cipher algorithm
       */

      var Rabbit = C_algo.Rabbit = StreamCipher.extend({
        _doReset: function _doReset() {
          // Shortcuts
          var K = this._key.words;
          var iv = this.cfg.iv; // Swap endian

          for (var i = 0; i < 4; i++) {
            K[i] = (K[i] << 8 | K[i] >>> 24) & 0x00ff00ff | (K[i] << 24 | K[i] >>> 8) & 0xff00ff00;
          } // Generate initial state values


          var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

          var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

          this._b = 0; // Iterate the system four times

          for (var i = 0; i < 4; i++) {
            nextState.call(this);
          } // Modify the counters


          for (var i = 0; i < 8; i++) {
            C[i] ^= X[i + 4 & 7];
          } // IV setup


          if (iv) {
            // Shortcuts
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1]; // Generate four subvectors

            var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
            var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
            var i1 = i0 >>> 16 | i2 & 0xffff0000;
            var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3; // Iterate the system four times

            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
          }
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcut
          var X = this._X; // Iterate the system

          nextState.call(this); // Generate four keystream words

          S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
          S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
          S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
          S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

          for (var i = 0; i < 4; i++) {
            // Swap endian
            S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

            M[offset + i] ^= S[i];
          }
        },
        blockSize: 128 / 32,
        ivSize: 64 / 32
      });

      function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C; // Save old counter values

        for (var i = 0; i < 8; i++) {
          C_[i] = C[i];
        } // Calculate new counter values


        C[0] = C[0] + 0x4d34d34d + this._b | 0;
        C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
        C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
        C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
        C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
        C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
        C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
        C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
        this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

        for (var i = 0; i < 8; i++) {
          var gx = X[i] + C[i]; // Construct high and low argument for squaring

          var ga = gx & 0xffff;
          var gb = gx >>> 16; // Calculate high and low result of squaring

          var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
          var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

          G[i] = gh ^ gl;
        } // Calculate new state values


        X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
        X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
        X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
        X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
        X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
        X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
        X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
        X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
      }
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
       */


      C.Rabbit = StreamCipher._createHelper(Rabbit);
    })();

    return CryptoJS.Rabbit;
  });
});

var rabbitLegacy = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C.algo; // Reusable objects

      var S = [];
      var C_ = [];
      var G = [];
      /**
       * Rabbit stream cipher algorithm.
       *
       * This is a legacy version that neglected to convert the key to little-endian.
       * This error doesn't affect the cipher's security,
       * but it does affect its compatibility with other implementations.
       */

      var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
        _doReset: function _doReset() {
          // Shortcuts
          var K = this._key.words;
          var iv = this.cfg.iv; // Generate initial state values

          var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

          var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

          this._b = 0; // Iterate the system four times

          for (var i = 0; i < 4; i++) {
            nextState.call(this);
          } // Modify the counters


          for (var i = 0; i < 8; i++) {
            C[i] ^= X[i + 4 & 7];
          } // IV setup


          if (iv) {
            // Shortcuts
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1]; // Generate four subvectors

            var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
            var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
            var i1 = i0 >>> 16 | i2 & 0xffff0000;
            var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

            C[0] ^= i0;
            C[1] ^= i1;
            C[2] ^= i2;
            C[3] ^= i3;
            C[4] ^= i0;
            C[5] ^= i1;
            C[6] ^= i2;
            C[7] ^= i3; // Iterate the system four times

            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
          }
        },
        _doProcessBlock: function _doProcessBlock(M, offset) {
          // Shortcut
          var X = this._X; // Iterate the system

          nextState.call(this); // Generate four keystream words

          S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
          S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
          S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
          S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

          for (var i = 0; i < 4; i++) {
            // Swap endian
            S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

            M[offset + i] ^= S[i];
          }
        },
        blockSize: 128 / 32,
        ivSize: 64 / 32
      });

      function nextState() {
        // Shortcuts
        var X = this._X;
        var C = this._C; // Save old counter values

        for (var i = 0; i < 8; i++) {
          C_[i] = C[i];
        } // Calculate new counter values


        C[0] = C[0] + 0x4d34d34d + this._b | 0;
        C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
        C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
        C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
        C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
        C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
        C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
        C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
        this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

        for (var i = 0; i < 8; i++) {
          var gx = X[i] + C[i]; // Construct high and low argument for squaring

          var ga = gx & 0xffff;
          var gb = gx >>> 16; // Calculate high and low result of squaring

          var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
          var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

          G[i] = gh ^ gl;
        } // Calculate new state values


        X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
        X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
        X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
        X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
        X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
        X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
        X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
        X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
      }
      /**
       * Shortcut functions to the cipher's object interface.
       *
       * @example
       *
       *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
       *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
       */


      C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
    })();

    return CryptoJS.RabbitLegacy;
  });
});

var cryptoJs = createCommonjsModule(function (module, exports) {

  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, x64Core, libTypedarrays, encUtf16, encBase64, md5, sha1, sha256, sha224, sha512, sha384, sha3, ripemd160, hmac, pbkdf2, evpkdf, cipherCore, modeCfb, modeCtr, modeCtrGladman, modeOfb, modeEcb, padAnsix923, padIso10126, padIso97971, padZeropadding, padNopadding, formatHex, aes, tripledes, rc4, rabbit, rabbitLegacy);
    }
  })(commonjsGlobal, function (CryptoJS) {
    return CryptoJS;
  });
});

var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
});

var chance_1 = createCommonjsModule(function (module, exports) {
  //  Chance.js 1.1.7
  //  http://chancejs.com
  //  (c) 2013 Victor Quinn
  //  Chance may be freely distributed or modified under the MIT license.
  (function () {
    // Constants
    var MAX_INT = 9007199254740992;
    var MIN_INT = -MAX_INT;
    var NUMBERS = '0123456789';
    var CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    var CHARS_UPPER = CHARS_LOWER.toUpperCase();
    var HEX_POOL = NUMBERS + "abcdef"; // Errors

    function UnsupportedError(message) {
      this.name = 'UnsupportedError';
      this.message = message || 'This feature is not supported on this platform';
    }

    UnsupportedError.prototype = new Error();
    UnsupportedError.prototype.constructor = UnsupportedError; // Cached array helpers

    var slice = Array.prototype.slice; // Constructor

    function Chance(seed) {
      if (!(this instanceof Chance)) {
        if (!seed) {
          seed = null;
        } // handle other non-truthy seeds, as described in issue #322


        return seed === null ? new Chance() : new Chance(seed);
      } // if user has provided a function, use that as the generator


      if (typeof seed === 'function') {
        this.random = seed;
        return this;
      }

      if (arguments.length) {
        // set a starting value of zero so we can add to it
        this.seed = 0;
      } // otherwise, leave this.seed blank so that MT will receive a blank


      for (var i = 0; i < arguments.length; i++) {
        var seedling = 0;

        if (Object.prototype.toString.call(arguments[i]) === '[object String]') {
          for (var j = 0; j < arguments[i].length; j++) {
            // create a numeric hash for each argument, add to seedling
            var hash = 0;

            for (var k = 0; k < arguments[i].length; k++) {
              hash = arguments[i].charCodeAt(k) + (hash << 6) + (hash << 16) - hash;
            }

            seedling += hash;
          }
        } else {
          seedling = arguments[i];
        }

        this.seed += (arguments.length - i) * seedling;
      } // If no generator function was provided, use our MT


      this.mt = this.mersenne_twister(this.seed);
      this.bimd5 = this.blueimp_md5();

      this.random = function () {
        return this.mt.random(this.seed);
      };

      return this;
    }

    Chance.prototype.VERSION = "1.1.7"; // Random helper functions

    function initOptions(options, defaults) {
      options = options || {};

      if (defaults) {
        for (var i in defaults) {
          if (typeof options[i] === 'undefined') {
            options[i] = defaults[i];
          }
        }
      }

      return options;
    }

    function range(size) {
      return Array.apply(null, Array(size)).map(function (_, i) {
        return i;
      });
    }

    function testRange(test, errorMessage) {
      if (test) {
        throw new RangeError(errorMessage);
      }
    }
    /**
     * Encode the input string with Base64.
     */


    var base64 = function base64() {
      throw new Error('No Base64 encoder available.');
    }; // Select proper Base64 encoder.


    (function determineBase64Encoder() {
      if (typeof btoa === 'function') {
        base64 = btoa;
      } else if (typeof Buffer === 'function') {
        base64 = function base64(input) {
          return new Buffer(input).toString('base64');
        };
      }
    })(); // -- Basics --

    /**
     *  Return a random bool, either true or false
     *
     *  @param {Object} [options={ likelihood: 50 }] alter the likelihood of
     *    receiving a true or false value back.
     *  @throws {RangeError} if the likelihood is out of bounds
     *  @returns {Bool} either true or false
     */


    Chance.prototype.bool = function (options) {
      // likelihood of success (true)
      options = initOptions(options, {
        likelihood: 50
      }); // Note, we could get some minor perf optimizations by checking range
      // prior to initializing defaults, but that makes code a bit messier
      // and the check more complicated as we have to check existence of
      // the object then existence of the key before checking constraints.
      // Since the options initialization should be minor computationally,
      // decision made for code cleanliness intentionally. This is mentioned
      // here as it's the first occurrence, will not be mentioned again.

      testRange(options.likelihood < 0 || options.likelihood > 100, "Chance: Likelihood accepts values from 0 to 100.");
      return this.random() * 100 < options.likelihood;
    };

    Chance.prototype.falsy = function (options) {
      // return a random falsy value
      options = initOptions(options, {
        pool: [false, null, 0, NaN, '']
      });
      var pool = options.pool,
          index = this.integer({
        min: 0,
        max: pool.length
      }),
          value = pool[index];
      return value;
    };

    Chance.prototype.animal = function (options) {
      //returns a random animal
      options = initOptions(options);

      if (typeof options.type !== 'undefined') {
        //if user does not put in a valid animal type, user will get an error
        testRange(!this.get("animals")[options.type.toLowerCase()], "Please pick from desert, ocean, grassland, forest, zoo, pets, farm."); //if user does put in valid animal type, will return a random animal of that type

        return this.pick(this.get("animals")[options.type.toLowerCase()]);
      } //if user does not put in any animal type, will return a random animal regardless


      var animalTypeArray = ["desert", "forest", "ocean", "zoo", "farm", "pet", "grassland"];
      return this.pick(this.get("animals")[this.pick(animalTypeArray)]);
    };
    /**
     *  Return a random character.
     *
     *  @param {Object} [options={}] can specify a character pool or alpha,
     *    numeric, symbols and casing (lower or upper)
     *  @returns {String} a single random character
     */


    Chance.prototype.character = function (options) {
      options = initOptions(options);
      var symbols = "!@#$%^&*()[]",
          letters,
          pool;

      if (options.casing === 'lower') {
        letters = CHARS_LOWER;
      } else if (options.casing === 'upper') {
        letters = CHARS_UPPER;
      } else {
        letters = CHARS_LOWER + CHARS_UPPER;
      }

      if (options.pool) {
        pool = options.pool;
      } else {
        pool = '';

        if (options.alpha) {
          pool += letters;
        }

        if (options.numeric) {
          pool += NUMBERS;
        }

        if (options.symbols) {
          pool += symbols;
        }

        if (!pool) {
          pool = letters + NUMBERS + symbols;
        }
      }

      return pool.charAt(this.natural({
        max: pool.length - 1
      }));
    }; // Note, wanted to use "float" or "double" but those are both JS reserved words.
    // Note, fixed means N OR LESS digits after the decimal. This because
    // It could be 14.9000 but in JavaScript, when this is cast as a number,
    // the trailing zeroes are dropped. Left to the consumer if trailing zeroes are
    // needed

    /**
     *  Return a random floating point number
     *
     *  @param {Object} [options={}] can specify a fixed precision, min, max
     *  @returns {Number} a single floating point number
     *  @throws {RangeError} Can only specify fixed or precision, not both. Also
     *    min cannot be greater than max
     */


    Chance.prototype.floating = function (options) {
      options = initOptions(options, {
        fixed: 4
      });
      testRange(options.fixed && options.precision, "Chance: Cannot specify both fixed and precision.");
      var num;
      var fixed = Math.pow(10, options.fixed);
      var max = MAX_INT / fixed;
      var min = -max;
      testRange(options.min && options.fixed && options.min < min, "Chance: Min specified is out of range with fixed. Min should be, at least, " + min);
      testRange(options.max && options.fixed && options.max > max, "Chance: Max specified is out of range with fixed. Max should be, at most, " + max);
      options = initOptions(options, {
        min: min,
        max: max
      }); // Todo - Make this work!
      // options.precision = (typeof options.precision !== "undefined") ? options.precision : false;

      num = this.integer({
        min: options.min * fixed,
        max: options.max * fixed
      });
      var num_fixed = (num / fixed).toFixed(options.fixed);
      return parseFloat(num_fixed);
    };
    /**
     *  Return a random integer
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.integer({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or max
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */


    Chance.prototype.integer = function (options) {
      // 9007199254740992 (2^53) is the max integer number in JavaScript
      // See: http://vq.io/132sa2j
      options = initOptions(options, {
        min: MIN_INT,
        max: MAX_INT
      });
      testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
      return Math.floor(this.random() * (options.max - options.min + 1) + options.min);
    };
    /**
     *  Return a random natural
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.natural({min: 1, max: 3});
     *  would return either 1, 2, or 3.
     *
     *  @param {Object} [options={}] can specify a min and/or max or a numerals count.
     *  @returns {Number} a single random integer number
     *  @throws {RangeError} min cannot be greater than max
     */


    Chance.prototype.natural = function (options) {
      options = initOptions(options, {
        min: 0,
        max: MAX_INT
      });

      if (typeof options.numerals === 'number') {
        testRange(options.numerals < 1, "Chance: Numerals cannot be less than one.");
        options.min = Math.pow(10, options.numerals - 1);
        options.max = Math.pow(10, options.numerals) - 1;
      }

      testRange(options.min < 0, "Chance: Min cannot be less than zero.");

      if (options.exclude) {
        testRange(!Array.isArray(options.exclude), "Chance: exclude must be an array.");

        for (var exclusionIndex in options.exclude) {
          testRange(!Number.isInteger(options.exclude[exclusionIndex]), "Chance: exclude must be numbers.");
        }

        var random = options.min + this.natural({
          max: options.max - options.min - options.exclude.length
        });
        var sortedExclusions = options.exclude.sort();

        for (var exclusionIndex in sortedExclusions) {
          if (random < sortedExclusions[exclusionIndex]) {
            break;
          }

          random++;
        }

        return random;
      }

      return this.integer(options);
    };
    /**
     *  Return a random prime number
     *
     *  NOTE the max and min are INCLUDED in the range.
     *
     *  @param {Object} [options={}] can specify a min and/or max
     *  @returns {Number} a single random prime number
     *  @throws {RangeError} min cannot be greater than max nor negative
     */


    Chance.prototype.prime = function (options) {
      options = initOptions(options, {
        min: 0,
        max: 10000
      });
      testRange(options.min < 0, "Chance: Min cannot be less than zero.");
      testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
      var lastPrime = data.primes[data.primes.length - 1];

      if (options.max > lastPrime) {
        for (var i = lastPrime + 2; i <= options.max; ++i) {
          if (this.is_prime(i)) {
            data.primes.push(i);
          }
        }
      }

      var targetPrimes = data.primes.filter(function (prime) {
        return prime >= options.min && prime <= options.max;
      });
      return this.pick(targetPrimes);
    };
    /**
     * Determine whether a given number is prime or not.
     */


    Chance.prototype.is_prime = function (n) {
      if (n % 1 || n < 2) {
        return false;
      }

      if (n % 2 === 0) {
        return n === 2;
      }

      if (n % 3 === 0) {
        return n === 3;
      }

      var m = Math.sqrt(n);

      for (var i = 5; i <= m; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
          return false;
        }
      }

      return true;
    };
    /**
     *  Return a random hex number as string
     *
     *  NOTE the max and min are INCLUDED in the range. So:
     *  chance.hex({min: '9', max: 'B'});
     *  would return either '9', 'A' or 'B'.
     *
     *  @param {Object} [options={}] can specify a min and/or max and/or casing
     *  @returns {String} a single random string hex number
     *  @throws {RangeError} min cannot be greater than max
     */


    Chance.prototype.hex = function (options) {
      options = initOptions(options, {
        min: 0,
        max: MAX_INT,
        casing: 'lower'
      });
      testRange(options.min < 0, "Chance: Min cannot be less than zero.");
      var integer = this.natural({
        min: options.min,
        max: options.max
      });

      if (options.casing === 'upper') {
        return integer.toString(16).toUpperCase();
      }

      return integer.toString(16);
    };

    Chance.prototype.letter = function (options) {
      options = initOptions(options, {
        casing: 'lower'
      });
      var pool = "abcdefghijklmnopqrstuvwxyz";
      var letter = this.character({
        pool: pool
      });

      if (options.casing === 'upper') {
        letter = letter.toUpperCase();
      }

      return letter;
    };
    /**
     *  Return a random string
     *
     *  @param {Object} [options={}] can specify a length or min and max
     *  @returns {String} a string of random length
     *  @throws {RangeError} length cannot be less than zero
     */


    Chance.prototype.string = function (options) {
      options = initOptions(options, {
        min: 5,
        max: 20
      });

      if (!options.length) {
        options.length = this.natural({
          min: options.min,
          max: options.max
        });
      }

      testRange(options.length < 0, "Chance: Length cannot be less than zero.");
      var length = options.length,
          text = this.n(this.character, length, options);
      return text.join("");
    };

    function CopyToken(c) {
      this.c = c;
    }

    CopyToken.prototype = {
      substitute: function substitute() {
        return this.c;
      }
    };

    function EscapeToken(c) {
      this.c = c;
    }

    EscapeToken.prototype = {
      substitute: function substitute() {
        if (!/[{}\\]/.test(this.c)) {
          throw new Error('Invalid escape sequence: "\\' + this.c + '".');
        }

        return this.c;
      }
    };

    function ReplaceToken(c) {
      this.c = c;
    }

    ReplaceToken.prototype = {
      replacers: {
        '#': function _(chance) {
          return chance.character({
            pool: NUMBERS
          });
        },
        'A': function A(chance) {
          return chance.character({
            pool: CHARS_UPPER
          });
        },
        'a': function a(chance) {
          return chance.character({
            pool: CHARS_LOWER
          });
        }
      },
      substitute: function substitute(chance) {
        var replacer = this.replacers[this.c];

        if (!replacer) {
          throw new Error('Invalid replacement character: "' + this.c + '".');
        }

        return replacer(chance);
      }
    };

    function parseTemplate(template) {
      var tokens = [];
      var mode = 'identity';

      for (var i = 0; i < template.length; i++) {
        var c = template[i];

        switch (mode) {
          case 'escape':
            tokens.push(new EscapeToken(c));
            mode = 'identity';
            break;

          case 'identity':
            if (c === '{') {
              mode = 'replace';
            } else if (c === '\\') {
              mode = 'escape';
            } else {
              tokens.push(new CopyToken(c));
            }

            break;

          case 'replace':
            if (c === '}') {
              mode = 'identity';
            } else {
              tokens.push(new ReplaceToken(c));
            }

            break;
        }
      }

      return tokens;
    }
    /**
     *  Return a random string matching the given template.
     *
     *  The template consists of any number of "character replacement" and
     *  "character literal" sequences. A "character replacement" sequence
     *  starts with a left brace, has any number of special replacement
     *  characters, and ends with a right brace. A character literal can be any
     *  character except a brace or a backslash. A literal brace or backslash
     *  character can be included in the output by escaping with a backslash.
     *
     *  The following replacement characters can be used in a replacement
     *  sequence:
     *
     *      "#": a random digit
     *      "a": a random lower case letter
     *      "A": a random upper case letter
     *
     *  Example: chance.template('{AA###}-{##}')
     *
     *  @param {String} template string.
     *  @returns {String} a random string matching the template.
     */


    Chance.prototype.template = function (template) {
      if (!template) {
        throw new Error('Template string is required');
      }

      var self = this;
      return parseTemplate(template).map(function (token) {
        return token.substitute(self);
      }).join('');
    };
    /**
     *  Return a random buffer
     *
     *  @param {Object} [options={}] can specify a length
     *  @returns {Buffer} a buffer of random length
     *  @throws {RangeError} length cannot be less than zero
     */


    Chance.prototype.buffer = function (options) {
      if (typeof Buffer === 'undefined') {
        throw new UnsupportedError('Sorry, the buffer() function is not supported on your platform');
      }

      options = initOptions(options, {
        length: this.natural({
          min: 5,
          max: 20
        })
      });
      testRange(options.length < 0, "Chance: Length cannot be less than zero.");
      var length = options.length;
      var content = this.n(this.character, length, options);
      return Buffer.from(content);
    }; // -- End Basics --
    // -- Helpers --


    Chance.prototype.capitalize = function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1);
    };

    Chance.prototype.mixin = function (obj) {
      for (var func_name in obj) {
        Chance.prototype[func_name] = obj[func_name];
      }

      return this;
    };
    /**
     *  Given a function that generates something random and a number of items to generate,
     *    return an array of items where none repeat.
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} num number of terms to generate
     *  @param {Object} options any options to pass on to the generator function
     *  @returns {Array} an array of length `num` with every item generated by `fn` and unique
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */


    Chance.prototype.unique = function (fn, num, options) {
      testRange(typeof fn !== "function", "Chance: The first argument must be a function.");

      var comparator = function comparator(arr, val) {
        return arr.indexOf(val) !== -1;
      };

      if (options) {
        comparator = options.comparator || comparator;
      }

      var arr = [],
          count = 0,
          result,
          MAX_DUPLICATES = num * 50,
          params = slice.call(arguments, 2);

      while (arr.length < num) {
        var clonedParams = JSON.parse(JSON.stringify(params));
        result = fn.apply(this, clonedParams);

        if (!comparator(arr, result)) {
          arr.push(result); // reset count when unique found

          count = 0;
        }

        if (++count > MAX_DUPLICATES) {
          throw new RangeError("Chance: num is likely too large for sample set");
        }
      }

      return arr;
    };
    /**
     *  Gives an array of n random terms
     *
     *  @param {Function} fn the function that generates something random
     *  @param {Number} n number of terms to generate
     *  @returns {Array} an array of length `n` with items generated by `fn`
     *
     *  There can be more parameters after these. All additional parameters are provided to the given function
     */


    Chance.prototype.n = function (fn, n) {
      testRange(typeof fn !== "function", "Chance: The first argument must be a function.");

      if (typeof n === 'undefined') {
        n = 1;
      }

      var i = n,
          arr = [],
          params = slice.call(arguments, 2); // Providing a negative count should result in a noop.

      i = Math.max(0, i);

      for (null; i--; null) {
        arr.push(fn.apply(this, params));
      }

      return arr;
    }; // H/T to SO for this one: http://vq.io/OtUrZ5


    Chance.prototype.pad = function (number, width, pad) {
      // Default pad to 0 if none provided
      pad = pad || '0'; // Convert number to a string

      number = number + '';
      return number.length >= width ? number : new Array(width - number.length + 1).join(pad) + number;
    }; // DEPRECATED on 2015-10-01


    Chance.prototype.pick = function (arr, count) {
      if (arr.length === 0) {
        throw new RangeError("Chance: Cannot pick() from an empty array");
      }

      if (!count || count === 1) {
        return arr[this.natural({
          max: arr.length - 1
        })];
      } else {
        return this.shuffle(arr).slice(0, count);
      }
    }; // Given an array, returns a single random element


    Chance.prototype.pickone = function (arr) {
      if (arr.length === 0) {
        throw new RangeError("Chance: Cannot pickone() from an empty array");
      }

      return arr[this.natural({
        max: arr.length - 1
      })];
    }; // Given an array, returns a random set with 'count' elements


    Chance.prototype.pickset = function (arr, count) {
      if (count === 0) {
        return [];
      }

      if (arr.length === 0) {
        throw new RangeError("Chance: Cannot pickset() from an empty array");
      }

      if (count < 0) {
        throw new RangeError("Chance: Count must be a positive number");
      }

      if (!count || count === 1) {
        return [this.pickone(arr)];
      } else {
        var array = arr.slice(0);
        var end = array.length;
        return this.n(function () {
          var index = this.natural({
            max: --end
          });
          var value = array[index];
          array[index] = array[end];
          return value;
        }, Math.min(end, count));
      }
    };

    Chance.prototype.shuffle = function (arr) {
      var new_array = [],
          j = 0,
          length = Number(arr.length),
          source_indexes = range(length),
          last_source_index = length - 1,
          selected_source_index;

      for (var i = 0; i < length; i++) {
        // Pick a random index from the array
        selected_source_index = this.natural({
          max: last_source_index
        });
        j = source_indexes[selected_source_index]; // Add it to the new array

        new_array[i] = arr[j]; // Mark the source index as used

        source_indexes[selected_source_index] = source_indexes[last_source_index];
        last_source_index -= 1;
      }

      return new_array;
    }; // Returns a single item from an array with relative weighting of odds


    Chance.prototype.weighted = function (arr, weights, trim) {
      if (arr.length !== weights.length) {
        throw new RangeError("Chance: Length of array and weights must match");
      } // scan weights array and sum valid entries


      var sum = 0;
      var val;

      for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];

        if (isNaN(val)) {
          throw new RangeError("Chance: All weights must be numbers");
        }

        if (val > 0) {
          sum += val;
        }
      }

      if (sum === 0) {
        throw new RangeError("Chance: No valid entries in array weights");
      } // select a value within range


      var selected = this.random() * sum; // find array entry corresponding to selected value

      var total = 0;
      var lastGoodIdx = -1;
      var chosenIdx;

      for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
        val = weights[weightIndex];
        total += val;

        if (val > 0) {
          if (selected <= total) {
            chosenIdx = weightIndex;
            break;
          }

          lastGoodIdx = weightIndex;
        } // handle any possible rounding error comparison to ensure something is picked


        if (weightIndex === weights.length - 1) {
          chosenIdx = lastGoodIdx;
        }
      }

      var chosen = arr[chosenIdx];
      trim = typeof trim === 'undefined' ? false : trim;

      if (trim) {
        arr.splice(chosenIdx, 1);
        weights.splice(chosenIdx, 1);
      }

      return chosen;
    }; // -- End Helpers --
    // -- Text --


    Chance.prototype.paragraph = function (options) {
      options = initOptions(options);
      var sentences = options.sentences || this.natural({
        min: 3,
        max: 7
      }),
          sentence_array = this.n(this.sentence, sentences),
          separator = options.linebreak === true ? '\n' : ' ';
      return sentence_array.join(separator);
    }; // Could get smarter about this than generating random words and
    // chaining them together. Such as: http://vq.io/1a5ceOh


    Chance.prototype.sentence = function (options) {
      options = initOptions(options);
      var words = options.words || this.natural({
        min: 12,
        max: 18
      }),
          punctuation = options.punctuation,
          text,
          word_array = this.n(this.word, words);
      text = word_array.join(' '); // Capitalize first letter of sentence

      text = this.capitalize(text); // Make sure punctuation has a usable value

      if (punctuation !== false && !/^[.?;!:]$/.test(punctuation)) {
        punctuation = '.';
      } // Add punctuation mark


      if (punctuation) {
        text += punctuation;
      }

      return text;
    };

    Chance.prototype.syllable = function (options) {
      options = initOptions(options);
      var length = options.length || this.natural({
        min: 2,
        max: 3
      }),
          consonants = 'bcdfghjklmnprstvwz',
          // consonants except hard to speak ones
      vowels = 'aeiou',
          // vowels
      all = consonants + vowels,
          // all
      text = '',
          chr; // I'm sure there's a more elegant way to do this, but this works
      // decently well.

      for (var i = 0; i < length; i++) {
        if (i === 0) {
          // First character can be anything
          chr = this.character({
            pool: all
          });
        } else if (consonants.indexOf(chr) === -1) {
          // Last character was a vowel, now we want a consonant
          chr = this.character({
            pool: consonants
          });
        } else {
          // Last character was a consonant, now we want a vowel
          chr = this.character({
            pool: vowels
          });
        }

        text += chr;
      }

      if (options.capitalize) {
        text = this.capitalize(text);
      }

      return text;
    };

    Chance.prototype.word = function (options) {
      options = initOptions(options);
      testRange(options.syllables && options.length, "Chance: Cannot specify both syllables AND length.");
      var syllables = options.syllables || this.natural({
        min: 1,
        max: 3
      }),
          text = '';

      if (options.length) {
        // Either bound word by length
        do {
          text += this.syllable();
        } while (text.length < options.length);

        text = text.substring(0, options.length);
      } else {
        // Or by number of syllables
        for (var i = 0; i < syllables; i++) {
          text += this.syllable();
        }
      }

      if (options.capitalize) {
        text = this.capitalize(text);
      }

      return text;
    }; // -- End Text --
    // -- Person --


    Chance.prototype.age = function (options) {
      options = initOptions(options);
      var ageRange;

      switch (options.type) {
        case 'child':
          ageRange = {
            min: 0,
            max: 12
          };
          break;

        case 'teen':
          ageRange = {
            min: 13,
            max: 19
          };
          break;

        case 'adult':
          ageRange = {
            min: 18,
            max: 65
          };
          break;

        case 'senior':
          ageRange = {
            min: 65,
            max: 100
          };
          break;

        case 'all':
          ageRange = {
            min: 0,
            max: 100
          };
          break;

        default:
          ageRange = {
            min: 18,
            max: 65
          };
          break;
      }

      return this.natural(ageRange);
    };

    Chance.prototype.birthday = function (options) {
      var age = this.age(options);
      var currentYear = new Date().getFullYear();

      if (options && options.type) {
        var min = new Date();
        var max = new Date();
        min.setFullYear(currentYear - age - 1);
        max.setFullYear(currentYear - age);
        options = initOptions(options, {
          min: min,
          max: max
        });
      } else {
        options = initOptions(options, {
          year: currentYear - age
        });
      }

      return this.date(options);
    }; // CPF; ID to identify taxpayers in Brazil


    Chance.prototype.cpf = function (options) {
      options = initOptions(options, {
        formatted: true
      });
      var n = this.n(this.natural, 9, {
        max: 9
      });
      var d1 = n[8] * 2 + n[7] * 3 + n[6] * 4 + n[5] * 5 + n[4] * 6 + n[3] * 7 + n[2] * 8 + n[1] * 9 + n[0] * 10;
      d1 = 11 - d1 % 11;

      if (d1 >= 10) {
        d1 = 0;
      }

      var d2 = d1 * 2 + n[8] * 3 + n[7] * 4 + n[6] * 5 + n[5] * 6 + n[4] * 7 + n[3] * 8 + n[2] * 9 + n[1] * 10 + n[0] * 11;
      d2 = 11 - d2 % 11;

      if (d2 >= 10) {
        d2 = 0;
      }

      var cpf = '' + n[0] + n[1] + n[2] + '.' + n[3] + n[4] + n[5] + '.' + n[6] + n[7] + n[8] + '-' + d1 + d2;
      return options.formatted ? cpf : cpf.replace(/\D/g, '');
    }; // CNPJ: ID to identify companies in Brazil


    Chance.prototype.cnpj = function (options) {
      options = initOptions(options, {
        formatted: true
      });
      var n = this.n(this.natural, 12, {
        max: 12
      });
      var d1 = n[11] * 2 + n[10] * 3 + n[9] * 4 + n[8] * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
      d1 = 11 - d1 % 11;

      if (d1 < 2) {
        d1 = 0;
      }

      var d2 = d1 * 2 + n[11] * 3 + n[10] * 4 + n[9] * 5 + n[8] * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
      d2 = 11 - d2 % 11;

      if (d2 < 2) {
        d2 = 0;
      }

      var cnpj = '' + n[0] + n[1] + '.' + n[2] + n[3] + n[4] + '.' + n[5] + n[6] + n[7] + '/' + n[8] + n[9] + n[10] + n[11] + '-' + d1 + d2;
      return options.formatted ? cnpj : cnpj.replace(/\D/g, '');
    };

    Chance.prototype.first = function (options) {
      options = initOptions(options, {
        gender: this.gender(),
        nationality: 'en'
      });
      return this.pick(this.get("firstNames")[options.gender.toLowerCase()][options.nationality.toLowerCase()]);
    };

    Chance.prototype.profession = function (options) {
      options = initOptions(options);

      if (options.rank) {
        return this.pick(['Apprentice ', 'Junior ', 'Senior ', 'Lead ']) + this.pick(this.get("profession"));
      } else {
        return this.pick(this.get("profession"));
      }
    };

    Chance.prototype.company = function () {
      return this.pick(this.get("company"));
    };

    Chance.prototype.gender = function (options) {
      options = initOptions(options, {
        extraGenders: []
      });
      return this.pick(['Male', 'Female'].concat(options.extraGenders));
    };

    Chance.prototype.last = function (options) {
      options = initOptions(options, {
        nationality: '*'
      });

      if (options.nationality === "*") {
        var allLastNames = [];
        var lastNames = this.get("lastNames");
        Object.keys(lastNames).forEach(function (key) {
          allLastNames = allLastNames.concat(lastNames[key]);
        });
        return this.pick(allLastNames);
      } else {
        return this.pick(this.get("lastNames")[options.nationality.toLowerCase()]);
      }
    };

    Chance.prototype.israelId = function () {
      var x = this.string({
        pool: '0123456789',
        length: 8
      });
      var y = 0;

      for (var i = 0; i < x.length; i++) {
        var thisDigit = x[i] * (i / 2 === parseInt(i / 2) ? 1 : 2);
        thisDigit = this.pad(thisDigit, 2).toString();
        thisDigit = parseInt(thisDigit[0]) + parseInt(thisDigit[1]);
        y = y + thisDigit;
      }

      x = x + (10 - parseInt(y.toString().slice(-1))).toString().slice(-1);
      return x;
    };

    Chance.prototype.mrz = function (options) {
      var checkDigit = function checkDigit(input) {
        var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(''),
            multipliers = [7, 3, 1],
            runningTotal = 0;

        if (typeof input !== 'string') {
          input = input.toString();
        }

        input.split('').forEach(function (character, idx) {
          var pos = alpha.indexOf(character);

          if (pos !== -1) {
            character = pos === 0 ? 0 : pos + 9;
          } else {
            character = parseInt(character, 10);
          }

          character *= multipliers[idx % multipliers.length];
          runningTotal += character;
        });
        return runningTotal % 10;
      };

      var generate = function generate(opts) {
        var pad = function pad(length) {
          return new Array(length + 1).join('<');
        };

        var number = ['P<', opts.issuer, opts.last.toUpperCase(), '<<', opts.first.toUpperCase(), pad(39 - (opts.last.length + opts.first.length + 2)), opts.passportNumber, checkDigit(opts.passportNumber), opts.nationality, opts.dob, checkDigit(opts.dob), opts.gender, opts.expiry, checkDigit(opts.expiry), pad(14), checkDigit(pad(14))].join('');
        return number + checkDigit(number.substr(44, 10) + number.substr(57, 7) + number.substr(65, 7));
      };

      var that = this;
      options = initOptions(options, {
        first: this.first(),
        last: this.last(),
        passportNumber: this.integer({
          min: 100000000,
          max: 999999999
        }),
        dob: function () {
          var date = that.birthday({
            type: 'adult'
          });
          return [date.getFullYear().toString().substr(2), that.pad(date.getMonth() + 1, 2), that.pad(date.getDate(), 2)].join('');
        }(),
        expiry: function () {
          var date = new Date();
          return [(date.getFullYear() + 5).toString().substr(2), that.pad(date.getMonth() + 1, 2), that.pad(date.getDate(), 2)].join('');
        }(),
        gender: this.gender() === 'Female' ? 'F' : 'M',
        issuer: 'GBR',
        nationality: 'GBR'
      });
      return generate(options);
    };

    Chance.prototype.name = function (options) {
      options = initOptions(options);
      var first = this.first(options),
          last = this.last(options),
          name;

      if (options.middle) {
        name = first + ' ' + this.first(options) + ' ' + last;
      } else if (options.middle_initial) {
        name = first + ' ' + this.character({
          alpha: true,
          casing: 'upper'
        }) + '. ' + last;
      } else {
        name = first + ' ' + last;
      }

      if (options.prefix) {
        name = this.prefix(options) + ' ' + name;
      }

      if (options.suffix) {
        name = name + ' ' + this.suffix(options);
      }

      return name;
    }; // Return the list of available name prefixes based on supplied gender.
    // @todo introduce internationalization


    Chance.prototype.name_prefixes = function (gender) {
      gender = gender || "all";
      gender = gender.toLowerCase();
      var prefixes = [{
        name: 'Doctor',
        abbreviation: 'Dr.'
      }];

      if (gender === "male" || gender === "all") {
        prefixes.push({
          name: 'Mister',
          abbreviation: 'Mr.'
        });
      }

      if (gender === "female" || gender === "all") {
        prefixes.push({
          name: 'Miss',
          abbreviation: 'Miss'
        });
        prefixes.push({
          name: 'Misses',
          abbreviation: 'Mrs.'
        });
      }

      return prefixes;
    }; // Alias for name_prefix


    Chance.prototype.prefix = function (options) {
      return this.name_prefix(options);
    };

    Chance.prototype.name_prefix = function (options) {
      options = initOptions(options, {
        gender: "all"
      });
      return options.full ? this.pick(this.name_prefixes(options.gender)).name : this.pick(this.name_prefixes(options.gender)).abbreviation;
    }; //Hungarian ID number


    Chance.prototype.HIDN = function () {
      //Hungarian ID nuber structure: XXXXXXYY (X=number,Y=Capital Latin letter)
      var idn_pool = "0123456789";
      var idn_chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYXZ";
      var idn = "";
      idn += this.string({
        pool: idn_pool,
        length: 6
      });
      idn += this.string({
        pool: idn_chrs,
        length: 2
      });
      return idn;
    };

    Chance.prototype.ssn = function (options) {
      options = initOptions(options, {
        ssnFour: false,
        dashes: true
      });
      var ssn_pool = "1234567890",
          ssn,
          dash = options.dashes ? '-' : '';

      if (!options.ssnFour) {
        ssn = this.string({
          pool: ssn_pool,
          length: 3
        }) + dash + this.string({
          pool: ssn_pool,
          length: 2
        }) + dash + this.string({
          pool: ssn_pool,
          length: 4
        });
      } else {
        ssn = this.string({
          pool: ssn_pool,
          length: 4
        });
      }

      return ssn;
    }; // Aadhar is similar to ssn, used in India to uniquely identify a person


    Chance.prototype.aadhar = function (options) {
      options = initOptions(options, {
        onlyLastFour: false,
        separatedByWhiteSpace: true
      });
      var aadhar_pool = "1234567890",
          aadhar,
          whiteSpace = options.separatedByWhiteSpace ? ' ' : '';

      if (!options.onlyLastFour) {
        aadhar = this.string({
          pool: aadhar_pool,
          length: 4
        }) + whiteSpace + this.string({
          pool: aadhar_pool,
          length: 4
        }) + whiteSpace + this.string({
          pool: aadhar_pool,
          length: 4
        });
      } else {
        aadhar = this.string({
          pool: aadhar_pool,
          length: 4
        });
      }

      return aadhar;
    }; // Return the list of available name suffixes
    // @todo introduce internationalization


    Chance.prototype.name_suffixes = function () {
      var suffixes = [{
        name: 'Doctor of Osteopathic Medicine',
        abbreviation: 'D.O.'
      }, {
        name: 'Doctor of Philosophy',
        abbreviation: 'Ph.D.'
      }, {
        name: 'Esquire',
        abbreviation: 'Esq.'
      }, {
        name: 'Junior',
        abbreviation: 'Jr.'
      }, {
        name: 'Juris Doctor',
        abbreviation: 'J.D.'
      }, {
        name: 'Master of Arts',
        abbreviation: 'M.A.'
      }, {
        name: 'Master of Business Administration',
        abbreviation: 'M.B.A.'
      }, {
        name: 'Master of Science',
        abbreviation: 'M.S.'
      }, {
        name: 'Medical Doctor',
        abbreviation: 'M.D.'
      }, {
        name: 'Senior',
        abbreviation: 'Sr.'
      }, {
        name: 'The Third',
        abbreviation: 'III'
      }, {
        name: 'The Fourth',
        abbreviation: 'IV'
      }, {
        name: 'Bachelor of Engineering',
        abbreviation: 'B.E'
      }, {
        name: 'Bachelor of Technology',
        abbreviation: 'B.TECH'
      }];
      return suffixes;
    }; // Alias for name_suffix


    Chance.prototype.suffix = function (options) {
      return this.name_suffix(options);
    };

    Chance.prototype.name_suffix = function (options) {
      options = initOptions(options);
      return options.full ? this.pick(this.name_suffixes()).name : this.pick(this.name_suffixes()).abbreviation;
    };

    Chance.prototype.nationalities = function () {
      return this.get("nationalities");
    }; // Generate random nationality based on json list


    Chance.prototype.nationality = function () {
      var nationality = this.pick(this.nationalities());
      return nationality.name;
    }; // -- End Person --
    // -- Mobile --
    // Android GCM Registration ID


    Chance.prototype.android_id = function () {
      return "APA91" + this.string({
        pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
        length: 178
      });
    }; // Apple Push Token


    Chance.prototype.apple_token = function () {
      return this.string({
        pool: "abcdef1234567890",
        length: 64
      });
    }; // Windows Phone 8 ANID2


    Chance.prototype.wp8_anid2 = function () {
      return base64(this.hash({
        length: 32
      }));
    }; // Windows Phone 7 ANID


    Chance.prototype.wp7_anid = function () {
      return 'A=' + this.guid().replace(/-/g, '').toUpperCase() + '&E=' + this.hash({
        length: 3
      }) + '&W=' + this.integer({
        min: 0,
        max: 9
      });
    }; // BlackBerry Device PIN


    Chance.prototype.bb_pin = function () {
      return this.hash({
        length: 8
      });
    }; // -- End Mobile --
    // -- Web --


    Chance.prototype.avatar = function (options) {
      var url = null;
      var URL_BASE = '//www.gravatar.com/avatar/';
      var PROTOCOLS = {
        http: 'http',
        https: 'https'
      };
      var FILE_TYPES = {
        bmp: 'bmp',
        gif: 'gif',
        jpg: 'jpg',
        png: 'png'
      };
      var FALLBACKS = {
        '404': '404',
        // Return 404 if not found
        mm: 'mm',
        // Mystery man
        identicon: 'identicon',
        // Geometric pattern based on hash
        monsterid: 'monsterid',
        // A generated monster icon
        wavatar: 'wavatar',
        // A generated face
        retro: 'retro',
        // 8-bit icon
        blank: 'blank' // A transparent png

      };
      var RATINGS = {
        g: 'g',
        pg: 'pg',
        r: 'r',
        x: 'x'
      };
      var opts = {
        protocol: null,
        email: null,
        fileExtension: null,
        size: null,
        fallback: null,
        rating: null
      };

      if (!options) {
        // Set to a random email
        opts.email = this.email();
        options = {};
      } else if (typeof options === 'string') {
        opts.email = options;
        options = {};
      } else if (_typeof_1(options) !== 'object') {
        return null;
      } else if (options.constructor === 'Array') {
        return null;
      }

      opts = initOptions(options, opts);

      if (!opts.email) {
        // Set to a random email
        opts.email = this.email();
      } // Safe checking for params


      opts.protocol = PROTOCOLS[opts.protocol] ? opts.protocol + ':' : '';
      opts.size = parseInt(opts.size, 0) ? opts.size : '';
      opts.rating = RATINGS[opts.rating] ? opts.rating : '';
      opts.fallback = FALLBACKS[opts.fallback] ? opts.fallback : '';
      opts.fileExtension = FILE_TYPES[opts.fileExtension] ? opts.fileExtension : '';
      url = opts.protocol + URL_BASE + this.bimd5.md5(opts.email) + (opts.fileExtension ? '.' + opts.fileExtension : '') + (opts.size || opts.rating || opts.fallback ? '?' : '') + (opts.size ? '&s=' + opts.size.toString() : '') + (opts.rating ? '&r=' + opts.rating : '') + (opts.fallback ? '&d=' + opts.fallback : '');
      return url;
    };
    /**
     * #Description:
     * ===============================================
     * Generate random color value base on color type:
     * -> hex
     * -> rgb
     * -> rgba
     * -> 0x
     * -> named color
     *
     * #Examples:
     * ===============================================
     * * Geerate random hex color
     * chance.color() => '#79c157' / 'rgb(110,52,164)' / '0x67ae0b' / '#e2e2e2' / '#29CFA7'
     *
     * * Generate Hex based color value
     * chance.color({format: 'hex'})    => '#d67118'
     *
     * * Generate simple rgb value
     * chance.color({format: 'rgb'})    => 'rgb(110,52,164)'
     *
     * * Generate Ox based color value
     * chance.color({format: '0x'})     => '0x67ae0b'
     *
     * * Generate graiscale based value
     * chance.color({grayscale: true})  => '#e2e2e2'
     *
     * * Return valide color name
     * chance.color({format: 'name'})   => 'red'
     *
     * * Make color uppercase
     * chance.color({casing: 'upper'})  => '#29CFA7'
     *
     * * Min Max values for RGBA
     * var light_red = chance.color({format: 'hex', min_red: 200, max_red: 255, max_green: 0, max_blue: 0, min_alpha: .2, max_alpha: .3});
     *
     * @param  [object] options
     * @return [string] color value
     */


    Chance.prototype.color = function (options) {
      function gray(value, delimiter) {
        return [value, value, value].join(delimiter || '');
      }

      function rgb(hasAlpha) {
        var rgbValue = hasAlpha ? 'rgba' : 'rgb';
        var alphaChannel = hasAlpha ? ',' + this.floating({
          min: min_alpha,
          max: max_alpha
        }) : "";
        var colorValue = isGrayscale ? gray(this.natural({
          min: min_rgb,
          max: max_rgb
        }), ',') : this.natural({
          min: min_green,
          max: max_green
        }) + ',' + this.natural({
          min: min_blue,
          max: max_blue
        }) + ',' + this.natural({
          max: 255
        });
        return rgbValue + '(' + colorValue + alphaChannel + ')';
      }

      function hex(start, end, withHash) {
        var symbol = withHash ? "#" : "";
        var hexstring = "";

        if (isGrayscale) {
          hexstring = gray(this.pad(this.hex({
            min: min_rgb,
            max: max_rgb
          }), 2));

          if (options.format === "shorthex") {
            hexstring = gray(this.hex({
              min: 0,
              max: 15
            }));
          }
        } else {
          if (options.format === "shorthex") {
            hexstring = this.pad(this.hex({
              min: Math.floor(min_red / 16),
              max: Math.floor(max_red / 16)
            }), 1) + this.pad(this.hex({
              min: Math.floor(min_green / 16),
              max: Math.floor(max_green / 16)
            }), 1) + this.pad(this.hex({
              min: Math.floor(min_blue / 16),
              max: Math.floor(max_blue / 16)
            }), 1);
          } else if (min_red !== undefined || max_red !== undefined || min_green !== undefined || max_green !== undefined || min_blue !== undefined || max_blue !== undefined) {
            hexstring = this.pad(this.hex({
              min: min_red,
              max: max_red
            }), 2) + this.pad(this.hex({
              min: min_green,
              max: max_green
            }), 2) + this.pad(this.hex({
              min: min_blue,
              max: max_blue
            }), 2);
          } else {
            hexstring = this.pad(this.hex({
              min: min_rgb,
              max: max_rgb
            }), 2) + this.pad(this.hex({
              min: min_rgb,
              max: max_rgb
            }), 2) + this.pad(this.hex({
              min: min_rgb,
              max: max_rgb
            }), 2);
          }
        }

        return symbol + hexstring;
      }

      options = initOptions(options, {
        format: this.pick(['hex', 'shorthex', 'rgb', 'rgba', '0x', 'name']),
        grayscale: false,
        casing: 'lower',
        min: 0,
        max: 255,
        min_red: undefined,
        max_red: undefined,
        min_green: undefined,
        max_green: undefined,
        min_blue: undefined,
        max_blue: undefined,
        min_alpha: 0,
        max_alpha: 1
      });
      var isGrayscale = options.grayscale;
      var min_rgb = options.min;
      var max_rgb = options.max;
      var min_red = options.min_red;
      var max_red = options.max_red;
      var min_green = options.min_green;
      var max_green = options.max_green;
      var min_blue = options.min_blue;
      var max_blue = options.max_blue;
      var min_alpha = options.min_alpha;
      var max_alpha = options.max_alpha;

      if (options.min_red === undefined) {
        min_red = min_rgb;
      }

      if (options.max_red === undefined) {
        max_red = max_rgb;
      }

      if (options.min_green === undefined) {
        min_green = min_rgb;
      }

      if (options.max_green === undefined) {
        max_green = max_rgb;
      }

      if (options.min_blue === undefined) {
        min_blue = min_rgb;
      }

      if (options.max_blue === undefined) {
        max_blue = max_rgb;
      }

      if (options.min_alpha === undefined) {
        min_alpha = 0;
      }

      if (options.max_alpha === undefined) {
        max_alpha = 1;
      }

      if (isGrayscale && min_rgb === 0 && max_rgb === 255 && min_red !== undefined && max_red !== undefined) {
        min_rgb = (min_red + min_green + min_blue) / 3;
        max_rgb = (max_red + max_green + max_blue) / 3;
      }

      var colorValue;

      if (options.format === 'hex') {
        colorValue = hex.call(this, 2, 6, true);
      } else if (options.format === 'shorthex') {
        colorValue = hex.call(this, 1, 3, true);
      } else if (options.format === 'rgb') {
        colorValue = rgb.call(this, false);
      } else if (options.format === 'rgba') {
        colorValue = rgb.call(this, true);
      } else if (options.format === '0x') {
        colorValue = '0x' + hex.call(this, 2, 6);
      } else if (options.format === 'name') {
        return this.pick(this.get("colorNames"));
      } else {
        throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", "0x" or "name".');
      }

      if (options.casing === 'upper') {
        colorValue = colorValue.toUpperCase();
      }

      return colorValue;
    };

    Chance.prototype.domain = function (options) {
      options = initOptions(options);
      return this.word() + '.' + (options.tld || this.tld());
    };

    Chance.prototype.email = function (options) {
      options = initOptions(options);
      return this.word({
        length: options.length
      }) + '@' + (options.domain || this.domain());
    };
    /**
     * #Description:
     * ===============================================
     * Generate a random Facebook id, aka fbid.
     *
     * NOTE: At the moment (Sep 2017), Facebook ids are
     * "numeric strings" of length 16.
     * However, Facebook Graph API documentation states that
     * "it is extremely likely to change over time".
     * @see https://developers.facebook.com/docs/graph-api/overview/
     *
     * #Examples:
     * ===============================================
     * chance.fbid() => '1000035231661304'
     *
     * @return [string] facebook id
     */


    Chance.prototype.fbid = function () {
      return '10000' + this.string({
        pool: "1234567890",
        length: 11
      });
    };

    Chance.prototype.google_analytics = function () {
      var account = this.pad(this.natural({
        max: 999999
      }), 6);
      var property = this.pad(this.natural({
        max: 99
      }), 2);
      return 'UA-' + account + '-' + property;
    };

    Chance.prototype.hashtag = function () {
      return '#' + this.word();
    };

    Chance.prototype.ip = function () {
      // Todo: This could return some reserved IPs. See http://vq.io/137dgYy
      // this should probably be updated to account for that rare as it may be
      return this.natural({
        min: 1,
        max: 254
      }) + '.' + this.natural({
        max: 255
      }) + '.' + this.natural({
        max: 255
      }) + '.' + this.natural({
        min: 1,
        max: 254
      });
    };

    Chance.prototype.ipv6 = function () {
      var ip_addr = this.n(this.hash, 8, {
        length: 4
      });
      return ip_addr.join(":");
    };

    Chance.prototype.klout = function () {
      return this.natural({
        min: 1,
        max: 99
      });
    };

    Chance.prototype.semver = function (options) {
      options = initOptions(options, {
        include_prerelease: true
      });
      var range = this.pickone(["^", "~", "<", ">", "<=", ">=", "="]);

      if (options.range) {
        range = options.range;
      }

      var prerelease = "";

      if (options.include_prerelease) {
        prerelease = this.weighted(["", "-dev", "-beta", "-alpha"], [50, 10, 5, 1]);
      }

      return range + this.rpg('3d10').join('.') + prerelease;
    };

    Chance.prototype.tlds = function () {
      return ['com', 'org', 'edu', 'gov', 'co.uk', 'net', 'io', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'];
    };

    Chance.prototype.tld = function () {
      return this.pick(this.tlds());
    };

    Chance.prototype.twitter = function () {
      return '@' + this.word();
    };

    Chance.prototype.url = function (options) {
      options = initOptions(options, {
        protocol: "http",
        domain: this.domain(options),
        domain_prefix: "",
        path: this.word(),
        extensions: []
      });
      var extension = options.extensions.length > 0 ? "." + this.pick(options.extensions) : "";
      var domain = options.domain_prefix ? options.domain_prefix + "." + options.domain : options.domain;
      return options.protocol + "://" + domain + "/" + options.path + extension;
    };

    Chance.prototype.port = function () {
      return this.integer({
        min: 0,
        max: 65535
      });
    };

    Chance.prototype.locale = function (options) {
      options = initOptions(options);

      if (options.region) {
        return this.pick(this.get("locale_regions"));
      } else {
        return this.pick(this.get("locale_languages"));
      }
    };

    Chance.prototype.locales = function (options) {
      options = initOptions(options);

      if (options.region) {
        return this.get("locale_regions");
      } else {
        return this.get("locale_languages");
      }
    };

    Chance.prototype.loremPicsum = function (options) {
      options = initOptions(options, {
        width: 500,
        height: 500,
        greyscale: false,
        blurred: false
      });
      var greyscale = options.greyscale ? 'g/' : '';
      var query = options.blurred ? '/?blur' : '/?random';
      return 'https://picsum.photos/' + greyscale + options.width + '/' + options.height + query;
    }; // -- End Web --
    // -- Location --


    Chance.prototype.address = function (options) {
      options = initOptions(options);
      return this.natural({
        min: 5,
        max: 2000
      }) + ' ' + this.street(options);
    };

    Chance.prototype.altitude = function (options) {
      options = initOptions(options, {
        fixed: 5,
        min: 0,
        max: 8848
      });
      return this.floating({
        min: options.min,
        max: options.max,
        fixed: options.fixed
      });
    };

    Chance.prototype.areacode = function (options) {
      options = initOptions(options, {
        parens: true
      }); // Don't want area codes to start with 1, or have a 9 as the second digit

      var areacode = this.natural({
        min: 2,
        max: 9
      }).toString() + this.natural({
        min: 0,
        max: 8
      }).toString() + this.natural({
        min: 0,
        max: 9
      }).toString();
      return options.parens ? '(' + areacode + ')' : areacode;
    };

    Chance.prototype.city = function () {
      return this.capitalize(this.word({
        syllables: 3
      }));
    };

    Chance.prototype.coordinates = function (options) {
      return this.latitude(options) + ', ' + this.longitude(options);
    };

    Chance.prototype.countries = function () {
      return this.get("countries");
    };

    Chance.prototype.country = function (options) {
      options = initOptions(options);
      var country = this.pick(this.countries());
      return options.raw ? country : options.full ? country.name : country.abbreviation;
    };

    Chance.prototype.depth = function (options) {
      options = initOptions(options, {
        fixed: 5,
        min: -10994,
        max: 0
      });
      return this.floating({
        min: options.min,
        max: options.max,
        fixed: options.fixed
      });
    };

    Chance.prototype.geohash = function (options) {
      options = initOptions(options, {
        length: 7
      });
      return this.string({
        length: options.length,
        pool: '0123456789bcdefghjkmnpqrstuvwxyz'
      });
    };

    Chance.prototype.geojson = function (options) {
      return this.latitude(options) + ', ' + this.longitude(options) + ', ' + this.altitude(options);
    };

    Chance.prototype.latitude = function (options) {
      // Constants - Formats
      var DDM = 'ddm',
          DMS = 'dms',
          DD = 'dd';
      options = initOptions(options, options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? {
        min: 0,
        max: 89,
        fixed: 4
      } : {
        fixed: 5,
        min: -90,
        max: 90,
        format: DD
      });
      var format = options.format.toLowerCase();

      if (format === DDM || format === DMS) {
        testRange(options.min < 0 || options.min > 89, "Chance: Min specified is out of range. Should be between 0 - 89");
        testRange(options.max < 0 || options.max > 89, "Chance: Max specified is out of range. Should be between 0 - 89");
        testRange(options.fixed > 4, 'Chance: Fixed specified should be below or equal to 4');
      }

      switch (format) {
        case DDM:
          {
            return this.integer({
              min: options.min,
              max: options.max
            }) + '°' + this.floating({
              min: 0,
              max: 59,
              fixed: options.fixed
            });
          }

        case DMS:
          {
            return this.integer({
              min: options.min,
              max: options.max
            }) + '°' + this.integer({
              min: 0,
              max: 59
            }) + '’' + this.floating({
              min: 0,
              max: 59,
              fixed: options.fixed
            }) + '”';
          }

        case DD:
        default:
          {
            return this.floating({
              min: options.min,
              max: options.max,
              fixed: options.fixed
            });
          }
      }
    };

    Chance.prototype.longitude = function (options) {
      // Constants - Formats
      var DDM = 'ddm',
          DMS = 'dms',
          DD = 'dd';
      options = initOptions(options, options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? {
        min: 0,
        max: 179,
        fixed: 4
      } : {
        fixed: 5,
        min: -180,
        max: 180,
        format: DD
      });
      var format = options.format.toLowerCase();

      if (format === DDM || format === DMS) {
        testRange(options.min < 0 || options.min > 179, "Chance: Min specified is out of range. Should be between 0 - 179");
        testRange(options.max < 0 || options.max > 179, "Chance: Max specified is out of range. Should be between 0 - 179");
        testRange(options.fixed > 4, 'Chance: Fixed specified should be below or equal to 4');
      }

      switch (format) {
        case DDM:
          {
            return this.integer({
              min: options.min,
              max: options.max
            }) + '°' + this.floating({
              min: 0,
              max: 59.9999,
              fixed: options.fixed
            });
          }

        case DMS:
          {
            return this.integer({
              min: options.min,
              max: options.max
            }) + '°' + this.integer({
              min: 0,
              max: 59
            }) + '’' + this.floating({
              min: 0,
              max: 59.9999,
              fixed: options.fixed
            }) + '”';
          }

        case DD:
        default:
          {
            return this.floating({
              min: options.min,
              max: options.max,
              fixed: options.fixed
            });
          }
      }
    };

    Chance.prototype.phone = function (options) {
      var self = this,
          numPick,
          ukNum = function ukNum(parts) {
        var section = []; //fills the section part of the phone number with random numbers.

        parts.sections.forEach(function (n) {
          section.push(self.string({
            pool: '0123456789',
            length: n
          }));
        });
        return parts.area + section.join(' ');
      };

      options = initOptions(options, {
        formatted: true,
        country: 'us',
        mobile: false
      });

      if (!options.formatted) {
        options.parens = false;
      }

      var phone;

      switch (options.country) {
        case 'fr':
          if (!options.mobile) {
            numPick = this.pick([// Valid zone and département codes.
            '01' + this.pick(['30', '34', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '53', '55', '56', '58', '60', '64', '69', '70', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83']) + self.string({
              pool: '0123456789',
              length: 6
            }), '02' + this.pick(['14', '18', '22', '23', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '41', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '56', '57', '61', '62', '69', '72', '76', '77', '78', '85', '90', '96', '97', '98', '99']) + self.string({
              pool: '0123456789',
              length: 6
            }), '03' + this.pick(['10', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '39', '44', '45', '51', '52', '54', '55', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90']) + self.string({
              pool: '0123456789',
              length: 6
            }), '04' + this.pick(['11', '13', '15', '20', '22', '26', '27', '30', '32', '34', '37', '42', '43', '44', '50', '56', '57', '63', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '92', '93', '94', '95', '97', '98']) + self.string({
              pool: '0123456789',
              length: 6
            }), '05' + this.pick(['08', '16', '17', '19', '24', '31', '32', '33', '34', '35', '40', '45', '46', '47', '49', '53', '55', '56', '57', '58', '59', '61', '62', '63', '64', '65', '67', '79', '81', '82', '86', '87', '90', '94']) + self.string({
              pool: '0123456789',
              length: 6
            }), '09' + self.string({
              pool: '0123456789',
              length: 8
            })]);
            phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
          } else {
            numPick = this.pick(['06', '07']) + self.string({
              pool: '0123456789',
              length: 8
            });
            phone = options.formatted ? numPick.match(/../g).join(' ') : numPick;
          }

          break;

        case 'uk':
          if (!options.mobile) {
            numPick = this.pick([//valid area codes of major cities/counties followed by random numbers in required format.
            {
              area: '01' + this.character({
                pool: '234569'
              }) + '1 ',
              sections: [3, 4]
            }, {
              area: '020 ' + this.character({
                pool: '378'
              }),
              sections: [3, 4]
            }, {
              area: '023 ' + this.character({
                pool: '89'
              }),
              sections: [3, 4]
            }, {
              area: '024 7',
              sections: [3, 4]
            }, {
              area: '028 ' + this.pick(['25', '28', '37', '71', '82', '90', '92', '95']),
              sections: [2, 4]
            }, {
              area: '012' + this.pick(['04', '08', '54', '76', '97', '98']) + ' ',
              sections: [6]
            }, {
              area: '013' + this.pick(['63', '64', '84', '86']) + ' ',
              sections: [6]
            }, {
              area: '014' + this.pick(['04', '20', '60', '61', '80', '88']) + ' ',
              sections: [6]
            }, {
              area: '015' + this.pick(['24', '27', '62', '66']) + ' ',
              sections: [6]
            }, {
              area: '016' + this.pick(['06', '29', '35', '47', '59', '95']) + ' ',
              sections: [6]
            }, {
              area: '017' + this.pick(['26', '44', '50', '68']) + ' ',
              sections: [6]
            }, {
              area: '018' + this.pick(['27', '37', '84', '97']) + ' ',
              sections: [6]
            }, {
              area: '019' + this.pick(['00', '05', '35', '46', '49', '63', '95']) + ' ',
              sections: [6]
            }]);
            phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '', 'g');
          } else {
            numPick = this.pick([{
              area: '07' + this.pick(['4', '5', '7', '8', '9']),
              sections: [2, 6]
            }, {
              area: '07624 ',
              sections: [6]
            }]);
            phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(' ', '');
          }

          break;

        case 'za':
          if (!options.mobile) {
            numPick = this.pick(['01' + this.pick(['0', '1', '2', '3', '4', '5', '6', '7', '8']) + self.string({
              pool: '0123456789',
              length: 7
            }), '02' + this.pick(['1', '2', '3', '4', '7', '8']) + self.string({
              pool: '0123456789',
              length: 7
            }), '03' + this.pick(['1', '2', '3', '5', '6', '9']) + self.string({
              pool: '0123456789',
              length: 7
            }), '04' + this.pick(['1', '2', '3', '4', '5', '6', '7', '8', '9']) + self.string({
              pool: '0123456789',
              length: 7
            }), '05' + this.pick(['1', '3', '4', '6', '7', '8']) + self.string({
              pool: '0123456789',
              length: 7
            })]);
            phone = options.formatted || numPick;
          } else {
            numPick = this.pick(['060' + this.pick(['3', '4', '5', '6', '7', '8', '9']) + self.string({
              pool: '0123456789',
              length: 6
            }), '061' + this.pick(['0', '1', '2', '3', '4', '5', '8']) + self.string({
              pool: '0123456789',
              length: 6
            }), '06' + self.string({
              pool: '0123456789',
              length: 7
            }), '071' + this.pick(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) + self.string({
              pool: '0123456789',
              length: 6
            }), '07' + this.pick(['2', '3', '4', '6', '7', '8', '9']) + self.string({
              pool: '0123456789',
              length: 7
            }), '08' + this.pick(['0', '1', '2', '3', '4', '5']) + self.string({
              pool: '0123456789',
              length: 7
            })]);
            phone = options.formatted || numPick;
          }

          break;

        case 'us':
          var areacode = this.areacode(options).toString();
          var exchange = this.natural({
            min: 2,
            max: 9
          }).toString() + this.natural({
            min: 0,
            max: 9
          }).toString() + this.natural({
            min: 0,
            max: 9
          }).toString();
          var subscriber = this.natural({
            min: 1000,
            max: 9999
          }).toString(); // this could be random [0-9]{4}

          phone = options.formatted ? areacode + ' ' + exchange + '-' + subscriber : areacode + exchange + subscriber;
          break;

        case 'br':
          var areaCode = this.pick(["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"]);
          var prefix;

          if (options.mobile) {
            // Brasilian official reference (mobile): http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=330
            prefix = '9' + self.string({
              pool: '0123456789',
              length: 4
            });
          } else {
            // Brasilian official reference: http://www.anatel.gov.br/setorregulado/plano-de-numeracao-brasileiro?id=331
            prefix = this.natural({
              min: 2000,
              max: 5999
            }).toString();
          }

          var mcdu = self.string({
            pool: '0123456789',
            length: 4
          });
          phone = options.formatted ? '(' + areaCode + ') ' + prefix + '-' + mcdu : areaCode + prefix + mcdu;
          break;
      }

      return phone;
    };

    Chance.prototype.postal = function () {
      // Postal District
      var pd = this.character({
        pool: "XVTSRPNKLMHJGECBA"
      }); // Forward Sortation Area (FSA)

      var fsa = pd + this.natural({
        max: 9
      }) + this.character({
        alpha: true,
        casing: "upper"
      }); // Local Delivery Unut (LDU)

      var ldu = this.natural({
        max: 9
      }) + this.character({
        alpha: true,
        casing: "upper"
      }) + this.natural({
        max: 9
      });
      return fsa + " " + ldu;
    };

    Chance.prototype.postcode = function () {
      // Area
      var area = this.pick(this.get("postcodeAreas")).code; // District

      var district = this.natural({
        max: 9
      }); // Sub-District

      var subDistrict = this.bool() ? this.character({
        alpha: true,
        casing: "upper"
      }) : ""; // Outward Code

      var outward = area + district + subDistrict; // Sector

      var sector = this.natural({
        max: 9
      }); // Unit

      var unit = this.character({
        alpha: true,
        casing: "upper"
      }) + this.character({
        alpha: true,
        casing: "upper"
      }); // Inward Code

      var inward = sector + unit;
      return outward + " " + inward;
    };

    Chance.prototype.counties = function (options) {
      options = initOptions(options, {
        country: 'uk'
      });
      return this.get("counties")[options.country.toLowerCase()];
    };

    Chance.prototype.county = function (options) {
      return this.pick(this.counties(options)).name;
    };

    Chance.prototype.provinces = function (options) {
      options = initOptions(options, {
        country: 'ca'
      });
      return this.get("provinces")[options.country.toLowerCase()];
    };

    Chance.prototype.province = function (options) {
      return options && options.full ? this.pick(this.provinces(options)).name : this.pick(this.provinces(options)).abbreviation;
    };

    Chance.prototype.state = function (options) {
      return options && options.full ? this.pick(this.states(options)).name : this.pick(this.states(options)).abbreviation;
    };

    Chance.prototype.states = function (options) {
      options = initOptions(options, {
        country: 'us',
        us_states_and_dc: true
      });
      var states;

      switch (options.country.toLowerCase()) {
        case 'us':
          var us_states_and_dc = this.get("us_states_and_dc"),
              territories = this.get("territories"),
              armed_forces = this.get("armed_forces");
          states = [];

          if (options.us_states_and_dc) {
            states = states.concat(us_states_and_dc);
          }

          if (options.territories) {
            states = states.concat(territories);
          }

          if (options.armed_forces) {
            states = states.concat(armed_forces);
          }

          break;

        case 'it':
        case 'mx':
          states = this.get("country_regions")[options.country.toLowerCase()];
          break;

        case 'uk':
          states = this.get("counties")[options.country.toLowerCase()];
          break;
      }

      return states;
    };

    Chance.prototype.street = function (options) {
      options = initOptions(options, {
        country: 'us',
        syllables: 2
      });
      var street;

      switch (options.country.toLowerCase()) {
        case 'us':
          street = this.word({
            syllables: options.syllables
          });
          street = this.capitalize(street);
          street += ' ';
          street += options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name;
          break;

        case 'it':
          street = this.word({
            syllables: options.syllables
          });
          street = this.capitalize(street);
          street = (options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name) + " " + street;
          break;
      }

      return street;
    };

    Chance.prototype.street_suffix = function (options) {
      options = initOptions(options, {
        country: 'us'
      });
      return this.pick(this.street_suffixes(options));
    };

    Chance.prototype.street_suffixes = function (options) {
      options = initOptions(options, {
        country: 'us'
      }); // These are the most common suffixes.

      return this.get("street_suffixes")[options.country.toLowerCase()];
    }; // Note: only returning US zip codes, internationalization will be a whole
    // other beast to tackle at some point.


    Chance.prototype.zip = function (options) {
      var zip = this.n(this.natural, 5, {
        max: 9
      });

      if (options && options.plusfour === true) {
        zip.push('-');
        zip = zip.concat(this.n(this.natural, 4, {
          max: 9
        }));
      }

      return zip.join("");
    }; // -- End Location --
    // -- Time


    Chance.prototype.ampm = function () {
      return this.bool() ? 'am' : 'pm';
    };

    Chance.prototype.date = function (options) {
      var date_string, date; // If interval is specified we ignore preset

      if (options && (options.min || options.max)) {
        options = initOptions(options, {
          american: true,
          string: false
        });
        var min = typeof options.min !== "undefined" ? options.min.getTime() : 1; // 100,000,000 days measured relative to midnight at the beginning of 01 January, 1970 UTC. http://es5.github.io/#x15.9.1.1

        var max = typeof options.max !== "undefined" ? options.max.getTime() : 8640000000000000;
        date = new Date(this.integer({
          min: min,
          max: max
        }));
      } else {
        var m = this.month({
          raw: true
        });
        var daysInMonth = m.days;

        if (options && options.month) {
          // Mod 12 to allow months outside range of 0-11 (not encouraged, but also not prevented).
          daysInMonth = this.get('months')[(options.month % 12 + 12) % 12].days;
        }

        options = initOptions(options, {
          year: parseInt(this.year(), 10),
          // Necessary to subtract 1 because Date() 0-indexes month but not day or year
          // for some reason.
          month: m.numeric - 1,
          day: this.natural({
            min: 1,
            max: daysInMonth
          }),
          hour: this.hour({
            twentyfour: true
          }),
          minute: this.minute(),
          second: this.second(),
          millisecond: this.millisecond(),
          american: true,
          string: false
        });
        date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second, options.millisecond);
      }

      if (options.american) {
        // Adding 1 to the month is necessary because Date() 0-indexes
        // months but not day for some odd reason.
        date_string = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
      } else {
        date_string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      }

      return options.string ? date_string : date;
    };

    Chance.prototype.hammertime = function (options) {
      return this.date(options).getTime();
    };

    Chance.prototype.hour = function (options) {
      options = initOptions(options, {
        min: options && options.twentyfour ? 0 : 1,
        max: options && options.twentyfour ? 23 : 12
      });
      testRange(options.min < 0, "Chance: Min cannot be less than 0.");
      testRange(options.twentyfour && options.max > 23, "Chance: Max cannot be greater than 23 for twentyfour option.");
      testRange(!options.twentyfour && options.max > 12, "Chance: Max cannot be greater than 12.");
      testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
      return this.natural({
        min: options.min,
        max: options.max
      });
    };

    Chance.prototype.millisecond = function () {
      return this.natural({
        max: 999
      });
    };

    Chance.prototype.minute = Chance.prototype.second = function (options) {
      options = initOptions(options, {
        min: 0,
        max: 59
      });
      testRange(options.min < 0, "Chance: Min cannot be less than 0.");
      testRange(options.max > 59, "Chance: Max cannot be greater than 59.");
      testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
      return this.natural({
        min: options.min,
        max: options.max
      });
    };

    Chance.prototype.month = function (options) {
      options = initOptions(options, {
        min: 1,
        max: 12
      });
      testRange(options.min < 1, "Chance: Min cannot be less than 1.");
      testRange(options.max > 12, "Chance: Max cannot be greater than 12.");
      testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
      var month = this.pick(this.months().slice(options.min - 1, options.max));
      return options.raw ? month : month.name;
    };

    Chance.prototype.months = function () {
      return this.get("months");
    };

    Chance.prototype.second = function () {
      return this.natural({
        max: 59
      });
    };

    Chance.prototype.timestamp = function () {
      return this.natural({
        min: 1,
        max: parseInt(new Date().getTime() / 1000, 10)
      });
    };

    Chance.prototype.weekday = function (options) {
      options = initOptions(options, {
        weekday_only: false
      });
      var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

      if (!options.weekday_only) {
        weekdays.push("Saturday");
        weekdays.push("Sunday");
      }

      return this.pickone(weekdays);
    };

    Chance.prototype.year = function (options) {
      // Default to current year as min if none specified
      options = initOptions(options, {
        min: new Date().getFullYear()
      }); // Default to one century after current year as max if none specified

      options.max = typeof options.max !== "undefined" ? options.max : options.min + 100;
      return this.natural(options).toString();
    }; // -- End Time
    // -- Finance --


    Chance.prototype.cc = function (options) {
      options = initOptions(options);
      var type, number, to_generate;
      type = options.type ? this.cc_type({
        name: options.type,
        raw: true
      }) : this.cc_type({
        raw: true
      });
      number = type.prefix.split("");
      to_generate = type.length - type.prefix.length - 1; // Generates n - 1 digits

      number = number.concat(this.n(this.integer, to_generate, {
        min: 0,
        max: 9
      })); // Generates the last digit according to Luhn algorithm

      number.push(this.luhn_calculate(number.join("")));
      return number.join("");
    };

    Chance.prototype.cc_types = function () {
      // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
      return this.get("cc_types");
    };

    Chance.prototype.cc_type = function (options) {
      options = initOptions(options);
      var types = this.cc_types(),
          type = null;

      if (options.name) {
        for (var i = 0; i < types.length; i++) {
          // Accept either name or short_name to specify card type
          if (types[i].name === options.name || types[i].short_name === options.name) {
            type = types[i];
            break;
          }
        }

        if (type === null) {
          throw new RangeError("Chance: Credit card type '" + options.name + "' is not supported");
        }
      } else {
        type = this.pick(types);
      }

      return options.raw ? type : type.name;
    }; // return all world currency by ISO 4217


    Chance.prototype.currency_types = function () {
      return this.get("currency_types");
    }; // return random world currency by ISO 4217


    Chance.prototype.currency = function () {
      return this.pick(this.currency_types());
    }; // return all timezones available


    Chance.prototype.timezones = function () {
      return this.get("timezones");
    }; // return random timezone


    Chance.prototype.timezone = function () {
      return this.pick(this.timezones());
    }; //Return random correct currency exchange pair (e.g. EUR/USD) or array of currency code


    Chance.prototype.currency_pair = function (returnAsString) {
      var currencies = this.unique(this.currency, 2, {
        comparator: function comparator(arr, val) {
          return arr.reduce(function (acc, item) {
            // If a match has been found, short circuit check and just return
            return acc || item.code === val.code;
          }, false);
        }
      });

      if (returnAsString) {
        return currencies[0].code + '/' + currencies[1].code;
      } else {
        return currencies;
      }
    };

    Chance.prototype.dollar = function (options) {
      // By default, a somewhat more sane max for dollar than all available numbers
      options = initOptions(options, {
        max: 10000,
        min: 0
      });
      var dollar = this.floating({
        min: options.min,
        max: options.max,
        fixed: 2
      }).toString(),
          cents = dollar.split('.')[1];

      if (cents === undefined) {
        dollar += '.00';
      } else if (cents.length < 2) {
        dollar = dollar + '0';
      }

      if (dollar < 0) {
        return '-$' + dollar.replace('-', '');
      } else {
        return '$' + dollar;
      }
    };

    Chance.prototype.euro = function (options) {
      return Number(this.dollar(options).replace("$", "")).toLocaleString() + "€";
    };

    Chance.prototype.exp = function (options) {
      options = initOptions(options);
      var exp = {};
      exp.year = this.exp_year(); // If the year is this year, need to ensure month is greater than the
      // current month or this expiration will not be valid

      if (exp.year === new Date().getFullYear().toString()) {
        exp.month = this.exp_month({
          future: true
        });
      } else {
        exp.month = this.exp_month();
      }

      return options.raw ? exp : exp.month + '/' + exp.year;
    };

    Chance.prototype.exp_month = function (options) {
      options = initOptions(options);
      var month,
          month_int,
          // Date object months are 0 indexed
      curMonth = new Date().getMonth() + 1;

      if (options.future && curMonth !== 12) {
        do {
          month = this.month({
            raw: true
          }).numeric;
          month_int = parseInt(month, 10);
        } while (month_int <= curMonth);
      } else {
        month = this.month({
          raw: true
        }).numeric;
      }

      return month;
    };

    Chance.prototype.exp_year = function () {
      var curMonth = new Date().getMonth() + 1,
          curYear = new Date().getFullYear();
      return this.year({
        min: curMonth === 12 ? curYear + 1 : curYear,
        max: curYear + 10
      });
    };

    Chance.prototype.vat = function (options) {
      options = initOptions(options, {
        country: 'it'
      });

      switch (options.country.toLowerCase()) {
        case 'it':
          return this.it_vat();
      }
    };
    /**
     * Generate a string matching IBAN pattern (https://en.wikipedia.org/wiki/International_Bank_Account_Number).
     * No country-specific formats support (yet)
     */


    Chance.prototype.iban = function () {
      var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var alphanum = alpha + '0123456789';
      var iban = this.string({
        length: 2,
        pool: alpha
      }) + this.pad(this.integer({
        min: 0,
        max: 99
      }), 2) + this.string({
        length: 4,
        pool: alphanum
      }) + this.pad(this.natural(), this.natural({
        min: 6,
        max: 26
      }));
      return iban;
    }; // -- End Finance
    // -- Regional


    Chance.prototype.it_vat = function () {
      var it_vat = this.natural({
        min: 1,
        max: 1800000
      });
      it_vat = this.pad(it_vat, 7) + this.pad(this.pick(this.provinces({
        country: 'it'
      })).code, 3);
      return it_vat + this.luhn_calculate(it_vat);
    };
    /*
     * this generator is written following the official algorithm
     * all data can be passed explicitely or randomized by calling chance.cf() without options
     * the code does not check that the input data is valid (it goes beyond the scope of the generator)
     *
     * @param  [Object] options = { first: first name,
     *                              last: last name,
     *                              gender: female|male,
                                    birthday: JavaScript date object,
                                    city: string(4), 1 letter + 3 numbers
                                   }
     * @return [string] codice fiscale
     *
    */


    Chance.prototype.cf = function (options) {
      options = options || {};

      var gender = !!options.gender ? options.gender : this.gender(),
          first = !!options.first ? options.first : this.first({
        gender: gender,
        nationality: 'it'
      }),
          last = !!options.last ? options.last : this.last({
        nationality: 'it'
      }),
          birthday = !!options.birthday ? options.birthday : this.birthday(),
          city = !!options.city ? options.city : this.pickone(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'Z']) + this.pad(this.natural({
        max: 999
      }), 3),
          cf = [],
          name_generator = function name_generator(name, isLast) {
        var temp,
            return_value = [];

        if (name.length < 3) {
          return_value = name.split("").concat("XXX".split("")).splice(0, 3);
        } else {
          temp = name.toUpperCase().split('').map(function (c) {
            return "BCDFGHJKLMNPRSTVWZ".indexOf(c) !== -1 ? c : undefined;
          }).join('');

          if (temp.length > 3) {
            if (isLast) {
              temp = temp.substr(0, 3);
            } else {
              temp = temp[0] + temp.substr(2, 2);
            }
          }

          if (temp.length < 3) {
            return_value = temp;
            temp = name.toUpperCase().split('').map(function (c) {
              return "AEIOU".indexOf(c) !== -1 ? c : undefined;
            }).join('').substr(0, 3 - return_value.length);
          }

          return_value = return_value + temp;
        }

        return return_value;
      },
          date_generator = function date_generator(birthday, gender, that) {
        var lettermonths = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
        return birthday.getFullYear().toString().substr(2) + lettermonths[birthday.getMonth()] + that.pad(birthday.getDate() + (gender.toLowerCase() === "female" ? 40 : 0), 2);
      },
          checkdigit_generator = function checkdigit_generator(cf) {
        var range1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            range2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ",
            evens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            odds = "BAKPLCQDREVOSFTGUHMINJWZYX",
            digit = 0;

        for (var i = 0; i < 15; i++) {
          if (i % 2 !== 0) {
            digit += evens.indexOf(range2[range1.indexOf(cf[i])]);
          } else {
            digit += odds.indexOf(range2[range1.indexOf(cf[i])]);
          }
        }

        return evens[digit % 26];
      };

      cf = cf.concat(name_generator(last, true), name_generator(first), date_generator(birthday, gender, this), city.toUpperCase().split("")).join("");
      cf += checkdigit_generator(cf.toUpperCase());
      return cf.toUpperCase();
    };

    Chance.prototype.pl_pesel = function () {
      var number = this.natural({
        min: 1,
        max: 9999999999
      });
      var arr = this.pad(number, 10).split('');

      for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
      }

      var controlNumber = (1 * arr[0] + 3 * arr[1] + 7 * arr[2] + 9 * arr[3] + 1 * arr[4] + 3 * arr[5] + 7 * arr[6] + 9 * arr[7] + 1 * arr[8] + 3 * arr[9]) % 10;

      if (controlNumber !== 0) {
        controlNumber = 10 - controlNumber;
      }

      return arr.join('') + controlNumber;
    };

    Chance.prototype.pl_nip = function () {
      var number = this.natural({
        min: 1,
        max: 999999999
      });
      var arr = this.pad(number, 9).split('');

      for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
      }

      var controlNumber = (6 * arr[0] + 5 * arr[1] + 7 * arr[2] + 2 * arr[3] + 3 * arr[4] + 4 * arr[5] + 5 * arr[6] + 6 * arr[7] + 7 * arr[8]) % 11;

      if (controlNumber === 10) {
        return this.pl_nip();
      }

      return arr.join('') + controlNumber;
    };

    Chance.prototype.pl_regon = function () {
      var number = this.natural({
        min: 1,
        max: 99999999
      });
      var arr = this.pad(number, 8).split('');

      for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(arr[i]);
      }

      var controlNumber = (8 * arr[0] + 9 * arr[1] + 2 * arr[2] + 3 * arr[3] + 4 * arr[4] + 5 * arr[5] + 6 * arr[6] + 7 * arr[7]) % 11;

      if (controlNumber === 10) {
        controlNumber = 0;
      }

      return arr.join('') + controlNumber;
    }; // -- End Regional
    // -- Music --


    Chance.prototype.note = function (options) {
      // choices for 'notes' option:
      // flatKey - chromatic scale with flat notes (default)
      // sharpKey - chromatic scale with sharp notes
      // flats - just flat notes
      // sharps - just sharp notes
      // naturals - just natural notes
      // all - naturals, sharps and flats
      options = initOptions(options, {
        notes: 'flatKey'
      });
      var scales = {
        naturals: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        flats: ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'],
        sharps: ['C♯', 'D♯', 'F♯', 'G♯', 'A♯']
      };
      scales.all = scales.naturals.concat(scales.flats.concat(scales.sharps));
      scales.flatKey = scales.naturals.concat(scales.flats);
      scales.sharpKey = scales.naturals.concat(scales.sharps);
      return this.pickone(scales[options.notes]);
    };

    Chance.prototype.midi_note = function (options) {
      var min = 0;
      var max = 127;
      options = initOptions(options, {
        min: min,
        max: max
      });
      return this.integer({
        min: options.min,
        max: options.max
      });
    };

    Chance.prototype.chord_quality = function (options) {
      options = initOptions(options, {
        jazz: true
      });
      var chord_qualities = ['maj', 'min', 'aug', 'dim'];

      if (options.jazz) {
        chord_qualities = ['maj7', 'min7', '7', 'sus', 'dim', 'ø'];
      }

      return this.pickone(chord_qualities);
    };

    Chance.prototype.chord = function (options) {
      options = initOptions(options);
      return this.note(options) + this.chord_quality(options);
    };

    Chance.prototype.tempo = function (options) {
      var min = 40;
      var max = 320;
      options = initOptions(options, {
        min: min,
        max: max
      });
      return this.integer({
        min: options.min,
        max: options.max
      });
    }; // -- End Music
    // -- Miscellaneous --
    // Coin - Flip, flip, flipadelphia


    Chance.prototype.coin = function () {
      return this.bool() ? "heads" : "tails";
    }; // Dice - For all the board game geeks out there, myself included ;)


    function diceFn(range) {
      return function () {
        return this.natural(range);
      };
    }

    Chance.prototype.d4 = diceFn({
      min: 1,
      max: 4
    });
    Chance.prototype.d6 = diceFn({
      min: 1,
      max: 6
    });
    Chance.prototype.d8 = diceFn({
      min: 1,
      max: 8
    });
    Chance.prototype.d10 = diceFn({
      min: 1,
      max: 10
    });
    Chance.prototype.d12 = diceFn({
      min: 1,
      max: 12
    });
    Chance.prototype.d20 = diceFn({
      min: 1,
      max: 20
    });
    Chance.prototype.d30 = diceFn({
      min: 1,
      max: 30
    });
    Chance.prototype.d100 = diceFn({
      min: 1,
      max: 100
    });

    Chance.prototype.rpg = function (thrown, options) {
      options = initOptions(options);

      if (!thrown) {
        throw new RangeError("Chance: A type of die roll must be included");
      } else {
        var bits = thrown.toLowerCase().split("d"),
            rolls = [];

        if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
          throw new Error("Chance: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
        }

        for (var i = bits[0]; i > 0; i--) {
          rolls[i - 1] = this.natural({
            min: 1,
            max: bits[1]
          });
        }

        return typeof options.sum !== 'undefined' && options.sum ? rolls.reduce(function (p, c) {
          return p + c;
        }) : rolls;
      }
    }; // Guid


    Chance.prototype.guid = function (options) {
      options = initOptions(options, {
        version: 5
      });
      var guid_pool = "abcdef1234567890",
          variant_pool = "ab89",
          guid = this.string({
        pool: guid_pool,
        length: 8
      }) + '-' + this.string({
        pool: guid_pool,
        length: 4
      }) + '-' + // The Version
      options.version + this.string({
        pool: guid_pool,
        length: 3
      }) + '-' + // The Variant
      this.string({
        pool: variant_pool,
        length: 1
      }) + this.string({
        pool: guid_pool,
        length: 3
      }) + '-' + this.string({
        pool: guid_pool,
        length: 12
      });
      return guid;
    }; // Hash


    Chance.prototype.hash = function (options) {
      options = initOptions(options, {
        length: 40,
        casing: 'lower'
      });
      var pool = options.casing === 'upper' ? HEX_POOL.toUpperCase() : HEX_POOL;
      return this.string({
        pool: pool,
        length: options.length
      });
    };

    Chance.prototype.luhn_check = function (num) {
      var str = num.toString();
      var checkDigit = +str.substring(str.length - 1);
      return checkDigit === this.luhn_calculate(+str.substring(0, str.length - 1));
    };

    Chance.prototype.luhn_calculate = function (num) {
      var digits = num.toString().split("").reverse();
      var sum = 0;
      var digit;

      for (var i = 0, l = digits.length; l > i; ++i) {
        digit = +digits[i];

        if (i % 2 === 0) {
          digit *= 2;

          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
      }

      return sum * 9 % 10;
    }; // MD5 Hash


    Chance.prototype.md5 = function (options) {
      var opts = {
        str: '',
        key: null,
        raw: false
      };

      if (!options) {
        opts.str = this.string();
        options = {};
      } else if (typeof options === 'string') {
        opts.str = options;
        options = {};
      } else if (_typeof_1(options) !== 'object') {
        return null;
      } else if (options.constructor === 'Array') {
        return null;
      }

      opts = initOptions(options, opts);

      if (!opts.str) {
        throw new Error('A parameter is required to return an md5 hash.');
      }

      return this.bimd5.md5(opts.str, opts.key, opts.raw);
    };
    /**
     * #Description:
     * =====================================================
     * Generate random file name with extension
     *
     * The argument provide extension type
     * -> raster
     * -> vector
     * -> 3d
     * -> document
     *
     * If nothing is provided the function return random file name with random
     * extension type of any kind
     *
     * The user can validate the file name length range
     * If nothing provided the generated file name is random
     *
     * #Extension Pool :
     * * Currently the supported extensions are
     *  -> some of the most popular raster image extensions
     *  -> some of the most popular vector image extensions
     *  -> some of the most popular 3d image extensions
     *  -> some of the most popular document extensions
     *
     * #Examples :
     * =====================================================
     *
     * Return random file name with random extension. The file extension
     * is provided by a predefined collection of extensions. More about the extension
     * pool can be found in #Extension Pool section
     *
     * chance.file()
     * => dsfsdhjf.xml
     *
     * In order to generate a file name with specific length, specify the
     * length property and integer value. The extension is going to be random
     *
     * chance.file({length : 10})
     * => asrtineqos.pdf
     *
     * In order to generate file with extension from some of the predefined groups
     * of the extension pool just specify the extension pool category in fileType property
     *
     * chance.file({fileType : 'raster'})
     * => dshgssds.psd
     *
     * You can provide specific extension for your files
     * chance.file({extension : 'html'})
     * => djfsd.html
     *
     * Or you could pass custom collection of extensions by array or by object
     * chance.file({extensions : [...]})
     * => dhgsdsd.psd
     *
     * chance.file({extensions : { key : [...], key : [...]}})
     * => djsfksdjsd.xml
     *
     * @param  [collection] options
     * @return [string]
     *
     */


    Chance.prototype.file = function (options) {
      var fileOptions = options || {};
      var poolCollectionKey = "fileExtension";
      var typeRange = Object.keys(this.get("fileExtension")); //['raster', 'vector', '3d', 'document'];

      var fileName;
      var fileExtension; // Generate random file name

      fileName = this.word({
        length: fileOptions.length
      }); // Generate file by specific extension provided by the user

      if (fileOptions.extension) {
        fileExtension = fileOptions.extension;
        return fileName + '.' + fileExtension;
      } // Generate file by specific extension collection


      if (fileOptions.extensions) {
        if (Array.isArray(fileOptions.extensions)) {
          fileExtension = this.pickone(fileOptions.extensions);
          return fileName + '.' + fileExtension;
        } else if (fileOptions.extensions.constructor === Object) {
          var extensionObjectCollection = fileOptions.extensions;
          var keys = Object.keys(extensionObjectCollection);
          fileExtension = this.pickone(extensionObjectCollection[this.pickone(keys)]);
          return fileName + '.' + fileExtension;
        }

        throw new Error("Chance: Extensions must be an Array or Object");
      } // Generate file extension based on specific file type


      if (fileOptions.fileType) {
        var fileType = fileOptions.fileType;

        if (typeRange.indexOf(fileType) !== -1) {
          fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
          return fileName + '.' + fileExtension;
        }

        throw new RangeError("Chance: Expect file type value to be 'raster', 'vector', '3d' or 'document'");
      } // Generate random file name if no extension options are passed


      fileExtension = this.pickone(this.get(poolCollectionKey)[this.pickone(typeRange)]);
      return fileName + '.' + fileExtension;
    };

    var data = {
      firstNames: {
        "male": {
          "en": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
          // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0163
          "it": ["Adolfo", "Alberto", "Aldo", "Alessandro", "Alessio", "Alfredo", "Alvaro", "Andrea", "Angelo", "Angiolo", "Antonino", "Antonio", "Attilio", "Benito", "Bernardo", "Bruno", "Carlo", "Cesare", "Christian", "Claudio", "Corrado", "Cosimo", "Cristian", "Cristiano", "Daniele", "Dario", "David", "Davide", "Diego", "Dino", "Domenico", "Duccio", "Edoardo", "Elia", "Elio", "Emanuele", "Emiliano", "Emilio", "Enrico", "Enzo", "Ettore", "Fabio", "Fabrizio", "Federico", "Ferdinando", "Fernando", "Filippo", "Francesco", "Franco", "Gabriele", "Giacomo", "Giampaolo", "Giampiero", "Giancarlo", "Gianfranco", "Gianluca", "Gianmarco", "Gianni", "Gino", "Giorgio", "Giovanni", "Giuliano", "Giulio", "Giuseppe", "Graziano", "Gregorio", "Guido", "Iacopo", "Jacopo", "Lapo", "Leonardo", "Lorenzo", "Luca", "Luciano", "Luigi", "Manuel", "Marcello", "Marco", "Marino", "Mario", "Massimiliano", "Massimo", "Matteo", "Mattia", "Maurizio", "Mauro", "Michele", "Mirko", "Mohamed", "Nello", "Neri", "Niccolò", "Nicola", "Osvaldo", "Otello", "Paolo", "Pier Luigi", "Piero", "Pietro", "Raffaele", "Remo", "Renato", "Renzo", "Riccardo", "Roberto", "Rolando", "Romano", "Salvatore", "Samuele", "Sandro", "Sergio", "Silvano", "Simone", "Stefano", "Thomas", "Tommaso", "Ubaldo", "Ugo", "Umberto", "Valerio", "Valter", "Vasco", "Vincenzo", "Vittorio"],
          // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
          "nl": ["Aaron", "Abel", "Adam", "Adriaan", "Albert", "Alexander", "Ali", "Arjen", "Arno", "Bart", "Bas", "Bastiaan", "Benjamin", "Bob", "Boris", "Bram", "Brent", "Cas", "Casper", "Chris", "Christiaan", "Cornelis", "Daan", "Daley", "Damian", "Dani", "Daniel", "Daniël", "David", "Dean", "Dirk", "Dylan", "Egbert", "Elijah", "Erik", "Erwin", "Evert", "Ezra", "Fabian", "Fedde", "Finn", "Florian", "Floris", "Frank", "Frans", "Frederik", "Freek", "Geert", "Gerard", "Gerben", "Gerrit", "Gijs", "Guus", "Hans", "Hendrik", "Henk", "Herman", "Hidde", "Hugo", "Jaap", "Jan Jaap", "Jan-Willem", "Jack", "Jacob", "Jan", "Jason", "Jasper", "Jayden", "Jelle", "Jelte", "Jens", "Jeroen", "Jesse", "Jim", "Job", "Joep", "Johannes", "John", "Jonathan", "Joris", "Joshua", "Joël", "Julian", "Kees", "Kevin", "Koen", "Lars", "Laurens", "Leendert", "Lennard", "Lodewijk", "Luc", "Luca", "Lucas", "Lukas", "Luuk", "Maarten", "Marcus", "Martijn", "Martin", "Matthijs", "Maurits", "Max", "Mees", "Melle", "Mick", "Mika", "Milan", "Mohamed", "Mohammed", "Morris", "Muhammed", "Nathan", "Nick", "Nico", "Niek", "Niels", "Noah", "Noud", "Olivier", "Oscar", "Owen", "Paul", "Pepijn", "Peter", "Pieter", "Pim", "Quinten", "Reinier", "Rens", "Robin", "Ruben", "Sam", "Samuel", "Sander", "Sebastiaan", "Sem", "Sep", "Sepp", "Siem", "Simon", "Stan", "Stef", "Steven", "Stijn", "Sven", "Teun", "Thijmen", "Thijs", "Thomas", "Tijn", "Tim", "Timo", "Tobias", "Tom", "Victor", "Vince", "Willem", "Wim", "Wouter", "Yusuf"],
          // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
          "fr": ["Aaron", "Abdon", "Abel", "Abélard", "Abelin", "Abondance", "Abraham", "Absalon", "Acace", "Achaire", "Achille", "Adalard", "Adalbald", "Adalbéron", "Adalbert", "Adalric", "Adam", "Adegrin", "Adel", "Adelin", "Andelin", "Adelphe", "Adam", "Adéodat", "Adhémar", "Adjutor", "Adolphe", "Adonis", "Adon", "Adrien", "Agapet", "Agathange", "Agathon", "Agilbert", "Agénor", "Agnan", "Aignan", "Agrippin", "Aimable", "Aimé", "Alain", "Alban", "Albin", "Aubin", "Albéric", "Albert", "Albertet", "Alcibiade", "Alcide", "Alcée", "Alcime", "Aldonce", "Aldric", "Aldéric", "Aleaume", "Alexandre", "Alexis", "Alix", "Alliaume", "Aleaume", "Almine", "Almire", "Aloïs", "Alphée", "Alphonse", "Alpinien", "Alverède", "Amalric", "Amaury", "Amandin", "Amant", "Ambroise", "Amédée", "Amélien", "Amiel", "Amour", "Anaël", "Anastase", "Anatole", "Ancelin", "Andéol", "Andoche", "André", "Andoche", "Ange", "Angelin", "Angilbe", "Anglebert", "Angoustan", "Anicet", "Anne", "Annibal", "Ansbert", "Anselme", "Anthelme", "Antheaume", "Anthime", "Antide", "Antoine", "Antonius", "Antonin", "Apollinaire", "Apollon", "Aquilin", "Arcade", "Archambaud", "Archambeau", "Archange", "Archibald", "Arian", "Ariel", "Ariste", "Aristide", "Armand", "Armel", "Armin", "Arnould", "Arnaud", "Arolde", "Arsène", "Arsinoé", "Arthaud", "Arthème", "Arthur", "Ascelin", "Athanase", "Aubry", "Audebert", "Audouin", "Audran", "Audric", "Auguste", "Augustin", "Aurèle", "Aurélien", "Aurian", "Auxence", "Axel", "Aymard", "Aymeric", "Aymon", "Aymond", "Balthazar", "Baptiste", "Barnabé", "Barthélemy", "Bartimée", "Basile", "Bastien", "Baudouin", "Bénigne", "Benjamin", "Benoît", "Bérenger", "Bérard", "Bernard", "Bertrand", "Blaise", "Bon", "Boniface", "Bouchard", "Brice", "Brieuc", "Bruno", "Brunon", "Calixte", "Calliste", "Camélien", "Camille", "Camillien", "Candide", "Caribert", "Carloman", "Cassandre", "Cassien", "Cédric", "Céleste", "Célestin", "Célien", "Césaire", "César", "Charles", "Charlemagne", "Childebert", "Chilpéric", "Chrétien", "Christian", "Christodule", "Christophe", "Chrysostome", "Clarence", "Claude", "Claudien", "Cléandre", "Clément", "Clotaire", "Côme", "Constance", "Constant", "Constantin", "Corentin", "Cyprien", "Cyriaque", "Cyrille", "Cyril", "Damien", "Daniel", "David", "Delphin", "Denis", "Désiré", "Didier", "Dieudonné", "Dimitri", "Dominique", "Dorian", "Dorothée", "Edgard", "Edmond", "Édouard", "Éleuthère", "Élie", "Élisée", "Émeric", "Émile", "Émilien", "Emmanuel", "Enguerrand", "Épiphane", "Éric", "Esprit", "Ernest", "Étienne", "Eubert", "Eudes", "Eudoxe", "Eugène", "Eusèbe", "Eustache", "Évariste", "Évrard", "Fabien", "Fabrice", "Falba", "Félicité", "Félix", "Ferdinand", "Fiacre", "Fidèle", "Firmin", "Flavien", "Flodoard", "Florent", "Florentin", "Florestan", "Florian", "Fortuné", "Foulques", "Francisque", "François", "Français", "Franciscus", "Francs", "Frédéric", "Fulbert", "Fulcran", "Fulgence", "Gabin", "Gabriel", "Gaël", "Garnier", "Gaston", "Gaspard", "Gatien", "Gaud", "Gautier", "Gédéon", "Geoffroy", "Georges", "Géraud", "Gérard", "Gerbert", "Germain", "Gervais", "Ghislain", "Gilbert", "Gilles", "Girart", "Gislebert", "Gondebaud", "Gonthier", "Gontran", "Gonzague", "Grégoire", "Guérin", "Gui", "Guillaume", "Gustave", "Guy", "Guyot", "Hardouin", "Hector", "Hédelin", "Hélier", "Henri", "Herbert", "Herluin", "Hervé", "Hilaire", "Hildebert", "Hincmar", "Hippolyte", "Honoré", "Hubert", "Hugues", "Innocent", "Isabeau", "Isidore", "Jacques", "Japhet", "Jason", "Jean", "Jeannel", "Jeannot", "Jérémie", "Jérôme", "Joachim", "Joanny", "Job", "Jocelyn", "Joël", "Johan", "Jonas", "Jonathan", "Joseph", "Josse", "Josselin", "Jourdain", "Jude", "Judicaël", "Jules", "Julien", "Juste", "Justin", "Lambert", "Landry", "Laurent", "Lazare", "Léandre", "Léon", "Léonard", "Léopold", "Leu", "Loup", "Leufroy", "Libère", "Liétald", "Lionel", "Loïc", "Longin", "Lorrain", "Lorraine", "Lothaire", "Louis", "Loup", "Luc", "Lucas", "Lucien", "Ludolphe", "Ludovic", "Macaire", "Malo", "Mamert", "Manassé", "Marc", "Marceau", "Marcel", "Marcelin", "Marius", "Marseille", "Martial", "Martin", "Mathurin", "Matthias", "Mathias", "Matthieu", "Maugis", "Maurice", "Mauricet", "Maxence", "Maxime", "Maximilien", "Mayeul", "Médéric", "Melchior", "Mence", "Merlin", "Mérovée", "Michaël", "Michel", "Moïse", "Morgan", "Nathan", "Nathanaël", "Narcisse", "Néhémie", "Nestor", "Nestor", "Nicéphore", "Nicolas", "Noé", "Noël", "Norbert", "Normand", "Normands", "Octave", "Odilon", "Odon", "Oger", "Olivier", "Oury", "Pacôme", "Palémon", "Parfait", "Pascal", "Paterne", "Patrice", "Paul", "Pépin", "Perceval", "Philémon", "Philibert", "Philippe", "Philothée", "Pie", "Pierre", "Pierrick", "Prosper", "Quentin", "Raoul", "Raphaël", "Raymond", "Régis", "Réjean", "Rémi", "Renaud", "René", "Reybaud", "Richard", "Robert", "Roch", "Rodolphe", "Rodrigue", "Roger", "Roland", "Romain", "Romuald", "Roméo", "Rome", "Ronan", "Roselin", "Salomon", "Samuel", "Savin", "Savinien", "Scholastique", "Sébastien", "Séraphin", "Serge", "Séverin", "Sidoine", "Sigebert", "Sigismond", "Silvère", "Simon", "Siméon", "Sixte", "Stanislas", "Stéphane", "Stephan", "Sylvain", "Sylvestre", "Tancrède", "Tanguy", "Taurin", "Théodore", "Théodose", "Théophile", "Théophraste", "Thibault", "Thibert", "Thierry", "Thomas", "Timoléon", "Timothée", "Titien", "Tonnin", "Toussaint", "Trajan", "Tristan", "Turold", "Tim", "Ulysse", "Urbain", "Valentin", "Valère", "Valéry", "Venance", "Venant", "Venceslas", "Vianney", "Victor", "Victorien", "Victorin", "Vigile", "Vincent", "Vital", "Vitalien", "Vivien", "Waleran", "Wandrille", "Xavier", "Xénophon", "Yves", "Zacharie", "Zaché", "Zéphirin"]
        },
        "female": {
          "en": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"],
          // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0162
          "it": ["Ada", "Adriana", "Alessandra", "Alessia", "Alice", "Angela", "Anna", "Anna Maria", "Annalisa", "Annita", "Annunziata", "Antonella", "Arianna", "Asia", "Assunta", "Aurora", "Barbara", "Beatrice", "Benedetta", "Bianca", "Bruna", "Camilla", "Carla", "Carlotta", "Carmela", "Carolina", "Caterina", "Catia", "Cecilia", "Chiara", "Cinzia", "Clara", "Claudia", "Costanza", "Cristina", "Daniela", "Debora", "Diletta", "Dina", "Donatella", "Elena", "Eleonora", "Elisa", "Elisabetta", "Emanuela", "Emma", "Eva", "Federica", "Fernanda", "Fiorella", "Fiorenza", "Flora", "Franca", "Francesca", "Gabriella", "Gaia", "Gemma", "Giada", "Gianna", "Gina", "Ginevra", "Giorgia", "Giovanna", "Giulia", "Giuliana", "Giuseppa", "Giuseppina", "Grazia", "Graziella", "Greta", "Ida", "Ilaria", "Ines", "Iolanda", "Irene", "Irma", "Isabella", "Jessica", "Laura", "Lea", "Letizia", "Licia", "Lidia", "Liliana", "Lina", "Linda", "Lisa", "Livia", "Loretta", "Luana", "Lucia", "Luciana", "Lucrezia", "Luisa", "Manuela", "Mara", "Marcella", "Margherita", "Maria", "Maria Cristina", "Maria Grazia", "Maria Luisa", "Maria Pia", "Maria Teresa", "Marina", "Marisa", "Marta", "Martina", "Marzia", "Matilde", "Melissa", "Michela", "Milena", "Mirella", "Monica", "Natalina", "Nella", "Nicoletta", "Noemi", "Olga", "Paola", "Patrizia", "Piera", "Pierina", "Raffaella", "Rebecca", "Renata", "Rina", "Rita", "Roberta", "Rosa", "Rosanna", "Rossana", "Rossella", "Sabrina", "Sandra", "Sara", "Serena", "Silvana", "Silvia", "Simona", "Simonetta", "Sofia", "Sonia", "Stefania", "Susanna", "Teresa", "Tina", "Tiziana", "Tosca", "Valentina", "Valeria", "Vanda", "Vanessa", "Vanna", "Vera", "Veronica", "Vilma", "Viola", "Virginia", "Vittoria"],
          // Data taken from http://www.svbkindernamen.nl/int/nl/kindernamen/index.html
          "nl": ["Ada", "Arianne", "Afke", "Amanda", "Amber", "Amy", "Aniek", "Anita", "Anja", "Anna", "Anne", "Annelies", "Annemarie", "Annette", "Anouk", "Astrid", "Aukje", "Barbara", "Bianca", "Carla", "Carlijn", "Carolien", "Chantal", "Charlotte", "Claudia", "Daniëlle", "Debora", "Diane", "Dora", "Eline", "Elise", "Ella", "Ellen", "Emma", "Esmee", "Evelien", "Esther", "Erica", "Eva", "Femke", "Fleur", "Floor", "Froukje", "Gea", "Gerda", "Hanna", "Hanneke", "Heleen", "Hilde", "Ilona", "Ina", "Inge", "Ingrid", "Iris", "Isabel", "Isabelle", "Janneke", "Jasmijn", "Jeanine", "Jennifer", "Jessica", "Johanna", "Joke", "Julia", "Julie", "Karen", "Karin", "Katja", "Kim", "Lara", "Laura", "Lena", "Lianne", "Lieke", "Lilian", "Linda", "Lisa", "Lisanne", "Lotte", "Louise", "Maaike", "Manon", "Marga", "Maria", "Marissa", "Marit", "Marjolein", "Martine", "Marleen", "Melissa", "Merel", "Miranda", "Michelle", "Mirjam", "Mirthe", "Naomi", "Natalie", 'Nienke', "Nina", "Noortje", "Olivia", "Patricia", "Paula", "Paulien", "Ramona", "Ria", "Rianne", "Roos", "Rosanne", "Ruth", "Sabrina", "Sandra", "Sanne", "Sara", "Saskia", "Silvia", "Sofia", "Sophie", "Sonja", "Suzanne", "Tamara", "Tess", "Tessa", "Tineke", "Valerie", "Vanessa", "Veerle", "Vera", "Victoria", "Wendy", "Willeke", "Yvonne", "Zoë"],
          // Data taken from https://fr.wikipedia.org/wiki/Liste_de_pr%C3%A9noms_fran%C3%A7ais_et_de_la_francophonie
          "fr": ["Abdon", "Abel", "Abigaëlle", "Abigaïl", "Acacius", "Acanthe", "Adalbert", "Adalsinde", "Adegrine", "Adélaïde", "Adèle", "Adélie", "Adeline", "Adeltrude", "Adolphe", "Adonis", "Adrastée", "Adrehilde", "Adrienne", "Agathe", "Agilbert", "Aglaé", "Aignan", "Agneflète", "Agnès", "Agrippine", "Aimé", "Alaine", "Alaïs", "Albane", "Albérade", "Alberte", "Alcide", "Alcine", "Alcyone", "Aldegonde", "Aleth", "Alexandrine", "Alexine", "Alice", "Aliénor", "Aliette", "Aline", "Alix", "Alizé", "Aloïse", "Aloyse", "Alphonsine", "Althée", "Amaliane", "Amalthée", "Amande", "Amandine", "Amant", "Amarande", "Amaranthe", "Amaryllis", "Ambre", "Ambroisie", "Amélie", "Améthyste", "Aminte", "Anaël", "Anaïs", "Anastasie", "Anatole", "Ancelin", "Andrée", "Anémone", "Angadrême", "Angèle", "Angeline", "Angélique", "Angilbert", "Anicet", "Annabelle", "Anne", "Annette", "Annick", "Annie", "Annonciade", "Ansbert", "Anstrudie", "Anthelme", "Antigone", "Antoinette", "Antonine", "Aphélie", "Apolline", "Apollonie", "Aquiline", "Arabelle", "Arcadie", "Archange", "Argine", "Ariane", "Aricie", "Ariel", "Arielle", "Arlette", "Armance", "Armande", "Armandine", "Armelle", "Armide", "Armelle", "Armin", "Arnaud", "Arsène", "Arsinoé", "Artémis", "Arthur", "Ascelin", "Ascension", "Assomption", "Astarté", "Astérie", "Astrée", "Astrid", "Athalie", "Athanasie", "Athina", "Aube", "Albert", "Aude", "Audrey", "Augustine", "Aure", "Aurélie", "Aurélien", "Aurèle", "Aurore", "Auxence", "Aveline", "Abigaëlle", "Avoye", "Axelle", "Aymard", "Azalée", "Adèle", "Adeline", "Barbe", "Basilisse", "Bathilde", "Béatrice", "Béatrix", "Bénédicte", "Bérengère", "Bernadette", "Berthe", "Bertille", "Beuve", "Blanche", "Blanc", "Blandine", "Brigitte", "Brune", "Brunehilde", "Callista", "Camille", "Capucine", "Carine", "Caroline", "Cassandre", "Catherine", "Cécile", "Céleste", "Célestine", "Céline", "Chantal", "Charlène", "Charline", "Charlotte", "Chloé", "Christelle", "Christiane", "Christine", "Claire", "Clara", "Claude", "Claudine", "Clarisse", "Clémence", "Clémentine", "Cléo", "Clio", "Clotilde", "Coline", "Conception", "Constance", "Coralie", "Coraline", "Corentine", "Corinne", "Cyrielle", "Daniel", "Daniel", "Daphné", "Débora", "Delphine", "Denise", "Diane", "Dieudonné", "Dominique", "Doriane", "Dorothée", "Douce", "Édith", "Edmée", "Éléonore", "Éliane", "Élia", "Éliette", "Élisabeth", "Élise", "Ella", "Élodie", "Éloïse", "Elsa", "Émeline", "Émérance", "Émérentienne", "Émérencie", "Émilie", "Emma", "Emmanuelle", "Emmelie", "Ernestine", "Esther", "Estelle", "Eudoxie", "Eugénie", "Eulalie", "Euphrasie", "Eusébie", "Évangéline", "Eva", "Ève", "Évelyne", "Fanny", "Fantine", "Faustine", "Félicie", "Fernande", "Flavie", "Fleur", "Flore", "Florence", "Florie", "Fortuné", "France", "Francia", "Françoise", "Francine", "Gabrielle", "Gaëlle", "Garance", "Geneviève", "Georgette", "Gerberge", "Germaine", "Gertrude", "Gisèle", "Guenièvre", "Guilhemine", "Guillemette", "Gustave", "Gwenael", "Hélène", "Héloïse", "Henriette", "Hermine", "Hermione", "Hippolyte", "Honorine", "Hortense", "Huguette", "Ines", "Irène", "Irina", "Iris", "Isabeau", "Isabelle", "Iseult", "Isolde", "Ismérie", "Jacinthe", "Jacqueline", "Jade", "Janine", "Jeanne", "Jocelyne", "Joëlle", "Joséphine", "Judith", "Julia", "Julie", "Jules", "Juliette", "Justine", "Katy", "Kathy", "Katie", "Laura", "Laure", "Laureline", "Laurence", "Laurene", "Lauriane", "Laurianne", "Laurine", "Léa", "Léna", "Léonie", "Léon", "Léontine", "Lorraine", "Lucie", "Lucienne", "Lucille", "Ludivine", "Lydie", "Lydie", "Megane", "Madeleine", "Magali", "Maguelone", "Mallaury", "Manon", "Marceline", "Margot", "Marguerite", "Marianne", "Marie", "Myriam", "Marie", "Marine", "Marion", "Marlène", "Marthe", "Martine", "Mathilde", "Maud", "Maureen", "Mauricette", "Maxime", "Mélanie", "Melissa", "Mélissandre", "Mélisande", "Mélodie", "Michel", "Micheline", "Mireille", "Miriam", "Moïse", "Monique", "Morgane", "Muriel", "Mylène", "Nadège", "Nadine", "Nathalie", "Nicole", "Nicolette", "Nine", "Noël", "Noémie", "Océane", "Odette", "Odile", "Olive", "Olivia", "Olympe", "Ombline", "Ombeline", "Ophélie", "Oriande", "Oriane", "Ozanne", "Pascale", "Pascaline", "Paule", "Paulette", "Pauline", "Priscille", "Prisca", "Prisque", "Pécine", "Pélagie", "Pénélope", "Perrine", "Pétronille", "Philippine", "Philomène", "Philothée", "Primerose", "Prudence", "Pulchérie", "Quentine", "Quiéta", "Quintia", "Quintilla", "Rachel", "Raphaëlle", "Raymonde", "Rebecca", "Régine", "Réjeanne", "René", "Rita", "Rita", "Rolande", "Romane", "Rosalie", "Rose", "Roseline", "Sabine", "Salomé", "Sandra", "Sandrine", "Sarah", "Ségolène", "Séverine", "Sibylle", "Simone", "Sixt", "Solange", "Soline", "Solène", "Sophie", "Stéphanie", "Suzanne", "Sylvain", "Sylvie", "Tatiana", "Thaïs", "Théodora", "Thérèse", "Tiphaine", "Ursule", "Valentine", "Valérie", "Véronique", "Victoire", "Victorine", "Vinciane", "Violette", "Virginie", "Viviane", "Xavière", "Yolande", "Ysaline", "Yvette", "Yvonne", "Zélie", "Zita", "Zoé"]
        }
      },
      lastNames: {
        "en": ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver', 'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop', 'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro', 'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes', 'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn', 'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball', 'Keller', 'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe', 'Schneider', 'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings', 'Hines', 'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner', 'Stevenson', 'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack', 'Moss', 'Thornton', 'Dennis', 'McGee', 'Farmer', 'Delgado', 'Aguilar', 'Vega', 'Glover', 'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd', 'Blair', 'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter', 'Goodwin', 'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph', 'Francis', 'Goodman', 'Maldonado', 'Yates', 'Becker', 'Erickson', 'Hodges', 'Rios', 'Conner', 'Adkins', 'Webster', 'Norman', 'Malone', 'Hammond', 'Flowers', 'Cobb', 'Moody', 'Quinn', 'Blake', 'Maxwell', 'Pope', 'Floyd', 'Osborne', 'Paul', 'McCarthy', 'Guerrero', 'Lindsey', 'Estrada', 'Sandoval', 'Gibbs', 'Tyler', 'Gross', 'Fitzgerald', 'Stokes', 'Doyle', 'Sherman', 'Saunders', 'Wise', 'Colon', 'Gill', 'Alvarado', 'Greer', 'Padilla', 'Simon', 'Waters', 'Nunez', 'Ballard', 'Schwartz', 'McBride', 'Houston', 'Christensen', 'Klein', 'Pratt', 'Briggs', 'Parsons', 'McLaughlin', 'Zimmerman', 'French', 'Buchanan', 'Moran', 'Copeland', 'Roy', 'Pittman', 'Brady', 'McCormick', 'Holloway', 'Brock', 'Poole', 'Frank', 'Logan', 'Owen', 'Bass', 'Marsh', 'Drake', 'Wong', 'Jefferson', 'Park', 'Morton', 'Abbott', 'Sparks', 'Patrick', 'Norton', 'Huff', 'Clayton', 'Massey', 'Lloyd', 'Figueroa', 'Carson', 'Bowers', 'Roberson', 'Barton', 'Tran', 'Lamb', 'Harrington', 'Casey', 'Boone', 'Cortez', 'Clarke', 'Mathis', 'Singleton', 'Wilkins', 'Cain', 'Bryan', 'Underwood', 'Hogan', 'McKenzie', 'Collier', 'Luna', 'Phelps', 'McGuire', 'Allison', 'Bridges', 'Wilkerson', 'Nash', 'Summers', 'Atkins'],
        // Data taken from http://www.dati.gov.it/dataset/comune-di-firenze_0164 (first 1000)
        "it": ["Acciai", "Aglietti", "Agostini", "Agresti", "Ahmed", "Aiazzi", "Albanese", "Alberti", "Alessi", "Alfani", "Alinari", "Alterini", "Amato", "Ammannati", "Ancillotti", "Andrei", "Andreini", "Andreoni", "Angeli", "Anichini", "Antonelli", "Antonini", "Arena", "Ariani", "Arnetoli", "Arrighi", "Baccani", "Baccetti", "Bacci", "Bacherini", "Badii", "Baggiani", "Baglioni", "Bagni", "Bagnoli", "Baldassini", "Baldi", "Baldini", "Ballerini", "Balli", "Ballini", "Balloni", "Bambi", "Banchi", "Bandinelli", "Bandini", "Bani", "Barbetti", "Barbieri", "Barchielli", "Bardazzi", "Bardelli", "Bardi", "Barducci", "Bargellini", "Bargiacchi", "Barni", "Baroncelli", "Baroncini", "Barone", "Baroni", "Baronti", "Bartalesi", "Bartoletti", "Bartoli", "Bartolini", "Bartoloni", "Bartolozzi", "Basagni", "Basile", "Bassi", "Batacchi", "Battaglia", "Battaglini", "Bausi", "Becagli", "Becattini", "Becchi", "Becucci", "Bellandi", "Bellesi", "Belli", "Bellini", "Bellucci", "Bencini", "Benedetti", "Benelli", "Beni", "Benini", "Bensi", "Benucci", "Benvenuti", "Berlincioni", "Bernacchioni", "Bernardi", "Bernardini", "Berni", "Bernini", "Bertelli", "Berti", "Bertini", "Bessi", "Betti", "Bettini", "Biagi", "Biagini", "Biagioni", "Biagiotti", "Biancalani", "Bianchi", "Bianchini", "Bianco", "Biffoli", "Bigazzi", "Bigi", "Biliotti", "Billi", "Binazzi", "Bindi", "Bini", "Biondi", "Bizzarri", "Bocci", "Bogani", "Bolognesi", "Bonaiuti", "Bonanni", "Bonciani", "Boncinelli", "Bondi", "Bonechi", "Bongini", "Boni", "Bonini", "Borchi", "Boretti", "Borghi", "Borghini", "Borgioli", "Borri", "Borselli", "Boschi", "Bottai", "Bracci", "Braccini", "Brandi", "Braschi", "Bravi", "Brazzini", "Breschi", "Brilli", "Brizzi", "Brogelli", "Brogi", "Brogioni", "Brunelli", "Brunetti", "Bruni", "Bruno", "Brunori", "Bruschi", "Bucci", "Bucciarelli", "Buccioni", "Bucelli", "Bulli", "Burberi", "Burchi", "Burgassi", "Burroni", "Bussotti", "Buti", "Caciolli", "Caiani", "Calabrese", "Calamai", "Calamandrei", "Caldini", "Calo'", "Calonaci", "Calosi", "Calvelli", "Cambi", "Camiciottoli", "Cammelli", "Cammilli", "Campolmi", "Cantini", "Capanni", "Capecchi", "Caponi", "Cappelletti", "Cappelli", "Cappellini", "Cappugi", "Capretti", "Caputo", "Carbone", "Carboni", "Cardini", "Carlesi", "Carletti", "Carli", "Caroti", "Carotti", "Carrai", "Carraresi", "Carta", "Caruso", "Casalini", "Casati", "Caselli", "Casini", "Castagnoli", "Castellani", "Castelli", "Castellucci", "Catalano", "Catarzi", "Catelani", "Cavaciocchi", "Cavallaro", "Cavallini", "Cavicchi", "Cavini", "Ceccarelli", "Ceccatelli", "Ceccherelli", "Ceccherini", "Cecchi", "Cecchini", "Cecconi", "Cei", "Cellai", "Celli", "Cellini", "Cencetti", "Ceni", "Cenni", "Cerbai", "Cesari", "Ceseri", "Checcacci", "Checchi", "Checcucci", "Cheli", "Chellini", "Chen", "Cheng", "Cherici", "Cherubini", "Chiaramonti", "Chiarantini", "Chiarelli", "Chiari", "Chiarini", "Chiarugi", "Chiavacci", "Chiesi", "Chimenti", "Chini", "Chirici", "Chiti", "Ciabatti", "Ciampi", "Cianchi", "Cianfanelli", "Cianferoni", "Ciani", "Ciapetti", "Ciappi", "Ciardi", "Ciatti", "Cicali", "Ciccone", "Cinelli", "Cini", "Ciobanu", "Ciolli", "Cioni", "Cipriani", "Cirillo", "Cirri", "Ciucchi", "Ciuffi", "Ciulli", "Ciullini", "Clemente", "Cocchi", "Cognome", "Coli", "Collini", "Colombo", "Colzi", "Comparini", "Conforti", "Consigli", "Conte", "Conti", "Contini", "Coppini", "Coppola", "Corsi", "Corsini", "Corti", "Cortini", "Cosi", "Costa", "Costantini", "Costantino", "Cozzi", "Cresci", "Crescioli", "Cresti", "Crini", "Curradi", "D'Agostino", "D'Alessandro", "D'Amico", "D'Angelo", "Daddi", "Dainelli", "Dallai", "Danti", "Davitti", "De Angelis", "De Luca", "De Marco", "De Rosa", "De Santis", "De Simone", "De Vita", "Degl'Innocenti", "Degli Innocenti", "Dei", "Del Lungo", "Del Re", "Di Marco", "Di Stefano", "Dini", "Diop", "Dobre", "Dolfi", "Donati", "Dondoli", "Dong", "Donnini", "Ducci", "Dumitru", "Ermini", "Esposito", "Evangelisti", "Fabbri", "Fabbrini", "Fabbrizzi", "Fabbroni", "Fabbrucci", "Fabiani", "Facchini", "Faggi", "Fagioli", "Failli", "Faini", "Falciani", "Falcini", "Falcone", "Fallani", "Falorni", "Falsini", "Falugiani", "Fancelli", "Fanelli", "Fanetti", "Fanfani", "Fani", "Fantappie'", "Fantechi", "Fanti", "Fantini", "Fantoni", "Farina", "Fattori", "Favilli", "Fedi", "Fei", "Ferrante", "Ferrara", "Ferrari", "Ferraro", "Ferretti", "Ferri", "Ferrini", "Ferroni", "Fiaschi", "Fibbi", "Fiesoli", "Filippi", "Filippini", "Fini", "Fioravanti", "Fiore", "Fiorentini", "Fiorini", "Fissi", "Focardi", "Foggi", "Fontana", "Fontanelli", "Fontani", "Forconi", "Formigli", "Forte", "Forti", "Fortini", "Fossati", "Fossi", "Francalanci", "Franceschi", "Franceschini", "Franchi", "Franchini", "Franci", "Francini", "Francioni", "Franco", "Frassineti", "Frati", "Fratini", "Frilli", "Frizzi", "Frosali", "Frosini", "Frullini", "Fusco", "Fusi", "Gabbrielli", "Gabellini", "Gagliardi", "Galanti", "Galardi", "Galeotti", "Galletti", "Galli", "Gallo", "Gallori", "Gambacciani", "Gargani", "Garofalo", "Garuglieri", "Gashi", "Gasperini", "Gatti", "Gelli", "Gensini", "Gentile", "Gentili", "Geri", "Gerini", "Gheri", "Ghini", "Giachetti", "Giachi", "Giacomelli", "Gianassi", "Giani", "Giannelli", "Giannetti", "Gianni", "Giannini", "Giannoni", "Giannotti", "Giannozzi", "Gigli", "Giordano", "Giorgetti", "Giorgi", "Giovacchini", "Giovannelli", "Giovannetti", "Giovannini", "Giovannoni", "Giuliani", "Giunti", "Giuntini", "Giusti", "Gonnelli", "Goretti", "Gori", "Gradi", "Gramigni", "Grassi", "Grasso", "Graziani", "Grazzini", "Greco", "Grifoni", "Grillo", "Grimaldi", "Grossi", "Gualtieri", "Guarducci", "Guarino", "Guarnieri", "Guasti", "Guerra", "Guerri", "Guerrini", "Guidi", "Guidotti", "He", "Hoxha", "Hu", "Huang", "Iandelli", "Ignesti", "Innocenti", "Jin", "La Rosa", "Lai", "Landi", "Landini", "Lanini", "Lapi", "Lapini", "Lari", "Lascialfari", "Lastrucci", "Latini", "Lazzeri", "Lazzerini", "Lelli", "Lenzi", "Leonardi", "Leoncini", "Leone", "Leoni", "Lepri", "Li", "Liao", "Lin", "Linari", "Lippi", "Lisi", "Livi", "Lombardi", "Lombardini", "Lombardo", "Longo", "Lopez", "Lorenzi", "Lorenzini", "Lorini", "Lotti", "Lu", "Lucchesi", "Lucherini", "Lunghi", "Lupi", "Madiai", "Maestrini", "Maffei", "Maggi", "Maggini", "Magherini", "Magini", "Magnani", "Magnelli", "Magni", "Magnolfi", "Magrini", "Malavolti", "Malevolti", "Manca", "Mancini", "Manetti", "Manfredi", "Mangani", "Mannelli", "Manni", "Mannini", "Mannucci", "Manuelli", "Manzini", "Marcelli", "Marchese", "Marchetti", "Marchi", "Marchiani", "Marchionni", "Marconi", "Marcucci", "Margheri", "Mari", "Mariani", "Marilli", "Marinai", "Marinari", "Marinelli", "Marini", "Marino", "Mariotti", "Marsili", "Martelli", "Martinelli", "Martini", "Martino", "Marzi", "Masi", "Masini", "Masoni", "Massai", "Materassi", "Mattei", "Matteini", "Matteucci", "Matteuzzi", "Mattioli", "Mattolini", "Matucci", "Mauro", "Mazzanti", "Mazzei", "Mazzetti", "Mazzi", "Mazzini", "Mazzocchi", "Mazzoli", "Mazzoni", "Mazzuoli", "Meacci", "Mecocci", "Meini", "Melani", "Mele", "Meli", "Mengoni", "Menichetti", "Meoni", "Merlini", "Messeri", "Messina", "Meucci", "Miccinesi", "Miceli", "Micheli", "Michelini", "Michelozzi", "Migliori", "Migliorini", "Milani", "Miniati", "Misuri", "Monaco", "Montagnani", "Montagni", "Montanari", "Montelatici", "Monti", "Montigiani", "Montini", "Morandi", "Morandini", "Morelli", "Moretti", "Morganti", "Mori", "Morini", "Moroni", "Morozzi", "Mugnai", "Mugnaini", "Mustafa", "Naldi", "Naldini", "Nannelli", "Nanni", "Nannini", "Nannucci", "Nardi", "Nardini", "Nardoni", "Natali", "Ndiaye", "Nencetti", "Nencini", "Nencioni", "Neri", "Nesi", "Nesti", "Niccolai", "Niccoli", "Niccolini", "Nigi", "Nistri", "Nocentini", "Noferini", "Novelli", "Nucci", "Nuti", "Nutini", "Oliva", "Olivieri", "Olmi", "Orlandi", "Orlandini", "Orlando", "Orsini", "Ortolani", "Ottanelli", "Pacciani", "Pace", "Paci", "Pacini", "Pagani", "Pagano", "Paggetti", "Pagliai", "Pagni", "Pagnini", "Paladini", "Palagi", "Palchetti", "Palloni", "Palmieri", "Palumbo", "Pampaloni", "Pancani", "Pandolfi", "Pandolfini", "Panerai", "Panichi", "Paoletti", "Paoli", "Paolini", "Papi", "Papini", "Papucci", "Parenti", "Parigi", "Parisi", "Parri", "Parrini", "Pasquini", "Passeri", "Pecchioli", "Pecorini", "Pellegrini", "Pepi", "Perini", "Perrone", "Peruzzi", "Pesci", "Pestelli", "Petri", "Petrini", "Petrucci", "Pettini", "Pezzati", "Pezzatini", "Piani", "Piazza", "Piazzesi", "Piazzini", "Piccardi", "Picchi", "Piccini", "Piccioli", "Pieraccini", "Pieraccioni", "Pieralli", "Pierattini", "Pieri", "Pierini", "Pieroni", "Pietrini", "Pini", "Pinna", "Pinto", "Pinzani", "Pinzauti", "Piras", "Pisani", "Pistolesi", "Poggesi", "Poggi", "Poggiali", "Poggiolini", "Poli", "Pollastri", "Porciani", "Pozzi", "Pratellesi", "Pratesi", "Prosperi", "Pruneti", "Pucci", "Puccini", "Puccioni", "Pugi", "Pugliese", "Puliti", "Querci", "Quercioli", "Raddi", "Radu", "Raffaelli", "Ragazzini", "Ranfagni", "Ranieri", "Rastrelli", "Raugei", "Raveggi", "Renai", "Renzi", "Rettori", "Ricci", "Ricciardi", "Ridi", "Ridolfi", "Rigacci", "Righi", "Righini", "Rinaldi", "Risaliti", "Ristori", "Rizzo", "Rocchi", "Rocchini", "Rogai", "Romagnoli", "Romanelli", "Romani", "Romano", "Romei", "Romeo", "Romiti", "Romoli", "Romolini", "Rontini", "Rosati", "Roselli", "Rosi", "Rossetti", "Rossi", "Rossini", "Rovai", "Ruggeri", "Ruggiero", "Russo", "Sabatini", "Saccardi", "Sacchetti", "Sacchi", "Sacco", "Salerno", "Salimbeni", "Salucci", "Salvadori", "Salvestrini", "Salvi", "Salvini", "Sanesi", "Sani", "Sanna", "Santi", "Santini", "Santoni", "Santoro", "Santucci", "Sardi", "Sarri", "Sarti", "Sassi", "Sbolci", "Scali", "Scarpelli", "Scarselli", "Scopetani", "Secci", "Selvi", "Senatori", "Senesi", "Serafini", "Sereni", "Serra", "Sestini", "Sguanci", "Sieni", "Signorini", "Silvestri", "Simoncini", "Simonetti", "Simoni", "Singh", "Sodi", "Soldi", "Somigli", "Sorbi", "Sorelli", "Sorrentino", "Sottili", "Spina", "Spinelli", "Staccioli", "Staderini", "Stefanelli", "Stefani", "Stefanini", "Stella", "Susini", "Tacchi", "Tacconi", "Taddei", "Tagliaferri", "Tamburini", "Tanganelli", "Tani", "Tanini", "Tapinassi", "Tarchi", "Tarchiani", "Targioni", "Tassi", "Tassini", "Tempesti", "Terzani", "Tesi", "Testa", "Testi", "Tilli", "Tinti", "Tirinnanzi", "Toccafondi", "Tofanari", "Tofani", "Tognaccini", "Tonelli", "Tonini", "Torelli", "Torrini", "Tosi", "Toti", "Tozzi", "Trambusti", "Trapani", "Tucci", "Turchi", "Ugolini", "Ulivi", "Valente", "Valenti", "Valentini", "Vangelisti", "Vanni", "Vannini", "Vannoni", "Vannozzi", "Vannucchi", "Vannucci", "Ventura", "Venturi", "Venturini", "Vestri", "Vettori", "Vichi", "Viciani", "Vieri", "Vigiani", "Vignoli", "Vignolini", "Vignozzi", "Villani", "Vinci", "Visani", "Vitale", "Vitali", "Viti", "Viviani", "Vivoli", "Volpe", "Volpi", "Wang", "Wu", "Xu", "Yang", "Ye", "Zagli", "Zani", "Zanieri", "Zanobini", "Zecchi", "Zetti", "Zhang", "Zheng", "Zhou", "Zhu", "Zingoni", "Zini", "Zoppi"],
        // http://www.voornamelijk.nl/meest-voorkomende-achternamen-in-nederland-en-amsterdam/
        "nl": ["Albers", "Alblas", "Appelman", "Baars", "Baas", "Bakker", "Blank", "Bleeker", "Blok", "Blom", "Boer", "Boers", "Boldewijn", "Boon", "Boot", "Bos", "Bosch", "Bosma", "Bosman", "Bouma", "Bouman", "Bouwman", "Brands", "Brouwer", "Burger", "Buijs", "Buitenhuis", "Ceder", "Cohen", "Dekker", "Dekkers", "Dijkman", "Dijkstra", "Driessen", "Drost", "Engel", "Evers", "Faber", "Franke", "Gerritsen", "Goedhart", "Goossens", "Groen", "Groenenberg", "Groot", "Haan", "Hart", "Heemskerk", "Hendriks", "Hermans", "Hoekstra", "Hofman", "Hopman", "Huisman", "Jacobs", "Jansen", "Janssen", "Jonker", "Jaspers", "Keijzer", "Klaassen", "Klein", "Koek", "Koenders", "Kok", "Kool", "Koopman", "Koopmans", "Koning", "Koster", "Kramer", "Kroon", "Kuijpers", "Kuiper", "Kuipers", "Kurt", "Koster", "Kwakman", "Los", "Lubbers", "Maas", "Markus", "Martens", "Meijer", "Mol", "Molenaar", "Mulder", "Nieuwenhuis", "Peeters", "Peters", "Pengel", "Pieters", "Pool", "Post", "Postma", "Prins", "Pronk", "Reijnders", "Rietveld", "Roest", "Roos", "Sanders", "Schaap", "Scheffer", "Schenk", "Schilder", "Schipper", "Schmidt", "Scholten", "Schouten", "Schut", "Schutte", "Schuurman", "Simons", "Smeets", "Smit", "Smits", "Snel", "Swinkels", "Tas", "Terpstra", "Timmermans", "Tol", "Tromp", "Troost", "Valk", "Veenstra", "Veldkamp", "Verbeek", "Verheul", "Verhoeven", "Vermeer", "Vermeulen", "Verweij", "Vink", "Visser", "Voorn", "Vos", "Wagenaar", "Wiersema", "Willems", "Willemsen", "Witteveen", "Wolff", "Wolters", "Zijlstra", "Zwart", "de Beer", "de Boer", "de Bruijn", "de Bruin", "de Graaf", "de Groot", "de Haan", "de Haas", "de Jager", "de Jong", "de Jonge", "de Koning", "de Lange", "de Leeuw", "de Ridder", "de Rooij", "de Ruiter", "de Vos", "de Vries", "de Waal", "de Wit", "de Zwart", "van Beek", "van Boven", "van Dam", "van Dijk", "van Dongen", "van Doorn", "van Egmond", "van Eijk", "van Es", "van Gelder", "van Gelderen", "van Houten", "van Hulst", "van Kempen", "van Kesteren", "van Leeuwen", "van Loon", "van Mill", "van Noord", "van Ommen", "van Ommeren", "van Oosten", "van Oostveen", "van Rijn", "van Schaik", "van Veen", "van Vliet", "van Wijk", "van Wijngaarden", "van den Poel", "van de Pol", "van den Ploeg", "van de Ven", "van den Berg", "van den Bosch", "van den Brink", "van den Broek", "van den Heuvel", "van der Heijden", "van der Horst", "van der Hulst", "van der Kroon", "van der Laan", "van der Linden", "van der Meer", "van der Meij", "van der Meulen", "van der Molen", "van der Sluis", "van der Spek", "van der Veen", "van der Velde", "van der Velden", "van der Vliet", "van der Wal"],
        // https://surnames.behindthename.com/top/lists/england-wales/1991
        "uk": ["Smith", "Jones", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Robinson", "Thompson", "Wright", "Walker", "White", "Edwards", "Hughes", "Green", "Hall", "Lewis", "Harris", "Clarke", "Patel", "Jackson", "Wood", "Turner", "Martin", "Cooper", "Hill", "Ward", "Morris", "Moore", "Clark", "Lee", "King", "Baker", "Harrison", "Morgan", "Allen", "James", "Scott", "Phillips", "Watson", "Davis", "Parker", "Price", "Bennett", "Young", "Griffiths", "Mitchell", "Kelly", "Cook", "Carter", "Richardson", "Bailey", "Collins", "Bell", "Shaw", "Murphy", "Miller", "Cox", "Richards", "Khan", "Marshall", "Anderson", "Simpson", "Ellis", "Adams", "Singh", "Begum", "Wilkinson", "Foster", "Chapman", "Powell", "Webb", "Rogers", "Gray", "Mason", "Ali", "Hunt", "Hussain", "Campbell", "Matthews", "Owen", "Palmer", "Holmes", "Mills", "Barnes", "Knight", "Lloyd", "Butler", "Russell", "Barker", "Fisher", "Stevens", "Jenkins", "Murray", "Dixon", "Harvey", "Graham", "Pearson", "Ahmed", "Fletcher", "Walsh", "Kaur", "Gibson", "Howard", "Andrews", "Stewart", "Elliott", "Reynolds", "Saunders", "Payne", "Fox", "Ford", "Pearce", "Day", "Brooks", "West", "Lawrence", "Cole", "Atkinson", "Bradley", "Spencer", "Gill", "Dawson", "Ball", "Burton", "O'brien", "Watts", "Rose", "Booth", "Perry", "Ryan", "Grant", "Wells", "Armstrong", "Francis", "Rees", "Hayes", "Hart", "Hudson", "Newman", "Barrett", "Webster", "Hunter", "Gregory", "Carr", "Lowe", "Page", "Marsh", "Riley", "Dunn", "Woods", "Parsons", "Berry", "Stone", "Reid", "Holland", "Hawkins", "Harding", "Porter", "Robertson", "Newton", "Oliver", "Reed", "Kennedy", "Williamson", "Bird", "Gardner", "Shah", "Dean", "Lane", "Cooke", "Bates", "Henderson", "Parry", "Burgess", "Bishop", "Walton", "Burns", "Nicholson", "Shepherd", "Ross", "Cross", "Long", "Freeman", "Warren", "Nicholls", "Hamilton", "Byrne", "Sutton", "Mcdonald", "Yates", "Hodgson", "Robson", "Curtis", "Hopkins", "O'connor", "Harper", "Coleman", "Watkins", "Moss", "Mccarthy", "Chambers", "O'neill", "Griffin", "Sharp", "Hardy", "Wheeler", "Potter", "Osborne", "Johnston", "Gordon", "Doyle", "Wallace", "George", "Jordan", "Hutchinson", "Rowe", "Burke", "May", "Pritchard", "Gilbert", "Willis", "Higgins", "Read", "Miles", "Stevenson", "Stephenson", "Hammond", "Arnold", "Buckley", "Walters", "Hewitt", "Barber", "Nelson", "Slater", "Austin", "Sullivan", "Whitehead", "Mann", "Frost", "Lambert", "Stephens", "Blake", "Akhtar", "Lynch", "Goodwin", "Barton", "Woodward", "Thomson", "Cunningham", "Quinn", "Barnett", "Baxter", "Bibi", "Clayton", "Nash", "Greenwood", "Jennings", "Holt", "Kemp", "Poole", "Gallagher", "Bond", "Stokes", "Tucker", "Davidson", "Fowler", "Heath", "Norman", "Middleton", "Lawson", "Banks", "French", "Stanley", "Jarvis", "Gibbs", "Ferguson", "Hayward", "Carroll", "Douglas", "Dickinson", "Todd", "Barlow", "Peters", "Lucas", "Knowles", "Hartley", "Miah", "Simmons", "Morton", "Alexander", "Field", "Morrison", "Norris", "Townsend", "Preston", "Hancock", "Thornton", "Baldwin", "Burrows", "Briggs", "Parkinson", "Reeves", "Macdonald", "Lamb", "Black", "Abbott", "Sanders", "Thorpe", "Holden", "Tomlinson", "Perkins", "Ashton", "Rhodes", "Fuller", "Howe", "Bryant", "Vaughan", "Dale", "Davey", "Weston", "Bartlett", "Whittaker", "Davison", "Kent", "Skinner", "Birch", "Morley", "Daniels", "Glover", "Howell", "Cartwright", "Pugh", "Humphreys", "Goddard", "Brennan", "Wall", "Kirby", "Bowen", "Savage", "Bull", "Wong", "Dobson", "Smart", "Wilkins", "Kirk", "Fraser", "Duffy", "Hicks", "Patterson", "Bradshaw", "Little", "Archer", "Warner", "Waters", "O'sullivan", "Farrell", "Brookes", "Atkins", "Kay", "Dodd", "Bentley", "Flynn", "John", "Schofield", "Short", "Haynes", "Wade", "Butcher", "Henry", "Sanderson", "Crawford", "Sheppard", "Bolton", "Coates", "Giles", "Gould", "Houghton", "Gibbons", "Pratt", "Manning", "Law", "Hooper", "Noble", "Dyer", "Rahman", "Clements", "Moran", "Sykes", "Chan", "Doherty", "Connolly", "Joyce", "Franklin", "Hobbs", "Coles", "Herbert", "Steele", "Kerr", "Leach", "Winter", "Owens", "Duncan", "Naylor", "Fleming", "Horton", "Finch", "Fitzgerald", "Randall", "Carpenter", "Marsden", "Browne", "Garner", "Pickering", "Hale", "Dennis", "Vincent", "Chadwick", "Chandler", "Sharpe", "Nolan", "Lyons", "Hurst", "Collier", "Peacock", "Howarth", "Faulkner", "Rice", "Pollard", "Welch", "Norton", "Gough", "Sinclair", "Blackburn", "Bryan", "Conway", "Power", "Cameron", "Daly", "Allan", "Hanson", "Gardiner", "Boyle", "Myers", "Turnbull", "Wallis", "Mahmood", "Sims", "Swift", "Iqbal", "Pope", "Brady", "Chamberlain", "Rowley", "Tyler", "Farmer", "Metcalfe", "Hilton", "Godfrey", "Holloway", "Parkin", "Bray", "Talbot", "Donnelly", "Nixon", "Charlton", "Benson", "Whitehouse", "Barry", "Hope", "Lord", "North", "Storey", "Connor", "Potts", "Bevan", "Hargreaves", "Mclean", "Mistry", "Bruce", "Howells", "Hyde", "Parkes", "Wyatt", "Fry", "Lees", "O'donnell", "Craig", "Forster", "Mckenzie", "Humphries", "Mellor", "Carey", "Ingram", "Summers", "Leonard"],
        // https://surnames.behindthename.com/top/lists/germany/2017
        "de": ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner", "Schmitz", "Krause", "Meier", "Lehmann", "Schmid", "Schulze", "Maier", "Köhler", "Herrmann", "König", "Walter", "Mayer", "Huber", "Kaiser", "Fuchs", "Peters", "Lang", "Scholz", "Möller", "Weiß", "Jung", "Hahn", "Schubert", "Vogel", "Friedrich", "Keller", "Günther", "Frank", "Berger", "Winkler", "Roth", "Beck", "Lorenz", "Baumann", "Franke", "Albrecht", "Schuster", "Simon", "Ludwig", "Böhm", "Winter", "Kraus", "Martin", "Schumacher", "Krämer", "Vogt", "Stein", "Jäger", "Otto", "Sommer", "Groß", "Seidel", "Heinrich", "Brandt", "Haas", "Schreiber", "Graf", "Schulte", "Dietrich", "Ziegler", "Kuhn", "Kühn", "Pohl", "Engel", "Horn", "Busch", "Bergmann", "Thomas", "Voigt", "Sauer", "Arnold", "Wolff", "Pfeiffer"],
        // http://www.japantimes.co.jp/life/2009/10/11/lifestyle/japans-top-100-most-common-family-names/
        "jp": ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Saito", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu", "Yamazaki", "Mori", "Abe", "Ikeda", "Hashimoto", "Yamashita", "Ishikawa", "Nakajima", "Maeda", "Fujita", "Ogawa", "Goto", "Okada", "Hasegawa", "Murakami", "Kondo", "Ishii", "Saito", "Sakamoto", "Endo", "Aoki", "Fujii", "Nishimura", "Fukuda", "Ota", "Miura", "Fujiwara", "Okamoto", "Matsuda", "Nakagawa", "Nakano", "Harada", "Ono", "Tamura", "Takeuchi", "Kaneko", "Wada", "Nakayama", "Ishida", "Ueda", "Morita", "Hara", "Shibata", "Sakai", "Kudo", "Yokoyama", "Miyazaki", "Miyamoto", "Uchida", "Takagi", "Ando", "Taniguchi", "Ohno", "Maruyama", "Imai", "Takada", "Fujimoto", "Takeda", "Murata", "Ueno", "Sugiyama", "Masuda", "Sugawara", "Hirano", "Kojima", "Otsuka", "Chiba", "Kubo", "Matsui", "Iwasaki", "Sakurai", "Kinoshita", "Noguchi", "Matsuo", "Nomura", "Kikuchi", "Sano", "Onishi", "Sugimoto", "Arai"],
        // http://www.lowchensaustralia.com/names/popular-spanish-names.htm
        "es": ["Garcia", "Fernandez", "Lopez", "Martinez", "Gonzalez", "Rodriguez", "Sanchez", "Perez", "Martin", "Gomez", "Ruiz", "Diaz", "Hernandez", "Alvarez", "Jimenez", "Moreno", "Munoz", "Alonso", "Romero", "Navarro", "Gutierrez", "Torres", "Dominguez", "Gil", "Vazquez", "Blanco", "Serrano", "Ramos", "Castro", "Suarez", "Sanz", "Rubio", "Ortega", "Molina", "Delgado", "Ortiz", "Morales", "Ramirez", "Marin", "Iglesias", "Santos", "Castillo", "Garrido", "Calvo", "Pena", "Cruz", "Cano", "Nunez", "Prieto", "Diez", "Lozano", "Vidal", "Pascual", "Ferrer", "Medina", "Vega", "Leon", "Herrero", "Vicente", "Mendez", "Guerrero", "Fuentes", "Campos", "Nieto", "Cortes", "Caballero", "Ibanez", "Lorenzo", "Pastor", "Gimenez", "Saez", "Soler", "Marquez", "Carrasco", "Herrera", "Montero", "Arias", "Crespo", "Flores", "Andres", "Aguilar", "Hidalgo", "Cabrera", "Mora", "Duran", "Velasco", "Rey", "Pardo", "Roman", "Vila", "Bravo", "Merino", "Moya", "Soto", "Izquierdo", "Reyes", "Redondo", "Marcos", "Carmona", "Menendez"],
        // Data taken from https://fr.wikipedia.org/wiki/Liste_des_noms_de_famille_les_plus_courants_en_France
        "fr": ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefèvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet", "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent", "Müller", "Lefèvre", "Faure", "André", "Mercier", "Blanc", "Guérin", "Boyer", "Garnier", "Chevalier", "François", "Legrand", "Gauthier", "Garcia", "Perrin", "Robin", "Clément", "Morin", "Nicolas", "Henry", "Roussel", "Matthieu", "Gautier", "Masson", "Marchand", "Duval", "Denis", "Dumont", "Marie", "Lemaire", "Noël", "Meyer", "Dufour", "Meunier", "Brun", "Blanchard", "Giraud", "Joly", "Rivière", "Lucas", "Brunet", "Gaillard", "Barbier", "Arnaud", "Martínez", "Gérard", "Roche", "Renard", "Schmitt", "Roy", "Leroux", "Colin", "Vidal", "Caron", "Picard", "Roger", "Fabre", "Aubert", "Lemoine", "Renaud", "Dumas", "Lacroix", "Olivier", "Philippe", "Bourgeois", "Pierre", "Benoît", "Rey", "Leclerc", "Payet", "Rolland", "Leclercq", "Guillaume", "Lecomte", "López", "Jean", "Dupuy", "Guillot", "Hubert", "Berger", "Carpentier", "Sánchez", "Dupuis", "Moulin", "Louis", "Deschamps", "Huet", "Vasseur", "Perez", "Boucher", "Fleury", "Royer", "Klein", "Jacquet", "Adam", "Paris", "Poirier", "Marty", "Aubry", "Guyot", "Carré", "Charles", "Renault", "Charpentier", "Ménard", "Maillard", "Baron", "Bertin", "Bailly", "Hervé", "Schneider", "Fernández", "Le GallGall", "Collet", "Léger", "Bouvier", "Julien", "Prévost", "Millet", "Perrot", "Daniel", "Le RouxRoux", "Cousin", "Germain", "Breton", "Besson", "Langlois", "Rémi", "Le GoffGoff", "Pelletier", "Lévêque", "Perrier", "Leblanc", "Barré", "Lebrun", "Marchal", "Weber", "Mallet", "Hamon", "Boulanger", "Jacob", "Monnier", "Michaud", "Rodríguez", "Guichard", "Gillet", "Étienne", "Grondin", "Poulain", "Tessier", "Chevallier", "Collin", "Chauvin", "Da SilvaSilva", "Bouchet", "Gay", "Lemaître", "Bénard", "Maréchal", "Humbert", "Reynaud", "Antoine", "Hoarau", "Perret", "Barthélemy", "Cordier", "Pichon", "Lejeune", "Gilbert", "Lamy", "Delaunay", "Pasquier", "Carlier", "LaporteLaporte"]
      },
      // Data taken from http://geoportal.statistics.gov.uk/datasets/ons-postcode-directory-latest-centroids
      postcodeAreas: [{
        code: 'AB'
      }, {
        code: 'AL'
      }, {
        code: 'B'
      }, {
        code: 'BA'
      }, {
        code: 'BB'
      }, {
        code: 'BD'
      }, {
        code: 'BH'
      }, {
        code: 'BL'
      }, {
        code: 'BN'
      }, {
        code: 'BR'
      }, {
        code: 'BS'
      }, {
        code: 'BT'
      }, {
        code: 'CA'
      }, {
        code: 'CB'
      }, {
        code: 'CF'
      }, {
        code: 'CH'
      }, {
        code: 'CM'
      }, {
        code: 'CO'
      }, {
        code: 'CR'
      }, {
        code: 'CT'
      }, {
        code: 'CV'
      }, {
        code: 'CW'
      }, {
        code: 'DA'
      }, {
        code: 'DD'
      }, {
        code: 'DE'
      }, {
        code: 'DG'
      }, {
        code: 'DH'
      }, {
        code: 'DL'
      }, {
        code: 'DN'
      }, {
        code: 'DT'
      }, {
        code: 'DY'
      }, {
        code: 'E'
      }, {
        code: 'EC'
      }, {
        code: 'EH'
      }, {
        code: 'EN'
      }, {
        code: 'EX'
      }, {
        code: 'FK'
      }, {
        code: 'FY'
      }, {
        code: 'G'
      }, {
        code: 'GL'
      }, {
        code: 'GU'
      }, {
        code: 'GY'
      }, {
        code: 'HA'
      }, {
        code: 'HD'
      }, {
        code: 'HG'
      }, {
        code: 'HP'
      }, {
        code: 'HR'
      }, {
        code: 'HS'
      }, {
        code: 'HU'
      }, {
        code: 'HX'
      }, {
        code: 'IG'
      }, {
        code: 'IM'
      }, {
        code: 'IP'
      }, {
        code: 'IV'
      }, {
        code: 'JE'
      }, {
        code: 'KA'
      }, {
        code: 'KT'
      }, {
        code: 'KW'
      }, {
        code: 'KY'
      }, {
        code: 'L'
      }, {
        code: 'LA'
      }, {
        code: 'LD'
      }, {
        code: 'LE'
      }, {
        code: 'LL'
      }, {
        code: 'LN'
      }, {
        code: 'LS'
      }, {
        code: 'LU'
      }, {
        code: 'M'
      }, {
        code: 'ME'
      }, {
        code: 'MK'
      }, {
        code: 'ML'
      }, {
        code: 'N'
      }, {
        code: 'NE'
      }, {
        code: 'NG'
      }, {
        code: 'NN'
      }, {
        code: 'NP'
      }, {
        code: 'NR'
      }, {
        code: 'NW'
      }, {
        code: 'OL'
      }, {
        code: 'OX'
      }, {
        code: 'PA'
      }, {
        code: 'PE'
      }, {
        code: 'PH'
      }, {
        code: 'PL'
      }, {
        code: 'PO'
      }, {
        code: 'PR'
      }, {
        code: 'RG'
      }, {
        code: 'RH'
      }, {
        code: 'RM'
      }, {
        code: 'S'
      }, {
        code: 'SA'
      }, {
        code: 'SE'
      }, {
        code: 'SG'
      }, {
        code: 'SK'
      }, {
        code: 'SL'
      }, {
        code: 'SM'
      }, {
        code: 'SN'
      }, {
        code: 'SO'
      }, {
        code: 'SP'
      }, {
        code: 'SR'
      }, {
        code: 'SS'
      }, {
        code: 'ST'
      }, {
        code: 'SW'
      }, {
        code: 'SY'
      }, {
        code: 'TA'
      }, {
        code: 'TD'
      }, {
        code: 'TF'
      }, {
        code: 'TN'
      }, {
        code: 'TQ'
      }, {
        code: 'TR'
      }, {
        code: 'TS'
      }, {
        code: 'TW'
      }, {
        code: 'UB'
      }, {
        code: 'W'
      }, {
        code: 'WA'
      }, {
        code: 'WC'
      }, {
        code: 'WD'
      }, {
        code: 'WF'
      }, {
        code: 'WN'
      }, {
        code: 'WR'
      }, {
        code: 'WS'
      }, {
        code: 'WV'
      }, {
        code: 'YO'
      }, {
        code: 'ZE'
      }],
      // Data taken from https://github.com/umpirsky/country-list/blob/master/data/en_US/country.json
      countries: [{
        "name": "Afghanistan",
        "abbreviation": "AF"
      }, {
        "name": "Åland Islands",
        "abbreviation": "AX"
      }, {
        "name": "Albania",
        "abbreviation": "AL"
      }, {
        "name": "Algeria",
        "abbreviation": "DZ"
      }, {
        "name": "American Samoa",
        "abbreviation": "AS"
      }, {
        "name": "Andorra",
        "abbreviation": "AD"
      }, {
        "name": "Angola",
        "abbreviation": "AO"
      }, {
        "name": "Anguilla",
        "abbreviation": "AI"
      }, {
        "name": "Antarctica",
        "abbreviation": "AQ"
      }, {
        "name": "Antigua & Barbuda",
        "abbreviation": "AG"
      }, {
        "name": "Argentina",
        "abbreviation": "AR"
      }, {
        "name": "Armenia",
        "abbreviation": "AM"
      }, {
        "name": "Aruba",
        "abbreviation": "AW"
      }, {
        "name": "Ascension Island",
        "abbreviation": "AC"
      }, {
        "name": "Australia",
        "abbreviation": "AU"
      }, {
        "name": "Austria",
        "abbreviation": "AT"
      }, {
        "name": "Azerbaijan",
        "abbreviation": "AZ"
      }, {
        "name": "Bahamas",
        "abbreviation": "BS"
      }, {
        "name": "Bahrain",
        "abbreviation": "BH"
      }, {
        "name": "Bangladesh",
        "abbreviation": "BD"
      }, {
        "name": "Barbados",
        "abbreviation": "BB"
      }, {
        "name": "Belarus",
        "abbreviation": "BY"
      }, {
        "name": "Belgium",
        "abbreviation": "BE"
      }, {
        "name": "Belize",
        "abbreviation": "BZ"
      }, {
        "name": "Benin",
        "abbreviation": "BJ"
      }, {
        "name": "Bermuda",
        "abbreviation": "BM"
      }, {
        "name": "Bhutan",
        "abbreviation": "BT"
      }, {
        "name": "Bolivia",
        "abbreviation": "BO"
      }, {
        "name": "Bosnia & Herzegovina",
        "abbreviation": "BA"
      }, {
        "name": "Botswana",
        "abbreviation": "BW"
      }, {
        "name": "Brazil",
        "abbreviation": "BR"
      }, {
        "name": "British Indian Ocean Territory",
        "abbreviation": "IO"
      }, {
        "name": "British Virgin Islands",
        "abbreviation": "VG"
      }, {
        "name": "Brunei",
        "abbreviation": "BN"
      }, {
        "name": "Bulgaria",
        "abbreviation": "BG"
      }, {
        "name": "Burkina Faso",
        "abbreviation": "BF"
      }, {
        "name": "Burundi",
        "abbreviation": "BI"
      }, {
        "name": "Cambodia",
        "abbreviation": "KH"
      }, {
        "name": "Cameroon",
        "abbreviation": "CM"
      }, {
        "name": "Canada",
        "abbreviation": "CA"
      }, {
        "name": "Canary Islands",
        "abbreviation": "IC"
      }, {
        "name": "Cape Verde",
        "abbreviation": "CV"
      }, {
        "name": "Caribbean Netherlands",
        "abbreviation": "BQ"
      }, {
        "name": "Cayman Islands",
        "abbreviation": "KY"
      }, {
        "name": "Central African Republic",
        "abbreviation": "CF"
      }, {
        "name": "Ceuta & Melilla",
        "abbreviation": "EA"
      }, {
        "name": "Chad",
        "abbreviation": "TD"
      }, {
        "name": "Chile",
        "abbreviation": "CL"
      }, {
        "name": "China",
        "abbreviation": "CN"
      }, {
        "name": "Christmas Island",
        "abbreviation": "CX"
      }, {
        "name": "Cocos (Keeling) Islands",
        "abbreviation": "CC"
      }, {
        "name": "Colombia",
        "abbreviation": "CO"
      }, {
        "name": "Comoros",
        "abbreviation": "KM"
      }, {
        "name": "Congo - Brazzaville",
        "abbreviation": "CG"
      }, {
        "name": "Congo - Kinshasa",
        "abbreviation": "CD"
      }, {
        "name": "Cook Islands",
        "abbreviation": "CK"
      }, {
        "name": "Costa Rica",
        "abbreviation": "CR"
      }, {
        "name": "Côte d'Ivoire",
        "abbreviation": "CI"
      }, {
        "name": "Croatia",
        "abbreviation": "HR"
      }, {
        "name": "Cuba",
        "abbreviation": "CU"
      }, {
        "name": "Curaçao",
        "abbreviation": "CW"
      }, {
        "name": "Cyprus",
        "abbreviation": "CY"
      }, {
        "name": "Czech Republic",
        "abbreviation": "CZ"
      }, {
        "name": "Denmark",
        "abbreviation": "DK"
      }, {
        "name": "Diego Garcia",
        "abbreviation": "DG"
      }, {
        "name": "Djibouti",
        "abbreviation": "DJ"
      }, {
        "name": "Dominica",
        "abbreviation": "DM"
      }, {
        "name": "Dominican Republic",
        "abbreviation": "DO"
      }, {
        "name": "Ecuador",
        "abbreviation": "EC"
      }, {
        "name": "Egypt",
        "abbreviation": "EG"
      }, {
        "name": "El Salvador",
        "abbreviation": "SV"
      }, {
        "name": "Equatorial Guinea",
        "abbreviation": "GQ"
      }, {
        "name": "Eritrea",
        "abbreviation": "ER"
      }, {
        "name": "Estonia",
        "abbreviation": "EE"
      }, {
        "name": "Ethiopia",
        "abbreviation": "ET"
      }, {
        "name": "Falkland Islands",
        "abbreviation": "FK"
      }, {
        "name": "Faroe Islands",
        "abbreviation": "FO"
      }, {
        "name": "Fiji",
        "abbreviation": "FJ"
      }, {
        "name": "Finland",
        "abbreviation": "FI"
      }, {
        "name": "France",
        "abbreviation": "FR"
      }, {
        "name": "French Guiana",
        "abbreviation": "GF"
      }, {
        "name": "French Polynesia",
        "abbreviation": "PF"
      }, {
        "name": "French Southern Territories",
        "abbreviation": "TF"
      }, {
        "name": "Gabon",
        "abbreviation": "GA"
      }, {
        "name": "Gambia",
        "abbreviation": "GM"
      }, {
        "name": "Georgia",
        "abbreviation": "GE"
      }, {
        "name": "Germany",
        "abbreviation": "DE"
      }, {
        "name": "Ghana",
        "abbreviation": "GH"
      }, {
        "name": "Gibraltar",
        "abbreviation": "GI"
      }, {
        "name": "Greece",
        "abbreviation": "GR"
      }, {
        "name": "Greenland",
        "abbreviation": "GL"
      }, {
        "name": "Grenada",
        "abbreviation": "GD"
      }, {
        "name": "Guadeloupe",
        "abbreviation": "GP"
      }, {
        "name": "Guam",
        "abbreviation": "GU"
      }, {
        "name": "Guatemala",
        "abbreviation": "GT"
      }, {
        "name": "Guernsey",
        "abbreviation": "GG"
      }, {
        "name": "Guinea",
        "abbreviation": "GN"
      }, {
        "name": "Guinea-Bissau",
        "abbreviation": "GW"
      }, {
        "name": "Guyana",
        "abbreviation": "GY"
      }, {
        "name": "Haiti",
        "abbreviation": "HT"
      }, {
        "name": "Honduras",
        "abbreviation": "HN"
      }, {
        "name": "Hong Kong SAR China",
        "abbreviation": "HK"
      }, {
        "name": "Hungary",
        "abbreviation": "HU"
      }, {
        "name": "Iceland",
        "abbreviation": "IS"
      }, {
        "name": "India",
        "abbreviation": "IN"
      }, {
        "name": "Indonesia",
        "abbreviation": "ID"
      }, {
        "name": "Iran",
        "abbreviation": "IR"
      }, {
        "name": "Iraq",
        "abbreviation": "IQ"
      }, {
        "name": "Ireland",
        "abbreviation": "IE"
      }, {
        "name": "Isle of Man",
        "abbreviation": "IM"
      }, {
        "name": "Israel",
        "abbreviation": "IL"
      }, {
        "name": "Italy",
        "abbreviation": "IT"
      }, {
        "name": "Jamaica",
        "abbreviation": "JM"
      }, {
        "name": "Japan",
        "abbreviation": "JP"
      }, {
        "name": "Jersey",
        "abbreviation": "JE"
      }, {
        "name": "Jordan",
        "abbreviation": "JO"
      }, {
        "name": "Kazakhstan",
        "abbreviation": "KZ"
      }, {
        "name": "Kenya",
        "abbreviation": "KE"
      }, {
        "name": "Kiribati",
        "abbreviation": "KI"
      }, {
        "name": "Kosovo",
        "abbreviation": "XK"
      }, {
        "name": "Kuwait",
        "abbreviation": "KW"
      }, {
        "name": "Kyrgyzstan",
        "abbreviation": "KG"
      }, {
        "name": "Laos",
        "abbreviation": "LA"
      }, {
        "name": "Latvia",
        "abbreviation": "LV"
      }, {
        "name": "Lebanon",
        "abbreviation": "LB"
      }, {
        "name": "Lesotho",
        "abbreviation": "LS"
      }, {
        "name": "Liberia",
        "abbreviation": "LR"
      }, {
        "name": "Libya",
        "abbreviation": "LY"
      }, {
        "name": "Liechtenstein",
        "abbreviation": "LI"
      }, {
        "name": "Lithuania",
        "abbreviation": "LT"
      }, {
        "name": "Luxembourg",
        "abbreviation": "LU"
      }, {
        "name": "Macau SAR China",
        "abbreviation": "MO"
      }, {
        "name": "Macedonia",
        "abbreviation": "MK"
      }, {
        "name": "Madagascar",
        "abbreviation": "MG"
      }, {
        "name": "Malawi",
        "abbreviation": "MW"
      }, {
        "name": "Malaysia",
        "abbreviation": "MY"
      }, {
        "name": "Maldives",
        "abbreviation": "MV"
      }, {
        "name": "Mali",
        "abbreviation": "ML"
      }, {
        "name": "Malta",
        "abbreviation": "MT"
      }, {
        "name": "Marshall Islands",
        "abbreviation": "MH"
      }, {
        "name": "Martinique",
        "abbreviation": "MQ"
      }, {
        "name": "Mauritania",
        "abbreviation": "MR"
      }, {
        "name": "Mauritius",
        "abbreviation": "MU"
      }, {
        "name": "Mayotte",
        "abbreviation": "YT"
      }, {
        "name": "Mexico",
        "abbreviation": "MX"
      }, {
        "name": "Micronesia",
        "abbreviation": "FM"
      }, {
        "name": "Moldova",
        "abbreviation": "MD"
      }, {
        "name": "Monaco",
        "abbreviation": "MC"
      }, {
        "name": "Mongolia",
        "abbreviation": "MN"
      }, {
        "name": "Montenegro",
        "abbreviation": "ME"
      }, {
        "name": "Montserrat",
        "abbreviation": "MS"
      }, {
        "name": "Morocco",
        "abbreviation": "MA"
      }, {
        "name": "Mozambique",
        "abbreviation": "MZ"
      }, {
        "name": "Myanmar (Burma)",
        "abbreviation": "MM"
      }, {
        "name": "Namibia",
        "abbreviation": "NA"
      }, {
        "name": "Nauru",
        "abbreviation": "NR"
      }, {
        "name": "Nepal",
        "abbreviation": "NP"
      }, {
        "name": "Netherlands",
        "abbreviation": "NL"
      }, {
        "name": "New Caledonia",
        "abbreviation": "NC"
      }, {
        "name": "New Zealand",
        "abbreviation": "NZ"
      }, {
        "name": "Nicaragua",
        "abbreviation": "NI"
      }, {
        "name": "Niger",
        "abbreviation": "NE"
      }, {
        "name": "Nigeria",
        "abbreviation": "NG"
      }, {
        "name": "Niue",
        "abbreviation": "NU"
      }, {
        "name": "Norfolk Island",
        "abbreviation": "NF"
      }, {
        "name": "North Korea",
        "abbreviation": "KP"
      }, {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
      }, {
        "name": "Norway",
        "abbreviation": "NO"
      }, {
        "name": "Oman",
        "abbreviation": "OM"
      }, {
        "name": "Pakistan",
        "abbreviation": "PK"
      }, {
        "name": "Palau",
        "abbreviation": "PW"
      }, {
        "name": "Palestinian Territories",
        "abbreviation": "PS"
      }, {
        "name": "Panama",
        "abbreviation": "PA"
      }, {
        "name": "Papua New Guinea",
        "abbreviation": "PG"
      }, {
        "name": "Paraguay",
        "abbreviation": "PY"
      }, {
        "name": "Peru",
        "abbreviation": "PE"
      }, {
        "name": "Philippines",
        "abbreviation": "PH"
      }, {
        "name": "Pitcairn Islands",
        "abbreviation": "PN"
      }, {
        "name": "Poland",
        "abbreviation": "PL"
      }, {
        "name": "Portugal",
        "abbreviation": "PT"
      }, {
        "name": "Puerto Rico",
        "abbreviation": "PR"
      }, {
        "name": "Qatar",
        "abbreviation": "QA"
      }, {
        "name": "Réunion",
        "abbreviation": "RE"
      }, {
        "name": "Romania",
        "abbreviation": "RO"
      }, {
        "name": "Russia",
        "abbreviation": "RU"
      }, {
        "name": "Rwanda",
        "abbreviation": "RW"
      }, {
        "name": "Samoa",
        "abbreviation": "WS"
      }, {
        "name": "San Marino",
        "abbreviation": "SM"
      }, {
        "name": "São Tomé and Príncipe",
        "abbreviation": "ST"
      }, {
        "name": "Saudi Arabia",
        "abbreviation": "SA"
      }, {
        "name": "Senegal",
        "abbreviation": "SN"
      }, {
        "name": "Serbia",
        "abbreviation": "RS"
      }, {
        "name": "Seychelles",
        "abbreviation": "SC"
      }, {
        "name": "Sierra Leone",
        "abbreviation": "SL"
      }, {
        "name": "Singapore",
        "abbreviation": "SG"
      }, {
        "name": "Sint Maarten",
        "abbreviation": "SX"
      }, {
        "name": "Slovakia",
        "abbreviation": "SK"
      }, {
        "name": "Slovenia",
        "abbreviation": "SI"
      }, {
        "name": "Solomon Islands",
        "abbreviation": "SB"
      }, {
        "name": "Somalia",
        "abbreviation": "SO"
      }, {
        "name": "South Africa",
        "abbreviation": "ZA"
      }, {
        "name": "South Georgia & South Sandwich Islands",
        "abbreviation": "GS"
      }, {
        "name": "South Korea",
        "abbreviation": "KR"
      }, {
        "name": "South Sudan",
        "abbreviation": "SS"
      }, {
        "name": "Spain",
        "abbreviation": "ES"
      }, {
        "name": "Sri Lanka",
        "abbreviation": "LK"
      }, {
        "name": "St. Barthélemy",
        "abbreviation": "BL"
      }, {
        "name": "St. Helena",
        "abbreviation": "SH"
      }, {
        "name": "St. Kitts & Nevis",
        "abbreviation": "KN"
      }, {
        "name": "St. Lucia",
        "abbreviation": "LC"
      }, {
        "name": "St. Martin",
        "abbreviation": "MF"
      }, {
        "name": "St. Pierre & Miquelon",
        "abbreviation": "PM"
      }, {
        "name": "St. Vincent & Grenadines",
        "abbreviation": "VC"
      }, {
        "name": "Sudan",
        "abbreviation": "SD"
      }, {
        "name": "Suriname",
        "abbreviation": "SR"
      }, {
        "name": "Svalbard & Jan Mayen",
        "abbreviation": "SJ"
      }, {
        "name": "Swaziland",
        "abbreviation": "SZ"
      }, {
        "name": "Sweden",
        "abbreviation": "SE"
      }, {
        "name": "Switzerland",
        "abbreviation": "CH"
      }, {
        "name": "Syria",
        "abbreviation": "SY"
      }, {
        "name": "Taiwan",
        "abbreviation": "TW"
      }, {
        "name": "Tajikistan",
        "abbreviation": "TJ"
      }, {
        "name": "Tanzania",
        "abbreviation": "TZ"
      }, {
        "name": "Thailand",
        "abbreviation": "TH"
      }, {
        "name": "Timor-Leste",
        "abbreviation": "TL"
      }, {
        "name": "Togo",
        "abbreviation": "TG"
      }, {
        "name": "Tokelau",
        "abbreviation": "TK"
      }, {
        "name": "Tonga",
        "abbreviation": "TO"
      }, {
        "name": "Trinidad & Tobago",
        "abbreviation": "TT"
      }, {
        "name": "Tristan da Cunha",
        "abbreviation": "TA"
      }, {
        "name": "Tunisia",
        "abbreviation": "TN"
      }, {
        "name": "Turkey",
        "abbreviation": "TR"
      }, {
        "name": "Turkmenistan",
        "abbreviation": "TM"
      }, {
        "name": "Turks & Caicos Islands",
        "abbreviation": "TC"
      }, {
        "name": "Tuvalu",
        "abbreviation": "TV"
      }, {
        "name": "U.S. Outlying Islands",
        "abbreviation": "UM"
      }, {
        "name": "U.S. Virgin Islands",
        "abbreviation": "VI"
      }, {
        "name": "Uganda",
        "abbreviation": "UG"
      }, {
        "name": "Ukraine",
        "abbreviation": "UA"
      }, {
        "name": "United Arab Emirates",
        "abbreviation": "AE"
      }, {
        "name": "United Kingdom",
        "abbreviation": "GB"
      }, {
        "name": "United States",
        "abbreviation": "US"
      }, {
        "name": "Uruguay",
        "abbreviation": "UY"
      }, {
        "name": "Uzbekistan",
        "abbreviation": "UZ"
      }, {
        "name": "Vanuatu",
        "abbreviation": "VU"
      }, {
        "name": "Vatican City",
        "abbreviation": "VA"
      }, {
        "name": "Venezuela",
        "abbreviation": "VE"
      }, {
        "name": "Vietnam",
        "abbreviation": "VN"
      }, {
        "name": "Wallis & Futuna",
        "abbreviation": "WF"
      }, {
        "name": "Western Sahara",
        "abbreviation": "EH"
      }, {
        "name": "Yemen",
        "abbreviation": "YE"
      }, {
        "name": "Zambia",
        "abbreviation": "ZM"
      }, {
        "name": "Zimbabwe",
        "abbreviation": "ZW"
      }],
      counties: {
        // Data taken from http://www.downloadexcelfiles.com/gb_en/download-excel-file-list-counties-uk
        "uk": [{
          name: 'Bath and North East Somerset'
        }, {
          name: 'Aberdeenshire'
        }, {
          name: 'Anglesey'
        }, {
          name: 'Angus'
        }, {
          name: 'Bedford'
        }, {
          name: 'Blackburn with Darwen'
        }, {
          name: 'Blackpool'
        }, {
          name: 'Bournemouth'
        }, {
          name: 'Bracknell Forest'
        }, {
          name: 'Brighton & Hove'
        }, {
          name: 'Bristol'
        }, {
          name: 'Buckinghamshire'
        }, {
          name: 'Cambridgeshire'
        }, {
          name: 'Carmarthenshire'
        }, {
          name: 'Central Bedfordshire'
        }, {
          name: 'Ceredigion'
        }, {
          name: 'Cheshire East'
        }, {
          name: 'Cheshire West and Chester'
        }, {
          name: 'Clackmannanshire'
        }, {
          name: 'Conwy'
        }, {
          name: 'Cornwall'
        }, {
          name: 'County Antrim'
        }, {
          name: 'County Armagh'
        }, {
          name: 'County Down'
        }, {
          name: 'County Durham'
        }, {
          name: 'County Fermanagh'
        }, {
          name: 'County Londonderry'
        }, {
          name: 'County Tyrone'
        }, {
          name: 'Cumbria'
        }, {
          name: 'Darlington'
        }, {
          name: 'Denbighshire'
        }, {
          name: 'Derby'
        }, {
          name: 'Derbyshire'
        }, {
          name: 'Devon'
        }, {
          name: 'Dorset'
        }, {
          name: 'Dumfries and Galloway'
        }, {
          name: 'Dundee'
        }, {
          name: 'East Lothian'
        }, {
          name: 'East Riding of Yorkshire'
        }, {
          name: 'East Sussex'
        }, {
          name: 'Edinburgh?'
        }, {
          name: 'Essex'
        }, {
          name: 'Falkirk'
        }, {
          name: 'Fife'
        }, {
          name: 'Flintshire'
        }, {
          name: 'Gloucestershire'
        }, {
          name: 'Greater London'
        }, {
          name: 'Greater Manchester'
        }, {
          name: 'Gwent'
        }, {
          name: 'Gwynedd'
        }, {
          name: 'Halton'
        }, {
          name: 'Hampshire'
        }, {
          name: 'Hartlepool'
        }, {
          name: 'Herefordshire'
        }, {
          name: 'Hertfordshire'
        }, {
          name: 'Highlands'
        }, {
          name: 'Hull'
        }, {
          name: 'Isle of Wight'
        }, {
          name: 'Isles of Scilly'
        }, {
          name: 'Kent'
        }, {
          name: 'Lancashire'
        }, {
          name: 'Leicester'
        }, {
          name: 'Leicestershire'
        }, {
          name: 'Lincolnshire'
        }, {
          name: 'Lothian'
        }, {
          name: 'Luton'
        }, {
          name: 'Medway'
        }, {
          name: 'Merseyside'
        }, {
          name: 'Mid Glamorgan'
        }, {
          name: 'Middlesbrough'
        }, {
          name: 'Milton Keynes'
        }, {
          name: 'Monmouthshire'
        }, {
          name: 'Moray'
        }, {
          name: 'Norfolk'
        }, {
          name: 'North East Lincolnshire'
        }, {
          name: 'North Lincolnshire'
        }, {
          name: 'North Somerset'
        }, {
          name: 'North Yorkshire'
        }, {
          name: 'Northamptonshire'
        }, {
          name: 'Northumberland'
        }, {
          name: 'Nottingham'
        }, {
          name: 'Nottinghamshire'
        }, {
          name: 'Oxfordshire'
        }, {
          name: 'Pembrokeshire'
        }, {
          name: 'Perth and Kinross'
        }, {
          name: 'Peterborough'
        }, {
          name: 'Plymouth'
        }, {
          name: 'Poole'
        }, {
          name: 'Portsmouth'
        }, {
          name: 'Powys'
        }, {
          name: 'Reading'
        }, {
          name: 'Redcar and Cleveland'
        }, {
          name: 'Rutland'
        }, {
          name: 'Scottish Borders'
        }, {
          name: 'Shropshire'
        }, {
          name: 'Slough'
        }, {
          name: 'Somerset'
        }, {
          name: 'South Glamorgan'
        }, {
          name: 'South Gloucestershire'
        }, {
          name: 'South Yorkshire'
        }, {
          name: 'Southampton'
        }, {
          name: 'Southend-on-Sea'
        }, {
          name: 'Staffordshire'
        }, {
          name: 'Stirlingshire'
        }, {
          name: 'Stockton-on-Tees'
        }, {
          name: 'Stoke-on-Trent'
        }, {
          name: 'Strathclyde'
        }, {
          name: 'Suffolk'
        }, {
          name: 'Surrey'
        }, {
          name: 'Swindon'
        }, {
          name: 'Telford and Wrekin'
        }, {
          name: 'Thurrock'
        }, {
          name: 'Torbay'
        }, {
          name: 'Tyne and Wear'
        }, {
          name: 'Warrington'
        }, {
          name: 'Warwickshire'
        }, {
          name: 'West Berkshire'
        }, {
          name: 'West Glamorgan'
        }, {
          name: 'West Lothian'
        }, {
          name: 'West Midlands'
        }, {
          name: 'West Sussex'
        }, {
          name: 'West Yorkshire'
        }, {
          name: 'Western Isles'
        }, {
          name: 'Wiltshire'
        }, {
          name: 'Windsor and Maidenhead'
        }, {
          name: 'Wokingham'
        }, {
          name: 'Worcestershire'
        }, {
          name: 'Wrexham'
        }, {
          name: 'York'
        }]
      },
      provinces: {
        "ca": [{
          name: 'Alberta',
          abbreviation: 'AB'
        }, {
          name: 'British Columbia',
          abbreviation: 'BC'
        }, {
          name: 'Manitoba',
          abbreviation: 'MB'
        }, {
          name: 'New Brunswick',
          abbreviation: 'NB'
        }, {
          name: 'Newfoundland and Labrador',
          abbreviation: 'NL'
        }, {
          name: 'Nova Scotia',
          abbreviation: 'NS'
        }, {
          name: 'Ontario',
          abbreviation: 'ON'
        }, {
          name: 'Prince Edward Island',
          abbreviation: 'PE'
        }, {
          name: 'Quebec',
          abbreviation: 'QC'
        }, {
          name: 'Saskatchewan',
          abbreviation: 'SK'
        }, // The case could be made that the following are not actually provinces
        // since they are technically considered "territories" however they all
        // look the same on an envelope!
        {
          name: 'Northwest Territories',
          abbreviation: 'NT'
        }, {
          name: 'Nunavut',
          abbreviation: 'NU'
        }, {
          name: 'Yukon',
          abbreviation: 'YT'
        }],
        "it": [{
          name: "Agrigento",
          abbreviation: "AG",
          code: 84
        }, {
          name: "Alessandria",
          abbreviation: "AL",
          code: 6
        }, {
          name: "Ancona",
          abbreviation: "AN",
          code: 42
        }, {
          name: "Aosta",
          abbreviation: "AO",
          code: 7
        }, {
          name: "L'Aquila",
          abbreviation: "AQ",
          code: 66
        }, {
          name: "Arezzo",
          abbreviation: "AR",
          code: 51
        }, {
          name: "Ascoli-Piceno",
          abbreviation: "AP",
          code: 44
        }, {
          name: "Asti",
          abbreviation: "AT",
          code: 5
        }, {
          name: "Avellino",
          abbreviation: "AV",
          code: 64
        }, {
          name: "Bari",
          abbreviation: "BA",
          code: 72
        }, {
          name: "Barletta-Andria-Trani",
          abbreviation: "BT",
          code: 72
        }, {
          name: "Belluno",
          abbreviation: "BL",
          code: 25
        }, {
          name: "Benevento",
          abbreviation: "BN",
          code: 62
        }, {
          name: "Bergamo",
          abbreviation: "BG",
          code: 16
        }, {
          name: "Biella",
          abbreviation: "BI",
          code: 96
        }, {
          name: "Bologna",
          abbreviation: "BO",
          code: 37
        }, {
          name: "Bolzano",
          abbreviation: "BZ",
          code: 21
        }, {
          name: "Brescia",
          abbreviation: "BS",
          code: 17
        }, {
          name: "Brindisi",
          abbreviation: "BR",
          code: 74
        }, {
          name: "Cagliari",
          abbreviation: "CA",
          code: 92
        }, {
          name: "Caltanissetta",
          abbreviation: "CL",
          code: 85
        }, {
          name: "Campobasso",
          abbreviation: "CB",
          code: 70
        }, {
          name: "Carbonia Iglesias",
          abbreviation: "CI",
          code: 70
        }, {
          name: "Caserta",
          abbreviation: "CE",
          code: 61
        }, {
          name: "Catania",
          abbreviation: "CT",
          code: 87
        }, {
          name: "Catanzaro",
          abbreviation: "CZ",
          code: 79
        }, {
          name: "Chieti",
          abbreviation: "CH",
          code: 69
        }, {
          name: "Como",
          abbreviation: "CO",
          code: 13
        }, {
          name: "Cosenza",
          abbreviation: "CS",
          code: 78
        }, {
          name: "Cremona",
          abbreviation: "CR",
          code: 19
        }, {
          name: "Crotone",
          abbreviation: "KR",
          code: 101
        }, {
          name: "Cuneo",
          abbreviation: "CN",
          code: 4
        }, {
          name: "Enna",
          abbreviation: "EN",
          code: 86
        }, {
          name: "Fermo",
          abbreviation: "FM",
          code: 86
        }, {
          name: "Ferrara",
          abbreviation: "FE",
          code: 38
        }, {
          name: "Firenze",
          abbreviation: "FI",
          code: 48
        }, {
          name: "Foggia",
          abbreviation: "FG",
          code: 71
        }, {
          name: "Forli-Cesena",
          abbreviation: "FC",
          code: 71
        }, {
          name: "Frosinone",
          abbreviation: "FR",
          code: 60
        }, {
          name: "Genova",
          abbreviation: "GE",
          code: 10
        }, {
          name: "Gorizia",
          abbreviation: "GO",
          code: 31
        }, {
          name: "Grosseto",
          abbreviation: "GR",
          code: 53
        }, {
          name: "Imperia",
          abbreviation: "IM",
          code: 8
        }, {
          name: "Isernia",
          abbreviation: "IS",
          code: 94
        }, {
          name: "La-Spezia",
          abbreviation: "SP",
          code: 66
        }, {
          name: "Latina",
          abbreviation: "LT",
          code: 59
        }, {
          name: "Lecce",
          abbreviation: "LE",
          code: 75
        }, {
          name: "Lecco",
          abbreviation: "LC",
          code: 97
        }, {
          name: "Livorno",
          abbreviation: "LI",
          code: 49
        }, {
          name: "Lodi",
          abbreviation: "LO",
          code: 98
        }, {
          name: "Lucca",
          abbreviation: "LU",
          code: 46
        }, {
          name: "Macerata",
          abbreviation: "MC",
          code: 43
        }, {
          name: "Mantova",
          abbreviation: "MN",
          code: 20
        }, {
          name: "Massa-Carrara",
          abbreviation: "MS",
          code: 45
        }, {
          name: "Matera",
          abbreviation: "MT",
          code: 77
        }, {
          name: "Medio Campidano",
          abbreviation: "VS",
          code: 77
        }, {
          name: "Messina",
          abbreviation: "ME",
          code: 83
        }, {
          name: "Milano",
          abbreviation: "MI",
          code: 15
        }, {
          name: "Modena",
          abbreviation: "MO",
          code: 36
        }, {
          name: "Monza-Brianza",
          abbreviation: "MB",
          code: 36
        }, {
          name: "Napoli",
          abbreviation: "NA",
          code: 63
        }, {
          name: "Novara",
          abbreviation: "NO",
          code: 3
        }, {
          name: "Nuoro",
          abbreviation: "NU",
          code: 91
        }, {
          name: "Ogliastra",
          abbreviation: "OG",
          code: 91
        }, {
          name: "Olbia Tempio",
          abbreviation: "OT",
          code: 91
        }, {
          name: "Oristano",
          abbreviation: "OR",
          code: 95
        }, {
          name: "Padova",
          abbreviation: "PD",
          code: 28
        }, {
          name: "Palermo",
          abbreviation: "PA",
          code: 82
        }, {
          name: "Parma",
          abbreviation: "PR",
          code: 34
        }, {
          name: "Pavia",
          abbreviation: "PV",
          code: 18
        }, {
          name: "Perugia",
          abbreviation: "PG",
          code: 54
        }, {
          name: "Pesaro-Urbino",
          abbreviation: "PU",
          code: 41
        }, {
          name: "Pescara",
          abbreviation: "PE",
          code: 68
        }, {
          name: "Piacenza",
          abbreviation: "PC",
          code: 33
        }, {
          name: "Pisa",
          abbreviation: "PI",
          code: 50
        }, {
          name: "Pistoia",
          abbreviation: "PT",
          code: 47
        }, {
          name: "Pordenone",
          abbreviation: "PN",
          code: 93
        }, {
          name: "Potenza",
          abbreviation: "PZ",
          code: 76
        }, {
          name: "Prato",
          abbreviation: "PO",
          code: 100
        }, {
          name: "Ragusa",
          abbreviation: "RG",
          code: 88
        }, {
          name: "Ravenna",
          abbreviation: "RA",
          code: 39
        }, {
          name: "Reggio-Calabria",
          abbreviation: "RC",
          code: 35
        }, {
          name: "Reggio-Emilia",
          abbreviation: "RE",
          code: 35
        }, {
          name: "Rieti",
          abbreviation: "RI",
          code: 57
        }, {
          name: "Rimini",
          abbreviation: "RN",
          code: 99
        }, {
          name: "Roma",
          abbreviation: "Roma",
          code: 58
        }, {
          name: "Rovigo",
          abbreviation: "RO",
          code: 29
        }, {
          name: "Salerno",
          abbreviation: "SA",
          code: 65
        }, {
          name: "Sassari",
          abbreviation: "SS",
          code: 90
        }, {
          name: "Savona",
          abbreviation: "SV",
          code: 9
        }, {
          name: "Siena",
          abbreviation: "SI",
          code: 52
        }, {
          name: "Siracusa",
          abbreviation: "SR",
          code: 89
        }, {
          name: "Sondrio",
          abbreviation: "SO",
          code: 14
        }, {
          name: "Taranto",
          abbreviation: "TA",
          code: 73
        }, {
          name: "Teramo",
          abbreviation: "TE",
          code: 67
        }, {
          name: "Terni",
          abbreviation: "TR",
          code: 55
        }, {
          name: "Torino",
          abbreviation: "TO",
          code: 1
        }, {
          name: "Trapani",
          abbreviation: "TP",
          code: 81
        }, {
          name: "Trento",
          abbreviation: "TN",
          code: 22
        }, {
          name: "Treviso",
          abbreviation: "TV",
          code: 26
        }, {
          name: "Trieste",
          abbreviation: "TS",
          code: 32
        }, {
          name: "Udine",
          abbreviation: "UD",
          code: 30
        }, {
          name: "Varese",
          abbreviation: "VA",
          code: 12
        }, {
          name: "Venezia",
          abbreviation: "VE",
          code: 27
        }, {
          name: "Verbania",
          abbreviation: "VB",
          code: 27
        }, {
          name: "Vercelli",
          abbreviation: "VC",
          code: 2
        }, {
          name: "Verona",
          abbreviation: "VR",
          code: 23
        }, {
          name: "Vibo-Valentia",
          abbreviation: "VV",
          code: 102
        }, {
          name: "Vicenza",
          abbreviation: "VI",
          code: 24
        }, {
          name: "Viterbo",
          abbreviation: "VT",
          code: 56
        }]
      },
      // from: https://github.com/samsargent/Useful-Autocomplete-Data/blob/master/data/nationalities.json
      nationalities: [{
        name: 'Afghan'
      }, {
        name: 'Albanian'
      }, {
        name: 'Algerian'
      }, {
        name: 'American'
      }, {
        name: 'Andorran'
      }, {
        name: 'Angolan'
      }, {
        name: 'Antiguans'
      }, {
        name: 'Argentinean'
      }, {
        name: 'Armenian'
      }, {
        name: 'Australian'
      }, {
        name: 'Austrian'
      }, {
        name: 'Azerbaijani'
      }, {
        name: 'Bahami'
      }, {
        name: 'Bahraini'
      }, {
        name: 'Bangladeshi'
      }, {
        name: 'Barbadian'
      }, {
        name: 'Barbudans'
      }, {
        name: 'Batswana'
      }, {
        name: 'Belarusian'
      }, {
        name: 'Belgian'
      }, {
        name: 'Belizean'
      }, {
        name: 'Beninese'
      }, {
        name: 'Bhutanese'
      }, {
        name: 'Bolivian'
      }, {
        name: 'Bosnian'
      }, {
        name: 'Brazilian'
      }, {
        name: 'British'
      }, {
        name: 'Bruneian'
      }, {
        name: 'Bulgarian'
      }, {
        name: 'Burkinabe'
      }, {
        name: 'Burmese'
      }, {
        name: 'Burundian'
      }, {
        name: 'Cambodian'
      }, {
        name: 'Cameroonian'
      }, {
        name: 'Canadian'
      }, {
        name: 'Cape Verdean'
      }, {
        name: 'Central African'
      }, {
        name: 'Chadian'
      }, {
        name: 'Chilean'
      }, {
        name: 'Chinese'
      }, {
        name: 'Colombian'
      }, {
        name: 'Comoran'
      }, {
        name: 'Congolese'
      }, {
        name: 'Costa Rican'
      }, {
        name: 'Croatian'
      }, {
        name: 'Cuban'
      }, {
        name: 'Cypriot'
      }, {
        name: 'Czech'
      }, {
        name: 'Danish'
      }, {
        name: 'Djibouti'
      }, {
        name: 'Dominican'
      }, {
        name: 'Dutch'
      }, {
        name: 'East Timorese'
      }, {
        name: 'Ecuadorean'
      }, {
        name: 'Egyptian'
      }, {
        name: 'Emirian'
      }, {
        name: 'Equatorial Guinean'
      }, {
        name: 'Eritrean'
      }, {
        name: 'Estonian'
      }, {
        name: 'Ethiopian'
      }, {
        name: 'Fijian'
      }, {
        name: 'Filipino'
      }, {
        name: 'Finnish'
      }, {
        name: 'French'
      }, {
        name: 'Gabonese'
      }, {
        name: 'Gambian'
      }, {
        name: 'Georgian'
      }, {
        name: 'German'
      }, {
        name: 'Ghanaian'
      }, {
        name: 'Greek'
      }, {
        name: 'Grenadian'
      }, {
        name: 'Guatemalan'
      }, {
        name: 'Guinea-Bissauan'
      }, {
        name: 'Guinean'
      }, {
        name: 'Guyanese'
      }, {
        name: 'Haitian'
      }, {
        name: 'Herzegovinian'
      }, {
        name: 'Honduran'
      }, {
        name: 'Hungarian'
      }, {
        name: 'I-Kiribati'
      }, {
        name: 'Icelander'
      }, {
        name: 'Indian'
      }, {
        name: 'Indonesian'
      }, {
        name: 'Iranian'
      }, {
        name: 'Iraqi'
      }, {
        name: 'Irish'
      }, {
        name: 'Israeli'
      }, {
        name: 'Italian'
      }, {
        name: 'Ivorian'
      }, {
        name: 'Jamaican'
      }, {
        name: 'Japanese'
      }, {
        name: 'Jordanian'
      }, {
        name: 'Kazakhstani'
      }, {
        name: 'Kenyan'
      }, {
        name: 'Kittian and Nevisian'
      }, {
        name: 'Kuwaiti'
      }, {
        name: 'Kyrgyz'
      }, {
        name: 'Laotian'
      }, {
        name: 'Latvian'
      }, {
        name: 'Lebanese'
      }, {
        name: 'Liberian'
      }, {
        name: 'Libyan'
      }, {
        name: 'Liechtensteiner'
      }, {
        name: 'Lithuanian'
      }, {
        name: 'Luxembourger'
      }, {
        name: 'Macedonian'
      }, {
        name: 'Malagasy'
      }, {
        name: 'Malawian'
      }, {
        name: 'Malaysian'
      }, {
        name: 'Maldivan'
      }, {
        name: 'Malian'
      }, {
        name: 'Maltese'
      }, {
        name: 'Marshallese'
      }, {
        name: 'Mauritanian'
      }, {
        name: 'Mauritian'
      }, {
        name: 'Mexican'
      }, {
        name: 'Micronesian'
      }, {
        name: 'Moldovan'
      }, {
        name: 'Monacan'
      }, {
        name: 'Mongolian'
      }, {
        name: 'Moroccan'
      }, {
        name: 'Mosotho'
      }, {
        name: 'Motswana'
      }, {
        name: 'Mozambican'
      }, {
        name: 'Namibian'
      }, {
        name: 'Nauruan'
      }, {
        name: 'Nepalese'
      }, {
        name: 'New Zealander'
      }, {
        name: 'Nicaraguan'
      }, {
        name: 'Nigerian'
      }, {
        name: 'Nigerien'
      }, {
        name: 'North Korean'
      }, {
        name: 'Northern Irish'
      }, {
        name: 'Norwegian'
      }, {
        name: 'Omani'
      }, {
        name: 'Pakistani'
      }, {
        name: 'Palauan'
      }, {
        name: 'Panamanian'
      }, {
        name: 'Papua New Guinean'
      }, {
        name: 'Paraguayan'
      }, {
        name: 'Peruvian'
      }, {
        name: 'Polish'
      }, {
        name: 'Portuguese'
      }, {
        name: 'Qatari'
      }, {
        name: 'Romani'
      }, {
        name: 'Russian'
      }, {
        name: 'Rwandan'
      }, {
        name: 'Saint Lucian'
      }, {
        name: 'Salvadoran'
      }, {
        name: 'Samoan'
      }, {
        name: 'San Marinese'
      }, {
        name: 'Sao Tomean'
      }, {
        name: 'Saudi'
      }, {
        name: 'Scottish'
      }, {
        name: 'Senegalese'
      }, {
        name: 'Serbian'
      }, {
        name: 'Seychellois'
      }, {
        name: 'Sierra Leonean'
      }, {
        name: 'Singaporean'
      }, {
        name: 'Slovakian'
      }, {
        name: 'Slovenian'
      }, {
        name: 'Solomon Islander'
      }, {
        name: 'Somali'
      }, {
        name: 'South African'
      }, {
        name: 'South Korean'
      }, {
        name: 'Spanish'
      }, {
        name: 'Sri Lankan'
      }, {
        name: 'Sudanese'
      }, {
        name: 'Surinamer'
      }, {
        name: 'Swazi'
      }, {
        name: 'Swedish'
      }, {
        name: 'Swiss'
      }, {
        name: 'Syrian'
      }, {
        name: 'Taiwanese'
      }, {
        name: 'Tajik'
      }, {
        name: 'Tanzanian'
      }, {
        name: 'Thai'
      }, {
        name: 'Togolese'
      }, {
        name: 'Tongan'
      }, {
        name: 'Trinidadian or Tobagonian'
      }, {
        name: 'Tunisian'
      }, {
        name: 'Turkish'
      }, {
        name: 'Tuvaluan'
      }, {
        name: 'Ugandan'
      }, {
        name: 'Ukrainian'
      }, {
        name: 'Uruguaya'
      }, {
        name: 'Uzbekistani'
      }, {
        name: 'Venezuela'
      }, {
        name: 'Vietnamese'
      }, {
        name: 'Wels'
      }, {
        name: 'Yemenit'
      }, {
        name: 'Zambia'
      }, {
        name: 'Zimbabwe'
      }],
      // http://www.loc.gov/standards/iso639-2/php/code_list.php (ISO-639-1 codes)
      locale_languages: ["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu"],
      // From http://data.okfn.org/data/core/language-codes#resource-language-codes-full (IETF language tags)
      locale_regions: ["agq-CM", "asa-TZ", "ast-ES", "bas-CM", "bem-ZM", "bez-TZ", "brx-IN", "cgg-UG", "chr-US", "dav-KE", "dje-NE", "dsb-DE", "dua-CM", "dyo-SN", "ebu-KE", "ewo-CM", "fil-PH", "fur-IT", "gsw-CH", "gsw-FR", "gsw-LI", "guz-KE", "haw-US", "hsb-DE", "jgo-CM", "jmc-TZ", "kab-DZ", "kam-KE", "kde-TZ", "kea-CV", "khq-ML", "kkj-CM", "kln-KE", "kok-IN", "ksb-TZ", "ksf-CM", "ksh-DE", "lag-TZ", "lkt-US", "luo-KE", "luy-KE", "mas-KE", "mas-TZ", "mer-KE", "mfe-MU", "mgh-MZ", "mgo-CM", "mua-CM", "naq-NA", "nmg-CM", "nnh-CM", "nus-SD", "nyn-UG", "rof-TZ", "rwk-TZ", "sah-RU", "saq-KE", "sbp-TZ", "seh-MZ", "ses-ML", "shi-Latn", "shi-Latn-MA", "shi-Tfng", "shi-Tfng-MA", "smn-FI", "teo-KE", "teo-UG", "twq-NE", "tzm-Latn", "tzm-Latn-MA", "vai-Latn", "vai-Latn-LR", "vai-Vaii", "vai-Vaii-LR", "vun-TZ", "wae-CH", "xog-UG", "yav-CM", "zgh-MA", "af-NA", "af-ZA", "ak-GH", "am-ET", "ar-001", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ", "ar-EG", "ar-EH", "ar-ER", "ar-IL", "ar-IQ", "ar-JO", "ar-KM", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-MR", "ar-OM", "ar-PS", "ar-QA", "ar-SA", "ar-SD", "ar-SO", "ar-SS", "ar-SY", "ar-TD", "ar-TN", "ar-YE", "as-IN", "az-Cyrl", "az-Cyrl-AZ", "az-Latn", "az-Latn-AZ", "be-BY", "bg-BG", "bm-Latn", "bm-Latn-ML", "bn-BD", "bn-IN", "bo-CN", "bo-IN", "br-FR", "bs-Cyrl", "bs-Cyrl-BA", "bs-Latn", "bs-Latn-BA", "ca-AD", "ca-ES", "ca-ES-VALENCIA", "ca-FR", "ca-IT", "cs-CZ", "cy-GB", "da-DK", "da-GL", "de-AT", "de-BE", "de-CH", "de-DE", "de-LI", "de-LU", "dz-BT", "ee-GH", "ee-TG", "el-CY", "el-GR", "en-001", "en-150", "en-AG", "en-AI", "en-AS", "en-AU", "en-BB", "en-BE", "en-BM", "en-BS", "en-BW", "en-BZ", "en-CA", "en-CC", "en-CK", "en-CM", "en-CX", "en-DG", "en-DM", "en-ER", "en-FJ", "en-FK", "en-FM", "en-GB", "en-GD", "en-GG", "en-GH", "en-GI", "en-GM", "en-GU", "en-GY", "en-HK", "en-IE", "en-IM", "en-IN", "en-IO", "en-JE", "en-JM", "en-KE", "en-KI", "en-KN", "en-KY", "en-LC", "en-LR", "en-LS", "en-MG", "en-MH", "en-MO", "en-MP", "en-MS", "en-MT", "en-MU", "en-MW", "en-MY", "en-NA", "en-NF", "en-NG", "en-NR", "en-NU", "en-NZ", "en-PG", "en-PH", "en-PK", "en-PN", "en-PR", "en-PW", "en-RW", "en-SB", "en-SC", "en-SD", "en-SG", "en-SH", "en-SL", "en-SS", "en-SX", "en-SZ", "en-TC", "en-TK", "en-TO", "en-TT", "en-TV", "en-TZ", "en-UG", "en-UM", "en-US", "en-US-POSIX", "en-VC", "en-VG", "en-VI", "en-VU", "en-WS", "en-ZA", "en-ZM", "en-ZW", "eo-001", "es-419", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-CU", "es-DO", "es-EA", "es-EC", "es-ES", "es-GQ", "es-GT", "es-HN", "es-IC", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH", "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et-EE", "eu-ES", "fa-AF", "fa-IR", "ff-CM", "ff-GN", "ff-MR", "ff-SN", "fi-FI", "fo-FO", "fr-BE", "fr-BF", "fr-BI", "fr-BJ", "fr-BL", "fr-CA", "fr-CD", "fr-CF", "fr-CG", "fr-CH", "fr-CI", "fr-CM", "fr-DJ", "fr-DZ", "fr-FR", "fr-GA", "fr-GF", "fr-GN", "fr-GP", "fr-GQ", "fr-HT", "fr-KM", "fr-LU", "fr-MA", "fr-MC", "fr-MF", "fr-MG", "fr-ML", "fr-MQ", "fr-MR", "fr-MU", "fr-NC", "fr-NE", "fr-PF", "fr-PM", "fr-RE", "fr-RW", "fr-SC", "fr-SN", "fr-SY", "fr-TD", "fr-TG", "fr-TN", "fr-VU", "fr-WF", "fr-YT", "fy-NL", "ga-IE", "gd-GB", "gl-ES", "gu-IN", "gv-IM", "ha-Latn", "ha-Latn-GH", "ha-Latn-NE", "ha-Latn-NG", "he-IL", "hi-IN", "hr-BA", "hr-HR", "hu-HU", "hy-AM", "id-ID", "ig-NG", "ii-CN", "is-IS", "it-CH", "it-IT", "it-SM", "ja-JP", "ka-GE", "ki-KE", "kk-Cyrl", "kk-Cyrl-KZ", "kl-GL", "km-KH", "kn-IN", "ko-KP", "ko-KR", "ks-Arab", "ks-Arab-IN", "kw-GB", "ky-Cyrl", "ky-Cyrl-KG", "lb-LU", "lg-UG", "ln-AO", "ln-CD", "ln-CF", "ln-CG", "lo-LA", "lt-LT", "lu-CD", "lv-LV", "mg-MG", "mk-MK", "ml-IN", "mn-Cyrl", "mn-Cyrl-MN", "mr-IN", "ms-Latn", "ms-Latn-BN", "ms-Latn-MY", "ms-Latn-SG", "mt-MT", "my-MM", "nb-NO", "nb-SJ", "nd-ZW", "ne-IN", "ne-NP", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-NL", "nl-SR", "nl-SX", "nn-NO", "om-ET", "om-KE", "or-IN", "os-GE", "os-RU", "pa-Arab", "pa-Arab-PK", "pa-Guru", "pa-Guru-IN", "pl-PL", "ps-AF", "pt-AO", "pt-BR", "pt-CV", "pt-GW", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-TL", "qu-BO", "qu-EC", "qu-PE", "rm-CH", "rn-BI", "ro-MD", "ro-RO", "ru-BY", "ru-KG", "ru-KZ", "ru-MD", "ru-RU", "ru-UA", "rw-RW", "se-FI", "se-NO", "se-SE", "sg-CF", "si-LK", "sk-SK", "sl-SI", "sn-ZW", "so-DJ", "so-ET", "so-KE", "so-SO", "sq-AL", "sq-MK", "sq-XK", "sr-Cyrl", "sr-Cyrl-BA", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl-XK", "sr-Latn", "sr-Latn-BA", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn-XK", "sv-AX", "sv-FI", "sv-SE", "sw-CD", "sw-KE", "sw-TZ", "sw-UG", "ta-IN", "ta-LK", "ta-MY", "ta-SG", "te-IN", "th-TH", "ti-ER", "ti-ET", "to-TO", "tr-CY", "tr-TR", "ug-Arab", "ug-Arab-CN", "uk-UA", "ur-IN", "ur-PK", "uz-Arab", "uz-Arab-AF", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "vi-VN", "yi-001", "yo-BJ", "yo-NG", "zh-Hans", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zu-ZA"],
      us_states_and_dc: [{
        name: 'Alabama',
        abbreviation: 'AL'
      }, {
        name: 'Alaska',
        abbreviation: 'AK'
      }, {
        name: 'Arizona',
        abbreviation: 'AZ'
      }, {
        name: 'Arkansas',
        abbreviation: 'AR'
      }, {
        name: 'California',
        abbreviation: 'CA'
      }, {
        name: 'Colorado',
        abbreviation: 'CO'
      }, {
        name: 'Connecticut',
        abbreviation: 'CT'
      }, {
        name: 'Delaware',
        abbreviation: 'DE'
      }, {
        name: 'District of Columbia',
        abbreviation: 'DC'
      }, {
        name: 'Florida',
        abbreviation: 'FL'
      }, {
        name: 'Georgia',
        abbreviation: 'GA'
      }, {
        name: 'Hawaii',
        abbreviation: 'HI'
      }, {
        name: 'Idaho',
        abbreviation: 'ID'
      }, {
        name: 'Illinois',
        abbreviation: 'IL'
      }, {
        name: 'Indiana',
        abbreviation: 'IN'
      }, {
        name: 'Iowa',
        abbreviation: 'IA'
      }, {
        name: 'Kansas',
        abbreviation: 'KS'
      }, {
        name: 'Kentucky',
        abbreviation: 'KY'
      }, {
        name: 'Louisiana',
        abbreviation: 'LA'
      }, {
        name: 'Maine',
        abbreviation: 'ME'
      }, {
        name: 'Maryland',
        abbreviation: 'MD'
      }, {
        name: 'Massachusetts',
        abbreviation: 'MA'
      }, {
        name: 'Michigan',
        abbreviation: 'MI'
      }, {
        name: 'Minnesota',
        abbreviation: 'MN'
      }, {
        name: 'Mississippi',
        abbreviation: 'MS'
      }, {
        name: 'Missouri',
        abbreviation: 'MO'
      }, {
        name: 'Montana',
        abbreviation: 'MT'
      }, {
        name: 'Nebraska',
        abbreviation: 'NE'
      }, {
        name: 'Nevada',
        abbreviation: 'NV'
      }, {
        name: 'New Hampshire',
        abbreviation: 'NH'
      }, {
        name: 'New Jersey',
        abbreviation: 'NJ'
      }, {
        name: 'New Mexico',
        abbreviation: 'NM'
      }, {
        name: 'New York',
        abbreviation: 'NY'
      }, {
        name: 'North Carolina',
        abbreviation: 'NC'
      }, {
        name: 'North Dakota',
        abbreviation: 'ND'
      }, {
        name: 'Ohio',
        abbreviation: 'OH'
      }, {
        name: 'Oklahoma',
        abbreviation: 'OK'
      }, {
        name: 'Oregon',
        abbreviation: 'OR'
      }, {
        name: 'Pennsylvania',
        abbreviation: 'PA'
      }, {
        name: 'Rhode Island',
        abbreviation: 'RI'
      }, {
        name: 'South Carolina',
        abbreviation: 'SC'
      }, {
        name: 'South Dakota',
        abbreviation: 'SD'
      }, {
        name: 'Tennessee',
        abbreviation: 'TN'
      }, {
        name: 'Texas',
        abbreviation: 'TX'
      }, {
        name: 'Utah',
        abbreviation: 'UT'
      }, {
        name: 'Vermont',
        abbreviation: 'VT'
      }, {
        name: 'Virginia',
        abbreviation: 'VA'
      }, {
        name: 'Washington',
        abbreviation: 'WA'
      }, {
        name: 'West Virginia',
        abbreviation: 'WV'
      }, {
        name: 'Wisconsin',
        abbreviation: 'WI'
      }, {
        name: 'Wyoming',
        abbreviation: 'WY'
      }],
      territories: [{
        name: 'American Samoa',
        abbreviation: 'AS'
      }, {
        name: 'Federated States of Micronesia',
        abbreviation: 'FM'
      }, {
        name: 'Guam',
        abbreviation: 'GU'
      }, {
        name: 'Marshall Islands',
        abbreviation: 'MH'
      }, {
        name: 'Northern Mariana Islands',
        abbreviation: 'MP'
      }, {
        name: 'Puerto Rico',
        abbreviation: 'PR'
      }, {
        name: 'Virgin Islands, U.S.',
        abbreviation: 'VI'
      }],
      armed_forces: [{
        name: 'Armed Forces Europe',
        abbreviation: 'AE'
      }, {
        name: 'Armed Forces Pacific',
        abbreviation: 'AP'
      }, {
        name: 'Armed Forces the Americas',
        abbreviation: 'AA'
      }],
      country_regions: {
        it: [{
          name: "Valle d'Aosta",
          abbreviation: "VDA"
        }, {
          name: "Piemonte",
          abbreviation: "PIE"
        }, {
          name: "Lombardia",
          abbreviation: "LOM"
        }, {
          name: "Veneto",
          abbreviation: "VEN"
        }, {
          name: "Trentino Alto Adige",
          abbreviation: "TAA"
        }, {
          name: "Friuli Venezia Giulia",
          abbreviation: "FVG"
        }, {
          name: "Liguria",
          abbreviation: "LIG"
        }, {
          name: "Emilia Romagna",
          abbreviation: "EMR"
        }, {
          name: "Toscana",
          abbreviation: "TOS"
        }, {
          name: "Umbria",
          abbreviation: "UMB"
        }, {
          name: "Marche",
          abbreviation: "MAR"
        }, {
          name: "Abruzzo",
          abbreviation: "ABR"
        }, {
          name: "Lazio",
          abbreviation: "LAZ"
        }, {
          name: "Campania",
          abbreviation: "CAM"
        }, {
          name: "Puglia",
          abbreviation: "PUG"
        }, {
          name: "Basilicata",
          abbreviation: "BAS"
        }, {
          name: "Molise",
          abbreviation: "MOL"
        }, {
          name: "Calabria",
          abbreviation: "CAL"
        }, {
          name: "Sicilia",
          abbreviation: "SIC"
        }, {
          name: "Sardegna",
          abbreviation: "SAR"
        }],
        mx: [{
          name: 'Aguascalientes',
          abbreviation: 'AGU'
        }, {
          name: 'Baja California',
          abbreviation: 'BCN'
        }, {
          name: 'Baja California Sur',
          abbreviation: 'BCS'
        }, {
          name: 'Campeche',
          abbreviation: 'CAM'
        }, {
          name: 'Chiapas',
          abbreviation: 'CHP'
        }, {
          name: 'Chihuahua',
          abbreviation: 'CHH'
        }, {
          name: 'Ciudad de México',
          abbreviation: 'DIF'
        }, {
          name: 'Coahuila',
          abbreviation: 'COA'
        }, {
          name: 'Colima',
          abbreviation: 'COL'
        }, {
          name: 'Durango',
          abbreviation: 'DUR'
        }, {
          name: 'Guanajuato',
          abbreviation: 'GUA'
        }, {
          name: 'Guerrero',
          abbreviation: 'GRO'
        }, {
          name: 'Hidalgo',
          abbreviation: 'HID'
        }, {
          name: 'Jalisco',
          abbreviation: 'JAL'
        }, {
          name: 'México',
          abbreviation: 'MEX'
        }, {
          name: 'Michoacán',
          abbreviation: 'MIC'
        }, {
          name: 'Morelos',
          abbreviation: 'MOR'
        }, {
          name: 'Nayarit',
          abbreviation: 'NAY'
        }, {
          name: 'Nuevo León',
          abbreviation: 'NLE'
        }, {
          name: 'Oaxaca',
          abbreviation: 'OAX'
        }, {
          name: 'Puebla',
          abbreviation: 'PUE'
        }, {
          name: 'Querétaro',
          abbreviation: 'QUE'
        }, {
          name: 'Quintana Roo',
          abbreviation: 'ROO'
        }, {
          name: 'San Luis Potosí',
          abbreviation: 'SLP'
        }, {
          name: 'Sinaloa',
          abbreviation: 'SIN'
        }, {
          name: 'Sonora',
          abbreviation: 'SON'
        }, {
          name: 'Tabasco',
          abbreviation: 'TAB'
        }, {
          name: 'Tamaulipas',
          abbreviation: 'TAM'
        }, {
          name: 'Tlaxcala',
          abbreviation: 'TLA'
        }, {
          name: 'Veracruz',
          abbreviation: 'VER'
        }, {
          name: 'Yucatán',
          abbreviation: 'YUC'
        }, {
          name: 'Zacatecas',
          abbreviation: 'ZAC'
        }]
      },
      street_suffixes: {
        'us': [{
          name: 'Avenue',
          abbreviation: 'Ave'
        }, {
          name: 'Boulevard',
          abbreviation: 'Blvd'
        }, {
          name: 'Center',
          abbreviation: 'Ctr'
        }, {
          name: 'Circle',
          abbreviation: 'Cir'
        }, {
          name: 'Court',
          abbreviation: 'Ct'
        }, {
          name: 'Drive',
          abbreviation: 'Dr'
        }, {
          name: 'Extension',
          abbreviation: 'Ext'
        }, {
          name: 'Glen',
          abbreviation: 'Gln'
        }, {
          name: 'Grove',
          abbreviation: 'Grv'
        }, {
          name: 'Heights',
          abbreviation: 'Hts'
        }, {
          name: 'Highway',
          abbreviation: 'Hwy'
        }, {
          name: 'Junction',
          abbreviation: 'Jct'
        }, {
          name: 'Key',
          abbreviation: 'Key'
        }, {
          name: 'Lane',
          abbreviation: 'Ln'
        }, {
          name: 'Loop',
          abbreviation: 'Loop'
        }, {
          name: 'Manor',
          abbreviation: 'Mnr'
        }, {
          name: 'Mill',
          abbreviation: 'Mill'
        }, {
          name: 'Park',
          abbreviation: 'Park'
        }, {
          name: 'Parkway',
          abbreviation: 'Pkwy'
        }, {
          name: 'Pass',
          abbreviation: 'Pass'
        }, {
          name: 'Path',
          abbreviation: 'Path'
        }, {
          name: 'Pike',
          abbreviation: 'Pike'
        }, {
          name: 'Place',
          abbreviation: 'Pl'
        }, {
          name: 'Plaza',
          abbreviation: 'Plz'
        }, {
          name: 'Point',
          abbreviation: 'Pt'
        }, {
          name: 'Ridge',
          abbreviation: 'Rdg'
        }, {
          name: 'River',
          abbreviation: 'Riv'
        }, {
          name: 'Road',
          abbreviation: 'Rd'
        }, {
          name: 'Square',
          abbreviation: 'Sq'
        }, {
          name: 'Street',
          abbreviation: 'St'
        }, {
          name: 'Terrace',
          abbreviation: 'Ter'
        }, {
          name: 'Trail',
          abbreviation: 'Trl'
        }, {
          name: 'Turnpike',
          abbreviation: 'Tpke'
        }, {
          name: 'View',
          abbreviation: 'Vw'
        }, {
          name: 'Way',
          abbreviation: 'Way'
        }],
        'it': [{
          name: 'Accesso',
          abbreviation: 'Acc.'
        }, {
          name: 'Alzaia',
          abbreviation: 'Alz.'
        }, {
          name: 'Arco',
          abbreviation: 'Arco'
        }, {
          name: 'Archivolto',
          abbreviation: 'Acv.'
        }, {
          name: 'Arena',
          abbreviation: 'Arena'
        }, {
          name: 'Argine',
          abbreviation: 'Argine'
        }, {
          name: 'Bacino',
          abbreviation: 'Bacino'
        }, {
          name: 'Banchi',
          abbreviation: 'Banchi'
        }, {
          name: 'Banchina',
          abbreviation: 'Ban.'
        }, {
          name: 'Bastioni',
          abbreviation: 'Bas.'
        }, {
          name: 'Belvedere',
          abbreviation: 'Belv.'
        }, {
          name: 'Borgata',
          abbreviation: 'B.ta'
        }, {
          name: 'Borgo',
          abbreviation: 'B.go'
        }, {
          name: 'Calata',
          abbreviation: 'Cal.'
        }, {
          name: 'Calle',
          abbreviation: 'Calle'
        }, {
          name: 'Campiello',
          abbreviation: 'Cam.'
        }, {
          name: 'Campo',
          abbreviation: 'Cam.'
        }, {
          name: 'Canale',
          abbreviation: 'Can.'
        }, {
          name: 'Carraia',
          abbreviation: 'Carr.'
        }, {
          name: 'Cascina',
          abbreviation: 'Cascina'
        }, {
          name: 'Case sparse',
          abbreviation: 'c.s.'
        }, {
          name: 'Cavalcavia',
          abbreviation: 'Cv.'
        }, {
          name: 'Circonvallazione',
          abbreviation: 'Cv.'
        }, {
          name: 'Complanare',
          abbreviation: 'C.re'
        }, {
          name: 'Contrada',
          abbreviation: 'C.da'
        }, {
          name: 'Corso',
          abbreviation: 'C.so'
        }, {
          name: 'Corte',
          abbreviation: 'C.te'
        }, {
          name: 'Cortile',
          abbreviation: 'C.le'
        }, {
          name: 'Diramazione',
          abbreviation: 'Dir.'
        }, {
          name: 'Fondaco',
          abbreviation: 'F.co'
        }, {
          name: 'Fondamenta',
          abbreviation: 'F.ta'
        }, {
          name: 'Fondo',
          abbreviation: 'F.do'
        }, {
          name: 'Frazione',
          abbreviation: 'Fr.'
        }, {
          name: 'Isola',
          abbreviation: 'Is.'
        }, {
          name: 'Largo',
          abbreviation: 'L.go'
        }, {
          name: 'Litoranea',
          abbreviation: 'Lit.'
        }, {
          name: 'Lungolago',
          abbreviation: 'L.go lago'
        }, {
          name: 'Lungo Po',
          abbreviation: 'l.go Po'
        }, {
          name: 'Molo',
          abbreviation: 'Molo'
        }, {
          name: 'Mura',
          abbreviation: 'Mura'
        }, {
          name: 'Passaggio privato',
          abbreviation: 'pass. priv.'
        }, {
          name: 'Passeggiata',
          abbreviation: 'Pass.'
        }, {
          name: 'Piazza',
          abbreviation: 'P.zza'
        }, {
          name: 'Piazzale',
          abbreviation: 'P.le'
        }, {
          name: 'Ponte',
          abbreviation: 'P.te'
        }, {
          name: 'Portico',
          abbreviation: 'P.co'
        }, {
          name: 'Rampa',
          abbreviation: 'Rampa'
        }, {
          name: 'Regione',
          abbreviation: 'Reg.'
        }, {
          name: 'Rione',
          abbreviation: 'R.ne'
        }, {
          name: 'Rio',
          abbreviation: 'Rio'
        }, {
          name: 'Ripa',
          abbreviation: 'Ripa'
        }, {
          name: 'Riva',
          abbreviation: 'Riva'
        }, {
          name: 'Rondò',
          abbreviation: 'Rondò'
        }, {
          name: 'Rotonda',
          abbreviation: 'Rot.'
        }, {
          name: 'Sagrato',
          abbreviation: 'Sagr.'
        }, {
          name: 'Salita',
          abbreviation: 'Sal.'
        }, {
          name: 'Scalinata',
          abbreviation: 'Scal.'
        }, {
          name: 'Scalone',
          abbreviation: 'Scal.'
        }, {
          name: 'Slargo',
          abbreviation: 'Sl.'
        }, {
          name: 'Sottoportico',
          abbreviation: 'Sott.'
        }, {
          name: 'Strada',
          abbreviation: 'Str.'
        }, {
          name: 'Stradale',
          abbreviation: 'Str.le'
        }, {
          name: 'Strettoia',
          abbreviation: 'Strett.'
        }, {
          name: 'Traversa',
          abbreviation: 'Trav.'
        }, {
          name: 'Via',
          abbreviation: 'V.'
        }, {
          name: 'Viale',
          abbreviation: 'V.le'
        }, {
          name: 'Vicinale',
          abbreviation: 'Vic.le'
        }, {
          name: 'Vicolo',
          abbreviation: 'Vic.'
        }],
        'uk': [{
          name: 'Avenue',
          abbreviation: 'Ave'
        }, {
          name: 'Close',
          abbreviation: 'Cl'
        }, {
          name: 'Court',
          abbreviation: 'Ct'
        }, {
          name: 'Crescent',
          abbreviation: 'Cr'
        }, {
          name: 'Drive',
          abbreviation: 'Dr'
        }, {
          name: 'Garden',
          abbreviation: 'Gdn'
        }, {
          name: 'Gardens',
          abbreviation: 'Gdns'
        }, {
          name: 'Green',
          abbreviation: 'Gn'
        }, {
          name: 'Grove',
          abbreviation: 'Gr'
        }, {
          name: 'Lane',
          abbreviation: 'Ln'
        }, {
          name: 'Mount',
          abbreviation: 'Mt'
        }, {
          name: 'Place',
          abbreviation: 'Pl'
        }, {
          name: 'Park',
          abbreviation: 'Pk'
        }, {
          name: 'Ridge',
          abbreviation: 'Rdg'
        }, {
          name: 'Road',
          abbreviation: 'Rd'
        }, {
          name: 'Square',
          abbreviation: 'Sq'
        }, {
          name: 'Street',
          abbreviation: 'St'
        }, {
          name: 'Terrace',
          abbreviation: 'Ter'
        }, {
          name: 'Valley',
          abbreviation: 'Val'
        }]
      },
      months: [{
        name: 'January',
        short_name: 'Jan',
        numeric: '01',
        days: 31
      }, // Not messing with leap years...
      {
        name: 'February',
        short_name: 'Feb',
        numeric: '02',
        days: 28
      }, {
        name: 'March',
        short_name: 'Mar',
        numeric: '03',
        days: 31
      }, {
        name: 'April',
        short_name: 'Apr',
        numeric: '04',
        days: 30
      }, {
        name: 'May',
        short_name: 'May',
        numeric: '05',
        days: 31
      }, {
        name: 'June',
        short_name: 'Jun',
        numeric: '06',
        days: 30
      }, {
        name: 'July',
        short_name: 'Jul',
        numeric: '07',
        days: 31
      }, {
        name: 'August',
        short_name: 'Aug',
        numeric: '08',
        days: 31
      }, {
        name: 'September',
        short_name: 'Sep',
        numeric: '09',
        days: 30
      }, {
        name: 'October',
        short_name: 'Oct',
        numeric: '10',
        days: 31
      }, {
        name: 'November',
        short_name: 'Nov',
        numeric: '11',
        days: 30
      }, {
        name: 'December',
        short_name: 'Dec',
        numeric: '12',
        days: 31
      }],
      // http://en.wikipedia.org/wiki/Bank_card_number#Issuer_identification_number_.28IIN.29
      cc_types: [{
        name: "American Express",
        short_name: 'amex',
        prefix: '34',
        length: 15
      }, {
        name: "Bankcard",
        short_name: 'bankcard',
        prefix: '5610',
        length: 16
      }, {
        name: "China UnionPay",
        short_name: 'chinaunion',
        prefix: '62',
        length: 16
      }, {
        name: "Diners Club Carte Blanche",
        short_name: 'dccarte',
        prefix: '300',
        length: 14
      }, {
        name: "Diners Club enRoute",
        short_name: 'dcenroute',
        prefix: '2014',
        length: 15
      }, {
        name: "Diners Club International",
        short_name: 'dcintl',
        prefix: '36',
        length: 14
      }, {
        name: "Diners Club United States & Canada",
        short_name: 'dcusc',
        prefix: '54',
        length: 16
      }, {
        name: "Discover Card",
        short_name: 'discover',
        prefix: '6011',
        length: 16
      }, {
        name: "InstaPayment",
        short_name: 'instapay',
        prefix: '637',
        length: 16
      }, {
        name: "JCB",
        short_name: 'jcb',
        prefix: '3528',
        length: 16
      }, {
        name: "Laser",
        short_name: 'laser',
        prefix: '6304',
        length: 16
      }, {
        name: "Maestro",
        short_name: 'maestro',
        prefix: '5018',
        length: 16
      }, {
        name: "Mastercard",
        short_name: 'mc',
        prefix: '51',
        length: 16
      }, {
        name: "Solo",
        short_name: 'solo',
        prefix: '6334',
        length: 16
      }, {
        name: "Switch",
        short_name: 'switch',
        prefix: '4903',
        length: 16
      }, {
        name: "Visa",
        short_name: 'visa',
        prefix: '4',
        length: 16
      }, {
        name: "Visa Electron",
        short_name: 'electron',
        prefix: '4026',
        length: 16
      }],
      //return all world currency by ISO 4217
      currency_types: [{
        'code': 'AED',
        'name': 'United Arab Emirates Dirham'
      }, {
        'code': 'AFN',
        'name': 'Afghanistan Afghani'
      }, {
        'code': 'ALL',
        'name': 'Albania Lek'
      }, {
        'code': 'AMD',
        'name': 'Armenia Dram'
      }, {
        'code': 'ANG',
        'name': 'Netherlands Antilles Guilder'
      }, {
        'code': 'AOA',
        'name': 'Angola Kwanza'
      }, {
        'code': 'ARS',
        'name': 'Argentina Peso'
      }, {
        'code': 'AUD',
        'name': 'Australia Dollar'
      }, {
        'code': 'AWG',
        'name': 'Aruba Guilder'
      }, {
        'code': 'AZN',
        'name': 'Azerbaijan New Manat'
      }, {
        'code': 'BAM',
        'name': 'Bosnia and Herzegovina Convertible Marka'
      }, {
        'code': 'BBD',
        'name': 'Barbados Dollar'
      }, {
        'code': 'BDT',
        'name': 'Bangladesh Taka'
      }, {
        'code': 'BGN',
        'name': 'Bulgaria Lev'
      }, {
        'code': 'BHD',
        'name': 'Bahrain Dinar'
      }, {
        'code': 'BIF',
        'name': 'Burundi Franc'
      }, {
        'code': 'BMD',
        'name': 'Bermuda Dollar'
      }, {
        'code': 'BND',
        'name': 'Brunei Darussalam Dollar'
      }, {
        'code': 'BOB',
        'name': 'Bolivia Boliviano'
      }, {
        'code': 'BRL',
        'name': 'Brazil Real'
      }, {
        'code': 'BSD',
        'name': 'Bahamas Dollar'
      }, {
        'code': 'BTN',
        'name': 'Bhutan Ngultrum'
      }, {
        'code': 'BWP',
        'name': 'Botswana Pula'
      }, {
        'code': 'BYR',
        'name': 'Belarus Ruble'
      }, {
        'code': 'BZD',
        'name': 'Belize Dollar'
      }, {
        'code': 'CAD',
        'name': 'Canada Dollar'
      }, {
        'code': 'CDF',
        'name': 'Congo/Kinshasa Franc'
      }, {
        'code': 'CHF',
        'name': 'Switzerland Franc'
      }, {
        'code': 'CLP',
        'name': 'Chile Peso'
      }, {
        'code': 'CNY',
        'name': 'China Yuan Renminbi'
      }, {
        'code': 'COP',
        'name': 'Colombia Peso'
      }, {
        'code': 'CRC',
        'name': 'Costa Rica Colon'
      }, {
        'code': 'CUC',
        'name': 'Cuba Convertible Peso'
      }, {
        'code': 'CUP',
        'name': 'Cuba Peso'
      }, {
        'code': 'CVE',
        'name': 'Cape Verde Escudo'
      }, {
        'code': 'CZK',
        'name': 'Czech Republic Koruna'
      }, {
        'code': 'DJF',
        'name': 'Djibouti Franc'
      }, {
        'code': 'DKK',
        'name': 'Denmark Krone'
      }, {
        'code': 'DOP',
        'name': 'Dominican Republic Peso'
      }, {
        'code': 'DZD',
        'name': 'Algeria Dinar'
      }, {
        'code': 'EGP',
        'name': 'Egypt Pound'
      }, {
        'code': 'ERN',
        'name': 'Eritrea Nakfa'
      }, {
        'code': 'ETB',
        'name': 'Ethiopia Birr'
      }, {
        'code': 'EUR',
        'name': 'Euro Member Countries'
      }, {
        'code': 'FJD',
        'name': 'Fiji Dollar'
      }, {
        'code': 'FKP',
        'name': 'Falkland Islands (Malvinas) Pound'
      }, {
        'code': 'GBP',
        'name': 'United Kingdom Pound'
      }, {
        'code': 'GEL',
        'name': 'Georgia Lari'
      }, {
        'code': 'GGP',
        'name': 'Guernsey Pound'
      }, {
        'code': 'GHS',
        'name': 'Ghana Cedi'
      }, {
        'code': 'GIP',
        'name': 'Gibraltar Pound'
      }, {
        'code': 'GMD',
        'name': 'Gambia Dalasi'
      }, {
        'code': 'GNF',
        'name': 'Guinea Franc'
      }, {
        'code': 'GTQ',
        'name': 'Guatemala Quetzal'
      }, {
        'code': 'GYD',
        'name': 'Guyana Dollar'
      }, {
        'code': 'HKD',
        'name': 'Hong Kong Dollar'
      }, {
        'code': 'HNL',
        'name': 'Honduras Lempira'
      }, {
        'code': 'HRK',
        'name': 'Croatia Kuna'
      }, {
        'code': 'HTG',
        'name': 'Haiti Gourde'
      }, {
        'code': 'HUF',
        'name': 'Hungary Forint'
      }, {
        'code': 'IDR',
        'name': 'Indonesia Rupiah'
      }, {
        'code': 'ILS',
        'name': 'Israel Shekel'
      }, {
        'code': 'IMP',
        'name': 'Isle of Man Pound'
      }, {
        'code': 'INR',
        'name': 'India Rupee'
      }, {
        'code': 'IQD',
        'name': 'Iraq Dinar'
      }, {
        'code': 'IRR',
        'name': 'Iran Rial'
      }, {
        'code': 'ISK',
        'name': 'Iceland Krona'
      }, {
        'code': 'JEP',
        'name': 'Jersey Pound'
      }, {
        'code': 'JMD',
        'name': 'Jamaica Dollar'
      }, {
        'code': 'JOD',
        'name': 'Jordan Dinar'
      }, {
        'code': 'JPY',
        'name': 'Japan Yen'
      }, {
        'code': 'KES',
        'name': 'Kenya Shilling'
      }, {
        'code': 'KGS',
        'name': 'Kyrgyzstan Som'
      }, {
        'code': 'KHR',
        'name': 'Cambodia Riel'
      }, {
        'code': 'KMF',
        'name': 'Comoros Franc'
      }, {
        'code': 'KPW',
        'name': 'Korea (North) Won'
      }, {
        'code': 'KRW',
        'name': 'Korea (South) Won'
      }, {
        'code': 'KWD',
        'name': 'Kuwait Dinar'
      }, {
        'code': 'KYD',
        'name': 'Cayman Islands Dollar'
      }, {
        'code': 'KZT',
        'name': 'Kazakhstan Tenge'
      }, {
        'code': 'LAK',
        'name': 'Laos Kip'
      }, {
        'code': 'LBP',
        'name': 'Lebanon Pound'
      }, {
        'code': 'LKR',
        'name': 'Sri Lanka Rupee'
      }, {
        'code': 'LRD',
        'name': 'Liberia Dollar'
      }, {
        'code': 'LSL',
        'name': 'Lesotho Loti'
      }, {
        'code': 'LTL',
        'name': 'Lithuania Litas'
      }, {
        'code': 'LYD',
        'name': 'Libya Dinar'
      }, {
        'code': 'MAD',
        'name': 'Morocco Dirham'
      }, {
        'code': 'MDL',
        'name': 'Moldova Leu'
      }, {
        'code': 'MGA',
        'name': 'Madagascar Ariary'
      }, {
        'code': 'MKD',
        'name': 'Macedonia Denar'
      }, {
        'code': 'MMK',
        'name': 'Myanmar (Burma) Kyat'
      }, {
        'code': 'MNT',
        'name': 'Mongolia Tughrik'
      }, {
        'code': 'MOP',
        'name': 'Macau Pataca'
      }, {
        'code': 'MRO',
        'name': 'Mauritania Ouguiya'
      }, {
        'code': 'MUR',
        'name': 'Mauritius Rupee'
      }, {
        'code': 'MVR',
        'name': 'Maldives (Maldive Islands) Rufiyaa'
      }, {
        'code': 'MWK',
        'name': 'Malawi Kwacha'
      }, {
        'code': 'MXN',
        'name': 'Mexico Peso'
      }, {
        'code': 'MYR',
        'name': 'Malaysia Ringgit'
      }, {
        'code': 'MZN',
        'name': 'Mozambique Metical'
      }, {
        'code': 'NAD',
        'name': 'Namibia Dollar'
      }, {
        'code': 'NGN',
        'name': 'Nigeria Naira'
      }, {
        'code': 'NIO',
        'name': 'Nicaragua Cordoba'
      }, {
        'code': 'NOK',
        'name': 'Norway Krone'
      }, {
        'code': 'NPR',
        'name': 'Nepal Rupee'
      }, {
        'code': 'NZD',
        'name': 'New Zealand Dollar'
      }, {
        'code': 'OMR',
        'name': 'Oman Rial'
      }, {
        'code': 'PAB',
        'name': 'Panama Balboa'
      }, {
        'code': 'PEN',
        'name': 'Peru Nuevo Sol'
      }, {
        'code': 'PGK',
        'name': 'Papua New Guinea Kina'
      }, {
        'code': 'PHP',
        'name': 'Philippines Peso'
      }, {
        'code': 'PKR',
        'name': 'Pakistan Rupee'
      }, {
        'code': 'PLN',
        'name': 'Poland Zloty'
      }, {
        'code': 'PYG',
        'name': 'Paraguay Guarani'
      }, {
        'code': 'QAR',
        'name': 'Qatar Riyal'
      }, {
        'code': 'RON',
        'name': 'Romania New Leu'
      }, {
        'code': 'RSD',
        'name': 'Serbia Dinar'
      }, {
        'code': 'RUB',
        'name': 'Russia Ruble'
      }, {
        'code': 'RWF',
        'name': 'Rwanda Franc'
      }, {
        'code': 'SAR',
        'name': 'Saudi Arabia Riyal'
      }, {
        'code': 'SBD',
        'name': 'Solomon Islands Dollar'
      }, {
        'code': 'SCR',
        'name': 'Seychelles Rupee'
      }, {
        'code': 'SDG',
        'name': 'Sudan Pound'
      }, {
        'code': 'SEK',
        'name': 'Sweden Krona'
      }, {
        'code': 'SGD',
        'name': 'Singapore Dollar'
      }, {
        'code': 'SHP',
        'name': 'Saint Helena Pound'
      }, {
        'code': 'SLL',
        'name': 'Sierra Leone Leone'
      }, {
        'code': 'SOS',
        'name': 'Somalia Shilling'
      }, {
        'code': 'SPL',
        'name': 'Seborga Luigino'
      }, {
        'code': 'SRD',
        'name': 'Suriname Dollar'
      }, {
        'code': 'STD',
        'name': 'São Tomé and Príncipe Dobra'
      }, {
        'code': 'SVC',
        'name': 'El Salvador Colon'
      }, {
        'code': 'SYP',
        'name': 'Syria Pound'
      }, {
        'code': 'SZL',
        'name': 'Swaziland Lilangeni'
      }, {
        'code': 'THB',
        'name': 'Thailand Baht'
      }, {
        'code': 'TJS',
        'name': 'Tajikistan Somoni'
      }, {
        'code': 'TMT',
        'name': 'Turkmenistan Manat'
      }, {
        'code': 'TND',
        'name': 'Tunisia Dinar'
      }, {
        'code': 'TOP',
        'name': 'Tonga Pa\'anga'
      }, {
        'code': 'TRY',
        'name': 'Turkey Lira'
      }, {
        'code': 'TTD',
        'name': 'Trinidad and Tobago Dollar'
      }, {
        'code': 'TVD',
        'name': 'Tuvalu Dollar'
      }, {
        'code': 'TWD',
        'name': 'Taiwan New Dollar'
      }, {
        'code': 'TZS',
        'name': 'Tanzania Shilling'
      }, {
        'code': 'UAH',
        'name': 'Ukraine Hryvnia'
      }, {
        'code': 'UGX',
        'name': 'Uganda Shilling'
      }, {
        'code': 'USD',
        'name': 'United States Dollar'
      }, {
        'code': 'UYU',
        'name': 'Uruguay Peso'
      }, {
        'code': 'UZS',
        'name': 'Uzbekistan Som'
      }, {
        'code': 'VEF',
        'name': 'Venezuela Bolivar'
      }, {
        'code': 'VND',
        'name': 'Viet Nam Dong'
      }, {
        'code': 'VUV',
        'name': 'Vanuatu Vatu'
      }, {
        'code': 'WST',
        'name': 'Samoa Tala'
      }, {
        'code': 'XAF',
        'name': 'Communauté Financière Africaine (BEAC) CFA Franc BEAC'
      }, {
        'code': 'XCD',
        'name': 'East Caribbean Dollar'
      }, {
        'code': 'XDR',
        'name': 'International Monetary Fund (IMF) Special Drawing Rights'
      }, {
        'code': 'XOF',
        'name': 'Communauté Financière Africaine (BCEAO) Franc'
      }, {
        'code': 'XPF',
        'name': 'Comptoirs Français du Pacifique (CFP) Franc'
      }, {
        'code': 'YER',
        'name': 'Yemen Rial'
      }, {
        'code': 'ZAR',
        'name': 'South Africa Rand'
      }, {
        'code': 'ZMW',
        'name': 'Zambia Kwacha'
      }, {
        'code': 'ZWD',
        'name': 'Zimbabwe Dollar'
      }],
      // return the names of all valide colors
      colorNames: ["AliceBlue", "Black", "Navy", "DarkBlue", "MediumBlue", "Blue", "DarkGreen", "Green", "Teal", "DarkCyan", "DeepSkyBlue", "DarkTurquoise", "MediumSpringGreen", "Lime", "SpringGreen", "Aqua", "Cyan", "MidnightBlue", "DodgerBlue", "LightSeaGreen", "ForestGreen", "SeaGreen", "DarkSlateGray", "LimeGreen", "MediumSeaGreen", "Turquoise", "RoyalBlue", "SteelBlue", "DarkSlateBlue", "MediumTurquoise", "Indigo", "DarkOliveGreen", "CadetBlue", "CornflowerBlue", "RebeccaPurple", "MediumAquaMarine", "DimGray", "SlateBlue", "OliveDrab", "SlateGray", "LightSlateGray", "MediumSlateBlue", "LawnGreen", "Chartreuse", "Aquamarine", "Maroon", "Purple", "Olive", "Gray", "SkyBlue", "LightSkyBlue", "BlueViolet", "DarkRed", "DarkMagenta", "SaddleBrown", "Ivory", "White", "DarkSeaGreen", "LightGreen", "MediumPurple", "DarkViolet", "PaleGreen", "DarkOrchid", "YellowGreen", "Sienna", "Brown", "DarkGray", "LightBlue", "GreenYellow", "PaleTurquoise", "LightSteelBlue", "PowderBlue", "FireBrick", "DarkGoldenRod", "MediumOrchid", "RosyBrown", "DarkKhaki", "Silver", "MediumVioletRed", "IndianRed", "Peru", "Chocolate", "Tan", "LightGray", "Thistle", "Orchid", "GoldenRod", "PaleVioletRed", "Crimson", "Gainsboro", "Plum", "BurlyWood", "LightCyan", "Lavender", "DarkSalmon", "Violet", "PaleGoldenRod", "LightCoral", "Khaki", "AliceBlue", "HoneyDew", "Azure", "SandyBrown", "Wheat", "Beige", "WhiteSmoke", "MintCream", "GhostWhite", "Salmon", "AntiqueWhite", "Linen", "LightGoldenRodYellow", "OldLace", "Red", "Fuchsia", "Magenta", "DeepPink", "OrangeRed", "Tomato", "HotPink", "Coral", "DarkOrange", "LightSalmon", "Orange", "LightPink", "Pink", "Gold", "PeachPuff", "NavajoWhite", "Moccasin", "Bisque", "MistyRose", "BlanchedAlmond", "PapayaWhip", "LavenderBlush", "SeaShell", "Cornsilk", "LemonChiffon", "FloralWhite", "Snow", "Yellow", "LightYellow"],
      // Data taken from https://www.sec.gov/rules/other/4-460list.htm
      company: ["3Com Corp", "3M Company", "A.G. Edwards Inc.", "Abbott Laboratories", "Abercrombie & Fitch Co.", "ABM Industries Incorporated", "Ace Hardware Corporation", "ACT Manufacturing Inc.", "Acterna Corp.", "Adams Resources & Energy, Inc.", "ADC Telecommunications, Inc.", "Adelphia Communications Corporation", "Administaff, Inc.", "Adobe Systems Incorporated", "Adolph Coors Company", "Advance Auto Parts, Inc.", "Advanced Micro Devices, Inc.", "AdvancePCS, Inc.", "Advantica Restaurant Group, Inc.", "The AES Corporation", "Aetna Inc.", "Affiliated Computer Services, Inc.", "AFLAC Incorporated", "AGCO Corporation", "Agilent Technologies, Inc.", "Agway Inc.", "Apartment Investment and Management Company", "Air Products and Chemicals, Inc.", "Airborne, Inc.", "Airgas, Inc.", "AK Steel Holding Corporation", "Alaska Air Group, Inc.", "Alberto-Culver Company", "Albertson's, Inc.", "Alcoa Inc.", "Alleghany Corporation", "Allegheny Energy, Inc.", "Allegheny Technologies Incorporated", "Allergan, Inc.", "ALLETE, Inc.", "Alliant Energy Corporation", "Allied Waste Industries, Inc.", "Allmerica Financial Corporation", "The Allstate Corporation", "ALLTEL Corporation", "The Alpine Group, Inc.", "Amazon.com, Inc.", "AMC Entertainment Inc.", "American Power Conversion Corporation", "Amerada Hess Corporation", "AMERCO", "Ameren Corporation", "America West Holdings Corporation", "American Axle & Manufacturing Holdings, Inc.", "American Eagle Outfitters, Inc.", "American Electric Power Company, Inc.", "American Express Company", "American Financial Group, Inc.", "American Greetings Corporation", "American International Group, Inc.", "American Standard Companies Inc.", "American Water Works Company, Inc.", "AmerisourceBergen Corporation", "Ames Department Stores, Inc.", "Amgen Inc.", "Amkor Technology, Inc.", "AMR Corporation", "AmSouth Bancorp.", "Amtran, Inc.", "Anadarko Petroleum Corporation", "Analog Devices, Inc.", "Anheuser-Busch Companies, Inc.", "Anixter International Inc.", "AnnTaylor Inc.", "Anthem, Inc.", "AOL Time Warner Inc.", "Aon Corporation", "Apache Corporation", "Apple Computer, Inc.", "Applera Corporation", "Applied Industrial Technologies, Inc.", "Applied Materials, Inc.", "Aquila, Inc.", "ARAMARK Corporation", "Arch Coal, Inc.", "Archer Daniels Midland Company", "Arkansas Best Corporation", "Armstrong Holdings, Inc.", "Arrow Electronics, Inc.", "ArvinMeritor, Inc.", "Ashland Inc.", "Astoria Financial Corporation", "AT&T Corp.", "Atmel Corporation", "Atmos Energy Corporation", "Audiovox Corporation", "Autoliv, Inc.", "Automatic Data Processing, Inc.", "AutoNation, Inc.", "AutoZone, Inc.", "Avaya Inc.", "Avery Dennison Corporation", "Avista Corporation", "Avnet, Inc.", "Avon Products, Inc.", "Baker Hughes Incorporated", "Ball Corporation", "Bank of America Corporation", "The Bank of New York Company, Inc.", "Bank One Corporation", "Banknorth Group, Inc.", "Banta Corporation", "Barnes & Noble, Inc.", "Bausch & Lomb Incorporated", "Baxter International Inc.", "BB&T Corporation", "The Bear Stearns Companies Inc.", "Beazer Homes USA, Inc.", "Beckman Coulter, Inc.", "Becton, Dickinson and Company", "Bed Bath & Beyond Inc.", "Belk, Inc.", "Bell Microproducts Inc.", "BellSouth Corporation", "Belo Corp.", "Bemis Company, Inc.", "Benchmark Electronics, Inc.", "Berkshire Hathaway Inc.", "Best Buy Co., Inc.", "Bethlehem Steel Corporation", "Beverly Enterprises, Inc.", "Big Lots, Inc.", "BJ Services Company", "BJ's Wholesale Club, Inc.", "The Black & Decker Corporation", "Black Hills Corporation", "BMC Software, Inc.", "The Boeing Company", "Boise Cascade Corporation", "Borders Group, Inc.", "BorgWarner Inc.", "Boston Scientific Corporation", "Bowater Incorporated", "Briggs & Stratton Corporation", "Brightpoint, Inc.", "Brinker International, Inc.", "Bristol-Myers Squibb Company", "Broadwing, Inc.", "Brown Shoe Company, Inc.", "Brown-Forman Corporation", "Brunswick Corporation", "Budget Group, Inc.", "Burlington Coat Factory Warehouse Corporation", "Burlington Industries, Inc.", "Burlington Northern Santa Fe Corporation", "Burlington Resources Inc.", "C. H. Robinson Worldwide Inc.", "Cablevision Systems Corp", "Cabot Corp", "Cadence Design Systems, Inc.", "Calpine Corp.", "Campbell Soup Co.", "Capital One Financial Corp.", "Cardinal Health Inc.", "Caremark Rx Inc.", "Carlisle Cos. Inc.", "Carpenter Technology Corp.", "Casey's General Stores Inc.", "Caterpillar Inc.", "CBRL Group Inc.", "CDI Corp.", "CDW Computer Centers Inc.", "CellStar Corp.", "Cendant Corp", "Cenex Harvest States Cooperatives", "Centex Corp.", "CenturyTel Inc.", "Ceridian Corp.", "CH2M Hill Cos. Ltd.", "Champion Enterprises Inc.", "Charles Schwab Corp.", "Charming Shoppes Inc.", "Charter Communications Inc.", "Charter One Financial Inc.", "ChevronTexaco Corp.", "Chiquita Brands International Inc.", "Chubb Corp", "Ciena Corp.", "Cigna Corp", "Cincinnati Financial Corp.", "Cinergy Corp.", "Cintas Corp.", "Circuit City Stores Inc.", "Cisco Systems Inc.", "Citigroup, Inc", "Citizens Communications Co.", "CKE Restaurants Inc.", "Clear Channel Communications Inc.", "The Clorox Co.", "CMGI Inc.", "CMS Energy Corp.", "CNF Inc.", "Coca-Cola Co.", "Coca-Cola Enterprises Inc.", "Colgate-Palmolive Co.", "Collins & Aikman Corp.", "Comcast Corp.", "Comdisco Inc.", "Comerica Inc.", "Comfort Systems USA Inc.", "Commercial Metals Co.", "Community Health Systems Inc.", "Compass Bancshares Inc", "Computer Associates International Inc.", "Computer Sciences Corp.", "Compuware Corp.", "Comverse Technology Inc.", "ConAgra Foods Inc.", "Concord EFS Inc.", "Conectiv, Inc", "Conoco Inc", "Conseco Inc.", "Consolidated Freightways Corp.", "Consolidated Edison Inc.", "Constellation Brands Inc.", "Constellation Emergy Group Inc.", "Continental Airlines Inc.", "Convergys Corp.", "Cooper Cameron Corp.", "Cooper Industries Ltd.", "Cooper Tire & Rubber Co.", "Corn Products International Inc.", "Corning Inc.", "Costco Wholesale Corp.", "Countrywide Credit Industries Inc.", "Coventry Health Care Inc.", "Cox Communications Inc.", "Crane Co.", "Crompton Corp.", "Crown Cork & Seal Co. Inc.", "CSK Auto Corp.", "CSX Corp.", "Cummins Inc.", "CVS Corp.", "Cytec Industries Inc.", "D&K Healthcare Resources, Inc.", "D.R. Horton Inc.", "Dana Corporation", "Danaher Corporation", "Darden Restaurants Inc.", "DaVita Inc.", "Dean Foods Company", "Deere & Company", "Del Monte Foods Co", "Dell Computer Corporation", "Delphi Corp.", "Delta Air Lines Inc.", "Deluxe Corporation", "Devon Energy Corporation", "Di Giorgio Corporation", "Dial Corporation", "Diebold Incorporated", "Dillard's Inc.", "DIMON Incorporated", "Dole Food Company, Inc.", "Dollar General Corporation", "Dollar Tree Stores, Inc.", "Dominion Resources, Inc.", "Domino's Pizza LLC", "Dover Corporation, Inc.", "Dow Chemical Company", "Dow Jones & Company, Inc.", "DPL Inc.", "DQE Inc.", "Dreyer's Grand Ice Cream, Inc.", "DST Systems, Inc.", "DTE Energy Co.", "E.I. Du Pont de Nemours and Company", "Duke Energy Corp", "Dun & Bradstreet Inc.", "DURA Automotive Systems Inc.", "DynCorp", "Dynegy Inc.", "E*Trade Group, Inc.", "E.W. Scripps Company", "Earthlink, Inc.", "Eastman Chemical Company", "Eastman Kodak Company", "Eaton Corporation", "Echostar Communications Corporation", "Ecolab Inc.", "Edison International", "EGL Inc.", "El Paso Corporation", "Electronic Arts Inc.", "Electronic Data Systems Corp.", "Eli Lilly and Company", "EMC Corporation", "Emcor Group Inc.", "Emerson Electric Co.", "Encompass Services Corporation", "Energizer Holdings Inc.", "Energy East Corporation", "Engelhard Corporation", "Enron Corp.", "Entergy Corporation", "Enterprise Products Partners L.P.", "EOG Resources, Inc.", "Equifax Inc.", "Equitable Resources Inc.", "Equity Office Properties Trust", "Equity Residential Properties Trust", "Estee Lauder Companies Inc.", "Exelon Corporation", "Exide Technologies", "Expeditors International of Washington Inc.", "Express Scripts Inc.", "ExxonMobil Corporation", "Fairchild Semiconductor International Inc.", "Family Dollar Stores Inc.", "Farmland Industries Inc.", "Federal Mogul Corp.", "Federated Department Stores Inc.", "Federal Express Corp.", "Felcor Lodging Trust Inc.", "Ferro Corp.", "Fidelity National Financial Inc.", "Fifth Third Bancorp", "First American Financial Corp.", "First Data Corp.", "First National of Nebraska Inc.", "First Tennessee National Corp.", "FirstEnergy Corp.", "Fiserv Inc.", "Fisher Scientific International Inc.", "FleetBoston Financial Co.", "Fleetwood Enterprises Inc.", "Fleming Companies Inc.", "Flowers Foods Inc.", "Flowserv Corp", "Fluor Corp", "FMC Corp", "Foamex International Inc", "Foot Locker Inc", "Footstar Inc.", "Ford Motor Co", "Forest Laboratories Inc.", "Fortune Brands Inc.", "Foster Wheeler Ltd.", "FPL Group Inc.", "Franklin Resources Inc.", "Freeport McMoran Copper & Gold Inc.", "Frontier Oil Corp", "Furniture Brands International Inc.", "Gannett Co., Inc.", "Gap Inc.", "Gateway Inc.", "GATX Corporation", "Gemstar-TV Guide International Inc.", "GenCorp Inc.", "General Cable Corporation", "General Dynamics Corporation", "General Electric Company", "General Mills Inc", "General Motors Corporation", "Genesis Health Ventures Inc.", "Gentek Inc.", "Gentiva Health Services Inc.", "Genuine Parts Company", "Genuity Inc.", "Genzyme Corporation", "Georgia Gulf Corporation", "Georgia-Pacific Corporation", "Gillette Company", "Gold Kist Inc.", "Golden State Bancorp Inc.", "Golden West Financial Corporation", "Goldman Sachs Group Inc.", "Goodrich Corporation", "The Goodyear Tire & Rubber Company", "Granite Construction Incorporated", "Graybar Electric Company Inc.", "Great Lakes Chemical Corporation", "Great Plains Energy Inc.", "GreenPoint Financial Corp.", "Greif Bros. Corporation", "Grey Global Group Inc.", "Group 1 Automotive Inc.", "Guidant Corporation", "H&R Block Inc.", "H.B. Fuller Company", "H.J. Heinz Company", "Halliburton Co.", "Harley-Davidson Inc.", "Harman International Industries Inc.", "Harrah's Entertainment Inc.", "Harris Corp.", "Harsco Corp.", "Hartford Financial Services Group Inc.", "Hasbro Inc.", "Hawaiian Electric Industries Inc.", "HCA Inc.", "Health Management Associates Inc.", "Health Net Inc.", "Healthsouth Corp", "Henry Schein Inc.", "Hercules Inc.", "Herman Miller Inc.", "Hershey Foods Corp.", "Hewlett-Packard Company", "Hibernia Corp.", "Hillenbrand Industries Inc.", "Hilton Hotels Corp.", "Hollywood Entertainment Corp.", "Home Depot Inc.", "Hon Industries Inc.", "Honeywell International Inc.", "Hormel Foods Corp.", "Host Marriott Corp.", "Household International Corp.", "Hovnanian Enterprises Inc.", "Hub Group Inc.", "Hubbell Inc.", "Hughes Supply Inc.", "Humana Inc.", "Huntington Bancshares Inc.", "Idacorp Inc.", "IDT Corporation", "IKON Office Solutions Inc.", "Illinois Tool Works Inc.", "IMC Global Inc.", "Imperial Sugar Company", "IMS Health Inc.", "Ingles Market Inc", "Ingram Micro Inc.", "Insight Enterprises Inc.", "Integrated Electrical Services Inc.", "Intel Corporation", "International Paper Co.", "Interpublic Group of Companies Inc.", "Interstate Bakeries Corporation", "International Business Machines Corp.", "International Flavors & Fragrances Inc.", "International Multifoods Corporation", "Intuit Inc.", "IT Group Inc.", "ITT Industries Inc.", "Ivax Corp.", "J.B. Hunt Transport Services Inc.", "J.C. Penny Co.", "J.P. Morgan Chase & Co.", "Jabil Circuit Inc.", "Jack In The Box Inc.", "Jacobs Engineering Group Inc.", "JDS Uniphase Corp.", "Jefferson-Pilot Co.", "John Hancock Financial Services Inc.", "Johnson & Johnson", "Johnson Controls Inc.", "Jones Apparel Group Inc.", "KB Home", "Kellogg Company", "Kellwood Company", "Kelly Services Inc.", "Kemet Corp.", "Kennametal Inc.", "Kerr-McGee Corporation", "KeyCorp", "KeySpan Corp.", "Kimball International Inc.", "Kimberly-Clark Corporation", "Kindred Healthcare Inc.", "KLA-Tencor Corporation", "K-Mart Corp.", "Knight-Ridder Inc.", "Kohl's Corp.", "KPMG Consulting Inc.", "Kroger Co.", "L-3 Communications Holdings Inc.", "Laboratory Corporation of America Holdings", "Lam Research Corporation", "LandAmerica Financial Group Inc.", "Lands' End Inc.", "Landstar System Inc.", "La-Z-Boy Inc.", "Lear Corporation", "Legg Mason Inc.", "Leggett & Platt Inc.", "Lehman Brothers Holdings Inc.", "Lennar Corporation", "Lennox International Inc.", "Level 3 Communications Inc.", "Levi Strauss & Co.", "Lexmark International Inc.", "Limited Inc.", "Lincoln National Corporation", "Linens 'n Things Inc.", "Lithia Motors Inc.", "Liz Claiborne Inc.", "Lockheed Martin Corporation", "Loews Corporation", "Longs Drug Stores Corporation", "Louisiana-Pacific Corporation", "Lowe's Companies Inc.", "LSI Logic Corporation", "The LTV Corporation", "The Lubrizol Corporation", "Lucent Technologies Inc.", "Lyondell Chemical Company", "M & T Bank Corporation", "Magellan Health Services Inc.", "Mail-Well Inc.", "Mandalay Resort Group", "Manor Care Inc.", "Manpower Inc.", "Marathon Oil Corporation", "Mariner Health Care Inc.", "Markel Corporation", "Marriott International Inc.", "Marsh & McLennan Companies Inc.", "Marsh Supermarkets Inc.", "Marshall & Ilsley Corporation", "Martin Marietta Materials Inc.", "Masco Corporation", "Massey Energy Company", "MasTec Inc.", "Mattel Inc.", "Maxim Integrated Products Inc.", "Maxtor Corporation", "Maxxam Inc.", "The May Department Stores Company", "Maytag Corporation", "MBNA Corporation", "McCormick & Company Incorporated", "McDonald's Corporation", "The McGraw-Hill Companies Inc.", "McKesson Corporation", "McLeodUSA Incorporated", "M.D.C. Holdings Inc.", "MDU Resources Group Inc.", "MeadWestvaco Corporation", "Medtronic Inc.", "Mellon Financial Corporation", "The Men's Wearhouse Inc.", "Merck & Co., Inc.", "Mercury General Corporation", "Merrill Lynch & Co. Inc.", "Metaldyne Corporation", "Metals USA Inc.", "MetLife Inc.", "Metris Companies Inc", "MGIC Investment Corporation", "MGM Mirage", "Michaels Stores Inc.", "Micron Technology Inc.", "Microsoft Corporation", "Milacron Inc.", "Millennium Chemicals Inc.", "Mirant Corporation", "Mohawk Industries Inc.", "Molex Incorporated", "The MONY Group Inc.", "Morgan Stanley Dean Witter & Co.", "Motorola Inc.", "MPS Group Inc.", "Murphy Oil Corporation", "Nabors Industries Inc", "Nacco Industries Inc", "Nash Finch Company", "National City Corp.", "National Commerce Financial Corporation", "National Fuel Gas Company", "National Oilwell Inc", "National Rural Utilities Cooperative Finance Corporation", "National Semiconductor Corporation", "National Service Industries Inc", "Navistar International Corporation", "NCR Corporation", "The Neiman Marcus Group Inc.", "New Jersey Resources Corporation", "New York Times Company", "Newell Rubbermaid Inc", "Newmont Mining Corporation", "Nextel Communications Inc", "Nicor Inc", "Nike Inc", "NiSource Inc", "Noble Energy Inc", "Nordstrom Inc", "Norfolk Southern Corporation", "Nortek Inc", "North Fork Bancorporation Inc", "Northeast Utilities System", "Northern Trust Corporation", "Northrop Grumman Corporation", "NorthWestern Corporation", "Novellus Systems Inc", "NSTAR", "NTL Incorporated", "Nucor Corp", "Nvidia Corp", "NVR Inc", "Northwest Airlines Corp", "Occidental Petroleum Corp", "Ocean Energy Inc", "Office Depot Inc.", "OfficeMax Inc", "OGE Energy Corp", "Oglethorpe Power Corp.", "Ohio Casualty Corp.", "Old Republic International Corp.", "Olin Corp.", "OM Group Inc", "Omnicare Inc", "Omnicom Group", "On Semiconductor Corp", "ONEOK Inc", "Oracle Corp", "Oshkosh Truck Corp", "Outback Steakhouse Inc.", "Owens & Minor Inc.", "Owens Corning", "Owens-Illinois Inc", "Oxford Health Plans Inc", "Paccar Inc", "PacifiCare Health Systems Inc", "Packaging Corp. of America", "Pactiv Corp", "Pall Corp", "Pantry Inc", "Park Place Entertainment Corp", "Parker Hannifin Corp.", "Pathmark Stores Inc.", "Paychex Inc", "Payless Shoesource Inc", "Penn Traffic Co.", "Pennzoil-Quaker State Company", "Pentair Inc", "Peoples Energy Corp.", "PeopleSoft Inc", "Pep Boys Manny, Moe & Jack", "Potomac Electric Power Co.", "Pepsi Bottling Group Inc.", "PepsiAmericas Inc.", "PepsiCo Inc.", "Performance Food Group Co.", "Perini Corp", "PerkinElmer Inc", "Perot Systems Corp", "Petco Animal Supplies Inc.", "Peter Kiewit Sons', Inc.", "PETsMART Inc", "Pfizer Inc", "Pacific Gas & Electric Corp.", "Pharmacia Corp", "Phar Mor Inc.", "Phelps Dodge Corp.", "Philip Morris Companies Inc.", "Phillips Petroleum Co", "Phillips Van Heusen Corp.", "Phoenix Companies Inc", "Pier 1 Imports Inc.", "Pilgrim's Pride Corporation", "Pinnacle West Capital Corp", "Pioneer-Standard Electronics Inc.", "Pitney Bowes Inc.", "Pittston Brinks Group", "Plains All American Pipeline LP", "PNC Financial Services Group Inc.", "PNM Resources Inc", "Polaris Industries Inc.", "Polo Ralph Lauren Corp", "PolyOne Corp", "Popular Inc", "Potlatch Corp", "PPG Industries Inc", "PPL Corp", "Praxair Inc", "Precision Castparts Corp", "Premcor Inc.", "Pride International Inc", "Primedia Inc", "Principal Financial Group Inc.", "Procter & Gamble Co.", "Pro-Fac Cooperative Inc.", "Progress Energy Inc", "Progressive Corporation", "Protective Life Corp", "Provident Financial Group", "Providian Financial Corp.", "Prudential Financial Inc.", "PSS World Medical Inc", "Public Service Enterprise Group Inc.", "Publix Super Markets Inc.", "Puget Energy Inc.", "Pulte Homes Inc", "Qualcomm Inc", "Quanta Services Inc.", "Quantum Corp", "Quest Diagnostics Inc.", "Questar Corp", "Quintiles Transnational", "Qwest Communications Intl Inc", "R.J. Reynolds Tobacco Company", "R.R. Donnelley & Sons Company", "Radio Shack Corporation", "Raymond James Financial Inc.", "Raytheon Company", "Reader's Digest Association Inc.", "Reebok International Ltd.", "Regions Financial Corp.", "Regis Corporation", "Reliance Steel & Aluminum Co.", "Reliant Energy Inc.", "Rent A Center Inc", "Republic Services Inc", "Revlon Inc", "RGS Energy Group Inc", "Rite Aid Corp", "Riverwood Holding Inc.", "RoadwayCorp", "Robert Half International Inc.", "Rock-Tenn Co", "Rockwell Automation Inc", "Rockwell Collins Inc", "Rohm & Haas Co.", "Ross Stores Inc", "RPM Inc.", "Ruddick Corp", "Ryder System Inc", "Ryerson Tull Inc", "Ryland Group Inc.", "Sabre Holdings Corp", "Safeco Corp", "Safeguard Scientifics Inc.", "Safeway Inc", "Saks Inc", "Sanmina-SCI Inc", "Sara Lee Corp", "SBC Communications Inc", "Scana Corp.", "Schering-Plough Corp", "Scholastic Corp", "SCI Systems Onc.", "Science Applications Intl. Inc.", "Scientific-Atlanta Inc", "Scotts Company", "Seaboard Corp", "Sealed Air Corp", "Sears Roebuck & Co", "Sempra Energy", "Sequa Corp", "Service Corp. International", "ServiceMaster Co", "Shaw Group Inc", "Sherwin-Williams Company", "Shopko Stores Inc", "Siebel Systems Inc", "Sierra Health Services Inc", "Sierra Pacific Resources", "Silgan Holdings Inc.", "Silicon Graphics Inc", "Simon Property Group Inc", "SLM Corporation", "Smith International Inc", "Smithfield Foods Inc", "Smurfit-Stone Container Corp", "Snap-On Inc", "Solectron Corp", "Solutia Inc", "Sonic Automotive Inc.", "Sonoco Products Co.", "Southern Company", "Southern Union Company", "SouthTrust Corp.", "Southwest Airlines Co", "Southwest Gas Corp", "Sovereign Bancorp Inc.", "Spartan Stores Inc", "Spherion Corp", "Sports Authority Inc", "Sprint Corp.", "SPX Corp", "St. Jude Medical Inc", "St. Paul Cos.", "Staff Leasing Inc.", "StanCorp Financial Group Inc", "Standard Pacific Corp.", "Stanley Works", "Staples Inc", "Starbucks Corp", "Starwood Hotels & Resorts Worldwide Inc", "State Street Corp.", "Stater Bros. Holdings Inc.", "Steelcase Inc", "Stein Mart Inc", "Stewart & Stevenson Services Inc", "Stewart Information Services Corp", "Stilwell Financial Inc", "Storage Technology Corporation", "Stryker Corp", "Sun Healthcare Group Inc.", "Sun Microsystems Inc.", "SunGard Data Systems Inc.", "Sunoco Inc.", "SunTrust Banks Inc", "Supervalu Inc", "Swift Transportation, Co., Inc", "Symbol Technologies Inc", "Synovus Financial Corp.", "Sysco Corp", "Systemax Inc.", "Target Corp.", "Tech Data Corporation", "TECO Energy Inc", "Tecumseh Products Company", "Tektronix Inc", "Teleflex Incorporated", "Telephone & Data Systems Inc", "Tellabs Inc.", "Temple-Inland Inc", "Tenet Healthcare Corporation", "Tenneco Automotive Inc.", "Teradyne Inc", "Terex Corp", "Tesoro Petroleum Corp.", "Texas Industries Inc.", "Texas Instruments Incorporated", "Textron Inc", "Thermo Electron Corporation", "Thomas & Betts Corporation", "Tiffany & Co", "Timken Company", "TJX Companies Inc", "TMP Worldwide Inc", "Toll Brothers Inc", "Torchmark Corporation", "Toro Company", "Tower Automotive Inc.", "Toys 'R' Us Inc", "Trans World Entertainment Corp.", "TransMontaigne Inc", "Transocean Inc", "TravelCenters of America Inc.", "Triad Hospitals Inc", "Tribune Company", "Trigon Healthcare Inc.", "Trinity Industries Inc", "Trump Hotels & Casino Resorts Inc.", "TruServ Corporation", "TRW Inc", "TXU Corp", "Tyson Foods Inc", "U.S. Bancorp", "U.S. Industries Inc.", "UAL Corporation", "UGI Corporation", "Unified Western Grocers Inc", "Union Pacific Corporation", "Union Planters Corp", "Unisource Energy Corp", "Unisys Corporation", "United Auto Group Inc", "United Defense Industries Inc.", "United Parcel Service Inc", "United Rentals Inc", "United Stationers Inc", "United Technologies Corporation", "UnitedHealth Group Incorporated", "Unitrin Inc", "Universal Corporation", "Universal Forest Products Inc", "Universal Health Services Inc", "Unocal Corporation", "Unova Inc", "UnumProvident Corporation", "URS Corporation", "US Airways Group Inc", "US Oncology Inc", "USA Interactive", "USFreighways Corporation", "USG Corporation", "UST Inc", "Valero Energy Corporation", "Valspar Corporation", "Value City Department Stores Inc", "Varco International Inc", "Vectren Corporation", "Veritas Software Corporation", "Verizon Communications Inc", "VF Corporation", "Viacom Inc", "Viad Corp", "Viasystems Group Inc", "Vishay Intertechnology Inc", "Visteon Corporation", "Volt Information Sciences Inc", "Vulcan Materials Company", "W.R. Berkley Corporation", "W.R. Grace & Co", "W.W. Grainger Inc", "Wachovia Corporation", "Wakenhut Corporation", "Walgreen Co", "Wallace Computer Services Inc", "Wal-Mart Stores Inc", "Walt Disney Co", "Walter Industries Inc", "Washington Mutual Inc", "Washington Post Co.", "Waste Management Inc", "Watsco Inc", "Weatherford International Inc", "Weis Markets Inc.", "Wellpoint Health Networks Inc", "Wells Fargo & Company", "Wendy's International Inc", "Werner Enterprises Inc", "WESCO International Inc", "Western Digital Inc", "Western Gas Resources Inc", "WestPoint Stevens Inc", "Weyerhauser Company", "WGL Holdings Inc", "Whirlpool Corporation", "Whole Foods Market Inc", "Willamette Industries Inc.", "Williams Companies Inc", "Williams Sonoma Inc", "Winn Dixie Stores Inc", "Wisconsin Energy Corporation", "Wm Wrigley Jr Company", "World Fuel Services Corporation", "WorldCom Inc", "Worthington Industries Inc", "WPS Resources Corporation", "Wyeth", "Wyndham International Inc", "Xcel Energy Inc", "Xerox Corp", "Xilinx Inc", "XO Communications Inc", "Yellow Corporation", "York International Corp", "Yum Brands Inc.", "Zale Corporation", "Zions Bancorporation"],
      fileExtension: {
        "raster": ["bmp", "gif", "gpl", "ico", "jpeg", "psd", "png", "psp", "raw", "tiff"],
        "vector": ["3dv", "amf", "awg", "ai", "cgm", "cdr", "cmx", "dxf", "e2d", "egt", "eps", "fs", "odg", "svg", "xar"],
        "3d": ["3dmf", "3dm", "3mf", "3ds", "an8", "aoi", "blend", "cal3d", "cob", "ctm", "iob", "jas", "max", "mb", "mdx", "obj", "x", "x3d"],
        "document": ["doc", "docx", "dot", "html", "xml", "odt", "odm", "ott", "csv", "rtf", "tex", "xhtml", "xps"]
      },
      // Data taken from https://github.com/dmfilipenko/timezones.json/blob/master/timezones.json
      timezones: [{
        "name": "Dateline Standard Time",
        "abbr": "DST",
        "offset": -12,
        "isdst": false,
        "text": "(UTC-12:00) International Date Line West",
        "utc": ["Etc/GMT+12"]
      }, {
        "name": "UTC-11",
        "abbr": "U",
        "offset": -11,
        "isdst": false,
        "text": "(UTC-11:00) Coordinated Universal Time-11",
        "utc": ["Etc/GMT+11", "Pacific/Midway", "Pacific/Niue", "Pacific/Pago_Pago"]
      }, {
        "name": "Hawaiian Standard Time",
        "abbr": "HST",
        "offset": -10,
        "isdst": false,
        "text": "(UTC-10:00) Hawaii",
        "utc": ["Etc/GMT+10", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Rarotonga", "Pacific/Tahiti"]
      }, {
        "name": "Alaskan Standard Time",
        "abbr": "AKDT",
        "offset": -8,
        "isdst": true,
        "text": "(UTC-09:00) Alaska",
        "utc": ["America/Anchorage", "America/Juneau", "America/Nome", "America/Sitka", "America/Yakutat"]
      }, {
        "name": "Pacific Standard Time (Mexico)",
        "abbr": "PDT",
        "offset": -7,
        "isdst": true,
        "text": "(UTC-08:00) Baja California",
        "utc": ["America/Santa_Isabel"]
      }, {
        "name": "Pacific Standard Time",
        "abbr": "PDT",
        "offset": -7,
        "isdst": true,
        "text": "(UTC-08:00) Pacific Time (US & Canada)",
        "utc": ["America/Dawson", "America/Los_Angeles", "America/Tijuana", "America/Vancouver", "America/Whitehorse", "PST8PDT"]
      }, {
        "name": "US Mountain Standard Time",
        "abbr": "UMST",
        "offset": -7,
        "isdst": false,
        "text": "(UTC-07:00) Arizona",
        "utc": ["America/Creston", "America/Dawson_Creek", "America/Hermosillo", "America/Phoenix", "Etc/GMT+7"]
      }, {
        "name": "Mountain Standard Time (Mexico)",
        "abbr": "MDT",
        "offset": -6,
        "isdst": true,
        "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
        "utc": ["America/Chihuahua", "America/Mazatlan"]
      }, {
        "name": "Mountain Standard Time",
        "abbr": "MDT",
        "offset": -6,
        "isdst": true,
        "text": "(UTC-07:00) Mountain Time (US & Canada)",
        "utc": ["America/Boise", "America/Cambridge_Bay", "America/Denver", "America/Edmonton", "America/Inuvik", "America/Ojinaga", "America/Yellowknife", "MST7MDT"]
      }, {
        "name": "Central America Standard Time",
        "abbr": "CAST",
        "offset": -6,
        "isdst": false,
        "text": "(UTC-06:00) Central America",
        "utc": ["America/Belize", "America/Costa_Rica", "America/El_Salvador", "America/Guatemala", "America/Managua", "America/Tegucigalpa", "Etc/GMT+6", "Pacific/Galapagos"]
      }, {
        "name": "Central Standard Time",
        "abbr": "CDT",
        "offset": -5,
        "isdst": true,
        "text": "(UTC-06:00) Central Time (US & Canada)",
        "utc": ["America/Chicago", "America/Indiana/Knox", "America/Indiana/Tell_City", "America/Matamoros", "America/Menominee", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Rainy_River", "America/Rankin_Inlet", "America/Resolute", "America/Winnipeg", "CST6CDT"]
      }, {
        "name": "Central Standard Time (Mexico)",
        "abbr": "CDT",
        "offset": -5,
        "isdst": true,
        "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
        "utc": ["America/Bahia_Banderas", "America/Cancun", "America/Merida", "America/Mexico_City", "America/Monterrey"]
      }, {
        "name": "Canada Central Standard Time",
        "abbr": "CCST",
        "offset": -6,
        "isdst": false,
        "text": "(UTC-06:00) Saskatchewan",
        "utc": ["America/Regina", "America/Swift_Current"]
      }, {
        "name": "SA Pacific Standard Time",
        "abbr": "SPST",
        "offset": -5,
        "isdst": false,
        "text": "(UTC-05:00) Bogota, Lima, Quito",
        "utc": ["America/Bogota", "America/Cayman", "America/Coral_Harbour", "America/Eirunepe", "America/Guayaquil", "America/Jamaica", "America/Lima", "America/Panama", "America/Rio_Branco", "Etc/GMT+5"]
      }, {
        "name": "Eastern Standard Time",
        "abbr": "EDT",
        "offset": -4,
        "isdst": true,
        "text": "(UTC-05:00) Eastern Time (US & Canada)",
        "utc": ["America/Detroit", "America/Havana", "America/Indiana/Petersburg", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Iqaluit", "America/Kentucky/Monticello", "America/Louisville", "America/Montreal", "America/Nassau", "America/New_York", "America/Nipigon", "America/Pangnirtung", "America/Port-au-Prince", "America/Thunder_Bay", "America/Toronto", "EST5EDT"]
      }, {
        "name": "US Eastern Standard Time",
        "abbr": "UEDT",
        "offset": -4,
        "isdst": true,
        "text": "(UTC-05:00) Indiana (East)",
        "utc": ["America/Indiana/Marengo", "America/Indiana/Vevay", "America/Indianapolis"]
      }, {
        "name": "Venezuela Standard Time",
        "abbr": "VST",
        "offset": -4.5,
        "isdst": false,
        "text": "(UTC-04:30) Caracas",
        "utc": ["America/Caracas"]
      }, {
        "name": "Paraguay Standard Time",
        "abbr": "PST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Asuncion",
        "utc": ["America/Asuncion"]
      }, {
        "name": "Atlantic Standard Time",
        "abbr": "ADT",
        "offset": -3,
        "isdst": true,
        "text": "(UTC-04:00) Atlantic Time (Canada)",
        "utc": ["America/Glace_Bay", "America/Goose_Bay", "America/Halifax", "America/Moncton", "America/Thule", "Atlantic/Bermuda"]
      }, {
        "name": "Central Brazilian Standard Time",
        "abbr": "CBST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Cuiaba",
        "utc": ["America/Campo_Grande", "America/Cuiaba"]
      }, {
        "name": "SA Western Standard Time",
        "abbr": "SWST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
        "utc": ["America/Anguilla", "America/Antigua", "America/Aruba", "America/Barbados", "America/Blanc-Sablon", "America/Boa_Vista", "America/Curacao", "America/Dominica", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guyana", "America/Kralendijk", "America/La_Paz", "America/Lower_Princes", "America/Manaus", "America/Marigot", "America/Martinique", "America/Montserrat", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Santo_Domingo", "America/St_Barthelemy", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Tortola", "Etc/GMT+4"]
      }, {
        "name": "Pacific SA Standard Time",
        "abbr": "PSST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Santiago",
        "utc": ["America/Santiago", "Antarctica/Palmer"]
      }, {
        "name": "Newfoundland Standard Time",
        "abbr": "NDT",
        "offset": -2.5,
        "isdst": true,
        "text": "(UTC-03:30) Newfoundland",
        "utc": ["America/St_Johns"]
      }, {
        "name": "E. South America Standard Time",
        "abbr": "ESAST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Brasilia",
        "utc": ["America/Sao_Paulo"]
      }, {
        "name": "Argentina Standard Time",
        "abbr": "AST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Buenos Aires",
        "utc": ["America/Argentina/La_Rioja", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Buenos_Aires", "America/Catamarca", "America/Cordoba", "America/Jujuy", "America/Mendoza"]
      }, {
        "name": "SA Eastern Standard Time",
        "abbr": "SEST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Cayenne, Fortaleza",
        "utc": ["America/Araguaina", "America/Belem", "America/Cayenne", "America/Fortaleza", "America/Maceio", "America/Paramaribo", "America/Recife", "America/Santarem", "Antarctica/Rothera", "Atlantic/Stanley", "Etc/GMT+3"]
      }, {
        "name": "Greenland Standard Time",
        "abbr": "GDT",
        "offset": -2,
        "isdst": true,
        "text": "(UTC-03:00) Greenland",
        "utc": ["America/Godthab"]
      }, {
        "name": "Montevideo Standard Time",
        "abbr": "MST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Montevideo",
        "utc": ["America/Montevideo"]
      }, {
        "name": "Bahia Standard Time",
        "abbr": "BST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Salvador",
        "utc": ["America/Bahia"]
      }, {
        "name": "UTC-02",
        "abbr": "U",
        "offset": -2,
        "isdst": false,
        "text": "(UTC-02:00) Coordinated Universal Time-02",
        "utc": ["America/Noronha", "Atlantic/South_Georgia", "Etc/GMT+2"]
      }, {
        "name": "Mid-Atlantic Standard Time",
        "abbr": "MDT",
        "offset": -1,
        "isdst": true,
        "text": "(UTC-02:00) Mid-Atlantic - Old"
      }, {
        "name": "Azores Standard Time",
        "abbr": "ADT",
        "offset": 0,
        "isdst": true,
        "text": "(UTC-01:00) Azores",
        "utc": ["America/Scoresbysund", "Atlantic/Azores"]
      }, {
        "name": "Cape Verde Standard Time",
        "abbr": "CVST",
        "offset": -1,
        "isdst": false,
        "text": "(UTC-01:00) Cape Verde Is.",
        "utc": ["Atlantic/Cape_Verde", "Etc/GMT+1"]
      }, {
        "name": "Morocco Standard Time",
        "abbr": "MDT",
        "offset": 1,
        "isdst": true,
        "text": "(UTC) Casablanca",
        "utc": ["Africa/Casablanca", "Africa/El_Aaiun"]
      }, {
        "name": "UTC",
        "abbr": "CUT",
        "offset": 0,
        "isdst": false,
        "text": "(UTC) Coordinated Universal Time",
        "utc": ["America/Danmarkshavn", "Etc/GMT"]
      }, {
        "name": "GMT Standard Time",
        "abbr": "GDT",
        "offset": 1,
        "isdst": true,
        "text": "(UTC) Dublin, Edinburgh, Lisbon, London",
        "utc": ["Atlantic/Canary", "Atlantic/Faeroe", "Atlantic/Madeira", "Europe/Dublin", "Europe/Guernsey", "Europe/Isle_of_Man", "Europe/Jersey", "Europe/Lisbon", "Europe/London"]
      }, {
        "name": "Greenwich Standard Time",
        "abbr": "GST",
        "offset": 0,
        "isdst": false,
        "text": "(UTC) Monrovia, Reykjavik",
        "utc": ["Africa/Abidjan", "Africa/Accra", "Africa/Bamako", "Africa/Banjul", "Africa/Bissau", "Africa/Conakry", "Africa/Dakar", "Africa/Freetown", "Africa/Lome", "Africa/Monrovia", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Sao_Tome", "Atlantic/Reykjavik", "Atlantic/St_Helena"]
      }, {
        "name": "W. Europe Standard Time",
        "abbr": "WEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
        "utc": ["Arctic/Longyearbyen", "Europe/Amsterdam", "Europe/Andorra", "Europe/Berlin", "Europe/Busingen", "Europe/Gibraltar", "Europe/Luxembourg", "Europe/Malta", "Europe/Monaco", "Europe/Oslo", "Europe/Rome", "Europe/San_Marino", "Europe/Stockholm", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Zurich"]
      }, {
        "name": "Central Europe Standard Time",
        "abbr": "CEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
        "utc": ["Europe/Belgrade", "Europe/Bratislava", "Europe/Budapest", "Europe/Ljubljana", "Europe/Podgorica", "Europe/Prague", "Europe/Tirane"]
      }, {
        "name": "Romance Standard Time",
        "abbr": "RDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
        "utc": ["Africa/Ceuta", "Europe/Brussels", "Europe/Copenhagen", "Europe/Madrid", "Europe/Paris"]
      }, {
        "name": "Central European Standard Time",
        "abbr": "CEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
        "utc": ["Europe/Sarajevo", "Europe/Skopje", "Europe/Warsaw", "Europe/Zagreb"]
      }, {
        "name": "W. Central Africa Standard Time",
        "abbr": "WCAST",
        "offset": 1,
        "isdst": false,
        "text": "(UTC+01:00) West Central Africa",
        "utc": ["Africa/Algiers", "Africa/Bangui", "Africa/Brazzaville", "Africa/Douala", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Luanda", "Africa/Malabo", "Africa/Ndjamena", "Africa/Niamey", "Africa/Porto-Novo", "Africa/Tunis", "Etc/GMT-1"]
      }, {
        "name": "Namibia Standard Time",
        "abbr": "NST",
        "offset": 1,
        "isdst": false,
        "text": "(UTC+01:00) Windhoek",
        "utc": ["Africa/Windhoek"]
      }, {
        "name": "GTB Standard Time",
        "abbr": "GDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Athens, Bucharest",
        "utc": ["Asia/Nicosia", "Europe/Athens", "Europe/Bucharest", "Europe/Chisinau"]
      }, {
        "name": "Middle East Standard Time",
        "abbr": "MEDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Beirut",
        "utc": ["Asia/Beirut"]
      }, {
        "name": "Egypt Standard Time",
        "abbr": "EST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Cairo",
        "utc": ["Africa/Cairo"]
      }, {
        "name": "Syria Standard Time",
        "abbr": "SDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Damascus",
        "utc": ["Asia/Damascus"]
      }, {
        "name": "E. Europe Standard Time",
        "abbr": "EEDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) E. Europe"
      }, {
        "name": "South Africa Standard Time",
        "abbr": "SAST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Harare, Pretoria",
        "utc": ["Africa/Blantyre", "Africa/Bujumbura", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kigali", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Etc/GMT-2"]
      }, {
        "name": "FLE Standard Time",
        "abbr": "FDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
        "utc": ["Europe/Helsinki", "Europe/Kiev", "Europe/Mariehamn", "Europe/Riga", "Europe/Sofia", "Europe/Tallinn", "Europe/Uzhgorod", "Europe/Vilnius", "Europe/Zaporozhye"]
      }, {
        "name": "Turkey Standard Time",
        "abbr": "TDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Istanbul",
        "utc": ["Europe/Istanbul"]
      }, {
        "name": "Israel Standard Time",
        "abbr": "JDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Jerusalem",
        "utc": ["Asia/Jerusalem"]
      }, {
        "name": "Libya Standard Time",
        "abbr": "LST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Tripoli",
        "utc": ["Africa/Tripoli"]
      }, {
        "name": "Jordan Standard Time",
        "abbr": "JST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Amman",
        "utc": ["Asia/Amman"]
      }, {
        "name": "Arabic Standard Time",
        "abbr": "AST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Baghdad",
        "utc": ["Asia/Baghdad"]
      }, {
        "name": "Kaliningrad Standard Time",
        "abbr": "KST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Kaliningrad, Minsk",
        "utc": ["Europe/Kaliningrad", "Europe/Minsk"]
      }, {
        "name": "Arab Standard Time",
        "abbr": "AST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Kuwait, Riyadh",
        "utc": ["Asia/Aden", "Asia/Bahrain", "Asia/Kuwait", "Asia/Qatar", "Asia/Riyadh"]
      }, {
        "name": "E. Africa Standard Time",
        "abbr": "EAST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Nairobi",
        "utc": ["Africa/Addis_Ababa", "Africa/Asmera", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Mogadishu", "Africa/Nairobi", "Antarctica/Syowa", "Etc/GMT-3", "Indian/Antananarivo", "Indian/Comoro", "Indian/Mayotte"]
      }, {
        "name": "Iran Standard Time",
        "abbr": "IDT",
        "offset": 4.5,
        "isdst": true,
        "text": "(UTC+03:30) Tehran",
        "utc": ["Asia/Tehran"]
      }, {
        "name": "Arabian Standard Time",
        "abbr": "AST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Abu Dhabi, Muscat",
        "utc": ["Asia/Dubai", "Asia/Muscat", "Etc/GMT-4"]
      }, {
        "name": "Azerbaijan Standard Time",
        "abbr": "ADT",
        "offset": 5,
        "isdst": true,
        "text": "(UTC+04:00) Baku",
        "utc": ["Asia/Baku"]
      }, {
        "name": "Russian Standard Time",
        "abbr": "RST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
        "utc": ["Europe/Moscow", "Europe/Samara", "Europe/Simferopol", "Europe/Volgograd"]
      }, {
        "name": "Mauritius Standard Time",
        "abbr": "MST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Port Louis",
        "utc": ["Indian/Mahe", "Indian/Mauritius", "Indian/Reunion"]
      }, {
        "name": "Georgian Standard Time",
        "abbr": "GST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Tbilisi",
        "utc": ["Asia/Tbilisi"]
      }, {
        "name": "Caucasus Standard Time",
        "abbr": "CST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Yerevan",
        "utc": ["Asia/Yerevan"]
      }, {
        "name": "Afghanistan Standard Time",
        "abbr": "AST",
        "offset": 4.5,
        "isdst": false,
        "text": "(UTC+04:30) Kabul",
        "utc": ["Asia/Kabul"]
      }, {
        "name": "West Asia Standard Time",
        "abbr": "WAST",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Ashgabat, Tashkent",
        "utc": ["Antarctica/Mawson", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Dushanbe", "Asia/Oral", "Asia/Samarkand", "Asia/Tashkent", "Etc/GMT-5", "Indian/Kerguelen", "Indian/Maldives"]
      }, {
        "name": "Pakistan Standard Time",
        "abbr": "PST",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Islamabad, Karachi",
        "utc": ["Asia/Karachi"]
      }, {
        "name": "India Standard Time",
        "abbr": "IST",
        "offset": 5.5,
        "isdst": false,
        "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "utc": ["Asia/Calcutta"]
      }, {
        "name": "Sri Lanka Standard Time",
        "abbr": "SLST",
        "offset": 5.5,
        "isdst": false,
        "text": "(UTC+05:30) Sri Jayawardenepura",
        "utc": ["Asia/Colombo"]
      }, {
        "name": "Nepal Standard Time",
        "abbr": "NST",
        "offset": 5.75,
        "isdst": false,
        "text": "(UTC+05:45) Kathmandu",
        "utc": ["Asia/Katmandu"]
      }, {
        "name": "Central Asia Standard Time",
        "abbr": "CAST",
        "offset": 6,
        "isdst": false,
        "text": "(UTC+06:00) Astana",
        "utc": ["Antarctica/Vostok", "Asia/Almaty", "Asia/Bishkek", "Asia/Qyzylorda", "Asia/Urumqi", "Etc/GMT-6", "Indian/Chagos"]
      }, {
        "name": "Bangladesh Standard Time",
        "abbr": "BST",
        "offset": 6,
        "isdst": false,
        "text": "(UTC+06:00) Dhaka",
        "utc": ["Asia/Dhaka", "Asia/Thimphu"]
      }, {
        "name": "Ekaterinburg Standard Time",
        "abbr": "EST",
        "offset": 6,
        "isdst": false,
        "text": "(UTC+06:00) Ekaterinburg",
        "utc": ["Asia/Yekaterinburg"]
      }, {
        "name": "Myanmar Standard Time",
        "abbr": "MST",
        "offset": 6.5,
        "isdst": false,
        "text": "(UTC+06:30) Yangon (Rangoon)",
        "utc": ["Asia/Rangoon", "Indian/Cocos"]
      }, {
        "name": "SE Asia Standard Time",
        "abbr": "SAST",
        "offset": 7,
        "isdst": false,
        "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
        "utc": ["Antarctica/Davis", "Asia/Bangkok", "Asia/Hovd", "Asia/Jakarta", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Saigon", "Asia/Vientiane", "Etc/GMT-7", "Indian/Christmas"]
      }, {
        "name": "N. Central Asia Standard Time",
        "abbr": "NCAST",
        "offset": 7,
        "isdst": false,
        "text": "(UTC+07:00) Novosibirsk",
        "utc": ["Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk"]
      }, {
        "name": "China Standard Time",
        "abbr": "CST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
        "utc": ["Asia/Hong_Kong", "Asia/Macau", "Asia/Shanghai"]
      }, {
        "name": "North Asia Standard Time",
        "abbr": "NAST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Krasnoyarsk",
        "utc": ["Asia/Krasnoyarsk"]
      }, {
        "name": "Singapore Standard Time",
        "abbr": "MPST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Kuala Lumpur, Singapore",
        "utc": ["Asia/Brunei", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Makassar", "Asia/Manila", "Asia/Singapore", "Etc/GMT-8"]
      }, {
        "name": "W. Australia Standard Time",
        "abbr": "WAST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Perth",
        "utc": ["Antarctica/Casey", "Australia/Perth"]
      }, {
        "name": "Taipei Standard Time",
        "abbr": "TST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Taipei",
        "utc": ["Asia/Taipei"]
      }, {
        "name": "Ulaanbaatar Standard Time",
        "abbr": "UST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Ulaanbaatar",
        "utc": ["Asia/Choibalsan", "Asia/Ulaanbaatar"]
      }, {
        "name": "North Asia East Standard Time",
        "abbr": "NAEST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Irkutsk",
        "utc": ["Asia/Irkutsk"]
      }, {
        "name": "Tokyo Standard Time",
        "abbr": "TST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
        "utc": ["Asia/Dili", "Asia/Jayapura", "Asia/Tokyo", "Etc/GMT-9", "Pacific/Palau"]
      }, {
        "name": "Korea Standard Time",
        "abbr": "KST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Seoul",
        "utc": ["Asia/Pyongyang", "Asia/Seoul"]
      }, {
        "name": "Cen. Australia Standard Time",
        "abbr": "CAST",
        "offset": 9.5,
        "isdst": false,
        "text": "(UTC+09:30) Adelaide",
        "utc": ["Australia/Adelaide", "Australia/Broken_Hill"]
      }, {
        "name": "AUS Central Standard Time",
        "abbr": "ACST",
        "offset": 9.5,
        "isdst": false,
        "text": "(UTC+09:30) Darwin",
        "utc": ["Australia/Darwin"]
      }, {
        "name": "E. Australia Standard Time",
        "abbr": "EAST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Brisbane",
        "utc": ["Australia/Brisbane", "Australia/Lindeman"]
      }, {
        "name": "AUS Eastern Standard Time",
        "abbr": "AEST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
        "utc": ["Australia/Melbourne", "Australia/Sydney"]
      }, {
        "name": "West Pacific Standard Time",
        "abbr": "WPST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Guam, Port Moresby",
        "utc": ["Antarctica/DumontDUrville", "Etc/GMT-10", "Pacific/Guam", "Pacific/Port_Moresby", "Pacific/Saipan", "Pacific/Truk"]
      }, {
        "name": "Tasmania Standard Time",
        "abbr": "TST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Hobart",
        "utc": ["Australia/Currie", "Australia/Hobart"]
      }, {
        "name": "Yakutsk Standard Time",
        "abbr": "YST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Yakutsk",
        "utc": ["Asia/Chita", "Asia/Khandyga", "Asia/Yakutsk"]
      }, {
        "name": "Central Pacific Standard Time",
        "abbr": "CPST",
        "offset": 11,
        "isdst": false,
        "text": "(UTC+11:00) Solomon Is., New Caledonia",
        "utc": ["Antarctica/Macquarie", "Etc/GMT-11", "Pacific/Efate", "Pacific/Guadalcanal", "Pacific/Kosrae", "Pacific/Noumea", "Pacific/Ponape"]
      }, {
        "name": "Vladivostok Standard Time",
        "abbr": "VST",
        "offset": 11,
        "isdst": false,
        "text": "(UTC+11:00) Vladivostok",
        "utc": ["Asia/Sakhalin", "Asia/Ust-Nera", "Asia/Vladivostok"]
      }, {
        "name": "New Zealand Standard Time",
        "abbr": "NZST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Auckland, Wellington",
        "utc": ["Antarctica/McMurdo", "Pacific/Auckland"]
      }, {
        "name": "UTC+12",
        "abbr": "U",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Coordinated Universal Time+12",
        "utc": ["Etc/GMT-12", "Pacific/Funafuti", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Nauru", "Pacific/Tarawa", "Pacific/Wake", "Pacific/Wallis"]
      }, {
        "name": "Fiji Standard Time",
        "abbr": "FST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Fiji",
        "utc": ["Pacific/Fiji"]
      }, {
        "name": "Magadan Standard Time",
        "abbr": "MST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Magadan",
        "utc": ["Asia/Anadyr", "Asia/Kamchatka", "Asia/Magadan", "Asia/Srednekolymsk"]
      }, {
        "name": "Kamchatka Standard Time",
        "abbr": "KDT",
        "offset": 13,
        "isdst": true,
        "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old"
      }, {
        "name": "Tonga Standard Time",
        "abbr": "TST",
        "offset": 13,
        "isdst": false,
        "text": "(UTC+13:00) Nuku'alofa",
        "utc": ["Etc/GMT-13", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Tongatapu"]
      }, {
        "name": "Samoa Standard Time",
        "abbr": "SST",
        "offset": 13,
        "isdst": false,
        "text": "(UTC+13:00) Samoa",
        "utc": ["Pacific/Apia"]
      }],
      //List source: http://answers.google.com/answers/threadview/id/589312.html
      profession: ["Airline Pilot", "Academic Team", "Accountant", "Account Executive", "Actor", "Actuary", "Acquisition Analyst", "Administrative Asst.", "Administrative Analyst", "Administrator", "Advertising Director", "Aerospace Engineer", "Agent", "Agricultural Inspector", "Agricultural Scientist", "Air Traffic Controller", "Animal Trainer", "Anthropologist", "Appraiser", "Architect", "Art Director", "Artist", "Astronomer", "Athletic Coach", "Auditor", "Author", "Baker", "Banker", "Bankruptcy Attorney", "Benefits Manager", "Biologist", "Bio-feedback Specialist", "Biomedical Engineer", "Biotechnical Researcher", "Broadcaster", "Broker", "Building Manager", "Building Contractor", "Building Inspector", "Business Analyst", "Business Planner", "Business Manager", "Buyer", "Call Center Manager", "Career Counselor", "Cash Manager", "Ceramic Engineer", "Chief Executive Officer", "Chief Operation Officer", "Chef", "Chemical Engineer", "Chemist", "Child Care Manager", "Chief Medical Officer", "Chiropractor", "Cinematographer", "City Housing Manager", "City Manager", "Civil Engineer", "Claims Manager", "Clinical Research Assistant", "Collections Manager", "Compliance Manager", "Comptroller", "Computer Manager", "Commercial Artist", "Communications Affairs Director", "Communications Director", "Communications Engineer", "Compensation Analyst", "Computer Programmer", "Computer Ops. Manager", "Computer Engineer", "Computer Operator", "Computer Graphics Specialist", "Construction Engineer", "Construction Manager", "Consultant", "Consumer Relations Manager", "Contract Administrator", "Copyright Attorney", "Copywriter", "Corporate Planner", "Corrections Officer", "Cosmetologist", "Credit Analyst", "Cruise Director", "Chief Information Officer", "Chief Technology Officer", "Customer Service Manager", "Cryptologist", "Dancer", "Data Security Manager", "Database Manager", "Day Care Instructor", "Dentist", "Designer", "Design Engineer", "Desktop Publisher", "Developer", "Development Officer", "Diamond Merchant", "Dietitian", "Direct Marketer", "Director", "Distribution Manager", "Diversity Manager", "Economist", "EEO Compliance Manager", "Editor", "Education Adminator", "Electrical Engineer", "Electro Optical Engineer", "Electronics Engineer", "Embassy Management", "Employment Agent", "Engineer Technician", "Entrepreneur", "Environmental Analyst", "Environmental Attorney", "Environmental Engineer", "Environmental Specialist", "Escrow Officer", "Estimator", "Executive Assistant", "Executive Director", "Executive Recruiter", "Facilities Manager", "Family Counselor", "Fashion Events Manager", "Fashion Merchandiser", "Fast Food Manager", "Film Producer", "Film Production Assistant", "Financial Analyst", "Financial Planner", "Financier", "Fine Artist", "Wildlife Specialist", "Fitness Consultant", "Flight Attendant", "Flight Engineer", "Floral Designer", "Food & Beverage Director", "Food Service Manager", "Forestry Technician", "Franchise Management", "Franchise Sales", "Fraud Investigator", "Freelance Writer", "Fund Raiser", "General Manager", "Geologist", "General Counsel", "Geriatric Specialist", "Gerontologist", "Glamour Photographer", "Golf Club Manager", "Gourmet Chef", "Graphic Designer", "Grounds Keeper", "Hazardous Waste Manager", "Health Care Manager", "Health Therapist", "Health Service Administrator", "Hearing Officer", "Home Economist", "Horticulturist", "Hospital Administrator", "Hotel Manager", "Human Resources Manager", "Importer", "Industrial Designer", "Industrial Engineer", "Information Director", "Inside Sales", "Insurance Adjuster", "Interior Decorator", "Internal Controls Director", "International Acct.", "International Courier", "International Lawyer", "Interpreter", "Investigator", "Investment Banker", "Investment Manager", "IT Architect", "IT Project Manager", "IT Systems Analyst", "Jeweler", "Joint Venture Manager", "Journalist", "Labor Negotiator", "Labor Organizer", "Labor Relations Manager", "Lab Services Director", "Lab Technician", "Land Developer", "Landscape Architect", "Law Enforcement Officer", "Lawyer", "Lead Software Engineer", "Lead Software Test Engineer", "Leasing Manager", "Legal Secretary", "Library Manager", "Litigation Attorney", "Loan Officer", "Lobbyist", "Logistics Manager", "Maintenance Manager", "Management Consultant", "Managed Care Director", "Managing Partner", "Manufacturing Director", "Manpower Planner", "Marine Biologist", "Market Res. Analyst", "Marketing Director", "Materials Manager", "Mathematician", "Membership Chairman", "Mechanic", "Mechanical Engineer", "Media Buyer", "Medical Investor", "Medical Secretary", "Medical Technician", "Mental Health Counselor", "Merchandiser", "Metallurgical Engineering", "Meteorologist", "Microbiologist", "MIS Manager", "Motion Picture Director", "Multimedia Director", "Musician", "Network Administrator", "Network Specialist", "Network Operator", "New Product Manager", "Novelist", "Nuclear Engineer", "Nuclear Specialist", "Nutritionist", "Nursing Administrator", "Occupational Therapist", "Oceanographer", "Office Manager", "Operations Manager", "Operations Research Director", "Optical Technician", "Optometrist", "Organizational Development Manager", "Outplacement Specialist", "Paralegal", "Park Ranger", "Patent Attorney", "Payroll Specialist", "Personnel Specialist", "Petroleum Engineer", "Pharmacist", "Photographer", "Physical Therapist", "Physician", "Physician Assistant", "Physicist", "Planning Director", "Podiatrist", "Political Analyst", "Political Scientist", "Politician", "Portfolio Manager", "Preschool Management", "Preschool Teacher", "Principal", "Private Banker", "Private Investigator", "Probation Officer", "Process Engineer", "Producer", "Product Manager", "Product Engineer", "Production Engineer", "Production Planner", "Professional Athlete", "Professional Coach", "Professor", "Project Engineer", "Project Manager", "Program Manager", "Property Manager", "Public Administrator", "Public Safety Director", "PR Specialist", "Publisher", "Purchasing Agent", "Publishing Director", "Quality Assurance Specialist", "Quality Control Engineer", "Quality Control Inspector", "Radiology Manager", "Railroad Engineer", "Real Estate Broker", "Recreational Director", "Recruiter", "Redevelopment Specialist", "Regulatory Affairs Manager", "Registered Nurse", "Rehabilitation Counselor", "Relocation Manager", "Reporter", "Research Specialist", "Restaurant Manager", "Retail Store Manager", "Risk Analyst", "Safety Engineer", "Sales Engineer", "Sales Trainer", "Sales Promotion Manager", "Sales Representative", "Sales Manager", "Service Manager", "Sanitation Engineer", "Scientific Programmer", "Scientific Writer", "Securities Analyst", "Security Consultant", "Security Director", "Seminar Presenter", "Ship's Officer", "Singer", "Social Director", "Social Program Planner", "Social Research", "Social Scientist", "Social Worker", "Sociologist", "Software Developer", "Software Engineer", "Software Test Engineer", "Soil Scientist", "Special Events Manager", "Special Education Teacher", "Special Projects Director", "Speech Pathologist", "Speech Writer", "Sports Event Manager", "Statistician", "Store Manager", "Strategic Alliance Director", "Strategic Planning Director", "Stress Reduction Specialist", "Stockbroker", "Surveyor", "Structural Engineer", "Superintendent", "Supply Chain Director", "System Engineer", "Systems Analyst", "Systems Programmer", "System Administrator", "Tax Specialist", "Teacher", "Technical Support Specialist", "Technical Illustrator", "Technical Writer", "Technology Director", "Telecom Analyst", "Telemarketer", "Theatrical Director", "Title Examiner", "Tour Escort", "Tour Guide Director", "Traffic Manager", "Trainer Translator", "Transportation Manager", "Travel Agent", "Treasurer", "TV Programmer", "Underwriter", "Union Representative", "University Administrator", "University Dean", "Urban Planner", "Veterinarian", "Vendor Relations Director", "Viticulturist", "Warehouse Manager"],
      animals: {
        //list of ocean animals comes from https://owlcation.com/stem/list-of-ocean-animals
        "ocean": ["Acantharea", "Anemone", "Angelfish King", "Ahi Tuna", "Albacore", "American Oyster", "Anchovy", "Armored Snail", "Arctic Char", "Atlantic Bluefin Tuna", "Atlantic Cod", "Atlantic Goliath Grouper", "Atlantic Trumpetfish", "Atlantic Wolffish", "Baleen Whale", "Banded Butterflyfish", "Banded Coral Shrimp", "Banded Sea Krait", "Barnacle", "Barndoor Skate", "Barracuda", "Basking Shark", "Bass", "Beluga Whale", "Bluebanded Goby", "Bluehead Wrasse", "Bluefish", "Bluestreak Cleaner-Wrasse", "Blue Marlin", "Blue Shark", "Blue Spiny Lobster", "Blue Tang", "Blue Whale", "Broadclub Cuttlefish", "Bull Shark", "Chambered Nautilus", "Chilean Basket Star", "Chilean Jack Mackerel", "Chinook Salmon", "Christmas Tree Worm", "Clam", "Clown Anemonefish", "Clown Triggerfish", "Cod", "Coelacanth", "Cockscomb Cup Coral", "Common Fangtooth", "Conch", "Cookiecutter Shark", "Copepod", "Coral", "Corydoras", "Cownose Ray", "Crab", "Crown-of-Thorns Starfish", "Cushion Star", "Cuttlefish", "California Sea Otters", "Dolphin", "Dolphinfish", "Dory", "Devil Fish", "Dugong", "Dumbo Octopus", "Dungeness Crab", "Eccentric Sand Dollar", "Edible Sea Cucumber", "Eel", "Elephant Seal", "Elkhorn Coral", "Emperor Shrimp", "Estuarine Crocodile", "Fathead Sculpin", "Fiddler Crab", "Fin Whale", "Flameback", "Flamingo Tongue Snail", "Flashlight Fish", "Flatback Turtle", "Flatfish", "Flying Fish", "Flounder", "Fluke", "French Angelfish", "Frilled Shark", "Fugu (also called Pufferfish)", "Gar", "Geoduck", "Giant Barrel Sponge", "Giant Caribbean Sea Anemone", "Giant Clam", "Giant Isopod", "Giant Kingfish", "Giant Oarfish", "Giant Pacific Octopus", "Giant Pyrosome", "Giant Sea Star", "Giant Squid", "Glowing Sucker Octopus", "Giant Tube Worm", "Goblin Shark", "Goosefish", "Great White Shark", "Greenland Shark", "Grey Atlantic Seal", "Grouper", "Grunion", "Guineafowl Puffer", "Haddock", "Hake", "Halibut", "Hammerhead Shark", "Hapuka", "Harbor Porpoise", "Harbor Seal", "Hatchetfish", "Hawaiian Monk Seal", "Hawksbill Turtle", "Hector's Dolphin", "Hermit Crab", "Herring", "Hoki", "Horn Shark", "Horseshoe Crab", "Humpback Anglerfish", "Humpback Whale", "Icefish", "Imperator Angelfish", "Irukandji Jellyfish", "Isopod", "Ivory Bush Coral", "Japanese Spider Crab", "Jellyfish", "John Dory", "Juan Fernandez Fur Seal", "Killer Whale", "Kiwa Hirsuta", "Krill", "Lagoon Triggerfish", "Lamprey", "Leafy Seadragon", "Leopard Seal", "Limpet", "Ling", "Lionfish", "Lions Mane Jellyfish", "Lobe Coral", "Lobster", "Loggerhead Turtle", "Longnose Sawshark", "Longsnout Seahorse", "Lophelia Coral", "Marrus Orthocanna", "Manatee", "Manta Ray", "Marlin", "Megamouth Shark", "Mexican Lookdown", "Mimic Octopus", "Moon Jelly", "Mollusk", "Monkfish", "Moray Eel", "Mullet", "Mussel", "Megaladon", "Napoleon Wrasse", "Nassau Grouper", "Narwhal", "Nautilus", "Needlefish", "Northern Seahorse", "North Atlantic Right Whale", "Northern Red Snapper", "Norway Lobster", "Nudibranch", "Nurse Shark", "Oarfish", "Ocean Sunfish", "Oceanic Whitetip Shark", "Octopus", "Olive Sea Snake", "Orange Roughy", "Ostracod", "Otter", "Oyster", "Pacific Angelshark", "Pacific Blackdragon", "Pacific Halibut", "Pacific Sardine", "Pacific Sea Nettle Jellyfish", "Pacific White Sided Dolphin", "Pantropical Spotted Dolphin", "Patagonian Toothfish", "Peacock Mantis Shrimp", "Pelagic Thresher Shark", "Penguin", "Peruvian Anchoveta", "Pilchard", "Pink Salmon", "Pinniped", "Plankton", "Porpoise", "Polar Bear", "Portuguese Man o' War", "Pycnogonid Sea Spider", "Quahog", "Queen Angelfish", "Queen Conch", "Queen Parrotfish", "Queensland Grouper", "Ragfish", "Ratfish", "Rattail Fish", "Ray", "Red Drum", "Red King Crab", "Ringed Seal", "Risso's Dolphin", "Ross Seals", "Sablefish", "Salmon", "Sand Dollar", "Sandbar Shark", "Sawfish", "Sarcastic Fringehead", "Scalloped Hammerhead Shark", "Seahorse", "Sea Cucumber", "Sea Lion", "Sea Urchin", "Seal", "Shark", "Shortfin Mako Shark", "Shovelnose Guitarfish", "Shrimp", "Silverside Fish", "Skipjack Tuna", "Slender Snipe Eel", "Smalltooth Sawfish", "Smelts", "Sockeye Salmon", "Southern Stingray", "Sponge", "Spotted Porcupinefish", "Spotted Dolphin", "Spotted Eagle Ray", "Spotted Moray", "Squid", "Squidworm", "Starfish", "Stickleback", "Stonefish", "Stoplight Loosejaw", "Sturgeon", "Swordfish", "Tan Bristlemouth", "Tasseled Wobbegong", "Terrible Claw Lobster", "Threespot Damselfish", "Tiger Prawn", "Tiger Shark", "Tilefish", "Toadfish", "Tropical Two-Wing Flyfish", "Tuna", "Umbrella Squid", "Velvet Crab", "Venus Flytrap Sea Anemone", "Vigtorniella Worm", "Viperfish", "Vampire Squid", "Vaquita", "Wahoo", "Walrus", "West Indian Manatee", "Whale", "Whale Shark", "Whiptail Gulper", "White-Beaked Dolphin", "White-Ring Garden Eel", "White Shrimp", "Wobbegong", "Wrasse", "Wreckfish", "Xiphosura", "Yellowtail Damselfish", "Yelloweye Rockfish", "Yellow Cup Black Coral", "Yellow Tube Sponge", "Yellowfin Tuna", "Zebrashark", "Zooplankton"],
        //list of desert, grassland, and forest animals comes from http://www.skyenimals.com/
        "desert": ["Aardwolf", "Addax", "African Wild Ass", "Ant", "Antelope", "Armadillo", "Baboon", "Badger", "Bat", "Bearded Dragon", "Beetle", "Bird", "Black-footed Cat", "Boa", "Brown Bear", "Bustard", "Butterfly", "Camel", "Caracal", "Caracara", "Caterpillar", "Centipede", "Cheetah", "Chipmunk", "Chuckwalla", "Climbing Mouse", "Coati", "Cobra", "Cotton Rat", "Cougar", "Courser", "Crane Fly", "Crow", "Dassie Rat", "Dove", "Dunnart", "Eagle", "Echidna", "Elephant", "Emu", "Falcon", "Fly", "Fox", "Frogmouth", "Gecko", "Geoffroy's Cat", "Gerbil", "Grasshopper", "Guanaco", "Gundi", "Hamster", "Hawk", "Hedgehog", "Hyena", "Hyrax", "Jackal", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kowari", "Kultarr", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Oryx", "Ostrich", "Owl", "Pronghorn", "Python", "Rabbit", "Raccoon", "Rattlesnake", "Rhinoceros", "Sand Cat", "Spectacled Bear", "Spiny Mouse", "Starling", "Stick Bug", "Tarantula", "Tit", "Toad", "Tortoise", "Tyrant Flycatcher", "Viper", "Vulture", "Waxwing", "Xerus", "Zebra"],
        "grassland": ["Aardvark", "Aardwolf", "Accentor", "African Buffalo", "African Wild Dog", "Alpaca", "Anaconda", "Ant", "Anteater", "Antelope", "Armadillo", "Baboon", "Badger", "Bandicoot", "Barbet", "Bat", "Bee", "Bee-eater", "Beetle", "Bird", "Bison", "Black-footed Cat", "Black-footed Ferret", "Bluebird", "Boa", "Bowerbird", "Brown Bear", "Bush Dog", "Bushshrike", "Bustard", "Butterfly", "Buzzard", "Caracal", "Caracara", "Cardinal", "Caterpillar", "Cheetah", "Chipmunk", "Civet", "Climbing Mouse", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Common Genet", "Cotton Rat", "Cougar", "Courser", "Coyote", "Crane", "Crane Fly", "Cricket", "Crow", "Culpeo", "Death Adder", "Deer", "Deer Mouse", "Dingo", "Dinosaur", "Dove", "Drongo", "Duck", "Duiker", "Dunnart", "Eagle", "Echidna", "Elephant", "Elk", "Emu", "Falcon", "Finch", "Flea", "Fly", "Flying Frog", "Fox", "Frog", "Frogmouth", "Garter Snake", "Gazelle", "Gecko", "Geoffroy's Cat", "Gerbil", "Giant Tortoise", "Giraffe", "Grasshopper", "Grison", "Groundhog", "Grouse", "Guanaco", "Guinea Pig", "Hamster", "Harrier", "Hartebeest", "Hawk", "Hedgehog", "Helmetshrike", "Hippopotamus", "Hornbill", "Hyena", "Hyrax", "Impala", "Jackal", "Jaguar", "Jaguarundi", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kultarr", "Ladybug", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Newt", "Oryx", "Ostrich", "Owl", "Pangolin", "Pheasant", "Prairie Dog", "Pronghorn", "Przewalski's Horse", "Python", "Quoll", "Rabbit", "Raven", "Rhinoceros", "Shelduck", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Tamandua", "Tasmanian Devil", "Thornbill", "Thrush", "Toad", "Tortoise"],
        "forest": ["Agouti", "Anaconda", "Anoa", "Ant", "Anteater", "Antelope", "Armadillo", "Asian Black Bear", "Aye-aye", "Babirusa", "Baboon", "Badger", "Bandicoot", "Banteng", "Barbet", "Basilisk", "Bat", "Bearded Dragon", "Bee", "Bee-eater", "Beetle", "Bettong", "Binturong", "Bird-of-paradise", "Bongo", "Bowerbird", "Bulbul", "Bush Dog", "Bushbaby", "Bushshrike", "Butterfly", "Buzzard", "Caecilian", "Cardinal", "Cassowary", "Caterpillar", "Centipede", "Chameleon", "Chimpanzee", "Cicada", "Civet", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Colugo", "Cotinga", "Cotton Rat", "Cougar", "Crane Fly", "Cricket", "Crocodile", "Crow", "Cuckoo", "Cuscus", "Death Adder", "Deer", "Dhole", "Dingo", "Dinosaur", "Drongo", "Duck", "Duiker", "Eagle", "Echidna", "Elephant", "Finch", "Flat-headed Cat", "Flea", "Flowerpecker", "Fly", "Flying Frog", "Fossa", "Frog", "Frogmouth", "Gaur", "Gecko", "Gorilla", "Grison", "Hawaiian Honeycreeper", "Hawk", "Hedgehog", "Helmetshrike", "Hornbill", "Hyrax", "Iguana", "Jackal", "Jaguar", "Jaguarundi", "Kestrel", "Ladybug", "Lemur", "Leopard", "Lion", "Macaw", "Mandrill", "Margay", "Monkey", "Mouse", "Mouse Deer", "Newt", "Okapi", "Old World Flycatcher", "Orangutan", "Owl", "Pangolin", "Peafowl", "Pheasant", "Possum", "Python", "Quokka", "Rabbit", "Raccoon", "Red Panda", "Red River Hog", "Rhinoceros", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Sun Bear", "Tamandua", "Tamarin", "Tapir", "Tarantula", "Thrush", "Tiger", "Tit", "Toad", "Tortoise", "Toucan", "Trogon", "Trumpeter", "Turaco", "Turtle", "Tyrant Flycatcher", "Viper", "Vulture", "Wallaby", "Warbler", "Wasp", "Waxwing", "Weaver", "Weaver-finch", "Whistler", "White-eye", "Whydah", "Woodswallow", "Worm", "Wren", "Xenops", "Yellowjacket", "Accentor", "African Buffalo", "American Black Bear", "Anole", "Bird", "Bison", "Boa", "Brown Bear", "Chipmunk", "Common Genet", "Copperhead", "Coyote", "Deer Mouse", "Dormouse", "Elk", "Emu", "Fisher", "Fox", "Garter Snake", "Giant Panda", "Giant Tortoise", "Groundhog", "Grouse", "Guanaco", "Himalayan Tahr", "Kangaroo", "Koala", "Numbat", "Quoll", "Raccoon dog", "Tasmanian Devil", "Thornbill", "Turkey", "Vole", "Weasel", "Wildcat", "Wolf", "Wombat", "Woodchuck", "Woodpecker"],
        //list of farm animals comes from https://www.buzzle.com/articles/farm-animals-list.html
        "farm": ["Alpaca", "Buffalo", "Banteng", "Cow", "Cat", "Chicken", "Carp", "Camel", "Donkey", "Dog", "Duck", "Emu", "Goat", "Gayal", "Guinea", "Goose", "Horse", "Honey", "Llama", "Pig", "Pigeon", "Rhea", "Rabbit", "Sheep", "Silkworm", "Turkey", "Yak", "Zebu"],
        //list of pet animals comes from https://www.dogbreedinfo.com/pets/pet.htm
        "pet": ["Bearded Dragon", "Birds", "Burro", "Cats", "Chameleons", "Chickens", "Chinchillas", "Chinese Water Dragon", "Cows", "Dogs", "Donkey", "Ducks", "Ferrets", "Fish", "Geckos", "Geese", "Gerbils", "Goats", "Guinea Fowl", "Guinea Pigs", "Hamsters", "Hedgehogs", "Horses", "Iguanas", "Llamas", "Lizards", "Mice", "Mule", "Peafowl", "Pigs and Hogs", "Pigeons", "Ponies", "Pot Bellied Pig", "Rabbits", "Rats", "Sheep", "Skinks", "Snakes", "Stick Insects", "Sugar Gliders", "Tarantula", "Turkeys", "Turtles"],
        //list of zoo animals comes from https://bronxzoo.com/animals
        "zoo": ["Aardvark", "African Wild Dog", "Aldabra Tortoise", "American Alligator", "American Bison", "Amur Tiger", "Anaconda", "Andean Condor", "Asian Elephant", "Baby Doll Sheep", "Bald Eagle", "Barred Owl", "Blue Iguana", "Boer Goat", "California Sea Lion", "Caribbean Flamingo", "Chinchilla", "Collared Lemur", "Coquerel's Sifaka", "Cuban Amazon Parrot", "Ebony Langur", "Fennec Fox", "Fossa", "Gelada", "Giant Anteater", "Giraffe", "Gorilla", "Grizzly Bear", "Henkel's Leaf-tailed Gecko", "Indian Gharial", "Indian Rhinoceros", "King Cobra", "King Vulture", "Komodo Dragon", "Linne's Two-toed Sloth", "Lion", "Little Penguin", "Madagascar Tree Boa", "Magellanic Penguin", "Malayan Tapir", "Malayan Tiger", "Matschies Tree Kangaroo", "Mini Donkey", "Monarch Butterfly", "Nile crocodile", "North American Porcupine", "Nubian Ibex", "Okapi", "Poison Dart Frog", "Polar Bear", "Pygmy Marmoset", "Radiated Tortoise", "Red Panda", "Red Ruffed Lemur", "Ring-tailed Lemur", "Ring-tailed Mongoose", "Rock Hyrax", "Small Clawed Asian Otter", "Snow Leopard", "Snowy Owl", "Southern White-faced Owl", "Southern White Rhinocerous", "Squirrel Monkey", "Tufted Puffin", "White Cheeked Gibbon", "White-throated Bee Eater", "Zebra"]
      },
      primes: [// 1230 first primes, i.e. all primes up to the first one greater than 10000, inclusive.
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863, 3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001, 4003, 4007, 4013, 4019, 4021, 4027, 4049, 4051, 4057, 4073, 4079, 4091, 4093, 4099, 4111, 4127, 4129, 4133, 4139, 4153, 4157, 4159, 4177, 4201, 4211, 4217, 4219, 4229, 4231, 4241, 4243, 4253, 4259, 4261, 4271, 4273, 4283, 4289, 4297, 4327, 4337, 4339, 4349, 4357, 4363, 4373, 4391, 4397, 4409, 4421, 4423, 4441, 4447, 4451, 4457, 4463, 4481, 4483, 4493, 4507, 4513, 4517, 4519, 4523, 4547, 4549, 4561, 4567, 4583, 4591, 4597, 4603, 4621, 4637, 4639, 4643, 4649, 4651, 4657, 4663, 4673, 4679, 4691, 4703, 4721, 4723, 4729, 4733, 4751, 4759, 4783, 4787, 4789, 4793, 4799, 4801, 4813, 4817, 4831, 4861, 4871, 4877, 4889, 4903, 4909, 4919, 4931, 4933, 4937, 4943, 4951, 4957, 4967, 4969, 4973, 4987, 4993, 4999, 5003, 5009, 5011, 5021, 5023, 5039, 5051, 5059, 5077, 5081, 5087, 5099, 5101, 5107, 5113, 5119, 5147, 5153, 5167, 5171, 5179, 5189, 5197, 5209, 5227, 5231, 5233, 5237, 5261, 5273, 5279, 5281, 5297, 5303, 5309, 5323, 5333, 5347, 5351, 5381, 5387, 5393, 5399, 5407, 5413, 5417, 5419, 5431, 5437, 5441, 5443, 5449, 5471, 5477, 5479, 5483, 5501, 5503, 5507, 5519, 5521, 5527, 5531, 5557, 5563, 5569, 5573, 5581, 5591, 5623, 5639, 5641, 5647, 5651, 5653, 5657, 5659, 5669, 5683, 5689, 5693, 5701, 5711, 5717, 5737, 5741, 5743, 5749, 5779, 5783, 5791, 5801, 5807, 5813, 5821, 5827, 5839, 5843, 5849, 5851, 5857, 5861, 5867, 5869, 5879, 5881, 5897, 5903, 5923, 5927, 5939, 5953, 5981, 5987, 6007, 6011, 6029, 6037, 6043, 6047, 6053, 6067, 6073, 6079, 6089, 6091, 6101, 6113, 6121, 6131, 6133, 6143, 6151, 6163, 6173, 6197, 6199, 6203, 6211, 6217, 6221, 6229, 6247, 6257, 6263, 6269, 6271, 6277, 6287, 6299, 6301, 6311, 6317, 6323, 6329, 6337, 6343, 6353, 6359, 6361, 6367, 6373, 6379, 6389, 6397, 6421, 6427, 6449, 6451, 6469, 6473, 6481, 6491, 6521, 6529, 6547, 6551, 6553, 6563, 6569, 6571, 6577, 6581, 6599, 6607, 6619, 6637, 6653, 6659, 6661, 6673, 6679, 6689, 6691, 6701, 6703, 6709, 6719, 6733, 6737, 6761, 6763, 6779, 6781, 6791, 6793, 6803, 6823, 6827, 6829, 6833, 6841, 6857, 6863, 6869, 6871, 6883, 6899, 6907, 6911, 6917, 6947, 6949, 6959, 6961, 6967, 6971, 6977, 6983, 6991, 6997, 7001, 7013, 7019, 7027, 7039, 7043, 7057, 7069, 7079, 7103, 7109, 7121, 7127, 7129, 7151, 7159, 7177, 7187, 7193, 7207, 7211, 7213, 7219, 7229, 7237, 7243, 7247, 7253, 7283, 7297, 7307, 7309, 7321, 7331, 7333, 7349, 7351, 7369, 7393, 7411, 7417, 7433, 7451, 7457, 7459, 7477, 7481, 7487, 7489, 7499, 7507, 7517, 7523, 7529, 7537, 7541, 7547, 7549, 7559, 7561, 7573, 7577, 7583, 7589, 7591, 7603, 7607, 7621, 7639, 7643, 7649, 7669, 7673, 7681, 7687, 7691, 7699, 7703, 7717, 7723, 7727, 7741, 7753, 7757, 7759, 7789, 7793, 7817, 7823, 7829, 7841, 7853, 7867, 7873, 7877, 7879, 7883, 7901, 7907, 7919, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009, 8011, 8017, 8039, 8053, 8059, 8069, 8081, 8087, 8089, 8093, 8101, 8111, 8117, 8123, 8147, 8161, 8167, 8171, 8179, 8191, 8209, 8219, 8221, 8231, 8233, 8237, 8243, 8263, 8269, 8273, 8287, 8291, 8293, 8297, 8311, 8317, 8329, 8353, 8363, 8369, 8377, 8387, 8389, 8419, 8423, 8429, 8431, 8443, 8447, 8461, 8467, 8501, 8513, 8521, 8527, 8537, 8539, 8543, 8563, 8573, 8581, 8597, 8599, 8609, 8623, 8627, 8629, 8641, 8647, 8663, 8669, 8677, 8681, 8689, 8693, 8699, 8707, 8713, 8719, 8731, 8737, 8741, 8747, 8753, 8761, 8779, 8783, 8803, 8807, 8819, 8821, 8831, 8837, 8839, 8849, 8861, 8863, 8867, 8887, 8893, 8923, 8929, 8933, 8941, 8951, 8963, 8969, 8971, 8999, 9001, 9007, 9011, 9013, 9029, 9041, 9043, 9049, 9059, 9067, 9091, 9103, 9109, 9127, 9133, 9137, 9151, 9157, 9161, 9173, 9181, 9187, 9199, 9203, 9209, 9221, 9227, 9239, 9241, 9257, 9277, 9281, 9283, 9293, 9311, 9319, 9323, 9337, 9341, 9343, 9349, 9371, 9377, 9391, 9397, 9403, 9413, 9419, 9421, 9431, 9433, 9437, 9439, 9461, 9463, 9467, 9473, 9479, 9491, 9497, 9511, 9521, 9533, 9539, 9547, 9551, 9587, 9601, 9613, 9619, 9623, 9629, 9631, 9643, 9649, 9661, 9677, 9679, 9689, 9697, 9719, 9721, 9733, 9739, 9743, 9749, 9767, 9769, 9781, 9787, 9791, 9803, 9811, 9817, 9829, 9833, 9839, 9851, 9857, 9859, 9871, 9883, 9887, 9901, 9907, 9923, 9929, 9931, 9941, 9949, 9967, 9973, 10007],
      emotions: ["love", "joy", "surprise", "anger", "sadness", "fear"]
    };
    var o_hasOwnProperty = Object.prototype.hasOwnProperty;

    var o_keys = Object.keys || function (obj) {
      var result = [];

      for (var key in obj) {
        if (o_hasOwnProperty.call(obj, key)) {
          result.push(key);
        }
      }

      return result;
    };

    function _copyObject(source, target) {
      var keys = o_keys(source);
      var key;

      for (var i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        target[key] = source[key] || target[key];
      }
    }

    function _copyArray(source, target) {
      for (var i = 0, l = source.length; i < l; i++) {
        target[i] = source[i];
      }
    }

    function copyObject(source, _target) {
      var isArray = Array.isArray(source);
      var target = _target || (isArray ? new Array(source.length) : {});

      if (isArray) {
        _copyArray(source, target);
      } else {
        _copyObject(source, target);
      }

      return target;
    }
    /** Get the data based on key**/


    Chance.prototype.get = function (name) {
      return copyObject(data[name]);
    }; // Mac Address


    Chance.prototype.mac_address = function (options) {
      // typically mac addresses are separated by ":"
      // however they can also be separated by "-"
      // the network variant uses a dot every fourth byte
      options = initOptions(options);

      if (!options.separator) {
        options.separator = options.networkVersion ? "." : ":";
      }

      var mac_pool = "ABCDEF1234567890",
          mac = "";

      if (!options.networkVersion) {
        mac = this.n(this.string, 6, {
          pool: mac_pool,
          length: 2
        }).join(options.separator);
      } else {
        mac = this.n(this.string, 3, {
          pool: mac_pool,
          length: 4
        }).join(options.separator);
      }

      return mac;
    };

    Chance.prototype.normal = function (options) {
      options = initOptions(options, {
        mean: 0,
        dev: 1,
        pool: []
      });
      testRange(options.pool.constructor !== Array, "Chance: The pool option must be a valid array.");
      testRange(typeof options.mean !== 'number', "Chance: Mean (mean) must be a number");
      testRange(typeof options.dev !== 'number', "Chance: Standard deviation (dev) must be a number"); // If a pool has been passed, then we are returning an item from that pool,
      // using the normal distribution settings that were passed in

      if (options.pool.length > 0) {
        return this.normal_pool(options);
      } // The Marsaglia Polar method


      var s,
          u,
          v,
          norm,
          mean = options.mean,
          dev = options.dev;

      do {
        // U and V are from the uniform distribution on (-1, 1)
        u = this.random() * 2 - 1;
        v = this.random() * 2 - 1;
        s = u * u + v * v;
      } while (s >= 1); // Compute the standard normal variate


      norm = u * Math.sqrt(-2 * Math.log(s) / s); // Shape and scale

      return dev * norm + mean;
    };

    Chance.prototype.normal_pool = function (options) {
      var performanceCounter = 0;

      do {
        var idx = Math.round(this.normal({
          mean: options.mean,
          dev: options.dev
        }));

        if (idx < options.pool.length && idx >= 0) {
          return options.pool[idx];
        } else {
          performanceCounter++;
        }
      } while (performanceCounter < 100);

      throw new RangeError("Chance: Your pool is too small for the given mean and standard deviation. Please adjust.");
    };

    Chance.prototype.radio = function (options) {
      // Initial Letter (Typically Designated by Side of Mississippi River)
      options = initOptions(options, {
        side: "?"
      });
      var fl = "";

      switch (options.side.toLowerCase()) {
        case "east":
        case "e":
          fl = "W";
          break;

        case "west":
        case "w":
          fl = "K";
          break;

        default:
          fl = this.character({
            pool: "KW"
          });
          break;
      }

      return fl + this.character({
        alpha: true,
        casing: "upper"
      }) + this.character({
        alpha: true,
        casing: "upper"
      }) + this.character({
        alpha: true,
        casing: "upper"
      });
    }; // Set the data as key and data or the data map


    Chance.prototype.set = function (name, values) {
      if (typeof name === "string") {
        data[name] = values;
      } else {
        data = copyObject(name, data);
      }
    };

    Chance.prototype.tv = function (options) {
      return this.radio(options);
    }; // ID number for Brazil companies


    Chance.prototype.cnpj = function () {
      var n = this.n(this.natural, 8, {
        max: 9
      });
      var d1 = 2 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
      d1 = 11 - d1 % 11;

      if (d1 >= 10) {
        d1 = 0;
      }

      var d2 = d1 * 2 + 3 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
      d2 = 11 - d2 % 11;

      if (d2 >= 10) {
        d2 = 0;
      }

      return '' + n[0] + n[1] + '.' + n[2] + n[3] + n[4] + '.' + n[5] + n[6] + n[7] + '/0001-' + d1 + d2;
    };

    Chance.prototype.emotion = function () {
      return this.pick(this.get("emotions"));
    }; // -- End Miscellaneous --


    Chance.prototype.mersenne_twister = function (seed) {
      return new MersenneTwister(seed);
    };

    Chance.prototype.blueimp_md5 = function () {
      return new BlueImpMD5();
    }; // Mersenne Twister from https://gist.github.com/banksean/300494

    /*
       A C-program for MT19937, with initialization improved 2002/1/26.
       Coded by Takuji Nishimura and Makoto Matsumoto.
        Before using, initialize the state by using init_genrand(seed)
       or init_by_array(init_key, key_length).
        Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
       All rights reserved.
        Redistribution and use in source and binary forms, with or without
       modification, are permitted provided that the following conditions
       are met:
        1. Redistributions of source code must retain the above copyright
       notice, this list of conditions and the following disclaimer.
        2. Redistributions in binary form must reproduce the above copyright
       notice, this list of conditions and the following disclaimer in the
       documentation and/or other materials provided with the distribution.
        3. The names of its contributors may not be used to endorse or promote
       products derived from this software without specific prior written
       permission.
        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
       A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
       CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
       EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
       PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
       PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
       LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
       NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
       SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
         Any feedback is very welcome.
       http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
       email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
     */


    var MersenneTwister = function MersenneTwister(seed) {
      if (seed === undefined) {
        // kept random number same size as time used previously to ensure no unexpected results downstream
        seed = Math.floor(Math.random() * Math.pow(10, 13));
      }
      /* Period parameters */


      this.N = 624;
      this.M = 397;
      this.MATRIX_A = 0x9908b0df;
      /* constant vector a */

      this.UPPER_MASK = 0x80000000;
      /* most significant w-r bits */

      this.LOWER_MASK = 0x7fffffff;
      /* least significant r bits */

      this.mt = new Array(this.N);
      /* the array for the state vector */

      this.mti = this.N + 1;
      /* mti==N + 1 means mt[N] is not initialized */

      this.init_genrand(seed);
    };
    /* initializes mt[N] with a seed */


    MersenneTwister.prototype.init_genrand = function (s) {
      this.mt[0] = s >>> 0;

      for (this.mti = 1; this.mti < this.N; this.mti++) {
        s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
        this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */

        /* In the previous versions, MSBs of the seed affect   */

        /* only MSBs of the array mt[].                        */

        /* 2002/01/09 modified by Makoto Matsumoto             */

        this.mt[this.mti] >>>= 0;
        /* for >32 bit machines */
      }
    };
    /* initialize by an array with array-length */

    /* init_key is the array for initializing keys */

    /* key_length is its length */

    /* slight change for C++, 2004/2/26 */


    MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
      var i = 1,
          j = 0,
          k,
          s;
      this.init_genrand(19650218);
      k = this.N > key_length ? this.N : key_length;

      for (; k; k--) {
        s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
        this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1664525 << 16) + (s & 0x0000ffff) * 1664525) + init_key[j] + j;
        /* non linear */

        this.mt[i] >>>= 0;
        /* for WORDSIZE > 32 machines */

        i++;
        j++;

        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];
          i = 1;
        }

        if (j >= key_length) {
          j = 0;
        }
      }

      for (k = this.N - 1; k; k--) {
        s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
        this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1566083941 << 16) + (s & 0x0000ffff) * 1566083941) - i;
        /* non linear */

        this.mt[i] >>>= 0;
        /* for WORDSIZE > 32 machines */

        i++;

        if (i >= this.N) {
          this.mt[0] = this.mt[this.N - 1];
          i = 1;
        }
      }

      this.mt[0] = 0x80000000;
      /* MSB is 1; assuring non-zero initial array */
    };
    /* generates a random number on [0,0xffffffff]-interval */


    MersenneTwister.prototype.genrand_int32 = function () {
      var y;
      var mag01 = new Array(0x0, this.MATRIX_A);
      /* mag01[x] = x * MATRIX_A  for x=0,1 */

      if (this.mti >= this.N) {
        /* generate N words at one time */
        var kk;

        if (this.mti === this.N + 1) {
          /* if init_genrand() has not been called, */
          this.init_genrand(5489);
          /* a default initial seed is used */
        }

        for (kk = 0; kk < this.N - this.M; kk++) {
          y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
          this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 0x1];
        }

        for (; kk < this.N - 1; kk++) {
          y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
          this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 0x1];
        }

        y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 0x1];
        this.mti = 0;
      }

      y = this.mt[this.mti++];
      /* Tempering */

      y ^= y >>> 11;
      y ^= y << 7 & 0x9d2c5680;
      y ^= y << 15 & 0xefc60000;
      y ^= y >>> 18;
      return y >>> 0;
    };
    /* generates a random number on [0,0x7fffffff]-interval */


    MersenneTwister.prototype.genrand_int31 = function () {
      return this.genrand_int32() >>> 1;
    };
    /* generates a random number on [0,1]-real-interval */


    MersenneTwister.prototype.genrand_real1 = function () {
      return this.genrand_int32() * (1.0 / 4294967295.0);
      /* divided by 2^32-1 */
    };
    /* generates a random number on [0,1)-real-interval */


    MersenneTwister.prototype.random = function () {
      return this.genrand_int32() * (1.0 / 4294967296.0);
      /* divided by 2^32 */
    };
    /* generates a random number on (0,1)-real-interval */


    MersenneTwister.prototype.genrand_real3 = function () {
      return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
      /* divided by 2^32 */
    };
    /* generates a random number on [0,1) with 53-bit resolution*/


    MersenneTwister.prototype.genrand_res53 = function () {
      var a = this.genrand_int32() >>> 5,
          b = this.genrand_int32() >>> 6;
      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }; // BlueImp MD5 hashing algorithm from https://github.com/blueimp/JavaScript-MD5


    var BlueImpMD5 = function BlueImpMD5() {};

    BlueImpMD5.prototype.VERSION = '1.0.1';
    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */

    BlueImpMD5.prototype.safe_add = function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 0xFFFF;
    };
    /*
    * Bitwise rotate a 32-bit number to the left.
    */


    BlueImpMD5.prototype.bit_roll = function (num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    };
    /*
    * These functions implement the five basic operations the algorithm uses.
    */


    BlueImpMD5.prototype.md5_cmn = function (q, a, b, x, s, t) {
      return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };

    BlueImpMD5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
      return this.md5_cmn(b & c | ~b & d, a, b, x, s, t);
    };

    BlueImpMD5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
      return this.md5_cmn(b & d | c & ~d, a, b, x, s, t);
    };

    BlueImpMD5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
      return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };

    BlueImpMD5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
      return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
    };
    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */


    BlueImpMD5.prototype.binl_md5 = function (x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << len % 32;
      x[(len + 64 >>> 9 << 4) + 14] = len;
      var i,
          olda,
          oldb,
          oldc,
          oldd,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = this.md5_ff(a, b, c, d, x[i], 7, -680876936);
        d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = this.md5_gg(b, c, d, a, x[i], 20, -373897302);
        a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = this.md5_hh(d, a, b, c, x[i], 11, -358537222);
        c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = this.md5_ii(a, b, c, d, x[i], 6, -198630844);
        d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = this.safe_add(a, olda);
        b = this.safe_add(b, oldb);
        c = this.safe_add(c, oldc);
        d = this.safe_add(d, oldd);
      }

      return [a, b, c, d];
    };
    /*
    * Convert an array of little-endian words to a string
    */


    BlueImpMD5.prototype.binl2rstr = function (input) {
      var i,
          output = '';

      for (i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
      }

      return output;
    };
    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */


    BlueImpMD5.prototype.rstr2binl = function (input) {
      var i,
          output = [];
      output[(input.length >> 2) - 1] = undefined;

      for (i = 0; i < output.length; i += 1) {
        output[i] = 0;
      }

      for (i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
      }

      return output;
    };
    /*
    * Calculate the MD5 of a raw string
    */


    BlueImpMD5.prototype.rstr_md5 = function (s) {
      return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };
    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */


    BlueImpMD5.prototype.rstr_hmac_md5 = function (key, data) {
      var i,
          bkey = this.rstr2binl(key),
          ipad = [],
          opad = [],
          hash;
      ipad[15] = opad[15] = undefined;

      if (bkey.length > 16) {
        bkey = this.binl_md5(bkey, key.length * 8);
      }

      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }

      hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
      return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };
    /*
    * Convert a raw string to a hex string
    */


    BlueImpMD5.prototype.rstr2hex = function (input) {
      var hex_tab = '0123456789abcdef',
          output = '',
          x,
          i;

      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
      }

      return output;
    };
    /*
    * Encode a string as utf-8
    */


    BlueImpMD5.prototype.str2rstr_utf8 = function (input) {
      return unescape(encodeURIComponent(input));
    };
    /*
    * Take string arguments and return either raw or hex encoded strings
    */


    BlueImpMD5.prototype.raw_md5 = function (s) {
      return this.rstr_md5(this.str2rstr_utf8(s));
    };

    BlueImpMD5.prototype.hex_md5 = function (s) {
      return this.rstr2hex(this.raw_md5(s));
    };

    BlueImpMD5.prototype.raw_hmac_md5 = function (k, d) {
      return this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d));
    };

    BlueImpMD5.prototype.hex_hmac_md5 = function (k, d) {
      return this.rstr2hex(this.raw_hmac_md5(k, d));
    };

    BlueImpMD5.prototype.md5 = function (string, key, raw) {
      if (!key) {
        if (!raw) {
          return this.hex_md5(string);
        }

        return this.raw_md5(string);
      }

      if (!raw) {
        return this.hex_hmac_md5(key, string);
      }

      return this.raw_hmac_md5(key, string);
    }; // CommonJS module


    {
      if ( module.exports) {
        exports = module.exports = Chance;
      }

      exports.Chance = Chance;
    } // Register as an anonymous AMD module
    // allows worker to use full Chance functionality with seed


    if (typeof importScripts !== 'undefined') {
      chance = new Chance();
      self.Chance = Chance;
    } // If there is a window object, that at least has a document property,
    // instantiate and define chance on the window


    if ((typeof window === "undefined" ? "undefined" : _typeof_1(window)) === "object" && _typeof_1(window.document) === "object") {
      window.Chance = Chance;
      window.chance = new Chance();
    }
  })();
});

var chance$1 = new chance_1();
function enCodeToken(token) {
  var key = chance$1.string({
    length: 6
  });
  var tempToken = cryptoJs.AES.encrypt(token, key).toString();
  var enToken = "".concat(tempToken).concat(key);
  return enToken;
}
function getToken(enToken) {
  var key = enToken.substr(-6);
  var tempToken = enToken.substr(0, enToken.length - 6);
  var realToken = cryptoJs.AES.decrypt(tempToken, key).toString(cryptoJs.enc.Utf8);
  return realToken;
}

export default cryptoJs;
export { chance$1 as chance, enCodeToken, getToken };
