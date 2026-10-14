class ApiResponse {
  constructor(statusCode, success, message, data, meta) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
  send(res) {
    let response = {};
    response.success = this.success;
    response.message = this.message;
    if (this.data) {
      response.data = this.data;
    }
    if (this.meta) {
      response.meta = this.meta;
    }
    return res.status(this.statusCode).json(response);
  }
}

export default ApiResponse;
