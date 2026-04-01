import { BaseObjectType } from '../MultiplayerContext';

export interface BuffConfig {
    /* Типы сущностей, на которые может быть применен бафф */
    validEntityTypes: BaseObjectType[];
    /**
     *  Период срабатывания тика баффа
     *  @default BUFF_DEFAULT_TICK_INTERVAL_MS
     */
    tickIntervalMs?: number;
    /* Опции стакуемого баффа (по умолчанию - бафф не стакается) */
    stackOptions?: {
        /* Максимальный стак, если null - стакуется бесконечно */
        maxStack: number | null;
    };
    /* Опции таймера (по умолчанию - бафф автоматически не снимается) */
    timerOptions?: {
        /* Длительность в миллисекундах */
        durationMs: number;
    };
}