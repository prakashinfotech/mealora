import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/api/api_exception.dart';
import '../../../../core/config/app_config.dart';
import '../models/auth_models.dart';

class AuthRepository {
  AuthRepository(this._client, this._storage);

  final ApiClient _client;
  final FlutterSecureStorage _storage;

  static final _formOptions = Options(
    contentType: 'application/x-www-form-urlencoded',
  );

  // ─── Session ──────────────────────────────────────────────────────────────

  /// Returns the authenticated user if a valid session exists, otherwise null.
  Future<AuthUser?> getSession() async {
    final token = await _storage.read(key: AppConfig.sessionTokenKey);
    if (token == null) return null;

    try {
      final response = await _client.rawGet(ApiEndpoints.session);
      final data = response.data;
      if (data is! Map<String, dynamic> || !data.containsKey('user')) {
        return null;
      }
      return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    } on UnauthorizedException {
      await _clearToken();
      return null;
    } catch (_) {
      return null;
    }
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  Future<AuthUser> login(LoginInput input) async {
    // 1. Get CSRF token — NextAuth sets a csrf-token cookie that must be
    //    echoed back on the credentials POST for CSRF validation to pass.
    final csrfResponse = await _client.rawGet(ApiEndpoints.csrf);
    final csrfData = csrfResponse.data as Map<String, dynamic>;
    final csrfToken = csrfData['csrfToken'] as String;

    // Extract cookies from the CSRF response to forward on the POST
    final csrfCookieHeader = _buildCookieHeader(csrfResponse.headers.map);

    // 2. Submit credentials as URL-encoded form
    final body = input
        .toFormData(csrfToken)
        .entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final postOptions = Options(
      contentType: 'application/x-www-form-urlencoded',
      headers: csrfCookieHeader.isNotEmpty ? {'Cookie': csrfCookieHeader} : null,
    );

    final response = await _client.rawPost(
      ApiEndpoints.credentialsCallback,
      data: body,
      options: postOptions,
    );

    // NextAuth redirects to ?csrf=true on CSRF mismatch, or ?error= on bad creds
    final redirectLocation =
        response.headers.map['location']?.firstOrNull ?? '';
    if (redirectLocation.contains('csrf=true')) {
      throw const ValidationException('CSRF validation failed. Please try again.');
    }
    if (redirectLocation.contains('error=')) {
      throw const ValidationException('Invalid email or password.');
    }

    final status = response.statusCode ?? 0;
    if (status != 200 && status != 302) {
      throw const ValidationException('Invalid email or password.');
    }

    // 3. Persist session cookie
    final token = _extractSessionToken(response.headers.map);
    if (token == null) throw const ValidationException('Invalid email or password.');
    await _storage.write(key: AppConfig.sessionTokenKey, value: token);

    // 4. Return hydrated user
    final user = await getSession();
    if (user == null) throw const UnauthorizedException();
    return user;
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  Future<void> register(RegisterInput input) async {
    await _client.post<Map<String, dynamic>>(
      ApiEndpoints.register,
      data: input.toJson(),
    );
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  Future<void> logout() async {
    try {
      final csrfResponse = await _client.rawGet(ApiEndpoints.csrf);
      final csrfToken =
          (csrfResponse.data as Map<String, dynamic>)['csrfToken'] as String;
      await _client.rawPost(
        ApiEndpoints.signOut,
        data: 'csrfToken=${Uri.encodeComponent(csrfToken)}&callbackUrl=/',
        options: _formOptions,
      );
    } catch (_) {
      // Best-effort — always clear the local token regardless
    } finally {
      await _clearToken();
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  Future<void> _clearToken() =>
      _storage.delete(key: AppConfig.sessionTokenKey);

  String? _extractSessionToken(Map<String, List<String>> headers) {
    final cookies = headers['set-cookie'] ?? headers['Set-Cookie'] ?? [];
    for (final cookie in cookies) {
      if (cookie.contains('next-auth.session-token=')) {
        final token = cookie.split(';').first.split('=').skip(1).join('=');
        if (token.isNotEmpty) return token;
      }
    }
    return null;
  }

  /// Builds a Cookie header string from Set-Cookie response headers so that
  /// NextAuth cookies (csrf-token, callback-url) can be echoed back on the
  /// credentials POST — required for CSRF validation to pass.
  String _buildCookieHeader(Map<String, List<String>> headers) {
    final setCookies = headers['set-cookie'] ?? headers['Set-Cookie'] ?? [];
    return setCookies
        .map((c) => c.split(';').first) // strip path/httponly/etc.
        .join('; ');
  }
}
