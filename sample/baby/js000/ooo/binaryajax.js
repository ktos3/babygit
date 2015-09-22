/**
 * このスクリプトは Jacob Seidelin 氏によって開発された Binary Ajax 0.1.7 を改変したものです。
 * 元のライセンスにしたがい、MPL として公開します。
 *
 * Binary Ajax 0.1.7 ( 改 )
 * Copyright (c) 2010 Akabeko, http://akabeko.sakura.ne.jp/
 * Licensed under the MPL License.
 *
 * Original Comment:
 * Binary Ajax 0.1.7
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */

/**
 * バイト配列からのデータ読み込みを行います。
 *
 * @param	dataValue	バイト配列。
 * @param	dataOffset	読み込みを開始する位置。
 * @param	dataLength	バイト配列の長さ。
 */
function BinaryFile( dataValue, dataOffset, dataLength )
{
	/**
	 * バイト配列。
	 */
	var _value = dataValue;

	/**
	 * 読み込みを開始する位置。
	 */
	var _offset = ( dataOffset || 0 );

	/**
	 * バイト配列の長さ。
	 */
	var _length = 0;

	if( typeof( _value ) == "string" )
	{
		_length = dataLength || _value.length;

		/**
		 * 8 ビット整数を取得します。
		 *
		 * @param	offset	取得を開始する位置。
		 *
		 * @return	8 ビット整数値。
		 */
		this.getByteAt = function( offset )
		{
			return _value.charCodeAt( offset + dataOffset ) & 0xFF;
		};
	}
	else if( typeof( _value ) == "unknown" )
	{
		_length = dataLength || IEBinary_getLength( _value );

		/**
		 * 8 ビット整数を取得します。
		 *
		 * @param	offset	取得を開始する位置。
		 *
		 * @return	8 ビット整数値。
		 */
		this.getByteAt = function( offset )
		{
			return IEBinary_getByteAt( _value, offset + _offset );
		};
	}

	/**
	 * 元のデータを取得します。
	 *
	 * @return	データ。
	 */
	this.getRawData = function()
	{
		return _value;
	};

	/**
	 * データの長さを取得します。
	 *
	 * @return	長さ。
	 */
	this.getLength = function()
	{
		return _length;
	};


	/**
	 * 符号付き 8 ビット整数を取得します。
	 *
	 * @param	offset	取得を開始する位置。
	 *
	 * @return	符号付き 8 ビット整数値。
	 */
	this.getSByteAt = function( offset )
	{
		var value = this.getByteAt( offset );
		return ( value > 127 ? value - 256 : value );
	};

	/**
	 * 16 ビット整数を取得します。
	 *
	 * @param	offset		取得を開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	16 ビット整数値。
	 */
	this.getShortAt = function( offset, isBigEndian )
	{
		var value = isBigEndian ?
				( this.getByteAt( offset     ) << 8 ) + this.getByteAt( offset + 1 ) :
				( this.getByteAt( offset + 1 ) << 8 ) + this.getByteAt( offset     );
		return ( value < 0 ? value + 65536 : value );
	};

	/**
	 * 符号付き 16 ビット整数を取得します。
	 *
	 * @param	offset		取得を開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	符号付き 16 ビット整数値。
	 */
	this.getSShortAt = function( offset, isBigEndian )
	{
		var value = this.getShortAt( offset, isBigEndian );
		return ( value > 32767 ? value - 65536 : value );
	};

	/**
	 * 32 ビット整数を取得します。
	 *
	 * @param	offset		取得を開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	32 ビット整数値。
	 */
	this.getLongAt = function( offset, isBigEndian )
	{
		var byte1 = this.getByteAt( offset     ),
			byte2 = this.getByteAt( offset + 1 ),
			byte3 = this.getByteAt( offset + 2 ),
			byte4 = this.getByteAt( offset + 3 );

		var value = isBigEndian ?
				( ( ( ( ( byte1 << 8 ) + byte2 ) << 8 ) + byte3 ) << 8 ) + byte4:
				( ( ( ( ( byte4 << 8 ) + byte3 ) << 8 ) + byte2 ) << 8 ) + byte1;

		return ( value < 0 ? value + 4294967296 : value );
	};

	/**
	 * 符号付き 32 ビット整数を取得します。
	 *
	 * @param	offset		取得を開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	符号付き 32 ビット整数値。
	 */
	this.getSLongAt = function( offset, isBigEndian )
	{
		var value = this.getLongAt(offset, isBigEndian);
		return ( value > 2147483647 ? value - 4294967296 : value );
	};

	/**
	 * 文字列を取得します。
	 *
	 * @param	offset	取得を開始する位置。
	 *
	 * @return	文字列。
	 */
	this.getStringAt = function( offset, length )
	{
		var value = [];
		for( var i = offset, j = 0; i < offset + length; ++i, ++j )
		{
			value[ j ] = String.fromCharCode( this.getByteAt( i ) );
		}

		return value.join( "" );
	};

	/**
	 * 文字を取得します。
	 *
	 * @param	offset	取得を開始する位置。
	 *
	 * @return	文字。
	 */
	this.getCharAt = function( offset )
	{
		return String.fromCharCode( this.getByteAt( offset ) );
	};

	/**
	 * データを Base64 文字列へ変換します。
	 *
	 * @return	変換されたデータ。
	 */
	this.toBase64 = function()
	{
		return window.btoa( _value );
	};

	/**
	 * Base64 文字列からデータを読み込みます。
	 *
	 * @param	value	Base64 文字列。
	 */
	this.fromBase64 = function( value )
	{
		_value = window.atob( value );
	};
}

