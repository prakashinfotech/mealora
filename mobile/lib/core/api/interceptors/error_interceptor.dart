import 'package:dio/dio.dart';
import '../api_exception.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final exception = _mapError(err);
    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        error: exception,
        message: exception.message,
        type: err.type,
        response: err.response,
      ),
    );
  }

  ApiException _mapError(DioException err) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const TimeoutException();

      case DioExceptionType.connectionError:
        final msg = err.message ?? err.error?.toString() ?? '';
        if (msg.toLowerCase().contains('refused') ||
            msg.toLowerCase().contains('connection refused')) {
          return const NetworkException(
            'Cannot connect to server. Make sure the dev server is running (npm run dev).',
          );
        }
        return const NetworkException('No internet connection. Please try again.');

      case DioExceptionType.badResponse:
        return _mapStatusCode(err);

      default:
        return const UnknownException();
    }
  }

  ApiException _mapStatusCode(DioException err) {
    final statusCode = err.response?.statusCode;
    // Try to extract the server's error message
    final data = err.response?.data;
    final serverMessage = data is Map<String, dynamic> ? data['error'] as String? : null;

    return switch (statusCode ?? 0) {
      401 => const UnauthorizedException(),
      403 => const ForbiddenException(),
      404 => NotFoundException(serverMessage ?? 'Not found.'),
      422 => ValidationException(serverMessage ?? 'Validation failed.'),
      >= 500 => ServerException(serverMessage ?? 'Server error.'),
      _ => UnknownException(serverMessage ?? 'An unexpected error occurred.'),
    };
  }
}
