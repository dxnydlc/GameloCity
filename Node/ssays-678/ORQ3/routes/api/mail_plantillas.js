

var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';

var _css = `
<style type="text/css">
		p{
			margin:10px 0;
			padding:0;
		}
		table{
			border-collapse:collapse;
		}
		h1,h2,h3,h4,h5,h6{
			display:block;
			margin:0;
			padding:0;
		}
		img,a img{
			border:0;
			height:auto;
			outline:none;
			text-decoration:none;
		}
		body,#bodyTable,#bodyCell{
			height:100%;
			margin:0;
			padding:0;
			width:100%;
		}
		.mcnPreviewText{
			display:none !important;
		}
		#outlook a{
			padding:0;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		table{
			mso-table-lspace:0pt;
			mso-table-rspace:0pt;
		}
		.ReadMsgBody{
			width:100%;
		}
		.ExternalClass{
			width:100%;
		}
		p,a,li,td,blockquote{
			mso-line-height-rule:exactly;
		}
		a[href^=tel],a[href^=sms]{
			color:inherit;
			cursor:default;
			text-decoration:none;
		}
		p,a,li,td,body,table,blockquote{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
			line-height:100%;
		}
		a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:none !important;
			font-size:inherit !important;
			font-family:inherit !important;
			font-weight:inherit !important;
			line-height:inherit !important;
		}
		.templateContainer{
			max-width:600px !important;
		}
		a.mcnButton{
			display:block;
		}
		.mcnImage,.mcnRetinaImage{
			vertical-align:bottom;
		}
		.mcnTextContent{
			word-break:break-word;
		}
		.mcnTextContent img{
			height:auto !important;
		}
		.mcnDividerBlock{
			table-layout:fixed !important;
		}
	/*
	@tab Page
	@section Heading 1
	@style heading 1
	*/
		h1{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:40px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:center;
		}
	/*
	@tab Page
	@section Heading 2
	@style heading 2
	*/
		h2{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:34px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 3
	@style heading 3
	*/
		h3{
			/*@editable*/color:#444444;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:22px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 4
	@style heading 4
	*/
		h4{
			/*@editable*/color:#999999;
			/*@editable*/font-family:Georgia;
			/*@editable*/font-size:20px;
			/*@editable*/font-style:italic;
			/*@editable*/font-weight:normal;
			/*@editable*/line-height:125%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Container Style
	*/
		#templateHeader{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:36px;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Header
	@section Header Interior Style
	*/
		.headerContainer{
			/*@editable*/background-color:#FFFFFF;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:45px;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Header
	@section Header Text
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/color:#808080;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Link
	*/
		.headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
			/*@editable*/color:#007E9E;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Body
	@section Body Container Style
	*/
		#templateBody{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Body
	@section Body Interior Style
	*/
		.bodyContainer{
			/*@editable*/background-color:#FFFFFF;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Body
	@section Body Text
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/color:#808080;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Body
	@section Body Link
	*/
		.bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
			/*@editable*/color:#007E9E;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Footer Style
	*/
		#templateFooter{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:36px;
		}
	/*
	@tab Footer
	@section Footer Interior Style
	*/
		.footerContainer{
			/*@editable*/background-color:#333333;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:45px;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Footer
	@section Footer Text
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Footer Link
	*/
		.footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	@media only screen and (min-width:768px){
		.templateContainer{
			width:600px !important;
		}

}	@media only screen and (max-width: 480px){
		body,table,td,p,a,li,blockquote{
			-webkit-text-size-adjust:none !important;
		}

}	@media only screen and (max-width: 480px){
		body{
			width:100% !important;
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnRetinaImage{
			max-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImage{
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
			max-width:100% !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnBoxedTextContentContainer{
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupContent{
			padding:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
			padding-top:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
			padding-top:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardBottomImageContent{
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockInner{
			padding-top:0 !important;
			padding-bottom:0 !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockOuter{
			padding-top:9px !important;
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnTextContent,.mcnBoxedTextContentColumn{
			padding-right:18px !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
			padding-right:18px !important;
			padding-bottom:0 !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcpreview-image-uploader{
			display:none !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 1
	@tip Make the first-level headings larger in size for better readability on small screens.
	*/
		h1{
			/*@editable*/font-size:30px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 2
	@tip Make the second-level headings larger in size for better readability on small screens.
	*/
		h2{
			/*@editable*/font-size:26px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 3
	@tip Make the third-level headings larger in size for better readability on small screens.
	*/
		h3{
			/*@editable*/font-size:20px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 4
	@tip Make the fourth-level headings larger in size for better readability on small screens.
	*/
		h4{
			/*@editable*/font-size:18px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Boxed Text
	@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Header Text
	@tip Make the header text larger in size for better readability on small screens.
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Body Text
	@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Footer Text
	@tip Make the footer content text larger in size for better readability on small screens.
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}
</style>
`;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  PLANTILLA MAIL BOLETA DE TRABAJADOR
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_boleta = ( titulo , _textoPre , data , usuario , link ) => {
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${_textoPre}</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api.ssays-orquesta.com/logo-ssays-2019-2.png" width="564" style="max-width:915px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <h3>Hola ${usuario.name},</h3>
                                <br>
                                <p>Estamos enviado tu ${data.Categoria} correspondiente al mes ${data.Mes}-${data.Anio} por favor recuerda que esta informaci??n es confidencial.
                                <br/>
                                Ahora enviaremos las boletas por Telgram, por favor ingresa al siguiente QR.
                                <img src="https://ssays-orquesta.com/bot-telegram.jpg" >
                                Para poder ver tu boleta has click en el siguiente enlace, muchas gracias por tu atenci??n.
                                </p>
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                                <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Ver boleta" href="${link}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver boleta</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright ?? 2021 SSAYS SAC, todos los derechos reservados.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  PLANTILLA MAIL CONTRATO DE TRABAJADOR
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_contrato = ( titulo , _textoPre , data , usuario , link ) => {
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${_textoPre}</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api.ssays-orquesta.com/logo-ssays-2019-2.png" width="564" style="max-width:915px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <h3>Hola ${usuario.name},</h3>
                                <br>
                                <p>Estamos enviado tu contrato de trabajo correspondiente al mes ${data.Mes}-${data.Anio} por favor recuerda que esta informaci??n es confidencial.
                                <br/>
                                Para poder ver tu contrato laboral has click en el siguiente enlace, muchas gracias por tu atenci??n.
                                </p>
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                                <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Ver contrato" href="${link}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver boleta</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright ?? 2021 SSAYS SAC, todos los derechos reservados.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//               PLANTILLA PARA INVITAR A LA CAPACITACION
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_capacitacion = ( titulo , _textoPre , data , det , link , _FechaHoraReu , mapita ) => {

    var _archivosRepo = ``;
    if( data.LinkRepositorio ){
        _archivosRepo = `<br>Revisa el material adicional aqu??:<br><a target="_blank" href="${data.LinkRepositorio}" >Ver material</a>`;
    }
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${_textoPre}</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api.ssays-orquesta.com/logo-ssays-2019-2.png" width="564" style="max-width:915px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody>
                        <tr>
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" >
                                <h3>Hola ${det.Colaborador},</h3>
                                <br>
                                <p>El ??rea : ${data.Area_Org} esta organizando la capacitaci??n ${data.Tipo} <strong>${data.Titulo}</strong></p>
                                <p>Dirigida al ??rea: ${data.Area_Rec}</p>
                                <p>La cual se llevar?? a cabo en: ${data.Cliente} - ${data.Local} / ${data.Direccion}</p>
                                ${mapita}
                                <p>Fecha/hora: ${_FechaHoraReu}</p>
                                <p>Expositor: ${data.Expositor}, responsable: ${data.Responsable}.
                                <br/>
                                ${data.Glosa}
                                ${_archivosRepo}
								<br/>
								Contamos con tu participaci??n, recuerda que est??s capacitaciones son importantes, muchas gracias por su atenci??n.
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                            <!--<td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Ver boleta" href="${link}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver boleta</a>
                                </td>-->
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright ?? 2021 SSAYS SAC, todos los derechos reservados.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//            PLANTILLA PARA SOLICITUD DE REPARACION DE MAQUINA
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_reparar_maquina = ( titulo , _Data , rsFiles , dataUser , URLNODE ) => {
    var _filecillos = ``;
    for (let index = 0; index < rsFiles.length; index++) {
        const rsF = rsFiles[index];
        _filecillos += `
<table align="left" width="273" border="0" cellpadding="0" cellspacing="0" class="mcnImageGroupContentContainer">
    <tbody><tr>
        <td class="mcnImageGroupContent" valign="top" style="padding-left: 9px; padding-top: 0; padding-bottom: 0;">
            <img alt="" src="${URLNODE}/api/files_2/show/${rsF.uu_id}" width="264" style="max-width:700px; padding-bottom: 0;" class="mcnImage">
            <p>${rsF.nombre_archivo}</p>
        </td>
    </tr></tbody>
</table>
        `;
    }
    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
        <!--*|IF:MC_PREVIEW_TEXT|*-->
        <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${titulo}</span><!--<![endif]-->
        <!--*|END:IF|*-->
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                <tr>
                    <td align="center" valign="top" id="bodyCell">
                        <!-- BEGIN TEMPLATE // -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" valign="top" id="templateHeader" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
    <tbody class="mcnImageBlockOuter">
            <tr>
                <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                        <tbody><tr>
                            <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                
                                    
                                        <img align="center" alt="" src="${_LogoSSAYS}" width="564" style="max-width: 915px; padding-bottom: 0px; vertical-align: bottom; display: inline !important; border-radius: 7%;" class="mcnImage">
                                    
                                
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="templateBody" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <h4>Solicitud de atenci??n de equipo</h4>
                            <h1>${_Data.Codigo}.</h1>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <h3>Hola, ${dataUser.name}.</h3>

<p>El usuario ${_Data.CreadoPor} esta solicitando reparar el activo siguiente:</p>

<ul>
	<li>Cliente: ${_Data.Cliente} / Local: ${_Data.Local}</li>
    <li>El horario para poder realizar el trabajo es: <strong>${_Data.AteInicio} - ${_Data.AteFin}</strong>.</li>
	<li>Direcci??n: ${_Data.Direccion}</li>
	<li>Nro. activo ${_Data.IdActivo}</li>
    <li>Tipo activo ${_Data.TActivo}</li>
    <li>Marca ${_Data.Marca}</li>
</ul>
<p>Descripci??n de la falla:<br/>${_Data.Descripcion}</p>
<p>Less is more here, since you're trying to get people to visit your site.</p>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 27px 18px 0px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageGroupBlock">
<tbody class="mcnImageGroupBlockOuter">
        
<tr>
    <td valign="top" style="padding:9px" class="mcnImageGroupBlockInner">
        <!-- 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999 -->
        ${_filecillos}
        <!-- 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999 -->
    </td>
</tr>

</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <p>Gracias por su atenci??n</p>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 1px solid #E0E0E0;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 18px 18px 0px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
            <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #009FC7;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                            <!-- GAAAAAAAAAAAA -->
                                <!-- <a class="mcnButton " title="Ver el ticked de atenci??n de maquina." href="" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver el ticked de atenci??n de maquina.</a> -->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="templateFooter" data-template-container>
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowBlock" style="min-width:100%;">
    <tbody class="mcnFollowBlockOuter">
        <tr>
            <td align="center" valign="top" style="padding:9px" class="mcnFollowBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentContainer" style="min-width:100%;">
    <tbody><tr>
        <td align="center" style="padding-left:9px;padding-right:9px;">
            
        </td>
    </tr>
</tbody></table>

            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #505050;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <em>Copyright ?? 2021 SSAYS SAC, All rights reserved.</em>
<br>
*|IFNOT:ARCHIVE_PAGE|*
    *|LIST:DESCRIPTION|*
    <br>
    <br>
    <strong>Our mailing address is:</strong>
    <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
    <br>
    <br>
	Want to change how you receive these emails?<br>
    <br>
    <br>
    *|IF:REWARDS|* *|HTML:REWARDS|*
*|END:IF|*

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </td>
                            </tr>
                        </table>
                        <!-- // END TEMPLATE -->
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//               PLANTILLA PARA INVITAR A LA CAPACITACION
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_atencion_maq = ( titulo , _textoPre , data , _FechaAtencion  ) => {

    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${_textoPre}</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api.ssays-orquesta.com/logo-ssays-2019-2.png" width="564" style="max-width:915px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody>
                        <tr>
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" >
                                <h3>Hola ${data.CreadoPor},</h3>
                                <br>
                                <p>El ??rea de mantenimiento ha asignado un t??cnico para su atenci??n de la solicitud :<strong>${data.Codigo}</strong></p>
                                <p>El t??cnico asignado es: ${data.Tecnico} el cual se aproximar?? en fecha: ${_FechaAtencion}, en horario: ${data.AteInicio}-${data.AteFin}</p>
                                <p>Observaci??nes del t??cnico:</p>
                                <br/>
                                ${data.Observaciones}
								<br/>
								Muchas gracias por su atenci??n.
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                            <!--<td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Ver boleta" href="" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver boleta</a>
                                </td>-->
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright ?? 2021 SSAYS SAC, todos los derechos reservados.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//          PLANTILLA PARA SOLICITUD DE CAMBIO ESTADP DOCUMENTO
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var mail_cambioEstado_Doc = ( titulo , _textoPre , data  ) => {

    return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <!-- NAME: GDPR SUBSCRIBER ALERT -->
            <!--[if gte mso 15]>
            <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${titulo}</title>

        ${_css}
        </head>
        <body>
            <!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">${_textoPre}</span><!--<![endif]-->
            <!--*|END:IF|*-->
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                    <tr>
                        <td align="center" valign="top" id="bodyCell">
                            <!-- BEGIN TEMPLATE // -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" valign="top" id="templateHeader">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
        <tbody class="mcnImageBlockOuter">
                <tr>
                    <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                            <tbody><tr>
                                <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                    
                                        
                                            <img align="center" alt="" src="https://api.ssays-orquesta.com/logo-ssays-2019-2.png" width="564" style="max-width:915px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                        
                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateBody">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody>
                        <tr>
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" >
                                <h3>Hola ${data.Autorizado},</h3>
                                <br>
                                <p>El usuario ${data.Solicitante} ha generado la solicitud de cambio de estado de documento Nro.<strong>${data.Codigo}</strong></p>
                                <p>Motivo especificado:</p>
                                <p>${data.Motivo}</p>
								<br/>
								Muchas gracias por su atenci??n.
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
        <tbody class="mcnDividerBlockOuter">
            <tr>
                <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                        <tbody><tr>
                            <td>
                                <span></span>
                            </td>
                        </tr>
                    </tbody></table>
    <!--            
                    <td class="mcnDividerBlockInner" style="padding: 18px;">
                    <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
    -->
                </td>
            </tr>
        </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
        <tbody class="mcnButtonBlockOuter">
            <tr>
                <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                    <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                        <tbody>
                            <tr>
                            <!--<td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                    <a class="mcnButton " title="Ver boleta" href="" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Ver boleta</a>
                                </td>-->
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" id="templateFooter">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                        <tr>
                                        <td align="center" valign="top" width="600" style="width:600px;">
                                        <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                            <tr>
                                                <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
        <tbody class="mcnTextBlockOuter">
            <tr>
                <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                      <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                    
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                    <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                        <tbody><tr>
                            
                            <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            
                                <em>Copyright ?? 2021 SSAYS SAC, todos los derechos reservados.</em>
    <br>
    *|IFNOT:ARCHIVE_PAGE|*
        *|LIST:DESCRIPTION|*
        <br>
        <br>
        <strong>Our mailing address is:</strong>
        <br>
    *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*
        <br>
        <br>
        *|IF:REWARDS|* *|HTML:REWARDS|*
    *|END:IF|*
    
                            </td>
                        </tr>
                    </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                    
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                </td>
            </tr>
        </tbody>
    </table></td>
                                            </tr>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- // END TEMPLATE -->
                        </td>
                    </tr>
                </table>
            </center>
        </body>
    </html>
    `;
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  DDDDDDDDDDDDD DDDDDDDDDDDDDDD QQQQQQ
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  DDDDDDDDDDDDD DDDDDDDDDDDDDDD QQQQQQ
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  DDDDDDDDDDDDD DDDDDDDDDDDDDDD QQQQQQ
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                  DDDDDDDDDDDDD DDDDDDDDDDDDDDD QQQQQQ
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = {
    mail_boleta ,
    mail_capacitacion,
    mail_reparar_maquina,
    mail_atencion_maq,
    mail_contrato,
    mail_cambioEstado_Doc
};