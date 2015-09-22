/**
 * このスクリプトは Jacob Seidelin 氏によって開発された Javascript EXIF Reader 0.1.4 を改変したものです。
 * 元のライセンスにしたがい、MPL として公開します。
 *
 * Javascript EXIF Reader ( 改 ) 1.0
 * Copyright (c) 2010 Akabeko, http://akabeko.sakura.ne.jp/
 * Licensed under the MPL License.
 *
 * Original Comment:
 * Javascript EXIF Reader 0.1.4
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */

/**
 * EXIF 情報を読み取ります。
 *
 * @param	image	イメージ オブジェクト。
 */
function Exif( image )
{
	/**
	 * イメージ オブジェクト。
	 */
	var _image = image;

	/**
	 * 読み込みが完了していることを示す値。
	 */
	var _isLoaded = false;

	/**
	 * デバッグ モードであることを示す値。
	 */
	var _isDebug = false;

	/**
	 * EXIF のタグ定義テーブルを取得します。
	 *
	 * @return	テーブル。
	 */
	var getTags = ( function()
	{
		var tags =
		{
			// version tags
			0x9000 : "ExifVersion",			// EXIF version
			0xA000 : "FlashpixVersion",		// Flashpix format version

			// colorspace tags
			0xA001 : "ColorSpace",			// Color space information tag

			// image configuration
			0xA002 : "PixelXDimension",		// Valid width of meaningful image
			0xA003 : "PixelYDimension",		// Valid height of meaningful image
			0x9101 : "ComponentsConfiguration",	// Information about channels
			0x9102 : "CompressedBitsPerPixel",	// Compressed bits per pixel

			// user information
			0x927C : "MakerNote",			// Any desired information written by the manufacturer
			0x9286 : "UserComment",			// Comments by user

			// related file
			0xA004 : "RelatedSoundFile",		// Name of related sound file

			// date and time
			0x9003 : "DateTimeOriginal",		// Date and time when the original image was generated
			0x9004 : "DateTimeDigitized",		// Date and time when the image was stored digitally
			0x9290 : "SubsecTime",			// Fractions of seconds for DateTime
			0x9291 : "SubsecTimeOriginal",		// Fractions of seconds for DateTimeOriginal
			0x9292 : "SubsecTimeDigitized",		// Fractions of seconds for DateTimeDigitized

			// picture-taking conditions
			0x829A : "ExposureTime",		// Exposure time (in seconds)
			0x829D : "FNumber",			// F number
			0x8822 : "ExposureProgram",		// Exposure program
			0x8824 : "SpectralSensitivity",		// Spectral sensitivity
			0x8827 : "ISOSpeedRatings",		// ISO speed rating
			0x8828 : "OECF",			// Optoelectric conversion factor
			0x9201 : "ShutterSpeedValue",		// Shutter speed
			0x9202 : "ApertureValue",		// Lens aperture
			0x9203 : "BrightnessValue",		// Value of brightness
			0x9204 : "ExposureBias",		// Exposure bias
			0x9205 : "MaxApertureValue",		// Smallest F number of lens
			0x9206 : "SubjectDistance",		// Distance to subject in meters
			0x9207 : "MeteringMode", 		// Metering mode
			0x9208 : "LightSource",			// Kind of light source
			0x9209 : "Flash",			// Flash status
			0x9214 : "SubjectArea",			// Location and area of main subject
			0x920A : "FocalLength",			// Focal length of the lens in mm
			0xA20B : "FlashEnergy",			// Strobe energy in BCPS
			0xA20C : "SpatialFrequencyResponse",	//
			0xA20E : "FocalPlaneXResolution", 	// Number of pixels in width direction per FocalPlaneResolutionUnit
			0xA20F : "FocalPlaneYResolution", 	// Number of pixels in height direction per FocalPlaneResolutionUnit
			0xA210 : "FocalPlaneResolutionUnit", 	// Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
			0xA214 : "SubjectLocation",		// Location of subject in image
			0xA215 : "ExposureIndex",		// Exposure index selected on camera
			0xA217 : "SensingMethod", 		// Image sensor type
			0xA300 : "FileSource", 			// Image source (3 == DSC)
			0xA301 : "SceneType", 			// Scene type (1 == directly photographed)
			0xA302 : "CFAPattern",			// Color filter array geometric pattern
			0xA401 : "CustomRendered",		// Special processing
			0xA402 : "ExposureMode",		// Exposure mode
			0xA403 : "WhiteBalance",		// 1 = auto white balance, 2 = manual
			0xA404 : "DigitalZoomRation",		// Digital zoom ratio
			0xA405 : "FocalLengthIn35mmFilm",	// Equivalent foacl length assuming 35mm film camera (in mm)
			0xA406 : "SceneCaptureType",		// Type of scene
			0xA407 : "GainControl",			// Degree of overall image gain adjustment
			0xA408 : "Contrast",			// Direction of contrast processing applied by camera
			0xA409 : "Saturation", 			// Direction of saturation processing applied by camera
			0xA40A : "Sharpness",			// Direction of sharpness processing applied by camera
			0xA40B : "DeviceSettingDescription",	//
			0xA40C : "SubjectDistanceRange",	// Distance to subject

			// other tags
			0xA005 : "InteroperabilityIFDPointer",
			0xA420 : "ImageUniqueID"		// Identifier assigned uniquely to each image
		};

		return function(){ return tags; };
	})();

	/**
	 * TIFF のタグ定義テーブルを取得します。
	 *
	 * @return	テーブル。
	 */
	var getTagsTiff = ( function()
	{
		var tags =
		{
			0x0100 : "ImageWidth",
			0x0101 : "ImageHeight",
			0x8769 : "ExifIFDPointer",
			0x8825 : "GPSInfoIFDPointer",
			0xA005 : "InteroperabilityIFDPointer",
			0x0102 : "BitsPerSample",
			0x0103 : "Compression",
			0x0106 : "PhotometricInterpretation",
			0x0112 : "Orientation",
			0x0115 : "SamplesPerPixel",
			0x011C : "PlanarConfiguration",
			0x0212 : "YCbCrSubSampling",
			0x0213 : "YCbCrPositioning",
			0x011A : "XResolution",
			0x011B : "YResolution",
			0x0128 : "ResolutionUnit",
			0x0111 : "StripOffsets",
			0x0116 : "RowsPerStrip",
			0x0117 : "StripByteCounts",
			0x0201 : "JPEGInterchangeFormat",
			0x0202 : "JPEGInterchangeFormatLength",
			0x012D : "TransferFunction",
			0x013E : "WhitePoint",
			0x013F : "PrimaryChromaticities",
			0x0211 : "YCbCrCoefficients",
			0x0214 : "ReferenceBlackWhite",
			0x0132 : "DateTime",
			0x010E : "ImageDescription",
			0x010F : "Make",
			0x0110 : "Model",
			0x0131 : "Software",
			0x013B : "Artist",
			0x8298 : "Copyright"
		};

		return function(){ return tags; };
	})();

	/**
	 * TIFF のタグ定義テーブルを取得します。
	 *
	 * @return	テーブル。
	 */
	var getTagsGps = ( function()
	{
		var tags =
		{
			0x0000 : "GPSVersionID",
			0x0001 : "GPSLatitudeRef",
			0x0002 : "GPSLatitude",
			0x0003 : "GPSLongitudeRef",
			0x0004 : "GPSLongitude",
			0x0005 : "GPSAltitudeRef",
			0x0006 : "GPSAltitude",
			0x0007 : "GPSTimeStamp",
			0x0008 : "GPSSatellites",
			0x0009 : "GPSStatus",
			0x000A : "GPSMeasureMode",
			0x000B : "GPSDOP",
			0x000C : "GPSSpeedRef",
			0x000D : "GPSSpeed",
			0x000E : "GPSTrackRef",
			0x000F : "GPSTrack",
			0x0010 : "GPSImgDirectionRef",
			0x0011 : "GPSImgDirection",
			0x0012 : "GPSMapDatum",
			0x0013 : "GPSDestLatitudeRef",
			0x0014 : "GPSDestLatitude",
			0x0015 : "GPSDestLongitudeRef",
			0x0016 : "GPSDestLongitude",
			0x0017 : "GPSDestBearingRef",
			0x0018 : "GPSDestBearing",
			0x0019 : "GPSDestDistanceRef",
			0x001A : "GPSDestDistance",
			0x001B : "GPSProcessingMethod",
			0x001C : "GPSAreaInformation",
			0x001D : "GPSDateStamp",
			0x001E : "GPSDifferential"
		};

		return function(){ return tags; };
	})();

	/**
	 * 文字列の値定義テーブルを取得します。
	 *
	 * @return	テーブル。
	 */
	var getStringValues = ( function()
	{
		var values =
		{
			ExposureProgram :
			{
				0 : "Not defined",
				1 : "Manual",
				2 : "Normal program",
				3 : "Aperture priority",
				4 : "Shutter priority",
				5 : "Creative program",
				6 : "Action program",
				7 : "Portrait mode",
				8 : "Landscape mode"
			},

			MeteringMode :
			{
				0 : "Unknown",
				1 : "Average",
				2 : "CenterWeightedAverage",
				3 : "Spot",
				4 : "MultiSpot",
				5 : "Pattern",
				6 : "Partial",
				255 : "Other"
			},

			LightSource :
			{
				0 : "Unknown",
				1 : "Daylight",
				2 : "Fluorescent",
				3 : "Tungsten (incandescent light)",
				4 : "Flash",
				9 : "Fine weather",
				10 : "Cloudy weather",
				11 : "Shade",
				12 : "Daylight fluorescent (D 5700 - 7100K)",
				13 : "Day white fluorescent (N 4600 - 5400K)",
				14 : "Cool white fluorescent (W 3900 - 4500K)",
				15 : "White fluorescent (WW 3200 - 3700K)",
				17 : "Standard light A",
				18 : "Standard light B",
				19 : "Standard light C",
				20 : "D55",
				21 : "D65",
				22 : "D75",
				23 : "D50",
				24 : "ISO studio tungsten",
				255 : "Other"
			},

			Flash :
			{
				0x0000 : "Flash did not fire",
				0x0001 : "Flash fired",
				0x0005 : "Strobe return light not detected",
				0x0007 : "Strobe return light detected",
				0x0009 : "Flash fired, compulsory flash mode",
				0x000D : "Flash fired, compulsory flash mode, return light not detected",
				0x000F : "Flash fired, compulsory flash mode, return light detected",
				0x0010 : "Flash did not fire, compulsory flash mode",
				0x0018 : "Flash did not fire, auto mode",
				0x0019 : "Flash fired, auto mode",
				0x001D : "Flash fired, auto mode, return light not detected",
				0x001F : "Flash fired, auto mode, return light detected",
				0x0020 : "No flash function",
				0x0041 : "Flash fired, red-eye reduction mode",
				0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
				0x0047 : "Flash fired, red-eye reduction mode, return light detected",
				0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
				0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
				0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
				0x0059 : "Flash fired, auto mode, red-eye reduction mode",
				0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
				0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
			},

			SensingMethod :
			{
				1 : "Not defined",
				2 : "One-chip color area sensor",
				3 : "Two-chip color area sensor",
				4 : "Three-chip color area sensor",
				5 : "Color sequential area sensor",
				7 : "Trilinear sensor",
				8 : "Color sequential linear sensor"
			},

			SceneCaptureType :
			{
				0 : "Standard",
				1 : "Landscape",
				2 : "Portrait",
				3 : "Night scene"
			},

			SceneType :
			{
				1 : "Directly photographed"
			},

			CustomRendered :
			{
				0 : "Normal process",
				1 : "Custom process"
			},

			WhiteBalance :
			{
				0 : "Auto white balance",
				1 : "Manual white balance"
			},

			GainControl :
			{
				0 : "None",
				1 : "Low gain up",
				2 : "High gain up",
				3 : "Low gain down",
				4 : "High gain down"
			},

			Contrast :
			{
				0 : "Normal",
				1 : "Soft",
				2 : "Hard"
			},

			Saturation :
			{
				0 : "Normal",
				1 : "Low saturation",
				2 : "High saturation"
			},

			Sharpness :
			{
				0 : "Normal",
				1 : "Soft",
				2 : "Hard"
			},

			SubjectDistanceRange :
			{
				0 : "Unknown",
				1 : "Macro",
				2 : "Close view",
				3 : "Distant view"
			},

			FileSource :
			{
				3 : "DSC"
			},

			Components :
			{
				0 : "",
				1 : "Y",
				2 : "Cb",
				3 : "Cr",
				4 : "R",
				5 : "G",
				6 : "B"
			}
		};

		return function(){ return values; };
	})();

	/**
	 * イメージ オブジェクトが EXIF 情報を所有していることを調べます。
	 *
	 * @return	所有している場合は true。それ以外は false。
	 */
	function hasData()
	{
		return !!( _image.exifdata );
	}

	/**
	 * JPEG ファイルから EXIF 情報を取得します。
	 *
	 * @param	image	イメージ オブジェクト。
	 *
	 * @return	成功時は EXIF 情報。それ以外は false。
	 */
	function getExifFromJpeg( file )
	{
		if( file.getByteAt( 0 ) != 0xFF || file.getByteAt( 1 ) != 0xD8 ) { return false; }

		var offset = 2;
		var length = file.getLength();
		while( offset < length )
		{
			if( file.getByteAt( offset ) != 0xFF )
			{
				if( _isDebug ) { console.log( "Not a valid marker at offset " + offset + ", found: " + file.getByteAt( offset ) ); }
				return false; // not a valid marker, something is wrong
			}

			// we could implement handling for other markers here, but we're only looking for 0xFFE1 for EXIF data
			var marker = file.getByteAt( offset + 1 );
			if( marker == 22400 || marker == 225 )
			{
				// 0xE1 = Application-specific 1 (for EXIF)
				if( _isDebug ) { console.log( "Found 0xFFE1 marker" ); }
				return readExif( file, offset + 4, file.getShortAt( offset + 2, true ) - 2 );
			}
			else
			{
				offset += 2 + file.getShortAt( offset + 2, true );
			}
		}

		return false;
	}

	/**
	 * タグ情報を取得します。
	 *
	 * @param	file		読み込み対象となるファイル オブジェクト。
	 * @param	tiffStart	TIFF 情報の開始位置。
	 * @param	offset		読み込みを開始する位置。
	 * @param	values		読み込む値名のテーブル。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	タグ情報。
	 */
	function readTags( file, tiffStart, offset, values, isBigEndian )
	{
		var entries = file.getShortAt( offset, isBigEndian );
		var tags    = {};

		for( var i = 0; i < entries; ++i )
		{
			var entryOffset = offset + i * 12 + 2;
			var tag         = values[ file.getShortAt( entryOffset, isBigEndian ) ];

			if( _isDebug ) { console.log( "Unknown tag: " + file.getShortAt( entryOffset, isBigEndian ) ); }
			tags[ tag ] = readTagValue( file, tiffStart, entryOffset, isBigEndian );
		}

		return tags;
	}

	/**
	 * 配列となるタグの内容を取得します。
	 *
	 * @param	reader		読み取りをおこなう関数。
	 * @param	count		値の数。
	 * @param	position	値の読み込みを開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	タグ情報。
	 */
	function readTagValueRational( reader, count, position, isBigEndian )
	{
		if( count == 1 ) { return reader( position, isBigEndian ) / reader( position + 4, isBigEndian ); }

		var values = [];
		for( var i = 0; i < count; ++i )
		{
			values[ i ] = reader( position + ( i * 8 ), isBigEndian ) / reader( position + 4 + ( i * 8 ), isBigEndian );
		}

		return values;
	}

	/**
	 * タグの値を取得します。
	 *
	 * @param	file		読み込み対象となるファイル オブジェクト。
	 * @param	tiffStart	TIFF 情報の開始位置。
	 * @param	offset		読み込みを開始する位置。
	 * @param	isBigEndian	バイト オーダーがビッグ エンディアンの場合は true。それ以外は false。
	 *
	 * @return	タグ情報。
	 */
	function readTagValue( file, tiffStart, offset, isBigEndian )
	{
		var type        = file.getShortAt( offset + 2, isBigEndian );
		var count  = file.getLongAt( offset + 4, isBigEndian );
		var valueOffset = file.getLongAt( offset + 8, isBigEndian ) + tiffStart;

		switch( type )
		{
		case 1: // byte, 8-bit unsigned int
		case 7: // undefined, 8-bit byte, value depending on field
			if( count == 1 )
			{
				return file.getByteAt( offset + 8, isBigEndian );
			}
			else
			{
				var position = ( count > 4 ? valueOffset : offset + 8 );
				var values   = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getByteAt( position + i );
				}

				return values;
			}
			break;

		case 2: // ascii, 8-bit byte
			return file.getStringAt( ( count > 4 ? valueOffset : offset + 8 ), count - 1 );

		case 3: // short, 16 bit int
			if( count == 1 )
			{
				return file.getShortAt( offset + 8, isBigEndian );
			}
			else
			{
				var position = ( count > 2 ? valueOffset : offset + 8 );
				var values   = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getShortAt( position + ( i * 2 ) );
				}

				return values;
			}
			break;

		case 4: // long, 32 bit int
			if( count == 1 )
			{
				return file.getLongAt( offset + 8, isBigEndian );
			}
			else
			{
				var values   = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getLongAt( valueOffset + ( i * 4 ) );
				}

				return values;
			}
			break;

		case 5:	// rational = two long values, first is numerator, second is denominator
			if( count == 1 )
			{
				return file.getLongAt( valueOffset, isBigEndian ) / file.getLongAt( valueOffset + 4, isBigEndian );
			}
			else
			{
				var values = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getLongAt( valueOffset +  ( i * 8 ), isBigEndian ) / file.getLongAt( valueOffset+ 4 + ( i * 8 ), isBigEndian );
				}

				return values;
			}
			break;

		case 9: // slong, 32 bit signed int
			if( count == 1 )
			{
				return file.getSLongAt( offset + 8, isBigEndian );
			}
			else
			{
				var values   = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getSLongAt( valueOffset + ( i * 4 ) );
				}

				return values;
			}
			break;

		case 10: // signed rational, two slongs, first is numerator, second is denominator
			if( count == 1 )
			{
				return file.getLongAt( valueOffset, isBigEndian ) / file.getLongAt( valueOffset + 4, isBigEndian );
			}
			else
			{
				var values = [];
				for( var i = 0; i < count; ++i )
				{
					values[ i ] = file.getSLongAt( valueOffset +  ( i * 8 ), isBigEndian ) / file.getSLongAt( valueOffset+ 4 + ( i * 8 ), isBigEndian );
				}

				return values;
			}
			break;
		}
	}

	/**
	 * EXIF 情報を読み取ります。
	 *
	 * @param	file	読み取り対象となるファイルオブジェクト。
	 * @param	start	読み取りを開始する位置。
	 * @param	length	読み取る長さ。
	 *
	 * @return	成功時はタグ情報。それ以外は false。
	 */
	function readExif( file, start, length )
	{
		if( file.getStringAt( start, 4 ) != "Exif" )
		{
			if( _isDebug ) { console.log( "Not valid EXIF data! " + file.getStringAt( start, 4 ) ); }
			return false;
		}

		// test for TIFF validity and endianness
		var tiffStart  = start + 6;
		var isBigEndian;
		if( file.getShortAt( tiffStart ) == 0x4949)
		{
			isBigEndian = false;
		}
		else if( file.getShortAt( tiffStart ) == 0x4D4D )
		{
			isBigEndian = true;
		}
		else
		{
			if( _isDebug) { console.log( "Not valid TIFF data! (no 0x4949 or 0x4D4D)" ); }
			return false;
		}

		if( file.getShortAt( tiffStart + 2, isBigEndian ) != 0x002A )
		{
			if( _isDebug) { console.log( "Not valid TIFF data! (no 0x002A)" ); }
			return false;
		}

		if( file.getLongAt( tiffStart + 4, isBigEndian ) != 0x00000008 )
		{
			if( _isDebug) { console.log( "Not valid TIFF data! (First offset not 8)", file.getShortAt( tiffStart + 4, isBigEndian ) ); }
			return false;
		}

		var tags = readTags( file, tiffStart, tiffStart + 8, getTagsTiff(), isBigEndian );
		if( tags.ExifIFDPointer )
		{
			var exifTags     = readTags( file, tiffStart, tiffStart + tags.ExifIFDPointer, getTags(), isBigEndian );
			var stringValues = getStringValues();
			for( var tag in exifTags )
			{
				switch( tag )
				{
					case "LightSource" :
					case "Flash" :
					case "MeteringMode" :
					case "ExposureProgram" :
					case "SensingMethod" :
					case "SceneCaptureType" :
					case "SceneType" :
					case "CustomRendered" :
					case "WhiteBalance" :
					case "GainControl" :
					case "Contrast" :
					case "Saturation" :
					case "Sharpness" :
					case "SubjectDistanceRange" :
					case "FileSource" :
						exifTags[ tag ] = stringValues[ tag ][ exifTags[ tag ] ];
						break;

					case "ExifVersion" :
					case "FlashpixVersion" :
						exifTags[ tag ] = String.fromCharCode( exifTags[ tag ][ 0 ], exifTags[ tag ][ 1 ], exifTags[ tag ][ 2 ], exifTags[ tag ][ 3 ] );
						break;

					case "ComponentsConfiguration" :
						exifTags[ tag ] =
							stringValues.Components[ exifTags[ tag ][ 0 ] ] +
						    stringValues.Components[ exifTags[ tag ][ 1 ] ] +
							stringValues.Components[ exifTags[ tag ][ 2 ] ] +
							stringValues.Components[ exifTags[ tag ][ 3 ] ];
						break;
				}

				tags[ tag ] = exifTags[ tag ];
			}
		}

		if( tags.GPSInfoIFDPointer )
		{
			var gpsTags = readTags( file, tiffStart, tiffStart + tags.GPSInfoIFDPointer, getTagsGps(), isBigEndian );
			for( var tag in gpsTags )
			{
				switch( tag )
				{
					case "GPSVersionID" :
						gpsTags[ tag ] =
							gpsTags[ tag ][ 0 ] + "." +
							gpsTags[ tag ][ 1 ] + "." +
							gpsTags[ tag ][ 2 ] + "." +
							gpsTags[ tag ][ 3 ];
						break;
				}

				tags[ tag ] = gpsTags[ tag ];
			}
		}

		return tags;
	}

	/**
	 * データを読み込みます。
	 *
	 * @param	onLoad	取得が完了した時に呼び出されるコールバック関数。
	 *
	 * @return	成功時は true。それ以外は false。
	 */
	this.load = function( onLoad )
	{
		if( !_image.complete || _isLoaded ) { return false; }

		// 多重読み込みを防止
		_isLoaded = true;

		// 非同期読み込み開始
		var image = _image;
		BinaryAjax(
				image.src,

				function( http )
				{
					var exif = getExifFromJpeg( http.binaryResponse );
					image.exifdata = exif || {};
					if( onLoad ) { onLoad(); }
				}
			);

		return true;
	};

	/**
	 * タグ情報を取得します。
	 *
	 * @param	tag		取得するタグ名。
	 *
	 * @return	成功時はタグ情報。それ以外は何も返さない。
	 */
	this.getTag = function( tag )
	{
		if( !hasData() ) { return; }
		return _image.exifdata[ tag ];
	};

	/**
	 * すべてのタグ情報を取得します。
	 *
	 * @return	成功時はタグ情報。それ以外は何も返さない。
	 */
	this.getAllTags = function()
	{
		if( !hasData() ) { return {}; }

		var data = _image.exifdata;
		var tags = {};
		for( var property in data )
		{
			if( data.hasOwnProperty( property ) )
			{
				tags[ property ] = data[ property ];
			}
		}

		return tags;
	};

	/**
	 * すべてのタグ情報を文字列として取得します。
	 *
	 * @return	成功時は文字列化されたタグ情報。それ以外は空文字。
	 */
	this.toStringTags = function()
	{
		if( !hasData() ) { return ""; }

		var data  = _image.exifdata;
		var value = "";
		for( var property in data )
		{
			if( data.hasOwnProperty( property ) )
			{
				if( typeof( data[ property ] ) == "object" )
				{
					value += property + " : [" + data[ property ].length + " values]\r\n";
				}
				else
				{
					value += property + " : " + data[ property ] + "\r\n";
				}
			}
		}

		return value;
	};
}
