
export const slugify = (val) => {

  if (!val) return ''

  return String(val)
    .normalize('NFKD') // chia các ký tự có dấu thành các ký tự cơ bản và dấu phụ
    .replace(/[\u0300-\u036f]/g, '') // xóa tất cả các dấu, tất cả đều nằm trong khối \u03xx UNICODE.
    .trim() // cắt bớt khoảng trắng ở đầu hoặc cuối
    .toLowerCase() // chuyển sang chữ thường
    .replace(/[^a-z0-9 -]/g, '') // xóa các ký tự không phải chữ và số
    .replace(/\s+/g, '-') // thay thế dấu cách bằng dấu gạch ngang
    .replace(/-+/g, '-') // xóa dấu gạch nối liên tiếp
}