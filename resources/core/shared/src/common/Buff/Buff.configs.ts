import { BuffType } from './BuffType.enum';
import type { BuffConfig } from './BuffConfig';
import { BaseObjectType } from '../MultiplayerContext';

export const BUFF_CONFIG_BY_TYPE = new Map<BuffType, BuffConfig>([
    [
        BuffType.Drunk,
        {
            validEntityTypes: [BaseObjectType.Player],
            timerOptions: {
                durationMs: 30_000,
            },
        },
    ],
    [
        BuffType.ArmorRegen,
        {
            validEntityTypes: [BaseObjectType.Player],
            tickIntervalMs: 3_000,
            stackOptions: {
                maxStack: null,
            },
        },
    ],
    [
        BuffType.Invisible,
        {
            validEntityTypes: [BaseObjectType.Player, BaseObjectType.Ped],
            timerOptions: {
                durationMs: 60_000,
            },
        },
    ],
    [
        BuffType.Burning,
        {
            validEntityTypes: [BaseObjectType.Player, BaseObjectType.Ped, BaseObjectType.Vehicle],
            timerOptions: {
                durationMs: 10_000,
            },
        },
    ],
    [
        BuffType.MedicalHelp,
        {
            validEntityTypes: [BaseObjectType.Player],
            tickIntervalMs: 10_000,
            stackOptions: {
                maxStack: null,
            },
        },
    ],
]);
