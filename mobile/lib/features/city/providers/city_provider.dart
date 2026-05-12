import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

const kDefaultCity = 'Bangalore';
const kAvailableCities = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Ahmedabad',
];
const _kCityKey = 'selected_city';

// Pre-loaded in main() and overridden in ProviderScope — never constructed directly.
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('sharedPreferencesProvider must be overridden in main()');
});

class CityNotifier extends Notifier<String> {
  @override
  String build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    return prefs.getString(_kCityKey) ?? kDefaultCity;
  }

  void selectCity(String city) {
    if (state == city) return;
    state = city;
    ref.read(sharedPreferencesProvider).setString(_kCityKey, city);
  }
}

final cityProvider = NotifierProvider<CityNotifier, String>(CityNotifier.new);
