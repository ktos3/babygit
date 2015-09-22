// ExifUtil.js version 0.0.3
// generated from exifutildef.js exifsimple.js jquery.exifutil.js exifformat.js exifreader.js ifdreader.js exifpretty.js lenscanon.js binaryfile.js binaryfetcher.js
/*****************************************************************************
 * ExifUtilDef
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        exifutildef.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifutildef.js 24 2010-10-02 12:37:14Z kimata $
 */
ExifUtil = {
    version: '0.01'
};
window.ExifUtil = window.$E = ExifUtil;

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * ExifSimple class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        exifsimple.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifsimple.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     $E.Simple = function() {
         this.initialize.apply(this, arguments);
     };
     $E.Simple.prototype = {
         initialize: function(options) {
             this.list_ = [];
         },
         readURL: function(url, callback) {
             var binaryReq = new $E.BinaryFetcher();
             binaryReq.fetch(
                 url,
                 {
                     length: 0x20000,
                     isCheckLength: false,
                     onSuccess: function(req) {
                         var reader = new $E.ExifReader(req.binaryFile);
                         var tiffTagMap = reader.read();
                         req.binaryFile = null;
                         callback(tiffTagMap);
                     }
                 }
             );
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * jQuery.ExifUtil
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        jquery.exif.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @category    jQuery plugin
 * @copyright   c 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifsimple.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($) {
     jQuery.fn.loadExif = function(callback) {
         return this.each(
             function() {
                 var util = new ExifUtil.Simple();
                 var image = this;
                 util.readURL(
                     image.src,
                     function(tiffTagMap) {
                         image.exifUtil = { tiffTagMap: tiffTagMap };
                         callback(tiffTagMap);
                     }
                 );
             }
         );
     };
     jQuery.fn.existsExif = function() {
         return (this[0].exifUtil.tiffTagMap.Exif !== undefined );
     };
     jQuery.fn.exif = function() {
         return {
             model        : $E.Pretty.model(this[0].exifUtil.tiffTagMap),
             lensModel    : $E.Pretty.lensModel(this[0].exifUtil.tiffTagMap),
             focalLength  : $E.Pretty.focalLength(this[0].exifUtil.tiffTagMap),
             aperture     : $E.Pretty.aperture(this[0].exifUtil.tiffTagMap),
             exposureTime : $E.Pretty.exposureTime(this[0].exifUtil.tiffTagMap),
             isoSpeed     : $E.Pretty.isoSpeed(this[0].exifUtil.tiffTagMap),
             resolution   : $E.Pretty.resolution(this[0].exifUtil.tiffTagMap)
         };
     };
})(jQuery);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * ExifFormat class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        exifformat.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifformat.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     var IFDType = {
         BYTE:      1,
         ASCII:     2,
         SHORT:     3,
         LONG:      4,
         RATIONAL:  5,
         UNDEFINED: 7,
         SLONG:     9,
         SRATIONAL: 10
     };

     $E.IFDType = IFDType;
     $E.IFD = {
         // Tiff IFD Tags
         // see: http://www.exif.org/Exif2-2.PDF (PDF p.22)
         // see: http://www.cipa.jp/hyoujunka/kikaku/pdf/DC-008-2010_J.pdf (PDF p.32)
         TiffTags: { 
             // A. Tags relating to image data structure
             0x0100: { id: 'ImageWidth',                    type: [IFDType.SHORT,
                                                                   IFDType.LONG],       count:       1 },
             0x0101: { id: 'ImageHeight',                   type: [IFDType.SHORT,
                                                                   IFDType.LONG],       count:       1 },
             0x0102: { id: 'BitsPerSample',                 type:  IFDType.SHORT,       count:       1 },
             0x0103: { id: 'Compression',                   type:  IFDType.SHORT,       count:       1 },
             0x0106: { id: 'PhotometricInterpretation',     type:  IFDType.SHORT,       count:       1 },
             0x0112: { id: 'Orientation',                   type:  IFDType.SHORT,       count:       1 },
             0x0115: { id: 'SamplesPerPixel',               type:  IFDType.SHORT,       count:       1 },
             0x011C: { id: 'PlanarConfiguration',           type:  IFDType.SHORT,       count:       1 },
             0x0212: { id: 'YCbCrSubSampling',              type:  IFDType.SHORT,       count:       2 },
             0x0213: { id: 'YCbCrPositioning',              type:  IFDType.SHORT,       count:       1 },
             0x011A: { id: 'XResolution',                   type:  IFDType.RATIONAL,    count:       1 },
             0x011B: { id: 'YResolution',                   type:  IFDType.RATIONAL,    count:       1 },
             0x0128: { id: 'ResolutionUnit',                type:  IFDType.SHORT,       count:       1 },
             // B. Tags relating to recording offset
             0x0111: { id: 'StripOffsets',                  type: [IFDType.SHORT,
                                                                   IFDType.LONG]                       },
             0x0116: { id: 'RowsPerStrip',                  type: [IFDType.SHORT,
                                                                   IFDType.LONG],       count:       1 },
             0x0117: { id: 'StripByteCounts',               type: [IFDType.SHORT,     
                                                                   IFDType.LONG]                       },
             0x0201: { id: 'JPEGInterchangeFormat',         type:  IFDType.LONG,        count:       1 },
             0x0202: { id: 'JPEGInterchangeFormatLength',   type:  IFDType.LONG,        count:       1 },
             // C. Tags relating to image data characteristics
             0x012D: { id: 'TransferFunction',              type:  IFDType.SHORT,       count:   3*256 },
             0x013E: { id: 'WhitePoint',                    type:  IFDType.RATIONAL,    count:       2 },
             0x013F: { id: 'PrimaryChromaticities',         type:  IFDType.RATIONAL,    count:       6 },
             0x0211: { id: 'YCbCrCoefficients',             type:  IFDType.RATIONAL,    count:       3 },
             0x0214: { id: 'ReferenceBlackWhite',           type:  IFDType.RATIONAL,    count:       6 },
             // D. Other tags
             0x0132: { id: 'DateTime',                      type:  IFDType.ASCII,       count:      20 },
             0x010E: { id: 'ImageDescription',              type:  IFDType.ASCII                       },
             0x010F: { id: 'Make',                          type:  IFDType.ASCII                       },
             0x0110: { id: 'Model',                         type:  IFDType.ASCII                       },
             0x0131: { id: 'Software',                      type:  IFDType.ASCII                       },
             0x013B: { id: 'Artist',                        type:  IFDType.ASCII                       },
             0x8298: { id: 'Copyright',                     type:  IFDType.ASCII                       },
             // Exif-specific IFD     
             0x8769: { id: 'ExifIFDPointer',                type:  IFDType.LONG,        count:       1 },
             0x8825: { id: 'GPSInfoIFDPointer',             type:  IFDType.LONG,        count:       1 },
             0xA005: { id: 'InteroperabilityIFDPointer',    type:  IFDType.LONG,        count:       1 }
         },
         // Exif IFD Tags
         // see: http://www.exif.org/Exif2-2.PDF (PDF p.30-31)
         // see: http://www.cipa.jp/hyoujunka/kikaku/pdf/DC-008-2010_J.pdf (PDF p.45-46)
         ExifTags: { 
             // A. Tags Relating to Version 
             0x9000: { id: 'ExifVersion',                   type:  IFDType.UNDEFINED,   count:       4 },
             0xA000: { id: 'FlashpixVersion',               type:  IFDType.UNDEFINED,   count:       4 },
             // B. Tag Relating to Image Data Characteristics
             0xA001: { id: 'ColorSpace',                    type:  IFDType.SHORT,       count:       1 },
             0xA500: { id: 'Gamma',                         type:  IFDType.RATIONAL,    count:       1 },
             // C. Tags Relating to Image Configuration
             0x9101: { id: 'ComponentsConfiguration',       type:  IFDType.UNDEFINED,   count:       4 },
             0x9102: { id: 'CompressedBitsPerPixel',        type:  IFDType.RATIONAL,    count:       1 },
             0xA002: { id: 'PixelXDimension',               type: [IFDType.SHORT,
                                                                   IFDType.LONG],       count:       1 },
             0xA003: { id: 'PixelYDimension',               type:  IFDType.LONG,        count:       1 },
             // D. Tags Relating to User Information
             0x927C: { id: 'MakerNote',                     type:  IFDType.UNDEFINED                   },
             0x9286: { id: 'UserComment',                   type:  IFDType.UNDEFINED                   },
             // E. Tag Relating to Related File Information
             0xA004: { id: 'RelatedSoundFile',              type:  IFDType.ASCII,       count:      13 },
             // F. Tags Relating to Date and Time
             0x9003: { id: 'DateTimeOriginal',              type:  IFDType.ASCII,       count:      20 },
             0x9004: { id: 'DateTimeDigitized',             type:  IFDType.ASCII,       count:      20 },
             0x9290: { id: 'SubsecTime',                    type:  IFDType.ASCII                       },
             0x9291: { id: 'SubsecTimeOriginal',            type:  IFDType.ASCII                       },
             0x9292: { id: 'SubsecTimeDigitized',           type:  IFDType.ASCII                       },
             // G. Tags Relating to Picture-Taking Conditions
             0x829A: { id: 'ExposureTime',                  type:  IFDType.RATIONAL,    count:       1 },
             0x829D: { id: 'FNumber',                       type:  IFDType.RATIONAL,    count:       1 },
             0x8822: { id: 'ExposureProgram',               type:  IFDType.SHORT,       count:       1 },
             0x8824: { id: 'SpectralSensitivity',           type:  IFDType.ASCII                       },
             0x8827: { id: 'PhotographicSensitivity',       type:  IFDType.SHORT                       },
             0x8828: { id: 'OECF',                          type:  IFDType.UNDEFINED                   },
             0x8830: { id: 'SensitivityType',               type:  IFDType.SHORT,       count:       1 },
             0x8831: { id: 'StandardOutputSensitivityType', type:  IFDType.LONG,        count:       1 },
             0x8832: { id: 'RecommendedExposureIndex',      type:  IFDType.LONG,        count:       1 },
             0x8833: { id: 'ISOSpeed',                      type:  IFDType.LONG,        count:       1 },
             0x8834: { id: 'ISOSpeedLatitudeyyy',           type:  IFDType.LONG,        count:       1 },
             0x8835: { id: 'ISOSpeedLatitudezzz',           type:  IFDType.LONG,        count:       1 },
             0x9201: { id: 'ShutterSpeedValue',             type:  IFDType.SRATIONAL,   count:       1 },
             0x9202: { id: 'ApertureValue',                 type:  IFDType.RATIONAL,    count:       1 },
             0x9203: { id: 'BrightnessValue',               type:  IFDType.SRATIONAL,   count:       1 },
             0x9204: { id: 'ExposureBiasValue',             type:  IFDType.SRATIONAL,   count:       1 },
             0x9205: { id: 'MaxApertureValue',              type:  IFDType.RATIONAL,    count:       1 },
             0x9206: { id: 'SubjectDistance',               type:  IFDType.RATIONAL,    count:       1 },
             0x9207: { id: 'MeteringMode',                  type:  IFDType.SHORT,       count:       1 },
             0x9208: { id: 'LightSource',                   type:  IFDType.SHORT,       count:       1 },
             0x9209: { id: 'Flash',                         type:  IFDType.SHORT,       count:       1 },
             0x920A: { id: 'FocalLength',                   type:  IFDType.RATIONAL,    count:       1 },
             0x9214: { id: 'SubjectArea',                   type:  IFDType.SHORT,       count: [2,3,4] },
             0xA20B: { id: 'FlashEnergy',                   type:  IFDType.RATIONAL,    count:       1 },
             0xA20C: { id: 'SpatialFrequencyResponse',      type:  IFDType.UNDEFINED                   },
             0xA20E: { id: 'FocalPlaneXResolution',         type:  IFDType.RATIONAL,    count:       1 },
             0xA20F: { id: 'FocalPlaneYResolution',         type:  IFDType.RATIONAL,    count:       1 },
             0xA210: { id: 'FocalPlaneResolutionUnit',      type:  IFDType.SHORT,       count:       1 },
             0xA214: { id: 'SubjectLocation',               type:  IFDType.SHORT,       count:       2 },
             0xA215: { id: 'ExposureIndex',                 type:  IFDType.RATIONAL,    count:       1 },
             0xA217: { id: 'SensingMethod',                 type:  IFDType.SHORT,       count:       1 },
             0xA300: { id: 'FileSource',                    type:  IFDType.UNDEFINED,   count:       1 },
             0xA301: { id: 'SceneType',                     type:  IFDType.UNDEFINED,   count:       1 },
             0xA302: { id: 'CFAPattern',                    type:  IFDType.UNDEFINED                   },
             0xA401: { id: 'CustomRendered',                type:  IFDType.SHORT,       count:       1 },
             0xA402: { id: 'ExposureMode',                  type:  IFDType.SHORT,       count:       1 },
             0xA403: { id: 'WhiteBalance',                  type:  IFDType.SHORT,       count:       1 },
             0xA404: { id: 'DigitalZoomRation',             type:  IFDType.RATIONAL,    count:       1 },
             0xA405: { id: 'FocalLengthIn35mmFilm',         type:  IFDType.SHORT,       count:       1 },
             0xA406: { id: 'SceneCaptureType',              type:  IFDType.SHORT,       count:       1 },
             0xA407: { id: 'GainControl',                   type:  IFDType.SHORT,       count:       1 },
             0xA408: { id: 'Contrast',                      type:  IFDType.SHORT,       count:       1 },
             0xA409: { id: 'Saturation',                    type:  IFDType.SHORT,       count:       1 },
             0xA40A: { id: 'Sharpness',                     type:  IFDType.SHORT,       count:       1 },
             0xA40B: { id: 'DeviceSettingDescription',      type:  IFDType.UNDEFINED                   },
             0xA40C: { id: 'SubjectDistanceRange',          type:  IFDType.SHORT,       count:       1 },
             // H. Other Tags
             0xA420: { id: 'ImageUniqueID',                 type:  IFDType.ASCII,       count:      33 },
             0xA430: { id: 'CameraOwnerName',               type:  IFDType.ASCII                       },
             0xA431: { id: 'BodySerialNumber',              type:  IFDType.ASCII                       },
             0xA432: { id: 'LensSpecification',             type:  IFDType.RATIONAL,    count:       4 },
             0xA433: { id: 'LensMake',                      type:  IFDType.ASCII                       },
             0xA434: { id: 'LensModel',                     type:  IFDType.ASCII                       },
             0xA435: { id: 'LensSerialNumber',              type:  IFDType.ASCII                       },
             // other tags
             0xA005: { id: 'InteroperabilityIFDPointer',    type: IFDType.LONG,         count:       1 }
         },
         // GPS Info Tags
         // see: http://www.exif.org/Exif2-2.PDF (PDF p.52)
         // see: http://www.cipa.jp/hyoujunka/kikaku/pdf/DC-008-2010_J.pdf (PDF p.73)
         GpsTags: { 
             0x0000: { id: 'GPSVersionID',                  type:  IFDType.BYTE,        count:       4 },
             0x0001: { id: 'GPSLatitudeRef',                type:  IFDType.ASCII,       count:       2 },
             0x0002: { id: 'GPSLatitude',                   type:  IFDType.RATIONAL,    count:       3 },
             0x0003: { id: 'GPSLongitudeRef',               type:  IFDType.ASCII,       count:       2 },
             0x0004: { id: 'GPSLongitude',                  type:  IFDType.RATIONAL,    count:       3 },
             0x0005: { id: 'GPSAltitudeRef',                type:  IFDType.BYTE,        count:       1 },
             0x0006: { id: 'GPSAltitude',                   type:  IFDType.ASCII,       count:       2 },
             0x0007: { id: 'GPSTimeStamp',                  type:  IFDType.RATIONAL,    count:       3 },
             0x0008: { id: 'GPSSatellites',                 type:  IFDType.ASCII                       },
             0x0009: { id: 'GPSStatus',                     type:  IFDType.ASCII,       count:       2 },
             0x000A: { id: 'GPSMeasureMode',                type:  IFDType.ASCII,       count:       2 },
             0x000B: { id: 'GPSDOP',                        type:  IFDType.RATIONAL,    count:       1 },
             0x000C: { id: 'GPSSpeedRef',                   type:  IFDType.ASCII,       count:       2 },
             0x000D: { id: 'GPSSpeed',                      type:  IFDType.RATIONAL,    count:       1 },
             0x000E: { id: 'GPSTrackRef',                   type:  IFDType.ASCII,       count:       2 },
             0x000F: { id: 'GPSTrack',                      type:  IFDType.RATIONAL,    count:       1 },
             0x0010: { id: 'GPSImgDirectionRef',            type:  IFDType.ASCII,       count:       2 },
             0x0011: { id: 'GPSImgDirection',               type:  IFDType.RATIONAL,    count:       1 },
             0x0012: { id: 'GPSMapDatum',                   type:  IFDType.ASCII                       },
             0x0013: { id: 'GPSDestLatitudeRef',            type:  IFDType.ASCII,       count:       2 },
             0x0014: { id: 'GPSDestLatitude',               type:  IFDType.RATIONAL,    count:       3 },
             0x0015: { id: 'GPSDestLongitudeRef',           type:  IFDType.ASCII,       count:       2 },
             0x0016: { id: 'GPSDestLongitude',              type:  IFDType.RATIONAL,    count:       3 },
             0x0017: { id: 'GPSDestBearingRef',             type:  IFDType.ASCII,       count:       2 },
             0x0018: { id: 'GPSDestBearing',                type:  IFDType.RATIONAL,    count:       1 },
             0x0019: { id: 'GPSDestDistanceRef',            type:  IFDType.ASCII,       count:       2 },
             0x001A: { id: 'GPSDestDistance',               type:  IFDType.RATIONAL,    count:       1 },
             0x001B: { id: 'GPSProcessingMethod',           type:  IFDType.UNDEFINED                   },
             0x001C: { id: 'GPSAreaInformation',            type:  IFDType.UNDEFINED                   },
             0x001D: { id: 'GPSDateStamp',                  type:  IFDType.RATIONAL,    count:      11 },
             0x001E: { id: 'GPSDifferential',               type:  IFDType.SHORT,       count:       1 },
             0x001F: { id: 'GPSHPositioningError',          type:  IFDType.RATIONAL,    count:       1 }
         },
         // Maker Note
         MakerNoteTags: { 
             Canon: {
                 0x0001: {
                     id: 'CanonCameraSettings',             type:  'ARRAY',
                     def: {
                         22: { id: 'LensType',              type:  IFDType.SHORT,       count:       1 }
                     }
                 },
                 0x0012: { id: 'CanonAFInfo'               },
                 0x0026: { id: 'CanonAFInfo2',              type:  IFDType.SHORT                       },
                 0x0095: { id: 'LensModel',                 type:  IFDType.ASCII                       }
             }
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * ExifReader class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        exifreader.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifreader.js 27 2010-10-02 14:40:14Z kimata $
 */
(function($E) {
     $E.ExifReader = function() {
         this.initialize.apply(this, arguments);
     };

     $E.ExifReader.prototype = {
         initialize: function(file, options) {
             this.file_ = file;
         },
         read: function() {
             var file = this.file_;
             var pos = 0;
             var fileOffset = file.getOffset();
             var fileLength = file.getLength();
             var app1TagMap = {};

             while (pos < fileLength) {
                 var markerCode = file.getShortAtBigEndian(pos);
                 var length = file.getShortAtBigEndian(pos + 2);

                 if (markerCode == 0xFFD8) { // SOI
                     pos += 2; 
                 } else if (markerCode == 0xFFE1) { // APP1
                     var tagMap = this.readAPP1(pos, length);
                     if (tagMap) {
                         app1TagMap = tagMap;
                     }
                     pos += 2 + length;
                 } else if (markerCode == 0xFFC0) { // SOF0
                     app1TagMap.SOF0 = this.readSOF0(pos, length);
                     pos += 2 + length;
                 } else {
                     pos += 2 + length;
                 }
                 // reset the offset
                 file.setOffset(fileOffset);
             }
             return app1TagMap;
         },
         readAPP1: function(offset, length) {
             var file = this.file_;
             var pos;
             file.setOffset(offset);

             // structure of APP1
             // +--------+--------------------------------------+
             // | 0..1   | APP1 Marker                          |
             // +--------+--------------------------------------+
             // | 2..3   | APP1 Length                          |
             // +--------+--------------------------------------+
             // | 4..8   | Identifier ("Exif\0"                 |
             // +--------+--------------------------------------+
             // | 9      | Pad                                  |
             // +--------+---------+----------------------------+
             // | 10..11 | Header  | Byte Order                 |
             // +--------+         +----------------------------+
             // | 12..13 |         | 42                         |
             // +--------+         +----------------------------+
             // | 14..17 |         | 0th IFD Offset             |
             // +--------+---------+----------------------------+
             // | 18..19 | 0th IFD | Number of Entries          |
             // +--------+         +----------------------------+
             // | 20..   |         | ...                        |
             // +--------+---------+----------------------------+

             // Identifier
             pos = 4;
             if (file.getStringAt(pos, 4) != 'Exif') {
                 return;
             }

             // TIFF
             pos += 6;
             var tiffBase = pos;

             // Header: Byte Order
             var byteOrder = file.getShortAtBigEndian(pos);
             if (byteOrder == 0x4D4D) {
                 file.setEndian(true);
             } else if (byteOrder != 0x4949) {
                 return;
             }
             // Header: 42
             pos += 2;
             if (file.getShortAt(pos) != 0x002A) {
                 return;
             }
             // Header: Offset of IFD
             pos += 2;
             if (file.getLongAt(pos) != 0x00000008) {
                 return;
             }
             // Header: 0th IFD
             pos += 4;

             var ifdReader = new $E.IFDReader(file);
             var tiffTagMap = ifdReader.read(tiffBase, pos, $E.IFD.TiffTags);

             if (tiffTagMap.ExifIFDPointer) {
                 var exifTagMap = ifdReader.read(tiffBase, tiffBase + tiffTagMap.ExifIFDPointer.value,
                                                 $E.IFD.ExifTags);
                 if ((tiffTagMap.Make.value == 'Canon') && exifTagMap.MakerNote) {
                     var makerNoteTagMap = ifdReader.read(tiffBase, exifTagMap.MakerNote.offset,
                                                          $E.IFD.MakerNoteTags.Canon);
                     exifTagMap.MakerNote = makerNoteTagMap;
                 }
                 tiffTagMap.Exif = exifTagMap;
             }
             if (tiffTagMap.GPSInfoIFDPointer) {
                 var gpsTagMap = ifdReader.read(tiffBase, tiffBase + tiffTagMap.GPSInfoIFDPointer.value,
                                                $E.IFD.GpsTags);
                 tiffTagMap.Gps = gpsTagMap;
             }
             return tiffTagMap;
         },
         readSOF0: function(offset, length) {
             var file = this.file_;
             var pos;
             file.setOffset(offset);

             // structure of SOF0
             // +--------+--------------------------------------+
             // | 0..1   | SOF0 Marker                          |
             // +--------+--------------------------------------+
             // | 2..3   | SOF0 Length                          |
             // +--------+--------------------------------------+
             // | 4      | Data precision                       |
             // +--------+--------------------------------------+
             // | 5..6   | Image Height                         |
             // +--------+--------------------------------------+
             // | 7..8   | Image Width                          |
             // +--------+--------------------------------------+

             // Image Height
             pos = 5;
             var imageHeight = file.getShortAtBigEndian(pos);
             var imageWidth = file.getShortAtBigEndian(pos + 2);

             return {
                 imageHeight: { value: imageHeight },
                 imageWidth: { value: imageWidth }
             };
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * IFDReader class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        binaryrequest.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: ifdreader.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     $E.IFDReader = function() {
         this.initialize.apply(this, arguments);
     };
     $E.IFDReader.prototype = {
         initialize: function(file, options) {
             this.file_ = file;
         },

         read: function(tiffBase, dirBase, tagDefs)
         {
             var file = this.file_;

             // structure of IDF
             // +-------+---------------------------------------+
             // | 0..1  | Count                                 |
             // +-------+---------------------------------------+
             // | 2..13 | Entry                                 |
             // +-------+---------------------------------------+
             // | ...                                           |
             // +-----------------------------------------------+

             var entry_count = file.getShortAt(dirBase);
             var tagMap = {};
             for (var i = 0; i < entry_count; i++) {
                 var entry_offset = (dirBase + 2) + i*12;

                 var tagKey = tagDefs[file.getShortAt(entry_offset)];
                 if (!tagKey) {
                     continue;
                 }

                 var tagValue = this.readTagValue(entry_offset, tiffBase);
                 if (typeof tagKey.type === 'string') {
                     if (tagKey.type === 'ARRAY') {
                         tagMap[tagKey.id] = {};
                         for (index in tagKey.def) {
                             tagMap[tagKey.id][tagKey.def[index].id] = {
                                 value: tagValue.value[index]
                             };
                         }
                     }
                 } else {
                     tagMap[tagKey.id] = tagValue; 
                 }
             }
             return tagMap;
         },
         readTagValue: function(entryBase, tiffBase) {
             var file = this.file_;

             // structure of IDF Entry
             // +-------+---------------------------------------+
             // | 0..1  | Tag                                   |
             // +-------+---------------------------------------+
             // | 2..3  | Type (1:BYTE, 2:ASCII, 3:SHORT,       |
             // |       |       4:LONG, 5:RATIONAL,             |
             // |       |       7:UNDEFINED, 9:SLONG,           |
             // |       |       10:SRATIONAL)                   |
             // +-------+---------------------------------------+
             // | 4..7  | Count                                 |
             // +-------+---------------------------------------+
             // | 8..11 | Value Offset                          |
             // +-------+---------------------------------------+

             var type = file.getShortAt(entryBase + 2);
             var count = file.getLongAt(entryBase + 4);
             var offset = file.getLongAt(entryBase + 8) + tiffBase;

             return {
                 value: this.readTagValueImpl(entryBase, type, count, offset),
                 offset: offset
             };
         },
         readTagValueImpl: function(entryBase, type, count, offset) {
             var file = this.file_;

             switch (type) {
             case 1: // BYTE
             case 7: // UNDEFINED
                 if (count == 1) {
                     return file.getByteAt(entryBase + 8);
                 } else {
                     offset = count > 4 ? offset : (entryBase + 8);
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getByteAt(offset + i);
                     }
                     return valueList;
                 }
             case 2: // ASCII
                 offset = count > 4 ? offset : (entryBase + 8);
                 return file.getStringAt(offset, count-1);
             case 3: // SHORT
                 if (count == 1) {
                     return file.getShortAt(entryBase + 8);
                 } else {
                     offset = count > 2 ? offset : (entryBase + 8);
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getShortAt(offset + 2*i);
                     }
                     return valueList;
                 }
                 break;
             case 4: // LONG
                 if (count == 1) {
                     return file.getLongAt(entryBase + 8);
                 } else {
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getLongAt(offset + 4*i);
                     }
                     return valueList;
                 }
             case 5:    // RATIONAL
                 if (count == 1) {
                     return file.getLongAt(offset) / file.getLongAt(offset + 4);
                 } else {
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getLongAt(offset + 8*i) / file.getLongAt(offset+4 + 8*i);
                     }
                     return valueList;
                 }
                 break;
             case 9: // SLONG
                 if (count == 1) {
                     return file.getSLongAt(entryBase + 8);
                 } else {
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getSLongAt(offset + 4*i);
                     }
                     return valueList;
                 }
             case 10: // SRATIONAL
                 if (count == 1) {
                     return file.getSLongAt(offset) / file.getSLongAt(offset + 4);
                 } else {
                     var valueList = [];
                     for (var i = 0; i < count; i++) {
                         valueList[i] = file.getSLongAt(offset + 8*i) / file.getSLongAt(offset+4 + 8*i);
                     }
                     return valueList;
                 }
             }
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * ExifPretty
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        exifpretty.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: exifpretty.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     $E.Pretty = {
         UNKNOWN: 'Unknown'
     };
     
     var tagValue = function(tagMap, tagName, options) {
         var opts = {
             prefix: '',
             suffix: '',
             func: function(val) { return val; }
         };
         jQuery.extend(true, opts, options);

         if (!tagMap) {
             return $E.Pretty.UNKNOWN;
         }

         var tag = tagMap[tagName];
         return tag ? (opts.prefix + opts.func(tag.value) + opts.suffix) : $E.Pretty.UNKNOWN;
     };
     $E.Pretty.model = function(tiffTagMap) {
         return tagValue(tiffTagMap, 'Model');
     };
     $E.Pretty.lensModel = function(tiffTagMap) {
         if (!tiffTagMap.Exif) {
             return $E.Pretty.UNKNOWN;
         }
         if (tiffTagMap.Exif.LensModel) {
             return tiffTagMap.Exif.LensModel.value;
         } else {
             var maker = tiffTagMap.Make.value;
             if (maker == 'Canon') {
                 return $E.Pretty.lensModelCanon(tiffTagMap);
             } else {
                 return $E.Pretty.UNKNOWN;
             }
         }
     };
     $E.Pretty.focalLength = function(tiffTagMap) {
         return tagValue(tiffTagMap.Exif, 'FocalLength', { suffix: 'mm' });
     };
     $E.Pretty.aperture = function(tiffTagMap) {
         return tagValue(tiffTagMap.Exif, 'ApertureValue',
                         {
                             prefix: 'f/',
                             func: function(val) { 
                                 return Math.floor(Math.pow(2, parseFloat(val) / 2) * 10) / 10;
                             }
                         });
     };
     $E.Pretty.exposureTime = function(tiffTagMap) {
         return tagValue(tiffTagMap.Exif, 'ExposureTime',
                         {
                             suffix: 'sec',
                             func: function(val) { 
                                 var time = parseFloat(val);
                                 if (time >= 1) {
                                     return Math.floor(time * 10) / 10;
                                 } else {
                                     return '1/' + Math.floor(1 / time);
                                 }
                             }
                         });
     };
     $E.Pretty.isoSpeed = function(tiffTagMap) {
         if (!tiffTagMap.Exif) {
             return $E.Pretty.UNKNOWN;
         }

         if (tiffTagMap.Exif.ISOSpeed) {
             return tagValue(tiffTagMap.Exif, 'ISOSpeed', { prefix: 'ISO' });
         } else if (tiffTagMap.Exif.SensitivityType) {
             if ((tiffTagMap.Exif.SensitivityType.value != 1) &&
                 (tiffTagMap.Exif.SensitivityType.value != 2) &&
                 (tiffTagMap.Exif.SensitivityType.value != 4)) {
                 return tagValue(tiffTagMap.Exif, 'PhotographicSensitivity', { prefix: 'ISO' });
             } else {
                 return $E.Pretty.UNKNOWN;
             }
         } else {
             return tagValue(tiffTagMap.Exif, 'PhotographicSensitivity', { prefix: 'ISO' });
         }
     };
     $E.Pretty.resolution = function(tiffTagMap) {
         if (!tiffTagMap.SOF0) {
             return $E.Pretty.UNKNOWN;
         }
         
         return tiffTagMap.SOF0.imageWidth.value + 'x' + tiffTagMap.SOF0.imageHeight.value;
     };
     $E.Pretty.afInfo = function(tiffTagMap) {
         if (!tiffTagMap.Exif || !tiffTagMap.Make || !tiffTagMap.Exif.MakerNote) {
             return $E.Pretty.UNKNOWN;
         }
         var maker = tiffTagMap.Make.value;
         var makerNote = tiffTagMap.Exif.MakerNote;
         if (maker == 'Canon') {
             if (makerNote.CanonAFInfo2) {
                 var afInfo = makerNote.CanonAFInfo2.value;
                 var mode;
                 switch (afInfo[1]) {
                 case 1  : mode = 'Manual'                  ; break;
                 case 2  : mode = 'Single-point AF'         ; break;
                 case 4  : mode = 'Multi-point AF or AI AF' ; break;
                 case 5  : mode = 'Face Detect AF'          ; break;
                 case 7  : mode = 'Zone AF'                 ; break;
                 case 8  : mode = 'AF Point Expansion'      ; break;
                 case 9  : mode = 'Spot AF'                 ; break;
                 default : mode = 'Spot AF'                 ; break;
                 }
                 var numPoints        = afInfo[2];
                 var validPoints      = afInfo[3];
                 var imageWidth       = afInfo[4];
                 var imageHeight      = afInfo[5];
                 var width     = afInfo[6];
                 var height      = afInfo[7];
                 var areaInfo       = [];
                 var afInFocus = 0;
                 var afSelected = 0;
                 var numBitmap = (numPoints + 15) >> 4;
                 for (var i = 0; i < numBitmap; i++) {
                     afInFocus  = afInFocus  + (afInfo[8 + (validPoints*4)             + i] << (16*i));
                     afSelected = afSelected + (afInfo[8 + (validPoints*4) + numBitmap + i] << (16*i));
                 }
                 for (var i = 0; i < validPoints; i++) {
                     areaInfo[i] = {
                         width   : afInfo[8 + (validPoints*0) + i],
                         height  : afInfo[8 + (validPoints*1) + i],
                         x       : afInfo[8 + (validPoints*2) + i],
                         y       : afInfo[8 + (validPoints*3) + i],
                         focus   : (afInFocus >> i) & 1,
                         selected: (afSelected >> i) & 1
                     }
                     areaInfo[i].x -= (areaInfo[i].x & 0x8000) << 1; 
                     areaInfo[i].y -= (areaInfo[i].y & 0x8000) << 1; 
                 }
                 return {
                     mode: mode,
                     width: width,
                     height: height,
                     areaInfo: areaInfo
                 };
             } else {
                 return $E.Pretty.UNKNOWN;
             }
         } else {
             return $E.Pretty.UNKNOWN;
         }
     };
     $E.Pretty.gpsLocationAsDeg = function(tiffTagMap) {
         if (!tiffTagMap.Gps ||
             !tiffTagMap.Gps.GPSLatitudeRef || !tiffTagMap.Gps.GPSLatitude ||
             !tiffTagMap.Gps.GPSLongitudeRef || !tiffTagMap.Gps.GPSLongitude) {
             return $E.Pretty.UNKNOWN;
         }
         var dms2deg = function(dms) {
             return dms[0] + dms[1]/60 + dms[2]/3600;
         };
         var latitude = dms2deg(tiffTagMap.Gps.GPSLatitude.value);
         var longitude = dms2deg(tiffTagMap.Gps.GPSLongitude.value);
         if (tiffTagMap.Gps.GPSLatitudeRef.value == 'S') {
             latitude *= -1;
         }
         if (tiffTagMap.Gps.GPSLongitudeRef.value == 'W') {
             longitude *= -1;
         }
         return {
             latitude : latitude,
             longitude: longitude
         };
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * LensCanon
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        lenscanon.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: lenscanon.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     var lensMap = {
         1  : [{ min:  50, max:  50, name: 'EF 50mm f/1.8'                                      }],
         2  : [{ min:  28, max:  28, name: 'EF 28mm f/2.8'                                      }],
         3  : [{ min: 135, max: 135, name: 'EF 135mm f/2.8 Soft'                                }],
         4  : [{ min:  35, max: 105, name: 'EF 35-105mm f/3.5-4.5 or Sigma Lens'                }, 
               { min:  35, max: 135, name: 'Sigma UC Zoom 35-135mm f/4-5.6'                     }],
         5  : [{ min:  35, max:  70, name: 'EF 35-70mm f/3.5-4.5'                               }],
         6  : [{ min:  28, max:  70, name: 'EF 28-70mm f/3.5-4.5 or Sigma or Tokina Lens'       },
               { min:  18, max:  50, name: 'Sigma 18-50mm f/3.5-5.6 DC'                         },
               { min:  18, max: 125, name: 'Sigma 18-125mm f/3.5-5.6 DC IF ASP'                 },
               { min:  19, max:  35, name: 'Tokina AF193-2 19-35mm f/3.5-4.5'                   },
               { min:  28, max:  80, name: 'Sigma 28-80mm f/3.5-5.6 II Macro'                   }],
         7  : [{ min: 100, max: 300, name: 'EF 100-300mm f/5.6L'                                }],
         8  : [{ min: 100, max: 300, name: 'EF 100-300mm f/5.6 or Sigma or Tokina Lens'         },
               { min:  70, max: 300, name: 'Sigma 70-300mm f/4-5.6 DG Macro'                    },
               { min:  24, max: 200, name: 'Tokina AT-X242AF 24-200mm f/3.5-5.6'                }],
         9  : [{ min:  70, max: 210, name: 'EF 70-210mm f/4'                                    },
               { min:  55, max: 200, name: 'Sigma 55-200mm f/4-5.6 DC'                          }],
         10 : [{ min:  50, max:  50, name: 'EF 50mm f/2.5 Macro or Sigma Lens'                  },
               { min:  50, max:  50, name: 'Sigma 50mm f/2.8 EX'                                },
               { min:  28, max:  28, name: 'Sigma 28mm f/1.8'                                   },
               { min: 105, max: 105, name: 'Sigma 105mm f/2.8 Macro EX'                         }],
         11 : [{ min:  35, max:  35, name: 'EF 35mm f/2'                                        }],
         13 : [{ min:  15, max:  15, name: 'EF 15mm f/2.8 Fisheye'                              }],
         14 : [{ min:  50, max: 200, name: 'EF 50-200mm f/3.5-4.5L'                             }],
         15 : [{ min:  50, max: 200, name: 'EF 50-200mm f/3.5-4.5'                              }],
         16 : [{ min:  35, max: 135, name: 'EF 35-135mm f/3.5-4.5'                              }],
         17 : [{ min:  35, max:  70, name: 'EF 35-70mm f/3.5-4.5A'                              }],
         18 : [{ min:  28, max:  70, name: 'EF 28-70mm f/3.5-4.5'                               }],
         20 : [{ min: 100, max: 200, name: 'EF 100-200mm f/4.5A'                                }],
         21 : [{ min:  80, max: 200, name: 'EF 80-200mm f/2.8L'                                 }],
         22 : [{ min:  20, max:  35, name: 'EF 20-35mm f/2.8L or Tokina Lens'                   },
               { min:  28, max:  80, name: 'Tokina AT-X280AF PRO 28-80mm f/2.8 Aspherical'      }],
         23 : [{ min:  35, max: 105, name: 'EF 35-105mm f/3.5-4.5'                              }],
         24 : [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6 Power Zoom'                      }],
         25 : [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6 Power Zoom'                      }],
         26 : [{ min: 100, max: 100, name: 'EF 100mm f/2.8 Macro or Other Lens'                 },
               { min: 100, max: 100, name: 'Cosina 100mm f/3.5 Macro AF'                        },
               { min:  90, max:  90, name: 'Tamron SP AF 90mm f/2.8 Di Macro'                   },
               { min: 180, max: 180, name: 'Tamron SP AF 180mm f/3.5 Di Macro'                  },
               { min:  50, max:  50, name: 'Carl Zeiss Planar T* 50mm f/1.4'                    }],
         27 : [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6'                                 }],
         28 : [{ min:  80, max: 200, name: 'EF 80-200mm f/4.5-5.6 or Tamron Lens'               },
               { min:  28, max: 105, name: 'Tamron SP AF 28-105mm f/2.8 LD Aspherical IF'       },
               { min:  28, max:  75, name: 'Tamron SP AF 28-75mm f/2.8 XR Di LD Aspherical [IF] Macro' },
               { min:  70, max: 300, name: 'Tamron AF 70-300mm f/4.5-5.6 Di LD 1:2 Macro Zoom'  },
               { min:  28, max: 200, name: 'Tamron AF Aspherical 28-200mm f/3.8-5.6'            }],
         29 : [{ min:  50, max:  50, name: 'EF 50mm f/1.8 MkII'                                 }],
         30 : [{ min:  35, max: 105, name: 'EF 35-105mm f/4.5-5.6'                              }],
         31 : [{ min:  75, max: 300, name: 'EF 75-300mm f/4-5.6 or Tamron Lens'                 },
               { min: 300, max: 300, name: 'Tamron SP AF 300mm f/2.8 LD IF'                     }],
         32 : [{ min:  24, max:  24, name: 'EF 24mm f/2.8 or Sigma Lens'                        },
               { min:  15, max:  15, name: 'Sigma 15mm f/2.8 EX Fisheye'                        },
               { min:  40, max:  40, name: 'Voigtlander Ultron 40mm f/2 SLII Aspherical'        },
               { min:  35, max:  35, name: 'Zeiss Distagon 35mm T* f/2 ZE'                      }],
         35 : [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6'                                 }],
         36 : [{ min:  38, max:  76, name: 'EF 38-76mm f/4.5-5.6'                               }],
         37 : [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6 or Tamron Lens'                  },
               { min:  70, max: 200, name: 'Tamron 70-200mm f/2.8 Di LD IF Macro'               },
               { min:  28, max: 300, name: 'Tamron AF 28-300mm f/3.5-6.3 XR Di VC LD Aspherical [IF] Macro Model A20' }],
         38 : [{ min:  80, max: 200, name: 'EF 80-200mm f/4.5-5.6'                              }],
         39 : [{ min:  75, max: 300, name: 'EF 75-300mm f/4-5.6'                                }],
         40 : [{ min:  28, max:  80, name: 'EF 28-80mm f/3.5-5.6'                               }],
         41 : [{ min:  28, max:  90, name: 'EF 28-90mm f/4-5.6'                                 }],
         42 : [{ min:  28, max: 200, name: 'EF 28-200mm f/3.5-5.6 or Tamron Lens'               },
               { min:  28, max: 300, name: 'Tamron AF 28-300mm f/3.5-6.3 XR Di VC LD Aspherical [IF] Macro Model A20' }],
         43 : [{ min:  28, max: 105, name: 'EF 28-105mm f/4-5.6'                                }],
         44 : [{ min:  90, max: 300, name: 'EF 90-300mm f/4.5-5.6'                              }],
         45 : [{ min:  18, max:  55, name: 'EF-S 18-55mm f/3.5-5.6'                             }],
         46 : [{ min:  28, max:  90, name: 'EF 28-90mm f/4-5.6'                                 }],
         48 : [{ min:  18, max:  55, name: 'EF-S 18-55mm f/3.5-5.6 IS'                          }],
         49 : [{ min:  55, max: 250, name: 'EF-S 55-250mm f/4-5.6 IS'                           }],
         50 : [{ min:  18, max: 200, name: 'EF-S 18-200mm f/3.5-5.6 IS'                         }],
         51 : [{ min:  18, max: 135, name: 'EF-S 18-135mm f/3.5-5.6 IS'                         }],
         94 : [{ min:  17, max:  17, name: 'TS-E 17mm f/4L'                                     }],
         95 : [{ min:  24, max:  24, name: 'TS-E 24mm f/3.5 L II'                               }],
         124: [{ min:  65, max:  65, name: 'MP-E 65mm f/2.8 1-5x Macro Photo'                   }],
         125: [{ min:  24, max:  24, name: 'TS-E 24mm f/3.5L'                                   }],
         126: [{ min:  45, max:  45, name: 'TS-E 45mm f/2.8'                                    }],
         127: [{ min:  90, max:  90, name: 'TS-E 90mm f/2.8'                                    }],
         129: [{ min: 300, max: 300, name: 'EF 300mm f/2.8L'                                    }],
         130: [{ min:  50, max:  50, name: 'EF 50mm f/1.0L'                                     }],
         131: [{ min:  28, max:  80, name: 'EF 28-80mm f/2.8-4L or Sigma Lens'                  },
               { min:   8, max:   8, name: 'Sigma 8mm f/3.5 EX DG Circular Fisheye'             },
               { min:  17, max:  35, name: 'Sigma 17-35mm f/2.8-4 EX DG Aspherical HSM'         },
               { min:  17, max:  70, name: 'Sigma 17-70mm f/2.8-4.5 DC Macro'                   },
               { min:  50, max: 150, name: 'Sigma APO 50-150mm f/2.8 [II] EX DC HSM'            },
               { min: 120, max: 300, name: 'Sigma APO 120-300mm f/2.8 EX DG HSM'                }],
         132: [{ min: 1200, max: 1200, name: 'EF 1200mm f/5.6L'                                 }],
         134: [{ min: 600, max: 600, name: 'EF 600mm f/4L IS'                                   }],
         135: [{ min: 200, max: 200, name: 'EF 200mm f/1.8L'                                    }],
         136: [{ min: 300, max: 300, name: 'EF 300mm f/2.8L'                                    }],
         137: [{ min:  85, max:  85, name: 'EF 85mm f/1.2L or Sigma Lens'                       },
               { min:  18, max:  50, name: 'Sigma 18-50mm f/2.8-4.5 DC OS HSM'                  },
               { min:  50, max: 200, name: 'Sigma 50-200mm f/4-5.6 DC OS HSM'                   },
               { min:  18, max: 250, name: 'Sigma 18-250mm f/3.5-6.3 DC OS HSM'                 },
               { min:  24, max:  70, name: 'Sigma 24-70mm f/2.8 IF EX DG HSM'                   },
               { min:  18, max: 125, name: 'Sigma 18-125mm f/3.8-5.6 DC OS HSM'                 },
               { min:  17, max:  70, name: 'Sigma 17-70mm f/2.8-4 DC Macro OS HSM'              }],
         138: [{ min:  28, max:  80, name: 'EF 28-80mm f/2.8-4L'                                }],
         139: [{ min: 400, max: 400, name: 'EF 400mm f/2.8L'                                    }],
         140: [{ min: 500, max: 500, name: 'EF 500mm f/4.5L'                                    }],
         141: [{ min: 500, max: 500, name: 'EF 500mm f/4.5L'                                    }],
         142: [{ min: 300, max: 300, name: 'EF 300mm f/2.8L IS'                                 }],
         143: [{ min: 500, max: 500, name: 'EF 500mm f/4L IS'                                   }],
         144: [{ min:  35, max: 135, name: 'EF 35-135mm f/4-5.6 USM'                            }],
         145: [{ min: 100, max: 300, name: 'EF 100-300mm f/4.5-5.6 USM'                         }],
         146: [{ min:  70, max: 210, name: 'EF 70-210mm f/3.5-4.5 USM'                          }],
         147: [{ min:  35, max: 135, name: 'EF 35-135mm f/4-5.6 USM'                            }],
         148: [{ min:  28, max:  80, name: 'EF 28-80mm f/3.5-5.6 USM'                           }],
         149: [{ min: 100, max: 100, name: 'EF 100mm f/2 USM'                                   }],
         150: [{ min:  14, max:  14, name: 'EF 14mm f/2.8L or Sigma Lens'                       },
               { min:  20, max:  20, name: 'Sigma 20mm EX f/1.8'                                },
               { min:  30, max:  30, name: 'Sigma 30mm f/1.4 DC HSM'                            },
               { min:  24, max:  24, name: 'Sigma 24mm f/1.8 DG Macro EX'                       }],
         151: [{ min: 200, max: 200, name: 'EF 200mm f/2.8L'                                    }],
         152: [{ min: 300, max: 300, name: 'EF 300mm f/4L IS or Sigma Lens'                     },
               { min:  12, max:  24, name: 'Sigma 12-24mm f/4.5-5.6 EX DG ASPHERICAL HSM'       },
               { min:  14, max:  14, name: 'Sigma 14mm f/2.8 EX Aspherical HSM'                 },
               { min:  10, max:  20, name: 'Sigma 10-20mm f/4-5.6'                              },
               { min: 100, max: 300, name: 'Sigma 100-300mm f/4'                                }],
         153: [{ min:  35, max: 350, name: 'EF 35-350mm f/3.5-5.6L or Sigma or Tamron Lens'     },
               { min:  50, max: 500, name: 'Sigma 50-500mm f/4-6.3 APO HSM EX'                  },
               { min:  28, max: 300, name: 'Tamron AF 28-300mm f/3.5-6.3 XR LD Aspherical [IF] Macro' },
               { min:  18, max: 200, name: 'Tamron AF 18-200mm f/3.5-6.3 XR Di II LD Aspherical [IF] Macro Model A14' },
               { min:  18, max: 250, name: 'Tamron 18-250mm f/3.5-6.3 Di II LD Aspherical [IF] Macro' }],
         154: [{ min:  20, max:  20, name: 'EF 20mm f/2.8 USM'                                  }],
         155: [{ min:  85, max:  85, name: 'EF 85mm f/1.8 USM'                                  }],
         156: [{ min:  28, max: 105, name: 'EF 28-105mm f/3.5-4.5 USM'                          }],
         160: [{ min:  20, max:  35, name: 'EF 20-35mm f/3.5-4.5 USM or Tamron Lens'            },
               { min:  19, max:  35, name: 'Tamron AF 19-35mm f/3.5-4.5'                        }],
         161: [{ min:  28, max:  70, name: 'EF 28-70mm f/2.8L or Sigma or Tamron Lens'          },
               { min:  24, max:  70, name: 'Sigma 24-70mm f/2.8 EX'                             },
               { min:  28, max:  70, name: 'Sigma 28-70mm f/2.8 EX'                             },
               { min:  17, max:  50, name: 'Tamron AF 17-50mm f/2.8 Di-II LD Aspherical'        },
               { min:  90, max:  90, name: 'Tamron 90mm f/2.8'                                  }],
         162: [{ min: 200, max: 200, name: 'EF 200mm f/2.8L'                                    }],
         163: [{ min: 300, max: 300, name: 'EF 300mm f/4L'                                      }],
         164: [{ min: 400, max: 400, name: 'EF 400mm f/5.6L'                                    }],
         165: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8 L'                                }],
         166: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8 L + 1.4x'                         }],
         167: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8 L + 2x'                           }],
         168: [{ min:  28, max:  28, name: 'EF 28mm f/1.8 USM'                                  }],
         169: [{ min:  17, max:  35, name: 'EF 17-35mm f/2.8L or Sigma Lens'                    },
               { min:  18, max: 200, name: 'Sigma 18-200mm f/3.5-6.3 DC OS'                     },
               { min:  15, max:  30, name: 'Sigma 15-30mm f/3.5-4.5 EX DG Aspherical'           },
               { min:  18, max:  50, name: 'Sigma 18-50mm f/2.8 Macro'                          },
               { min:  50, max:  50, name: 'Sigma 50mm f/1.4 EX DG HSM'                         }],
         170: [{ min: 200, max: 200, name: 'EF 200mm f/2.8L II'                                 }],
         171: [{ min: 300, max: 300, name: 'EF 300mm f/4L'                                      }],
         172: [{ min: 400, max: 400, name: 'EF 400mm f/5.6L'                                    }],
         173: [{ min: 180, max: 180, name: 'EF 180mm Macro f/3.5L or Sigma Lens'                },
               { min: 180, max: 180, name: 'Sigma 180mm EX HSM Macro f/3.5'                     },
               { min: 150, max: 150, name: 'Sigma APO Macro 150mm f/2.8 EX DG HSM'              }],
         174: [{ min: 135, max: 135, name: 'EF 135mm f/2L or Sigma Lens'                        },
               { min:  70, max: 200, name: 'Sigma 70-200mm f/2.8 EX DG APO OS HSM'              }],
         175: [{ min: 400, max: 400, name: 'EF 400mm f/2.8L'                                    },
               { min: 400, max: 400, name: 'EF 400mm f/2.8L'                                    }], 
         176: [{ min:  24, max:  85, name: 'EF 24-85mm f/3.5-4.5 USM'                           }],   
         177: [{ min: 300, max: 300, name: 'EF 300mm f/4L IS'                                   }],
         178: [{ min:  28, max: 135, name: 'EF 28-135mm f/3.5-5.6 IS'                           }],
         179: [{ min:  24, max:  24, name: 'EF 24mm f/1.4L'                                     }],
         180: [{ min:  35, max:  35, name: 'EF 35mm f/1.4L'                                     }],
         181: [{ min: 100, max: 400, name: 'EF 100-400mm f/4.5-5.6L IS + 1.4x'                  }],
         182: [{ min: 100, max: 400, name: 'EF 100-400mm f/4.5-5.6L IS + 2x'                    }],
         183: [{ min: 100, max: 400, name: 'EF 100-400mm f/4.5-5.6L IS'                         }],
         184: [{ min: 400, max: 400, name: 'EF 400mm f/2.8L + 2x'                               }],
         185: [{ min: 600, max: 600, name: 'EF 600mm f/4L IS'                                   }],
         186: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L'                                   }],
         187: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L + 1.4x'                            }],
         188: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L + 2x'                              }],
         189: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L + 2.8x'                            }],
         190: [{ min: 100, max: 100, name: 'EF 100mm f/2.8 Macro'                               }],
         191: [{ min: 400, max: 400, name: 'EF 400mm f/4 DO IS'                                 }],
         193: [{ min:  35, max:  80, name: 'EF 35-80mm f/4-5.6 USM'                             }],
         194: [{ min:  80, max: 200, name: 'EF 80-200mm f/4.5-5.6 USM'                          }],
         195: [{ min:  35, max: 105, name: 'EF 35-105mm f/4.5-5.6 USM'                          }],
         196: [{ min:  75, max: 300, name: 'EF 75-300mm f/4-5.6 USM'                            }],
         197: [{ min:  75, max: 300, name: 'EF 75-300mm f/4-5.6 IS USM'                         }],
         198: [{ min:  50, max:  50, name: 'EF 50mm f/1.4 USM'                                  }],
         199: [{ min:  28, max:  80, name: 'EF 28-80mm f/3.5-5.6 USM'                           }],
         200: [{ min:  75, max: 300, name: 'EF 75-300mm f/4-5.6 USM'                            }],
         201: [{ min:  28, max:  80, name: 'EF 28-80mm f/3.5-5.6 USM'                           }],
         202: [{ min:  28, max:  80, name: 'EF 28-80mm f/3.5-5.6 USM IV'                        }],
         208: [{ min:  22, max:  55, name: 'EF 22-55mm f/4-5.6 USM'                             }],
         209: [{ min:  55, max: 200, name: 'EF 55-200mm f/4.5-5.6'                              }],
         210: [{ min:  28, max:  90, name: 'EF 28-90mm f/4-5.6 USM'                             }],
         211: [{ min:  28, max: 200, name: 'EF 28-200mm f/3.5-5.6 USM'                          }],
         212: [{ min:  28, max: 105, name: 'EF 28-105mm f/4-5.6 USM'                            }],
         213: [{ min:  90, max: 300, name: 'EF 90-300mm f/4.5-5.6 USM'                          }],
         214: [{ min:  18, max:  55, name: 'EF-S 18-55mm f/3.5-4.5 USM'                         }],
         215: [{ min:  55, max: 200, name: 'EF 55-200mm f/4.5-5.6 II USM'                       }],
         224: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8L IS'                              }],
         225: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8L IS + 1.4x'                       }],
         226: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8L IS + 2x'                         }],
         227: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8L IS + 2.8x'                       }],
         228: [{ min:  28, max: 105, name: 'EF 28-105mm f/3.5-4.5 USM'                          }],
         229: [{ min:  16, max:  35, name: 'EF 16-35mm f/2.8L'                                  }],
         230: [{ min:  24, max:  70, name: 'EF 24-70mm f/2.8L'                                  }],
         231: [{ min:  17, max:  40, name: 'EF 17-40mm f/4L'                                    }],
         232: [{ min:  70, max: 300, name: 'EF 70-300mm f/4.5-5.6 DO IS USM'                    }],
         233: [{ min:  28, max: 300, name: 'EF 28-300mm f/3.5-5.6L IS'                          }],
         234: [{ min:  17, max:  85, name: 'EF-S 17-85mm f4-5.6 IS USM'                         }],
         235: [{ min:  10, max:  22, name: 'EF-S 10-22mm f/3.5-4.5 USM'                         }],
         236: [{ min:  60, max:  60, name: 'EF-S 60mm f/2.8 Macro USM'                          }],
         237: [{ min:  24, max: 105, name: 'EF 24-105mm f/4L IS'                                }],
         238: [{ min:  70, max: 300, name: 'EF 70-300mm f/4-5.6 IS USM'                         }],
         239: [{ min:  85, max:  85, name: 'EF 85mm f/1.2L II'                                  }],
         240: [{ min:  17, max:  55, name: 'EF-S 17-55mm f/2.8 IS USM'                          }],
         241: [{ min:  50, max:  50, name: 'EF 50mm f/1.2L'                                     }],
         242: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L IS'                                }],
         243: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L IS + 1.4x'                         }],
         244: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L IS + 2x'                           }],
         245: [{ min:  70, max: 200, name: 'EF 70-200mm f/4L IS + 2.8x'                         }],
         246: [{ min:  16, max:  35, name: 'EF 16-35mm f/2.8L II'                               }],
         247: [{ min:  14, max:  14, name: 'EF 14mm f/2.8L II USM'                              }],
         248: [{ min: 200, max: 200, name: 'EF 200mm f/2L IS'                                   }],
         249: [{ min: 800, max: 800, name: 'EF 800mm f/5.6L IS'                                 }],
         250: [{ min:  24, max:  24, name: 'EF 24mm f/1.4L II'                                  }],
         251: [{ min:  70, max: 200, name: 'EF 70-200mm f/2.8L IS II USM'                       }],
         254: [{ min: 100, max: 100, name: 'EF 100mm f/2.8L Macro IS USM'                       }],
         488: [{ min:  15, max:  85, name: 'EF-S 15-85mm f/3.5-5.6 IS USM'                      }]
     };
     var convertIDtoName = function(id, focalLength, isExcludeCanon) {
         var lensInfo = lensMap[id];

         if (!lensInfo)  {
             return $E.Pretty.UNKNOWN;
         } else {
             var lensNames = [];
             for (var i = 0; i < lensInfo.length; i++) {
                 if ((focalLength >= lensInfo[i].min) && (focalLength <= lensInfo[i].max)) {
                     if (!isExcludeCanon || (lensInfo[i].name.search(/^EF/) == -1)) {
                         lensNames.push(lensInfo[i].name);                         
                     }
                 }
             }
             return lensNames.join(' or ');
         }
     };
     $E.Pretty.lensModelCanon = function(tiffTagMap) {
         var makerNote = tiffTagMap.Exif.MakerNote;
         var isExcludeCanon = false;
         if (!makerNote) {
             return $E.Pretty.UNKNOWN;
         } else {
             if (makerNote.LensModel &&
                 (makerNote.LensModel.value.search(/^EF/) != -1)) {
                 return makerNote.LensModel.value;
             } else {
                 isExcludeCanon = true;
             }
         }
         if (tiffTagMap.Exif.FocalLength && makerNote.CanonCameraSettings) {
             return convertIDtoName(makerNote.CanonCameraSettings.LensType.value,
                                    tiffTagMap.Exif.FocalLength.value, isExcludeCanon);
         } else {
             return $E.Pretty.UNKNOWN;
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * BinaryFile class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        binaryfile.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: binaryfile.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     $E.BinaryFile = function() {
         this.initialize.apply(this, arguments);
     };

     $E.BinaryFile.prototype = {
         initialize: function(data, length, isBigEndian) {
             this.fileDataOrig_ = data;
             this.fileData_     = data;
             this.fileOffset_   = 0;
             this.fileLength_   = 0;

             if (typeof this.fileDataOrig_ == "string") {
                 fileLength_ = length || data.length;
                 this.getByteAt = function(pos) {
                     return this.fileData_.charCodeAt(pos) & 0xFF;
                 };
                 this.getStringAt = function(pos, length) {
                     return this.fileData_.substr(pos, length);
                 };
             } else if (typeof this.fileDataOrig_ == "unknown") {
                 fileLength_ = length || IEBinary_getLength(this.fileData_);
                 this.getByteAt = function(pos) {
                     return IEBinary_getByteAt(this.fileData_, this.fileOffset_ + pos);
                 };
                 this.getStringAt = function(pos, length) {
                     var str = [];
                     for (var i = pos, j = 0; i < pos+length; i++,j++) {
                         str[j] = String.fromCharCode(this.getByteAt(i));
                     }
                     return str.join("");
                 };
             }
             this.setEndian(isBigEndian);
         },
         setEndian: function(isBigEndian) {
             if (isBigEndian) {
                 this.getShortAt = function(pos) {
                     return this.getShortAtBigEndian(pos); 
                 };
                 this.getLongAt = function(pos) {
                     return (this.getShortAt(pos) << 16) + this.getShortAt(pos + 2); 
                 };
             } else {
                 this.getShortAt = function(pos) {
                     return (this.getByteAt(pos + 1) << 8) + this.getByteAt(pos);
                 };
                 this.getLongAt = function(pos) {
                     return (this.getShortAt(pos + 2) << 16) + this.getShortAt(pos);
                 };
             }
         },
         setOffset: function(offset) {
             var oldOffset = this.fileOffset_;
             this.fileOffset_ = offset;
             if (typeof this.fileDataOrig_ == "string") {
                 this.fileData_   = this.fileDataOrig_.substr(offset);
             }
             return oldOffset;
         },
         getShortAtBigEndian: function(pos) {
             return (this.getByteAt(pos) << 8) + this.getByteAt(pos + 1); 
         },
         getOffset: function() {
             return this.fileOffset_;
         },
         getRawData: function() {
             return fileData_;
         },
         getLength: function() {
             return fileLength_;
         },
         getSByteAt: function(pos) {
             var val = this.getByteAt(pos);
             if (val >= 0x80) {
                 return val - 0x100;                 
             } else {
                 return val;                 
             }
         },
         getSShortAt: function(pos) {
             var val = this.getShortAt(pos);
             if (val >= 0x8000) {
                 return val - 0x10000;            
             } else {
                 return val; 
             }
         },
         getSLongAt: function(pos) {
             var val = this.getLongAt(pos);
             if (pos >= 0x80000000) {
                 return val - 0x100000000;
             } else {
                 return val;
             }
         },
         getCharAt: function(pos) {
             return String.fromCharCode(this.getByteAt(pos));
         },
         toBase64: function() {
             return window.btoa(fileData_);
         },
         fromBase64: function(base64) {
             fileData_ = window.atob(basee64);
         }
     };

     document.write(
         "<script type='text/vbscript'>\r\n" +
             "Function IEBinary_getByteAt(strBinary, iOffset)\r\n" + 
             "    IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n" +
             "End Function\r\n" + 
             "Function IEBinary_getLength(strBinary)\r\n" +
             "    IEBinary_getLength = LenB(strBinary)\r\n" +
             "End Function\r\n" + 
         "</script>\r\n"
     );
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
/*****************************************************************************
 * BinaryFetcher class
 * This code was originally written as Javascript EXIF Reader
 * by Jacob Seidelin (http://www.nihilogic.dk/labs/exif/)
 * 
 * @name        binaryfetcher.js
 * @author      TETSUYA KIMATA - http://acapulco.dyndns.org/
 * @copyright   (C) 2010 Tetsuya Kimata <kimata@acapulco.dyndns.org>
 * @license     the MPL License - http://www.nihilogic.dk/licenses/mpl-license.txt
 * 
 * $Id: binaryfetcher.js 24 2010-10-02 12:37:14Z kimata $
 */
(function($E) {
     $E.BinaryFetcher = function() {
         this.initialize.apply(this, arguments);
     };

     $E.BinaryFetcher.prototype = {
         initialize: function(options) {
             var opts = {
                 isUseRange: true
             };
             jQuery.extend(true, opts, options);

             this.isUseRange = opts.isUseRaneg;
         },
         req: function() {
             var req = null;

             if (window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject)) {
                 req = new window.XMLHttpRequest();
             } else {
                 req = new window.ActiveXObject("Microsoft.XMLHTTP");
             }
             return req;
         },
         head: function(url, options) {
             var opts = {
                 onSuccess: function() {},
                 onError: function() {}
             };
             jQuery.extend(true, opts, options);

             var req = this.req();
             if (!req) {
                 return onError();
             }

             req.onreadystatechange = function() {
                 if (req.readyState != 4) {
                     return;
                 }
                 if (req.status == "200") {
                     opts.onSuccess(this);
                 } else {
                     opts.onError(this);
                 }
                 req = null;
             };
             req.open("HEAD", url, true);
             req.send(null);
         },
         get: function(url, options) {
             var opts = {
                 onSuccess: function() {},
                 onError: function() {},
                 isAcceptRanges: false,
                 offset: 0,
                 length: null
             };
             jQuery.extend(true, opts, options);

             var req = this.req();
             if (!req) {
                 onError();
             }

             if (typeof(req.onload) != "undefined") {
                 req.onload = function() {
                     if (req.status == "200" || req.status == "206" || req.status == "0") {
                         this.binaryFile = new $E.BinaryFile(req.responseText,
                                                             this.getResponseHeader("Content-Length") || opts.length);
                         opts.onSuccess(this);
                     } else {
                         opts.onError();
                     }
                     req = null;
                 };
             } else {
                 req.onreadystatechange = function() {
                     if (req.readyState != 4) {
                         return;
                     }
                     if (req.status == "200" || req.status == "206" || req.status == "0") {
                         this.binaryFile = new $E.BinaryFile(req.responseBody,
                                                             this.getResponseHeader("Content-Length") || opts.length);
                         opts.onSuccess(this);
                     } else {
                         opts.onError();
                     }
                     req = null;
                 };
             }
             req.open("GET", url, true);
             if (req.overrideMimeType) {
                 req.overrideMimeType('text/plain; charset=x-user-defined');
             }
             if (opts.isAcceptRanges && opts.length) {
                 req.setRequestHeader("Range", "bytes=" + opts.offset + "-" + opts.length);
             }
             req.send(null);
         },
         fetch: function(url, options) {
             var opts = {
                 onSuccess: function() {},
                 onError: function() {},
                 isAcceptRanges: false,
                 isCheckLength: true,
                 offset: 0,
                 length: null
             };
             jQuery.extend(true, opts, options);

             if (opts.isCheckLength && opts.length) {
                 var self = this;
                 this.head(
                     url,
                     {
                         onSuccess: function(req) {
                             var length = parseInt(req.getResponseHeader("Content-Length"), 10);
                             var acceptRanges = req.getResponseHeader("Accept-Ranges");

                             if (length < (opts.offset + opts.length)) {
                                 opts.length = length - opts.offset;
                             }
                             if (acceptRanges && (acceptRanges.search(/bytes/) != -1)) {
                                 opts.isAcceptRanges = true;
                             }
                             return self.get(url, opts);
                         }
                     }
                 );
             } else {
                 opts.isAcceptRanges = true;
                 this.get(url, opts);
             }
         }
     };
})(ExifUtil);

// Local Variables:
// mode: javascript
// coding: utf-8-unix
// End:
