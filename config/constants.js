
const GLOBAL_VARRIABLE = {
	key_hash_pass: 'linhvancutedeptraigalang',
	key_decode_token : 'nguyennganhamhamdodo',
	token_live_time:  3*3600*24,
	host: "http://localhost:3000/",
	error: {
		L1001: "Mã xác thực tài khoản không chính xác. Vui lòng thử lại.",
		L1002: "Tài khoản không đúng.",
		L1003: "Tài khoản đã tồn tại.",
		L1004: "Tài khoản không tồn tại.",
		L1005: "Mã reset password không chính xác.",
		L1006: "Đăng nhập thất bại",
		L1007: "Lỗi chứng thực Cookie."
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