/**
 * バイナリデータを非同期通信を利用して読み取ります。
 *
 * @param	url		読み込み対象となるファイルを示す URL。
 * @param	onLoad	読み込みが完了した時に呼び出されるコールバック関数。
 * @param	onError	読み込みが失敗した時に呼び出されるコールバック関数。
 * @param	range	データの取得範囲。
 */
function BinaryAjax( url, onLoad, onError, range )
{
	/**
	 * HTTP リクエスト用オブジェクトを生成します。
	 *
	 * @return	成功時はリクエスト用オブジェクト。失敗時は null。
	 */
	function createRequest()
	{
		return ( window.XMLHttpRequest ? new XMLHttpRequest() : ( window.ActiveXObject ? new ActiveXObject( "Microsoft.XMLHTTP" ) : null ) );
	}

	/**
	 * HTTP ヘッダを取得します。
	 *
	 * @param	url		ヘッダの取得先を示す URL。
	 * @param	onLoad	ヘッダの取得が完了した時に呼び出されるコールバック関数。
	 * @param	onError	ヘッダの取得が失敗した時に呼び出されるコールバック関数。
	 */
	function getHead( url, onLoad, onError )
	{
		var http = createRequest();
		if( http == null ) { if( onError ) { onError(); } return; }

		if( onLoad )
		{
			if( typeof( http.onload ) != "undefined" )
			{
				http.onload = function()
				{
					if( http.status == "200" )
					{
						onLoad( this );
					}
					else if( onError )
					{
						onError();
					}

					http = null;
				};
			}
			else
			{
				http.onreadystatechange = function()
				{
					if( http.readyState == 4 )
					{
						if( http.status == "200" )
						{
							onLoad( this );
						}
						else if( onError )
						{
							onError();
						}

						http = null;
					}
				};
			}
		}

		http.open( "HEAD", url, true );
		http.send( null );
	}

	/**
	 * HTTP リクエストを送信します。
	 *
	 * @param	url				送信先を示す URL。
	 * @param	onLoad			送信が完了した時に呼び出されるコールバック関数。
	 * @param	onError			送信が失敗した時に呼び出されるコールバック関数。
	 * @param	range			データの取得範囲。
	 * @param	isAcceptRanges	データの取得範囲を指定する場合は true。それ以外は false。
	 * @param	fileSize		ファイルのサイズ。
	 */
	function sendRequest( url, onLoad, onError, range, isAcceptRanges, fileSize )
	{
		var http = createRequest();
		if( http == null ) { if( onError ) { onError(); } return; }

		var offset = ( range && !isAcceptRanges ? range[ 0 ]                  : 0 );
		var length = ( range                    ? range[ 1 ] - range[ 0 ] + 1 : 0 );

		if( onLoad )
		{
			if( typeof( http.onload ) != "undefined" )
			{
				http.onload = function()
				{
					if( http.status == "200" || http.status == "206" || http.status == "0" )
					{
						http.binaryResponse = new BinaryFile( http.responseText, offset, length );
						http.fileSize       = fileSize || http.getResponseHeader( "Content-Length" );
						onLoad( http );
					}
					else if( onError )
					{
						onError();
					}
					http = null;
				};
			}
			else
			{
				http.onreadystatechange = function()
				{
					if( http.readyState == 4 )
					{
						if( http.status == "200" || http.status == "206" || http.status == "0" )
						{
							// IE6 craps if we try to extend the XHR object
							var response =
							{
								status         : http.status,
								binaryResponse : new BinaryFile( http.responseBody, offset, length ),
								fileSize       : fileSize || http.getResponseHeader( "Content-Length" )
							};

							onLoad( response );
						}
						else if( onError )
						{
							onError();
						}

						http = null;
					}
				};
			}
		}

		http.open( "GET", url, true );

		if( http.overrideMimeType )
		{
			http.overrideMimeType( "text/plain; charset=x-user-defined" );
		}

		if( range && isAcceptRanges )
		{
			http.setRequestHeader( "Range", "bytes=" + range[ 0 ] + "-" + range[ 1 ] );
		}

		http.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT" );
		http.send( null );
	}

	/**
	 * バイナリデータの非同期読み込みを開始します。
	 *
	 * @param	url		読み込み対象となるファイルを示す URL。
	 * @param	onLoad	読み込みが完了した時に呼び出されるコールバック関数。
	 * @param	onError	読み込みが失敗した時に呼び出されるコールバック関数。
	 * @param	range	データの取得範囲。
	 */
	function beginLoad( url, onLoad, onError, range )
	{
		if( range )
		{
			getHead(
				url,

				function( http )
				{
					var length       = parseInt( http.getResponseHeader( "Content-Length" ), 10 );
					var acceptRanges = http.getResponseHeader( "Accept-Ranges" );
					var begin        = ( range[ 0 ] < 0 ? range[ 0 ] + length : range[ 0 ] );
					var end          = begin + range[ 1 ] - 1;

					sendRequest( url, onLoad, onError, [ begin, end ], ( acceptRanges == "bytes" ), length );
				}
			);

		}
		else
		{
			sendRequest( url, onLoad, onError );
		}
	}

	// 通信開始
	beginLoad( url, onLoad, onError, range );
}

document.write(
		"<script type='text/vbscript'>\r\n"
		+ "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
		+ "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
		+ "End Function\r\n"
		+ "Function IEBinary_getLength(strBinary)\r\n"
		+ "	IEBinary_getLength = LenB(strBinary)\r\n"
		+ "End Function\r\n"
		+ "</script>\r\n"
	);
