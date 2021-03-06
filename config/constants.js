
const GLOBAL_VARRIABLE = {
	key_hash_pass: 'linhvancutedeptraigalang',
	key_decode_token : 'nguyennganhamhamdodo',
	token_live_time:  3*3600*24,
	key_cookie_pview: 'phamvanlinhwebbanhang',
	host: "http://localhost:8080/",
	lgAPI:{
		fb: "facebook",
		gg: "google"
	},
	error: {
		L1001: "Mã xác thực tài khoản không chính xác. Vui lòng thử lại.",
		L1002: "Tài khoản không đúng.",
		L1003: "Tài khoản đã tồn tại.",
		L1004: "Tài khoản không tồn tại.",
		L1005: "Mã reset password không chính xác.",
		L1006: "Đăng nhập thất bại",
		L1007: "Lỗi chứng thực Cookie.",
		L1008: "Tài khoản đã được đăng kí và sử dụng.",
		L1009: "Giao dịch không thành công. Vấn đề bảo mật hoặc sản phẩm đã bán hết.",
		L1010: "Giao dịch không thành công. Tài khoản của bạn không đủ"
	},
	success: {
		A1001: "Đã gửi mã xác thực mail thành công, vui lòng kiểm tra email.",
		A1002: "Mã chính xác. Vui lòng tiếp tục đăng kí.",
	},
	err_status:{
		N1001: "Lỗi server. Không thể xác thực token", //500 error
		N1002: "Không tồn tại token để xác thực. Vui lòng đăng nhập-đăng kí.", //403
		N1003: "Máy chủ không khả dụng, Host vi phạm.",//503 Service Unavailable
	}
};

export default GLOBAL_VARRIABLE;