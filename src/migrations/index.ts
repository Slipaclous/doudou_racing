import * as migration_20261003_141131_initial from './20261003_141131_initial';
import * as migration_20261003_142006_partners_details from './20261003_142006_partners_details';
import * as migration_20261003_142734_pitch_image from './20261003_142734_pitch_image';
import * as migration_20261003_231144_stats_details from './20261003_231144_stats_details';
import * as migration_20261016_132903_theme_colors from './20261016_132903_theme_colors';
import * as migration_20261016_134154_theme_on_accent from './20261016_134154_theme_on_accent';
import * as migration_20261016_134509_theme_touch from './20261016_134509_theme_touch';
import * as migration_20261016_142009_partner_area from './20261016_142009_partner_area';
import * as migration_20261016_143123_race_registrations from './20261016_143123_race_registrations';

export const migrations = [
  {
    up: migration_20261003_141131_initial.up,
    down: migration_20261003_141131_initial.down,
    name: '20261003_141131_initial',
  },
  {
    up: migration_20261003_142006_partners_details.up,
    down: migration_20261003_142006_partners_details.down,
    name: '20261003_142006_partners_details',
  },
  {
    up: migration_20261003_142734_pitch_image.up,
    down: migration_20261003_142734_pitch_image.down,
    name: '20261003_142734_pitch_image',
  },
  {
    up: migration_20261003_231144_stats_details.up,
    down: migration_20261003_231144_stats_details.down,
    name: '20261003_231144_stats_details',
  },
  {
    up: migration_20261016_132903_theme_colors.up,
    down: migration_20261016_132903_theme_colors.down,
    name: '20261016_132903_theme_colors',
  },
  {
    up: migration_20261016_134154_theme_on_accent.up,
    down: migration_20261016_134154_theme_on_accent.down,
    name: '20261016_134154_theme_on_accent',
  },
  {
    up: migration_20261016_134509_theme_touch.up,
    down: migration_20261016_134509_theme_touch.down,
    name: '20261016_134509_theme_touch',
  },
  {
    up: migration_20261016_142009_partner_area.up,
    down: migration_20261016_142009_partner_area.down,
    name: '20261016_142009_partner_area',
  },
  {
    up: migration_20261016_143123_race_registrations.up,
    down: migration_20261016_143123_race_registrations.down,
    name: '20261016_143123_race_registrations'
  },
];
