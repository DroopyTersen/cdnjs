/*
 * js-sha256 v0.1.3
 * https://github.com/emn178/js-sha256
 *
 * Copyright 2014-2015, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function(root, undefined) {
  'use strict';

  var HEX_CHARS = '0123456789abcdef'.split('');

  var K =[0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
          0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
          0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
          0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
          0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
          0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
          0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
          0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  var sha256 = function(message, asciiOnly) {
    return sha2(message, true, asciiOnly);
  };

  var sha224 = function(message, asciiOnly) {
    return sha2(message, false, asciiOnly);
  };

  var sha2 = function(message, is256, asciiOnly) {
    if(is256 === undefined) {
      is256 = true;
    }

    var chunks, h0, h1, h2, h3, h4, h5, h6, h7;
    if(!asciiOnly && /[^\x00-\x7F]/.test(message)) {
      chunks = getChunksFromUtf8(message);
    } else {
      chunks = getChunksFromAscii(message);
    }
    if(is256) {
      h0 = 0x6a09e667;
      h1 = 0xbb67ae85;
      h2 = 0x3c6ef372;
      h3 = 0xa54ff53a;
      h4 = 0x510e527f;
      h5 = 0x9b05688c;
      h6 = 0x1f83d9ab;
      h7 = 0x5be0cd19;
    } else { // 224
      h0 = 0xc1059ed8;
      h1 = 0x367cd507;
      h2 = 0x3070dd17;
      h3 = 0xf70e5939;
      h4 = 0xffc00b31;
      h5 = 0x68581511;
      h6 = 0x64f98fa7;
      h7 = 0xbefa4fa4;
    }

    for(var i = 0, length = chunks.length;i < length;++i) {
      var w = chunks[i], s0, s1, j, tmp1, tmp2, tmp3, maj, t1, t2, ch, 
          a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

      for(j = 16;j < 64;++j) {
        // rightrotate
        tmp1 = tmp2 = w[j - 15];
        tmp1 = (tmp1 >>> 7) | (tmp1 << 25);
        tmp2 = (tmp2 >>> 18) | (tmp2 << 14);
        s0 = tmp1 ^ tmp2 ^ (w[j - 15] >>> 3);
        tmp1 = tmp2 = w[j - 2];
        tmp1 = (tmp1 >>> 17) | (tmp1 << 15);
        tmp2 = (tmp2 >>> 19) | (tmp2 << 13);
        s1 = tmp1 ^ tmp2 ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) << 0;
      }

      for(j = 0;j < 64;j += 4) {
        tmp1 = (a >>> 2) | (a << 30);
        tmp2 = (a >>> 13) | (a << 19);
        tmp3 = (a >>> 22) | (a << 10);
        s0 = tmp1 ^ tmp2 ^ tmp3;
        tmp1 = (e >>> 6) | (e << 26);
        tmp2 = (e >>> 11) | (e << 21);
        tmp3 = (e >>> 25) | (e << 7);
        s1 = tmp1 ^ tmp2 ^ tmp3;
        maj = (a & b) ^ (a & c) ^ (b & c);
        ch = (e & f) ^ (~e & g);
        t1 = (h + s1 + ch + K[j + 0] + w[j + 0]) << 0;
        t2 = (s0 + maj) << 0;
        h = (d + t1) << 0;
        d = (t1 + t2) << 0;
        tmp1 = (d >>> 2) | (d << 30);
        tmp2 = (d >>> 13) | (d << 19);
        tmp3 = (d >>> 22) | (d << 10);
        s0 = tmp1 ^ tmp2 ^ tmp3;
        tmp1 = (h >>> 6) | (h << 26);
        tmp2 = (h >>> 11) | (h << 21);
        tmp3 = (h >>> 25) | (h << 7);
        s1 = tmp1 ^ tmp2 ^ tmp3;
        maj = (d & a) ^ (d & b) ^ (a & b);
        ch = (h & e) ^ (~h & f);
        t1 = (g + s1 + ch + K[j + 1] + w[j + 1]) << 0;
        t2 = (s0 + maj) << 0;
        g = (c + t1) << 0;
        c = (t1 + t2) << 0;
        tmp1 = (c >>> 2) | (c << 30);
        tmp2 = (c >>> 13) | (c << 19);
        tmp3 = (c >>> 22) | (c << 10);
        s0 = tmp1 ^ tmp2 ^ tmp3;
        tmp1 = (g >>> 6) | (g << 26);
        tmp2 = (g >>> 11) | (g << 21);
        tmp3 = (g >>> 25) | (g << 7);
        s1 = tmp1 ^ tmp2 ^ tmp3;
        maj = (c & d) ^ (c & a) ^ (d & a);
        ch = (g & h) ^ (~g & e);
        t1 = (f + s1 + ch + K[j + 2] + w[j + 2]) << 0;
        t2 = (s0 + maj) << 0;
        f = (b + t1) << 0;
        b = (t1 + t2) << 0;
        tmp1 = (b >>> 2) | (b << 30);
        tmp2 = (b >>> 13) | (b << 19);
        tmp3 = (b >>> 22) | (b << 10);
        s0 = tmp1 ^ tmp2 ^ tmp3;
        tmp1 = (f >>> 6) | (f << 26);
        tmp2 = (f >>> 11) | (f << 21);
        tmp3 = (f >>> 25) | (f << 7);
        s1 = tmp1 ^ tmp2 ^ tmp3;
        maj = (b & c) ^ (b & d) ^ (c & d);
        ch = (f & g) ^ (~f & h);
        t1 = (e + s1 + ch + K[j + 3] + w[j + 3]) << 0;
        t2 = (s0 + maj) << 0;
        e = (a + t1) << 0;
        a = (t1 + t2) << 0;
      }

      h0 = (h0 + a) << 0;
      h1 = (h1 + b) << 0;
      h2 = (h2 + c) << 0;
      h3 = (h3 + d) << 0;
      h4 = (h4 + e) << 0;
      h5 = (h5 + f) << 0;
      h6 = (h6 + g) << 0;
      h7 = (h7 + h) << 0;
    }

    var hex = toHexString(h0) + toHexString(h1)+ toHexString(h2) + toHexString(h3) + toHexString(h4) + toHexString(h5) + toHexString(h6);
    if(is256) {
      hex += toHexString(h7);
    }
    return hex;
  };

  var toHexString = function(num) {
    var hex = '';
    for(var i = 0; i < 4; i++) {
      var offset = 3 - i << 3;
      hex += HEX_CHARS[(num >> (offset + 4)) & 0x0F] + HEX_CHARS[(num >> offset) & 0x0F];
    }
    return hex;
  };
  
  var getBytesFromUtf8 = function(str) {
    var bytes = [], index = 0;
    for (var i = 0;i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        bytes[index++] = c;
      } else if (c < 0x800) {
        bytes[index++] = 0xc0 | (c >> 6);
        bytes[index++] = 0x80 | (c & 0x3f);
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes[index++] = 0xe0 | (c >> 12);
        bytes[index++] = 0x80 | ((c >> 6) & 0x3f);
        bytes[index++] = 0x80 | (c & 0x3f);
      } else {
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
        bytes[index++] = 0xf0 | (c >> 18);
        bytes[index++] = 0x80 | ((c >> 12) & 0x3f);
        bytes[index++] = 0x80 | ((c >> 6) & 0x3f);
        bytes[index++] = 0x80 | (c & 0x3f);
      }
    }
    return bytes;
  };

  var getChunksFromAscii = function(message) {
    // a block is 32 bits(4 bytes), a chunk is 512 bits(64 bytes)
    var length = message.length;
    var chunkCount = ((length + 8) >> 6) + 1;
    var chunks = [], blocks, i;
    for(i = 0;i < chunkCount;++i) {
      chunks[i] = blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    for(i = 0;i < length;++i) {
      blocks = chunks[i >> 6];
      blocks[(i & 63) >> 2] |= message.charCodeAt(i) << (3 - (i & 3) << 3);
    }
    blocks[(i & 63) >> 2] |= 0x80 << (3 - (i & 3) << 3);
    blocks[15] = length << 3; // length * 8
    return chunks;
  };

  var getChunksFromUtf8 = function(message) {
    // a block is 32 bits(4 bytes), a chunk is 512 bits(64 bytes)
    var bytes = getBytesFromUtf8(message);
    var length = bytes.length;
    var chunkCount = ((length + 8) >> 6) + 1;
    var chunks = [], blocks, i;
    for(i = 0;i < chunkCount;++i) {
      chunks[i] = blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    for(i = 0;i < length;++i) {
      blocks = chunks[i >> 6];
      blocks[(i & 63) >> 2] |= bytes[i] << (3 - (i & 3) << 3);
    }
    blocks[(i & 63) >> 2] |= 0x80 << (3 - (i & 3) << 3);
    blocks[15] = length << 3; // length * 8
    return chunks;
  };

  if(typeof(module) != 'undefined') {
    sha256.sha256 = sha256;
    sha256.sha224 = sha224;
    module.exports = sha256;
  } else if(root) {
    root.sha256 = sha256;
    root.sha224 = sha224;
  }
}(this));
