import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';
import 'interceptors/auth_interceptor.dart';
import 'interceptors/error_interceptor.dart';
import 'api_exception.dart';

/// Singleton Dio wrapper. All repositories receive this via Riverpod.
class ApiClient {
  ApiClient._(this._dio);

  final Dio _dio;

  factory ApiClient.create(FlutterSecureStorage storage) {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: AppConfig.connectTimeout,
        receiveTimeout: AppConfig.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        followRedirects: false,
        validateStatus: (status) => status != null && status < 500,
      ),
    );

    dio.interceptors.addAll([
      AuthInterceptor(storage),
      ErrorInterceptor(),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (o) => debugPrint(o.toString()),
      ),
    ]);

    return ApiClient._(dio);
  }

  Dio get dio => _dio;

  /// Unwraps the backend `{ success, data, error }` envelope.
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        path,
        queryParameters: queryParameters,
      );
      _assertSuccess(response);
      final data = (response.data as Map<String, dynamic>)['data'];
      return fromJson != null ? fromJson(data) : data as T;
    } on DioException catch (e) {
      throw _unwrapDioError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
    Options? options,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        path,
        data: data,
        options: options,
      );
      _assertSuccess(response);
      final responseData = (response.data as Map<String, dynamic>)['data'];
      return fromJson != null ? fromJson(responseData) : responseData as T;
    } on DioException catch (e) {
      throw _unwrapDioError(e);
    }
  }

  Future<T> patch<T>(
    String path, {
    dynamic data,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.patch<Map<String, dynamic>>(
        path,
        data: data,
      );
      _assertSuccess(response);
      final responseData = (response.data as Map<String, dynamic>)['data'];
      return fromJson != null ? fromJson(responseData) : responseData as T;
    } on DioException catch (e) {
      throw _unwrapDioError(e);
    }
  }

  /// Raw Dio for special cases (auth cookie extraction, form submissions).
  Future<Response<dynamic>> rawPost(
    String path, {
    dynamic data,
    Options? options,
  }) async {
    try {
      return await _dio.post<dynamic>(path, data: data, options: options);
    } on DioException catch (e) {
      throw _unwrapDioError(e);
    }
  }

  Future<Response<dynamic>> rawGet(String path) async {
    try {
      return await _dio.get<dynamic>(path);
    } on DioException catch (e) {
      throw _unwrapDioError(e);
    }
  }

  void _assertSuccess(Response<Map<String, dynamic>> response) {
    final body = response.data;
    if (body == null) throw const ServerException();
    final success = body['success'] as bool? ?? false;
    if (!success) {
      final error = body['error'] as String? ?? 'An error occurred.';
      final status = response.statusCode ?? 0;
      if (status == 422) throw ValidationException(error);
      if (status == 401) throw const UnauthorizedException();
      if (status == 404) throw NotFoundException(error);
      throw ServerException(error);
    }
  }

  ApiException _unwrapDioError(DioException e) {
    final err = e.error;
    if (err is ApiException) return err;
    return UnknownException(e.message ?? 'Unknown error.');
  }
}
