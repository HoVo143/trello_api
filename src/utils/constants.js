//những domain được phép truy cập vào tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' //http này được phép truy cập vào tài nguyên
  // sau này sẽ deploy lên domain chính thức

  // không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường env.BUILD_MODE === 'dev'
  //sau này sẽ deploy lên domain chính thức

  'https://reactjs-vite-one.vercel.app' //domain chính thức
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}