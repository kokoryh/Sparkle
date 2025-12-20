import { toString } from '@utils/index';
import { ExitError } from './process';

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
        this.level = Number(level) || LogLevel[level.toUpperCase()] || LogLevel.ERROR;
    }

    static log(...messages: any[]): void {
        console.log(messages.map(msg => toString(msg)).join(' '));
    }

    static debug(...messages: any[]): void {
        if (this.level > LogLevel.DEBUG) return;
        this.log('[DEBUG]', ...messages);
    }

    static info(...messages: any[]): void {
        if (this.level > LogLevel.INFO) return;
        this.log('[INFO]', ...messages);
    }

    static warn(...messages: any[]): void {
        if (this.level > LogLevel.WARN) return;
        this.log('[WARN]', ...messages);
    }

    static error(...messages: any[]): void {
        if (this.level > LogLevel.ERROR) return;

        const firstMessage = messages[0];
        if (firstMessage instanceof ExitError) {
            if (firstMessage.code !== 0) {
                this.error(firstMessage.toString());
            }
            return;
        }

        this.log('[ERROR]', ...messages);
    }
}
