export function toUint8Array(data: ArrayBuffer): Uint8Array {
    return new Uint8Array(data);
}

export function toArrayBuffer(data: Uint8Array): ArrayBuffer {
    return data.buffer.slice(data.byteOffset, data.byteLength + data.byteOffset) as ArrayBuffer;
}
