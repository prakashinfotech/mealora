import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../models/address_model.dart';

class AddressRepository {
  const AddressRepository(this._client);
  final ApiClient _client;

  Future<List<Address>> getAddresses() => _client.get(
        ApiEndpoints.addresses,
        fromJson: (data) => (data as List<dynamic>)
            .map((e) => Address.fromJson(e as Map<String, dynamic>))
            .toList(),
      );

  Future<Address> createAddress(Map<String, dynamic> body) => _client.post(
        ApiEndpoints.addresses,
        data: body,
        fromJson: (data) => Address.fromJson(data as Map<String, dynamic>),
      );

  Future<void> setDefault(String id) =>
      _client.voidPatch(ApiEndpoints.addressById(id));

  Future<void> deleteAddress(String id) =>
      _client.delete(ApiEndpoints.addressById(id));
}
