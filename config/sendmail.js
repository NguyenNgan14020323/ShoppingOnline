

import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'

const sendEmailCode = (email, code, type, Callback) => {

    var str = "";
    var title = "";
  
    if(type == 0){//authenticate
    	title = 'Mã xác thực tài khoản web bán hàng';
    	str = '<div><div><span style="font-size:150%;color:red;"><i>Chào mừng bạn đã đăng nhập vào' 
		str += ' trang web bán hàng của chúng tôi !!!</i></span></div><div>'
		str += '<p>Mã xác thực tài khoản của bạn là: </p><b>'+code+'</b></br>'
    }else{
    	title = 'Mã xác thực tài khoản người dùng';
   		str = '<div><div><span style="font-size:150%;color:red;"><i>Email của bạn đã được xác thực!!!</i>'
	    str += '</span></div><div><p>Mã xác nhận lại tài khoản của bạn là: </p><b>'+code+'</b></br>';
    }

    let transporter = nodemailer.createTransport(smtpTransport({
		service: "Gmail",
		auth: {
			user: "duanwebptudweb@gmail.com",
			pass: "DuAnWebPTUDWEB123",
		}
	}));

  	let mailOptions = {
		from: 'duanwebptudweb@gmail.com',
		to: email,//email nguoi dung
		subject:  title,
		html: str
	}

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error)
			Callback(('Some error: '+error), null);
		else
			Callback(null, ('Message '+info.messageId+' sent: '+info.response));
	})
}

export default {sendEmailCode};


