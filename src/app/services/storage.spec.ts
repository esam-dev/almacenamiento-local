import { Preferences } from '@capacitor/preferences';
import { describe, expect, it, vi } from 'vitest';

import { StorageService } from './storage';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    keys: vi.fn(),
  },
}));

describe('StorageService', () => {
  it('lists every stored key with its value', async () => {
    vi.mocked(Preferences.keys).mockResolvedValue({ keys: ['tema', 'usuario'] });
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: 'oscuro' }).mockResolvedValueOnce({ value: 'Elias' });

    const service = new StorageService();

    await expect(service.listar()).resolves.toEqual([
      { clave: 'tema', valor: 'oscuro' },
      { clave: 'usuario', valor: 'Elias' },
    ]);
  });
});
