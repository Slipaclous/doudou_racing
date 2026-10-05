import * as migration_20261003_141131_initial from './20261003_141131_initial';
import * as migration_20261003_142006_partners_details from './20261003_142006_partners_details';
import * as migration_20261003_142734_pitch_image from './20261003_142734_pitch_image';
import * as migration_20261003_231144_stats_details from './20261003_231144_stats_details';

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
    name: '20261003_231144_stats_details'
  },
];
