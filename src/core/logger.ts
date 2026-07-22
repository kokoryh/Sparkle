import { toString } from '@/utils';

export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5,
}

export class Logger {
    private static level = LogLevel.ERROR;

    static setLevel(level: string): void {
        this.level = Number(level) || LogLevel[level.toUpperCase() as keyof typeof LogLevel] || LogLevel.ERROR;
    }

    static log(...messages: unknown[]): void {
        console.log(messages.map(msg => toString(msg)).join(' '));
    }

    static debug(...messages: unknown[]): void {
        if (this.level > LogLevel.DEBUG) return;
        this.log('[DEBUG]', ...messages);
    }

    static info(...messages: unknown[]): void {
        if (this.level > LogLevel.INFO) return;
        this.log('[INFO]', ...messages);
    }

    static warn(...messages: unknown[]): void {
        if (this.level > LogLevel.WARN) return;
        this.log('[WARN]', ...messages);
    }

    static error(...messages: unknown[]): void {
        if (this.level > LogLevel.ERROR) return;
        this.log('[ERROR]', ...messages);
    }
}
