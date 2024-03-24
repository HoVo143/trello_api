//những domain được phép truy cập vào tài nguyên của server
export const WHITELIST_DOMAINS = [
  'http://localhost:5173' //http này được phép truy cập vào tài nguyên
  // sau này sẽ deploy lên domain chính thức
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}